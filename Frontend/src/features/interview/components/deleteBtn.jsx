import {Button} from "@/components/ui/button";
import { useInterview } from "../hooks/useInterview";

export function DeleteInterviewBtn({ interviewId }) {
    const { deleteReport } = useInterview();
    function deleteInterview(interviewId) {
        // console.log(`Deleting interview with ID: ${interviewId}`);
    
        deleteReport(interviewId)
            .then(() => {
                console.log("Interview deleted successfully");
            })
            .catch((error) => {
                console.error("Error deleting interview:", error);
            });
    }
    return (
        <Button variant="destructive" onClick={() => deleteInterview(interviewId)}>
            Delete Interview
        </Button>
    );
}