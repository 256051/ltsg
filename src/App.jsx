/**
 * 羊了个羊 - 主应用组件
 * 包含游戏状态管理、关卡控制、道具使用
 */

import React, { useState, useCallback, useEffect } from 'react'
import { LEVELS, SLOT_CAPACITY } from './data/levels.js'
import {
  generateBlocks,
  addToSlot,
  checkWin,
  checkLose,
  shuffleSlot,
  revokeLastSlotItem,
  removeFirstSlotItem,
  shuffleArray
} from './utils/gameLogic.js'
import BlockBoard from './components/BlockBoard.jsx'
import SlotBoard from './components/SlotBoard.jsx'
import ToolBar from './components/ToolBar.jsx'
import Modal from './components/Modal.jsx'
import LevelSelect from './components/LevelSelect.jsx'

/** 游戏状态 */
const GAME_STATE = {
  SELECT: 'select',   // 选择关卡
  PLAYING: 'playing', // 游戏中
  WIN: 'win',         // 胜利
  LOSE: 'lose'        // 失败
}

export default function App() {
  /** 游戏状态 */
  const [gameState, setGameState] = useState(GAME_STATE.SELECT)
  const [currentLevelId, setCurrentLevelId] = useState(1)
  const [blocks, setBlocks] = useState([])
  const [slot, setSlot] = useState([])
  const [tools, setTools] = useState({})
  const [modalInfo, setModalInfo] = useState({ isOpen: false, type: '', levelName: '' })

  /** 撤销栈 */
  const [history, setHistory] = useState([])

  /** 当前关卡配置 */
  const currentLevel = LEVELS.find(l => l.id === currentLevelId)

  /** 是否还有下一关 */
  const hasNextLevel = currentLevelId < LEVELS.length

  /**
   * 初始化/重置关卡
   */
  const initLevel = useCallback((levelId) => {
    const level = LEVELS.find(l => l.id === levelId)
    if (!level) return

    // 生成方块数据
    const newBlocks = generateBlocks({
      itemTypes: level.itemTypes,
      layers: level.layers,
      blocksPerLayer: level.blocksPerLayer
    })

    // 随机打散方块顺序
    const shuffledBlocks = shuffleArray([...newBlocks])

    // 重置槽位和道具
    const initialSlot = Array(SLOT_CAPACITY).fill(null)
    const initialTools = { ...level.tools }

    setBlocks(shuffledBlocks)
    setSlot(initialSlot)
    setTools(initialTools)
    setHistory([])
    setGameState(GAME_STATE.PLAYING)
  }, [])

  /**
   * 处理方块点击
   */
  const handleBlockClick = useCallback((block) => {
    if (gameState !== GAME_STATE.PLAYING) return

    // 保存历史（用于撤销）
    setHistory(prev => [...prev, { blocks: [...blocks], slot: [...slot] }])

    // 标记方块为已移除
    setBlocks(prev => prev.map(b =>
      b.id === block.id ? { ...b, removed: true } : b
    ))

    // 添加到槽位
    const { slot: newSlot, matchedIds } = addToSlot(slot, block)

    if (matchedIds.length > 0) {
      // 有三消，延迟处理
      setTimeout(() => {
        // 标记消除的方块（实际上已经是 null 了）
        setSlot(newSlot)
      }, 300)
    } else {
      setSlot(newSlot)
    }

    // 检查胜负
    setTimeout(() => {
      // 再次检查，因为可能有延迟
      const activeBlocks = blocks.filter(b => !b.removed && b.id !== block.id)
      if (checkWin([...activeBlocks])) {
        setModalInfo({
          isOpen: true,
          type: 'win',
          levelName: currentLevel.name
        })
        setGameState(GAME_STATE.WIN)
      } else if (checkLose(newSlot)) {
        setModalInfo({
          isOpen: true,
          type: 'lose',
          levelName: currentLevel.name
        })
        setGameState(GAME_STATE.LOSE)
      }
    }, 350)
  }, [gameState, blocks, slot, currentLevel])

  /**
   * 使用道具
   */
  const handleUseTool = useCallback((toolKey) => {
    if (gameState !== GAME_STATE.PLAYING) return
    if (tools[toolKey] <= 0) return

    // 保存历史
    setHistory(prev => [...prev, { blocks: [...blocks], slot: [...slot] }])

    let newSlot = [...slot]

    switch (toolKey) {
      case 'shuffle':
        // 洗牌：打乱槽位中的方块
        newSlot = shuffleSlot(slot)
        break
      case 'revoke':
        // 撤销：恢复上一次状态
        if (history.length > 0) {
          const lastState = history[history.length - 1]
          setBlocks(lastState.blocks)
          setSlot(lastState.slot)
          setHistory(prev => prev.slice(0, -1))
          setTools(prev => ({ ...prev, revoke: prev.revoke - 1 }))
          return
        }
        return
      case 'remove':
        // 移出：移除槽位第一个方块
        newSlot = removeFirstSlotItem(slot)
        break
      default:
        return
    }

    setSlot(newSlot)
    setTools(prev => ({ ...prev, [toolKey]: prev[toolKey] - 1 }))
  }, [gameState, tools, slot, blocks, history])

  /**
   * 重新开始当前关卡
   */
  const handleRestart = useCallback(() => {
    setModalInfo({ isOpen: false, type: '', levelName: '' })
    initLevel(currentLevelId)
  }, [currentLevelId, initLevel])

  /**
   * 进入下一关
   */
  const handleNextLevel = useCallback(() => {
    setModalInfo({ isOpen: false, type: '', levelName: '' })
    const nextId = currentLevelId + 1
    setCurrentLevelId(nextId)
    initLevel(nextId)
  }, [currentLevelId, initLevel])

  /**
   * 返回选择关卡
   */
  const handleSelectLevel = useCallback(() => {
    setModalInfo({ isOpen: false, type: '', levelName: '' })
    setGameState(GAME_STATE.SELECT)
  }, [])

  /**
   * 选择关卡
   */
  const handleLevelSelect = useCallback((levelId) => {
    setCurrentLevelId(levelId)
    initLevel(levelId)
  }, [initLevel])

  return (
    <div className="app">
      <header className="header">
        <h1>🐑 羊了个羊 🐑</h1>
        <div className="level-info">
          {gameState === GAME_STATE.PLAYING && currentLevel && (
            <span className="level-badge">
              第 {currentLevel.id} 关 · {currentLevel.name}
            </span>
          )}
        </div>
      </header>

      <main className="main-content">
        {gameState === GAME_STATE.SELECT && (
          <LevelSelect onSelect={handleLevelSelect} currentLevel={currentLevelId} />
        )}

        {(gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.WIN || gameState === GAME_STATE.LOSE) && (
          <>
            <BlockBoard
              blocks={blocks}
              blocksPerLayer={currentLevel?.blocksPerLayer || 16}
              levelConfig={currentLevel}
              onBlockClick={handleBlockClick}
            />

            <SlotBoard slot={slot} />

            <ToolBar tools={tools} onUseTool={handleUseTool} />

            {gameState !== GAME_STATE.PLAYING && (
              <Modal
                isOpen={modalInfo.isOpen}
                type={modalInfo.type}
                levelName={modalInfo.levelName}
                onRestart={handleRestart}
                onNextLevel={handleNextLevel}
                onSelectLevel={handleSelectLevel}
                hasNextLevel={hasNextLevel}
              />
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>点击方块移动到下方槽位，三个相同即可消除</p>
      </footer>
    </div>
  )
}
