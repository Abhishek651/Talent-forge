import React from "react";
import { Textarea } from "@/components/ui/textarea";

const SelfDescription = ({ selfDec, setSelfDec }) => {

    async function handleInput(e){
        await setSelfDec(e.target.value);
        console.log(selfDec);
      }

  return (
    <div className="flex flex-col h-56 md:h-full min-h-0">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2 pl-2 sm:pl-4 mt-0">Quick Self Description
        <span className="text-sm mx-2">(Optional)</span>
      </h2>
      <Textarea
        value={selfDec}
        onChange={handleInput}
        className="flex-1 w-full rounded-2xl p-4 sm:p-6 resize-none text-sm md:text-base lg:text-lg"
        placeholder="e.g., I'm an experienced DevOps Engineer with 5 years in cloud infrastructure and CI/CD pipelines. (Optional if resume is uploaded)"
      />
    </div>
  );
};

export default SelfDescription;