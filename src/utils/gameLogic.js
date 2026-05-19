/**
 * 核心游戏逻辑工具函数
 * 包含：方块生成、消除判断、槽位管理、胜负判定
 */

import { MATCH_COUNT, SLOT_CAPACITY } from '../data/levels.js'
import { getItemTypesForLevel } from '../data/items.js'

/**
 * 生成关卡方块数据
 * 确保每个图案数量都是3的倍数（可完全消除）
 *
 * @param {Object} levelConfig - 关卡配置
 * @returns {Array} 方块数组，每项含 id, typeId, layer, index, removed
 */
export function generateBlocks(levelConfig) {
  const { itemTypes, layers, blocksPerLayer } = levelConfig
  const itemTypeIds = getItemTypesForLevel(itemTypes).map(t => t.id)

  // 计算每种类型需要生成的数量
  const totalBlocks = layers * blocksPerLayer
  const blocksPerType = Math.ceil(totalBlocks / itemTypeIds.length)
  // 确保是3的倍数
  const roundedBlocksPerType = Math.floor(blocksPerType / MATCH_COUNT) * MATCH_COUNT

  // 生成方块类型序列
  const typeSequence = []
  itemTypeIds.forEach(typeId => {
    for (let i = 0; i < roundedBlocksPerType; i++) {
      typeSequence.push(typeId)
    }
  })

  // 截断或补充到 totalBlocks
  while (typeSequence.length < totalBlocks) {
    typeSequence.push(itemTypeIds[Math.floor(Math.random() * itemTypeIds.length)])
  }
  const finalSequence = typeSequence.slice(0, totalBlocks)

  // 确保每个类型数量都是3的倍数（重新调整）
  const typeCounts = {}
  finalSequence.forEach(typeId => {
    typeCounts[typeId] = (typeCounts[typeId] || 0) + 1
  })

  // 调整数量使其都是3的倍数
  Object.keys(typeCounts).forEach(typeId => {
    const mod = typeCounts[typeId] % MATCH_COUNT
    if (mod !== 0) {
      typeCounts[typeId] += MATCH_COUNT - mod
    }
  })

  // 重建序列
  const rebuiltSequence = []
  Object.entries(typeCounts).forEach(([typeId, count]) => {
    for (let i = 0; i < count; i++) {
      rebuiltSequence.push(parseInt(typeId))
    }
  })

  // 打散序列
  shuffleArray(rebuiltSequence)

  // 生成方块数据
  const blocks = []
  let blockId = 0

  for (let layer = 0; layer < layers; layer++) {
    for (let index = 0; index < blocksPerLayer; index++) {
      blocks.push({
        id: blockId++,
        typeId: rebuiltSequence[blockId % rebuiltSequence.length],
        layer,
        index,
        removed: false
      })
    }
  }

  return blocks
}

/**
 * Fisher-Yates 洗牌算法
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * 将方块添加到槽位
 * 返回 { slot, matchedIds } matchedIds 为被消除的方块ID数组
 */
export function addToSlot(slot, block) {
  const newSlot = [...slot, block]

  // 检查是否有3个相同的
  const typeCounts = {}
  const matchIndices = []

  newSlot.forEach((item, index) => {
    if (!item) return
    typeCounts[item.typeId] = typeCounts[item.typeId] || []
    typeCounts[item.typeId].push(index)
  })

  let matchedIds = []

  Object.entries(typeCounts).forEach(([typeId, indices]) => {
    if (indices.length >= MATCH_COUNT) {
      matchedIds = indices.slice(0, MATCH_COUNT).map(i => newSlot[i].id)
    }
  })

  // 移除匹配的方块，用 null 占位
  if (matchedIds.length > 0) {
    matchedIds.forEach(idx => {
      newSlot[idx] = null
    })
    // 清理末尾的 null
    while (newSlot.length > 0 && newSlot[newSlot.length - 1] === null) {
      newSlot.pop()
    }
  }

  return { slot: newSlot, matchedIds }
}

/**
 * 检查槽位是否已满
 */
export function isSlotFull(slot) {
  return slot.filter(item => item !== null).length >= SLOT_CAPACITY
}

/**
 * 检查游戏是否胜利（所有方块已消除）
 */
export function checkWin(blocks) {
  return blocks.every(b => b.removed)
}

/**
 * 检查游戏是否失败（槽位满且无三消）
 */
export function checkLose(slot) {
  if (!isSlotFull(slot)) return false

  // 检查是否有3个相同的
  const activeItems = slot.filter(item => item !== null)
  const typeCounts = {}

  activeItems.forEach(item => {
    typeCounts[item.typeId] = (typeCounts[item.typeId] || 0) + 1
  })

  return !Object.values(typeCounts).some(count => count >= MATCH_COUNT)
}

/**
 * 槽位洗牌
 */
export function shuffleSlot(slot) {
  const activeItems = slot.filter(item => item !== null)
  shuffleArray(activeItems)

  const newSlot = [...activeItems]
  // 补齐到 SLOT_CAPACITY 长度
  while (newSlot.length < SLOT_CAPACITY) {
    newSlot.push(null)
  }

  return newSlot
}

/**
 * 撤销最后一次操作
 * 从 slot 中移除最后一个方块
 */
export function revokeLastSlotItem(slot) {
  const newSlot = [...slot]
  // 找到最后一个非 null 的项
  for (let i = newSlot.length - 1; i >= 0; i--) {
    if (newSlot[i] !== null) {
      const removed = newSlot.splice(i, 1)[0]
      return { slot: newSlot, removed }
    }
  }
  return { slot: newSlot, removed: null }
}

/**
 * 移除槽位中第一个方块
 */
export function removeFirstSlotItem(slot) {
  const newSlot = [...slot]
  for (let i = 0; i < newSlot.length; i++) {
    if (newSlot[i] !== null) {
      newSlot.splice(i, 1)
      break
    }
  }
  return newSlot
}

/**
 * 检查某个方块是否可点击（没有被其他方块遮挡）
 * 可修改：上层有方块时不可点击
 */
export function canClickBlock(block, blocks, blocksPerLayer) {
  if (block.removed) return false

  const { layer, index } = block

  // 检查上层是否有方块遮挡
  for (let l = layer + 1; l < blocks.length / blocksPerLayer; l++) {
    const upperBlock = blocks.find(
      b => !b.removed && b.layer === l && b.index === index
    )
    if (upperBlock) return false
  }

  return true
}
