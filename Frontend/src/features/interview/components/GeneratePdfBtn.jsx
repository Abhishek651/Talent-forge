// GeneratePdfBtn.jsx
import { useInterview } from "../hooks/useInterview";

export function GeneratePdfBtn({ interviewReportId }) {
  const { fetchResumePdf, pdfLoading } = useInterview();
    // console.log("GeneratePdfBtn interviewReportId:", interviewReportId); // Debug log
  return (
    <button
      type="button"
      onClick={() => fetchResumePdf(interviewReportId)}
      disabled={!interviewReportId || pdfLoading}
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pdfLoading ? "Generating..." : "Download Resume"}
    </button>
  );
}