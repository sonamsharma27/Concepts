import React, { useState, useEffect, useRef } from 'react';

export default function SearchWithAbort() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const controllerRef = useRef(null);
  const debounceRef = useRef(null); //for timer

  useEffect(() => {
    // Skip empty queries
    if (!query) {
      setResults([]);
      return;
    }

    // Clear previous debounce timeout
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce the API call by 500ms
    debounceRef.current = setTimeout(() => {
      // Abort previous request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      // Create a new AbortController for the new request
      const controller = new AbortController();
      controllerRef.current = controller;

      // Fetch with AbortController
      fetch(`https://dummyjson.com/products/search?q=${query}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => {
          setResults(data.products);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log('Previous fetch aborted');
          } else {
            console.error('Fetch error:', err);
          }
        });
    }, 500); // Debounce delay

    return () => {
      // Clean up on component unmount
      if (controllerRef.current) controllerRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}



//Easier implementation

let controllerRef = useRef(null);

const fetchRes = ()=>{
    if(controllerRef.current){
        controllerRef.current.abort();
    }
     controllerRef.current = new AbortController();
     
     fetch(url,{
         signal: controllerRef.current.signal
     })
    
}

useEffect(()=>{
    let timer = setTimeout(fetchRes,300);
    return () => clearTimeout(timer);
},[input])