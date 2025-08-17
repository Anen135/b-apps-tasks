'use client'

import React, { useState } from "react";
import { UserCombobox } from "@/components/CORS/UserCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import SaveButton from "@/components/CORS/SaveButton";
import useRequest from "@/hooks/useRequest";

export default function UserTagPage() {
    const allTags = ["admin", "test", "editor", "viewer"];
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const {loading, request } = useRequest();

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSelectedTags(user.tags || []);
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };


    const saveTagsToBackend = async () => {
        if (!selectedUser) throw new Error("Пользователь не выбран");

        const tagsToSave = selectedTags.filter(tag => !allTags.includes(tag));
        console.log(tagsToSave);
        try {
            await request('PUT',`/api/users/${selectedUser.id}`, { body: { tags: tagsToSave } });
        } catch (error) {
            console.error("Ошибка сохранения тегов:", error);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 p-6">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Выбор пользователя</h3>

                <SaveButton
                    size="lg"
                    onSave={saveTagsToBackend}
                />
                <UserCombobox onSelect={handleUserSelect} />

                {selectedUser && (
                    <div className="mt-4">
                        <p>Выбран пользователь: {selectedUser.login}</p>
                        <h4 className="mt-2 mb-1 font-semibold">Теги пользователя:</h4>
                        <div className="flex flex-col gap-1">
                            {allTags.map(tag => (
                                <label key={tag} className="inline-flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedTags.includes(tag)}
                                        onCheckedChange={() => handleTagToggle(tag)}
                                    />
                                    <span>{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}