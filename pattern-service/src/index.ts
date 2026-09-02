import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import patternRoutes from './routes/patternRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

app.use('/api', patternRoutes);

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', service: 'pattern-service' });
});

app.listen(port, () => {
  console.log(`Pattern service running on port ${port}`);
});
