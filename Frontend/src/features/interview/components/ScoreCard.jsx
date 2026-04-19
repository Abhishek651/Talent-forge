import React from "react";
import { CircularProgress } from "@/components/ui/progress-09";
import { Slider } from "@/components/ui/slider";
import { useInterview } from "../hooks/useInterview";

const ScoreCard = () => {
  const { report } = useInterview();

  if (!report || !report.data) {
    return <div className="p-4">Loading scorecard...</div>;
  }

  const { matchScore, scoreBreakdown } = report.data;

  return (
    <div className="score-container p-4 xl:pr-4 xl:pt-4 flex flex-col lg:flex-row xl:flex-col justify-center gap-5 lg:w-full">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row xl:flex-col lg:w-[70%] xl:w-full">
        <div className="scoreCard mx-auto flex w-full flex-col items-center md:w-[40%] xl:w-full ">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-900 font-semibold">
            Overall Match
          </h2>
          <CircularProgress
            labelClassName="text-xl md:text-2xl lg:text-3xl font-bold"
            value={matchScore}
            showLabel
            renderLabel={(value) => `${value}%`}
            size={120}
            strokeWidth={10}
          />
          {/* <p className="text-center text-sm md:text-base lg:text-lg text-muted-foreground p-4">
            Candidate shown demonstrate strong alignment with core technical
            requirements.
          </p> */}
        </div>
        {/* Score Breakdown */}
        <div className="score-breakdown mt-4 md:w-[60%] xl:w-full">
          <h3 className="text-lg md:text-xl lg:text-2xl text-slate-900 font-medium mb-2">
            Score Breakdown
          </h3>
          <div className="">
            <span className="flex justify-between text-sm md:text-base lg:text-lg">
              <p>Technical Skills</p>
              <p>{scoreBreakdown.technical}%</p>
            </span>
            <Slider value={[scoreBreakdown.technical]} max={100} step={1} />
          </div>
          <div className="my-4">
            <span className="flex justify-between text-sm md:text-base lg:text-lg">
              <p>Communication Skills</p>
              <p>{scoreBreakdown.communication}%</p>
            </span>
            <Slider value={[scoreBreakdown.communication]} max={100} step={1} />
          </div>
          <div className="">
            <span className="flex justify-between text-sm md:text-base lg:text-lg">
              <p>Experience</p>
              <p>{scoreBreakdown.experience}%</p>
            </span>
            <Slider value={[scoreBreakdown.experience]} max={100} step={1} />
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="skill-gap mt-6">
        <h3 className="text-lg md:text-xl lg:text-2xl text-slate-900 font-medium mb-2">
          Skill Gap Analysis
        </h3>
        <div className="badge flex flex-wrap gap-4">
          {report.data.skillGaps.map((gap, index) => (
            <span 
              key={index} 
              className={`rounded-lg py-2 px-5 ${
                gap.severity === 'high' ? 'bg-red-200' : 'bg-orange-200'
              }`}
            >
              <p className="text-sm md:text-md lg:text-lg font-semibold">
                {gap.skill}
              </p>
              {/* <p className="text-sm md:text-base lg:text-lg capitalize">
                {gap.severity}
              </p> */}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
