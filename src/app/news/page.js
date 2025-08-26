'use client';
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectorPills } from "@/components/SelectPills";
import { ExternalLink } from "lucide-react";
import { ArticleControls } from "@/components/trash/NewsTrash";
import { ArticleCard } from "@/components/news/ArticleCard";

const CATEGORIES = ["Все", "GLOBAL", "DESIGN", "PREVIEW"];

export default function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tags, setTags] = useState(new Set());
  const [sort, setSort] = useState("createdAt");
  const [order] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Все загруженные статьи (глобальный кэш)
  const [allArticles, setAllArticles] = useState([]);

  // ✅ Фильтрация локально по кэшу
  const filteredArticles = useMemo(() => {
    let result = [...allArticles];

    if (query) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        (a.content && a.content.toLowerCase().includes(query.toLowerCase()))
      );
    }
    if (category !== "Все") {
      result = result.filter(a => a.category === category);
    }
    if (tags.size) {
      result = result.filter(a => a.tags?.some(t => tags.has(t)));
    }

    // Сортировка
    result.sort((a, b) => {
      const valA = a[sort];
      const valB = b[sort];
      return order === "desc" ? (valA > valB ? -1 : 1) : (valA > valB ? 1 : -1);
    });

    return result;
  }, [allArticles, query, category, tags, sort, order]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/news`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const _data = await res.json();
        const data = _data.data.items;

        // Добавляем в кэш, избегая дубликатов
        setAllArticles(prev => {
          const ids = new Set(prev.map(a => a.id));
          const merged = [...prev];
          data.forEach(item => {
            if (!ids.has(item.id)) merged.push(item);
          });
          return merged;
        });
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить новости.");
      } finally {
        setLoading(false);
      }
    };

    // Загружаем при первом рендере
    fetchNews();
  }, []);

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
      <ArticleControls
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        tags={tags}
        toggleTag={toggleTag}
      />

      {/* Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SelectorPills pills={CATEGORIES} active={category} onChange={setCategory} />
          <div className="hidden items-center gap-2 md:flex">
            <div className="text-sm text-muted-foreground">Найдено: {filteredArticles.length}</div>
            <Button variant="outline" className="gap-2 hidden">
              Открыть ленту <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : filteredArticles.length === 0 && !loading ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 items-center justify-center">
              <div className="text-center text-muted-foreground">
                Ничего не найдено. Попробуйте изменить фильтры или поиск.
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {loading && (
              <div className="text-center text-muted-foreground mb-2">Загрузка новых данных...</div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
