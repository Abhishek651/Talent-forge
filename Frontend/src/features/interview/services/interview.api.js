import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  withCredentials: true,
});

/**
 * @function generateInterviewReport
 * @description Generate an interview report based on job description, resume, and self-description
 * @param {Object} params - The parameters for generating the interview report
 * @returns {Promise<Object>} - The generated interview report
 */
export const generateInterviewReport = async ({
  jobDescription,
  resume,
  selfDescription,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resume);

  const response = await api.post("/interview/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * @function getInterviewReportById
 * @description Get a specific interview report by ID
 * @param {string} reportId - The ID of the interview report to retrieve
 * @returns {Promise<Object>} - The interview report with the specified ID
 */

export const getInterviewReportById = async (reportId) => {
  const response = await api.get(`/interview/report/${reportId}`);
  return response.data;
};

/**
 * @function getAllInterviewReports
 * @description Get all interview reports for the authenticated user
 * @returns {Promise<Array>} - An array of interview reports for the authenticated user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/interview/report");
  return response.data;
};

/**
 * @function getLatestInterviewReport
 * @description Get the latest interview report for a specific user
 * @param {string} userId - The ID of the user whose latest interview report to retrieve
 */
export const getLatestInterviewReport = async (userId) => {
  const response = await api.get(`/interview/report/latest/${userId}`);
  return response.data;
};

/**
 * @function generateResumePdf
 * @description Generate a PDF version of a resume by its ID
 * @param {string} resumeId - The ID of the resume to generate as PDF
 */
export const generateResumePdf = async (interviewReportId) => {
  console.log(
    "Generating resume PDF for interview report ID:",
    interviewReportId,
  );
  const response = await api.post(
    `/interview/report/resume-pdf/${interviewReportId}`,
    {}, // request body (empty)
    { responseType: "blob" }, // axios config
  );
  return response.data;

//   Axios expects (url, data, config). Passing responseType as the second argument 
// sends it as request JSON and the request is malformed. The server likely ignores 
// the invalid JSON body and processes the request, but it doesn't return the PDF as expected. 
// By moving responseType to the third argument, we ensure it's treated as axios config and the request is properly formed.

// otherwise gives error
// installHook.js:1 Error generating resume PDF: AxiosError: Network Error
//     at async generateResumePdf (interview.api.js:71:22)
//     at async fetchResumePdf (useInterview.js:90:23)

};

/**
 * @function deleteInterviewReport
 * @description Delete a specific interview report by ID
 * @param {string} reportId - The ID of the interview report to delete
 */
export const deleteInterviewReport = async (reportId) => {
  await api.delete(`/interview/report/${reportId}`);
};


/**
 * @function generate a new PDF for my resume
 * @description Generate a PDF version of the user's resume based on self-description
 * @param {Object} selfDescription - The self-description data to generate the resume PDF
 */
export const generateMyResumePdf = async (selfDescription) => {
  // console.log("Generating resume PDF for self-description:", selfDescription);
  const response = await api.post(
    `/my-resume/pdf`,
    {selfDescription},
    { responseType: "blob" }
  );
  return response.data;
};
