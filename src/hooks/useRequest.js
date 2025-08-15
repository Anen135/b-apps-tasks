import { useState } from 'react';

function useRequest() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const request = async (method, url, body = null) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(url, {
                method,
                headers: body ? { "Content-Type": "application/json" } : undefined,
                body: body ? JSON.stringify(body) : null,
            });

            const data = await res.json();
            setData(data);
            return {
                step: `${method} ${url}`,
                success: res.ok,
                data,
            };
        } catch (err) {
            setError(err.message);
            return {
                step: `${method} ${url}`,
                success: false,
                data: { error: err.message },
            };
        } finally {
            setLoading(false);
        }
    }

    return { loading, data, error, request };
}
