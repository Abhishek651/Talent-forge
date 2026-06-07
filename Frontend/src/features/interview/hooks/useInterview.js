import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  getLatestInterviewReport,
  generateResumePdf,
  deleteInterviewReport,
  generateMyResumePdf
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import { toast } from "sonner";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

const { loading, setLoading, pdfLoading, setPdfLoading, report, setReport, reportList, setReportList, error, setError } = context;

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
    setError(""); // clear previous errors
    try {
      const reportData = await getInterviewReportById(id);
      setReport(reportData);
      setError(""); // clear error on success
    } catch (error) {
      console.error("Error fetching interview report by ID:", error);
      setError("An error occurred while fetching the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    setError(""); // clear previous errors
    try {
      const reports = await getAllInterviewReports();
      setReportList(reports.data);
      setError(""); // clear error on success
    } catch (error) {
      console.error("Error fetching all interview reports:", error);
      setError("An error occurred while fetching the reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const getLatestReport = async (userId) => {
    setLoading(true);
    setError(""); // clear previous errors
    try {
      const latestReportData = await getLatestInterviewReport(userId);
      setReport(latestReportData);
      setError(""); // clear error on success
    }
    catch (error) {
      console.error("Error fetching latest interview report:", error);
      setError("An error occurred while fetching the latest report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResumePdf = async (interviewId) => {
    // console.log("Fetching resume PDF for interview ID:", interviewId);
    setPdfLoading(true);
    setError(""); // clear any previous error before starting
    try {
      const pdfData = await generateResumePdf(interviewId);
      // clear error on success to avoid stale error state
      setError("");
      const url = window.URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

       toast.success("Resume PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating resume PDF:", error);
      setError("An error occurred while generating the resume PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await deleteInterviewReport(reportId);
      // Remove the deleted report from the list
      setReportList((prevList) => prevList.filter((report) => report._id !== reportId));
      toast.success("Interview report deleted successfully!");
    } catch (error) {
      console.error("Error deleting interview report:", error);
      setError("An error occurred while deleting the report. Please try again.");
    }
  };


  const generateMyResume = async (selfDescription) => {
    setPdfLoading(true);
    try {
      const pdfData = await generateMyResumePdf(selfDescription);
      const url = window.URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Resume PDF generated and downloaded successfully!");
    } catch (error) {
      console.error("Error generating my resume PDF:", error);
      toast.error("Failed to generate resume PDF. Please try again.");
      setError("An error occurred while generating the resume PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };
  return {
    loading,
    setLoading,
    pdfLoading,
    setPdfLoading,
    report,
    reportList,
    error,
    setError,
    generateReport,
    getReportById,
    getAllReports,
    getLatestReport,
    fetchResumePdf,
    deleteReport,
    generateMyResume
  };
};
