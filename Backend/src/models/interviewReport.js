/**
 * 🧠 AI Job Analysis Schema Blueprint
 *
 * 🔹 INPUT DATA
 * - jobDescription: String → Job role details
 * - resumeText: String → Parsed resume content
 * - selfDescription: String → User’s own description (optional)
 *
 * 🔹 METADATA
 * - company: String → Company name
 * - jobTitle: String → Role title
 * - user: ObjectId → Reference to user (for multi-user system)
 *
 * 🔹 MATCHING SCORE
 * - matchScore: Number (0–100) → Overall compatibility score
 *
 * 🔹 SCORE BREAKDOWN (Detailed insights)
 * - scoreBreakdown: {
 *      technical: Number → Skills/tech knowledge score
 *      communication: Number → Communication clarity score
 *      experience: Number → Relevant experience score
 *   }
 *
 * 🔹 TECHNICAL QUESTIONS
 * - technicalQuestions: [
 *      {
 *          question: String → Interview question
 *          intention: String → What it tests
 *          answer: String → Suggested answer (optional)
 *      }
 *   ]
 *
 * 🔹 BEHAVIORAL QUESTIONS
 * - behavioralQuestions: [
 *      {
 *          question: String
 *          intention: String
 *          answer: String
 *      }
 *   ]
 *
 * 🔹 SKILL GAPS
 * - skillGaps: [
 *      {
 *          skill: String → Missing skill
 *          severity: {
 *              type: String,
 *              enum: ["low", "medium", "high"]
 *          }
 *      }
 *   ]
 *
 * 🔹 PREPARATION PLAN
 * - preparationPlan: [
 *      {
 *          day: Number → Day number (e.g., Day 1)
 *          focus: String → Topic focus
 *          tasks: [String] → List of tasks
 *      }
 *   ]
 *
 * 🔹 EXTRA (Optional but useful)
 * - suggestions: [String] → General improvement tips
 * - resumeImprovements: [String] → Resume-specific suggestions
 */

const mongoose = require('mongoose');

//sub-schema for technical questions, behavioral questions, skill gaps, and preparation plan
const TechQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true,"Technical question is required."]
    },
    intention: {
        type: String,
        required: [true,"Intention for technical question is required."]
    },
    answer: {
        type: String
    },
    _id: false
});

const BehavioralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true,"Behavioral question is required."]
    },
    intention: {
        type: String,
        required: [true,"Intention for behavioral question is required."]
    },
    answer: {
        type: String
    },
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true,"Skill gap name is required."]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true,"Severity level for skill gap is required."]
    },
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true,"Day number for preparation plan is required."]
    },
    focus: {
        type: String,
        required: [true,"Focus topic for preparation plan is required."]
    },
    tasks: [String],
    _id: false
});

const InterviewReportSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
    },
    jobDescription: { 
        type: String, 
        required: [true,"Job description is required."]
     },
    resume: { 
        type: String
     },
    selfDescription: { 
        type: String
    },
    matchScore: { 
        type: Number, 
        min: 0,
        max: 100
     },
    scoreBreakdown: {
        technical: { type: Number, min: 0, max: 100 },
        communication: { type: Number, min: 0, max: 100 },
        experience: { type: Number, min: 0, max: 100 }
    },
    technicalQuestions: [TechQuestionSchema],
    behavioralQuestions: [BehavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Tells Mongoose this ObjectId refers to the 'Users' collection
    }
},{
    timestamps: true
});




const InterviewReportModel = mongoose.model('InterviewReport', InterviewReportSchema);

module.exports = InterviewReportModel;