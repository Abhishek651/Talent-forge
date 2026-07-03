import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useInterview } from "../hooks/useInterview";
import TagInput from "../components/tagInput";
import { Badge } from "@/components/ui/badge";
import { LoadingOverlay } from "../components/loadingOverlay";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getResumeDetails } from "../services/profile.api";

// Multi-step form to collect structured self-description and POST to backend
const MyResume = () => {
  const { generateMyResume } = useInterview();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const generateResumeMessages = [
    "Reading your profile...",
    "Structuring your experience...",
    "Optimizing for ATS keywords...",
    "Crafting your professional summary...",
    "Formatting skills and projects...",
    "Applying resume best practices...",
    "Generating your PDF layout...",
    "Rendering the final document...",
    "Almost done, polishing the details...",
  ];

  useEffect(() => {
    if (!loading) return; // if loading is false, don't run the function
    let index = 0;
    setLoadingText(generateResumeMessages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % generateResumeMessages.length;
      setLoadingText(generateResumeMessages[index]);
    }, 5500); // cycles text roughly every 5.5 seconds for 9 messages (~49s total)

    return () => clearInterval(interval);
  }, [loading]);

  const [selfDescription, setSelfDescription] = useState({
    name: "",
    title: "",
    contact: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    softSkills: [],
    projects: [],
    activities: [],
    certifications: [],
  });

  // Temporary inputs for lists
  const [expInput, setExpInput] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });
  const [eduInput, setEduInput] = useState({
    degree: "",
    institute: "",
    specialization: "",
    duration: "",
  });
  const [projInput, setProjInput] = useState({
    name: "",
    description: "",
    technologies: "",
    link: "",
  });
  const [certInput, setCertInput] = useState({ title: "", description: "" });
  const [activitiesStr, setActivitiesStr] = useState(
    selfDescription.activities.join(", "),
  );
  const stepsInfo = [
    {
      title: "Personal Info",
      desc: "Basic details and your professional summary.",
    },
    { title: "Contact details", desc: "How employers can reach you." },
    {
      title: "Work Experience",
      desc: "Highlight your past roles and achievements.",
    },
    { title: "Education", desc: "Your academic background." },
    {
      title: "Projects & Skills",
      desc: "Showcase your technical abilities and projects.",
    },
    {
      title: "Review",
      desc: "Review your information before generating the PDF.",
    },
  ];

  function next() {
    setError(null);
    setStep((s) => Math.min(6, s + 1));
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  function addExperience() {
    if (!expInput.role || !expInput.company) return;
    setSelfDescription((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...expInput }],
    }));
    setExpInput({ role: "", company: "", duration: "", description: "" });
  }

  function removeExperience(idx) {
    setSelfDescription((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  }

  function addEducation() {
    if (!eduInput.degree && !eduInput.institute) return;
    setSelfDescription((prev) => ({
      ...prev,
      education: [...prev.education, { ...eduInput }],
    }));
    setEduInput({
      degree: "",
      institute: "",
      specialization: "",
      duration: "",
    });
  }

  function removeEducation(idx) {
    setSelfDescription((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  }

  function addProject() {
    if (!projInput.name) return;
    const techs = projInput.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setSelfDescription((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: projInput.name,
          description: projInput.description,
          link: projInput.link,
          technologies: techs,
        },
      ],
    }));
    setProjInput({ name: "", description: "", technologies: "", link: "" });
  }

  function removeProject(idx) {
    setSelfDescription((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx),
    }));
  }

  function addCertification() {
    if (!certInput.title) return;
    setSelfDescription((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { ...certInput }],
    }));
    setCertInput({ title: "", description: "" });
  }

  function removeCertification(idx) {
    setSelfDescription((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }));
  }

  async function submit() {
    // console.log(
    //   "Submitting self-description for resume generation:",
    //   selfDescription,
    // );
    setError(null);
    setLoading(true);
    try {
      await generateMyResume(selfDescription);
    } catch (error) {
      console.error("Error generating my resume:", error);
      setError(
        "An error occurred while generating the resume. Please try again.",
      );
      toast.error("Failed to generate resume PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function getResumeDetail() {
    setError(null);
    setLoading(true);
    try {
      console.log("use profile detail");
      const data = await getResumeDetails();
      if (data) {
        setSelfDescription(data);
      }
    } catch (error) {
      console.error("Error getting user details:", error);
      setError("An error occurred while getting the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function useProfile() {
    setIsChecked((prev) => !prev);
  }

  useEffect(() => {
    console.log(isChecked);
    if (isChecked) {
      console.log(isChecked);
      setStep(6);
      getResumeDetail();
    }
  }, [isChecked]);

  return (
    <div className="min-w-full min-h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center gap-6 lg:gap-8 bg-linear-to-br from-purple-50 to-white">
      <LoadingOverlay visible={loading} text={loadingText} />
      <div className="text-center mx-auto w-full max-w-4xl py-6">
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 drop-shadow-sm">
          Craft Your{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-500">
            Perfect Resume
          </span>
        </h1>
        <p className="font-medium text-slate-600 text-lg sm:text-xl md:text-2xl mt-4 max-w-2xl mx-auto leading-relaxed">
          Provide your details step by step. We'll format and optimize an
          ATS-friendly PDF ready to land you interviews.
        </p>
      </div>
      <div className="max-w-4xl mx-auto w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 relative">
        {/* Step Info Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="profile"
              checked={isChecked}
              onCheckedChange={useProfile}
            />
            <Label htmlFor="profile">Use saved profile</Label>
          </div>
        </div>
        <div className="border-b pb-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              {stepsInfo[step - 1].title}
            </h2>
            <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Step {step} of 6
            </span>
          </div>
          <p className="text-slate-500 mt-1">{stepsInfo[step - 1].desc}</p>

          {/* Simple progress bar */}
          <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="e.g. Alex Johnson"
                  value={selfDescription.name}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Job Title
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="e.g. Full Stack Developer | Data Scientist | Product Manager"
                  value={selfDescription.title}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Professional Summary
              </label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="e.g. Results-driven software engineer with 3+ years building scalable web apps using React and Node.js. Passionate about clean code and delivering impactful user experiences."
                rows={5}
                value={selfDescription.summary}
                onChange={(e) =>
                  setSelfDescription((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="e.g. alex.johnson@gmail.com"
                  value={selfDescription.contact.email}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="e.g. +1 415 555 0192"
                  value={selfDescription.contact.phone}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="e.g. San Francisco, CA  or  Remote"
                  value={selfDescription.contact.location}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, location: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Portfolio Website
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="e.g. https://alexjohnson.dev"
                  value={selfDescription.contact.portfolio}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, portfolio: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="e.g. linkedin.com/in/alex-johnson"
                  value={selfDescription.contact.linkedin}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, linkedin: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  GitHub URL
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="e.g. github.com/alexjohnson"
                  value={selfDescription.contact.github}
                  onChange={(e) =>
                    setSelfDescription((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, github: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Role
                  </label>
                  <input
                    placeholder="e.g. Software Engineer / Frontend Developer / DevOps Intern"
                    value={expInput.role}
                    onChange={(e) =>
                      setExpInput({ ...expInput, role: e.target.value })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company
                  </label>
                  <input
                    placeholder="e.g. Google, Startup Inc., Freelance"
                    value={expInput.company}
                    onChange={(e) =>
                      setExpInput({ ...expInput, company: e.target.value })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration
                </label>
                <input
                  placeholder="e.g. Jun 2022 - Present  or  Mar 2021 - Dec 2022"
                  value={expInput.duration}
                  onChange={(e) =>
                    setExpInput({ ...expInput, duration: e.target.value })
                  }
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Responsibilities & Achievements
                </label>
                <textarea
                  placeholder="e.g. Built REST APIs with Node.js serving 50k+ users. Reduced page load time by 40% via lazy loading. Led a team of 3 to deliver the feature 2 weeks ahead of schedule."
                  value={expInput.description}
                  rows={3}
                  onChange={(e) =>
                    setExpInput({ ...expInput, description: e.target.value })
                  }
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <Button
                type="button"
                onClick={addExperience}
                variant="secondary"
                className="w-fit self-start"
              >
                Add Experience Details
              </Button>
            </div>

            {selfDescription.experience.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700">
                  Added Work Experience:
                </h3>
                {selfDescription.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {exp.role}{" "}
                        <span className="font-normal text-slate-500">
                          at {exp.company}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-500 mb-1">
                        {exp.duration}
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-line line-clamp-2">
                        {exp.description}
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1"
                      onClick={() => removeExperience(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Education */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Degree
                  </label>
                  <input
                    placeholder="e.g. B.Tech, B.S., M.S., MBA, Ph.D."
                    value={eduInput.degree}
                    onChange={(e) =>
                      setEduInput({ ...eduInput, degree: e.target.value })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    University / Institute
                  </label>
                  <input
                    placeholder="e.g. MIT, Stanford University, IIT Bombay"
                    value={eduInput.institute}
                    onChange={(e) =>
                      setEduInput({ ...eduInput, institute: e.target.value })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Specialization / Major
                </label>
                <input
                  placeholder="e.g. Computer Science, Data Science, Electrical Engineering"
                  value={eduInput.specialization}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, specialization: e.target.value })
                  }
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration
                </label>
                <input
                  placeholder="e.g. 2020 - 2024  or  Aug 2018 - May 2022"
                  value={eduInput.duration}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, duration: e.target.value })
                  }
                  className="w-full p-3 border border-slate-200 rounded-lg"
                />
              </div>
              <Button
                type="button"
                onClick={addEducation}
                variant="secondary"
                className="w-fit self-start"
              >
                Add Education
              </Button>
            </div>

            {selfDescription.education.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700">
                  Added Education:
                </h3>
                {selfDescription.education.map((ed, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 px-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                  >
                    <div>
                      <div className="font-bold text-slate-800">
                        {ed.specialization
                          ? `${ed.degree} in ${ed.specialization}`
                          : ed.degree}
                      </div>
                      <div className="text-sm text-slate-600">
                        {ed.institute} &bull; {ed.duration}
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                      onClick={() => removeEducation(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Projects & Skills */}
        {step === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Technical Skills (comma or enter separated)
              </label>
              <TagInput
                tags={selfDescription.skills}
                setTags={(skills) =>
                  setSelfDescription((prev) => ({
                    ...prev,
                    skills,
                  }))
                }
                placeholder="e.g. React, Node.js, Python, AWS, Docker — press Enter or comma to add"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Soft Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Soft Skills (comma or enter separated)
              </label>
              <TagInput
                tags={selfDescription.softSkills}
                setTags={(softSkills) =>
                  setSelfDescription((prev) => ({ ...prev, softSkills }))
                }
                placeholder="e.g. Leadership, Communication, Problem-solving, Teamwork — press Enter or comma to add"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Projects */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Add Projects
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Project Name
                    </label>
                    <input
                      placeholder="e.g. TalentForge, E-Commerce Platform, Portfolio Website"
                      value={projInput.name}
                      onChange={(e) =>
                        setProjInput({ ...projInput, name: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Project Link
                    </label>
                    <input
                      placeholder="e.g. https://github.com/you/project  or  https://yourproject.com"
                      value={projInput.link}
                      onChange={(e) =>
                        setProjInput({ ...projInput, link: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description & Impact
                  </label>
                  <textarea
                    placeholder="e.g. Built an AI-powered resume builder using React & Node.js that reduced resume creation time by 60% for 500+ users."
                    value={projInput.description}
                    rows={2}
                    onChange={(e) =>
                      setProjInput({
                        ...projInput,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Technologies Used
                  </label>
                  <input
                    placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS, OpenAI API"
                    value={projInput.technologies}
                    onChange={(e) =>
                      setProjInput({
                        ...projInput,
                        technologies: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addProject}
                  variant="secondary"
                  className="w-fit self-start"
                >
                  Add Project Entry
                </Button>
              </div>

              {selfDescription.projects.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="font-semibold text-slate-700">
                    Added Projects:
                  </h3>
                  {selfDescription.projects.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start py-3 px-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          {p.name}{" "}
                          {p.link && (
                            <span className="text-xs font-normal text-blue-500 ml-2">
                              ({p.link})
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-purple-600 font-medium my-1">
                          {p.technologies.join(", ")}
                        </div>
                        <div className="text-sm text-slate-600 line-clamp-2">
                          {p.description}
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm font-medium py-1 px-2"
                        onClick={() => removeProject(i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Activities */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Extracurriculars / Activities (comma or enter separated)
              </label>
              <TagInput
                tags={selfDescription.activities}
                setTags={(activities) =>
                  setSelfDescription((prev) => ({
                    ...prev,
                    activities,
                  }))
                }
                placeholder="e.g. Hackathon Winner, Open Source Contributor, Tech Blogger — press Enter or comma to add"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Certifications */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Certifications
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Certification Title
                  </label>
                  <input
                    placeholder="e.g. AWS Certified Developer, Google Data Analytics, Meta Front-End Developer"
                    value={certInput.title}
                    onChange={(e) =>
                      setCertInput({ ...certInput, title: e.target.value })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issuing Body & Details
                  </label>
                  <textarea
                    placeholder="e.g. Issued by Amazon Web Services — 2023  |  Credential ID: ABC123XYZ"
                    value={certInput.description}
                    rows={2}
                    onChange={(e) =>
                      setCertInput({
                        ...certInput,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addCertification}
                  variant="secondary"
                  className="w-fit self-start"
                >
                  Add Certification
                </Button>
              </div>

              {selfDescription.certifications.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="font-semibold text-slate-700">
                    Added Certifications:
                  </h3>
                  {selfDescription.certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start py-3 px-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          {cert.title}
                        </div>
                        {cert.description && (
                          <div className="text-sm text-slate-600">
                            {cert.description}
                          </div>
                        )}
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm font-medium py-1 px-2"
                        onClick={() => removeCertification(i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Review Format */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-3xl font-extrabold text-slate-900">
                {selfDescription.name || "Your Name"}
              </h3>
              <p className="text-lg text-purple-600 font-medium mb-4">
                {selfDescription.title || "Target Role"}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 mb-6">
                {selfDescription.contact.email && (
                  <div>📧 {selfDescription.contact.email}</div>
                )}
                {selfDescription.contact.phone && (
                  <div>📱 {selfDescription.contact.phone}</div>
                )}
                {selfDescription.contact.location && (
                  <div>📍 {selfDescription.contact.location}</div>
                )}
                {selfDescription.contact.linkedin && (
                  <div>🔗 {selfDescription.contact.linkedin}</div>
                )}
                {selfDescription.contact.github && (
                  <div>💻 {selfDescription.contact.github}</div>
                )}
                {selfDescription.contact.portfolio && (
                  <div>🎨 {selfDescription.contact.portfolio}</div>
                )}
              </div>

              {selfDescription.summary && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                    Summary
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {selfDescription.summary}
                  </p>
                </div>
              )}

              {selfDescription.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selfDescription.skills.map((skill, i) => (
                      <Badge key={i}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selfDescription.softSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                    Soft Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selfDescription.softSkills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selfDescription.experience.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3">
                    Work Experience
                  </h4>
                  <div className="space-y-4">
                    {selfDescription.experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-slate-800">
                            {exp.role}
                          </h5>
                          <span className="text-xs text-slate-500 font-medium">
                            {exp.duration}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 font-medium mb-1">
                          {exp.company}
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selfDescription.education.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3">
                    Education
                  </h4>
                  <div className="space-y-3">
                    {selfDescription.education.map((edu, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-baseline"
                      >
                        <div>
                          <h5 className="font-bold text-slate-800">
                            {edu.specialization
                              ? `${edu.degree} in ${edu.specialization}`
                              : edu.degree}
                          </h5>
                          <div className="text-sm text-slate-600">
                            {edu.institute}
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {edu.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selfDescription.projects.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3">
                    Projects
                  </h4>
                  <div className="space-y-4">
                    {selfDescription.projects.map((proj, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-800">
                            {proj.name}
                          </h5>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-500 underline"
                            >
                              View Link
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-purple-600 font-semibold my-1">
                          {proj.technologies.join(", ")}
                        </div>
                        <p className="text-sm text-slate-700">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selfDescription.activities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                    Activities
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {selfDescription.activities.map((activity, i) => (
                      <Badge key={i} variant="secondary">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selfDescription.certifications.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3">
                    Certifications
                  </h4>
                  <div className="space-y-2">
                    {selfDescription.certifications.map((cert, i) => (
                      <div key={i}>
                        <div className="font-semibold text-slate-800 text-sm">
                          {cert.title}
                        </div>
                        {cert.description && (
                          <div className="text-sm text-slate-600">
                            {cert.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 mt-4 text-center font-medium bg-red-50 py-2 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-8 border-t pt-4">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={back}
                className="px-6 border-2 border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {step < 6 && (
              <Button
                onClick={next}
                className="px-8 bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
              >
                Next Step
              </Button>
            )}
            {step === 6 && (
              <Button
                onClick={submit}
                disabled={loading}
                className="px-8 bg-linear-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md text-white font-bold tracking-wide"
              >
                {loading ? "Generating..." : "✨ Generate Resume PDF"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="max-w-5xl mx-auto w-full mt-12 mb-8">
        <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
          Everything You Need to Create a Job-Winning Resume
        </h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 justify-center text-center rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">📄</div>
            <h4 className="font-bold text-slate-800 mb-2">
              ATS-Optimized Formatting
            </h4>
            <p className="text-sm text-slate-600">
              Generated PDFs are cleanly structured and highly scannable by
              Applicant Tracking Systems.
            </p>
          </div>
          <div className="bg-white p-6 justify-center text-center rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-slate-800 mb-2">Instant PDFs</h4>
            <p className="text-sm text-slate-600">
              Go from raw details to an expertly formatted, professional-grade
              PDF in seconds.
            </p>
          </div>
          <div className="bg-white p-6 justify-center text-center rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="font-bold text-slate-800 mb-2">Private & Secure</h4>
            <p className="text-sm text-slate-600">
              We don't store your personal resume data. Your privacy remains
              uncompromised.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyResume;
