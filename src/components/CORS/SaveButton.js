/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Loader2, Save, X, AlertCircle} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

/**
 * Красивая, доступная кнопка сохранения на TailwindCSS + Radix Tooltip.
 *
 * Особенности:
 * - Состояния: idle / loading / success / error
 * - Подсказка (Radix Tooltip) с горячей клавишей ⌘/Ctrl + S
 * - Анимации: плавные переходы, спиннер, вспышка успеха
 * - Варианты размера: "md" | "lg" (по умолчанию md)
 * - Полностью управляемая через onSave (async)
 *
 * Пример:
 * ```jsx
 * <SaveButton onSave={async () => await api.save()} />
 * ```
 */


export default function SaveButton({
  onSave,
  label = "Сохранить",
  size = "md",
  className = "",
  shortcutEnabled = true,
}) {
  const [status, setStatus] = useState("idle");

  const sizing = useMemo(() => {
    return size === "lg"
      ? {
          pad: "px-5 py-3",
          text: "text-base",
          icon: 22,
        }
      : size === "icon" ? {
          pad: "px-2 py-2",
          text: "text-sm",
          icon: 18
      }
      : {
          pad: "px-4 py-2.5",
          text: "text-sm",
          icon: 18,
        };
  }, [size]);

  const doSave = useCallback(async () => {
    if (status === "loading") return;
    try {
      setStatus("loading");
      await Promise.resolve(onSave());
      setStatus("success");
      // немного показать успех
      setTimeout(() => setStatus("idle"), 1200);
    } catch (e) {
      console.error(e);
      setStatus("error");
      // вернуться к idle спустя паузу
      setTimeout(() => setStatus("idle"), 1500);
    }
  }, [onSave, status]);

  // Горячая клавиша ⌘/Ctrl + S
  useEffect(() => {
    if (!shortcutEnabled) return;
    const handler = (e) => {
      const isSave = (e.key === "s" || e.key === "S") && (e.metaKey || e.ctrlKey);
      if (isSave) {
        e.preventDefault();
        doSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [doSave, shortcutEnabled]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={doSave}
            disabled={isLoading}
            className={[
              "group relative inline-flex select-none items-center justify-center",
              "rounded-2xl font-medium tracking-[-0.01em]",
              sizing.pad,
              sizing.text,
              // фон
              "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30",
              // плавные состояния
              "transition-all duration-200",
              // hover / active
              "hover:bg-emerald-500 active:scale-[0.99]",
              // фокус-стили
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
              // отключено
              isLoading ? "opacity-80 cursor-not-allowed" : "",
              isError   ? "bg-red-600 shadow-lg shadow-red-600/30 hover:bg-red-500" : "",
              size==="icon" ? "gap-0" : "gap-2",
              // лёгкий стеклянный вид
              "ring-1 ring-white/10 backdrop-blur-sm",
              className,
            ].join(" ")}
          >
            {/* Градиентное свечение */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-emerald-500/0 via-emerald-400/10 to-emerald-300/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Иконка */}
            <span className="relative inline-flex items-center">
              {isLoading ? (
                <Loader2 size={sizing.icon} className="animate-spin" />
              ) : isSuccess ? (
                <Check size={sizing.icon} className="animate-in fade-in zoom-in duration-150" />
              ) : isError ? (
                <AlertCircle size={sizing.icon} className="animate-in fade-in zoom-in duration-150" />
              ) :
              (
                <Save size={sizing.icon} />
              )}
            </span>

            {/* Текст */}
            <span className="relative">
              {size=="icon" ? "" : isSuccess ? "Сохранено" : isError ? "Ошибка" : label}
            </span>

            {/* Микровспышка успеха */}
            <span
              aria-hidden
              className={[
                "pointer-events-none absolute inset-0 rounded-2xl",
                "transition-opacity duration-300",
                isSuccess ? "opacity-100 bg-white/10" : "opacity-0",
              ].join(" ")}
            />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Content
          sideOffset={10}
          className="z-50 rounded-xl border border-white/10 bg-neutral-900/95 px-3 py-2 text-xs text-white shadow-lg backdrop-blur supports-[backdrop-filter]:bg-neutral-900/70"
        >
          Нажмите для сохранения
          <div className="mt-1 flex items-center gap-1 opacity-80">
            <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px]">{navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl"}</kbd>
            <span>+</span>
            <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px]">S</kbd>
          </div>
          <Tooltip.Arrow className="fill-neutral-900/95" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// Небольшая демо-витрина (можно удалить)
export function DemoSaveButton() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <SaveButton
        size="lg"
        onSave={async () => {
          // Имитация запроса
          await new Promise((r) => setTimeout(r, 900));
          setCount((c) => c + 1);
        }}
      />
      <div className="text-sm text-neutral-500">Сохранений: {count}</div>
    </div>
  );
}
