
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Balance } from '../shared/types';
import './index.css';

const socket = io();

function App() {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    axios.get('/api/balances').then((response) => {
      setBalances(response.data);
    });

    socket.on('balances', (newBalances: Balance[]) => {
      setBalances(newBalances);
    });
  }, []);

  const handleUpdate = () => {
    axios.get('/api/update');
  };

  return (
    <div className="app">
      <h1>Stellar EURMTL Balance History</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={balances}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

