import { drawText, drawBar, clear, COLS } from '../renderer.js';
import { transition } from '../state.js';
import { monsters } from '../monsters.js';
import { skills } from '../skills.js';
import { items, useItem } from '../items.js';
import { addXp } from '../player.js';

export function enter(ctx, { monsterId } = {}) {
  const t = monsters[monsterId] || monsters.chicken;
  ctx.combat = {
    monster: { ...t, maxHp: t.hp },
    turn: 'player',
    phase: 'menu',       // 'menu' | 'skillMenu' | 'itemMenu' | 'playerAct' | 'monsterAct' | 'victory' | 'defeat'
    menuIdx: 0,
    subIdx: 0,
    log: [''],
    timer: 0,
    pendingMonsterAct: false,
  };
}

export function update(ctx, dt) {
  const c = ctx.combat;
  if (!c) return;

  if (['playerAct', 'monsterAct', 'victory', 'defeat'].includes(c.phase)) {
    c.timer -= dt;
    if (c.timer <= 0) {
      if (c.phase === 'playerAct' && c.pendingMonsterAct) {
        c.pendingMonsterAct = false;
        monsterTurn(ctx);
      } else if (c.phase === 'playerAct') {
        c.phase = 'menu';
        c.turn = 'player';
      } else if (c.phase === 'monsterAct') {
        c.phase = 'menu';
        c.turn = 'player';
      } else {
        // victory / defeat
        if (c.phase === 'defeat') {
          ctx.player.hp = ctx.player.maxHp;
          const loss = Math.floor(ctx.player.gold * 0.2);
          ctx.player.gold -= loss;
          c.log = [`你被击败了... 损失 ${loss} 金币`];
        }
        transition('MAP', ctx);
      }
    }
  }
}

export function render(ctx) {
  clear();
  const c = ctx.combat;
  const p = ctx.player;
  if (!c || !p) return;

  const m = c.monster;

  // Row 0: Monster
  drawText(0, 0, `${m.name}`, '#f38ba8');
  drawBar(8, 0, 12, Math.max(0, m.hp) / m.maxHp, '#f38ba8');
  drawText(19, 0, `Lv`, '#6c7086');

  // Row 1: Player
  drawText(0, 1, `${p.name} Lv${p.level}`, '#a6e3a1');
  drawText(10, 1, `HP:${p.hp}/${p.maxHp}`, '#a6e3a1');
  drawText(16, 1, `MP:${p.mp}`, '#89b4fa');

  // Row 2-4: Content
  if (c.phase === 'menu') {
    drawText(0, 2, c.log[0] || '选择行动:', '#a6adc8');
    drawText(0, 2, '', '#a6adc8');
    const menu = ['攻击', '技能', '道具', '逃跑'];
    for (let i = 0; i < menu.length; i++) {
      const prefix = i === c.menuIdx ? '▸' : ' ';
      const color = i === c.menuIdx ? '#f9e2af' : '#a6adc8';
      drawText(i * 5, 3, `${prefix}${i + 1}.${menu[i]}`, color);
    }
  } else if (c.phase === 'skillMenu') {
    const playerSkills = p.skills;
    drawText(0, 2, '选择技能:', '#f9e2af');
    for (let i = 0; i < Math.min(playerSkills.length, 4); i++) {
      const s = skills[playerSkills[i].id];
      const prefix = i === c.subIdx ? '▸' : ' ';
      const color = i === c.subIdx ? '#f9e2af' : '#a6adc8';
      drawText(0, 3 + Math.floor(i / 2), '', '#a6adc8');
      if (i === 0) drawText(0, 3, `${prefix}${i + 1}.${s.name} MP${s.mpCost}`, color);
      else if (i === 1) drawText(10, 3, `${prefix}${i + 1}.${s.name} MP${s.mpCost}`, color);
      else if (i === 2) drawText(0, 4, `${prefix}${i + 1}.${s.name} MP${s.mpCost}`, color);
      else drawText(10, 4, `${prefix}${i + 1}.${s.name} MP${s.mpCost}`, color);
    }
  } else if (c.phase === 'itemMenu') {
    const inv = p.inventory.filter(s => s.qty > 0);
    drawText(0, 2, '选择道具:', '#f9e2af');
    for (let i = 0; i < Math.min(inv.length, 4); i++) {
      const item = items[inv[i].id];
      const prefix = i === c.subIdx ? '▸' : ' ';
      const color = i === c.subIdx ? '#f9e2af' : '#a6adc8';
      const label = `${item.name} x${inv[i].qty}`;
      if (i === 0) drawText(0, 3, `${prefix}${i + 1}.${label}`, color);
      else if (i === 1) drawText(10, 3, `${prefix}${i + 1}.${label}`, color);
      else if (i === 2) drawText(0, 4, `${prefix}${i + 1}.${label}`, color);
      else drawText(10, 4, `${prefix}${i + 1}.${label}`, color);
    }
  } else {
    drawText(0, 2, c.log[0] || '', '#fab387');
  }

  // Turn indicator
  if (c.phase === 'menu') {
    drawText(14, 4, '你的回合', '#6c7086');
  }
}

export function onInput(ctx, cmd) {
  const c = ctx.combat;
  if (!c) return;

  if (c.phase === 'skillMenu') {
    handleSkillInput(ctx, cmd);
    return;
  }
  if (c.phase === 'itemMenu') {
    handleItemInput(ctx, cmd);
    return;
  }

  if (c.phase !== 'menu') return;

  if (cmd === 'up' || cmd === 'left') c.menuIdx = Math.max(0, c.menuIdx - 1);
  else if (cmd === 'down' || cmd === 'right') c.menuIdx = Math.min(3, c.menuIdx + 1);
  else if (cmd === '1') c.menuIdx = 0;
  else if (cmd === '2') c.menuIdx = 1;
  else if (cmd === '3') c.menuIdx = 2;
  else if (cmd === '4') c.menuIdx = 3;
  else if (cmd === 'confirm') {
    switch (c.menuIdx) {
      case 0: playerAttack(ctx); break;
      case 1: c.phase = 'skillMenu'; c.subIdx = 0; break;
      case 2:
        if (ctx.player.inventory.filter(s => s.qty > 0).length === 0) {
          c.log = ['没有可用道具!'];
          c.phase = 'playerAct';
          c.timer = 600;
        } else {
          c.phase = 'itemMenu';
          c.subIdx = 0;
        }
        break;
      case 3: flee(ctx); break;
    }
  } else if (cmd === 'cancel') {
    // Cancel returns to menu
    c.phase = 'menu';
  }
}

function handleSkillInput(ctx, cmd) {
  const c = ctx.combat;
  const skills_ = ctx.player.skills;
  if (cmd === 'up' || cmd === 'left') c.subIdx = Math.max(0, c.subIdx - 1);
  else if (cmd === 'down' || cmd === 'right') c.subIdx = Math.min(skills_.length - 1, c.subIdx + 1);
  else if (cmd === '1' && skills_.length > 0) c.subIdx = 0;
  else if (cmd === '2' && skills_.length > 1) c.subIdx = 1;
  else if (cmd === '3' && skills_.length > 2) c.subIdx = 2;
  else if (cmd === '4' && skills_.length > 3) c.subIdx = 3;
  else if (cmd === 'confirm') {
    useSkill(ctx, skills_[c.subIdx].id);
    return;
  } else if (cmd === 'cancel') {
    c.phase = 'menu';
    return;
  }
}

function handleItemInput(ctx, cmd) {
  const c = ctx.combat;
  const inv = ctx.player.inventory.filter(s => s.qty > 0);
  if (cmd === 'up' || cmd === 'left') c.subIdx = Math.max(0, c.subIdx - 1);
  else if (cmd === 'down' || cmd === 'right') c.subIdx = Math.min(inv.length - 1, c.subIdx + 1);
  else if (cmd === 'confirm') {
    const result = useItem(ctx.player, inv[c.subIdx].id);
    c.log = [result.message];
    c.phase = 'playerAct';
    c.timer = 800;
    c.pendingMonsterAct = result.success; // Only monster gets turn if item was used
    return;
  } else if (cmd === 'cancel') {
    c.phase = 'menu';
    return;
  }
}

// --- Actions ---

function playerAttack(ctx) {
  const c = ctx.combat, p = ctx.player, m = c.monster;
  const base = p.atk + Math.floor(Math.random() * 6);
  const dmg = Math.max(1, base - m.def);
  m.hp -= dmg;

  if (m.hp <= 0) return victory(ctx);

  c.log = [`对 ${m.name} 造成 ${dmg} 伤害!`];
  c.phase = 'playerAct';
  c.timer = 600;
  c.pendingMonsterAct = true;
}

function useSkill(ctx, skillId) {
  const c = ctx.combat, p = ctx.player, m = c.monster;
  const skill = skills[skillId];
  if (!skill) return;

  if (p.mp < skill.mpCost) {
    c.log = ['MP 不足!'];
    c.phase = 'playerAct';
    c.timer = 600;
    return;
  }

  p.mp -= skill.mpCost;

  if (skill.type === 'heal') {
    const healed = Math.min(skill.power, p.maxHp - p.hp);
    p.hp += healed;
    c.log = [`${skill.name} 恢复 ${healed} HP!`];
  } else {
    const base = skill.type === 'phys'
      ? p.atk * skill.power + Math.floor(Math.random() * 6)
      : p.matk * skill.power + Math.floor(Math.random() * 8);
    const dmg = Math.max(1, Math.floor(base) - (skill.type === 'phys' ? m.def : 0));
    m.hp -= dmg;

    if (m.hp <= 0) return victory(ctx);

    c.log = [`${skill.name} 造成 ${dmg} 伤害!`];
  }

  c.phase = 'playerAct';
  c.timer = 800;
  c.pendingMonsterAct = true;
}

function monsterTurn(ctx) {
  const c = ctx.combat, p = ctx.player, m = c.monster;
  const base = m.matk > m.atk ? m.matk + Math.floor(Math.random() * 8) : m.atk + Math.floor(Math.random() * 6);
  const mdmg = Math.max(1, base - p.def);
  p.hp -= mdmg;

  if (p.hp <= 0) {
    p.hp = 0;
    c.log = ['你被击败了...'];
    c.phase = 'defeat';
    c.timer = 2000;
    return;
  }

  c.log = [`${m.name} 造成 ${mdmg} 伤害!`];
  c.phase = 'monsterAct';
  c.timer = 600;
}

function flee(ctx) {
  const c = ctx.combat;
  if (Math.random() < 0.5) {
    c.log = ['逃跑成功!'];
    c.phase = 'victory';
    c.timer = 500;
  } else {
    c.log = ['逃跑失败!'];
    c.phase = 'playerAct';
    c.timer = 400;
    c.pendingMonsterAct = true;
  }
}

function victory(ctx) {
  const c = ctx.combat, p = ctx.player, m = c.monster;
  m.hp = 0;
  p.gold += m.gold;
  const leveled = addXp(p, m.xp);
  let msg = `击败 ${m.name}! +${m.xp}XP +${m.gold}G`;
  if (leveled) msg += ` 升级! Lv${p.level}`;
  c.log = [msg];
  c.phase = 'victory';
  c.timer = 1800;
}
