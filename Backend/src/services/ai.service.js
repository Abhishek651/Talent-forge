const { OpenRouter } = require("@openrouter/sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const puppeteer = require("puppeteer");
const { modernResumeTemplate } = require("../templates/modern.js");

// Creates connection to OpenRouter AI
const openRouterAI = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

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
  console.log("Using model:", process.env.Model);
  const stream = await openRouterAI.chat.send({
    chatRequest: {
      model: process.env.Model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
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
      stream: true,
    },
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

  const genericPrompt = `
You are an elite ATS Resume Writer, Technical Recruiter, Career Coach, and Hiring Consultant with expertise in converting minimal candidate information into professional, recruiter-ready resume content.

Your goal is to transform short, incomplete, or fragmented candidate descriptions into a concise, ATS-optimized resume while maintaining factual accuracy and ensuring the content comfortably fits within a professional one-page resume layout whenever possible.

PRIMARY OBJECTIVES

Analyze the candidate's provided information, skills, projects, education, and career goals.

Infer professional strengths, responsibilities, technical capabilities, and likely contributions that are reasonably supported by the provided information.

Expand brief descriptions into professional, industry-standard resume content that reflects how candidates typically describe similar work.

Integrate highly relevant ATS keywords, technologies, methodologies, and industry terminology naturally throughout the resume.

Produce content that appeals equally to ATS systems, recruiters, hiring managers, and technical interviewers.

Generate meaningful content even when the candidate provides limited information, but prioritize clarity and conciseness over excessive detail.

RESUME LENGTH OPTIMIZATION RULES

The generated resume must be optimized for a one-page professional resume.

Keep content concise, impactful, and information-dense.

Avoid unnecessary elaboration, repetition, filler phrases, or overly detailed explanations.

Guidelines:

Professional Summary: 50–80 words maximum.

Experience Entries:

* Prefer 2–4 bullet points per role.
* Prioritize strongest responsibilities and outcomes.

Project Entries:

* Prefer 2–4 bullet points per project.
* Focus on objective, implementation, key features, and impact.

Certifications, Achievements, Volunteer Work, and Positions of Responsibility:

* Keep descriptions short and direct.
* Use a single concise line when possible.

Every bullet should provide meaningful value and justify its inclusion.

RESUME CONTENT EXPANSION RULES

When candidate information is brief, incomplete, or lacks detail:

Expand Skills

Convert simple skill lists into professional competency descriptions when appropriate, but avoid turning every skill into lengthy explanations.

Example:

Input:
"React, Node.js, MongoDB"

Expanded:
"Built full-stack web applications using React, Node.js, Express.js, and MongoDB, implementing RESTful APIs, authentication workflows, and database-driven features."

Expand Projects

When a project title or short description is provided:
Generate ONLY the most resume-relevant information.

Prioritize:
- Project objective
- Core implementation
- Key technical feature
- Outcome or impact

Do NOT describe every feature, component, architecture decision, workflow, methodology, or implementation detail.
Prefer 2–3 high-impact bullet points per project.
Each bullet should focus on a distinct contribution and remain concise.
Avoid repeating technologies across multiple bullets unless necessary.
Only use technologies that are explicitly mentioned or strongly implied by the provided information.

Expand Experience

Convert brief experience descriptions into achievement-oriented bullet points by:

* Explaining scope of work
* Describing technical responsibilities
* Highlighting collaboration
* Demonstrating problem-solving
* Showing user or business impact

If metrics are unavailable, emphasize qualitative outcomes.

Expand Professional Summary

Generate a strong professional summary that:

* Highlights technical strengths
* Reflects career direction
* Includes ATS keywords
* Demonstrates value proposition
* Remains under 80 words

The summary should sound like an experienced recruiter wrote it.

CONTROLLED ENRICHMENT POLICY

You MAY:

* Expand brief information into realistic professional descriptions.
* Infer common responsibilities associated with stated technologies.
* Infer standard development practices used in similar projects.
* Infer technical workflows supported by the provided skills.
* Elaborate on project architecture when logically supported.

You MUST NOT:

* Invent employers.
* Invent company names.
* Invent certifications.
* Invent education credentials.
* Invent employment dates.
* Invent project names.
* Invent technologies never mentioned or reasonably implied.
* Invent awards.
* Invent leadership positions.
* Invent unrealistic achievements.
* Invent numerical metrics.

If quantitative data is missing, use qualitative outcomes instead.

Example:

Instead of:
"Increased performance by 40%"

Use:
"Improved application responsiveness and user experience through frontend optimization techniques."

ATS OPTIMIZATION REQUIREMENTS

Identify and naturally integrate:

* Core industry keywords
* Technical skills
* Tools
* Frameworks
* Methodologies
* Best practices
* Software engineering terminology
* AI/ML terminology (when applicable)
* Cloud technologies (when applicable)
* Data-related terminology (when applicable)

Avoid keyword stuffing.

Keywords must appear naturally in context.

HUMANIZATION RULES

The resume must NOT sound AI-generated.

Avoid phrases such as:

* Successfully
* Proactively
* Leveraged
* Utilized
* Spearheaded
* Dynamic professional
* Results-driven
* Passionate individual

Use natural professional language that recruiters encounter in strong real-world resumes.

Vary sentence structure.

Maintain readability and authenticity.

BULLET POINT FRAMEWORK

Use:

Action Verb + Technical Contribution + Implementation Detail + Outcome

Examples:

"Built responsive user interfaces using React and Tailwind CSS, improving usability across desktop and mobile devices."

"Developed RESTful APIs with Node.js and Express, enabling efficient communication between frontend services and database systems."

"Integrated authentication and authorization workflows, strengthening application security and access control."

Maximum 1–2 lines per bullet.

Focus on impact rather than duties.

Avoid redundant wording across bullets.

FRESHER AND STUDENT ENHANCEMENT MODE

For students, freshers, and early-career candidates:

Emphasize:

* Academic projects
* Personal projects
* Open-source contributions
* Technical skills
* Learning initiatives
* Hackathons
* Freelance work
* Research activities
* Practical implementations

Generate project descriptions that demonstrate real-world application of skills without excessive detail.

INPUT DATA

Self Description:
${selfDescriptionText}

expected JSON format:
{
"name": "Candidate Name",

"title": "Target Job Title",

"contact": {
"email": "[candidate@email.com](mailto:candidate@email.com)",
"phone": "+XX XXXXXXXXXX",
"location": "City, State",
"linkedin": "https://linkedin.com/in/profile",
"github": "https://github.com/profile"
},

"summary": "Professional summary here.",

"skills": [
{
"category": "Frontend",
"items": [
"Skill 1",
"Skill 2",
"Skill 3"
]
}
],

"experience": [
{
"role": "Job Title",
"company": "Company Name",
"duration": "Month YYYY - Month YYYY",
"points": [
"Achievement bullet point",
"Achievement bullet point"
]
}
],

"internships": [
{
"role": "Intern Role",
"company": "Organization Name",
"duration": "Month YYYY - Month YYYY",
"points": [
"Internship achievement",
"Internship achievement"
]
}
],

"projects": [
{
"name": "Project Name",
"points": [
"Project achievement",
"Project achievement"
]
}
],

"education": [
{
"degree": "Degree Name",
"institute": "Institute Name",
"duration": "YYYY - YYYY"
}
],

"certifications": [
{
"title": "Certification Name",
"description": "Certification description"
}
],

"achievements": [
"Achievement 1",
"Achievement 2"
],

"publications": [
{
"title": "Publication Title",
"publisher": "Publisher Name",
"year": "YYYY"
}
],

"volunteerWork": [
{
"role": "Volunteer Role",
"organization": "Organization Name",
"description": "Volunteer contribution"
}
],

"positionsOfResponsibility": [
{
"position": "Position Name",
"organization": "Organization Name"
}
]
}

IMPORTANT:

* Prioritize relevance over quantity.
* Include only information that strengthens the resume.
* Keep descriptions concise but impactful.
* Avoid generating excessive bullets or lengthy explanations.
* Optimize all generated content for a professional one-page resume.
* Do NOT copy placeholder values from the JSON example.
* Generate content exclusively from the candidate's provided information.
`;

  const specificPrompt = `
You are an elite ATS Resume Writer, Technical Recruiter, Career Coach, and Hiring Consultant with expertise in Software Engineering, AI, Data Science, Product Development, and Technology hiring.

Your objective is to transform the candidate's resume into a highly competitive, ATS-optimized, recruiter-friendly resume tailored specifically for the target job description.

PRIMARY OBJECTIVES
Analyze the Job Description thoroughly.
Identify:
Required skills
Preferred skills
Responsibilities
Technologies
ATS keywords
Industry terminology
Compare the candidate's background with the job requirements.
Rewrite and optimize resume content to maximize relevance.
Generate impactful achievement-oriented bullet points.
Improve ATS keyword coverage naturally.
Maintain complete honesty.
Never invent experience, projects, certifications, companies, achievements, dates, metrics, or technologies not supported by the provided information.
Keep the final resume concise enough for a professional single-page resume.
BULLET POINT RULES

Every experience and project bullet point should follow:

Action Verb + Task + Technologies/Skills + Impact

Examples:

Developed RESTful APIs using Node.js and Express.js, reducing response times by 30%.
Implemented JWT authentication and secure cookie management, strengthening application security.
Optimized MongoDB queries and indexing strategies, improving database performance and scalability.

Requirements:

Use strong power verbs.
Focus on achievements and impact.
Use measurable results whenever provided or clearly derivable.
Keep each bullet concise.
Maximum 1–2 lines per bullet.
Avoid generic responsibilities.
Prioritize accomplishments.
POWER VERBS

Leadership:
Led, Directed, Spearheaded, Managed, Coordinated, Supervised, Mentored, Guided, Oversaw, Delegated, Facilitated, Orchestrated, Executed

Achievement:
Achieved, Delivered, Exceeded, Improved, Increased, Boosted, Generated, Enhanced, Accelerated, Maximized, Reduced, Optimized, Strengthened

Strategy:
Developed, Designed, Formulated, Conceptualized, Initiated, Planned, Strategized, Launched, Implemented, Established, Built, Created

Analysis:
Analyzed, Evaluated, Assessed, Investigated, Identified, Diagnosed, Forecasted, Modeled, Interpreted, Researched, Examined

Communication:
Collaborated, Communicated, Presented, Negotiated, Partnered, Liaised, Influenced, Coordinated, Facilitated, Engaged

Execution:
Executed, Delivered, Implemented, Organized, Administered, Streamlined, Maintained, Managed, Coordinated

Innovation:
Innovated, Revamped, Reimagined, Redesigned, Pioneered, Transformed, Modernized, Engineered

Growth:
Expanded, Scaled, Generated, Acquired, Captured, Grew, Accelerated, Monetized

ATS OPTIMIZATION RULES
Extract the most important ATS keywords from the Job Description.
Include them naturally throughout:
Summary
Skills
Experience
Projects
Avoid keyword stuffing.
Prioritize technical keywords.
Prioritize skills explicitly mentioned in the Job Description.
Use industry-standard terminology.
RESUME WRITING RULES

Professional Summary:

3–5 lines maximum.
Tailored to the Job Description.
Highlight strongest qualifications.
Include important ATS keywords naturally.

Skills:

Group skills into categories.
Prioritize skills mentioned in the Job Description.
Remove redundant skills.

Projects:

Focus on relevant projects.
Generate 3–5 impactful bullet points.
Highlight technologies, implementation, and outcomes.

Experience:

Generate 3–5 optimized bullet points per role.
Prioritize achievements over duties.

Education:

Keep concise.
Preserve factual information.

Certifications:

Preserve only provided certifications.

Achievements:

Include only if supported by candidate information.
STRICT DATA INTEGRITY RULES

DO NOT:

Invent employment history.
Invent project results.
Invent certifications.
Invent achievements.
Invent metrics.
Invent dates.
Invent technologies.

ONLY use information available in:

Resume
Candidate Description
Job Description

Resume Data:
${resumeText}

Self Description:
${selfDescriptionText}

Job Description:
${jobDescription}

json schema:
${resumeSchema}

Return ONLY sections that are relevant to the candidate.
Do not generate empty sections.
The sectionOrder array must contain only the sections that are present in the response.

Available sections:
summary
skills
experience
internships
projects
education
certifications
achievements
publications
volunteerWork
positionsOfResponsibility

For students prioritize:
summary
skills
projects
education
certifications
achievements

For experienced professionals prioritize:
summary
skills
experience
projects
certifications
achievements

For researchers prioritize:
summary
skills
publications
experience
education

Return ONLY valid JSON.

HANDLING MISSING SECTIONS:
- If the candidate is a student/fresher and has NO work experience, you MUST return an empty array for experience: "experience": []
- DO NOT duplicate projects into the experience section.
- If a candidate lacks certifications, return "certifications": []

expected JSON format:
{
  "name": "Candidate Name",

  "title": "Target Job Title",

  "contact": {
    "email": "candidate@email.com",
    "phone": "+XX XXXXXXXXXX",
    "location": "City, State",
    "linkedin": "https://linkedin.com/in/profile",
    "github": "https://github.com/profile"
  },

  "summary": "Professional summary here.",

  "skills": [
    {
      "category": "Frontend",
      "items": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
      ]
    }
  ],

  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Month YYYY - Month YYYY",
      "points": [
        "Achievement bullet point",
        "Achievement bullet point"
      ]
    }
  ],

  "internships": [
    {
      "role": "Intern Role",
      "company": "Organization Name",
      "duration": "Month YYYY - Month YYYY",
      "points": [
        "Internship achievement",
        "Internship achievement"
      ]
    }
  ],

  "projects": [
    {
      "name": "Project Name",
      "points": [
        "Project achievement",
        "Project achievement"
      ]
    }
  ],

  "education": [
    {
      "degree": "Degree Name",
      "institute": "Institute Name",
      "duration": "YYYY - YYYY"
    }
  ],

  "certifications": [
    {
      "title": "Certification Name",
      "description": "Certification description"
    }
  ],

  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ],

  "publications": [
    {
      "title": "Publication Title",
      "publisher": "Publisher Name",
      "year": "YYYY"
    }
  ],

  "volunteerWork": [
    {
      "role": "Volunteer Role",
      "organization": "Organization Name",
      "description": "Volunteer contribution"
    }
  ],

  "positionsOfResponsibility": [
    {
      "position": "Position Name",
      "organization": "Organization Name"
    }
  ]
}

IMPORTANT:

The JSON example above demonstrates structure only.
Do NOT copy any values, names, organizations, certifications, projects, companies, dates, locations, or achievements from the example.
Generate content exclusively from the candidate's provided information.
Include only relevant sections.
Do not create empty sections.
The sectionOrder array must contain only the sections present in the generated response.
`;

  console.log("data received in generateResumeData:", selfDescriptionText);
  console.log("prompt mode : " , mode);

  const prompt = mode === "specific" ? specificPrompt : genericPrompt;
  console.log("Using prompt:", prompt);

  try {
    const stream = await openRouterAI.chat.send({
      chatRequest: {
        model: process.env.MODEL,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type: "json_object",
        },

        stream: true,
      },
    });

    let responseString = "";

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content;

      if (content) {
        responseString += content;
      }
    }

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
// GENERATE HTML
// ==============================
function generateResumeHTML(resumeData) {
  try {
    return modernResumeTemplate(resumeData);
  } catch (error) {
    console.error("HTML Generation Error:", error);
    throw new Error("Failed to generate resume HTML");
  }
}

// ==============================
// GENERATE PDF
// ==============================

async function generatePdfFromHtml(html) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,

      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      margin: {
        top: "6px",
        right: "12px",
        bottom: "12px",
        left: "12px",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// ==============================
// COMPLETE PIPELINE
// ==============================

async function generateResumePdf({
  resumeText,
  selfDescription,
  jobDescription,
  mode = "specific"
}) {
  try {
    // 1. Generate Structured Resume Data
    const resumeData = await generateResumeData({
      resumeText,
      selfDescription,
      jobDescription,
      mode
    });
    console.log("Generated Resume Data:", resumeData);

    // 2. Generate HTML From Template
    const html = generateResumeHTML(resumeData);

    // 3. Generate PDF
    const pdfBuffer = await generatePdfFromHtml(html);

    return {
      success: true,
      html,
      pdfBuffer,
      resumeData,
    };
  } catch (error) {
    console.error("Resume Pipeline Error:", error);

    throw new Error("Resume PDF generation failed");
  }
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};
