import React from "react";
import ScoreCard from "../components/ScoreCard";
import Content from "../components/content";
import Sidebar from "../components/sidebar";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../../auth/Hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingOverlay } from "../components/loadingOverlay";
import { GeneratePdfBtn } from "../components/GeneratePdfBtn";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    report,
    getReportById,
    getLatestReport,
    setReport,
    error,
    setError,
    pdfLoading,
    loading,
  } = useInterview();
  const [activeTab, setActiveTab] = useState("technicalQuestions");
  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: "(max-width: 786px)",
  });

  const generateReportMessages = [
    "Analyzing your profile...",
    "Matching skills to job description...",
    "Brainstorming technical questions...",
    "Crafting behavioral questions...",
    "Identifying potential skill gaps...",
    "Generating a personalized plan...",
    "Polishing the report...",
    "Finalizing your interview dashboard...",
    "Almost ready, just a few more seconds...",
  ];

  const pdfGenerateMessages = [
    "Preparing your personalized resume...",
    "Extracting key achievements from your interview report...",
    "Aligning your experience with the target role...",
    "Highlighting relevant skills and strengths...",
    "Optimizing resume sections for impact...",
    "Formatting your resume for a polished look...",
    "Adding final improvements to the PDF...",
    "Almost done, generating your resume file...",
    "Your resume PDF will be ready in a moment...",
  ];

  const [loadingText, setLoadingText] = useState(generateReportMessages[0]);

  useEffect(() => {
    const messages = pdfLoading ? pdfGenerateMessages : generateReportMessages;

    if (!loading && !pdfLoading) return;

    let index = 0;
    setLoadingText(messages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 5500); // cycles text roughly every 5.5 seconds for 9 messages (~49s total)

    return () => clearInterval(interval);
  }, [loading, pdfLoading]);

  useEffect(() => {
    const fetchReport = async () => {
      if (user && user.id && !report) {
        await getLatestReport(user.id);
      }
    };
    fetchReport();
  }, [user]);

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mb-4">
        <AlertCircle />
        <AlertTitle>No Reports Found</AlertTitle>
        <AlertDescription>
          Please create a new report to see the dashboard.
        </AlertDescription>
      </Alert>
    );
  } else {
    return (
      <div
        className="main-container grid grid-cols-1 xl:grid-cols-12 gap-2  
                  h-full w-full bg-purple-50
                  xl:overflow-hidden"
      >
        <LoadingOverlay visible={loading || pdfLoading} text={loadingText} />
        <div className="sideBar hidden xl:block xl:col-span-2 border-r ">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            report={report}
          />
        </div>
        <div className="score xl:col-span-3 order-first xl:order-last xl:overflow-y-auto">
          <h1 className="text-lg xl:text-xl font-bold mt-2 xl:hidden text-center">
            Job Title :{" "}
            <span className="text-purple-700">
              {report?.data?.jobTitle || "Unavailable"}
            </span>
          </h1>
          <div className="px-2 py-3 xl:hidden ">
            <div className="flex flex-col justify-center items-center rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 shadow-sm transition-all duration-200 hover:shadow-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-600">
                AI Resume Export
              </p>

              <h4 className="mt-2 text-sm font-bold text-gray-900">
                Get a personalized resume for this job
              </h4>

              <p className="mt-1 text-xs leading-5 text-gray-600 text-center">
                Tailored from your current interview report for a stronger application.
              </p>

              <div className="mt-4">
                <GeneratePdfBtn interviewReportId={report?.data?._id} />
              </div>
            </div>
          </div>
          <ScoreCard />
        </div>
        <div className="content xl:col-span-7 xl:overflow-y-auto min-h-0 px-4">
          <Content activeTab={activeTab} isMobile={isMobile} />
        </div>
      </div>
    );
  }
};

export default Dashboard;
