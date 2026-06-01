const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const interviewRouter = express.Router();
const {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  getLatestInterviewReportController,
  generateResumePdfController,
  deleteInterviewReportController,
} = require("../Controllers/interview.controller.js");
const upload = require("../middlewares/file.middleware.js");

/**
 * @route GET /api/interview/report/latest/:userId
 * @description Get the latest interview report for a specific user
 * @access Private
 */
interviewRouter.get(
  "/report/latest/:userId",
  authMiddleware,
  getLatestInterviewReportController,
);

/**
 * @route POST /api/interview/report
 * @desc Generate an interview report based on job description, resume, and self-description
 * @access Private)
 */

interviewRouter.post(
  "/report",
  authMiddleware,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route GET /api/interview/report/:reportId
 * @desc Get a specific interview report by ID
 * @access Private
 */
interviewRouter.get(
  "/report/:reportId",
  authMiddleware,
  getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/reports
 * @desc Get all interview reports for the authenticated user
 * @access Private
 */
interviewRouter.get(
  "/report",
  authMiddleware,
  getAllInterviewReportsController,
);

/** * @route POST /api/interview/report/resume-pdf
 * @description to generate resume pdf based on user's resume, self-description, and job description
 * @access Private
 */

interviewRouter.post(
  "/report/resume-pdf/:interviewReportId",
  authMiddleware,
  generateResumePdfController,
);

/**
 * @route DELETE /api/interview/report/:reportId
 * @description Delete a specific interview report by ID
 * @access Private
 */
interviewRouter.delete(
  "/report/:reportId",
  authMiddleware,
  deleteInterviewReportController,
);

module.exports = interviewRouter;
