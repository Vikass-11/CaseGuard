import express from 'express';
import { getUsers, createUser, updateUserRole, getAuditLogs, deleteUser } from '../controllers/AdminController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/audit-logs', getAuditLogs);

export default router;
