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

const Dashboard = () => {
  const { user } = useAuth();
  const { report, getReportById, getLatestReport, setReport, error, setError } =
    useInterview();
  const [activeTab, setActiveTab] = useState("technicalQuestions");
  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: "(max-width: 786px)",
  });

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
