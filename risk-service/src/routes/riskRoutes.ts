import { Router } from 'express';
import { assessRisk } from '../controllers/RiskController';

const router = Router();

router.post('/assess-risk', assessRisk);

export default router;
