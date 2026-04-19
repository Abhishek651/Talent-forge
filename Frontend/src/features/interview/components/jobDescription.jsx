import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

const JobDescription = ({ des, setDes }) => {

  async function handleInput(e){
    await setDes(e.target.value);
    console.log(des);
  }

  return (
    <div className="job-description flex flex-col h-64 md:h-full min-h-0">
      <h2 className="font-medium mb-4 text-start text-xl sm:text-2xl md:text-3xl lg:text-4xl flex items-center gap-2">
        <FileText className="text-purple-600 inline-block size-6 sm:size-8 md:size-10 self-end" />
        Target Job Description *
      </h2>
      <Textarea
        value={des}
        onChange={handleInput}
        required
        className="flex-1 w-full rounded-2xl p-4 sm:p-6 resize-none text-sm md:text-base lg:text-lg"
        placeholder="e.g require professional software engineer with work experience of 3+ years"
      />
    </div>
  );
};

export default JobDescription;