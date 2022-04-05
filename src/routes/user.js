const { Router } = require('express');
const { authenticate } = require("../middleware/authentication");
const { getApi, allbills, createProject, allProjects, oneProject, getRoomMessages } = require('../controllers/user');
const userRouter = Router();


userRouter.get('/takeApi', authenticate, getApi);
userRouter.get("/allbills", authenticate, allbills);
userRouter.post("/createProject", authenticate, createProject);
userRouter.get('/projects', authenticate, allProjects);
userRouter.get('/project', authenticate, oneProject);
userRouter.get('/roomMessages', authenticate, getRoomMessages);


module.exports = userRouter;