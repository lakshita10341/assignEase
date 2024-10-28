import SubCom from "@/components/SubCom";

import { changeStatus, submissionRoute } from "@/routes/route";
import React, {  useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../api"
import Navbar from "@/components/navbar";
interface Assignment{
    assignment_id:number;
    title:string;
    description:string;
    deadline:Date;
}

interface Group{
    group_id:number;
    assignment_id:Assignment;
    status:number;
}
interface LocationState {
    group: Group;
    role:string;
}
const STATUS_MAPPING :Record<number, string>= {
    1: "Not Started",
    2: "Under Iteration",
    3: "Completed",
  
};

const Submissions : React.FC = ()=>{
   
    const location = useLocation();
    const { group,role } = location.state as LocationState || {}; 
    const [status, setStatus] = useState(group.status);
    const [submissionText, setSubmission] = useState<string>('');
    const [submissionFile,setSubmissionFile]=useState<File | null>(null);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const data = {
        assignment_id:group.assignment_id.assignment_id,
        group_id:group.group_id,
        role:role,
    }
    const toggleDropdown = () => setStatusDropdownOpen(!statusDropdownOpen);

    const handleStatusChange = async (newStatus:number) => {
        try {
           
            const response = await api.patch(changeStatus, { 
                status: newStatus,
                group_id:group.group_id,
             });
    
            if (response.status === 200) {
                
                setStatus(newStatus);
                setStatusDropdownOpen(false);
                console.log("Status updated successfully:", response.data);
            } else {
                console.error("Failed to update status. Server responded with:", response.status);
            }
        } catch (error) {
            console.error("An error occurred while updating the status:", error);
        }
    };
    const handleSubmit =async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!submissionText && !submissionFile){
            console.log("submission can't be empty");
            return;
        }
        const submissionData ={
            assignment_id:group.assignment_id.assignment_id,
            group_id:group.group_id,
            submission_text:submissionText,
            submission_file:submissionFile,
        }
        try {
            const response = await api.post(submissionRoute, submissionData, {headers: {
                "Content-Type": "multipart/form-data",
            }});
            setSubmissionFile(null);

            setSubmission('');
            console.log(response.data);
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSubmissionFile(e.target.files[0]);
        }
    };
    return(

        <>
        <div className="relative w-screen h-screen">
            <Navbar />
            <div className="flex flex-col absolute top-20 w-full h-full">

            <div className="text-bold shadow-md border rounded-md m-2">
                            <h1>{group.assignment_id.title}</h1>
                            <h2>{group.assignment_id.description}</h2>
                        </div> 
                        {role === "reviewer" ? (
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="btn p-2  rounded"
                                >
                                    Status: {STATUS_MAPPING[status]}
                                </button>
                                {statusDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                                        {Object.entries(STATUS_MAPPING).map(([num, label]) => (
                                            <button
                                                key={num}
                                                onClick={() => handleStatusChange(parseInt(num))}
                                                className="block w-full text-left p-2 hover:bg-blue-100"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-700 font-semibold">Status: {STATUS_MAPPING[status]}</span>
                        )}
                        <SubCom data={data}></SubCom>
            {
                role==="student" ? (
                    <>
                        <form onSubmit={handleSubmit}>
                        <div className="submission-box border p-4 m-2">
                        <h3>Student Submission Box</h3>
                        <textarea placeholder="Write your submission here" className="w-full p-2 border" value={submissionText} onChange={(e)=>setSubmission(e.target.value)}/>
                        <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mt-2"
                                />
                        <button className="btn mt-2 p-2 bg-green-500 text-white" type='submit'>Submit Submission</button>
                        </div>
                        </form>
                    </>
                ):(
                   <>
                   </>
                )
            }
            
            </div>
            </div>
        </>
    )
}
export default Submissions;