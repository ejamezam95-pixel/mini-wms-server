
```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Contoh endpoint
app.get('/', (req, res) => {
  res.send('Mini WMS Server Berjalan');
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
```