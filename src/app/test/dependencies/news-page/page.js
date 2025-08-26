'use client'
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Flame,
  Newspaper,
  Search,
  Filter,
  Sun,
  Moon,
  ChevronDown,
  BookmarkPlus,
  ExternalLink,
  Calendar,
  Tag,
  Share2,
} from "lucide-react";
import Image from "next/image";

// --- mock data --------------------------------------------------------------
const CATEGORIES = [
  "Все",
  "Технологии",
  "Бизнес",
  "Культура",
  "Спорт",
  "Наука",
  "Мир",
];

const TAGS = [
  "AI",
  "Стартапы",
  "Финансы",
  "Медиа",
  "Кибербезопасность",
  "Космос",
  "Игры",
  "Мобайл",
];

const AUTHORS = [
  {
    name: "Анна Крылова",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60",
    role: "Редактор",
  },
  {
    name: "Дмитрий Орлов",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&q=60",
    role: "Обозреватель",
  },
  {
    name: "Мария Иванова",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=256&q=60",
    role: "Журналист",
  },
];

const ARTICLES = Array.from({ length: 12 }).map((_, i) => {
  const category = CATEGORIES[(i % (CATEGORIES.length - 1)) + 1];
  const tags = [TAGS[i % TAGS.length], TAGS[(i + 3) % TAGS.length]];
  const author = AUTHORS[i % AUTHORS.length];
  const date = new Date();
  date.setDate(date.getDate() - (i * 2 + 1));
  return {
    id: i + 1,
    title:
      i % 3 === 0
        ? "Искусственный интеллект меняет правила игры"
        : i % 3 === 1
        ? "Как стартапы переживают турбулентность рынка"
        : "Новая гонка в космос: что происходит",
    category,
    excerpt:
      "Короткий анонс статьи: емко, интригующе и по делу. Нажмите, чтобы узнать подробности и увидеть аналитику.",
    cover: `https://images.unsplash.com/photo-${
      [
        "1495020689067-958852a7765e",
        "1496307042754-b4aa456c4a2d",
        "1518770660439-4636190af475",
        "1504805572947-34fad45aed93",
        "1526378722370-6cb70ac6b7f0",
      ][i % 5]
    }?auto=format&fit=crop&w=1600&q=60`,
    author,
    date: date.toISOString(),
    readTime: 4 + (i % 6),
    trending: i < 5,
    tags,
  };
});

const FEATURED = ARTICLES[1];

// --- helper components ------------------------------------------------------
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

function CategoryPills({
  active,
  onChange,
}) {
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

function ArticleCard({ a }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-0 shadow-sm transition hover:shadow-md dark:bg-zinc-900">
        <div className="relative">
          <Image src={a.cover } alt={a.title} width={1600} height={900} className="h-48 w-full object-cover" />
          {a.trending && (
            <Badge className="absolute left-3 top-3 flex items-center gap-1 bg-orange-600">
              <Flame className="h-4 w-4" /> Тренд
            </Badge>
          )}
        </div>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{a.category}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(a.date).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>{a.readTime} мин</span>
          </div>
          <CardTitle className="line-clamp-2 text-xl leading-snug">{a.title}</CardTitle>
          <CardDescription className="line-clamp-2">{a.excerpt}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={a.author.avatar} alt={a.author.name} />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-medium">{a.author.name}</div>
              <div className="text-xs text-muted-foreground">{a.author.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Share2 className="mr-1 h-4 w-4" /> Поделиться
            </Button>
            <Button size="sm" variant="default">
              <BookmarkPlus className="mr-1 h-4 w-4" /> В закладки
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- main page --------------------------------------------------------------
export default function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tags, setTags] = useState(new Set());
  const [sort, setSort] = useState("new");

  const filtered = useMemo(() => {
    let list = ARTICLES.slice();

    if (category !== "Все") list = list.filter((a) => a.category === category);

    if (tags.size) list = list.filter((a) => a.tags.some((t) => tags.has(t)));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sort === "popular") return Number(b.trending) - Number(a.trending);
      return +new Date(b.date) - +new Date(a.date);
    });

    return list;
  }, [category, query, sort, tags]);

  const toggleTag = (t) => {
    setTags((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* Header */}
      <header className="sticky top-0 z-20 -mx-4 mb-6 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:-mx-8 md:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            <span className="font-semibold">Daily Pulse</span>
            <Badge variant="outline" className="ml-2">beta</Badge>
          </div>

          <div className="hidden items-center gap-2 md:flex">
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

            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero / Featured */}
      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="relative col-span-2 overflow-hidden border-0 shadow-sm">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            src={FEATURED.cover}
            alt={FEATURED.title}
            className="h-80 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Badge className="mb-2 w-fit">{FEATURED.category}</Badge>
            <h2 className="mb-2 line-clamp-2 text-2xl font-bold md:text-3xl">{FEATURED.title}</h2>
            <p className="mb-4 line-clamp-2 text-muted-foreground">{FEATURED.excerpt}</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={FEATURED.author.avatar} />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="text-sm text-muted-foreground">
                {FEATURED.author.name} • {new Date(FEATURED.date).toLocaleDateString()} • {FEATURED.readTime} мин
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5" /> В тренде
            </CardTitle>
            <CardDescription>Самые обсуждаемые материалы сегодня</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                {ARTICLES.filter((a) => a.trending).map((a) => (
                  <HoverCard key={a.id}>
                    <HoverCardTrigger asChild>
                      <div className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-muted">
                        <Image src={a.cover} alt="cover" width={1600} height={900} className="h-14 w-20 rounded object-cover" />
                        <div>
                          <div className="line-clamp-2 text-sm font-medium">{a.title}</div>
                          <div className="text-xs text-muted-foreground">{a.readTime} мин • {a.category}</div>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="text-sm">{a.excerpt}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{new Date(a.date).toLocaleString()}</div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* Controls */}
      <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск статей, тегов, авторов..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
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
        </div>
      </section>

      {/* Content */}
      <Tabs defaultValue="latest" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="latest">Последние</TabsTrigger>
          <TabsTrigger value="popular">Популярные</TabsTrigger>
          <TabsTrigger value="saved">Сохранённые</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="space-y-6">
          <div className="flex items-center justify-between">
            <CategoryPills active={category} onChange={setCategory} />
            <div className="hidden items-center gap-2 md:flex">
              <div className="text-sm text-muted-foreground">Найдено: {filtered.length}</div>
              <Button variant="outline" className="gap-2">
                Открыть ленту <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex h-40 items-center justify-center">
                <div className="text-center text-muted-foreground">
                  Ничего не найдено. Попробуйте изменить фильтры или поиск.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.filter((a) => a.trending).map((a) => (
              <ArticleCard key={a.id} a={a} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <Card className="border-dashed">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-20 rounded" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Здесь появятся ваши сохранённые статьи.
              </div>
              <Button className="w-fit">Войти</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="mt-12 grid grid-cols-1 gap-6 border-t pt-8 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <Newspaper className="h-5 w-5" /> Daily Pulse
          </div>
          <p className="text-sm text-muted-foreground">
            Красивый шаблон новостной страницы на TailwindCSS + Radix (shadcn/ui).
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="font-medium">Разделы</div>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            {CATEGORIES.slice(1).map((c) => (
              <a key={c} className="hover:underline" href="#">{c}</a>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium">Подписка на рассылку</div>
          <div className="flex gap-2">
            <Input placeholder="ваш@email.com" />
            <Button>Подписаться</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
