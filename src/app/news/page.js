'use client';
import React, { useMemo, useState } from "react";
import { Card, CardContent, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectorPills } from "@/components/SelectPills";
import { ExternalLink, } from "lucide-react";
import { ArticleControls } from "@/components/trash/NewsTrash";
import { ArticleCard } from "@/components/news/ArticleCard"

// --- mock data --------------------------------------------------------------
const CATEGORIES = [
  "Все",
  "Global",
  "Design",
];

const AUTHORS = {
  "Anen": {
    name: "Anen",
    avatar: "https://avatars.githubusercontent.com/u/158497427?v=4",
    role: "Тимлид",
  }
};

const ARTICLES = [
  {
    id: 0,
    title: "Добавлены новости",
    category: "Global",
    excerpt: "Теперь у нас есть новости, в которых мы можем обозначать новые функции в приложений.",
    cover: "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=60",
    author: AUTHORS.Anen,
    date: new Date('2025-08-19').toISOString(),
    readTime: 4,
    trending: false,
    tags: ["Global"]
  },
  {
    id: 1,
    title: "Цветовая тема",
    category: "Design",
    excerpt: "У нас цветовая тема: Фиолетовый + Чёрный. Корпоративный стиль. Графовая схема. Контрастный цвет - бирюзовый.",
    cover: "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=60",
    author: AUTHORS.Anen,
    date: new Date('2025-08-20').toISOString(),
    readTime: 4,
    trending: false,
    tags: ["Design"]
  }
]

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
      {/* Controls */}
      <ArticleControls query={query} setQuery={setQuery} category={category} setCategory={setCategory} tags={tags} toggleTag={toggleTag} />

      {/* Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SelectorPills pills={CATEGORIES} active={category} onChange={setCategory} />
          <div className="hidden items-center gap-2 md:flex">
            <div className="text-sm text-muted-foreground">Найдено: {filtered.length}</div>
            <Button variant="outline" className="gap-2 hidden">
              {/* Пока не добавим ссылку не будет отображаться*/}
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
      </div>
    </div>
  );
}
