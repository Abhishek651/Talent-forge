import React from "react";

const Question = ({ ques = "", intention = "", answer = "", indx=1 }) => {
  return (
    <div className="questions mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className=" self-start rounded-full bg-violet-100 px-3 py-1 text-xs md:text-sm lg:text-base font-semibold text-violet-700">
          Q{indx}
        </span>
        <p className="text-sm md:text-base lg:text-lg font-medium text-slate-700">
          {ques}
        </p>
      </div>

      <div className="mb-4">
        <span className="text-sm md:text-base lg:text-lg text-purple-700">
          Intention :{" "}
        </span>
        <p className="text-emerald-400 text-sm md:text-base lg:text-lg">
          {intention}
        </p>
      </div>

      <div className="">
        <p className="text-sm md:text-base lg:text-lg text-purple-700 mb-1">
          Suggested Answer :
        </p>
        <p className="rounded-lg bg-purple-100 p-2 text-sm md:text-base lg:text-lg text-slate-700">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default Question;
