import React, { useEffect, useRef, useState } from 'react'
import api from "../../api"
import { addCommentRoute, getCommentRoute } from '@/routes/route';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import FileViewer from 'react-file-viewer';
import CustomErrorComponent from "custom-error";
import { fetchSubmissions } from '@/features/thunks/getSubmissionThunk';
//
interface DataProps {
    data: {
        group_id: number;
        assignment_id: number;
        role:string;
    };
}
// interface Comment{
//     comment:string,
//     reviewer_id:string,
//     submit_id:number,
// }
interface Cmt{
    comment:string,
    
}

// interface Submission{
//     submission_id:number,
//     submission_text:string,
//     submit_date:Date,
//     submission_file:string,
// }
const SubCom : React.FC<DataProps> = ({ data })=>{
    const dispatch: AppDispatch = useDispatch();
    const { submissions, loading, error } = useSelector((state: RootState) => state.submissions);
  //  const [submission, setSubmissions]=useState<Submission[]>([])
    const { selectedChannelId } = useSelector((state: RootState) => state.selectChannel)
    const [comments, setComments] = useState<Cmt[]>([]);
    const [comment, setComment] = useState('');
    const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);
    const [showComments, setShowComments] = useState(false);
    const socketRef = useRef<WebSocket | null >(null)
    useEffect(() => {
        dispatch(fetchSubmissions({ data }));
      }, [dispatch, data]);
 
      useEffect(()=>{
        if(!activeSubmissionId) return;
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/comments/${activeSubmissionId}/`);
        socketRef.current=socket;
        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };
        
        socket.onmessage=(event)=>{
            const cmt= JSON.parse(event.data)
            console.log(cmt)
            const newCmt = cmt.comment
                setComments((prevComments)=>[...prevComments,{comment:newCmt}]);
        }
        return () => {
            socket.close();
        };
      },[activeSubmissionId])

        const fetchComments=async(submission_id:number)=>{
            try{
                const response = await api.get(getCommentRoute+`?submit_id=${submission_id}`)
        
                setComments(
                    response.data
            );
       
                setActiveSubmissionId(submission_id);
                setShowComments(true); 
              
            }catch(err:any){
                console.error("Failed to fetch comments:", err);
            }
        }
        const [openedFile, setOpenedFile] = useState(null);

        const toggleFileViewer = (submissionId:any) => {
          setOpenedFile(openedFile === submissionId ? null : submissionId);
        };
        const addComment = async(e:React.FormEvent,submission_id:number)=>{
            e.preventDefault();
            if(!comment){
                console.log("comment can't be empty");
                return;
            }
           
            const Comment ={
                submit_id:submission_id,
                comment:comment,
                channel_id:selectedChannelId,
                assignment_id:data.assignment_id,
            }
            try {
                const response = await api.post(`${addCommentRoute}?channel_id=${selectedChannelId}`, Comment);
                console.log(response.data);
                setComment('');
                fetchComments(submission_id);
                setActiveSubmissionId(submission_id); 
               
                
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ comment: comment }));
                    console.log("Comment sent via WebSocket");
                } else {
                    console.error("WebSocket is not open, cannot send comment");
                }
            } catch (error) {
                console.error("Failed to COMMENT:", error);
            }
        }
        const onFileViewError = (error: any) => {
            console.error("Error in FileViewer:", error);
          };
        
    return (
        <>
            <div>       
            {submissions?.map((submission) => (
                    <div
                     key={submission.submission_id}
                      className="p-4 m-4 w-full border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                     >
                        <h2>Submission:</h2>
                        <p>{submission.submission_text}</p>
                        {submission.submission_file && (
            <>
              <button onClick={() => toggleFileViewer(submission.submission_id)}>
                {openedFile === submission.submission_id ? 'Hide File' : 'Show File'}
              </button>
              {openedFile === submission.submission_id && (
                <FileViewer
                  fileType={submission.submission_file.split('.').pop() || ''}
                  filePath={submission.submission_file}
                  errorComponent={CustomErrorComponent}
                  onError={onFileViewError}
                />
              )}
            </>
          )}
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
                        {activeSubmissionId && comments?.length > 0 ? (
                            comments.map((comment, index) => (
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