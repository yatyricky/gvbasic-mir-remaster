import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..');
const configsDir = path.join(rootDir, 'configs');
const helperDir = path.join(rootDir, 'helper_cfgs');
const dataOutDir = path.join(__dirname, '..', 'example', 'data');
const projectOutPath = path.join(__dirname, '..', 'example', 'project.json');

// --- Utility functions matching gen_config.js ---

function strIsEmpty(str) {
    return str == null || typeof str !== 'string' || str.trim().length === 0;
}

function restoreTemplateString(str) {
    if (strIsEmpty(str)) return str;
    if (!str.match(/^.+\/.+\/.$/)) return str;
    if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length !== 3) throw new Error(`Invalid template string: ${str}`);
        const [template, args, splitter] = parts;
        const argsArr = args.includes(',') ? args.split(',') : args.split('');
        return argsArr.map(arg => template.replace(/\$/g, arg)).join(splitter);
    }
    return str;
}

function strTemplate(str) {
    if (strIsEmpty(str)) return str;
    if (!str.includes('[')) return restoreTemplateString(str);
    return str.replace(/\[([^\]]+)\]/g, (_, p) => restoreTemplateString(p));
}

// --- TypeLexer (subset needed for JSON conversion) ---

const splitters = [',', ':', ';', '|', '#'];

function parseType(typeStr) {
    if (typeStr == null || typeStr.trim() === '') throw new Error('Type string cannot be empty');
    typeStr = typeStr.trim();

    if (typeStr.endsWith('[]')) {
        return { type: 'array', elementType: parseType(typeStr.slice(0, -2)) };
    }
    if (typeStr.startsWith('Map<')) {
        if (!typeStr.endsWith('>')) throw new Error(`Invalid Map type: ${typeStr}`);
        const genericArgs = extractGenericArgs(typeStr.slice(4, -1));
        if (genericArgs.length !== 2) throw new Error(`Map requires 2 args in "${typeStr}"`);
        return { type: 'map', keyType: parseType(genericArgs[0]), valueType: parseType(genericArgs[1]) };
    }
    if (typeStr.startsWith('Enum:')) return { type: 'enum', enumName: typeStr.slice(5) };
    if (typeStr.startsWith('js:')) return { type: 'js', jsTypeName: typeStr.slice(3) };
    if (typeStr === 'string' || typeStr === 'number' || typeStr === 'boolean') return { type: typeStr };
    return { type: 'custom', typeName: typeStr };
}

function extractGenericArgs(argsStr) {
    argsStr = argsStr.trim();
    const args = [];
    let current = '';
    let depth = 0;
    for (const char of argsStr) {
        if (char === '<') { depth++; current += char; }
        else if (char === '>') { depth--; current += char; }
        else if (char === ',' && depth === 0) { args.push(current.trim()); current = ''; }
        else { current += char; }
    }
    if (current.trim()) args.push(current.trim());
    return args;
}

function measureTypeDepth(typeObj) {
    switch (typeObj.type) {
        case 'array': return 1 + measureTypeDepth(typeObj.elementType);
        case 'map': return 2 + measureTypeDepth(typeObj.keyType) + measureTypeDepth(typeObj.valueType);
        case 'custom': case 'enum': case 'number': case 'string': case 'boolean': case 'js': return 0;
        default: throw new Error(`Unknown type: ${typeObj.type}`);
    }
}

function trySplit(str, depth) {
    if (typeof str === 'number') str = str.toString();
    return str.split(splitters[depth - 1]);
}

/**
 * Convert a cell value to a JSON-compatible value based on its parsed type.
 */
function toJsonValue(typeObj, cell) {
    if (cell == null) return null;
    if (typeof cell === 'string') cell = cell.trim();
    if (cell === '' || cell === 'null') return null;

    switch (typeObj.type) {
        case 'string':
        case 'enum':
        case 'custom':
            return String(cell);

        case 'number':
        case 'js':
            return typeof cell === 'number' ? cell : Number(cell);

        case 'boolean':
            if (typeof cell === 'boolean') return cell;
            if (typeof cell === 'string') return cell.toLowerCase() === 'true';
            return Boolean(cell);

        case 'map': {
            const depth = measureTypeDepth(typeObj);
            const entries = trySplit(cell, depth);
            const obj = {};
            for (const entry of entries) {
                const kvs = trySplit(entry, depth - 1);
                if (kvs.length !== 2) throw new Error(`Invalid map entry: ${entry}`);
                const key = toJsonValue(typeObj.keyType, kvs[0]);
                const val = toJsonValue(typeObj.valueType, kvs[1]);
                obj[key] = val;
            }
            return obj;
        }

        case 'array': {
            const depth = measureTypeDepth(typeObj);
            return trySplit(cell, depth).map(item => toJsonValue(typeObj.elementType, item));
        }

        default:
            return String(cell);
    }
}

/**
 * Convert a type object back to a schema type string for project.json.
 * js: types become "string" per requirements.
 */
function typeToSchemaString(typeObj) {
    switch (typeObj.type) {
        case 'string': return 'string';
        case 'number': return 'number';
        case 'boolean': return 'boolean';
        case 'js': return 'string';
        case 'enum': return `Enum:${typeObj.enumName}`;
        case 'custom': return typeObj.typeName;
        case 'array': return `${typeToSchemaString(typeObj.elementType)}[]`;
        case 'map': return `Map<${typeToSchemaString(typeObj.keyType)}, ${typeToSchemaString(typeObj.valueType)}>`;
        default: return 'string';
    }
}

// --- Main processing ---

fs.mkdirSync(dataOutDir, { recursive: true });

const project = {
    name: 'Generated Config',
    dataDir: './data',
    tables: {},
    enums: {}
};

// Process config xlsx files
const configFiles = fs.readdirSync(configsDir).filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));

for (const file of configFiles) {
    const parsed = path.parse(file);
    const name = parsed.name;
    console.log(`Processing ${file}...`);

    const wb = xlsx.readFile(path.join(configsDir, file));
    const ws = wb.Sheets[wb.SheetNames[0]];
    const range = xlsx.utils.decode_range(ws['!ref']);

    // Parse column definitions from rows 0-2
    const columns = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
        const fieldName = ws[xlsx.utils.encode_cell({ r: 0, c })]?.v;
        if (fieldName == null) continue;
        const fieldTypeStr = ws[xlsx.utils.encode_cell({ r: 1, c })]?.v ?? 'string';
        const fieldMeta = ws[xlsx.utils.encode_cell({ r: 2, c })]?.v ?? '';
        const meta = fieldMeta.split(' ').filter(e => !strIsEmpty(e)).map(m => m.trim());
        const typeObj = parseType(fieldTypeStr);

        columns.push({
            name: fieldName,
            rawType: fieldTypeStr,
            typeObj,
            meta,
            enumValues: new Set()
        });
    }

    // Collect enum values from data rows
    for (let r = 4; r <= range.e.r; r++) {
        for (const col of columns) {
            const c = columns.indexOf(col);
            const cellVal = ws[xlsx.utils.encode_cell({ r, c })]?.v;
            if (strIsEmpty(cellVal)) continue;

            if (col.typeObj.type === 'enum') {
                col.enumValues.add(String(cellVal));
            } else if (col.typeObj.type === 'array' && col.typeObj.elementType.type === 'enum') {
                for (const e of String(cellVal).split(',')) {
                    col.enumValues.add(e.trim());
                }
            }
        }
    }

    // Parse data rows
    const data = [];
    for (let r = 4; r <= range.e.r; r++) {
        const firstCell = ws[xlsx.utils.encode_cell({ r, c: 0 })]?.v;
        if (firstCell == null) continue;

        const row = {};
        for (let ci = 0; ci < columns.length; ci++) {
            const col = columns[ci];
            const rawVal = strTemplate(ws[xlsx.utils.encode_cell({ r, c: ci })]?.v);
            row[col.name] = toJsonValue(col.typeObj, rawVal);
        }
        data.push(row);
    }

    // Write data JSON
    const dataOutPath = path.join(dataOutDir, `${name}.json`);
    fs.writeFileSync(dataOutPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  -> ${dataOutPath} (${data.length} rows)`);

    // Find primary key and display field
    const indexCol = columns.find(c => c.meta.includes('Index'));
    const primaryKey = indexCol ? indexCol.name : columns[0]?.name;
    const displayField = columns.find(c => c.name === 'name')?.name || primaryKey;

    // Build table schema for project.json
    const tableSchema = {
        file: `${name}.json`,
        primaryKey,
        displayField,
        columns: columns.map(col => {
            const entry = {
                name: col.name,
                type: typeToSchemaString(col.typeObj)
            };
            if (col.meta.length > 0) entry.meta = col.meta;
            return entry;
        })
    };
    project.tables[name] = tableSchema;

    // Collect enums
    for (const col of columns) {
        if (col.typeObj.type === 'enum' && col.enumValues.size > 0) {
            project.enums[col.typeObj.enumName] = Array.from(col.enumValues);
        }
        if (col.typeObj.type === 'array' && col.typeObj.elementType.type === 'enum' && col.enumValues.size > 0) {
            project.enums[col.typeObj.elementType.enumName] = Array.from(col.enumValues);
        }
    }
}

// Process helper_cfgs/affix_map_att.xlsx
console.log('Processing affix_map_att.xlsx...');
const affixWb = xlsx.readFile(path.join(helperDir, 'affix_map_att.xlsx'));
const affixWs = affixWb.Sheets[affixWb.SheetNames[0]];
const affixRange = xlsx.utils.decode_range(affixWs['!ref']);

// Row 0 = column headers (item type names), column 0 = affix IDs
const itemTypeNames = [];
for (let c = 1; c <= affixRange.e.c; c++) {
    const cell = affixWs[xlsx.utils.encode_cell({ r: 0, c })];
    if (cell?.v) itemTypeNames.push(cell.v);
}

const affixMapData = [];
for (let r = 1; r <= affixRange.e.r; r++) {
    const affixIdCell = affixWs[xlsx.utils.encode_cell({ r, c: 0 })];
    if (!affixIdCell?.v) continue;
    const affixId = affixIdCell.v;
    const itemTypes = [];
    for (let c = 1; c <= affixRange.e.c; c++) {
        const cell = affixWs[xlsx.utils.encode_cell({ r, c })];
        if (cell && cell.v) {
            itemTypes.push(itemTypeNames[c - 1]);
        }
    }
    affixMapData.push({ affixId, itemTypes });
}

const affixMapOutPath = path.join(dataOutDir, 'affix_map_att.json');
fs.writeFileSync(affixMapOutPath, JSON.stringify(affixMapData, null, 2), 'utf8');
console.log(`  -> ${affixMapOutPath} (${affixMapData.length} rows)`);

// Write project.json
fs.writeFileSync(projectOutPath, JSON.stringify(project, null, 2), 'utf8');
console.log(`\nProject written to ${projectOutPath}`);
console.log(`Tables: ${Object.keys(project.tables).join(', ')}`);
console.log(`Enums: ${Object.keys(project.enums).join(', ')}`);
console.log('Done.');
