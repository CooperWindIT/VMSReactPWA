import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VisitingList from './Components/Visitings/List';
import SignIn from './Components/Auth/Signin';
import ContactorsList from './Components/Contarctors/List';
import UsersList from './Components/Users/List';
import RoleMenu from './Components/RoleMenu/RoleMenu';
import ReportData from './Components/Reports/ReportData';
import Dashboard from './Components/Dashboard/Dashboard';
import Sample from './Components/Dashboard/sample';
import CheckinValidation from './Components/CheckinValidation/CheckinValidation';
import FaceScanner from './Components/Dashboard/face';
// import AadhaarScanner from './Components/Dashboard/adar1';
import Screen from './Components/Visitings/Screen';
import IdleTimerProvider from './Components/Config/IdleTimerProvider ';

function App() {
  return (
    // <Router>
    //   <IdleTimerProvider>
    //     <Routes>
    //       <Route path="visitors" element={<VisitingList />} />
    //       <Route path="dashboard" element={<Dashboard />} />
    //       <Route path="contractors" element={<ContactorsList />} />
    //       <Route path="users" element={<UsersList />} />
    //       <Route path="/" element={<SignIn />} />
    //       <Route path="/sample" element={<Sample />} />
    //       <Route path="role-menu" element={<RoleMenu />} />
    //       <Route path="report" element={<ReportData />} />
    //       <Route path="checkin-validation" element={<CheckinValidation />} />
    //       <Route path="/visit/:RequestId/:OrgId/:userid" element={<Screen />} />
    //     </Routes>
    //   </IdleTimerProvider>
    // </Router>
    <Router>
  <Routes>
    {/* Public Route (no login required) */}
    <Route path="/visit/:RequestId/:OrgId/:userid" element={<Screen />} />

    {/* Protected Routes with IdleTimerProvider */}
    <Route
      path="*"
      element={
        <IdleTimerProvider>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="visitors" element={<VisitingList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contractors" element={<ContactorsList />} />
            <Route path="users" element={<UsersList />} />
            <Route path="/sample" element={<Sample />} />
            <Route path="role-menu" element={<RoleMenu />} />
            <Route path="report" element={<ReportData />} />
            <Route path="checkin-validation" element={<CheckinValidation />} />
          </Routes>
        </IdleTimerProvider>
      }
    />
  </Routes>
</Router>

  );
}

export default App;
