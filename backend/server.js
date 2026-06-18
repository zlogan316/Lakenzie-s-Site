// Lakenzie's site — backend
// A tiny Express server. Right now the site is just a "Coming Soon" page,
// so this only answers a couple of health checks. Add real routes here when
// the games need them.
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Open this in a browser to confirm the backend is alive.
app.get('/', (req, res) => {
  res.type('text').send("LaKenzie's site backend is running 🌸");
});

// JSON health check the frontend can call later.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend ready on http://localhost:${PORT}`);
});
