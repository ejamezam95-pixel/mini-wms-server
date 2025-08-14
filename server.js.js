const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Server berjalan!');
});

app.listen(PORT, () => {
    console.log('Server berjalan pada port ' + PORT);
});
