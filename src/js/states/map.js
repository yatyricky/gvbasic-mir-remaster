import { drawText, clear, drawRect, COLS, ROWS } from '../renderer.js';
import { transition } from '../state.js';
import { createTown, genDungeon } from '../map.js';
import { saveGame } from '../player.js';
import { getAreaMonsters } from '../monsters.js';
import { items, addItem } from '../items.js';
import { clamp, randFloat, arrRand } from '../utils.js';

const ENCOUNTER_RATE = 0.2;

let map = null;
let msgText = '';
let msgTimer = 0;

// Shop items available in town
const SHOP_ITEMS = ['hpPotion', 'hpPotionM', 'mpPotion', 'mpPotionM', 'woodSword', 'clothArmor'];

export function enter(ctx) {
  map = createTown();
  msgText = '';
  msgTimer = 0;

  // Auto-save when entering town
  if (ctx.player) saveGame(ctx.player);
}

export function update(ctx, dt) {
  if (msgTimer > 0) {
    msgTimer -= dt;
    if (msgTimer <= 0) msgText = '';
  }
}

export function render(ctx) {
  clear();

  // Draw tiles
  const { tiles } = map;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tile = (tiles[row] && tiles[row][col]) ? tiles[row][col] : null;
      if (tile && tile.glyph && tile.glyph !== ' ') {
        drawText(col, row, tile.glyph, tileColor(tile.type));
      }
    }
  }

  // Player
  drawText(map.playerX, map.playerY, '◆', '#f9e2af');

  // HUD overlay at bottom
  const p = ctx.player;
  if (p) {
    drawRect(0, 4, 20, 1, 'rgba(0,0,0,0.6)');
    drawText(0, 4, `Lv${p.level} HP:${p.hp}/${p.maxHp}`, '#a6e3a1');
    drawText(13, 4, `💰${p.gold}`, '#f9e2af');
  }

  // Message
  if (msgText) {
    drawText(0, 3, msgText, '#fab387');
  }
}

export function onInput(ctx, cmd) {
  if (!map) return;

  let dx = 0, dy = 0;
  if (cmd === 'up') dy = -1;
  else if (cmd === 'down') dy = 1;
  else if (cmd === 'left') dx = -1;
  else if (cmd === 'right') dx = 1;
  else if (cmd === 'cancel') {
    // Save game
    if (ctx.player && saveGame(ctx.player)) {
      showMsg('游戏已保存');
    }
    return;
  }
  else return;

  const nx = clamp(map.playerX + dx, 0, 9);
  const ny = clamp(map.playerY + dy, 0, 4);

  const tile = map.tiles[ny][nx];
  if (!tile || tile.type === 'wall') return;

  map.playerX = nx;
  map.playerY = ny;

  const p = ctx.player;

  switch (tile.type) {
    case 'exit':
      map = genDungeon();
      showMsg('进入地牢深处...');
      break;
    case 'entrance':
      map = createTown();
      showMsg('回到城镇');
      saveGame(p);
      break;
    case 'chest':
      map.tiles[ny][nx] = { type: 'ground', glyph: ' ' };
      const gold = Math.floor(randFloat(10, 80));
      p.gold += gold;
      showMsg(`宝箱! +${gold} 金币`);
      break;
    case 'npc':
      showShop(ctx);
      break;
    case 'mob':
      map.tiles[ny][nx] = { type: 'ground', glyph: ' ' };
      transition('COMBAT', ctx, { monsterId: pickMob(map.area || 'village') });
      return;
    case 'ground':
      if (Math.random() < ENCOUNTER_RATE) {
        transition('COMBAT', ctx, { monsterId: pickMob(map.area || 'village') });
        return;
      }
      break;
  }
}

function showShop(ctx) {
  const p = ctx.player;
  if (!p) return;

  // Simple: buy a random potion if you have gold
  const available = SHOP_ITEMS.filter(id => {
    const item = items[id];
    return item.price <= p.gold && (item.type === 'consumable' || !p.equipment[item.type]);
  });

  if (available.length === 0) {
    showMsg('商店: 没有可买的物品');
    return;
  }

  const chosen = items[arrRand(available)];
  if (p.gold >= chosen.price) {
    p.gold -= chosen.price;
    addItem(p, arrRand(available));
    showMsg(`购买了 ${chosen.name}`);
  }
}

function showMsg(msg) {
  msgText = msg;
  msgTimer = 2000;
}

function tileColor(type) {
  switch (type) {
    case 'wall': return '#6c7086';
    case 'mob': return '#f38ba8';
    case 'chest': return '#f9e2af';
    case 'exit': case 'entrance': return '#a6e3a1';
    case 'npc': return '#89b4fa';
    default: return '#585b70';
  }
}

function pickMob(area) {
  const ids = getAreaMonsters(area);
  if (ids.length === 0) return 'chicken';
  return arrRand(ids);
}
