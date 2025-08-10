'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString();
}

function Tags({ tags }) {
    return (!tags || !tags.length) ? <span style={{ color: '#999', fontStyle: 'italic' }}>Нет тегов</span> :
    (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tags.map((tag) => (
                <span
                    key={tag}
                    style={{
                        backgroundColor: '#0070f3',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                    }}
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

function UserData({ user }) {
    return (!user) ? <p>Данные пользователя отсутствуют</p> :
    (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                maxWidth: '500px',
                marginBottom: '1rem',
                backgroundColor: '#fafafa',
            }}
        >
            <Image
                src={user.image || '/avatars/unset_avatar.jpg'}
                alt="Аватар"
                width={64}
                height={64}
                style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                }}
            />
            <div>
                <p><strong>Имя:</strong> {user.name || 'Не указано'}</p>
                <p><strong>Email:</strong> {user.email || 'Не указано'}</p>
                <p><strong>ID:</strong> {user.id || 'Не указано'}</p>
                <p><strong>Login:</strong> {user.login || 'Не указано'}</p>
                <div>
                    <strong>Теги:</strong> <Tags tags={user.tags} />
                </div>
            </div>
        </div>
    );
}

export default function JWT() {
    const { data: session, status, update } = useSession();
    const [tokenData, setTokenData] = useState(null);
    const [loadingToken, setLoadingToken] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadToken = () => {
        setLoadingToken(true);
        return fetch('/api/users/me/token')
            .then(res => res.json())
            .then(data => setTokenData(data))
            .catch(err => { console.error('Ошибка получения токена:', err); setTokenData({ error: 'Не удалось получить токен' }); })
            .finally(() => setLoadingToken(false));
    }

    const refreshToken = () => {
        setRefreshing(true);
        return update()
            .then(() => loadToken())
            .catch(e => { console.error('Ошибка обновления токена', e); alert('Ошибка обновления токена'); })
            .finally(() => setRefreshing(false));
    }

    const deleteUser = () => {
        if (!session?.user?.id) {
            alert('ID пользователя не найден');
            return;
        }
        if (!confirm('Вы уверены, что хотите удалить пользователя? Это действие необратимо!')) return;
        setDeleting(true);
        fetch(`/api/users/${session.user.id}`, { method: 'DELETE' })
            .then(res => res.json().then(result => ({ res, result })))
            .then(({ res, result }) => {
                if (res.ok && result.success) alert('Пользователь успешно удалён');
                else alert('Ошибка удаления пользователя: ' + (result.error || 'Неизвестная ошибка'));
            })
            .catch(error => { console.error('Ошибка удаления пользователя:', error); alert('Ошибка удаления пользователя'); })
            .finally(() => setDeleting(false));
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' });
    }

    useEffect(() => {
        loadToken();
    }, []);

    return (
        <main style={{ padding: '2rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: 900, margin: '0 auto' }}>
            <Breadcrumbs />
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>JWT Token & Session Debug</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>useSession() данные</h2>
                <p style={{ marginBottom: '0.5rem', color: '#555' }}>
                    Статус: <strong>{status}</strong>
                </p>
                {session?.user ? (
                    <>
                        <UserData user={session.user} />
                        <p><strong>Полные данные сессии:</strong></p>
                        <pre style={{ backgroundColor: '#f6f8fa', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                            {JSON.stringify(session, null, 2)}
                        </pre>
                    </>
                ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>Сессия отсутствует или ещё загружается</p>
                )}
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>getToken() данные</h2>
                {loadingToken ? (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>Загрузка токена...</p>
                ) : tokenData ? (
                    <>
                        <UserData user={tokenData.user} />
                        <p><strong>Expires:</strong> {formatDate(tokenData.expires)}</p>
                        <p><strong>Полные данные токена:</strong></p>
                        <pre style={{ backgroundColor: '#f6f8fa', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                            {JSON.stringify(tokenData, null, 2)}
                        </pre>
                    </>
                ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>Токен отсутствует или не удалось загрузить</p>
                )}
                <button
                    onClick={refreshToken}
                    disabled={refreshing}
                    style={{
                        marginTop: '1rem',
                        marginRight: '1rem',
                        padding: '10px 20px',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    {refreshing ? 'Обновление...' : 'Обновить токен'}
                </button>

                <button
                    onClick={deleteUser}
                    disabled={deleting}
                    style={{
                        marginTop: '1rem',
                        marginRight: '1rem',
                        padding: '10px 20px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: deleting ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    {deleting ? 'Удаление...' : 'Удалить пользователя'}
                </button>

                <button
                    onClick={handleSignOut}
                    style={{
                        marginTop: '1rem',
                        padding: '10px 20px',
                        backgroundColor: '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    Выйти и очистить сессию
                </button>
            </section>
        </main>
    );
}
