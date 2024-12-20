import DashBoardComponents from "@/components/dashBoardComponents";
import Navbar from "@/components/navbar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { RootState } from "@/redux/store";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../api"
import { useNavigate } from "react-router-dom";
  
const AllotedAssignments : React.FC = ()=>{
  const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const navigate = useNavigate();
    useEffect(()=>{
      const fetchAssignments = async()=>{
        try {
          if (selectedChannelId) {
            const response = await api.get(`/api/getAllotedAssignments/?channel_id=${selectedChannelId}`);
            setAssignments(response.data);
          }
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      }
      fetchAssignments();
    },[selectedChannelId])

    const notSubmitted = assignments.filter(assignments=>assignments.status==='1')
    const underIterations = assignments.filter(assignments=>assignments.status==='2')
    const completed = assignments.filter(assignments=>assignments.status==='3')
  

    const handleNavigate = async (group: any) => {
      const role="student"
    
      navigate('/dashboard/submissions/', { state: { group,role } });
    };

    return(
        <>
           <div className="relative w-screen h-screen">
                <Navbar />
                <div className="flex flex-row w-full h-full absolute top-20">
                    <div className="w-3/12 h-full">
                        <DashBoardComponents />
                    </div>
                    <div className="flex w-9/12 flex-col">
                    <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Not Submitted</AccordionTrigger>
    <AccordionContent>
     {
     notSubmitted.length>0 ? 
     (
      notSubmitted.map(group=>(
      <div key={group.id} 
       className="p-4 m-4 w-full border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
      onClick={()=>handleNavigate(group)}>
        <h3>{group.assignment_id.title}</h3>
      </div>
     )))
     :
     (
      <p>No not submitted Assignments</p>
     )
     }
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Under iterations</AccordionTrigger>
    <AccordionContent>
    {
     underIterations.length>0 ? 
     (
      underIterations.map(group=>(
      <div key={group.id} 
      className="p-4 m-4 w-full border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
      onClick={()=>handleNavigate(group)} >
        <h3>{group.assignment_id.title}</h3>
      </div>
     )))
     :
     (
      <p>No Assignment under iteration</p>
     )
     }
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Completed</AccordionTrigger>
    <AccordionContent>
    {
     completed.length>0 ? 
     (
      completed.map(group=>(
      <div key={group.id}
       className="p-4 m-4 w-full border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
      onClick={()=>handleNavigate(group)}>
        <h3>{group.assignment_id.title}</h3>
      </div>
     )))
     :
     (
      <p>No completed Assignments</p>
     )
     }
    </AccordionContent>
  </AccordionItem>
</Accordion>

                    </div>
                </div>
            </div> 
        </>
    )
}
export default AllotedAssignments;