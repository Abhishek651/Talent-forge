import React, { useState, useRef, useEffect } from "react";
import Resume from "../components/resume";
import JobDescription from "../components/jobDescription";
import SelfDescription from "../components/selfDescription";
import { Button } from "@/components/ui/button";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import RecentlyCreated from "../components/recentlyCreated";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { LoadingOverlay } from "../components/loadingOverlay";

const Home = () => {
  const {
    pdfLoading,
    setPdfLoading,
    loading,
    setLoading,
    generateReport,
    getAllReports,
    error,
    setError,
  } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

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
  }, 5500);// cycles text roughly every 5.5 seconds for 9 messages (~49s total)

  return () => clearInterval(interval);
}, [loading, pdfLoading]);

  useEffect(() => {
    setError(null);
    getAllReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    const resumeFile = resumeInputRef.current?.files[0];
    // Validation: Ensure at least resume or self-description is provided
    if (!resumeFile && !selfDescription.trim()) {
      setError("Please provide either a resume file or a self-description.");
      return;
    }

    setLoading(true);
    try {
      await generateReport({
        jobDescription,
        resume: resumeFile,
        selfDescription,
      });

      navigate("/dashboard"); // runs after success
    } catch (err) {
      setError(
        "An error occurred while generating the report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-full min-h-full p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 lg:gap-6 bg-purple-50">
      <LoadingOverlay
        visible={loading || pdfLoading}
        text={loadingText
        }
      />
      <div className="text-box text-center mx-auto w-full">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          Create your <span className="text-purple-500">Interview Plan</span>
        </h1>
        <p className="font-light text-stone-800 text-lg sm:text-xl md:text-2xl my-4 sm:my-6">
          Align your profile with the Industry demands of target role
        </p>
      </div>
      <div>
        <form
          onSubmit={handleSubmit} // Use onSubmit for better form handling
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4 w-full max-w-6xl lg:h-[600px] mx-auto min-h-0 overflow-hidden"
        >
          <JobDescription des={jobDescription} setDes={setJobDescription} />
          <div className="right-side flex flex-col h-full min-h-0 gap-4 sm:gap-4">
            <Resume resumeRef={resumeInputRef} />
            <SelfDescription
              selfDec={selfDescription}
              setSelfDec={setSelfDescription}
            />
          </div>
          {error && ( // Show alert if there's an error
            <Alert variant="destructive" className="max-w-md mx-auto mb-4">
              <AlertCircleIcon />
              <AlertTitle>Something Went Wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="col-span-full">
            Submit
          </Button>
        </form>
      </div>
      <RecentlyCreated />
    </div>
  );
};

export default Home;
