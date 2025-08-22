import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
const CATEGORIES = [
  "Все",
  "Технологии",
  "Бизнес",
  "Культура",
  "Спорт",
  "Наука",
  "Мир",
];// Предполагается, что категории хранятся здесь

export function Footer() {
  return (
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
            <a key={c} className="hover:underline" href="#">
              {c}
            </a>
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
  );
}