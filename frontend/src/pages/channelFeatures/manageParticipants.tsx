import DashBoardComponents from "@/components/dashBoardComponents"
import Navbar from "@/components/navbar"
import React, { useEffect, useState } from "react"
import { UserPlus } from "lucide-react"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { addMembers, fetchMembers } from "@/features/thunks/participantsThunk"
import { getUsers } from "@/features/thunks/getUserThunk"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Root } from "react-dom/client"

interface AddMemberState {
    userId: string;
    isAdmin: boolean;
    isModerator: boolean;
    isReviewer: boolean;
    isStudent: boolean;
}

const ManageParticipants: React.FC = () => {
    const { selectedChannelId } = useSelector((state: RootState) => state.selectChannel)
    const dispatch: AppDispatch = useDispatch();
    const { users, loading, error } = useSelector((state: RootState) => state.users)
    const {member, memberloading, membererror} = useSelector((state:RootState)=>state.member)
  
    const [membersData, setMembersData] = useState<AddMemberState[]>([]);

    useEffect(() => {
        dispatch(fetchMembers({ channel_id: selectedChannelId })).unwrap();
        dispatch(getUsers()).unwrap();
    }, [dispatch, selectedChannelId]);

    const handleRoleChange = (userId: string, role: string, checked: boolean) => {
        setMembersData((prevMembersData) => {
            const existingUser = prevMembersData.find((member) => member.userId === userId);
            if (existingUser) {
                return prevMembersData.map((member) =>
                    member.userId === userId ? { ...member, [role]: checked } : member
                );
            } else {
                return [...prevMembersData, { userId, isAdmin: false, isModerator: false, isReviewer: false, isStudent: false, [role]: checked }];
            }
        });
    };

    const handleSubmit = () => {
        const data = {
            membersData: membersData.map(({ userId, isModerator, isReviewer , isStudent}) => ({
                memberName: userId,
                is_moderator: isModerator,
                is_reviewer: isReviewer,
                is_student: isStudent,
            })),
            channel_id: selectedChannelId,
        };
        console.log(data); // Here, you will send this data using the appropriate API call
        dispatch(addMembers(data)).unwrap();
    };

    return (
        <>
            <div className="relative w-screen h-screen">
                <Navbar />
                <div className="flex flex-row w-full h-full absolute top-20">
                    <div className="w-3/12 h-full">
                        <DashBoardComponents />
                    
                    </div>
                    <div className="flex flex-col w-9/12 ">
                        {
                            member.map((member:any)=>(
                               
                                <div key='member.memberName.id' className="w-full py-2 px-2 shadow m-2 rounded-md">
                                   
                                   <img src={member.memberName.avatar}/>
                                   <div className="flex flex-col">
                                        <div className="font-bold ">{member.memberName.username}</div>
                                        <div className="font-medium">
  Joined as {[
    member.is_moderator && "moderator",
    member.is_reviewer && "reviewer",
    member.is_student && "student",
    member.is_admin && "admin",
  ]
    .filter(Boolean) // This filters out any false/null values
    .join(", ")} {/* Joins the roles with commas */}
</div>
                                        {/* <div>Joined as {member.is_moderator? "moderator"}</div> */}
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                </div>
                <div className="absolute bottom-1 right-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><UserPlus /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Members</DialogTitle>
                            </DialogHeader>
                            <div>
                                {loading ? (
                                    <p>Loading users...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : (
                                    users.map((user: any) => (
                                        <div key={user.id}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline">{user.username}</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuLabel>Add as</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuCheckboxItem
                                                        checked={membersData.some(member => member.userId === user.id && member.isModerator)}
                                                        onCheckedChange={(checked) => handleRoleChange(user.id, "isModerator", checked)}
                                                    >
                                                        Moderator
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={membersData.some(member => member.userId === user.id && member.isReviewer)}
                                                        onCheckedChange={(checked) => handleRoleChange(user.id, "isReviewer", checked)}
                                                    >
                                                        Reviewer
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={membersData.some(member => member.userId === user.id && member.isStudent)}
                                                        onCheckedChange={(checked) => handleRoleChange(user.id, "isStudent", checked)}
                                                    >
                                                        Student
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ))
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSubmit}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
};

export default ManageParticipants;


// import DashBoardComponents from "@/components/dashBoardComponents"
// import Navbar from "@/components/navbar"
// import React, { useEffect, useState } from "react"
// import { UserPlus } from "lucide-react"
// import { AppDispatch, RootState } from "@/redux/store"
// import { useDispatch, useSelector } from "react-redux"
// import { addMembers, fetchMembers } from "@/features/thunks/participantsThunk"
// import { getUsers } from "@/features/thunks/getUserThunk"

 
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
 

// import {
//   Dialog,
//   DialogContent,

//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"



// interface RoleSelection {
  
//     isModerator: boolean;
//     isReviewer: boolean;
//     isStudent: boolean;
// }

// const ManageParticipants : React.FC =()=>{
 
//     const {selectedChannelId} = useSelector((state:RootState)=>state.selectChannel)
//     const dispatch: AppDispatch = useDispatch();
//     const {users, loading, error} = useSelector((state:RootState)=>state.users)
//     const [roleSelections, setRoleSelections] = useState<{[id: string]: RoleSelection}>({})

//     useEffect(()=>{
//         dispatch(fetchMembers({channelid : selectedChannelId})).unwrap();
//     },[])
//     const addParticipants = () => {
//         const participantsToAdd = Object.entries(roleSelections).map(([userId, roles]) => ({
//           id: userId,
//           is_moderator: roles.isModerator,
       
//           is_student: roles.isStudent,
//           is_reviewer: roles.isReviewer,
//         }))
        
//         // Dispatch the function to add members (modify this to fit your actual thunk/action)
//         participantsToAdd.forEach((participant) => {
//           dispatch(addMembers(participant)).unwrap()
//         })
//       }

//     const fetchAllUsers = ()=>{
//         dispatch(getUsers()).unwrap();
//     }

//     const handleRoleChange = (id : string, role : keyof RoleSelection, value : boolean)=>{
//         setRoleSelections((prevSelections) => ({
//             ...prevSelections,
//             [id]: {
//               ...prevSelections[id],
//               [role]: value,
//             },
//           }))  
//     }
    

//     return (
//         <>
//            <div className="relative w-screen h-screen">
//                 <Navbar />
//                 <div className="flex flex-row w-full h-full absolute top-20">
//                     <div className="w-3/12 h-full">
//                         <DashBoardComponents />
//                         <div className="flex flex-col w-9/12 justify-center items-center">

//                         </div>
//                     </div>
//                 </div>
//                 <div className="absolute bottom-1 right-1"><Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline"><UserPlus onClick={fetchAllUsers} /></Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Members</DialogTitle>
          
//         </DialogHeader>
      
//         <div>
//     {loading ? (
//         <p>Loading users...</p>
//     ) : error ? (
//         <p>{error}</p>
//     ) : (
//         users.map((user: any) => (
//             <div key={user.id}>
//                 <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">{user.username}</Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56">
//         <DropdownMenuLabel>Add as</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuCheckboxItem
//           checked={roleSelections[user.id]?.isModerator || false}
//           onCheckedChange={(checked) => handleRoleChange(user.id, "isModerator", checked)}
//         >
//           Moderator
//         </DropdownMenuCheckboxItem>
//         <DropdownMenuCheckboxItem
//                             checked={roleSelections[user.id]?.isReviewer || false}
//                             onCheckedChange={(checked) => handleRoleChange(user.id, "isReviewer", checked)}
//                           >
//           Reviewer
//         </DropdownMenuCheckboxItem>
//         <DropdownMenuCheckboxItem
//                             checked={roleSelections[user.id]?.isStudent || false}
//                             onCheckedChange={(checked) => handleRoleChange(user.id, "isStudent", checked)}
//                           >
//           Student
//         </DropdownMenuCheckboxItem>
//       </DropdownMenuContent>
//     </DropdownMenu>

//             </div>
//         ))
//     )}
// </div>
      
//        {/* give list of all users there and clicking on user will show list add as admin, moderator then submit and sent it as parameter */}
//         <DialogFooter>
//           <Button type="submit" onClick={addParticipants}>Add</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog></div>
//            </div>
//         </>
//     )
// }

// export default ManageParticipants;