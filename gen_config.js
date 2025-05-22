import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import { fileURLToPath } from 'url';

console.log("start gen config");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cfgDir = path.join(__dirname, 'configs')
const dataDir = path.join(__dirname, 'src', 'js', 'config')

class Utils {
    static strIsEmpty(str) {
        return str == null || str.trim().length === 0;
    }

    /**
     * 
     * @param {string} str 
     * @returns 
     */
    static strCapitalizeFirst(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
}

const enumTypes = {};

class TypeLexer {
    /**
     * Parses a type string into a structured type object
     * @param {string} typeStr - The type string to parse (e.g., "string", "number[]", "Map<string, number>")
     * @returns {object} A structured representation of the type
     */
    static parse(typeStr) {
        if (typeStr == null || typeStr.trim() === '') {
            throw new Error('Type string cannot be empty');
        }

        typeStr = typeStr.trim();

        // Handle array types (e.g., "string[]", "number[]", "CustomType[]")
        if (typeStr.endsWith('[]')) {
            const elementType = TypeLexer.parse(typeStr.slice(0, -2));
            return {
                type: 'array',
                elementType
            };
        }

        // Handle Map types (e.g., "Map<string, number>", "Map<CustomType, string[]>")
        if (typeStr.startsWith('Map<')) {
            if (!typeStr.endsWith('>')) {
                throw new Error(`Invalid Map type: ${typeStr}`);
            }

            // Extract the generic arguments
            const genericArgs = TypeLexer._extractGenericArgs(typeStr.slice(4, -1));

            if (genericArgs.length !== 2) {
                throw new Error(`Map requires exactly 2 type arguments, got ${genericArgs.length} in "${typeStr}"`);
            }

            return {
                type: 'map',
                keyType: TypeLexer.parse(genericArgs[0]),
                valueType: TypeLexer.parse(genericArgs[1])
            };
        }

        // Handle Enum types (e.g., "Enum:ItemType")
        if (typeStr.startsWith('Enum:')) {
            const enumName = typeStr.slice(5);
            return {
                type: 'enum',
                enumName
            };
        }

        if (typeStr.startsWith("js:")) {
            const jsTypeName = typeStr.slice(3);
            return {
                type: "js",
                jsTypeName,
            }
        }

        // Handle primitive types
        if (typeStr === 'string' || typeStr === 'number' || typeStr === 'boolean') {
            return {
                type: typeStr
            };
        }

        // Handle custom types (assume they're identifiers)
        return {
            type: 'custom',
            typeName: typeStr
        };
    }

    /**
     * Extracts generic arguments from a type parameter string, handling nested generics
     * @param {string} argsStr - The string containing generic arguments (e.g., "string, number[]")
     * @returns {string[]} An array of type argument strings
     * @private
     */
    static _extractGenericArgs(argsStr) {
        argsStr = argsStr.trim();
        const args = [];
        let currentArg = '';
        let depth = 0;

        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];

            if (char === '<') {
                depth++;
                currentArg += char;
            } else if (char === '>') {
                depth--;
                currentArg += char;
            } else if (char === ',' && depth === 0) {
                args.push(currentArg.trim());
                currentArg = '';
            } else {
                currentArg += char;
            }
        }

        if (currentArg.trim()) {
            args.push(currentArg.trim());
        }

        return args;
    }

    /**
     * Converts a parsed type object to a TypeScript type string
     * @param {object} typeObj - The parsed type object
     * @returns {string} The TypeScript type string
     */
    static toTypeScriptType(typeObj) {
        switch (typeObj.type) {
            case 'string':
            case 'number':
            case 'boolean':
                return typeObj.type;

            case 'array':
                return `${TypeLexer.toTypeScriptType(typeObj.elementType)}[]`;

            case 'map':
                return `Partial<Record<${TypeLexer.toTypeScriptType(typeObj.keyType)}, ${TypeLexer.toTypeScriptType(typeObj.valueType)}>>`;

            case 'enum':
                return typeObj.enumName;

            case 'custom':
                return typeObj.typeName;

            case "js":
                return typeObj.jsTypeName;

            default:
                throw new Error(`Unknown type: ${typeObj.type}`);
        }
    }

    static splitters = [",", ":", ";", "|", "#"];

    static trySplit(str, depth) {
        const splitter = TypeLexer.splitters[depth - 1];
        if (typeof str === "number") {
            str = str.toString();
        }
        return str.split(splitter);
    }

    static measureTypeDepth(typeObj) {
        let depth = 0;
        switch (typeObj.type) {
            case 'array':
                depth = 1 + TypeLexer.measureTypeDepth(typeObj.elementType);
                break;
            case 'map':
                depth = 2 + TypeLexer.measureTypeDepth(typeObj.keyType) + TypeLexer.measureTypeDepth(typeObj.valueType);
                break;
            case 'custom':
            case 'enum':
            case 'number':
            case 'js':
                depth = 0;
                break;
            default:
                throw new Error(`Unknown type: ${typeObj.type}`);
        }
        return depth;
    }

    static toJs(typeObj, cell) {
        if (cell == null) {
            return null;
        }
        if (typeof cell === "string") {
            cell = cell.trim();
        }
        switch (typeObj.type) {
            case "string":
            case "enum":
                return `"${cell}"`;

            case "number":
            case "js":
                return cell;

            case "map":
                const depths = TypeLexer.measureTypeDepth(typeObj);
                const entries = TypeLexer.trySplit(cell, depths);
                const subs = [];
                for (const entry of entries) {
                    const kvs = TypeLexer.trySplit(entry, depths - 1);
                    if (kvs.length !== 2) {
                        throw new Error("@@#@#@#@#");
                    }
                    subs.push(`[${TypeLexer.toJs(typeObj.keyType, kvs[0])}]: ${TypeLexer.toJs(typeObj.valueType, kvs[1])}`);
                }
                return `{ ${subs.join(", ")} }`;

            case "array":
                const arrDepths = TypeLexer.measureTypeDepth(typeObj);
                return `[${TypeLexer.trySplit(cell, arrDepths).map(item => TypeLexer.toJs(typeObj.elementType, item)).join(", ")}]`;

            case "custom":
                if (enumTypes[typeObj.typeName]) {
                    return `"${cell}"`;
                } else {
                    return `'NotImplemented ${JSON.stringify(typeObj)}>>${cell}'`;
                }

            default:
                return `'NotImplemented ${JSON.stringify(typeObj)}>>${cell}'`;
        }
    }
}

const allData = {};

for (const file of fs.readdirSync(cfgDir)) {
    if (!file.endsWith('.xlsx')) {
        continue
    }

    if (file.startsWith('~$')) {
        // skip temp files
        continue
    }

    const parsed = path.parse(file)
    const wb = xlsx.readFile(path.join(cfgDir, file))
    const entryType = [];
    const rows = [];
    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const range = xlsx.utils.decode_range(ws['!ref'])
        // decode types
        for (let c = range.s.c; c <= range.e.c; c++) {
            const fieldName = ws[xlsx.utils.encode_cell({ r: 0, c })].v;
            const fieldType = ws[xlsx.utils.encode_cell({ r: 1, c })].v;
            const fieldMeta = ws[xlsx.utils.encode_cell({ r: 2, c })]?.v ?? "";
            let entryTypeDef = entryType.find(e => e.name === fieldName);
            if (!entryTypeDef) {
                entryTypeDef = {};
                entryType.push(entryTypeDef);
            }
            entryTypeDef.name = fieldName;
            entryTypeDef.type = TypeLexer.parse(fieldType);
            entryTypeDef.dtsType = TypeLexer.toTypeScriptType(entryTypeDef.type);
            entryTypeDef.meta = fieldMeta.split(' ').filter(e => !Utils.strIsEmpty(e)).map(m => m.trim());

            if (entryTypeDef.type.type === 'enum') {
                if (entryTypeDef.enumValues == null) {
                    entryTypeDef.enumValues = new Set();
                }
                for (let r = 4; r <= range.e.r; r++) {
                    const enumValue = ws[xlsx.utils.encode_cell({ r, c })]?.v;
                    if (Utils.strIsEmpty(enumValue)) {
                        continue;
                    }
                    entryTypeDef.enumValues.add(enumValue);
                }
                enumTypes[entryTypeDef.dtsType] = entryTypeDef;
            }
        }

        for (let r = 4; r <= range.e.r; r++) {
            const row = []
            for (let c = 0; c <= range.e.c; c++) {
                const cell = ws[xlsx.utils.encode_cell({ r, c })]?.v;
                row.push(cell);
            }
            rows.push(row);
        }
    }

    // .d.ts
    let dts = `declare global {\n`;
    for (const e of entryType) {
        if (e.type.type === 'enum') {
            dts += `    type ${e.type.enumName} = ${Array.from(e.enumValues).map(v => `"${v}"`).join(' | ')};\n`;
        }
        // sb += `    ${e.name}: ${TypeLexer.toTypeScriptType(e.type)};\n`;
    }

    const configTypeName = `I${parsed.name}Config`;

    dts += `    interface ${configTypeName} {\n`;

    for (const e of entryType) {
        dts += `        ${e.name}: ${e.dtsType};\n`;
    }

    dts += `    }\n`;
    dts += `}\n`;

    const dtsExports = [];
    const configArrayName = `${parsed.name}s`;
    dts += `declare const ${configArrayName}: Array<${configTypeName}>;\n`;
    dtsExports.push(configArrayName)

    for (let i = 0; i < entryType.length; i++) {
        const e = entryType[i];
        if (e.meta.includes("Index")) {
            // dup check
            if (new Set(rows.map(row => row[i])).size !== rows.length) {
                throw new Error(`Duplicate index ${e.name} in ${parsed.name}`);
            }

            const queryName = `${parsed.name}By${Utils.strCapitalizeFirst(e.name)}`;
            dts += `declare const ${queryName}: Partial<Record<${e.dtsType}, ${configTypeName}>>;\n`;
            dtsExports.push(queryName)
        }
    }

    dts += `export { ${dtsExports.join(", ")} }\n`;
    const dtsOutPath = path.join(dataDir, `${parsed.name}.d.ts`);
    fs.writeFileSync(dtsOutPath, dts);

    allData[parsed.name] = {
        rows,
        configArrayName,
        entryType
    };
}

// .js
for (const [name, payload] of Object.entries(allData)) {
    const { rows, configArrayName, entryType } = payload;
    let js = `export const ${configArrayName} = [\n`;
    for (const row of rows) {
        const fields = [];
        for (let i = 0; i < entryType.length; i++) {
            const val = TypeLexer.toJs(entryType[i].type, row[i]);
            if (val != null) {
                fields.push(`${entryType[i].name}: ${val}`);
            }
        }
        js += `    { ${fields.join(", ")} },\n`;
    }
    js += `]\n\n`;

    for (const typeObj of entryType) {
        if (typeObj.meta.includes("Index")) {
            const queryName = `${name}By${Utils.strCapitalizeFirst(typeObj.name)}`;
            js += `export const ${queryName} = Object.fromEntries(${configArrayName}.map(e => [e.${typeObj.name}, e]))\n`;
        }
    }

    const jsOutPath = path.join(dataDir, `${name}.js`);
    fs.writeFileSync(jsOutPath, js);
}
