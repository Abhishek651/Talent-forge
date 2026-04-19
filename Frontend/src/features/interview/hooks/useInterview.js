import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  getLatestInterviewReport,
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

const { loading, setLoading, report, setReport, reportList, setReportList, error, setError } = context;

  const generateReport = async ({
    jobDescription,
    resume,
    selfDescription,
  }) => {
    setLoading(true);
    setError("");  // Clear previous errors
    try {
      const generatedReport = await generateInterviewReport({
        jobDescription,
        resume,
        selfDescription,
      });
      setReport(generatedReport);
    } catch (error) {
      console.error("Error generating interview report:", error);
      if (error.response?.status === 503 || error.message?.includes("Service Unavailable")) {
        setError("AI service is temporarily unavailable. Please try again in a few minutes.");
      } else {
        setError("An error occurred while generating the report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (id) => {
    setLoading(true);
    try {
      const reportData = await getInterviewReportById(id);
      setReport(reportData);
    } catch (error) {
      console.error("Error fetching interview report by ID:", error);
      setError("An error occurred while fetching the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    try {
      const reports = await getAllInterviewReports();
      setReportList(reports.data);
    } catch (error) {
      console.error("Error fetching all interview reports:", error);
      setError("An error occurred while fetching the reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const getLatestReport = async (userId) => {
    setLoading(true);
    try {
        const latestReportData = await getLatestInterviewReport(userId);
        setReport(latestReportData);
    }
    catch (error) {
        console.error("Error fetching latest interview report:", error);
        setError("An error occurred while fetching the latest report. Please try again.");
    } finally {
        setLoading(false);
    }
  };


  return {
    loading,
    setLoading,
    report,
    reportList,
    error,
    setError,
    generateReport,
    getReportById,
    getAllReports,
    getLatestReport,
  };
};
