import DashBoardComponents from "@/components/dashBoardComponents";
import Navbar from "@/components/navbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { FileImage } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from 'date-fns';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createAssignment } from "@/features/thunks/assignmentThunk";
import { useNavigate } from "react-router-dom";
const CreateAssignment : React.FC = ()=>{
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [formError, setFormError] = useState<string>('');
    const [deadline, setDate] = React.useState<Date | undefined>(undefined)
    const [showCalender, setShowCalender] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error} = useSelector((state:RootState)=>state.assignments)
    const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)

    const toggleCalender = ()=>{
      setShowCalender(!showCalender);
    }
 
    const handleDate = (date: Date | undefined)=>{
          setDate(date);
          setShowCalender(false);
    }

    const handleSubmit = async(e:React.FormEvent)=>{
      e.preventDefault();
        if(!title){
            setFormError("Title can't be empty");
            return;
        }
        if(!deadline){
          setFormError("Please select deadline");
          return;
        }
        if(!selectedChannelId){
          setFormError("Some error occured")
        }
        setFormError("");
      
       const assignment = {
          title,
          description,
          deadline,
          channel_id : selectedChannelId,         
        }
        try{
          const query = {
            channelId: selectedChannelId || "",
          }   
          await dispatch(createAssignment(assignment)).unwrap();
          navigate('/dashboard');
        }catch(err: any){
            setFormError(err)
        }
    }

    return (
        <>
            <div className="relative w-screen h-screen">
                <Navbar />
                <div className="flex flex-row w-full h-full absolute top-20">
                    <div className="w-3/12 h-full">
                        <DashBoardComponents />
                    </div>
                    <div className="flex w-9/12 justify-center items-center">
                    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Assignment</CardTitle>
      
      </CardHeader>
      <form onSubmit={handleSubmit}>
      {formError && <p className="text-red-600">{formError}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <CardContent>
      
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-grow flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="flex flex-grow flex-col space-y-1.5">
              <Label htmlFor="Description">Description</Label>
              <Input id="description" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="flex flex-grow flex-col space-y-1.5">
              <Label htmlFor="Attachments">Attachments</Label>
              <Input id="attachments" placeholder="Attachments if any " />
            </div>
            <div className="flex flex-grow flex-col space-y-1.5">
              <Label htmlFor="Deadline">Deadline</Label>
              <Input id="deadline" placeholder="Select Deadline" readOnly onClick={toggleCalender} value={deadline ? format(deadline, 'yyyy-MM-dd') : " "} />
            </div>
            {
              showCalender && (
                <div>
                      <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={handleDate}
                      className="rounded-md border shadow"
    />
                  </div>
              )
            }          
          </div>
          </CardContent>
      <CardFooter className="flex justify-between">
      
        <Button type='submit' disabled={loading}>Create</Button>
      </CardFooter>
      </form>
    </Card>   
                    </div>
                </div>
            </div>
        </>
    );
}
export default CreateAssignment;