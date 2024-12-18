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

import { toast, ToastContainer } from "react-toastify";

interface AddMemberState {
    userId: string;
    isAdmin: boolean;
    isModerator: boolean;
    isReviewer: boolean;
    isStudent: boolean;
   
}
// interface MemberData{
//     id : string,
//     username : string,
//     avatar : string,
//     bio : string,
// }
// interface Member{
//     memberid : string,
//     memberName : MemberData,  
//     is_moderator : boolean,
//     is_admin : boolean,
//     is_student : boolean,
//     is_reviewer : boolean,
// }

const ManageParticipants: React.FC = () => {
    const { selectedChannelId } = useSelector((state: RootState) => state.selectChannel)
    const dispatch: AppDispatch = useDispatch();
    const { users, loading, error } = useSelector((state: RootState) => state.users)
    const {member, memberloading, membererror} = useSelector((state:RootState)=>state.member)
    const [dialogOpen, setDialogOpen] = useState(false);
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

        dispatch(addMembers(data))
        .unwrap()
        .then(() => {
            dispatch(fetchMembers({ channel_id: selectedChannelId })).unwrap();
            console.log("Members added successfully");
            toast.success("Members added successfully!");
        })
        .catch((err) => {
            console.error("Failed to add members:", err);
        });
        setDialogOpen(false);
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
                    {memberloading ? (
                            <p>Loading members...</p>
                        ) : membererror ? (
                            <p>Error loading members: {membererror}</p>
                        ) : (
                            member.map((member) => {
                                const memberName = member?.memberName;
                                return (
                                    <div
                                        key={memberName?.id || Math.random()} // Use a fallback if id is missing
                                        className="w-full py-2 px-2 shadow m-2 rounded-md"
                                    >
                                        {memberName && (
                                            <div className="flex flex-col">
                                                <div className="font-bold">{memberName.username}</div>
                                                <div className="font-medium">
                                                    Joined as{" "}
                                                    {[
                                                        member.is_moderator && "moderator",
                                                        member.is_reviewer && "reviewer",
                                                        member.is_student && "student",
                                                        member.is_admin && "admin",
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        </div>
                </div>
                <div className="absolute bottom-1 right-1">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </>
    );
};

export default ManageParticipants;

