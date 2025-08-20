import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tag, Sun, Moon } from "lucide-react";
import { useState } from "react";

function ModeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setDark((d) => !d);
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark");
        }
      }}
      aria-label="Переключить тему"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function TagCloud({ selected, toggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((t) => (
        <Button
          key={t}
          size="sm"
          variant={selected.has(t) ? "default" : "outline"}
          className="rounded-2xl"
          onClick={() => toggle(t)}
        >
          <Tag className="mr-1 h-4 w-4" /> {t}
        </Button>
      ))}
    </div>
  );
}

function CategoryPills({ active, onChange} ) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <Badge
          key={c}
          variant={active === c ? "default" : "secondary"}
          className={cn(
            "cursor-pointer rounded-2xl px-3 py-1 text-sm transition",
            active === c && "shadow"
          )}
          onClick={() => onChange(c)}
        >
          {c}
        </Badge>
      ))}
    </div>
  );
}

export function Header({ category, setCategory, tags, toggleTag, setSort, }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-6 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:-mx-8 md:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Логотип */}
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span className="font-semibold">Daily Pulse</span>
          <Badge variant="outline" className="ml-2">beta</Badge>
        </div>

        {/* Правая часть (видна только на средних и больших экранах) */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Фильтры */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Фильтры
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 space-y-4">
              <div>
                <div className="mb-2 text-xs uppercase text-muted-foreground">Категории</div>
                <CategoryPills active={category} onChange={setCategory} />
              </div>
              <Separator />
              <div>
                <div className="mb-2 text-xs uppercase text-muted-foreground">Теги</div>
                <TagCloud selected={tags} toggle={toggleTag} />
              </div>
            </PopoverContent>
          </Popover>

          {/* Сортировка */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                Сортировка <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSort("new")}>
                Новизне
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("popular")}>
                Популярности
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Переключатель темы */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}