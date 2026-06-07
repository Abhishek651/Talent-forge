import React from "react";
import { Code, Users, Target, PlusCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../auth/Hooks/useAuth";
import RecentlyCreated from "./recentlyCreated";
import { GeneratePdfBtn } from "./GeneratePdfBtn";

// create sidebar
const Sidebar = ({ activeTab, setActiveTab, report }) => {
  const { handleLogout } = useAuth();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // console.log("Sidebar report data:", report);

  // Shared base styles with text responsiveness
  const baseItemStyle =
    "flex items-center gap-3 px-4 py-3 cursor-pointer text-sm md:text-base lg:text-lg transition-colors";

  // Active / Inactive states matching the image design
  const activeItemStyle =
    "bg-purple-100 border-l-4 border-purple-600 text-purple-700 font-bold";
  const inactiveItemStyle =
    "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent";

  return (
    <div className="sidebar flex flex-col gap-2 py-4 h-full">
      <h1 className="text-lg xl:text-xl font-bold mt-2 text-center">
        <span className="text-purple-900 mb-4 block">
          {report?.data?.jobTitle || "Unavailable"}
        </span>
      </h1>
      <div className="options">
        <div
          onClick={() => handleTabClick("technicalQuestions")}
          className={`${baseItemStyle} ${activeTab === "technicalQuestions" ? activeItemStyle : inactiveItemStyle}`}
        >
          <Code className="size-5 md:size-6" />
          <h3>Technical Questions</h3>
        </div>

        <div
          onClick={() => handleTabClick("behavioralQuestions")}
          className={`${baseItemStyle} ${activeTab === "behavioralQuestions" ? activeItemStyle : inactiveItemStyle}`}
        >
          <Users className="size-5 md:size-6" />
          <h3>Behavioral Questions</h3>
        </div>

        <div
          onClick={() => handleTabClick("preparationPlan")}
          className={`${baseItemStyle} ${activeTab === "preparationPlan" ? activeItemStyle : inactiveItemStyle}`}
        >
          <Target className="size-5 md:size-6" />
          <h3>Preparation Plan</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t p-4">
        <Link to="/reports" className="font-bold">
          View All Reports
        </Link>
      </div>

      <div className="border-t px-2 py-3">
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 shadow-sm transition-all duration-200 hover:shadow-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-600">
            AI Resume Export
          </p>

          <h4 className="mt-2 text-sm font-bold text-gray-900">
            Get a personalized resume for this job
          </h4>

          <p className="mt-1 text-xs leading-5 text-gray-600">
            Tailored from your current interview report for a stronger
            application.
          </p>

          <div className="mt-4">
            <GeneratePdfBtn interviewReportId={report?.data?._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
