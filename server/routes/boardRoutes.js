// routes/boardRoutes.js
import express from 'express';
import { getBoard, createColumn, updateColumn, deleteColumn, getTasks, addTaskToColumn, moveTask } from '../controllers/boardController.js';
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get('/', getBoard, protectRoute);
router.post('/column', createColumn, protectRoute);
router.put('/column/:id', updateColumn, protectRoute);
router.delete('/column/:id', deleteColumn, protectRoute);
router.get('/tasks', getTasks, isAdminRoute, protectRoute);
router.post('/tasks', protectRoute, addTaskToColumn);  // Adding tasks
router.put('/tasks/move', protectRoute, moveTask);  // Moving tasks between columns

export default router;
