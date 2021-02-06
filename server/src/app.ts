import path from 'path';
import express from 'express';

const app = express();

// server react app client
app.use(express.static(path.join(__dirname, '../../client/build')));

export default app;
