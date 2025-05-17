import fs from 'fs'
import path from 'path'

console.log("start gen iden");

const __dirname = path.resolve()
const cfgDir = path.join(__dirname, 'src', 'js', 'configData')

for (const file of fs.readdirSync(cfgDir)) {
    if (!file.endsWith('.js')) {
        continue
    }

    if (file.endsWith('Iden.js')) {
        continue
    }

    const parsed = path.parse(file)
    const module = await import(`./src/js/configData/${file}`)
    const config = module[parsed.name];
    if (config[0].iden == null) {
        continue;
    }
    const exportsName = `${parsed.name}Iden`;
    let sb = `export const ${exportsName} = {};\n`;
    const dupCheck = new Set();
    for (const entry of config) {
        if (dupCheck.has(entry.iden)) {
            throw new Error(`Duplicate iden found: ${entry.iden}`);
        }
        dupCheck.add(entry.iden);
        sb += `${exportsName}.${entry.iden} = ${entry.id};\n`;
    }

    const outName = `${parsed.name}Iden.js`
    const parentDir = path.dirname(cfgDir);
    const outPath = path.join(parentDir, "configIden", outName)
    fs.writeFileSync(outPath, sb);
}
