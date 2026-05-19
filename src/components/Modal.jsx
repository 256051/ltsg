/**
 * 弹窗组件
 * 用于游戏胜利/失败提示
 */

import React from 'react'
import './Modal.css'

export default function Modal({ isOpen, type, levelName, onRestart, onNextLevel, onSelectLevel, hasNextLevel }) {
  if (!isOpen) return null

  const isWin = type === 'win'

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isWin ? 'win' : 'lose'}`}>
        <div className="modal-icon">{isWin ? '🎉' : '😢'}</div>
        <div className="modal-title">
          {isWin ? '恭喜通关！' : '游戏结束'}
        </div>
        <div className="modal-subtitle">
          {isWin ? `你成功通过了「${levelName}」` : '槽位已满，无法继续'}
        </div>

        <div className="modal-buttons">
          {isWin && hasNextLevel && (
            <button className="modal-btn primary" onClick={onNextLevel}>
              下一关 ➡️
            </button>
          )}
          <button className="modal-btn secondary" onClick={onRestart}>
            重玩本关
          </button>
          <button className="modal-btn secondary" onClick={onSelectLevel}>
            选择关卡
          </button>
        </div>
      </div>
    </div>
  )
}
