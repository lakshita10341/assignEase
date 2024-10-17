import DashBoardComponents from "@/components/dashBoardComponents";
import Navbar from "@/components/navbar";
import { fetchAssignments } from "@/features/thunks/fetchAssignmentThunk";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CreatedAssignments : React.FC =()=>{
    const {assignments} = useSelector((state:RootState)=>state.assignments)
    const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            console.log("4")
            if (selectedChannelId) {
                console.log("calling..")
                try {
                    console.log("F")
                    await dispatch(fetchAssignments(selectedChannelId)).unwrap();
                    console.log(assignments);// Logging after fetching
                } catch (error) {
                    console.error("Failed to fetch assignments:", error);
                }
            }else{
                console.log("No channel selected")
            }
        };
        console.log("1")
        fetchData(); // Call the async function inside useEffect
        console.log("2")
        console.log(assignments)
    }, [dispatch, selectedChannelId]);

    useEffect(() => {
        console.log("Assignments:", assignments);
      }, [assignments]); 


      const navigateToAssignment = (assignmentId:number)=>{
        navigate(`/assignment/${assignmentId}`)
      }
    return (
    <>
        <div className="relative w-screen h-screen">
                <Navbar />
                <div className="flex flex-row w-full h-full absolute top-20">
                    <div className="w-3/12 h-full">
                        <DashBoardComponents />
                    </div>
                    <div className="flex w-9/12 flex-col justify-center items-center"></div>
                    {
                        assignments.length > 0 ? (
                            assignments.map((assignment)=>(
                                <div 
                                key={assignment.assignment_id} 
                                className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                                onClick={()=>navigateToAssignment(assignment.assignment_id)}
                                >
                                    {assignment.title}
                                    </div>
                            ))
                        ) : 
                        (
                            <p>No assignments created</p>
                        )
                    }
        </div>
        </div>
    </>
    )
}
export default CreatedAssignments;