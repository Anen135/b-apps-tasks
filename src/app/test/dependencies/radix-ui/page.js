'use client';
// pages/radix-demo.jsx
import Breadcrumbs from '@/components/Breadcrumbs';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Tabs from '@radix-ui/react-tabs';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Toggle from '@radix-ui/react-toggle';
import * as Slider from '@radix-ui/react-slider';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function RadixDemo() {
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [toggleOn, setToggleOn] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [showLineNumbers, setShowLineNumbers] = React.useState(true)
  const [wrapText, setWrapText] = React.useState(false)
  const [position, setPosition] = React.useState("bottom")

  return (
    <main className="max-w-3xl mx-auto p-6 font-sans text-gray-900 bg-background">
      <div className="mb-8">
        <Breadcrumbs />
      </div>
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-600">Radix UI + TailwindCSS + Framer Motion Demo</h1>

      {/* Dialog */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Dialog (Modal)</h2>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Open Dialog
            </motion.button>
          </Dialog.Trigger>

          <AnimatePresence>
            {dialogOpen && (
              <>
                <Dialog.Overlay
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black"
                  />
                </Dialog.Overlay>

                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-80 shadow-lg focus:outline-none"
                    tabIndex={-1}
                  >
                    <Dialog.Title className="text-lg font-bold mb-2">Radix Dialog</Dialog.Title>
                    <Dialog.Description className="mb-6 text-gray-700">
                      Это пример модального окна с анимацией и красивым стилем.
                    </Dialog.Description>
                    <Dialog.Close asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                      >
                        Закрыть
                      </motion.button>
                    </Dialog.Close>
                  </motion.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </section>

      {/* DropdownMenu */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">DropdownMenu</h2>
        <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Dropdown Menu — все возможности</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Открыть меню</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/* Label */}
          <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
          {/* Group */}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Профиль
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Настройки
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Checkbox items */}
          <DropdownMenuCheckboxItem
            checked={showLineNumbers}
            onCheckedChange={setShowLineNumbers}
          >
            Показать номера строк
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={wrapText}
            onCheckedChange={setWrapText}
          >
            Переносить текст
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* Radio group */}
          <DropdownMenuLabel>Позиция тулбара</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={position}
            onValueChange={setPosition}
          >
            <DropdownMenuRadioItem value="top">Сверху</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Снизу</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Справа</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          {/* Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Больше опций</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Импорт</DropdownMenuItem>
              <DropdownMenuItem>Экспорт</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Настройки экспорта</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Destructive */}
          <DropdownMenuItem variant="destructive">
            Удалить проект
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
      </section>

      {/* Tooltip */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tooltip</h2>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="px-5 py-2 bg-indigo-600 text-white rounded shadow cursor-help focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Hover me
              </motion.button>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              align="center"
              sideOffset={6}
              className="bg-black text-white text-sm rounded px-3 py-1 select-none"
            >
              Tooltip text
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </section>

      {/* Tabs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
        <Tabs.Root defaultValue="tab1" className="flex flex-col">
          <Tabs.List className="flex space-x-4 border-b border-gray-300 mb-4">
            <Tabs.Trigger
              value="tab1"
              className={({ isActive }) =>
                "px-4 py-2 -mb-px font-semibold cursor-pointer focus:outline-none " +
                (typeof isActive === "boolean" && isActive
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600")
              }
            >
              Tab 1
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tab2"
              className={({ isActive }) =>
                "px-4 py-2 -mb-px font-semibold cursor-pointer focus:outline-none " +
                (typeof isActive === "boolean" && isActive
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600")
              }
            >
              Tab 2
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1" className="text-gray-700">
            Контент для вкладки 1.
          </Tabs.Content>
          <Tabs.Content value="tab2" className="text-gray-700">
            Контент для вкладки 2.
          </Tabs.Content>
        </Tabs.Root>
      </section>

      {/* Checkbox */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Checkbox</h2>
        <Checkbox.Root
          id="checkbox"
          className="flex items-center cursor-pointer space-x-2 focus:outline-none"
        >
          <div className="w-6 h-6 rounded border border-gray-400 flex items-center justify-center bg-white">
            <Checkbox.Indicator>
              <CheckIcon className="w-5 h-5 text-indigo-600" />
            </Checkbox.Indicator>
          </div>
          <label htmlFor="checkbox" className="select-none">
            Check me
          </label>
        </Checkbox.Root>
      </section>

      {/* Toggle */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Toggle</h2>
        <Toggle.Root
          pressed={toggleOn}
          onPressedChange={setToggleOn}
          className={`w-14 h-8 rounded-full cursor-pointer relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
            toggleOn ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <motion.div
            layout
            className="bg-white w-6 h-6 rounded-full shadow-md absolute top-1 left-1"
            animate={{ x: toggleOn ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
          />
        </Toggle.Root>
      </section>

      {/* Slider */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Slider</h2>
        <Slider.Root
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
          className="relative flex items-center select-none touch-none w-full h-6"
        >
          <Slider.Track className="bg-gray-300 relative flex-grow rounded-full h-2">
            <Slider.Range className="absolute bg-indigo-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-6 h-6 bg-indigo-600 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300" />
        </Slider.Root>
        <div className="mt-2 text-gray-700 font-medium">Value: {sliderValue[0]}</div>
      </section>

      {/* RadioGroup */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">RadioGroup</h2>
        <RadioGroup.Root
          defaultValue="option1"
          className="flex space-x-6 items-center"
        >
          {["option1", "option2"].map((opt) => (
            <label
              key={opt}
              htmlFor={opt}
              className="flex items-center cursor-pointer space-x-2 select-none"
            >
              <RadioGroup.Item
                value={opt}
                id={opt}
                className="w-6 h-6 rounded-full border border-gray-400 relative flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <RadioGroup.Indicator className="w-3 h-3 bg-indigo-600 rounded-full" />
              </RadioGroup.Item>
              <span className="capitalize">{opt.replace("option", "Option ")}</span>
            </label>
          ))}
        </RadioGroup.Root>
      </section>

      {/* Select */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Select</h2>
        <Select.Root>
          <Select.Trigger
            aria-label="Food"
            className="inline-flex items-center justify-between rounded border border-gray-400 px-4 py-2 min-w-[140px] cursor-pointer bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            <Select.Value placeholder="Select a fruit" />
            <Select.Icon>
              <ChevronDownIcon className="w-5 h-5 text-gray-700" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className="overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              position="popper"
              sideOffset={5}
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 text-gray-700 cursor-default">
                ▲
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {["Apple", "Banana", "Orange"].map((fruit) => (
                  <Select.Item
                    key={fruit}
                    value={fruit.toLowerCase()}
                    className="relative flex items-center rounded-md px-4 py-2 text-gray-900 cursor-pointer select-none hover:bg-indigo-600 hover:text-white"
                  >
                    <Select.ItemText>{fruit}</Select.ItemText>
                    <Select.ItemIndicator className="absolute right-2">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 text-gray-700 cursor-default">
                ▼
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </section>
    </main>
  );
}
