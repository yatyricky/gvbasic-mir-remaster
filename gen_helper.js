import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import { fileURLToPath } from 'url';

console.log("start gen helper");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fp_affix_map_att = path.join(__dirname, 'helper_cfgs', 'affix_map_att.xlsx');
const fp_affix = path.join(__dirname, 'configs', 'Affix.xlsx');

const wb = xlsx.readFile(fp_affix_map_att);
const ws = wb.Sheets[wb.SheetNames[0]];
const range = xlsx.utils.decode_range(ws['!ref']);
const itemTypeNames = [];
for (let c = 0; c <= range.e.c; c++) {
    const cell = ws[xlsx.utils.encode_cell({ r: 0, c })];
    itemTypeNames.push(cell.v);
}
const result = {};
for (let r = 1; r <= range.e.r; r++) {
    const affixId = ws[xlsx.utils.encode_cell({ r, c: 0 })].v;
    result[affixId] = [];
    for (let c = 1; c <= range.e.c; c++) {
        const cell = ws[xlsx.utils.encode_cell({ r, c })];
        if (cell && cell.v) {
            result[affixId].push(itemTypeNames[c]);
        }
    }
}

const affixWb = xlsx.readFile(fp_affix);
const affixWs = affixWb.Sheets[affixWb.SheetNames[0]];
const affixRange = xlsx.utils.decode_range(affixWs['!ref']);
let sb = "";
for (let r = 4; r <= affixRange.e.r; r++) {
    const affixId = affixWs[xlsx.utils.encode_cell({ r, c: 0 })].v;
    if (result[affixId]) {
        sb += result[affixId].join(',') + '\n';
    } else {
        sb += '\n';
    }
}

const outputFilePath = path.join(__dirname, 'helper_cfgs', 'affix_map_att.txt');
fs.writeFileSync(outputFilePath, sb.trim(), 'utf8');
