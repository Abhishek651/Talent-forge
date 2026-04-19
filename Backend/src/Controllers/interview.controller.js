const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.js");

/**
 * FLOW
 *
 * routes - /route => auth middleware => file upload middleware => controller
 */

/**
 * Controller: Generate Interview Report
 *
 * Flow:
 * 1. Receive uploaded resume (PDF) and form data
 * 2. Extract text from PDF
 * 3. Send data to AI service for analysis
 * 4. Store result in database
 * 5. Return response to client
 */

/**
 * @desc Generate an interview report based on job description, resume, and self-description
 * @route POST /api/interview/report
 */
async function generateInterviewReportController(req, res) {
  try {
    //Get uploaded file
    const resumeFile = req.file;
    // Extract input data from request body
    const { jobDescription, selfDescription } = req.body;
    // Validate file presence (allow self-description as alternative)
    if (!resumeFile && !selfDescription) {
      return res.status(400).json({
        message: "Either resume file or self-description is required",
      });
    }

    // Validate required fields
    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // Extract text from PDF or use self-description
    let resumeText;
    if (resumeFile) {
      const resumeData = await new pdfParse.PDFParse(
        Uint8Array.from(req.file.buffer),
      ).getText();
      resumeText = resumeData.text;
    } else {
      resumeText = selfDescription;
    }

    //Call AI service to generate report
    let interviewReportByAi;
    try {
      interviewReportByAi = await generateInterviewReport({
        jobDescription,
        resumeText,
        selfDescription,
      });
    } catch (error) {
      console.error("Service error:", error);
      if (
        error.statusCode === 503 ||
        error.message.includes("Service Unavailable")
      ) {
        return res.status(503).json({
          message:
            "Service is temporarily unavailable. Please try again in a few minutes.",
        });
      }
      return res.status(500).json({
        message: "Failed to generate interview report. Please try again.",
      });
    }

    // console.log("RAW AI RESPONSE:", interviewReportByAi);

    function safeParseArray(arr) {
      if (!Array.isArray(arr)) return [];

      return arr.map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }
        return item;
      });
    }

    const parsedReport = {
      ...interviewReportByAi,
      technicalQuestions: safeParseArray(
        interviewReportByAi.technicalQuestions,
      ),
      behavioralQuestions: safeParseArray(
        interviewReportByAi.behavioralQuestions,
      ),
      skillGaps: safeParseArray(interviewReportByAi.skillGaps),
      preparationPlan: safeParseArray(interviewReportByAi.preparationPlan),
    };

    // Save generated report to database
    const interviewReport = await interviewReportModel.create({
      // the JWT payload stores it as userId
      // req.user is set in the auth middleware after verifying the token, and it contains the decoded payload of the JWT.
      // The decoded payload (an object) is assigned to req.user.
      // Based on the middleware code, this payload typically includes fields like userId
      // and username (e.g., { userId: "someObjectId", username: "exampleUser" }).
      user: req.user.userId, // user from auth middleware
      jobTitle: interviewReportByAi.jobTitle || "Untitled Report", // Use first line of job description as title
      resumeText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi, // spread AI-generated fields
    });

    // Send success response
    return res.status(201).json({
      message: "Interview report generated successfully",
      data: interviewReportByAi,
    });
  } catch (err) {
    // Handle unexpected errors (AI failure, DB issues, parsing issues)
    console.error("Error generating interview report:", err);

    return res.status(500).json({
      message: "Failed to generate interview report",
    });
  }
}

async function getInterviewReportByIdController(req, res) {
  let interviewReport;
  try {
    const { reportId } = req.params;
    interviewReport = await interviewReportModel.findOne({
      _id: reportId,
      user: req.user.userId,
    });
  } catch (err) {
    console.error("Error fetching interview report:", err);
    return res.status(500).json({
      message: "Failed to fetch interview report",
    });
  }

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  return res.status(200).json({
    message: "Interview report fetched successfully",
    data: interviewReport,
  });
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.userId })
      .select("jobTitle createdAt") // Only these fields + _id
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Interview reports fetched successfully",
      data: interviewReports,
    });
  } catch (err) {
    console.error("Error fetching interview reports:", err);
    return res.status(500).json({
      message: "Failed to fetch interview reports",
    });
  }
}

async function getLatestInterviewReportController(req, res) {
  try {
    const latestReport = await interviewReportModel
      .findOne({ user: req.user.userId })
      .sort({ createdAt: -1 });

    if (!latestReport) {
      return res
        .status(404)
        .json({ message: "No interview reports found for this user." });
    }

    return res.status(200).json({
      message: "Latest interview report fetched successfully",
      data: latestReport,
    });
  } catch (err) {
    console.error("Error fetching latest interview report:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch latest interview report" });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  getLatestInterviewReportController,
};
