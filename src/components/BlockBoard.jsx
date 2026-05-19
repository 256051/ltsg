/**
 * 方块面板组件
 * 显示所有层叠的方块
 */

import React from 'react'
import Block from './Block.jsx'
import { getItemTypesForLevel } from '../data/items.js'
import { canClickBlock } from '../utils/gameLogic.js'
import './BlockBoard.css'

export default function BlockBoard({ blocks, blocksPerLayer, levelConfig, onBlockClick }) {
  const itemTypes = getItemTypesForLevel(levelConfig.itemTypes)
  const { layers } = levelConfig

  // 按层分组渲染（底层先渲染，上层后渲染覆盖）
  const layerBlocks = []
  for (let l = 0; l < layers; l++) {
    layerBlocks.push(blocks.filter(b => b.layer === l))
  }

  return (
    <div className="block-board">
      {/* 每层网格 */}
      {layerBlocks.map((layerBlocksOnLayer, layerIndex) => (
        <div
          key={layerIndex}
          className="block-layer"
          style={{
            gridTemplateColumns: `repeat(${Math.sqrt(blocksPerLayer)}, 50px)`,
            zIndex: layerIndex
          }}
        >
          {/* 填充空位 */}
          {Array.from({ length: blocksPerLayer }).map((_, index) => {
            const block = layerBlocksOnLayer.find(b => b.index === index)
            return (
              <div key={index} className="block-slot">
                {block && (
                  <Block
                    block={block}
                    itemTypes={itemTypes}
                    canClick={canClickBlock(block, blocks, blocksPerLayer)}
                    onClick={() => onBlockClick(block)}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
