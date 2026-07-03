import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333333",
    backgroundColor: "#ffffff",
    paddingTop: 24,
    paddingBottom: 34,
    paddingLeft: 34,
    paddingRight: 34,
  },

  // LINK
  link: { color: "#1f4e79", textDecoration: "none" },

  // HEADER
  header: { textAlign: "center", marginBottom: 12 },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: { fontSize: 13, color: "#555555", marginTop: 6, marginBottom: 6 },
  contact: { fontSize: 8, color: "#666666", lineHeight: 1.5 },

  // SECTION
  section: { marginTop: 3 },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1f4e79",
    borderBottomWidth: 1.5,
    borderBottomColor: "#d9d9d9",
    paddingBottom: 0,
    marginBottom: 3,
    textTransform: "uppercase",
  },

  // SUMMARY
  summary: { fontSize: 10 },

  // SKILLS
  skillRow: { flexDirection: "row", marginBottom: 2 },
  skillCategory: { fontFamily: "Helvetica-Bold" },

  // EDUCATION HEADER (shared by experience, internships, education)
  eduHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eduDuration: { fontSize: 9, color: "#777777" },
  bold: { fontFamily: "Helvetica-Bold" },

  // ITEMS
  item: { marginBottom: 2 },

  // LISTS
  listItem: { flexDirection: "row", marginBottom: 2, paddingLeft: 10 },
  bullet: { marginRight: 4 },

  // PROJECT
  projectTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  projectLink: { fontSize: 8, color: "#1f4e79", textDecoration: "none", alignSelf: "center" },
});

function ensureUrl(url) {
  if (!url) return url;
  return url.startsWith("http") ? url : `https://${url}`;
}

function BulletList({ points = [] }) {
  return points.map((point, i) => (
    <View key={i} style={styles.listItem}>
      <Text style={styles.bullet}>•</Text>
      <Text style={{ flex: 1 }}>{point}</Text>
    </View>
  ));
}

function SummarySection({ data }) {
  if (!data.summary) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.summary}>{data.summary}</Text>
    </View>
  );
}

function SkillsSection({ data }) {
  if (!data.skills?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      {data.skills.map((skill, i) => (
        <View key={i} style={styles.skillRow}>
          <Text style={styles.skillCategory}>{skill.category}: </Text>
          <Text style={{ flex: 1 }}>{skill.items.join(", ")}</Text>
        </View>
      ))}
    </View>
  );
}

function ExperienceSection({ data }) {
  if (!data.experience?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {data.experience.map((exp, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.eduHeader}>
            <View>
              <Text style={styles.bold}>{exp.role}</Text>
              <Text>{exp.company}</Text>
            </View>
            <Text style={styles.eduDuration}>{exp.duration || ""}</Text>
          </View>
          <BulletList points={exp.points} />
        </View>
      ))}
    </View>
  );
}

function InternshipsSection({ data }) {
  if (!data.internships?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Internships</Text>
      {data.internships.map((item, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.eduHeader}>
            <View>
              <Text style={styles.bold}>{item.role}</Text>
              <Text>{item.company}</Text>
            </View>
            <Text style={styles.eduDuration}>{item.duration || ""}</Text>
          </View>
          <BulletList points={item.points} />
        </View>
      ))}
    </View>
  );
}

function ProjectsSection({ data }) {
  if (!data.projects?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {data.projects.map((project, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.eduHeader}>
            <Text style={styles.projectTitle}>{project.name}</Text>
            {project.link ? (
              <Link src={ensureUrl(project.link)}>
                <Text style={styles.projectLink}>View Project</Text>
              </Link>
            ) : null}
          </View>
          <BulletList points={project.points} />
        </View>
      ))}
    </View>
  );
}

function EducationSection({ data }) {
  if (!data.education?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {data.education.map((edu, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.eduHeader}>
            <View>
              <Text style={styles.bold}>{edu.degree}</Text>
              <Text>{edu.institute}</Text>
            </View>
            <Text style={styles.eduDuration}>{edu.duration || ""}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function CertificationsSection({ data }) {
  if (!data.certifications?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certifications</Text>
      {data.certifications.map((cert, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.bold}>{cert.title}</Text>
          <Text>{cert.description}</Text>
        </View>
      ))}
    </View>
  );
}

function AchievementsSection({ data }) {
  if (!data.achievements?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      <BulletList points={data.achievements} />
    </View>
  );
}

function ActivitiesSection({ data }) {
  if (!data.activities?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Activities</Text>
      <BulletList points={data.activities} />
    </View>
  );
}

function PublicationsSection({ data }) {
  if (!data.publications?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Publications</Text>
      {data.publications.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={{ flex: 1 }}>
            {item.title}
            {item.publisher ? ` - ${item.publisher}` : ""}
            {item.year ? ` (${item.year})` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

function VolunteerWorkSection({ data }) {
  if (!data.volunteerWork?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Volunteer Work</Text>
      {data.volunteerWork.map((item, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.bold}>{item.role}</Text>
          <Text>{item.organization}</Text>
          {item.description ? <Text>{item.description}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function PositionsSection({ data }) {
  if (!data.positionsOfResponsibility?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Positions of Responsibility</Text>
      {data.positionsOfResponsibility.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={{ flex: 1 }}>
            {item.position}
            {item.organization ? ` - ${item.organization}` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ModernTemplate({ data }) {
  const contactParts = [
    data.contact?.phone,
    data.contact?.email,
    data.contact?.location,
  ].filter(Boolean);

  const linkParts = [data.contact?.linkedin, data.contact?.github].filter(
    Boolean
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || ""}</Text>
          {data.title ? <Text style={styles.title}>{data.title}</Text> : null}
          <Text style={styles.contact}>{contactParts.join(" | ")}</Text>
          {linkParts.length > 0 && (
            <Text style={styles.contact}>
              {data.contact?.linkedin && (
                <Link src={ensureUrl(data.contact.linkedin)} style={styles.link}>
                  LinkedIn
                </Link>
              )}
              {data.contact?.linkedin && data.contact?.github ? " | " : ""}
              {data.contact?.github && (
                <Link src={ensureUrl(data.contact.github)} style={styles.link}>
                  GitHub
                </Link>
              )}
            </Text>
          )}
        </View>

        {/* SECTIONS — same order as modern.js sectionRenderers */}
        <SummarySection data={data} />
        <SkillsSection data={data} />
        <ExperienceSection data={data} />
        <InternshipsSection data={data} />
        <ProjectsSection data={data} />
        <EducationSection data={data} />
        <CertificationsSection data={data} />
        <AchievementsSection data={data} />
        <ActivitiesSection data={data} />
        <PublicationsSection data={data} />
        <VolunteerWorkSection data={data} />
        <PositionsSection data={data} />
      </Page>
    </Document>
  );
}
