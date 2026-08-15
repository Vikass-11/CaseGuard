import express from 'express';
import { getUsers, updateUserRole, getAuditLogs } from '../controllers/AdminController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/audit-logs', getAuditLogs);

export default router;
