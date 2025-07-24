'use client';

import { useEffect, useRef, useState } from 'react';
import ControlsPanel from '@/components/ControlsPanel';

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const gridSize = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
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
  }, [offset, zoom]);

  const handleMouseDown = (e) => {
    if (spacePressed) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
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

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: spacePressed ? 'grab' : 'default' }}
      />

      <ControlsPanel zoom={zoom} offset={offset} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
    </div>
  );
}