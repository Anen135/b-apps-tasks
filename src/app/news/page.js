'use client';
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectorPills } from "@/components/SelectPills";
import { ExternalLink } from "lucide-react";
import { ArticleControls } from "@/components/trash/NewsTrash";
import { ArticleCard } from "@/components/news/ArticleCard";
import { ConsoleLoader } from "@/components/loading/ConsoleLoader";

const CATEGORIES = ["Все", "GLOBAL", "DESIGN", "PREVIEW"];

export default function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tags, setTags] = useState(new Set());
  const [sort, setSort] = useState("createdAt");
  const [order] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (category !== "Все") params.append("category", category);
        if (tags.size) {
          // Можно передавать только один тег для упрощения
          params.append("tag", [...tags][0]);
        }
        params.append("sort", sort);
        params.append("order", order);

        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const _data = await res.json();
        const data = _data.data.items;
        console.log('News data:', data);
        setArticles(data || []);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить новости.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [query, category, tags, sort, order]);

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
            <div className="text-sm text-muted-foreground">Найдено: {articles.length}</div>
            <Button variant="outline" className="gap-2 hidden">
              Открыть ленту <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 items-center justify-center">
              <div className="text-center text-muted-foreground">Загрузка...</div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : articles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 items-center justify-center">
              <div className="text-center text-muted-foreground">
                Ничего не найдено. Попробуйте изменить фильтры или поиск.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
