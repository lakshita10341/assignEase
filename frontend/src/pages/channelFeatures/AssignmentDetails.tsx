import DashBoardComponents from "@/components/dashBoardComponents"
import Navbar from "@/components/navbar"
import { fetchAssignments } from "@/features/thunks/fetchAssignmentThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {UserPlus} from 'lucide-react';
import { fetchMembers } from "@/features/thunks/participantsThunk";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"

interface details{
    id : string;
    name : string;
    email : string;
    avatar : string | null;
    bio : string | null;
}
interface students{
    student : details;
    is_student : boolean;
    is_moderator : boolean;
    is_reviewer : boolean;
    is_admin : boolean;
}
interface student{
  id:string,

}
interface Group{
  student_id : student[]
}


interface AssignmentStudents{
  assignment_id : number,
  Group : Group[]
}
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
import { addStudentRoute } from "@/routes/route";
import api from "../../../api";

const FormSchema = z.object({
    students: z.array(z.string()).refine((value) => value.length > 0, {
      message: "You have to select at least one student.",
    }),
  })

const AssignmentDetails: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { assignments, loading, error } = useSelector((state: RootState) => state.assignments);
    const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)
    const {member, memberloading, membererror} = useSelector((state:RootState)=>state.member)
    const dispatch: AppDispatch = useDispatch();
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
 

   

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          students: [], // Default value is an empty array
        },
      })
    

    const numericAssignmentId = Number(assignmentId);
    const assignment = assignments.find((a) => a.assignment_id === numericAssignmentId);
    const students = member.filter(m=>m.is_student)
  
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
    const fetchStudents = async()=>{

        const students = member.filter(m=>m.is_student)
     
        console.log(students)
    }
    const onSubmit = async(data: z.infer<typeof FormSchema>)=>{
          try{
            const studentsData = {
              assignment_id : numericAssignmentId,
              Group : data.students.map(
                (studentId)=>({
                student_id:[studentId]
              })
            ),
            };
            console.log(studentsData)
            const response = await api.post(addStudentRoute, studentsData)
            console.log(response.data)
          }catch(err){
            console.log(err)
          }
    };
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
                        <div className="flex p-2 justify-start">
                        <Dialog>
      <DialogTrigger asChild>
        <UserPlus onClick={fetchStudents}/>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AssignmentDetails;
