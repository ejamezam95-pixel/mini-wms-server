const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint root
app.get('/', (req, res) => {
    res.send('Server berjalan!');
});

// Endpoint status
app.get('/status', (req, res) => {
    res.json({ status: 'Server aktif', timestamp: new Date() });
});

// Endpoint contoh untuk simpan item WMS
let items = [];
app.post('/item', (req, res) => {
    const item = req.body;
    if(!item.nama || !item.kuantiti) {
        return res.status(400).json({ message: 'Sila sertakan nama dan kuantiti item' });
    }
    items.push(item);
    res.json({ message: 'Item diterima', item });
});

// Endpoint untuk dapatkan semua item
app.get('/items', (req, res) => {
    res.json({ items });
});

app.listen(PORT, () => {
    console.log('Server berjalan pada port ' + PORT);
});
