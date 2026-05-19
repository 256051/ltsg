/**
 * 方块图案配置
 * 可修改项：图案类型、emoji 符号、颜色
 */

/** 方块图案列表 - 使用 emoji 便于跨平台显示 */
export const ITEM_TYPES = [
  { id: 1, emoji: '🐑', name: '绵羊', color: '#f5f5f5' },
  { id: 2, emoji: '🌿', name: '小草', color: '#90EE90' },
  { id: 3, emoji: '🌻', name: '向日葵', color: '#FFD700' },
  { id: 4, emoji: '🥕', name: '胡萝卜', color: '#FF6B35' },
  { id: 5, emoji: '🌈', name: '彩虹', color: '#FF69B4' },
  { id: 6, emoji: '⭐', name: '星星', color: '#FFFF00' },
  { id: 7, emoji: '🔔', name: '铃铛', color: '#FFD700' },
  { id: 8, emoji: '🍎', name: '苹果', color: '#FF0000' },
  { id: 9, emoji: '🧸', name: '小熊', color: '#D2691E' },
  { id: 10, emoji: '🌸', name: '樱花', color: '#FFB6C1' }
]

/**
 * 根据关卡难度返回对应数量的方块类型
 * @param {number} count - 需要的方块类型数量
 * @returns {Array} 方块类型数组
 */
export function getItemTypesForLevel(count) {
  return ITEM_TYPES.slice(0, count)
}
