import React, { useEffect, useState } from 'react'
import api from "../../api"
import { addCommentRoute, getCommentRoute, getSubmission } from '@/routes/route';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
interface DataProps {
    data: {
        group_id: number;
        assignment_id: number;
        role:string;
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
    const { selectedChannelId } = useSelector((state: RootState) => state.selectChannel)
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
    const [comment, setComment] = useState('');
    const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);
    const [showComments, setShowComments] = useState(false);
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
        const fetchComments=async(submission_id:number)=>{
            try{
                const response = await api.get(getCommentRoute+`?submit_id=${submission_id}`)
                console.log(response.data)
                setComments((prevComments) => ({
                    ...prevComments,
                    [submission_id]: response.data
                }));
                setActiveSubmissionId(submission_id);
                setShowComments(true); 
            }catch(err:any){
                console.error("Failed to fetch comments:", err);
            }
        }
     
        const addComment = async(e:React.FormEvent,submission_id:number)=>{
            e.preventDefault();
            if(!comment){
                console.log("comment can't be empty");
                return;
            }
            console.log(selectedChannelId)
            const Comment ={
                submit_id:submission_id,
                comment:comment,
                channel_id:selectedChannelId,
            }
            try {
                const response = await api.post(addCommentRoute, Comment);
                console.log(response.data);
                setComment('');
                setActiveSubmissionId(null); 
                fetchComments(submission_id);
            } catch (error) {
                console.error("Failed to COMMENT:", error);
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
                        {
                            data.role==="reviewer" && (
                                <>
                                <button onClick={() => setActiveSubmissionId(submission.submission_id)}>
                                    Add Comment
                                </button>
                                {activeSubmissionId === submission.submission_id && (
                                    <form onSubmit={(e) => addComment(e, submission.submission_id)}>
                                        <input
                                            type="text"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Enter your comment"
                                        />
                                        <button type="submit">Submit</button>
                                    </form>
                                )}
                            </>
                            )
                        }
                        {showComments && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Comments</h2>
                        {activeSubmissionId && comments[activeSubmissionId]?.length > 0 ? (
                            comments[activeSubmissionId].map((comment, index) => (
                                <p key={index} className="mb-2">
                                    {comment.comment}
                                </p>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                        <button 
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => setShowComments(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


                       
                        
                    </div>
                ))} 
          </div>
        </>
    )
}
export default SubCom;