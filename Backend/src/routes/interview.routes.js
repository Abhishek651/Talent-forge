const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const interviewRouter = express.Router();
const { generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController,
    getLatestInterviewReportController } = require('../Controllers/interview.controller.js');
const upload = require('../middlewares/file.middleware.js');

/**
 * @route GET /api/interview/report/latest/:userId
 * @description Get the latest interview report for a specific user
 * @access Private  
 */
interviewRouter.get('/report/latest/:userId', authMiddleware, getLatestInterviewReportController);


/**
 * @route POST /api/interview/report
 * @desc Generate an interview report based on job description, resume, and self-description
 * @access Private)
 */

interviewRouter.post('/report', authMiddleware, upload.single('resume'), generateInterviewReportController);


/**
 * @route GET /api/interview/report/:reportId
 * @desc Get a specific interview report by ID
 * @access Private
 */
interviewRouter.get('/report/:reportId', authMiddleware, getInterviewReportByIdController);

/**
 * @route GET /api/interview/reports
 * @desc Get all interview reports for the authenticated user
 * @access Private
 */
interviewRouter.get('/report', authMiddleware, getAllInterviewReportsController);



module.exports = interviewRouter;