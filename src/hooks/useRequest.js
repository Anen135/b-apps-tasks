import { useState } from 'react';

export default function useRequest() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const request = async (method, url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(url, {
                method,
                headers: options.body ? { "Content-Type": "application/json" } : undefined,
                body: options.body ? JSON.stringify(options.body) : undefined,
                signal: options.signal,
            });

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            setData(data);
            return {
                step: `${method} ${url}`,
                success: res.ok,
                data,
            };
        } catch (err) {
            setError(err);
            return {
                step: `${method} ${url}`,
                success: false,
                data: { errorText: err.message, error: err.name},
            };
        } finally {
            setLoading(false);
        }
    };

    return { loading, data, error, request };
}
