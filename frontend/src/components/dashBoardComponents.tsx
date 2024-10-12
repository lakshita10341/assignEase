
import React from "react";
import {BookOpenCheck} from 'lucide-react'
import {UserCog, FilePlus2, ClipboardCheck, MessageCircle, Users} from 'lucide-react'
import { useNavigate } from "react-router-dom";

const DashBoardComponents : React.FC = ()=>{
    const navigate = useNavigate();
    const createAssignments = ()=>{
        navigate('createAssignments/')
    }
    return (
    <>
<div className="flex flex-wrap justify-center px-24 gap-8  ">

<div className="flex flex-col w-96 h-72 justify-center items-center rounded-lg shadow-md">
    <BookOpenCheck className='w-12 h-12 mb-4 text-sky-950' />
    <button className="bg-sky-950 text-white px-4 py-2 rounded">Alloted assignments</button>
</div>
<div className="flex flex-col w-96 h-72 justify-center items-center rounded-lg shadow-md">
    <UserCog className='w-12 h-12 mb-4 text-sky-950' />
    <button className="bg-sky-950 text-white px-4 py-2 rounded">Manage participants</button>
</div>
<div className="flex flex-col w-96 h-72 justify-center items-center rounded-lg shadow-md">
    <FilePlus2 className='w-12 h-12 mb-4 text-sky-950' />
    <button className="bg-sky-950 text-white px-4 py-2 rounded" onClick={createAssignments}>Create Assignments</button>
</div>
<div className="flex flex-col w-96 h-72 justify-center items-center rounded-lg shadow-md">
    <ClipboardCheck className='w-12 h-12 mb-4 text-sky-950' />
    <button className="bg-sky-950 text-white px-4 py-2 rounded">Created assignments</button>
</div>
<div className="flex flex-col w-96 h-72 justify-center items-center rounded-lg shadow-md">
    <MessageCircle className='w-12 h-12 mb-4 text-sky-950' />
    <button className="bg-sky-950 text-white px-4 py-2 rounded">Chats</button>
</div>
<div className="flex flex-col w-96 h-72 justify-center items-center rounded-lg shadow-md">
    <Users className='w-12 h-12 mb-4 text-sky-950' />
    <button className="bg-sky-950 text-white px-4 py-2 rounded">View participants</button>
</div>

</div>
    </>
    );
}

export default DashBoardComponents;
