// import express from "express";
// import {
//   createProject,
//   getAllProjects,
//   updateProject,
//   deleteProject,
//   getProjectTasks,
//   createTask,
//   updateTask,
//   deleteTask
// } from "../controllers/projectController.js";
// import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewares.js";

// const router = express.Router();

// router.post('/create', protectRoute, isAdminRoute, createProject);
// router.get("/",protectRoute, getAllProjects);

// router.route("/:id")
//   .put(protectRoute, isAdminRoute, updateProject)
//   .delete(protectRoute, isAdminRoute, deleteProject); 


// router.route("/:id/tasks")
//   .get(protectRoute, getProjectTasks)
//   .post(protectRoute, isAdminRoute, createTask); 

// router.route("/:projectId/tasks/:taskId")
//   .put(protectRoute, isAdminRoute, updateTask)
//   .delete(protectRoute, isAdminRoute, deleteTask); 

// export default router;
