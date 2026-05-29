
const modernResumeTemplate = (data) => {

// =====================================================
// SECTION RENDERERS
// =====================================================
//
// Think of this object as a "library of section templates".
//
// Key = section name from AI JSON
// Value = function that generates HTML for that section
//
// Example:
//
// data.summary -> summary renderer
// data.skills -> skills renderer
// data.projects -> projects renderer
//
// If AI returns a new section later,
// simply add another renderer here.
//
// =====================================================

const sectionRenderers = {

  // ===================================================
  // PROFESSIONAL SUMMARY
  // ===================================================

  summary: (data) => `
    <div class="section">

      <div class="section-title">
        Professional Summary
      </div>

      <div class="summary">
        ${data.summary}
      </div>

    </div>
  `,

  // ===================================================
  // SKILLS
  // ===================================================

  skills: (data) => `
    <div class="section">

      <div class="section-title">
        Skills
      </div>

      <ul class="skills-list">

        ${data.skills.map(skill => `
          <li>

            <span class="skills-category">
              ${skill.category}:
            </span>

            ${skill.items.join(", ")}

          </li>
        `).join("")}

      </ul>

    </div>
  `,

  // ===================================================
  // WORK EXPERIENCE
  // ===================================================

  experience: (data) => `
    <div class="section">

      <div class="section-title">
        Experience
      </div>

      ${data.experience.map(exp => `

        <div class="experience-item">

          <div class="education-header">

            <div>

              <div class="bold">
                ${exp.role}
              </div>

              <div>
                ${exp.company}
              </div>

            </div>

            <div class="education-duration">
              ${exp.duration || ""}
            </div>

          </div>

          <ul>

            ${(exp.points || []).map(point => `
              <li>${point}</li>
            `).join("")}

          </ul>

        </div>

      `).join("")}

    </div>
  `,

  // ===================================================
  // INTERNSHIPS
  // ===================================================

  internships: (data) => `
    <div class="section">

      <div class="section-title">
        Internships
      </div>

      ${data.internships.map(item => `

        <div class="experience-item">

          <div class="education-header">

            <div>

              <div class="bold">
                ${item.role}
              </div>

              <div>
                ${item.company}
              </div>

            </div>

            <div class="education-duration">
              ${item.duration || ""}
            </div>

          </div>

          <ul>

            ${(item.points || []).map(point => `
              <li>${point}</li>
            `).join("")}

          </ul>

        </div>

      `).join("")}

    </div>
  `,

  // ===================================================
  // PROJECTS
  // ===================================================

  projects: (data) => `
    <div class="section">

      <div class="section-title">
        Projects
      </div>

      ${data.projects.map(project => `

        <div class="project">

          <div class="project-title">
            ${project.name}
          </div>

          <ul>

            ${(project.points || []).map(point => `
              <li>${point}</li>
            `).join("")}

          </ul>

        </div>

      `).join("")}

    </div>
  `,

  // ===================================================
  // EDUCATION
  // ===================================================

  education: (data) => `
    <div class="section">

      <div class="section-title">
        Education
      </div>

      ${data.education.map(edu => `

        <div class="education-item">

          <div class="education-header">

            <div>

              <div class="bold">
                ${edu.degree}
              </div>

              <div>
                ${edu.institute}
              </div>

            </div>

            <div class="education-duration">
              ${edu.duration || ""}
            </div>

          </div>

        </div>

      `).join("")}

    </div>
  `,

  // ===================================================
  // CERTIFICATIONS
  // ===================================================

  certifications: (data) => `
    <div class="section">

      <div class="section-title">
        Certifications
      </div>

      ${data.certifications.map(cert => `

        <div class="certification-item">

          <div class="bold">
            ${cert.title}
          </div>

          <div>
            ${cert.description}
          </div>

        </div>

      `).join("")}

    </div>
  `,

  // ===================================================
  // ACHIEVEMENTS
  // ===================================================

  achievements: (data) => `
    <div class="section">

      <div class="section-title">
        Achievements
      </div>

      <ul>

        ${data.achievements.map(item => `
          <li>${item}</li>
        `).join("")}

      </ul>

    </div>
  `,

  // ===================================================
  // ACTIVITIES
  // ===================================================

  activities: (data) => `
    <div class="section">

      <div class="section-title">
        Activities
      </div>

      <ul>

        ${data.activities.map(item => `
          <li>${item}</li>
        `).join("")}

      </ul>

    </div>
  `,

  // ===================================================
  // PUBLICATIONS
  // ===================================================
  //
  // Useful for:
  // Research Students
  // Masters Students
  // PhD Candidates
  // Researchers
  //
  // Example:
  // "AI-Based Resume Ranking System"
  // Published in IEEE Conference 2025
  //
  // ===================================================

  publications: (data) => `
    <div class="section">

      <div class="section-title">
        Publications
      </div>

      <ul>

        ${data.publications.map(item => `
          <li>
            <strong>${item.title}</strong>

            ${
              item.publisher
                ? ` - ${item.publisher}`
                : ""
            }

            ${
              item.year
                ? ` (${item.year})`
                : ""
            }
          </li>
        `).join("")}

      </ul>

    </div>
  `,

  // ===================================================
  // VOLUNTEER WORK
  // ===================================================
  //
  // Useful for:
  // Students
  // NGOs
  // Community work
  //
  // ===================================================

  volunteerWork: (data) => `
    <div class="section">

      <div class="section-title">
        Volunteer Work
      </div>

      ${data.volunteerWork.map(item => `

        <div class="experience-item">

          <div class="bold">
            ${item.role}
          </div>

          <div>
            ${item.organization}
          </div>

          ${
            item.description
              ? `
                <div>
                  ${item.description}
                </div>
              `
              : ""
          }

        </div>

      `).join("")}

    </div>
  `,

  // ===================================================
  // POSITIONS OF RESPONSIBILITY
  // ===================================================
  //
  // Useful for:
  // College students
  // Club leaders
  // Team leads
  // Event organizers
  //
  // ===================================================

  positionsOfResponsibility: (data) => `
    <div class="section">

      <div class="section-title">
        Positions of Responsibility
      </div>

      <ul>

        ${data.positionsOfResponsibility.map(item => `
          <li>

            <strong>
              ${item.position}
            </strong>

            ${
              item.organization
                ? ` - ${item.organization}`
                : ""
            }

          </li>
        `).join("")}

      </ul>

    </div>
  `,
};


// =====================================================
// DYNAMIC SECTION ENGINE
// =====================================================

  const sections = Object.entries(sectionRenderers)

    // Step 1:
    // Loop through every renderer

    .filter(([key]) => {

      const value = data[key];

      // Section does not exist

      if (!value) {
        return false;
      }

      // Empty array

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      // Summary string etc.

      return true;
    })

    // Step 2:
    // Generate HTML

    .map(([key, renderer]) => {

      return renderer(data);

    })

    // Step 3:
    // Combine all HTML

    .join("");

  return `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>${data.name || "Resume"}</title>

<style>

/* ===================================================
   PAGE SETTINGS
=================================================== */

@page {
  size: A4;
  margin: 10mm;
}

/* ===================================================
   RESET
=================================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===================================================
   BODY
=================================================== */

body {
  font-family: "Calibri", "Segoe UI", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: #222;
  background: #fff;
}

/* ===================================================
   MAIN CONTAINER
=================================================== */

.container {
  width: 100%;
}

/* ===================================================
   HEADER
=================================================== */

.header {
  text-align: center;
  margin-bottom: 12px;
}

.name {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.title {
  font-size: 15px;
  color: #444;
  margin-bottom: 4px;
}

.contact {
  font-size: 11px;
  color: #555;
  line-height: 1.5;
}

.contact a {
  color: inherit;
  text-decoration: none;
}

/* ===================================================
   COMMON SECTION STYLES
=================================================== */

.section {
  margin-top: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f4e79;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 4px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

/* ===================================================
   SUMMARY
=================================================== */

.summary {
  text-align: justify;
}

/* ===================================================
   SKILLS
=================================================== */

.skills-list {
  list-style: none;
}

.skills-list li {
  margin-bottom: 5px;
}

.skills-category {
  font-weight: 700;
}

/* ===================================================
   EXPERIENCE / EDUCATION
=================================================== */

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.education-duration {
  white-space: nowrap;
  font-size: 12px;
  color: #666;
}

.education-item,
.experience-item,
.project,
.certification-item {
  margin-bottom: 10px;
}

/* ===================================================
   TITLES
=================================================== */

.bold {
  font-weight: 700;
}

.project-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

/* ===================================================
   LISTS
=================================================== */

ul {
  margin-left: 20px;
}

li {
  margin-bottom: 4px;
}

/* ===================================================
   LINKS
=================================================== */

a {
  color: inherit;
  text-decoration: none;
}

</style>

</head>

<body>

<div class="container">

  <!-- ==========================================
       HEADER
  =========================================== -->

  <div class="header">

    <div class="name">
      ${data.name || ""}
    </div>

    ${
      data.title
        ? `
          <div class="title">
            ${data.title}
          </div>
        `
        : ""
    }

    <div class="contact">

      ${data.contact?.phone || ""}

      ${data.contact?.email
        ? ` | ${data.contact.email}`
        : ""}

      ${data.contact?.location
        ? ` | ${data.contact.location}`
        : ""}

      ${
        data.contact?.linkedin ||
        data.contact?.github
          ? "<br>"
          : ""
      }

      ${
        data.contact?.linkedin
          ? data.contact.linkedin
          : ""
      }

      ${
        data.contact?.github
          ? ` | ${data.contact.github}`
          : ""
      }

    </div>

  </div>

  <!-- ==========================================
       DYNAMICALLY GENERATED SECTIONS
  =========================================== -->

  ${sections}

</div>

</body>
</html>
`;
};

module.exports = {modernResumeTemplate};