import { drawText, clear, drawRect, COLS, ROWS } from '../renderer.js';
import { transition } from '../state.js';
import { createPlayer } from '../player.js';

const classes = [
  { id: 'warrior', name: '战士', desc: '高血高防 物理攻击', color: '#f38ba8' },
  { id: 'mage',    name: '法师', desc: '高魔攻 范围魔法',   color: '#89b4fa' },
  { id: 'taoist',  name: '道士', desc: '治疗毒术 均衡型',   color: '#a6e3a1' },
];

const TITLE_LINES = [
  { text: '╔══════════════════╗', y: 0, color: '#f9e2af' },
  { text: '║    传 奇 霸 业   ║', y: 1, color: '#f9e2af' },
  { text: '╚══════════════════╝', y: 2, color: '#f9e2af' },
];

let selectedClass = 0;
let phase = 'title'; // 'title' | 'select'

export function enter(ctx) {
  phase = ctx.player ? 'title' : 'title';
  selectedClass = 0;
}

export function update(ctx, dt) {}

export function render(ctx) {
  clear();

  if (phase === 'title') {
    // Draw title
    for (const line of TITLE_LINES) {
      drawText(0, line.y, line.text, line.color);
    }

    if (ctx.player) {
      const p = ctx.player;
      drawText(0, 3, `欢迎回来 ${p.name} Lv${p.level}`, '#a6e3a1');
      drawText(0, 4, '按确认键继续', '#a6adc8');
    } else {
      drawText(0, 3, '选择职业:', '#cdd6f4');
      for (let i = 0; i < classes.length; i++) {
        const c = classes[i];
        const prefix = i === selectedClass ? '▸' : ' ';
        const color = i === selectedClass ? c.color : '#a6adc8';
        drawText(i * 7, 4, `${prefix}${c.name}`, color);
      }
    }
  } else if (phase === 'select') {
    const c = classes[selectedClass];
    drawText(0, 0, `职业: ${c.name}`, c.color);
    drawText(0, 1, c.desc, '#cdd6f4');
    drawText(0, 3, '按确认创建角色', '#a6adc8');
    drawText(0, 4, '按取消返回', '#6c7086');
  }
}

export function onInput(ctx, cmd) {
  if (phase === 'title') {
    if (ctx.player) {
      if (cmd === 'confirm') {
        transition('MAP', ctx);
      }
      return;
    }

    // Class selection
    if (cmd === 'left') selectedClass = Math.max(0, selectedClass - 1);
    else if (cmd === 'right') selectedClass = Math.min(classes.length - 1, selectedClass + 1);
    else if (cmd === '1') selectedClass = 0;
    else if (cmd === '2') selectedClass = 1;
    else if (cmd === '3') selectedClass = 2;
    else if (cmd === 'confirm') {
      phase = 'select';
    }
  } else if (phase === 'select') {
    if (cmd === 'confirm') {
      ctx.player = createPlayer(classes[selectedClass].id);
      transition('MAP', ctx);
    } else if (cmd === 'cancel') {
      phase = 'title';
    }
  }
}
