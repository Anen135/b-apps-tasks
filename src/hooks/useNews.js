import { useEffect, useState } from "react";
export function useNews({ query, category, tags, sort, order, }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (category !== "Все") params.append("category", category);
        if (tags.size) params.append("tag", [...tags][0]);
        params.append("sort", sort);
        params.append("order", order);
        const res = await fetch(`/api/news?${params}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setArticles(json.data.items || []);
      } catch (e) {
        setError(e.message || "Не удалось загрузить новости.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [query, category, tags, sort, order]);
  return { articles, loading, error };
}