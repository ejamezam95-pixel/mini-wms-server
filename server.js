const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let stock = [];
let history = [];

// Get current stock
app.get('/api/stock', (req, res) => {
  res.json(stock);
});

// Get outbound history
app.get('/api/history', (req, res) => {
  res.json(history);
});

// Stock In
app.post('/api/stock-in', (req, res) => {
  const { name, quantity, expiry } = req.body;
  if (!name || !quantity || !expiry) return res.status(400).json({ error: 'Fill all fields' });

  stock.push({ name, quantity, expiry });
  stock.sort((a, b) => new Date(a.expiry) - new Date(b.expiry)); // FEFO
  res.json({ message: 'Stock added', stock });
});

// Stock Out
app.post('/api/stock-out', (req, res) => {
  let { name, quantity } = req.body;
  if (!name || !quantity) return res.status(400).json({ error: 'Select item and quantity' });

  stock.sort((a, b) => new Date(a.expiry) - new Date(b.expiry)); // FEFO
  for (let i = 0; i < stock.length && quantity > 0; i++) {
    if (stock[i].name === name) {
      if (stock[i].quantity <= quantity) {
        quantity -= stock[i].quantity;
        stock.splice(i, 1);
        i--;
      } else {
        stock[i].quantity -= quantity;
        quantity = 0;
      }
    }
  }

  history.push({ name, quantity: req.body.quantity, date: new Date().toLocaleString() });
  res.json({ message: 'Stock removed', stock, history });
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
