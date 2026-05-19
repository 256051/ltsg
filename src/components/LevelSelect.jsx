/**
 * 关卡选择组件
 */

import React from 'react'
import { LEVELS } from '../data/levels.js'
import './LevelSelect.css'

export default function LevelSelect({ onSelect, currentLevel }) {
  return (
    <div className="level-select">
      <div className="level-title">🌟 选择关卡</div>
      <div className="level-list">
        {LEVELS.map(level => (
          <button
            key={level.id}
            className={`level-item ${currentLevel === level.id ? 'current' : ''}`}
            onClick={() => onSelect(level.id)}
          >
            <div className="level-number">{level.id}</div>
            <div className="level-info">
              <div className="level-name">{level.name}</div>
              <div className="level-desc">{level.description}</div>
            </div>
            <div className="level-stars">
              {Array.from({ length: level.id }).map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
