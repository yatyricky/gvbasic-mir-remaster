import fs from 'fs'
import path from 'path'

console.log("start gen iden");

const __dirname = path.resolve()
const cfgDir = path.join(__dirname, 'src', 'js', 'configRaw')

for (const file of fs.readdirSync(cfgDir)) {
    if (!file.endsWith('.js')) {
        continue
    }

    const parsed = path.parse(file)
    const module = await import(`./src/js/configRaw/${file}`)
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
import { ${parsed.name} } from '../configRaw/${file}';

/**
 * @typedef {${Array.from(dupIdCheck.values()).map(e=>'"' + e + '"').join(" | ")}} ${idType}
 */

const ${exportsById} = /**@type {Record<${idType}, ElementTypeOf<typeof import("../configRaw/${parsed.name}.js").${parsed.name}>>} */({});
for (const entry of ${parsed.name}) {
    ${exportsById}[/**@type {${idType}}*/(entry.id)] = entry;
}

export { ${exportsById} };
`;

    const outPath = path.join(path.dirname(cfgDir), "configData", `${parsed.name}.js`)
    fs.writeFileSync(outPath, sb);
}
