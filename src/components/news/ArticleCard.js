import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Share2, BookmarkPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image"


export function ArticleCard({ a }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-0 shadow-sm transition hover:shadow-md dark:bg-zinc-900 gap-2 pt-1">
        {a.cover && (<div className="relative">
          <Image src={a.cover} alt={a.title} className="h-48 w-full object-cover" fill />
          {a.trending && (
            <Badge className="absolute left-3 top-3 flex items-center gap-1 bg-orange-600">
              <Flame className="h-4 w-4" /> Тренд
            </Badge>
          )}
        </div>)}
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{a.category}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(a.createdAt).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="line-clamp-2 text-xl leading-snug">{a.title}</CardTitle>
          <CardDescription className="line-clamp-2">{a.excerpt}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {a.author ? (<>
              <Avatar className="h-8 w-8">
                <AvatarImage src={a.author.avatarUrl} alt={a.author.nickname} />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-sm font-medium">{a.author.nickname}</div>
                <div className="text-xs text-muted-foreground">{a.author.tags.join(", ")}</div>
              </div>
            </>
            ) : (<div className="text-sm text-muted-foreground">Системная новость</div>)}
          </div>
          <div className="items-center gap-2 hidden">
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