import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import { fileURLToPath } from 'url';

console.log("start gen config");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cfgDir = path.join(__dirname, 'configs')
const dataDir = path.join(__dirname, 'src', 'js', 'config')

/**
 * type:
 *  - string
 *  - number
 *  - enum
 *  - type[]
 *  - Map<type, type>
 * 
 * <start>
 *   - identifier
 *     - []
 *       - <end>
 *   - <end>
 *   - Map
 *     - <
 *       - <start>
 *         ,
 *           - <start>
 *             - >
 */
class TypeLexer {
    /**
     * Parses a type string into a structured type object
     * @param {string} typeStr - The type string to parse (e.g., "string", "number[]", "Map<string, number>")
     * @returns {object} A structured representation of the type
     */
    static parse(typeStr) {
        if (!typeStr) {
            throw new Error('Type string cannot be empty');
        }
        
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
                return `Map<${TypeLexer.toTypeScriptType(typeObj.keyType)}, ${TypeLexer.toTypeScriptType(typeObj.valueType)}>`;
                
            case 'enum':
                return typeObj.enumName;
                
            case 'custom':
                return typeObj.typeName;
                
            default:
                throw new Error(`Unknown type: ${typeObj.type}`);
        }
    }
    
    /**
     * Converts a parsed type object to a JSDoc type string
     * @param {object} typeObj - The parsed type object
     * @returns {string} The JSDoc type string
     */
    static toJSDocType(typeObj) {
        switch (typeObj.type) {
            case 'string':
            case 'number':
            case 'boolean':
                return typeObj.type;
                
            case 'array':
                return `Array<${TypeLexer.toJSDocType(typeObj.elementType)}>`;
                
            case 'map':
                return `Map<${TypeLexer.toJSDocType(typeObj.keyType)}, ${TypeLexer.toJSDocType(typeObj.valueType)}>`;
                
            case 'enum':
                return typeObj.enumName;
                
            case 'custom':
                return typeObj.typeName;
                
            default:
                throw new Error(`Unknown type: ${typeObj.type}`);
        }
    }
}

const enumTypes = {};

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
    const wbTypes = [];
    const entryType = [
        {
            name: "id",
            type: {

            }
        }
    ];
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
            }            entryTypeDef.name = fieldName;
            if (fieldType.startsWith("Enum:")) {
                entryTypeDef.type = {
                    type: "string",
                    enumName: fieldType.substring(5),
                }
            } else {
                try {
                    entryTypeDef.type = TypeLexer.parse(fieldType);
                } catch (error) {
                    console.error(`Error parsing type for ${fieldName}: ${error.message}`);
                    entryTypeDef.type = { type: 'string' }; // Default to string on error
                }
            }

            console.log(`file: ${file}, sheet: ${sheetName}, field: ${fieldName}, type: ${fieldType}, meta: ${fieldMeta}`);
              }
    }

    // Generate type definition for the Excel sheet
    const typeDefs = entryType.filter(et => et.name && et.type).map(et => {
        return `    ${et.name}: ${TypeLexer.toTypeScriptType(et.type)}`;
    });

    // Generate interface
    let interfaceName = `${parsed.name}Entry`;
    let interfaceContent = `export interface ${interfaceName} {\n${typeDefs.join(';\n')};\n}\n\n`;
    
    // Generate type definition file
    const typeFilePath = path.join(dataDir, `${parsed.name}.d.ts`);
    fs.writeFileSync(typeFilePath, interfaceContent);
    
    // Generate JS file to export the data
    const jsContent = `// Auto-generated from ${file}
export const ${parsed.name} = [];
`;
    const jsFilePath = path.join(dataDir, `${parsed.name}.js`);
    fs.writeFileSync(jsFilePath, jsContent);
    
    console.log(`Generated type definition for ${parsed.name}`);

    const module = await import(`./src/js/config/${parsed.name}.js`);
    const config = module[parsed.name];

    const exportsById = `${parsed.name}ById`;
    const idType = `${parsed.name}Id`;
    const dupIdCheck = new Set();
    for (const entry of config) {
        if (dupIdCheck.has(entry.id)) {
            throw new Error(`Duplicate id found: ${entry.id} in ${file}`);
        }
        dupIdCheck.add(entry.id);
    }
    let sb = `// This file is auto-generated. Do not edit manually.
import { ${parsed.name} } from '../config/${parsed.name}.js';

/**
 * @typedef {${Array.from(dupIdCheck.values()).map(e=>'"' + e + '"').join(" | ")}} ${idType}
 */

const ${exportsById} = /**@type {Record<${idType}, ElementTypeOf<typeof import("../config/${parsed.name}.js").${parsed.name}>>} */({});
for (const entry of ${parsed.name}) {
    ${exportsById}[/**@type {${idType}}*/(entry.id)] = entry;
}

export { ${exportsById} };
`;

    const outPath = path.join(dataDir, '..', 'configData', `${parsed.name}.js`);
    fs.writeFileSync(outPath, sb);
}
