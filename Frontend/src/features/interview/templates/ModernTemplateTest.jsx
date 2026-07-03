import { PDFViewer } from "@react-pdf/renderer";
import { ModernTemplate } from "./ModernTemplate";

const resumeData = {
  name: "ALEX JOHNSON",
  title: "Full Stack Developer",
  contact: {
    phone: "+1 415 555 0192",
    email: "alex@example.com",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alex",
    github: "github.com/alex",
  },
  summary:
    "Full Stack Developer with hands-on experience building scalable web applications using React, Node.js, and MongoDB. Proven ability to develop RESTful APIs, optimize backend performance, and deliver responsive user interfaces. AWS Certified Developer with a strong foundation in computer science and a track record of winning hackathons through rapid prototyping and innovative problem-solving.",
  skills: [
    { category: "Frontend", items: ["React", "JavaScript", "HTML5", "CSS3"] },
    { category: "Backend", items: ["Node.js", "Express.js", "RESTful APIs"] },
    { category: "Database", items: ["MongoDB"] },
    { category: "Cloud & DevOps", items: ["AWS"] },
    { category: "Soft Skills", items: ["Communication", "Leadership"] },
  ],
  experience: [
    {
      role: "Software Engineer",
      company: "Startup Inc",
      duration: "2022 - Present",
      points: [
        "Developed and maintained scalable RESTful APIs using Node.js and Express.js, supporting core product functionality and improving response times.",
        "Improved application performance through code optimization and backend tuning, enhancing overall system reliability.",
        "Built responsive frontend interfaces with React, delivering a seamless user experience across devices.",
      ],
    },
  ],
  projects: [
    {
      name: "TalentForge",
      link: "github.com/alex/talentforge",
      points: [
        "Designed and developed an AI-powered interview preparation platform using React, Express, and MongoDB to deliver personalized practice sessions.",
        "Implemented RESTful backend services and database schemas in MongoDB to manage user data, interview questions, and performance tracking.",
        "Engineered responsive UI components with React, ensuring cross-device compatibility and an intuitive user experience.",
        "Integrated AI-driven features to generate interview questions and provide real-time feedback to users.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      institute: "ABC University",
      duration: "2018 - 2022",
    },
  ],
  certifications: [
    {
      title: "AWS Certified Developer",
      description: "Issued 2025",
    },
  ],
  achievements: ["Hackathon Winner"],
};

export default function ModernTemplateTest() {
  return (
    <div className="flex h-[calc(100vh-72px)] w-full">
      <PDFViewer
        style={{ width: "100%", height: "100%" }}
        showToolbar={true}
      >
        <ModernTemplate data={resumeData} />
      </PDFViewer>
    </div>
  );
}
