import React from "react";
import { UserRound } from "lucide-react";
import { FileUp } from "lucide-react";
import { Input } from "@/components/ui/input"

const Resume = ({ resumeRef,disabled }) => {

  return (
    <div className="profile shrink-0">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2 mt-0">
        <UserRound className="text-purple-600 inline size-6 sm:size-8 md:size-10 mr-2" /> Profile & Resume
        <span className="bg-green-200 px-2 py-1 mx-2 rounded-md text-sm">Recommended</span>
      </h2>
      <div className="resume border-2 border-dashed border-purple-400 bg-white rounded-md p-4 sm:p-6 md:p-4 flex flex-col items-center gap-2">
        <div className="p-3 bg-purple-50 rounded-xl size-16 md:size-14 flex items-center justify-center">
          <FileUp className="text-purple-600 inline-block size-8 md:size-7" />
        </div>
        <h4 className="font-medium text-slate-800 text-base md:text-base lg:text-lg">Upload your resume</h4>
        <p className="text-xs sm:text-sm text-gray-600">PDF upto 5MB</p>
        <Input disabled={disabled} id="resume" type="file" className="bg-purple-100 w-32 sm:w-40 md:w-48 lg:w-60 h-10 sm:h-12 text-sm sm:text-base lg:text-lg" ref={resumeRef} />

      </div>
    </div>
  );
};

export default Resume