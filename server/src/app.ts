import path from 'path';
import express from 'express';

const app = express();

// server react app client
const buildPath = '../../client/build';
app.use(express.static(path.join(__dirname, buildPath)));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, buildPath, 'index.html'));
});

export default app;
