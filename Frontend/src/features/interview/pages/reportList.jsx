import React from "react";
import RecentlyCreated from "../components/recentlyCreated";
import { useEffect } from "react";
import { useInterview } from "../hooks/useInterview";

const ReportList = () => {
  const { getAllReports } = useInterview();
  useEffect(() => {
    // Fetch all reports when the component mounts
    getAllReports();
  }, []);
  return (
    <div className="p-4">
      <RecentlyCreated/>
    </div>
  );
};

export default ReportList;
