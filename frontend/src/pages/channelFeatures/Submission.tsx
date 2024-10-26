import SubCom from "@/components/SubCom";
import { RootState } from "@/redux/store";
import { addCommentRoute, submissionRoute } from "@/routes/route";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../api"
interface Assignment{
    assignment_id:number;
    title:string;
    description:string;
    deadline:Date;
}

interface Group{
    group_id:number;
    assignment_id:Assignment;
}
interface LocationState {
    group: Group;
    role:string;
}

const Submissions : React.FC = ()=>{
   
    const location = useLocation();
    const { group,role } = location.state as LocationState || {}; 
    const [comment,setComment] = useState<string>('');
    const [submissionText, setSubmission] = useState<string>('');
    
    const data = {
        assignment_id:group.assignment_id.assignment_id,
        group_id:group.group_id,
    }
    const handleSubmit =async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!submissionText){
            console.log("submission can't be empty");
            return;
        }
        const submissionData ={
            assignment_id:group.assignment_id.assignment_id,
            group_id:group.group_id,
            submission:submissionText,
        }
        try {
            const response = await api.post(submissionRoute, submissionData);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    };
    const addComment = async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!comment){
            console.log("submission can't be empty");
            return;
        }
        const Comment ={
            assignment_id:group.assignment_id.assignment_id,
            group_id:group.group_id,
            comment:comment,
        }
        try {
            const response = await api.post(addCommentRoute, Comment);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to COMMENT:", error);
        }
    }
    
    return(

        <>
            <div className="flex flex-col">
            <div className="text-bold shadow-md border rounded-md m-2">
                            <h2>{group.assignment_id.title}</h2>
                        </div>
                        <div className="text-bold shadow-md border rounded-md m-2">
                            <h2>{group.assignment_id.description}</h2>
                        </div> 
                        <SubCom data={data}></SubCom>
            {
                role==="student" ? (
                    <>
                        <form onSubmit={handleSubmit}>
                        <div className="submission-box border p-4 m-2">
                        <h3>Student Submission Box</h3>
                        <textarea placeholder="Write your submission here" className="w-full p-2 border" value={submissionText} onChange={(e)=>setSubmission(e.target.value)}/>
                        <button className="btn mt-2 p-2 bg-green-500 text-white" type='submit'>Submit Submission</button>
                        </div>
                        </form>
                    </>
                ):(
                    role==="reviewer" ? (
                        <>
                          <form onSubmit={addComment}>
                        <div className=" border p-4 m-2">
                        <h3>Comment</h3>
                        <textarea placeholder="Comment" className="w-full p-2 border" value={comment} onChange={(e)=>setComment(e.target.value)}/>
                        <button className="btn mt-2 p-2 bg-green-500 text-white" type='submit'>Comment</button>
                        </div>
                        </form>  
                        </>
                    ) : (
                        <>
                        </>
                    )
                )
            }
            
            </div>
        </>
    )
}
export default Submissions;