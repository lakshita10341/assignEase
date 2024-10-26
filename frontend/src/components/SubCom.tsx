import React, { useEffect, useState } from 'react'
import api from "../../api"
import { getSubmission } from '@/routes/route';
interface DataProps {
    data: {
        group_id: number;
        assignment_id: number;
    };
}
interface Comment{
    comment:string,
    reviewer_id:string,
    submit_id:number,
}
interface Submission{
    submission_id:number,
    submission_text:string,
    submit_date:Date,
    submission_file:File,
}
const SubCom : React.FC<DataProps> = ({ data })=>{
    const [submissions, setSubmissions]=useState<Submission[]>([])
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
        useEffect(()=>{
           const fetchData = async()=>{
            try{
                const response= await api.get(getSubmission, {params : data})
                setSubmissions(response.data)
                console.log(response.data)
            }catch(err:any){

            }
           }
           fetchData();
        },[])
        const fetchComments=(submission_id:Number)=>{
            try{
                
            }catch(err:any){

            }
        }
    return (
        <>
            <div>       
            {submissions.map((submission) => (
                    <div key={submission.submission_id}>
                        <p>{submission.submission_text}</p>
                        <button onClick={() => fetchComments(submission.submission_id)}>
                            Show Comments
                        </button>
                       
                        
                    </div>
                ))} 
          </div>
        </>
    )
}
export default SubCom;