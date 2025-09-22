import { useEffect, useState, useRef } from "react";
import { searchData } from "./searchApi";
export default function SearchBar() {
  const [input, setInput] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const controllerRef = useRef();
  const handleClick = (e) => {
    const { val } = e.target.dataset;
    if (!val) return;
    if (val !== input) {
      setInput(val);
    }
  };

  const renderSearchRes = () => {
    if (input.length === 0 || searchRes?.length === 0) return null;
    return (
      <div
        className="container"
        onClick={handleClick}
        style={{ padding: "10px", margin: "10px", border: "1px solid grey" }}
      >
        {searchRes?.map((res, idx) => (
          <div key={idx} data-val={res.title}>
            {res.title}
          </div>
        ))}
      </div>
    );
  };

  const mockApi = (input) => {
    console.log(input);
    const res = searchData.filter((item) =>
      item.toLowerCase().includes(input.trim().toLowerCase())
    );
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res);
      }, 500);
    });
  };

  const fetchData = async () => {
    if (input.length === 0) {
      setSearchRes([]);
      return;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const apiResp = await fetch(
      "https://dummyjson.com/products/search?q=" + input,
      { signal: controllerRef.current.signal }
    );
    const json = await apiResp.json();
    setSearchRes(json.products);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);
  return (
    <div>
      <input
        style={{ padding: "10px", margin: "10px" }}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {renderSearchRes()}
    </div>
  );
}
