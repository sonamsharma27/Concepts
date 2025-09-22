const controller = new AbortController();
const ref = useRef(null);
const fetchData = async () => {
  if (!hasMore) return;
  setLoading(true);
  try {
    const res = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${(page - 1) * 10}`,
      {
        signal: controller.signal,
      }
    );
    const json = await res.json();

    setData((prev) => [...prev, ...json.products]);
    setTotal(json.total);
    setHasMore(data.length + json.products.length < json.total);
  } catch (e) {
    console.error("Error fetching data", e);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
  return () => controller.abort();
}, [page]);

//use ref for observer and current element
useEffect(() => {
  if (!ref || !ref.current) {
    ref.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
  }
  const observer = ref.current;
  const current = observerRef.current;
  if (current) observer.observe(current);

  return () => {
    if (current) observer.unobserve(current);
  };
}, [loading, hasMore]);

return (
  <table>
    <tbody>
      {data.map((item, index) => (
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
