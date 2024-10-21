import React, { useState } from "react";
import leftImg from "../../Assets/Images/man.jpg";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
const AuthLayout = () => {
  const [PageShowFlag, setPageShowFlag] = useState(false);
  const [PageName, setPageName] = useState("");

  return (
    <>
      <div className="login-page">
        <div className="login-right">
          <div className="w-100">
            {PageShowFlag ? (
              <SignUpPage data={setPageShowFlag} />
            ) : (
              <LoginPage data={setPageShowFlag} page={setPageName} />
            )}
          </div>
        </div>
        <img src={leftImg} alt="leftImg" className="login-left" />
      </div>
    </>
  );
};

export default AuthLayout;
