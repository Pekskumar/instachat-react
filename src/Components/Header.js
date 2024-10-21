import React, { useState } from "react";
import Container from "react-bootstrap/Container";
// import Logo from "../Assets/Images/Logo";
import Logo from "../Assets/Images/logo.png";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import UpdateProfileModal from "../Modals/UpdateProfileModal";
import { userInfo, userToken } from "../ReduxTookit/UserInfoSlice";
import NotificationComponent from "./NotificationComponent";
// import ChangePasswordModal from "../Modals/ChangePasswordModal";
// import ChangePasswordIcon from "../Assets/Images/ChangePasswordIcon";

const Header = () => {
  let navigate = useNavigate();
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const [ProfileModalShow, setProfileModalShow] = useState(false);
  const [NotiF, setNotiF] = useState(false);
  function NptState(value) {
    setNotiF(true);
  }
  let dispatch = useDispatch();
  function fnLogout() {
    dispatch(userToken(null));
    dispatch(userInfo(null));
    localStorage.clear();
  }



  return (
    <header>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <Navbar.Brand as={NavLink} to="/home">
            {/* LOGO */}
            {/* <Logo /> */}
            <img src={Logo} style={{ height: "34px", width: "34px" }} />
          </Navbar.Brand>
          <div className="d-flex align-items-center ml-auto">
            <Nav className="main-menu">
              <Nav.Link as={NavLink} to="/home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
                  <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                </svg>
                <span>Home</span>
              </Nav.Link>
              <Nav.Link as={NavLink} to="/chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false">
                  <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                </svg>
                <span>Chat</span>
              </Nav.Link>
            </Nav>
            <NotificationComponent NptState={NptState} value={NotiF} />
            <div className="header-right">
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="d-flex align-items-center"
                >
                  <img
                    src={
                      UserData?.profilepic !== ""
                        ? UserData?.profilepic
                        : UserPlaceholder
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = UserPlaceholder;
                    }}
                    alt={UserData?.profilepic}
                    className="avator m-0"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {/* <Dropdown.Item onClick={() => setProfileModalShow(true)}>
                    Update Profile
                  </Dropdown.Item> */}
                  <Dropdown.Item
                    // onClick={() => navigate("/profile")}
                    onClick={() => navigate(`/profile/${UserData?._id}`)}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => fnLogout()}>
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </Container>
      {ProfileModalShow && (
        <UpdateProfileModal
          show={ProfileModalShow}
          onHide={() => setProfileModalShow(false)}
        />
      )}
    </header>
  );
};

export default Header;
