// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json()); // untuk parse JSON dari frontend
app.use(express.static('public')); // serve folder public (index.html & assets)

// Simpan stock dan history dalam memory (untuk simple demo)
let stock = [];
let history = [];

// ========================
// API Endpoints
// ========================

// Tambah stock (Inbound)
app.post('/api/stock/in', (req, res) => {
  const { name, quantity, expiry } = req.body;
  if (!name || !quantity || !expiry) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  stock.push({ name, quantity, expiry });
  // FEFO: sort by earliest expiry first
  stock.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
  return res.json({ message: 'Stock added', stock });
});

// Keluarkan stock (Outbound)
app.post('/api/stock/out', (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ message: 'Item name and quantity required' });
  }

  let qtyToRemove = quantity;
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

  history.push({ name, quantity, date: new Date().toLocaleString() });
  return res.json({ message: 'Stock removed', stock, history });
});

// Ambil stock semasa
app.get('/api/stock', (req, res) => {
  return res.json({ stock });
});

// Ambil history outbound
app.get('/api/history', (req, res) => {
  return res.json({ history });
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => console.log(`Server berjalan pada port ${PORT}`));
