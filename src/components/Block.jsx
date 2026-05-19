/**
 * 方块组件
 * 显示一个可点击的方块
 */

import React from 'react'
import { getItemTypesForLevel } from '../data/items.js'
import './Block.css'

export default function Block({ block, itemTypes, canClick, onClick }) {
  const item = itemTypes.find(t => t.id === block.typeId) || {}

  return (
    <div
      className={`block ${canClick ? 'clickable' : 'blocked'} ${block.removed ? 'removed' : ''}`}
      onClick={canClick && !block.removed ? onClick : undefined}
    >
      <span className="block-emoji">{item.emoji || '?'}</span>
    </div>
  )
}
