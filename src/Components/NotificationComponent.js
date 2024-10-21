import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import AlertIcon from "../Assets/Images/AlertIcon";
import { apiCall } from "../Common Service/AxiosService";
import { API_URL } from "../Common Service/APIRoute";
import { apiResponse } from "../Common Service/APIResponse";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { noticeCount } from "../ReduxTookit/UserInfoSlice";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:8001"); // Replace with your backend URL
const socket = io.connect("https://instachat-server-33lx.onrender.com"); // Replace with your backend URL

const NotificationComponent = (props) => {
  const NotificationCount = useSelector((state) => state.userinfo.NoticeCount);
  const [NotificationList, setNotificationList] = useState([]);
  const dispatch = useDispatch();

  // Fetch notifications from the server
  const fngetNotification = async () => {
    try {
      const resData = await apiCall(
        {
          method: "GET",
          url: API_URL.BASEURL + API_URL.GETNOTIFICATIONS,
        },
        false
      );
      const response = apiResponse(false, resData);
      if (response?.isValidate) {
        setNotificationList(response?.data?.data);
        // Update unread count
        const unreadCount = response?.data?.data.filter((n) => !n.read).length;
        dispatch(noticeCount(unreadCount));
      } else {
        console.log("Error getting notifications", response);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Function to handle incoming socket notifications
  useEffect(() => {
    const handleMessageReceive = (message) => {
      console.log("Notification from socket:", message);

      // Check if message is an array or a single notification
      if (Array.isArray(message)) {
        setNotificationList((prevList) => {
          const uniqueMessages = message.filter(
            (msg) => !prevList.some((prev) => prev._id === msg._id)
          );
          const updatedList = [...uniqueMessages, ...prevList];
          const unreadCount = updatedList.filter((n) => !n.read).length;
          dispatch(noticeCount(unreadCount));
          return updatedList;
        });
      } else if (message?._id) {
        setNotificationList((prevList) => {
          const updatedList = [message, ...prevList.filter((n) => n._id !== message._id)];
          const unreadCount = updatedList.filter((n) => !n.read).length;
          dispatch(noticeCount(unreadCount));
          return updatedList;
        });
      } else {
        console.error("Received notification with missing _id:", message);
      }
    };

    // Register socket listener for notifications
    socket.on("notification", handleMessageReceive);

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      socket.off("notification", handleMessageReceive);
    };
  }, [dispatch]);

  // Mark a notification as read
  const fnReadNotification = async (id) => {
    try {
      const resData = await apiCall(
        {
          method: "PUT",
          url: `${API_URL.BASEURL}${API_URL.GETNOTIFICATIONS}/${id}/read`,
        },
        false
      );
      const response = apiResponse(false, resData);
      if (response?.isValidate) {
        // Refresh the notifications list after marking as read
        fngetNotification();
      } else {
        console.log("Error reading notifications", response);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Auto-mark notifications as read when `props.value` changes
  useEffect(() => {
    if (props.value) {
      setTimeout(() => {
        NotificationList.forEach((element) => {
          if (element?._id && !element?.read) {
            fnReadNotification(element._id);
          } else if (!element?._id) {
            console.error("Notification missing _id:", element);
          }
        });
      }, 2000);
    }
  }, [props.value, NotificationList]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fngetNotification();
  }, [props.value]);

  return (
    <div className="notice-main position-relative d-flex align-items-center">
      <DropdownButton
        id="dropdown-basic-button"
        onClick={() => props.NptState(true)}
        title={
          <>
            <AlertIcon />
            {NotificationCount > 0 && (
              <p className="m-0 count-notice">{NotificationCount}</p>
            )}
          </>
        }
      >
        <div className="notice-main-body">
          {NotificationList.length > 0 ? (
            NotificationList.reverse()
              .sort()
              .map((notification, index) => (
                <Dropdown.Item
                  key={index}
                  className={`position-relative ${
                    !notification?.read ? "active" : ""
                  }`}
                >
                  {!notification?.read && <div className="notice-dot"></div>}
                  <div className="tweet-header mb-2 align-items-center">
                    <img
                      src={
                        notification?.fromUser?.profilepic !== ""
                          ? notification?.fromUser?.profilepic
                          : UserPlaceholder
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = UserPlaceholder;
                      }}
                      alt={notification?.fromUser?.profilepic}
                      className="avator"
                    />
                    <div className="tweet-header-info m-0">
                      <p className="m-0">{notification.message}</p>
                      <p className="m-0">
                        {moment(notification.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </Dropdown.Item>
              ))
          ) : (
            <Dropdown.Item href="#/no-notifications">
              No notifications
            </Dropdown.Item>
          )}
        </div>
      </DropdownButton>
    </div>
  );
};

export default NotificationComponent;
