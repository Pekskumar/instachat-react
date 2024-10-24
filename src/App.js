import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AuthLayout from "./Pages/Authpages/AuthLayout";
import { useSelector } from "react-redux";
// import { ToastContainer } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import Layout from "./Pages/Allpages/Layout";
import { Suspense } from "react";
import Home from "./Pages/Allpages/Home";
import ResetPassword from "./Pages/Authpages/ResetPassword";
import ForgotPassword from "./Pages/Authpages/ForgotPassword";
import Chat from "./Pages/Allpages/Chat";
import Profile from "./Pages/Allpages/Profile";
// import Dashboard from "./Pages/AllPages/Home";
// import Layout from "./Pages/AllPages/Layout";
// import { Suspense } from "react";
// import Transations from "./Pages/AllPages/Transations";
// import Home from "./Pages/AllPages/Home";
// import Users from "./Pages/AllPages/Users";
// import Todos from "./Pages/AllPages/Todos";

function App() {
  const Token = useSelector((state) => state.userinfo.Token);
  const is_logged = Token !== null ? true : false;
 
  const AllRoutes = () => (
    <Routes>
       <Route path="*" element={<Navigate to="/" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <Suspense fallback={"Loader..."}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <Suspense fallback={"Loader..."}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/chat"
          element={
            <Suspense fallback={"Loader..."}>
              <Chat />
            </Suspense>
          }
        />
      </Route>
     
    </Routes>
  );

  const AuthRoutes = () => (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/" element={<AuthLayout />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
    </Routes>
  );

  return (
    <>
      {/* <ToastContainer /> */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router basename={process.env.PUBLIC_URL}>{is_logged ? <AllRoutes /> : <AuthRoutes />}</Router>
    </>
  );
}

export default App;
