import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import riskRoutes from './routes/riskRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', riskRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('Risk Service is running');
});

// Only start the server if this script is executed directly (not when imported in tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Risk service listening on port ${port}`);
  });
}

export default app;
