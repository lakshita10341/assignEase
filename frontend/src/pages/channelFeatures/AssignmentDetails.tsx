import DashBoardComponents from "@/components/dashBoardComponents"
import Navbar from "@/components/navbar"
import { fetchAssignments } from "@/features/thunks/fetchAssignmentThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const AssignmentDetails: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { assignments, loading, error } = useSelector((state: RootState) => state.assignments);
    const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (assignments.length === 0) {
            dispatch(fetchAssignments(selectedChannelId)); 
          
        }
    }, [dispatch, assignments.length]);

    const numericAssignmentId = Number(assignmentId);
    const assignment = assignments.find((a) => a.assignment_id === numericAssignmentId);
  // const assignment = assignments.find((a) => a.assignment_id === assignmentId);

    useEffect(() => {
        //assignment = assignments.find((a) => a.assignment_id === assignmentId);
        console.log(assignmentId)
        console.log(assignments);  // Check if assignments are correctly loaded
        console.log(assignment);   // Check the selected assignment
    }, [assignments, assignment]);
    if(!assignments.length){
        return <p>No assignment found</p>
    }
    if (loading) {
        return <p>Loading assignments...</p>;
    }

    if (error) {
        return <p>Failed to load assignments: {error}</p>;
    }

    if (!assignment) {
        return <p>No assignment found for ID: {assignmentId}</p>;
    }

    return (
        <>
            <div className="relative w-screen h-screen">
                <Navbar />
                <div className="flex flex-row w-full h-full absolute top-20">
                    <div className="w-3/12 h-full">
                        <DashBoardComponents />
                    </div>
                    <div className="flex w-9/12 flex-col  ">
                        <div className="text-bold shadow-md border rounded-md m-2">
                            <h2>{assignment.title}</h2>
                        </div>
                        <div className="text-bold shadow-md border rounded-md m-2">
                            <h2>{assignment.description}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AssignmentDetails;
