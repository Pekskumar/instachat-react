import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import io from "socket.io-client"; // Import socket.io-client
import UserPlaceholder from "../../Assets/Images/userimages.jpg";
import GroupPlaceholder from "../../Assets/Images/Groupplaceholder.jpg";
import { apiCall } from "../../Common Service/AxiosService";
import Picker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { API_URL } from "../../Common Service/APIRoute";
import { apiResponse } from "../../Common Service/APIResponse";
import { commonservices } from "../../Common Service/CommonServices";
import { useNavigate } from "react-router-dom";
import Nodata from "../../Components/Nodata";
import SendIcon from "../../Assets/Images/SendIcon";
import GroupModal from "../../Modals/GroupModal";
import SettingIcon from "../../Assets/Images/SettingIcon";
import DeleteIcon from "../../Assets/Images/DeleteIcon";

// Initialize socket connection
// const socket = io.connect("http://localhost:8001"); // Replace with your backend URL
const socket = io.connect("https://instachat-server-33lx.onrender.com"); // Replace with your backend URL

const Chat = () => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  let navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [GroupModalShow, setGroupModalShow] = useState(false);
  const [GroupModalType, setGroupModalType] = useState();
  const [Loading, setLoading] = useState(false);
  const [MHLoading, setMHLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [FriendSearch, setFriendSearch] = useState();
  const [FriendData, setFriendData] = useState([]);
  const [SelectedUser, setSelectedUser] = useState();
  const [MessageHistory, setMessageHistory] = useState([]);
  const [OnlineUsers, setOnlineUsers] = useState([]); // New state for online users

  const defaultInputState = {
    content: "",
    errors: {
      content: "",
      ValidationRules: [
        {
          FieldName: "content",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
      ],
    },
  };
  const [input, setInput] = useState(defaultInputState);

  const handleTyping = () => {
    socket.emit("typing", {
      senderId: UserData?._id,
      receiverId: SelectedUser?._id,
    });
  };

  useEffect(() => {
    socket.on("userTyping", (data) => {
      if (
        data.senderId !== UserData?._id &&
        data.receiverId === UserData?._id
      ) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000); // Hide the typing indicator after 2 seconds
      }
    });

    return () => {
      socket.off("userTyping");
    };
  }, [UserData, SelectedUser]);

  useEffect(() => {
    socket.on("userOnline", (userId) => {
      setOnlineUsers((prev) => [...prev, userId]);
    });

    socket.on("userOffline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);

  useEffect(() => {
    // Emit userOnline event when the component mounts
    if (UserData?._id) {
      socket.emit("userOnline", UserData._id);
    }
    return () => {
      // Emit userOffline event on component unmount
      if (UserData?._id) {
        socket.emit("userOffline", UserData._id);
      }
    };
  }, [UserData?._id]);
  // Listen for incoming messages
  useEffect(() => {
    const handleMessageReceive = (message) => {
      // Check for personal and group messages separately
      if (message.messageType === "group") {
        if (message.chatRoomId === SelectedUser?._id) {
          // For group messages, check chatRoomId
          setMessageHistory((prevMessages) => [...prevMessages, message]);
        }
      } else if (message.messageType === "personal") {
        // For personal messages, check senderId and receiverId
        if (
          (message.receiverId === SelectedUser?._id &&
            message.senderId === UserData?._id) ||
          (message.receiverId === UserData?._id &&
            message.senderId === SelectedUser?._id)
        ) {
          setMessageHistory((prevMessages) => [...prevMessages, message]);
        }
      } else {
        console.log("Message does not match current conversation:", message);
      }
    };

    socket.on("receiveMessage", handleMessageReceive);
    return () => {
      socket.off("receiveMessage", handleMessageReceive);
    };
  }, [SelectedUser, UserData]);

  const onEmojiClick = (emojiObject, event) => {
    setInput((prevInput) => ({
      ...prevInput,
      content: prevInput.content + emojiObject.emoji,
    }));
    setShowPicker(false);
  };
  // Fetch friend list
  async function getFriendList(Search) {
    let resData = await apiCall(
      {
        method: "GET",
        url: API_URL.BASEURL + API_URL.MYFRIENDS,
      },
      false
    );
    let response = apiResponse(false, resData);
    if (response?.isValidate) {
      if (Search) {
        let temp = response?.data?.data?.filter(
          (f) =>
            (f.displayname &&
              f.displayname
                .toLowerCase()
                .includes(Search.trim().toLowerCase())) ||
            (f.name &&
              f.name.toLowerCase().includes(Search.trim().toLowerCase()))
        );
        setFriendData(temp);
        setSelectedUser(temp[0]);
      } else {
        setFriendData(response?.data?.data);
        setSelectedUser(response?.data?.data[0]);
      }
    } else {
      console.log("Error getting friend list", response);
    }
  }
  async function getMessageHistory(data) {
    setMHLoading(true);
    let body = {
      userId: UserData?._id,
    };
    let resData = await apiCall(
      {
        method: "GET",
        url: API_URL.BASEURL + API_URL.MESSAGEHISTORY + data?._id,
        body: body,
      },
      true
    );
    let response = apiResponse(false, resData, setMHLoading);
    if (response?.isValidate) {
      setMHLoading(false);
      if (data?.type === "friend") {
        setMessageHistory(response?.data?.data?.personalMessages);
      } else {
        setMessageHistory(response?.data?.data?.groupMessages);
      }
    } else {
      console.log("Error getting message history", response);
    }
  }

  useEffect(() => {
    getFriendList(FriendSearch);
  }, [FriendSearch]);

  useEffect(() => {
    if (SelectedUser) {
      getMessageHistory(SelectedUser);
    }
  }, [SelectedUser]);

  // Scroll to the latest message
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [MessageHistory]);

  // Handle message send
  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    setIsTyping(false);
    if (obj.isValid) {
      console.log("SelectedUser ::", SelectedUser);
      let body;
      if (SelectedUser?.type === "group") {
        body = {
          senderId: UserData?._id,
          chatRoomId: SelectedUser?._id, // Change to chatRoomId
          content: input.content.trim(),
          messageType: "group", // Ensure the message type is set correctly
        };
      } else {
        // Use receiverId for personal messages
        body = {
          senderId: UserData?._id,
          receiverId: SelectedUser?._id,
          content: input.content.trim(),
          messageType: "personal", // Optional, specify the message type for consistency
        };
      }
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.MESSAGESEND,
          body: body,
        },
        true
      );
      let response = apiResponse(true, resData);
      if (response?.isValidate) {
        setInput(defaultInputState);
      } else {
        console.log("Error sending message", response);
      }
      socket.emit("sendMessage", body);
      setInput(defaultInputState);
    }
  }

  function fnGrpFrnPic(data) {
    if (data) {
      let temp = FriendData?.find((f) => f._id === data?.senderId);
      if (temp) {
        return temp?.profilepic;
      } else {
        return UserPlaceholder;
      }
    }
  }
  function fnOpenGroupModal(type) {
    setGroupModalShow(true);
    setGroupModalType(type);
  }
  async function fnDeleteGroup(item) {
    let body;
    let resData;
    if (UserData?._id !== item?.creator?._id) {
      body = {
        userId: UserData?._id,
      };
      resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.GROUP + `/${item?._id}/exit`,
          body: body,
        },
        true
      );
      // let response = apiResponse(true, resData, setLoading);
      // if (response?.isValidate) {
      //   getFriendList();
      // } else {
      //   console.log("Error sending message", response);
      // }
    } else {
      body = {
        userId: item?.creator?._id,
      };
      resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.GROUPDELETE + `/${item?._id}`,
          body: body,
        },
        true
      );
    }
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      getFriendList();
    } else {
      console.log("Error sending message", response);
    }
  }

  return (
    <>
      {SelectedUser ? (
        <Row className="chat-page">
          <Col md={4} className="border-right chat-page-left">
            <div className="d-flex chat-top align-items-center justify-content-between">
              <h4 className="m-0">Messaging</h4>
              <Button
                className="m-0"
                onClick={(e) => fnOpenGroupModal("create")}
              >
                + New Group
              </Button>
            </div>
            <div className="py-2">
              <Form.Group controlId="friendSearch">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={FriendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="my-friend-list">
              {Loading
                ? "Loading..."
                : FriendData?.length > 0
                  ? FriendData?.map((item, index) => (
                    <React.Fragment key={index}>
                      {item?.type === "friend" ? (
                        <div

                          className={`tweet-header align-items-center ${SelectedUser?._id === item?._id ? "active" : ""
                            }`}
                          onClick={() => setSelectedUser(item)}
                        >
                          <div className="position-relative">
                            <img
                              src={
                                item?.profilepic !== ""
                                  ? item?.profilepic
                                  : UserPlaceholder
                              }
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = UserPlaceholder;
                              }}
                              alt={item?.profilepic}
                              className="avator m-0"
                            />

                            {/* Green Dot for Online Users */}
                            {OnlineUsers.includes(item._id) && (
                              <span className="online-indicator"></span>
                            )}
                          </div>
                          <div className="tweet-header-info m-0 ms-2">
                            <p className="m-0">
                              <b>
                                {item?.displayname} {item?.lastname}
                              </b>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className={`tweet-header align-items-center ${SelectedUser?._id === item?._id ? "active" : ""
                            }`}
                          onClick={() => setSelectedUser(item)}
                        >
                          <div className="position-relative">
                            <img
                              src={
                                item?.groupPic !== ""
                                  ? item?.groupPic
                                  : GroupPlaceholder
                              }
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = GroupPlaceholder;
                              }}
                              alt={item?.groupPic}
                              className="avator m-0"
                            />

                            {/* {UserData?._id === item?.creator?._id && ( */}
                            <span
                              className="reset-img"
                              onClick={() => fnDeleteGroup(item)}
                            >
                              <DeleteIcon size="14px" />
                            </span>
                            {/* )} */}
                          </div>
                          <div className="tweet-header-info m-0 ms-2">
                            <p className="m-0">
                              <b>{item?.name}</b>
                            </p>
                            <p className="m-0">
                              {item?.description !== '' && item?.description?.substring(0, 20) + "..."}
                            </p>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                  : "No data"}
            </div>
          </Col>
          <Col md={8} className="tweet-header-chat chat-page-right">
            {SelectedUser?.type === "friend" ? (
              <div className="d-flex chat-top p-2 align-items-center justify-content-between">
                <div
                  onClick={() => navigate(`/profile/${SelectedUser?._id}`)}
                  className="tweet-header align-items-center"
                >
                  <div className="position-relative">
                    <img
                      src={
                        SelectedUser?.profilepic !== ""
                          ? SelectedUser?.profilepic
                          : UserPlaceholder
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = UserPlaceholder;
                      }}
                      alt={SelectedUser?.profilepic}
                      className="avator m-0"
                    />
                    {OnlineUsers.includes(SelectedUser._id) && (
                      <span className="online-indicator"></span>
                    )}
                  </div>
                  <div className="tweet-header-info ms-2">
                    <p className="m-0 ">
                      <b>
                        {SelectedUser?.displayname} {SelectedUser?.lastname}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex chat-top p-2 align-items-center justify-content-between">
                <div className="tweet-header align-items-center">
                  <div className="position-relative">
                    <img
                      src={
                        SelectedUser?.groupPic !== ""
                          ? SelectedUser?.groupPic
                          : GroupPlaceholder
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = GroupPlaceholder;
                      }}
                      alt={SelectedUser?.groupPic}
                      className="avator m-0"
                    />
                  </div>
                  <div className="tweet-header-info ms-2">
                    <p className="m-0 ">
                      <b>{SelectedUser?.name}</b>
                    </p>
                    <p className="m-0">
                      {SelectedUser?.description !== '' && SelectedUser?.description?.substring(0, 80) + "..."}
                    </p>
                  </div>
                </div>
                {/* {UserData?._id === SelectedUser?.creator?._id && ( */}
                <span onClick={() => fnOpenGroupModal("edit")}>
                  <SettingIcon />
                </span>
                {/* )} */}
              </div>
            )}
            {/* </div> */}
            <div className="my-2 ">
              {MHLoading ? (
                "Loading..."
              ) : MessageHistory?.length > 0 ? (
                <>
                  <div className="all-msg" ref={messageContainerRef}>
                    {MessageHistory?.map((item, index) => (
                      <div
                        key={index}
                        className={`msg ${UserData?._id === item?.senderId
                          ? "right-msg"
                          : "left-msg"
                          }`}
                      >
                        {SelectedUser?.type === "friend" ? (
                          <img
                            src={
                              UserData?._id === item?.senderId
                                ? UserData?.profilepic
                                : SelectedUser?.profilepic
                            }
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = UserPlaceholder;
                            }}
                            alt={
                              UserData?._id === item?.senderId
                                ? UserData?.profilepic
                                : SelectedUser?.profilepic
                            }
                            className={`avator ${UserData?._id === item?.senderId
                              ? "avator-right"
                              : "avator-left"
                              }`}
                          />
                        ) : (
                          <img
                            src={
                              UserData?._id === item?.senderId
                                ? UserData?.profilepic
                                : fnGrpFrnPic(item)
                            }
                            // src={
                            //   UserData?._id === item?.senderId
                            //     ? UserData?.profilepic
                            //     : item?.userDetails?.profilepic
                            // }
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = UserPlaceholder;
                            }}
                            alt={
                              UserData?._id === item?.senderId
                                ? UserData?.profilepic
                                : SelectedUser?.profilepic
                            }
                            className={`avator ${UserData?._id === item?.senderId
                              ? "avator-right"
                              : "avator-left"
                              }`}
                          />
                        )}
                        <div className="msg-bubble">
                          <p className="m-0">{item?.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isTyping && (
                    <>
                      <div className="d-flex">
                        {SelectedUser?.displayname} is typing
                        <div className="ms-2 typing-loader">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="all-msg text-center">
                  <Nodata />
                </div>
              )}
            </div>
            <div className="chat-input">
              <Form onSubmit={HandleSubmit} className="d-flex">
                <Form.Group
                  className="position-relative w-100 me-2"
                  controlId="messageContent"
                >
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={input.content}
                    onChange={(e) => {
                      setInput({ ...input, content: e.target.value });
                      handleTyping(); // Emit typing event when user types
                    }}
                    isInvalid={input.errors.content}
                  />
                  <img
                    className="emoji-icon"
                    src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                    onClick={() => {
                      setShowPicker((val) => !val);
                      handleTyping();
                    }}
                    alt="emoji picker"
                  />
                  {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                </Form.Group>

                <Button variant="primary" type="submit">
                  <SendIcon />
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      ) : (
        <h2 className="text-center">Please make any friends for chat</h2>
      )}
      {GroupModalShow && (
        <GroupModal
          bindlist={getFriendList}
          show={GroupModalShow}
          type={GroupModalType}
          groupdata={SelectedUser}
          Friends={FriendData}
          onHide={() => setGroupModalShow(false)}
        />
      )}
    </>
  );
};

export default Chat;
