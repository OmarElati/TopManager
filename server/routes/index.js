import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
// import projectRoutes from "./projectRoutes.js";
import boardRoutes from "./boardRoutes.js";

const router = express.Router();

router.use("/user", userRoutes); //api/user/login
router.use("/task", taskRoutes);
// router.use("/projects", projectRoutes);
router.use("/board", boardRoutes);

export default router;
