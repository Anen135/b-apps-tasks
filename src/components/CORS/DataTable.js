'use client';
import { useState, useMemo } from 'react';

export default function DataTable({
  data,
  columns,
  itemsPerPage = 10,
  enableSearch = true,
  enableSort = true,
  enablePagination = true,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(columns[0]?.key || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // фильтрация
  const filtered = useMemo(() => {
    let res = data;

    if (enableSearch && search) {
      res = res.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (enableSort && sortKey) {
      res = [...res].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        const aIsDate = !isNaN(aDate.getTime());
        const bIsDate = !isNaN(bDate.getTime());
        if (aIsDate && bIsDate) {
          return sortOrder === 'asc'
            ? aDate - bDate
            : bDate - aDate;
        }

        return sortOrder === 'asc'
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      });
    }

    return res;
  }, [data, search, sortKey, sortOrder]);

  // пагинация
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const current = enablePagination ? filtered.slice(startIndex, startIndex + itemsPerPage) : filtered;

  return (
    <div className="w-full">
      {enableSearch && (
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mb-4 w-full sm:w-60"
        />
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map(col => (
              <th
                key={col.key}
                className="border px-4 py-2 cursor-pointer select-none"
                onClick={() => {
                  if (!enableSort) return;
                  if (sortKey === col.key) {
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortKey(col.key);
                    setSortOrder('asc');
                  }
                }}
              >
                {col.label}
                {sortKey === col.key && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="border px-4 py-2">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {current.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={col.key} className="border px-4 py-2">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="border px-4 py-2 flex gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="px-2 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Редактировать
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Удалить
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {enablePagination && totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 border rounded"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 border rounded"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
