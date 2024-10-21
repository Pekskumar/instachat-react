import Picker from "emoji-picker-react";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FeedPlaceholder from "../Assets/Images/placeholder.webp";
import SendIcon from "../Assets/Images/SendIcon";
import ThreeDotIcon from "../Assets/Images/ThreeDotIcon";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import VideoPlaceholder from "../Assets/Images/video_player_placeholder.gif";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import { commonservices } from "../Common Service/CommonServices";
import Nodata from "../Components/Nodata";

const CommentModal = (props) => {
  const [CommentList, setCommentList] = useState([]);
  const messageContainerRef = useRef(null);
  const [LikeList, setLikeList] = useState([]);
  const [CommentListLoader, setCommentListLoader] = useState(false);
  const [LikeListLoader, setLikeListLoader] = useState(false);
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const [Loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (props?.type === "comment") {
      getCommentList();
    }
    if (props?.type === "like") {
      getLikelist();
    }
  }, []);

  const defaultInputState = {
    postId: props?.data?._id,
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

  async function getCommentList() {
    setCommentListLoader(true);
    let resData = await apiCall(
      {
        method: "GET",
        url: API_URL.BASEURL + `posts/${props?.data?._id}/comments`,
      },
      false
    );
    let response = apiResponse(false, resData);
    if (response?.isValidate) {
      setCommentListLoader(false);
      setCommentList(response?.data?.data);
    }
    if (!response?.isValidate) {
      console.log("Error getting notifications", response);
    }
  }

  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    if (obj.isValid) {
      setLoading(true);
      let body = {
        postId: input.postId,
        content: input.content.trim(),
      };
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.POSTCOMMENT,
          body: body,
        },
        true
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        setInput(defaultInputState);
        props.bindlist();
        getCommentList();
        console.log("response 123 ::", response);

        // props.setdata(response?.data?.data);
      }
      if (!response?.isValidate) {
        console.log("Error  getting country list", response);
      }
    }
  }

  const onEmojiClick = (emojiObject, event) => {
    setInput((prevInput) => ({
      ...prevInput,
      content: prevInput.content + emojiObject.emoji,
    }));
    setShowPicker(false);
  };

  async function fnDelete(item) {
    let body = {
      postId: props?.data?._id,
      commentId: item?._id,
      userId: item?.userId?._id,
    };

    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.POSTCOMMENTDELETE,
        body: body,
      },
      true
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      props.bindlist();
      if (CommentList) {
        setCommentList(CommentList.filter((f) => f._id !== item?._id));
      }
    }
    if (!response?.isValidate) {
      console.log("Error getting notifications", response);
    }
  }
  async function getLikelist() {
    setLikeListLoader(true);
    let body = {
      postId: props?.data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.POSTLIKELIST,
        body: body,
      },
      true
    );
    let response = apiResponse(false, resData, setLoading);
    if (response?.isValidate) {
      setLikeListLoader(false);
      // props.bindlist();
      // getCommentList();
      setLikeList(response?.data?.data);
    }
    if (!response?.isValidate) {
      console.log("Error getting notifications", response);
    }
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [CommentList]);
  return (
    <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props?.type}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => HandleSubmit(e)}>
          <Modal.Body>
            <Row>
              <Col lg={6} className="mb-lg-0 mb-4 border-right">
                <div className="tweet-header mb-2    align-items-center">
                  <img
                    src={
                      props?.data?.userId?.profilepic !== ""
                        ? props?.data?.userId?.profilepic
                        : FeedPlaceholder
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = UserPlaceholder;
                    }}
                    alt={props?.data?.userId?.profilepic}
                    className="avator"
                  />
                  <div className="tweet-header-info m-0">
                    <p className="m-0">{props?.data?.userId?.displayname}</p>
                    <p className="m-0">
                      {moment(props?.data?.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="tweet-img-wrap p-0">
                  {props?.data?.mediaType === "video" ? (
                    <video
                      id="videoId"
                      loop
                      controls
                      muted
                      width={"100%"}
                      onError={({ currentTarget }) => {
                        // Hide the video element and display an image placeholder
                        currentTarget.style.display = "none";
                        const imgElement = document.createElement("img");
                        imgElement.src = VideoPlaceholder;
                        imgElement.alt = "Video not available";
                        imgElement.className = "tweet-img"; // Applying the same styling class
                        currentTarget.parentNode.appendChild(imgElement);
                      }}
                    >
                      <source src={props?.data?.mediaUrl} type="video/mp4" />
                      {/* Optional: Display a message or placeholder if the video fails to load */}
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={
                        props?.data?.mediaUrl !== "" &&
                        props?.data?.mediaUrl !== null
                          ? props?.data?.mediaUrl
                          : FeedPlaceholder
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = FeedPlaceholder;
                      }}
                      alt=""
                      className="tweet-img"
                      // onClick={() => props?.onComment(true, props, "comment")}
                    />
                  )}
                </div>
                <div>{props?.data?.content}</div>
              </Col>
              <Col lg={6}>
                {props?.type === "comment" ? (
                  <>
                    <div
                      className="comment-main comments-div "
                      ref={messageContainerRef}
                    >
                      {CommentListLoader ? (
                        "Loading..."
                      ) : CommentList?.length > 0 ? (
                        CommentList?.map((item, index) => (
                          <div
                            key={index}
                            className="tweet-header  mb-3 position-relative  align-items-center"
                          >
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
                              className="avator"
                            />
                            <div className="tweet-header-info m-0 w-88">
                              <div className="d-flex justify-content-between ">
                                <p className="m-0">
                                  {item?.userId?.displayname}
                                </p>
                                <p className="m-0">
                                  {moment(item?.createdAt).fromNow()}
                                </p>
                              </div>
                              <p className="m-0 w-100">{item?.content}</p>
                            </div>
                            {UserData?._id === item?.userId?._id && (
                              <div className="delete-post delete-comment">
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <ThreeDotIcon />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() => fnDelete(item)}
                                    >
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="comments-div">
                          <Nodata />
                        </div>
                      )}
                    </div>
                    <div className="chat-input">
                      <Form className="d-flex">
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
                            }}
                            isInvalid={input.errors.content}
                          />
                          <img
                            className="emoji-icon"
                            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                            onClick={() => {
                              setShowPicker((val) => !val);
                            }}
                            alt="emoji picker"
                          />
                          {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                        </Form.Group>
                        {input.errors.content && (
                          <Form.Control.Feedback type="invalid">
                            {input.errors.content}
                          </Form.Control.Feedback>
                        )}

                        <Button
                          onClick={(e) => HandleSubmit(e)}
                          variant="primary"
                          type="submit"
                          disabled={Loading}
                        >
                          <SendIcon />
                        </Button>
                      </Form>
                    </div>
                  </>
                ) : (
                  <div>
                    {LikeListLoader ? (
                      "Loading..."
                    ) : LikeList?.length > 0 ? (
                      LikeList.map((item, index) => (
                        <div className="tweet-header mb-2    align-items-center">
                          <img
                            src={
                              item?.profilepic !== ""
                                ? item?.profilepic
                                : FeedPlaceholder
                            }
                            alt={item?.profilepic}
                            className="avator"
                          />
                          <div className="tweet-header-info m-0">
                            <p className="m-0">
                              <b>{item?.displayname}</b>
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Nodata />
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
};

export default CommentModal;
