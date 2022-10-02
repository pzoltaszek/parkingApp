import React, { useState, useEffect } from 'react';
import ExampleService from '../services/ExampleService';

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    ExampleService.getExampleData()
    .then(data => setAllUsers(data))
  },[])

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      {allUsers.map(user => {
        return <p key={user.email}>{user.email}</p>
      })}
    </div>
  );
}