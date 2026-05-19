/**
 * 道具栏组件
 * 显示并使用游戏道具
 */

import React from 'react'
import './ToolBar.css'

const TOOL_CONFIG = {
  shuffle: {
    emoji: '🔀',
    name: '洗牌',
    description: '随机打乱槽位中的方块'
  },
  revoke: {
    emoji: '↩️',
    name: '撤回',
    description: '撤销最后一次操作'
  },
  remove: {
    emoji: '🗑️',
    name: '移出',
    description: '移走槽位中一个方块'
  }
}

export default function ToolBar({ tools, onUseTool }) {
  return (
    <div className="tool-bar">
      <div className="tool-label">道具</div>
      <div className="tool-list">
        {Object.entries(TOOL_CONFIG).map(([toolKey, config]) => {
          const count = tools[toolKey] || 0
          const disabled = count <= 0

          return (
            <button
              key={toolKey}
              className={`tool-item ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onUseTool(toolKey)}
              disabled={disabled}
              title={config.description}
            >
              <span className="tool-emoji">{config.emoji}</span>
              <span className="tool-name">{config.name}</span>
              <span className="tool-count">×{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
