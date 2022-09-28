import React, { useState, useEffect } from 'react';
import ExampleService from '../services/ExampleService';

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const [aaa, setAaa] = useState(null);

  useEffect(() => {
    ExampleService.getExampleData()
    .then(data => setAaa(data))
  },[])

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <p>aaa value is: {aaa}</p>
    </div>
  );
}