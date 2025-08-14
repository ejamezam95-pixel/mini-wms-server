// server.js
const express = require('express');
const bodyParser = require('body-parser'); // boleh kekal, walaupun Express ada express.json()
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // serve /public untuk index.html & assets

let stock = [];
let history = [];

// --- API ---
app.get('/api/stock', (req, res) => res.json(stock));
app.get('/api/history', (req, res) => res.json(history));

app.post('/api/stock-in', (req, res) => {
  const { name, quantity, expiry } = req.body;
  if (!name || !quantity || !expiry) {
    return res.status(400).json({ error: 'Fill all fields' });
  }
  stock.push({ name, quantity, expiry });
  // FEFO: ikut tarikh luput paling awal dahulu
  stock.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
  res.json({ message: 'Stock added', stock });
});

app.post('/api/stock-out', (req, res) => {
  let { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: 'Select item and quantity' });
  }
  let qtyToRemove = Number(quantity);
  stock.sort((a, b) => new Date(a.expiry) - new Date(b.expiry)); // FEFO
  for (let i = 0; i < stock.length && qtyToRemove > 0; i++) {
    if (stock[i].name === name) {
      if (stock[i].quantity <= qtyToRemove) {
        qtyToRemove -= stock[i].quantity;
        stock.splice(i, 1);
        i--;
      } else {
        stock[i].quantity -= qtyToRemove;
        qtyToRemove = 0;
      }
    }
  }
  history.push({ name, quantity: Number(quantity), date: new Date().toLocaleString() });
  res.json({ message: 'Stock removed', stock, history });
});

// Route root untuk pastikan / buka index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server berjalan pada port ${PORT}`));
