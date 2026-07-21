/**
 * Item definitions.
 */

export const items = {
  hpPotion: {
    name: '金创药(小)',
    type: 'consumable',
    desc: '恢复 HP 30',
    price: 50,
    effect: { hp: 30 },
  },
  hpPotionM: {
    name: '金创药(中)',
    type: 'consumable',
    desc: '恢复 HP 80',
    price: 120,
    effect: { hp: 80 },
  },
  mpPotion: {
    name: '魔法药(小)',
    type: 'consumable',
    desc: '恢复 MP 20',
    price: 60,
    effect: { mp: 20 },
  },
  mpPotionM: {
    name: '魔法药(中)',
    type: 'consumable',
    desc: '恢复 MP 50',
    price: 150,
    effect: { mp: 50 },
  },
  woodSword: {
    name: '木剑',
    type: 'weapon',
    desc: 'ATK +3',
    price: 200,
    stat: { atk: 3 },
  },
  ironSword: {
    name: '铁剑',
    type: 'weapon',
    desc: 'ATK +8',
    price: 500,
    stat: { atk: 8 },
  },
  clothArmor: {
    name: '布衣',
    type: 'armor',
    desc: 'DEF +3',
    price: 180,
    stat: { def: 3 },
  },
  lightArmor: {
    name: '轻甲',
    type: 'armor',
    desc: 'DEF +7',
    price: 450,
    stat: { def: 7 },
  },
};

/**
 * Use a consumable item on the player.
 * Returns { success, message }.
 */
export function useItem(player, itemId) {
  const item = items[itemId];
  if (!item || item.type !== 'consumable') {
    return { success: false, message: '无法使用此物品' };
  }

  const slot = player.inventory.find(s => s.id === itemId);
  if (!slot || slot.qty <= 0) {
    return { success: false, message: '物品不足' };
  }

  const e = item.effect;
  if (e.hp) {
    const healed = Math.min(e.hp, player.maxHp - player.hp);
    player.hp = Math.min(player.maxHp, player.hp + e.hp);
    slot.qty--;
    return { success: true, message: `使用 ${item.name}，恢复 ${healed} HP` };
  }
  if (e.mp) {
    const restored = Math.min(e.mp, player.maxMp - player.mp);
    player.mp = Math.min(player.maxMp, player.mp + e.mp);
    slot.qty--;
    return { success: true, message: `使用 ${item.name}，恢复 ${restored} MP` };
  }

  return { success: false, message: '无效果' };
}

/**
 * Add an item to inventory (stack if exists).
 */
export function addItem(player, itemId, qty = 1) {
  const existing = player.inventory.find(s => s.id === itemId);
  if (existing) {
    existing.qty += qty;
  } else {
    player.inventory.push({ id: itemId, qty });
  }
}
