/**
 * 关卡配置数据
 * 可修改项：关卡名称、方块类型数量、层数、方块总数
 */

export const LEVELS = [
  {
    id: 1,
    name: '新手牧场',
    description: '适合新手的简单关卡',
    /** 方块图案类型数量 */
    itemTypes: 4,
    /** 堆叠层数 */
    layers: 3,
    /** 每层方块数量（每层网格 4×4） */
    blocksPerLayer: 16,
    /** 初始道具数量 */
    tools: {
      shuffle: 1,
      revoke: 1,
      remove: 1
    }
  },
  {
    id: 2,
    name: '进阶草原',
    description: '增加难度的挑战关卡',
    itemTypes: 6,
    layers: 3,
    blocksPerLayer: 20,
    tools: {
      shuffle: 1,
      revoke: 1,
      remove: 1
    }
  },
  {
    id: 3,
    name: '高级山脉',
    description: '高难度的终极挑战',
    itemTypes: 8,
    layers: 4,
    blocksPerLayer: 20,
    tools: {
      shuffle: 1,
      revoke: 1,
      remove: 1
    }
  }
]

/** 槽位容量 */
export const SLOT_CAPACITY = 7

/** 三消所需相同方块数量 */
export const MATCH_COUNT = 3
