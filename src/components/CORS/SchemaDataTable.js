"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

// Универсальный рендерер поля
function FieldRenderer({ field, value, onChange }) {
  if (field.component) {
    const Custom = field.component;
    return <Custom value={value} onChange={onChange} />;
  }

  switch (field.type) {
    case "string":
      return (
        <input
          className="border rounded px-2 py-1 w-full"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "enum":
      return (
        <select
          className="border rounded px-2 py-1 w-full"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.values?.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      );
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case "datetime":
      return (
        <input
          type="datetime-local"
          className="border rounded px-2 py-1 w-full"
          value={value ? new Date(value).toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
          }
        />
      );
    case "json":
      return (
        <textarea
          className="border rounded px-2 py-1 w-full font-mono"
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch (err) {
              // игнорируем ошибки парсинга
            }
          }}
        />
      );
    default:
      return <span>{String(value)}</span>;
  }
}

// Редактор записи
function RecordEditor({ schema, record, onSave }) {
  const [data, setData] = useState(record);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      {Object.entries(schema.fields).map(([key, field]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">{key}</label>
          {field.editable ? (
            <FieldRenderer
              field={field}
              value={data[key]}
              onChange={(val) => handleChange(key, val)}
            />
          ) : (
            <span className="text-gray-700">{String(data[key])}</span>
          )}
        </div>
      ))}

      <Button onClick={() => onSave(data)}>💾 Сохранить</Button>
    </motion.div>
  );
}

// Главная таблица
export default function SchemaDataTable({ schema, rows, onUpdate }) {
  const [editing, setEditing] = useState(null);

  return (
    <div className="w-full">
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {Object.keys(schema.fields).map((f) => (
              <th key={f} className="border px-2 py-1 text-left">
                {f}
              </th>
            ))}
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {Object.keys(schema.fields).map((f) => (
                <td key={f} className="border px-2 py-1">
                  {String(row[f])}
                </td>
              ))}
              <td className="border px-2 py-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditing(row)}>
                      ✏️ Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-6 rounded-2xl shadow-xl bg-white">
                    {editing && (
                      <RecordEditor
                        schema={schema}
                        record={editing}
                        onSave={(updated) => {
                          onUpdate(updated);
                          setEditing(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}