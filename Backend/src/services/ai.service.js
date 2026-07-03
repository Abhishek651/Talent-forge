const { OpenRouter } = require("@openrouter/sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const aiService = require("./provider");
const interviewPrompt = require("./prompts/interviewPrompt");
const genericResumePrompt = require('./prompts/genericResumePrompt');
const specificResumePrompt = require('./prompts/specificResumePrompt');


// Creates connection to OpenRouter AI
const openRouterAI = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function generateInterviewReport({
  jobDescription,
  resumeText,
  selfDescription,
}) {
  console.log("Data received in AI service:", {
    jobDescription,
    resumeText,
    selfDescription,
  });

  const prompt = interviewPrompt(jobDescription, resumeText, selfDescription);

  // Stream the response to get reasoning tokens in usage
  // console.log("Using model:", process.env.Model);
  const responseString = await aiService(prompt);
  console.log(responseString);

  /**
   * Clean the response string to remove markdown code blocks
   * AI sometimes wraps JSON in ```json ... ```
   * It also sometimes adds rogue bolding like **"key"** instead of "key"
   */
  const cleanedResponse = responseString
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .replace(/\*\*"([^"]+)"\*\*/g, '"$1"')
    .trim();

  return JSON.parse(cleanedResponse);
}


// ==============================
// RESUME SCHEMA
// ==============================

const resumeSchema = z.object({
  name: z.string().default(""),

  title: z.string().optional().default(""),

  contact: z
    .object({
      email: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      location: z.string().optional().default(""),
      linkedin: z.string().optional().default(""),
      github: z.string().optional().default(""),
    })
    .optional()
    .default({}),

  summary: z.string().optional().default(""),

  skills: z
    .array(
      z.object({
        category: z.string().default(""),
        items: z.array(z.string()).default([]),
      }),
    )
    .optional()
    .default([]),

  experience: z
    .array(
      z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        duration: z.string().default(""),
        points: z.array(z.string()).default([]),
      }),
    )
    .optional()
    .default([]),

  internships: z
    .array(
      z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        duration: z.string().default(""),
        points: z.array(z.string()).default([]),
      }),
    )
    .optional()
    .default([]),

  projects: z
    .array(
      z.object({
        name: z.string().default(""),
        link: z.string().optional().default(""),
        points: z.array(z.string()).default([]),
      }),
    )
    .optional()
    .default([]),

  education: z
    .array(
      z.object({
        degree: z.string().default(""),
        institute: z.string().default(""),
        duration: z.string().default(""),
      }),
    )
    .optional()
    .default([]),

  certifications: z
    .array(
      z.object({
        title: z.string().default(""),
        description: z.string().default(""),
      }),
    )
    .optional()
    .default([]),

  achievements: z.array(z.string()).optional().default([]),

  publications: z
    .array(
      z.object({
        title: z.string().default(""),
        publisher: z.string().default(""),
        year: z.string().default(""),
      }),
    )
    .optional()
    .default([]),

  volunteerWork: z
    .array(
      z.object({
        role: z.string().default(""),
        organization: z.string().default(""),
        description: z.string().default(""),
      }),
    )
    .optional()
    .default([]),

  positionsOfResponsibility: z
    .array(
      z.object({
        position: z.string().default(""),
        organization: z.string().default(""),
      }),
    )
    .optional()
    .default([]),
});

// ==============================
// GENERATE RESUME DATA
// ==============================

async function generateResumeData({
  resumeText,
  selfDescription,
  jobDescription,
  mode,
}) {
  const selfDescriptionText =
    typeof selfDescription === "string"
      ? selfDescription
      : JSON.stringify(selfDescription, null, 2);

  const genericPrompt = genericResumePrompt(selfDescriptionText);

  const specificPrompt = specificResumePrompt(jobDescription,resumeText,selfDescriptionText, resumeSchema);

  console.log("data received in generateResumeData:", selfDescriptionText);
  console.log("prompt mode : ", mode);

  const prompt = mode === "specific" ? specificPrompt : genericPrompt;
  console.log("Using prompt:", prompt);

  try {
    console.log("using prompt : ", prompt);
    let responseString = await aiService(prompt);

    // CLEAN RESPONSE
    responseString = responseString
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(responseString);

    // VALIDATE RESPONSE
    const validatedData = resumeSchema.parse(parsedData);

    return validatedData;
  } catch (error) {
    console.error("Resume Generation Error:", error);
    throw new Error("Failed to generate resume data");
  }
}

// ==============================
// COMPLETE PIPELINE
// ==============================

async function generateResumePdf({
  resumeText,
  selfDescription,
  jobDescription,
  mode = "specific",
}) {
  try {
    const resumeData = await generateResumeData({
      resumeText,
      selfDescription,
      jobDescription,
      mode,
    });
    console.log("Generated Resume Data:", resumeData);
    return { success: true, resumeData };
  } catch (error) {
    console.error("Resume Pipeline Error:", error);
    throw new Error("Resume PDF generation failed");
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
