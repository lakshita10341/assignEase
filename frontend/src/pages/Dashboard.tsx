import Navbar from "@/components/navbar";
import React from "react";

import DashBoardComponents from "@/components/dashBoardComponents";

const Dashboard : React.FC = ()=>{
    return (
    <>
        <div className="w-screen h-screen relative">
            <Navbar />
            <div className="absolute top-20">
                <DashBoardComponents />
            </div>
           
        </div>
    </>
    );
}
export default Dashboard;
