/**
 * Skill definitions.
 *
 * type: 'phys' (physical), 'magic' (magical), 'heal'
 * power: damage/heal multiplier
 * mpCost: mana cost
 */

export const skills = {
  slash: {
    name: '重斩',
    type: 'phys',
    power: 1.8,
    mpCost: 4,
    desc: '强力物理攻击',
  },
  fireball: {
    name: '火球术',
    type: 'magic',
    power: 2.0,
    mpCost: 8,
    desc: '火焰魔法攻击',
  },
  heal: {
    name: '治愈术',
    type: 'heal',
    power: 25, // flat HP restored
    mpCost: 10,
    desc: '恢复生命值',
  },
  poison: {
    name: '施毒术',
    type: 'magic',
    power: 1.3,
    mpCost: 6,
    desc: '毒性魔法攻击',
  },
  lightning: {
    name: '雷电术',
    type: 'magic',
    power: 2.5,
    mpCost: 15,
    desc: '强力雷电魔法',
  },
  cure: {
    name: '群疗术',
    type: 'heal',
    power: 40,
    mpCost: 20,
    desc: '大量恢复生命',
  },
};
