'use client';

import { useEffect, useRef, useState } from 'react';
import AddBlockWidget from '@/components/editor/AddBlockWidget';
import { drawTextBlock } from '@/components/editor/TextBlock';
import ControlsPanel from '@/components/editor/ControlsPanel';
import BlockSettingsPanel from '@/components/editor/BlockSettingsPanel';

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [draggingBlockIndex, setDraggingBlockIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


  const gridSize = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

  // Отрисовка сетки
  const drawGrid = (ctx, canvas, offset, zoom, gridSize) => {
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    const step = gridSize;

    const startX = -offset.x / zoom;
    const startY = -offset.y / zoom;
    const endX = startX + canvas.width / zoom;
    const endY = startY + canvas.height / zoom;

    for (let x = Math.floor(startX / step) * step; x < endX; x += step) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }

    for (let y = Math.floor(startY / step) * step; y < endY; y += step) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }

    ctx.stroke();
    ctx.restore();
  };


  const drawBlocks = (ctx, blocks, offset, zoom) => {
    blocks.forEach(block => drawTextBlock(ctx, block, offset, zoom));
  };


  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas, offset, zoom, gridSize);
    drawBlocks(ctx, blocks, offset, zoom);

    animationFrameId = requestAnimationFrame(draw);
  };


  const handleKeyDown = (e) => {
    const {activeElement} = document;
    const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

  // sourcery skip: use-braces
    if (isTyping) return;

    if (e.code === 'Space') {
      e.preventDefault();
      setSpacePressed(true);
    }
  };

  const handleKeyUp = (e) => {
    const {activeElement} = document;
    const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

    // sourcery skip: use-braces
    if (isTyping) return;

    if (e.code === 'Space') {
      e.preventDefault();
      setSpacePressed(false);
    }
  };


    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [offset, zoom, blocks]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - offset.x) / zoom;
    const my = (e.clientY - rect.top - offset.y) / zoom;

    if (spacePressed) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    // Проверка попадания в блок
    const index = blocks.findIndex(
      (b) => mx >= b.x && mx <= b.x + 150 && my >= b.y && my <= b.y + 50
    );

    if (index !== -1) {
      setDraggingBlockIndex(index);
      setDragOffset({ x: mx - blocks[index].x, y: my - blocks[index].y });
    }
  };


const handleMouseMove = (e) => {
  if (isPanning) {
    setOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  }

  if (draggingBlockIndex !== null) {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - offset.x) / zoom;
    const my = (e.clientY - rect.top - offset.y) / zoom;

    const newBlocks = [...blocks];
    newBlocks[draggingBlockIndex] = {
      ...newBlocks[draggingBlockIndex],
      x: mx - dragOffset.x,
      y: my - dragOffset.y,
    };
    setBlocks(newBlocks);
  }
};


const handleMouseUp = () => {
  setIsPanning(false);
  setDraggingBlockIndex(null);
};


  const handleWheel = (e) => {
    const scaleAmount = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(zoom + scaleAmount, 0.1), 5);

    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = mx - offset.x;
    const dy = my - offset.y;

    const ratio = newZoom / zoom;

    setOffset({
      x: mx - dx * ratio,
      y: my - dy * ratio,
    });

    setZoom(newZoom);
  };

  const resetView = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.1));
  };

  const addTextBlock = (text, color) => {
    const blockWidth = 150;
    const blockHeight = 50;

    // Найти свободное место
    let x = 0;
    let y = 0;
    const spacing = 10;

    const isOverlapping = (x, y) => {
      return blocks.some(b =>
        x < b.x + blockWidth &&
        x + blockWidth > b.x &&
        y < b.y + blockHeight &&
        y + blockHeight > b.y
      );
    };

    // Простой алгоритм поиска места без пересечений
    while (isOverlapping(x, y)) {
      x += blockWidth + spacing;
      if (x > 1000) {
        x = 0;
        y += blockHeight + spacing;
      }
    }

    setBlocks([...blocks, { x, y, text, color, textColor: '#000000' }]);
  };

  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - offset.x) / zoom;
    const my = (e.clientY - rect.top - offset.y) / zoom;

    const foundIndex = blocks.findIndex(
      (b) => mx >= b.x && mx <= b.x + 150 && my >= b.y && my <= b.y + 50
    );

    if (foundIndex !== -1) {
      setSelectedBlockIndex(foundIndex);
    } else {
      setSelectedBlockIndex(null);
    }
  };

  const updateBlock = (updated) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === selectedBlockIndex ? { ...b, ...updated } : b))
    );
  };

  const deleteBlock = () => {
    setBlocks((prev) => prev.filter((_, i) => i !== selectedBlockIndex));
    setSelectedBlockIndex(null);
  };


  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: spacePressed ? 'grab' : 'default' }}
      />

      <ControlsPanel zoom={zoom} offset={offset} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-4 items-end pointer-events-none">
        <div className="pointer-events-auto">
          <AddBlockWidget onAdd={addTextBlock} />
        </div>
        
        {selectedBlockIndex !== null && (
          <div className="pointer-events-auto">
            <BlockSettingsPanel
              block={blocks[selectedBlockIndex]}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
            />
          </div>
        )}
      </div>



    </div>
  );
}
