import React, { useState, useEffect, useRef } from "react";

// Mock API function simulating paginated data
function mockApi({ limit, skip }) {
    const total = 50;
    const items = Array.from({ length: Math.min(limit, total - skip) }, (_, i) => ({
        id: skip + i + 1,
        title: `Item ${skip + i + 1}`,
        description: `Description for item ${skip + i + 1}`,
        price: (Math.random() * 100).toFixed(2),
    }));
    return new Promise((resolve) =>
        setTimeout(() => resolve({ products: items, total }), 500)
    );
}

export default function InfiniteScroll() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);

    const fetchData = async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await mockApi({ limit: 10, skip: (page - 1) * 10 });
            setData((prev) => [...prev, ...res.products]);
            setHasMore(data.length + res.products.length < res.total);
        } catch (e) {
            console.error("Error fetching data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }
        });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [loading, hasMore]);

    return (
        <table>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>{item.price}</td>
                    </tr>
                ))}
                <tr ref={observerRef}>
                    <td colSpan={3}>
                        {loading ? "Loading..." : hasMore ? "" : "No more data"}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}