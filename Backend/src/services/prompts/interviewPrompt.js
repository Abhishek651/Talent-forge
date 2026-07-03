const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");


// Defines expected structure of the interview report using Zod schema
//zod is tool that say data must look like this
const interviewReportSchema = z.object({
  jobTitle: z.string().describe("The title of the job position."),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "The overall match score between the candidate and the job description.",
    ),
  scoreBreakdown: z
    .object({
      technical: z
        .number()
        .min(0)
        .max(100)
        .describe("The match score for technical skills."),
      communication: z
        .number()
        .min(0)
        .max(100)
        .describe("The match score for communication skills."),
      experience: z
        .number()
        .min(0)
        .max(100)
        .describe("The match score for relevant experience."),
    })
    .describe("The breakdown of the match score into different categories."),

  /**
     * - must be array
        - each item must be object
        - object must have:
        -question (string)
        -intention (string)
        -answer (string)
        
     */
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that may be asked in the interview.",
          ),
        intention: z
          .string()
          .describe("The intention behind the technical question."),
        answer: z
          .string()
          .describe(
            "how to  answer and main key points to cover in the answer.",
          ),
      }),
    )
    .min(5, "At least 5 technical questions are required."), // Minimum 5,
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that may be asked in the interview.",
          ),
        intention: z
          .string()
          .describe("The intention behind the behavioral question."),
        answer: z
          .string()
          .describe(
            "how to  answer and main key points to cover in the answer.",
          ),
      }),
    )
    .min(5, "At least 5 behavioral questions are required."), // Minimum 5,
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill that has a gap."),
      severity: z
        .enum(["low", "medium", "high"])
        .describe("The severity of the skill gap."),
    }),
  ),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number for the preparation plan."),
        tasks: z
          .array(z.string())
          .describe("The tasks to be completed on that day."),
        focus: z.string().describe("The main focus for that day."),
      }),
    )
    .min(7, "Generate a 7-day preparation plan.Day must a Number")
    .describe("The preparation plan for the interview."),
});

const interviewPrompt = (jobDescription,resumeText,selfDescription)=> `You are an expert HR AI Analyst. Generate a comprehensive interview report based on the provided Job Description, Resume, and Self-Description. 
    Return ONLY structured JSON that directly populates the following format:
    - jobTitle
    - matchScore (0-100)
    - scoreBreakdown (technical, communication, experience)
    - technicalQuestions (with question, intention, and answer)
    - behavioralQuestions (with question, intention, and answer)
    - skillGaps (skill and severity)
    - preparationPlan: An array of 7 objects, not a single object, each representing a day (e.g., [{ day: 1, tasks: ["task1", "task2"], focus: "Focus topic" }, { day: 2, ... }, { day: 3, ... }])

    IMPORTANT RULES:
    - Generate at least 5 technical questions and behavioral questions each.
    - day must be NUMBER (1,2,3) NOT "Day 1" or "1"
    - severity must be lowercase: "low", "medium", "high"
    - Do NOT stringify objects inside arrays.
    - technicalQuestions must be array of OBJECTS, not strings
    - behavioralQuestions must be array of OBJECTS
    - skillGaps must be array of OBJECTS
    - Do NOT skip fields.

    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}

    Self-Description:
    ${selfDescription}

    JSON Schema:
    ${JSON.stringify(zodToJsonSchema(interviewReportSchema), null, 2)}`;


module.exports = interviewPrompt;