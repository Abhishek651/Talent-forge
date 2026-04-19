import React from "react";
import { useInterview } from "../hooks/useInterview";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const RecentlyCreated = () => {
  const { reportList, getReportById } = useInterview();
  const navigate = useNavigate();
  async function handleClicks(id) {
    await getReportById(id);
    navigate(`/dashboard`);
  }
  return (
    <div>
      <p className="text-md lg:text-lg xl:text-xl font-semibold my-4">
        Recently Created Interview Reports :{" "}
      </p>
      {/* This component will display a list of recently created interview reports for the user. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {reportList.length === 0 ? (
          <p>No interview reports found.</p>
        ) : (
          reportList.map((report) => (
            <div
              key={report._id}
              className="report-item p-4 border flex flex-col flex-wrap gap-2 rounded-md mb-4 bg-white"
            >
              <p className="font-heading font-semibold">Job Title: {report.jobTitle ? report.jobTitle : "Untitled"}</p>
              <p>Created At: {new Date(report.createdAt).toLocaleString()}</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  handleClicks(report._id);
                }}
              >
                View Report
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentlyCreated;
