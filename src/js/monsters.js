/**
 * Monster definitions.
 * Areas: village, cave, dungeon, boss
 */

export const monsters = {
  chicken:   { name: '鸡',     hp: 8,   atk: 2,  def: 0,  matk: 0, xp: 4,   gold: 2,  area: 'village' },
  deer:      { name: '鹿',     hp: 15,  atk: 4,  def: 1,  matk: 0, xp: 8,   gold: 5,  area: 'village' },
  scarecrow: { name: '稻草人', hp: 20,  atk: 6,  def: 2,  matk: 0, xp: 12,  gold: 8,  area: 'village' },

  skeleton:  { name: '骷髅',   hp: 50,  atk: 12, def: 4,  matk: 0, xp: 25,  gold: 15, area: 'cave' },
  zombie:    { name: '僵尸',   hp: 80,  atk: 16, def: 6,  matk: 0, xp: 35,  gold: 20, area: 'cave' },
  bat:       { name: '蝙蝠',   hp: 30,  atk: 10, def: 2,  matk: 0, xp: 20,  gold: 10, area: 'cave' },
  ghoul:     { name: '食尸鬼', hp: 65,  atk: 14, def: 5,  matk: 0, xp: 30,  gold: 18, area: 'cave' },

  orc:       { name: '半兽人', hp: 100, atk: 20, def: 8,  matk: 0, xp: 50,  gold: 30, area: 'dungeon' },
  orcLord:   { name: '兽人统领', hp: 150, atk: 28, def: 12, matk: 0, xp: 80, gold: 50, area: 'dungeon' },
  darkMage:  { name: '暗黑法师', hp: 70, atk: 8, def: 4,  matk: 25, xp: 70, gold: 40, area: 'dungeon' },
  skeletonKing: { name: '骷髅王', hp: 200, atk: 32, def: 15, matk: 0, xp: 120, gold: 80, area: 'dungeon' },

  womaKing:  { name: '沃玛教主', hp: 400, atk: 45, def: 25, matk: 30, xp: 300, gold: 200, area: 'boss' },
  evilApe:   { name: '邪恶钳虫', hp: 350, atk: 40, def: 30, matk: 15, xp: 250, gold: 150, area: 'boss' },
};

/** Get monster IDs for an area. */
export function getAreaMonsters(area) {
  return Object.keys(monsters).filter(id => monsters[id].area === area);
}
