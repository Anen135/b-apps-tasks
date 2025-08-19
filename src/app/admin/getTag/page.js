'use client'

import React, { useState } from "react";
import { UserCombobox } from "@/components/CORS/UserCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import SaveButton from "@/components/CORS/SaveButton";
import useRequest from "@/hooks/useRequest";
import { motion } from "framer-motion";
import Image from "next/image";


export default function UserTagPage() {
  const allTags = ["admin", "test", "editor", "viewer", "serpensys"];
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { loading, request } = useRequest();

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedTags(user.tags || []);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const saveTagsToBackend = async () => {
    if (!selectedUser) throw new Error("Пользователь не выбран");
    try {
      await request("PUT", `/api/users/${selectedUser.id}`, {
        body: { tags: selectedTags },
      });
    } catch (error) {
      console.error("Ошибка сохранения тегов:", error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-800"
      >
        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
          Управление тегами пользователя
        </h3>

        <div className="flex items-center gap-2 mb-4">
            {selectedUser &&
            <Image
                src={selectedUser?.avatarUrl || '/unset_avatar.png'}
                alt="Аватар"
                width={64}
                height={64}
                style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                }}
            />}
          <UserCombobox onSelect={handleUserSelect} />
          {selectedUser && (
            <SaveButton
              size="icon"
              loading={loading}
              disabled={!selectedTags.length}
              onSave={saveTagsToBackend}
              className="shrink-0"
            />
          )}
        </div>

        {!selectedUser && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            Выберите пользователя, чтобы настроить его теги.
          </p>
        )}

        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <p className="text-base mb-2">
              <span className="font-medium">Выбран:</span> {selectedUser.login}
            </p>

            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Теги пользователя
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
