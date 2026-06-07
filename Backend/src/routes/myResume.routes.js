const { Router } = require("express");
const myResumeRouter = Router();
const { generateMyResumePdfController } = require("../Controllers/myResume.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route POST /api/my-resume/pdf
 * @description Generate own resume PDF from self-description
 * @access Private
 */
myResumeRouter.post("/pdf", authMiddleware, generateMyResumePdfController);

module.exports = myResumeRouter;