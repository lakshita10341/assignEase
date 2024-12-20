import DashBoardComponents from "@/components/dashBoardComponents"
import Navbar from "@/components/navbar"
import { fetchAssignments } from "@/features/thunks/fetchAssignmentThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {UserPlus, View} from 'lucide-react';
import { fetchMembers } from "@/features/thunks/participantsThunk";
import { Button } from "@/components/ui/button"
import FileViewer from 'react-file-viewer';
import CustomErrorComponent from "custom-error";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { addReviewersRoute, addStudentRoute, getAllotedStudents } from "@/routes/route";
import api from "../../../api";
import { toast, ToastContainer } from "react-toastify";

const FormSchema = z.object({
    students: z.array(z.string()).refine((value) => value.length > 0, {
      message: "You have to select at least one student.",
    }),
  })

const ReviewerFormSchema = z.object({
    reviewers: z.array(z.string()).refine((value) => value.length > 0, {
      message: "You have to select at least one reviewer.",
    }),
  })

interface Students{
  group_id:number;
  usernames:string;
  status:number;
  score:number;
  assignment_id:number;
}

const AssignmentDetails: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { assignments, loading, error } = useSelector((state: RootState) => state.assignments);
    const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)
    const {member, memberloading, membererror} = useSelector((state:RootState)=>state.member)
    const [allotedStudents, setAllotedStudents] = useState<Students[]>([]); 
    const dispatch: AppDispatch = useDispatch();
    const navigate=useNavigate();
    const [showStudentDialog, setStudentShowDialog] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const handleShowAttachment = () => {
        setShowAttachment((prevState) => !prevState);
    };
  
    useEffect(() => {
        if (assignments.length === 0) {
            dispatch(fetchAssignments(selectedChannelId)); 
          
        }
    }, [dispatch, assignments.length]);

    useEffect(()=>{
        if(member.length===0){
         dispatch(fetchMembers({ channel_id: selectedChannelId })).unwrap();

        }
    },[dispatch,member.length])
 
    const reviewerForm = useForm<z.infer<typeof ReviewerFormSchema>>({
      resolver: zodResolver(ReviewerFormSchema),
      defaultValues: {
        reviewers: [],
      },
    });
   

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          students: [], // Default value is an empty array
        },
      })
    

    const numericAssignmentId = Number(assignmentId);
    const assignment = assignments.find((a) => a.assignment_id === numericAssignmentId);
    const students = member.filter(m=>m.is_student)
    const reviewers = member.filter(m=>m.is_reviewer)
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
   
  

  const addReviewers=async(data: z.infer<typeof ReviewerFormSchema>)=>{
    setShowDialog(false); 
    const payload = {
        assignment_id:numericAssignmentId,
        reviewers_id:data.reviewers,
      }
    
      try{
        const response = await api.post(`${addReviewersRoute}?channel_id=${selectedChannelId}`,payload)
        
        toast.success("Reviewers added successfully!");
      }catch(err){
        
        console.error(err);
      }
     
  }

    const handleStudent = (student:Students)=>{
      const role="reviewer"
      const group={
        group_id:student.group_id,
        assignment_id:student.assignment_id,
        status:student.status,
      }
      navigate('/dashboard/submissions/', { state: { group,role } });
    };
    const onSubmit = async(data: z.infer<typeof FormSchema>)=>{
      setStudentShowDialog(false);
          try{
            const studentsData = {
              assignment_id : numericAssignmentId,
              Group : data.students.map(
                (studentId)=>({
                student_id:[studentId]
              })
            ),
            };
           
            const response = await api.post(addStudentRoute, studentsData)
            toast.success("Students added successfully!");
          }catch(err){
            console.log(err)
          }
         
    };
    const onFileViewError = (error: any) => {
      console.error("Error in FileViewer:", error);
    };
console.log(assignment)
    const fetchAllotedStudents = async()=>{
          const response = await api.get(getAllotedStudents+`?assignment_id=${assignmentId}`)
         
          setAllotedStudents(response.data);
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
                        
               {
                assignment.attachments && (
                  <div className="flex p-2 justify-start">
                  <button
                  className="bg-sky-950 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                  onClick={handleShowAttachment}
              >
                  {showAttachment ? "Hide Attachment" : "Show Attachment"}
              </button>
          </div>
                )
               }
            {showAttachment && assignment.attachments && (
                 <FileViewer
                 fileType={assignment.attachments.split('.').pop() || ''}
                 filePath={assignment.attachments}
                 errorComponent={CustomErrorComponent}
                 onError={onFileViewError}
               />
            )}
                        <div className="flex p-2 justify-start">
                        <Dialog open={showStudentDialog} onOpenChange={setStudentShowDialog} >
      <DialogTrigger asChild>
        <UserPlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="students"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Students</FormLabel>
                <FormDescription>
                  Choose the students you want to assign.
                </FormDescription>
              </div>
              {students.map((student) => (
                <FormField
                  key={student.memberid}
                  control={form.control}
                  name="students"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={student.memberid}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(student.memberid)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, student.memberid])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== student.memberid
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {student.memberName.username}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
    <Dialog>
      <DialogTrigger asChild>
        <View onClick={fetchAllotedStudents}/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
          {
            allotedStudents.map((student)=>(
              <div key='student.group_id' onClick={()=>handleStudent(student)} >
                {student.usernames}
              </div>
            ))
          }
      </DialogContent>
    </Dialog>
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <UserPlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
      <Form {...reviewerForm}>
      <form onSubmit={reviewerForm.handleSubmit(addReviewers)} className="space-y-8">
        <FormField
          control={reviewerForm.control}
          name="reviewers"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Add reviewers</FormLabel>
                <FormDescription>
                  Choose reviewers
                </FormDescription>
              </div>
              {reviewers.map((reviewer) => (
                <FormField
                  key={reviewer.memberid}
                  control={reviewerForm.control}
                  name="reviewers"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={reviewer.memberid}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(reviewer.memberid)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, reviewer.memberid])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== reviewer.memberid
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {reviewer.memberName.username}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
    
                        </div>
                    </div>
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
          
        </>
    );
};
export default AssignmentDetails;
