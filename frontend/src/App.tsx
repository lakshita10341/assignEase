
import './App.css'
import {BrowserRouter ,Route, Routes} from 'react-router-dom'
import Register from './pages/register'
import Home from './pages/home'
import ProtectedRoute from './components/protectedRoute'
import Login from './pages/login'
import OAuthCallBack from './pages/oAuthCallBack'
import Dashboard from './pages/Dashboard'
import CreateAssignment from './pages/channelFeatures/createAssignments'
import ManageParticipants from './pages/channelFeatures/manageParticipants'
import Chat from './pages/channelFeatures/chat'
import ViewParticipants from './pages/channelFeatures/viewParticipants'
import CreatedAssignments from './pages/channelFeatures/createdAssignments'
import AssignmentDetails from './pages/channelFeatures/AssignmentDetails'
function App() {
 

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='register/' element={<Register/>}> 
        </Route>
        <Route path='login/' element={<Login />}></Route>
        <Route path='/' element = {<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path='oauth/callback/' element = {<ProtectedRoute><OAuthCallBack /></ProtectedRoute>}></Route>
        <Route path='dashboard/' element = {<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
        <Route path='dashboard/createAssignments/' element = {<ProtectedRoute><CreateAssignment /></ProtectedRoute>}></Route>
        <Route path='dashboard/manageParticipants/' element = {<ProtectedRoute><ManageParticipants /></ProtectedRoute>}></Route>
        <Route path='dashboard/chats/' element = {<ProtectedRoute><Chat /></ProtectedRoute>}></Route>
        <Route path='dashboard/viewParticipants/' element = {<ProtectedRoute><ViewParticipants /></ProtectedRoute>}></Route>
        <Route path='dashboard/createdAssignments/' element = {<ProtectedRoute><CreatedAssignments /></ProtectedRoute>}></Route>
        <Route path='assignment/:assignmentId' element = {<ProtectedRoute><AssignmentDetails /></ProtectedRoute>}></Route>
      </Routes>
     </BrowserRouter> 
    </>
  )
}

export default App



// import React from 'react'

// function App() {
//   return (
//     <div>App</div>
//   )
// }

// export default App
