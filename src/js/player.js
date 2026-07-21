/**
 * Player factory and level-up logic.
 */

export function createPlayer(className) {
  const bases = {
    warrior: { name: '战士', hp: 150, mp: 30,  atk: 18, def: 10, matk: 5,  skills: ['slash'] },
    mage:    { name: '法师', hp: 80,  mp: 100, atk: 8,  def: 4,  matk: 18, skills: ['fireball'] },
    taoist:  { name: '道士', hp: 100, mp: 70,  atk: 12, def: 6,  matk: 14, skills: ['heal', 'poison'] },
  };

  const base = bases[className] || bases.warrior;

  return {
    name: base.name,
    class: className,
    level: 1,
    xp: 0,
    hp: base.hp,
    maxHp: base.hp,
    mp: base.mp,
    maxMp: base.mp,
    atk: base.atk,
    def: base.def,
    matk: base.matk,
    gold: 0,
    equipment: { weapon: null, armor: null },
    inventory: [
      { id: 'hpPotion', qty: 3 },
      { id: 'mpPotion', qty: 2 },
    ],
    skills: base.skills.map(id => ({ id, level: 1 })),
  };
}

/** XP needed for next level. */
export function xpForLevel(level) {
  return level * 50;
}

// --- Save / Load ---

const SAVE_KEY = 'mir_save';

export function saveGame(player) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    return true;
  } catch (e) {
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Add XP. Returns true if leveled up.
 */
export function addXp(player, amount) {
  player.xp += amount;
  let leveled = false;
  while (player.xp >= xpForLevel(player.level)) {
    player.xp -= xpForLevel(player.level);
    player.level++;
    player.maxHp += 15;
    player.maxMp += 8;
    player.atk += 2;
    player.def += 1;
    player.matk += 2;
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    leveled = true;

    // Learn new skills
    if (player.level === 3 && !player.skills.find(s => s.id === 'lightning')) {
      player.skills.push({ id: 'lightning', level: 1 });
    }
    if (player.level === 5 && !player.skills.find(s => s.id === 'cure')) {
      player.skills.push({ id: 'cure', level: 1 });
    }
  }
  return leveled;
}
