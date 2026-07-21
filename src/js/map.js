/**
 * Map system — tile data + dungeon generation.
 *
 * Tile types:
 *   wall     — blocked, cannot walk through
 *   ground   — walkable, random encounters possible
 *   entrance — go to next level
 *   exit     — go back/leave
 *   npc      — talk to NPC
 *   chest    — treasure
 *   mob      — monster encounter
 */

// --- Tile glyphs ---
const WALL_GLYPHS = ['🌲', '🪨', '🧱', '🪵'];
const MOB_GLYPHS = ['👹', '🧌', '💀'];

/**
 * Create a blank 10x5 map filled with ground tiles.
 */
export function createBlank() {
  return {
    tiles: Array.from({ length: 5 }, () =>
      Array.from({ length: 10 }, () => ({ type: 'ground', glyph: ' ' }))
    ),
    playerX: 0,
    playerY: 2,
  };
}

/**
 * Create a preset "town" map.
 */
export function createTown() {
  const map = createBlank();

  // Walls
  fillWall(map, 0, 0, 9, 0);
  fillWall(map, 0, 0, 0, 3);
  fillWall(map, 0, 4, 9, 4);
  fillWall(map, 9, 1, 9, 1);
  fillWall(map, 9, 3, 9, 3);

  // NPC
  placeTile(map, 6, 1, 'npc', '👤');
  placeTile(map, 8, 2, 'npc', '👤');

  // Exit
  placeTile(map, 7, 4, 'exit', '🚪');

  map.playerX = 3;
  map.playerY = 2;
  return map;
}

/**
 * Generate a random 10x5 dungeon.
 * Uses flood-fill connectivity + MST region connection (adapted from old GameMap).
 */
export function genDungeon(density = 0.35, mobCount = 3, chestCount = 1) {
  const W = 10, H = 5;

  // Initialize all as ground
  const cells = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ type: 'ground', glyph: ' ' }))
  );

  // Place entrance & exit on edges
  const entrance = { x: 0, y: randInt(0, 4) };
  const exit = { x: 9, y: randInt(0, 4) };
  cells[entrance.y][entrance.x] = { type: 'entrance', glyph: '🚪' };
  cells[exit.y][exit.x] = { type: 'exit', glyph: '🚪' };

  // Place walls
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (cells[y][x].type !== 'ground') continue;
      if (Math.random() < density) {
        cells[y][x] = { type: 'wall', glyph: pick(WALL_GLYPHS) };
      }
    }
  }

  // Flood fill from entrance → find reachable cells
  function floodFrom(sx, sy) {
    const visited = Array.from({ length: H }, () => Array(W).fill(false));
    const q = [{ x: sx, y: sy }];
    visited[sy][sx] = true;
    while (q.length) {
      const { x, y } = q.shift();
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H || visited[ny][nx]) continue;
        if (cells[ny][nx].type === 'wall') continue;
        visited[ny][nx] = true;
        q.push({ x: nx, y: ny });
      }
    }
    return visited;
  }

  // Find disconnected regions & connect them
  function connectRegions() {
    // Identify all non-wall cells, mark reachable from entrance
    const reachable = floodFrom(entrance.x, entrance.y);

    // Find unreachable regions
    const visited = Array.from({ length: H }, () => Array(W).fill(false));
    const regions = [];

    // Region 0: reachable cells
    const r0 = [];
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (reachable[y][x] && cells[y][x].type !== 'wall')
          r0.push({ x, y });
    regions.push({ cells: r0, id: 0 });

    // Find unreachable regions
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (visited[y][x] || reachable[y][x] || cells[y][x].type === 'wall') continue;
        const region = [];
        const q = [{ x, y }];
        visited[y][x] = true;
        while (q.length) {
          const c = q.shift();
          region.push(c);
          for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
            const nx = c.x + dx, ny = c.y + dy;
            if (nx < 0 || nx >= W || ny < 0 || ny >= H || visited[ny][nx]) continue;
            if (cells[ny][nx].type === 'wall') continue;
            visited[ny][nx] = true;
            q.push({ x: nx, y: ny });
          }
        }
        if (region.length) regions.push({ cells: region, id: regions.length });
      }
    }

    // Also add exit as its own region
    regions.push({ cells: [{ x: exit.x, y: exit.y }], id: regions.length });

    if (regions.length <= 1) return; // All connected

    // Find shortest wall-breaking path between any two region cells
    function shortestPath(a, b) {
      const q = [{ x: a.x, y: a.y, path: [], dist: 0 }];
      const v = Array.from({ length: H }, () => Array(W).fill(false));
      v[a.y][a.x] = true;
      while (q.length) {
        const cur = q.shift();
        if (cur.x === b.x && cur.y === b.y) return cur;
        const dirs = shuffle([[0, -1], [0, 1], [-1, 0], [1, 0]]);
        for (const [dx, dy] of dirs) {
          const nx = cur.x + dx, ny = cur.y + dy;
          if (nx < 0 || nx >= W || ny < 0 || ny >= H || v[ny][nx]) continue;
          v[ny][nx] = true;
          const isWall = cells[ny][nx].type === 'wall';
          q.push({
            x: nx, y: ny,
            path: [...cur.path, { x: nx, y: ny }],
            dist: cur.dist + (isWall ? 1 : 0),
          });
        }
      }
      return null;
    }

    // Build edges between all pairs of regions
    const edges = [];
    for (let i = 0; i < regions.length; i++) {
      for (let j = i + 1; j < regions.length; j++) {
        let best = null;
        for (const ca of regions[i].cells) {
          for (const cb of regions[j].cells) {
            const p = shortestPath(ca, cb);
            if (p && (!best || p.dist < best.dist)) best = p;
          }
        }
        if (best) edges.push({ i, j, dist: best.dist, path: best.path });
      }
    }
    edges.sort((a, b) => a.dist - b.dist);

    // Kruskal MST
    const parent = Array(regions.length).fill(0).map((_, i) => i);
    const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));
    const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) { parent[ra] = rb; return true; } return false; };

    // Connect with MST, breaking walls along paths
    let connected = 0;
    for (const e of edges) {
      if (union(e.i, e.j)) {
        for (const { x, y } of e.path) {
          if (cells[y][x].type === 'wall') {
            cells[y][x] = { type: 'ground', glyph: ' ' };
          }
        }
        connected++;
        if (connected === regions.length - 1) break;
      }
    }
  }

  connectRegions();

  // Place chests & mobs on empty ground cells
  const groundCells = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (cells[y][x].type === 'ground')
        groundCells.push({ x, y });

  const shuffled = shuffle(groundCells);

  // Chests
  for (let i = 0; i < chestCount && i < shuffled.length; i++) {
    const { x, y } = shuffled[i];
    cells[y][x] = { type: 'chest', glyph: '📦' };
  }

  // Mobs
  const startIdx = chestCount;
  for (let i = startIdx; i < startIdx + mobCount && i < shuffled.length; i++) {
    const { x, y } = shuffled[i];
    cells[y][x] = { type: 'mob', glyph: pick(MOB_GLYPHS) };
  }

  return {
    tiles: cells,
    playerX: entrance.x,
    playerY: entrance.y,
    area: 'dungeon',
  };
}

// --- Helpers ---

function fillWall(map, x1, y1, x2, y2) {
  for (let y = y1; y <= y2; y++)
    for (let x = x1; x <= x2; x++)
      map.tiles[y][x] = { type: 'wall', glyph: pick(WALL_GLYPHS) };
}

function placeTile(map, x, y, type, glyph) {
  map.tiles[y][x] = { type, glyph };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
