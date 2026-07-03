const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false, strict: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: "", trim: true },
    institute: { type: String, default: "", trim: true },
    specialization: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
  },
  { _id: false, strict: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    technologies: { type: [String], default: [] },
    link: { type: String, default: "", trim: true },
  },
  { _id: false, strict: false }
);

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false, strict: false }
);

const resumeDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      index: true,
    },

    name: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },

    contact: {
      email: { type: String, default: "", trim: true, lowercase: true },
      phone: { type: String, default: "", trim: true },
      location: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
      portfolio: { type: String, default: "", trim: true },
    },

    summary: { type: String, default: "", trim: true },

    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    skills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    activities: { type: [String], default: [] },
    certifications: { type: [certificationSchema], default: [] },

    raw: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const resumeDetailModel = mongoose.model("ResumeDetails", resumeDetailSchema);

module.exports = resumeDetailModel;