
import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reportList, setReportList] = useState([]);
    const [error, setError] = useState("");

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reportList, setReportList, error, setError }}>
            {children}
        </InterviewContext.Provider>
    )
}