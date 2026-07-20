# Odin: 基于 Decorator 的游戏配置工具

## 核心理念

用 TS class + decorator 替代 gbuilder 的 `project.json` 来定义配置 schema。
Class 文件 = Schema 定义（可编程），JSON 文件 = 数据存储（兼容现有），Svelte 前端复用。

```typescript
@Table({ displayName: "物品", displayTemplate: "{name}({id})" })
class Item {
  @Column({ type: "string" }) @Index()   id: string;
  @Column({ type: "string" }) @Required() name: string;
  @Column({ type: "number" }) @Range(1, 999) level: number;
  @Column({ type: "Enum:ItemType" }) type: string;
  @Column({ type: "FK:Affix[]" }) randomAffix: string[];
  @Validate(function() { return this.level >= this.reqLevel; }, "等级 >= 需求等级")
  reqLevel: number;
}
```

---

## 架构

### 数据流

```
schemas/Item.ts (用户用 IDE 编写)
       │
       ▼ chokidar 监听 + esbuild 编译 + dynamic import
       │
  Schema Descriptor (内存中的 JSON，格式兼容 project.json)
       │
       ├──→ Server API (Express) ──→ File I/O (data/*.json)
       │         │
       │         └──→ Validator (FK + enum + decorator rules)
       │
       └──→ Svelte Frontend (复用 gbuilder 的 Grid/Inspector/Sidebar/Editors)
```

### 关键设计决策

1. **Schema 输出格式兼容 project.json** — `{ tables: { X: { columns, primaryKey, displayField, _validators } }, enums: {...} }` 格式不变，前端组件几乎零改动
2. **`reflect-metadata`** 存储 decorator 元数据，esbuild 编译 TS → JS，dynamic import 提取
3. **自定义 `@Validate` 函数** 存于内存 registry，不可序列化但服务器直接持有引用
4. **热重载**: chokidar 监听 schemas/ 目录变化 → 自动重编译 → 前端轮询 compile-status

### 与 gbuilder 的差异

| | gbuilder | Odin |
|---|---|---|
| Schema 定义 | project.json (JSON) | TS class + decorator |
| Schema 编辑 | 可视化 SchemaEditor | IDE (VS Code) |
| 校验 | 硬编码 (FK + PK + Enum) | Decorator 驱动 + FK/PK/Enum |
| 可编程 | 无 | 任意 JS 表达式 |
| 代码生成 | 无 | Class 本身就是类型定义 |
| 前端组件 | — | 复用 (Vite alias) |
| 数据文件 | JSON | JSON (兼容) |

---

## 实现计划

### P0 — 核心编译链 (无此不可用)

1. **`odin/shared/metadata-keys.ts`** — Symbol 常量定义 (TABLE, COLUMNS, REQUIRED, RANGE 等)
2. **`odin/shared/decorators.ts`** — 7 个 decorator: @Table, @Column, @Index, @Required, @Range, @Regex, @Unique, @Validate, @Enum
3. **`odin/server/schema-compiler.js`** — esbuild 编译 TS → ESM, dynamic import, Reflect.getOwnMetadata 提取 → descriptor
4. **`odin/server/schema-watcher.js`** — chokidar watch + 热重载 + compile-status 状态暴露
5. **`odin/server/validator-registry.js`** — @Validate 函数的内存注册表

### P1 — 服务器适配

6. **`odin/server/api.js`** — 从 gbuilder 复制并修改:
   - `getProject()` 改为从 `getDescriptor()` 取内存中的 descriptor
   - 删除所有 `/api/schema/*` 路由 (schema 编辑由 IDE 替代)
   - 新增 `GET /api/schema/files` 和 `GET /api/schema/compile-status`
   - 保留所有数据 CRUD + FK + validate + image 路由
7. **`odin/server/validate.js`** — 在现有 FK/PK/Enum 校验上叠加 decorator 规则
8. **`odin/server/index.js`** — 启动时调用 `startWatcher()` 初始化 schema
9. **复制共享库** — `fk-resolver.js`, `references.js`, `file-io.js`, `app-config.js`, `type-parser.js`

### P2 — 前端适配

10. **`odin/src/App.svelte`** — 改编自 gbuilder:
    - 删除 `view === "schema"` 分支 (SchemaEditor)
    - 新增 `view === "schema-files"` 分支 (SchemaFileViewer)
    - InspectorField 传递 `validationErrors`
11. **`odin/src/components/schema/SchemaFileViewer.svelte`** — 新组件: 类文件浏览器 + 编译状态指示
12. **gbuilder InspectorField.svelte** — 新增 `validationErrors` prop, 字段级红色错误提示
13. **`odin/src/lib/api-client.js`** — 删除 schema CRUD 函数, 新增 `getSchemaFiles()`, `getCompileStatus()`
14. **`odin/vite.config.js`** — Vite alias 指向 gbuilder/src/components, proxy → localhost:3002

### P3 — 示例与迁移

15. **`odin/example-project/schemas/*.ts`** — 将 gbuilder/example/project.json 转为 class 文件 (Item.ts, Skill.ts, Affix.ts, Stat.ts, Unit.ts)
16. **`odin/scripts/migrate.js`** — 一次性脚本: project.json → .ts class 文件自动生成

---

## 目录结构

```
odin/
├── server/
│   ├── index.js
│   ├── api.js
│   ├── validate.js
│   ├── schema-compiler.js
│   ├── schema-watcher.js
│   └── validator-registry.js
├── shared/
│   ├── decorators.ts          (NEW)
│   ├── metadata-keys.ts       (NEW)
│   └── type-parser.js         (copy from gbuilder)
├── lib/                       (copies from gbuilder)
│   ├── fk-resolver.js
│   ├── references.js
│   ├── file-io.js
│   ├── app-config.js
│   └── api-client.js
├── src/
│   ├── App.svelte            (adapted)
│   └── components/schema/
│       └── SchemaFileViewer.svelte  (NEW)
├── scripts/
│   └── migrate.js            (NEW)
├── example-project/
│   ├── schemas/*.ts          (NEW)
│   └── data/*.json           (copy from gbuilder)
├── package.json
├── vite.config.js
└── tsconfig.json
```

---

## 验证方式

1. 在 `odin/example-project/` 下运行 `npm run dev`
2. 确认 schema 编译成功 (compile-status API 返回 `ok: true`)
3. 通过 UI 打开 Item 表，确认现有数据正确渲染
4. 编辑某行数据 → 确认 PATCH 正常写入
5. 编辑 schemas/Item.ts 添加 `@Range(1, 999)` → 确认热重载
6. 点击 Validate → 确认 decorator 校验规则生效
7. 故意写一个错误的 FK → 确认 FK 校验捕获
