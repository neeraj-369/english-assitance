import './css/App.css'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from './components/teacher/dashboard'
import StudentReports from './components/teacher/studentreports'
import ClassOverview from './components/teacher/classover_view';
import DetailedReport from './components/teacher/Detailedreport (2)';
import Login from './login/Login';
import { ThemeProvider } from '@mui/material'
import theme from './components/common/theme'
import Navbar from './components/common/Navbar'
import Evaluate from './components/teacher/evaluate';
import AssessmentView from './components/teacher/assessmentview';
import PlanLesson from './components/teacher/planLesson';
import TeachingView from './components/teacher/teachingview'
import PlanAssessment from './components/teacher/planAssessment'
import StudentDashboard from './components/student/dashboard';
import StudentNavbar from './components/common/StudentNavbar';
import Assess from './components/teacher/assess';
import AdminNavbar from './components/common/AdminNavbar';
import AdminDashboard from './components/admin/Dashboard';
import Logout from './components/common/Logout';
import AddSentence from './components/admin/sentence';
import RegisterStudent from './components/admin/Student';
import PlanLessonS from './components/student/planLesson';
import Train from './components/student/train';
import Test from './components/student/test';
import PracticeView from './components/student/practiceview'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

const StuLayout = () => {
  return (
    <div>
      <StudentNavbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}

const AdmLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}
function App() {


  return (

    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="teacher/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="studentreports/">
                <Route path="" element={<StudentReports />} />
                <Route path="detailedreport" element={<DetailedReport />} />
              </Route>
              <Route path="teachingview/">
                <Route path="" element={<TeachingView />} />
                <Route path="planLesson" element={<PlanLesson />} />
                <Route path="evaluate" element={<Evaluate />} />
              </Route>
              <Route path="classoverview" element={<ClassOverview />} />
              <Route path="assessmentview/">
                <Route path="" element={<AssessmentView />} />
                <Route path="planAssessment" element={<PlanAssessment />} />
                <Route path="assess" element={<Assess />} />
              </Route>
            </Route>
            <Route path="/student" element={<StuLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="practice/">
                <Route path="" element={<PracticeView />} />
                <Route path="planLesson" element={<PlanLessonS />} />
                <Route path="train" element={<Train />} />
              </Route>
              <Route path="test" element={<Test />} />
            </Route>
            <Route path="admin/" element={<AdmLayout />}>
              <Route path="register/teacher" element={<AdminDashboard />} />
              <Route path="register/student" element={<RegisterStudent />} />
              <Route path="register/sentence" element={<AddSentence />} />
            </Route>
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider >

  );
}

export default App;
