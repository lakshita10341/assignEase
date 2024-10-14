import DashBoardComponents from "@/components/dashBoardComponents";
import Navbar from "@/components/navbar";
import React from "react"
const Chat : React.FC =()=>{
    return (
    <>
        <div className="relative w-screen h-screen">
                <Navbar />
                <div className="flex flex-row w-full h-full absolute top-20">
                    <div className="w-3/12 h-full">
                        <DashBoardComponents />
                    </div>
                    <div className="flex w-9/12 justify-center items-center"></div>
        <p>Chat feature coming soon.....</p>
        </div>
        </div>
    </>
    )
}
export default Chat;