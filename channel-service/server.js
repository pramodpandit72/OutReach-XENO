import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import channelRoutes from './routes/channelRoutes.js';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'OutReach Channel Service running 📡' }));
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/channel', channelRoutes);

app.listen(PORT, () => {
  console.log(`📡 OutReach Channel Service running on http://localhost:${PORT}`);
});
