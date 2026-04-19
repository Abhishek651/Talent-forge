import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api/interview/',
    withCredentials: true,
})

/**
 * @function generateInterviewReport
 * @description Generate an interview report based on job description, resume, and self-description
 * @param {Object} params - The parameters for generating the interview report
 * @returns {Promise<Object>} - The generated interview report
 */
export const generateInterviewReport = async ({ jobDescription, resume, selfDescription }) => {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resume);

    const response = await api.post('/report', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;

}


/**
 * @function getInterviewReportById
 * @description Get a specific interview report by ID
 * @param {string} reportId - The ID of the interview report to retrieve
 * @returns {Promise<Object>} - The interview report with the specified ID
 */

export const getInterviewReportById = async (reportId) => {
    const response = await api.get(`/report/${reportId}`);
    return response.data;
}


/**
 * @function getAllInterviewReports
 * @description Get all interview reports for the authenticated user
 * @returns {Promise<Array>} - An array of interview reports for the authenticated user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get('/report');
    return response.data;
}

/**
 * @function getLatestInterviewReport
 * @description Get the latest interview report for a specific user
 * @param {string} userId - The ID of the user whose latest interview report to retrieve
 */
export const getLatestInterviewReport = async (userId) => {
    const response = await api.get(`/report/latest/${userId}`);
    return response.data;
}