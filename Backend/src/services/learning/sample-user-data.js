// Sample user data constants
const user = {
    username: "johndoe_dev",
    email: "john.doe@example.com",
    password: "hashed_password_here"
};

const resume = {
    fullName: "John Doe",
    contact: {
        email: "john.doe@example.com",
        phone: "+1-555-0123",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe"
    },
    summary: "Experienced full-stack developer with 5+ years of expertise in building scalable web applications using modern technologies. Passionate about clean code, user experience, and continuous learning.",
    technicalSkills: [
        "JavaScript (ES6+)",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "PostgreSQL",
        "HTML5/CSS3",
        "Git",
        "Docker",
        "AWS",
        "Python",
        "TypeScript"
    ],
    workExperience: [
        {
            jobTitle: "Senior Full-Stack Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            startDate: "January 2022",
            endDate: "Present",
            responsibilities: [
                "Led development of microservices architecture serving 100K+ users",
                "Implemented CI/CD pipelines reducing deployment time by 60%",
                "Mentored junior developers and conducted code reviews",
                "Optimized database queries improving performance by 40%",
                "Collaborated with design team to implement responsive UI components"
            ]
        },
        {
            jobTitle: "Full-Stack Developer",
            company: "StartupXYZ",
            location: "Remote",
            startDate: "March 2020",
            endDate: "December 2021",
            responsibilities: [
                "Developed and maintained React-based web applications",
                "Built RESTful APIs using Node.js and Express",
                "Integrated third-party APIs and payment systems",
                "Participated in agile development processes",
                "Contributed to open-source projects"
            ]
        },
        {
            jobTitle: "Junior Web Developer",
            company: "WebSolutions Ltd.",
            location: "New York, NY",
            startDate: "June 2019",
            endDate: "February 2020",
            responsibilities: [
                "Developed responsive websites using HTML, CSS, and JavaScript",
                "Maintained and updated existing client websites",
                "Assisted in debugging and troubleshooting issues",
                "Learned version control with Git"
            ]
        }
    ],
    projects: [
        {
            name: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with React frontend and Node.js backend",
            technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
            githubLink: "https://github.com/johndoe/ecommerce-platform",
            liveLink: "https://ecommerce-demo.herokuapp.com",
            responsibilities: [
                "Designed and implemented user authentication system",
                "Built shopping cart and checkout functionality",
                "Integrated payment processing with Stripe",
                "Deployed application to Heroku"
            ]
        },
        {
            name: "Task Management App",
            description: "Collaborative task management tool with real-time updates",
            technologies: ["React", "Socket.io", "Express.js", "PostgreSQL"],
            githubLink: "https://github.com/johndoe/task-manager",
            liveLink: "https://taskmanager-demo.netlify.com",
            responsibilities: [
                "Implemented real-time collaboration features",
                "Designed database schema for tasks and users",
                "Created responsive UI with drag-and-drop functionality",
                "Set up WebSocket connections for live updates"
            ]
        },
        {
            name: "Weather Dashboard",
            description: "Interactive weather application with location-based forecasts",
            technologies: ["JavaScript", "OpenWeatherMap API", "Chart.js"],
            githubLink: "https://github.com/johndoe/weather-dashboard",
            liveLink: "https://weather-dashboard-demo.vercel.app",
            responsibilities: [
                "Fetched and displayed weather data from API",
                "Created interactive charts for weather trends",
                "Implemented geolocation for automatic location detection",
                "Designed mobile-responsive interface"
            ]
        }
    ],
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of California, Berkeley",
            location: "Berkeley, CA",
            graduationDate: "May 2019",
            gpa: "3.7/4.0"
        }
    ],
    certifications: [
        "AWS Certified Developer - Associate",
        "MongoDB Certified Developer",
        "React Developer Certification"
    ]
};

const selfDescription = "I am a dedicated and innovative software developer who thrives on solving complex problems and creating meaningful user experiences. With a strong foundation in both frontend and backend technologies, I enjoy the challenge of building scalable, efficient applications. I'm passionate about staying current with industry trends and continuously improving my skills. Outside of work, I contribute to open-source projects and mentor aspiring developers.";

const jobDescription = "We are seeking a talented Full-Stack Developer to join our dynamic team. The ideal candidate will have strong experience in modern web technologies and a passion for creating exceptional user experiences. You will work on challenging projects, collaborate with cross-functional teams, and contribute to the development of our core products.\n\nKey Responsibilities:\n- Develop and maintain web applications using React and Node.js\n- Design and implement RESTful APIs\n- Collaborate with designers to create intuitive user interfaces\n- Optimize applications for maximum speed and scalability\n- Participate in code reviews and mentor junior developers\n- Stay up-to-date with emerging technologies and industry trends\n\nRequirements:\n- 3+ years of experience in full-stack development\n- Proficiency in JavaScript, React, and Node.js\n- Experience with databases (MongoDB, PostgreSQL)\n- Knowledge of version control systems (Git)\n- Strong problem-solving and communication skills\n- Experience with cloud platforms (AWS, Azure) is a plus";

const location = "San Francisco, CA (Hybrid)";

const responsibilities = [
    "Develop and maintain web applications using modern technologies",
    "Design and implement scalable backend services",
    "Collaborate with cross-functional teams including design and product",
    "Optimize applications for performance and user experience",
    "Participate in agile development processes",
    "Mentor junior team members and conduct code reviews",
    "Stay current with industry best practices and emerging technologies"
];

module.exports = {
    user,
    resume,
    selfDescription,
    jobDescription,
    location,
    responsibilities
};