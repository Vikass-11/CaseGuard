import express from 'express';
import { screenNarrative } from './services/screener';

const app = express();
app.use(express.json());

app.post('/screen', (req, res) => {
  const { narrative } = req.body;
  if (!narrative) {
    return res.status(400).json({ error: 'Narrative is required' });
  }

  const result = screenNarrative(narrative);
  res.json(result);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Screener service running on port ${PORT}`);
});
