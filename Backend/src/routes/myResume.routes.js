const { Router } = require("express");
const myResumeRouter = Router();
const { generateMyResumePdfController, saveResumeDetailsController, getResumeDetailController} = require("../Controllers/myResume.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route POST /api/my-resume/pdf
 * @description Generate own resume PDF from self-description
 * @access Private
 */
myResumeRouter.post("/pdf", authMiddleware, generateMyResumePdfController);


/**
 * @route POST /api/my-resume/save-details
 * @description save user resume detail to database
 */

myResumeRouter.post('/save-details', authMiddleware, saveResumeDetailsController);

/**
 * @route GET /api/my-resume/get-details
 * @description fetch user resume details from the db
 */

myResumeRouter.get('/get-details', authMiddleware, getResumeDetailController);

module.exports = myResumeRouter;