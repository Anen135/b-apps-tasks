export default function ControlsPanel({ zoom, offset, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white/80 p-2 rounded shadow">
      <button onClick={onZoomIn} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">+</button>
      <button onClick={onZoomOut} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">-</button>
      <button onClick={onReset} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">Reset</button>
      <div className="text-sm text-gray-700 mt-2">
        <div><strong>Zoom:</strong> {zoom.toFixed(2)}</div>
        <div><strong>Offset:</strong> x: {offset.x.toFixed(0)}, y: {offset.y.toFixed(0)}</div>
      </div>
    </div>
  );
}
