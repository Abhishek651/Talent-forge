const {generateResumePdf} = require("../services/ai.service");


/**
 * @route post/api/my-resume/pdf
 * @description generate own resume pdf from self description
 */

async function generateMyResumePdfController(req, res) {
  try {
    const { selfDescription } = req.body;
    console.log("Received self-description for resume PDF generation:", selfDescription);
    if (!selfDescription) {
      return res.status(400).json({
        message: "Self-description is required",
      });
    }

    // Pass empty strings for resumeText and jobDescription to stay consistent 
    // with what the AI service likely expects.
    const resumePdf = await generateResumePdf({ 
      selfDescription, 
      resumeText: "", 
      jobDescription: "",
      mode: "generic"
    });

    res.set({
      "Content-Type": "application/pdf",

      "Content-Disposition":
        `attachment; filename=resume.pdf`,
    });

    return res.send(resumePdf.pdfBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    return res.status(500).json({
      message: "Failed to generate resume PDF. Please try again.",
    });
  }
}


module.exports = {generateMyResumePdfController}
