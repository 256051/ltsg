/**
 * 槽位面板组件
 * 显示下方7个槽位，3个相同方块自动消除
 */

import React from 'react'
import { getItemTypesForLevel } from '../data/items.js'
import { SLOT_CAPACITY } from '../data/levels.js'
import './SlotBoard.css'

export default function SlotBoard({ slot }) {
  const itemTypes = getItemTypesForLevel(100) // 获取所有类型

  return (
    <div className="slot-board">
      <div className="slot-label">待消除区域</div>
      <div className="slot-container">
        {Array.from({ length: SLOT_CAPACITY }).map((_, index) => {
          const block = slot[index]
          const item = block ? itemTypes.find(t => t.id === block.typeId) : null

          return (
            <div
              key={index}
              className={`slot-item ${block ? 'filled' : 'empty'}`}
            >
              {block && item && (
                <span className="slot-emoji">{item.emoji}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
