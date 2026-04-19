const { OpenRouter } = require("@openrouter/sdk");
const {z} = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

// Creates connection to OpenRouter AI
const openRouterAI = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// Defines expected structure of the interview report using Zod schema
//zod is tool that say data must look like this
const interviewReportSchema = z.object({
    jobTitle: z.string().describe("The title of the job position."),
    matchScore: z.number().min(0).max(100).describe("The overall match score between the candidate and the job description."),
     scoreBreakdown: z.object({
        technical: z.number().min(0).max(100).describe("The match score for technical skills."),
        communication: z.number().min(0).max(100).describe("The match score for communication skills."),
        experience: z.number().min(0).max(100).describe("The match score for relevant experience.")
    }).describe("The breakdown of the match score into different categories."),

    /**
     * - must be array
        - each item must be object
        - object must have:
        -question (string)
        -intention (string)
        -answer (string)
        
     */
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that may be asked in the interview."),
        intention: z.string().describe("The intention behind the technical question."),
        answer: z.string().describe("how to  answer and main key points to cover in the answer.")
    })).min(5, "At least 5 technical questions are required."),  // Minimum 5,
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that may be asked in the interview."),
        intention: z.string().describe("The intention behind the behavioral question."),
        answer: z.string().describe("how to  answer and main key points to cover in the answer.")
    })).min(5, "At least 5 behavioral questions are required."),  // Minimum 5,
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that has a gap."),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap."),
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number for the preparation plan."),
        tasks: z.array(z.string()).describe("The tasks to be completed on that day."),
        focus: z.string().describe("The main focus for that day.")
    })).min(7, "Generate a 7-day preparation plan.Day must a Number").describe("The preparation plan for the interview."),
});

async function generateInterviewReport({jobDescription, resumeText, selfDescription}){

    console.log("Data received in AI service:", { jobDescription, resumeText, selfDescription });

    const prompt = `You are an expert HR AI Analyst. Generate a comprehensive interview report based on the provided Job Description, Resume, and Self-Description. 
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

    // Stream the response to get reasoning tokens in usage
    console.log('Using model:', process.env.Model);
    const stream = await openRouterAI.chat.send({
      chatRequest: {
        model: process.env.Model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        /**
         * Normal (Non-Streaming)
         * Request → AI → (wait...) → Full response comes
         * 
         * Streaming (stream: true)
         * Request → AI → response comes in small chunks
         * Chunk 1 → "{"
            Chunk 2 → " \"matchScore\""
            Chunk 3 → ": 85"
            Chunk 4 → "}"
            Faster UI   show data instantly
            But can also break json due to chunk streaming
         */
        stream: true
      }
    });

    let responseString = "";
    // Note: To successfully parse the streamed response blocks, access chunk using choice checks
    for await (const chunk of stream) {
        /**
         * The response comes in small chunks
         * “Safely check if content exists”
         */
      if (chunk?.choices?.[0]?.delta?.content) {
        responseString += chunk.choices[0].delta.content;
        process.stdout.write(chunk.choices[0].delta.content); // Stream out to console
      }

      // Usage information comes in the final chunk
      if (chunk?.usage) {
        console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
      }
    }


    /**
     * Clean the response string to remove markdown code blocks
     * AI sometimes wraps JSON in ```json ... ```
     * It also sometimes adds rogue bolding like **"key"** instead of "key"
     */
    // let cleanedResponse = responseString
    //   .replace(/```json\s*/g, '')
    //   .replace(/```\s*/g, '')
    //   .replace(/\*\*"([^"]+)"\*\*/g, '"$1"') // Fixes **"intention"** formatting
    //   .trim();

    /**
     * String (text) → JavaScript Object
     * const responseString = '{ "matchScore": 85 }';
     * wit parse => response = { matchScore: 85 }
     */
    return JSON.parse(responseString);
};

module.exports = { generateInterviewReport };