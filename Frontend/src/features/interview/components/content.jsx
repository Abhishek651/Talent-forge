import React from "react";
import Question from "./question";
import TimelineComponent from "./timeline";
import { useInterview } from "../hooks/useInterview";

const Content = ({ activeTab, isMobile }) => {
  const { report } = useInterview();

  //waiting for report to load(setReport doesn't update immediately) and to avoid accessing properties of undefined
  if (!report || !report.data) {
    return <div className="p-4">Loading report data...</div>;  // Show a loading message
  }

  const technical = report.data.technicalQuestions;
  const behavioral = report.data.behavioralQuestions;
  const preparationPlan = report.data.preparationPlan;
  const skillGaps = report.data.skillGaps;
  const matchScore = report.data.score;
  const scoreBreakdown = report.data.scoreBreakdown;

  if (isMobile) {
    return (
      <div className="">
        <div className="technical-questions p-4 lg:px-10 lg:py-6 md:px-6 md:py-4 rounded-xl bg-white shadow-sm mt-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ">
            Technical Questions
          </h2>
          {technical.map((q, index) => (
            <Question key={index} indx={index+1} ques={q.question} intention={q.intention} answer={q.answer} />
          ))}
        </div>
        <div className="behavioral-questions p-4 lg:px-10 lg:py-6 md:px-6 md:py-4 rounded-xl bg-white shadow-sm mt-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Behavioral Questions
          </h2>
          {behavioral.map((q, index) => (
            <Question key={index} indx={index+1} ques={q.question} intention={q.intention} answer={q.answer} />
          ))}
        </div>
        <TimelineComponent preparationPlan={preparationPlan} />;
      </div>
    );
  } else if (activeTab === "technicalQuestions") {
    return (
      <div className="technical-questions p-4 lg:px-10 lg:py-6 md:px-6 md:py-4 rounded-xl bg-white shadow-sm mt-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ">
          Technical Questions
        </h2>
        {technical.map((q, index) => (
          <Question key={index} indx={index+1} ques={q.question} intention={q.intention} answer={q.answer} />
        ))}
      </div>
    );
  } else if (activeTab === "behavioralQuestions") {
    return (
      <div className="behavioral-questions p-4 lg:px-10 lg:py-6 md:px-6 md:py-4 rounded-xl bg-white shadow-sm mt-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Behavioral Questions
        </h2>
        {behavioral.map((q, index) => (
          <Question key={index} indx={index+1} ques={q.question} intention={q.intention} answer={q.answer} />
        ))}
      </div>
    );
  } else if (activeTab === "preparationPlan") {
    return <TimelineComponent preparationPlan={preparationPlan} />;
  }
};

export default Content;
