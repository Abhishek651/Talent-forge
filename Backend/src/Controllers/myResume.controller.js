const resumeDetailModal = require("../models/resumeDetails");
const blacklistModal = require("../models/blacklist");

const { generateResumePdf } = require("../services/ai.service");

/**
 * @route post/api/my-resume/pdf
 * @description generate own resume pdf from self description
 */

async function generateMyResumePdfController(req, res) {
  try {
    const { selfDescription } = req.body;
    console.log(
      "Received self-description for resume PDF generation:",
      selfDescription,
    );
    if (!selfDescription) {
      return res.status(400).json({
        message: "Self-description is required",
      });
    }

    const resumePdf = await generateResumePdf({
      selfDescription,
      resumeText: "",
      jobDescription: "",
      mode: "generic",
    });

    return res.status(200).json({ success: true, data: resumePdf.resumeData });
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    return res.status(500).json({
      message: "Failed to generate resume PDF. Please try again.",
    });
  }
}

async function saveResumeDetailsController(req, res) {
  console.log("resume detail controller running......");

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = req.body;

    // `...data` spreads (copies) every key-value pair from the `data` object
    // into the update object.
    //
    // Example:
    // data = {
    //   fullName: "John",
    //   email: "john@example.com",
    //   age: 22
    // }
    //
    // {
    //   ...data,
    //   user: userId,
    //   raw: data
    // }
    //
    // becomes:
    //
    // {
    //   fullName: "John",
    //   email: "john@example.com",
    //   age: 22,
    //   user: userId,
    //   raw: { fullName: "John", email: "john@example.com", age: 22 }
    // }
    //
    // Mongoose uses this object to update (or insert, if `upsert: true`) the document.
    //
    // With `strict: true` (default):
    //   - Only fields defined in the schema are persisted.
    //   - Unknown fields are ignored.
    //
    // With `strict: false`:
    //   - All fields from `data`, including unknown ones, are persisted.

    // One resume per user: update if exists, create if not
    const savedResume = await resumeDetailModal.findOneAndUpdate(
      { user: userId },
      { ...data, user: userId, raw: data },
      {
        returnDocument: "after", // returns new updated doc
        upsert: true, //create if not found (update or insert)
        runValidators: false,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Resume details saved successfully",
      data: savedResume,
    });
  } catch (err) {
    console.error("Error saving resume details:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save resume details",
    });
  }
}

async function getResumeDetailController(req,res){
  // console.log("Get resume detail controller running......");

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await resumeDetailModal.findOne({user:userId});
    // console.log(data)
    return res.status(200).json({
      success: true,
      message: "Resume details fetched successfully",
      data: data,
    })
  }catch(err){
    console.error("Error fetching resume details:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume details",
    })
  }
}

module.exports = { generateMyResumePdfController, saveResumeDetailsController, getResumeDetailController};
