import React from "react";
import { Code, Database, Brain, Target, BookOpen, CheckCircle } from "lucide-react";
import {
  Timeline,
  TimelineBody,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineSeparator,
} from "@/components/ui/timeline";

const TimelineComponent = ({ preparationPlan = [] }) => {
  return (
    <div className="timeline-container my-8 py-6 px-4 xl:my-2 rounded-xl bg-white shadow-sm overflow-y-auto lg:px-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-10 text-center">Preparation Plan</h2>
      
      <div className="relative max-w-5xl mx-auto">
        <div className="hidden lg:block absolute left-1/2 top-4 bottom-0 w-0.5 bg-primary -translate-x-1/2"></div>
        
        <Timeline color="primary" orientation="vertical" className="lg:static">
          {preparationPlan.map((plan, index) => {
            const icons = [Code, Database, Brain, Target, BookOpen, CheckCircle];
            const Icon = icons[index % icons.length];
            const isEven = index % 2 === 0;

            return (
              <TimelineItem 
                key={plan.day}
                className={`lg:w-full lg:justify-between lg:items-start lg:flex ${
                  isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                <div className="hidden lg:block lg:w-1/2"></div>

                <TimelineHeader className="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:flex lg:justify-center z-10 w-6">
                  {index !== preparationPlan.length - 1 && (
                    <TimelineSeparator className="lg:hidden" />
                  )}
                  <TimelineIcon>
                    <Icon className="h-4 w-4" />
                  </TimelineIcon>
                </TimelineHeader>

                <TimelineBody 
                  className={`-translate-y-1.5 pb-10 lg:w-1/2 lg:flex-none ${
                    isEven ? "lg:pr-10 lg:text-right" : "lg:pl-10 lg:text-left"
                  }`}
                >
                  <div className={`space-y-2 flex flex-col ${isEven ? "lg:items-end" : "lg:items-start"}`}>
                    <h3 className="text-lg md:text-xl lg:text-2xl leading-none font-bold text-slate-800">
                      Day {plan.day}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs md:text-sm font-semibold rounded-full capitalize">
                      Focus: {plan.focus}
                    </span>
                  </div>
                  
                  <ul className={`text-muted-foreground mt-4 text-sm md:text-base lg:text-lg space-y-2 ${isEven && "lg:flex lg:flex-col lg:items-end"}`}>
                    {plan.tasks.map((task, i) => (
                      <li key={i} className={`flex items-start gap-2 ${isEven && "lg:flex-row-reverse"}`}>
                        <div className={`h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0`} />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </TimelineBody>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    </div>
  );
};

export default TimelineComponent;
