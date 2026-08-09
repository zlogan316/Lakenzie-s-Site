const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.type('text').send("LaKenzie's site backend is running 🌸");
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend ready on http://localhost:${PORT}`);
});
