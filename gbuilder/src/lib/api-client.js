const BASE = "/api";

async function request(method, path, body) {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json();
}

export function getProject() {
    return request("GET", "/project");
}

export function getTables() {
    return request("GET", "/tables");
}

export function getTable(name) {
    return request("GET", `/tables/${name}`);
}

export async function getRow(tableName, pkValue, pkField) {
    const table = await getTable(tableName);
    const pk = pkField || table.columns[0]?.name || "id";
    const row = table.rows.find(r => String(r[pk]) === String(pkValue));
    return { columns: table.columns, row };
}

export function updateRow(tableName, id, row) {
    return request("PATCH", `/tables/${tableName}/${id}`, { row });
}

export function addRow(tableName, row) {
    return request("POST", `/tables/${tableName}`, { row });
}

export function deleteRow(tableName, id) {
    return request("DELETE", `/tables/${tableName}/${id}`);
}

export function resolveFK(table, ids) {
    return request("POST", "/resolve-fk", { table, ids });
}

export function searchFK(table, query) {
    return request("GET", `/fk/search/${encodeURIComponent(table)}?q=${encodeURIComponent(query)}`);
}

export function getConfig() {
    return request("GET", "/config");
}

export function pickFolder() {
    return request("GET", "/pick-folder");
}

export function listImages(dir) {
    return request("GET", `/images?dir=${encodeURIComponent(dir)}`);
}

export function removeRecentWorkspace(path) {
    return request("DELETE", "/config/recent", { path });
}

export function findEnumRefs(enumName) {
    return request("GET", `/references/enum/${encodeURIComponent(enumName)}`);
}

export function findFKRefs(table, id) {
    return request("GET", `/references/fk/${encodeURIComponent(table)}/${encodeURIComponent(id)}`);
}

export function createProject(path, name) {
    return request("POST", "/project/create", { path, name });
}

export function openProject(path) {
    return request("POST", "/project/open", { path });
}

export function saveSchema(project) {
    return request("PUT", "/schema", project);
}

export function addTable(name, columns) {
    return request("POST", "/schema/tables", { name, columns });
}

export function updateTable(name, updates) {
    return request("PUT", `/schema/tables/${name}`, updates);
}

export function renameTable(oldName, newName) {
    return request("PATCH", `/schema/tables/${oldName}/rename`, { newName });
}

export function deleteTable(name) {
    return request("DELETE", `/schema/tables/${name}`);
}

export function addEnum(name, values) {
    return request("POST", "/schema/enums", { name, values });
}

export function updateEnum(name, values) {
    return request("PUT", `/schema/enums/${name}`, { values });
}

export function deleteEnum(name) {
    return request("DELETE", `/schema/enums/${name}`);
}

export function validate() {
    return request("GET", "/validate");
}

export function exportTable(name) {
    return request("GET", `/export/${name}`);
}
