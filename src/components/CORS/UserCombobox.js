/* eslint-disable react-hooks/exhaustive-deps */
/* UserCombobox.js */
import { useState, useEffect, useRef } from "react";
import useRequest from "@/hooks/useRequest";
import { Combobox } from "@/components/ui/combobox";

export function UserCombobox({ onSelect }) {
    const [users, setUsers] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { request } = useRequest();
    const debounceTimeout = useRef(null);
    const controllerRef = useRef(null);

    const searchUsers = async (query) => {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        const { signal } = controllerRef.current;

        try {
            const url = query
                ? `/api/users?search=${encodeURIComponent(query)}&limit=10`
                : '/api/users?limit=10';

            const res = await request('GET', url, { signal });

            if (!res.success || !Array.isArray(res.data)) {
                setUsers([]);
                return;
            }

            setUsers(res.data.map(user => ({ id: user.id, label: user.login })));
            setResult(res.data);
        } catch (err) {
            if (err.name !== 'AbortError') console.error(err);
        }
    };

    const handleSelect = (item, isQuery) => {
        if (isQuery) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => searchUsers(item), 300);
        } else {
            setSelectedUser(item);
            onSelect(result.find(user => user.id === item.id));
        }
    };

    useEffect(() => {
        searchUsers();
    }, []);

    return (
        <Combobox
            items={users}
            selectedItem={selectedUser}
            onSelect={handleSelect}
            placeholder="Выберите пользователя..."
        />
    );
}
