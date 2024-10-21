import React, { useEffect, useState } from "react";
import FeedCard from "../../Components/FeedCard";
import FeedPlaceholder from "../../Assets/Images/placeholder.webp";
import UserPlaceholder from "../../Assets/Images/userimages.jpg";
import { apiCall } from "../../Common Service/AxiosService";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import NewPostCard from "../../Components/NewPostCard";
import CommentModal from "../../Modals/CommentModal";
import { Button, Col, Row, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import FriendList from "../../Components/FriendList";
import Nodata from "../../Components/Nodata";

const Home = () => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const [TabValue, setTabValue] = useState("Friendsrequests");
  const [Loading, setLoading] = useState(false);
  const [ModalType, setModalType] = useState();
  const [CommentModalShow, setCommentModalShow] = useState(false);
  const [CommentPostData, setCommentPostData] = useState();
  const [FeedData, setFeedData] = useState([]);
  const [SugLoading, setSugLoading] = useState(false);
  const [FriendData, setFriendData] = useState([]);
  async function getFriendList() {
    setSugLoading(true);
    let resData = await apiCall(
      {
        method: "GET",
        url: API_URL.BASEURL + API_URL.ALLUSER,
      },
      false
    );

    let response = apiResponse(false, resData, setSugLoading);
    if (response?.isValidate) {
      setSugLoading(false);
      setFriendData(response?.data?.data);
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  useEffect(() => {
    getFriendList();
  }, []);
  async function getFeeds() {
    setLoading(true);
    let resData = await apiCall(
      {
        method: "GET",
        url: API_URL.BASEURL + API_URL.NEWSFEED,
      },
      false
    );
    let response = apiResponse(false, resData, setLoading);
    if (response?.isValidate) {
      setLoading(false);
      setFeedData(response?.data?.data);
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  useEffect(() => {
    getFeeds();
  }, []);

  async function fnLike(data) {
    let body = {
      postId: data?.data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.POSTLIKE,
        body: body,
      },
      false
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      getFeeds();
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  async function fnDelete(data) {
    let body = {
      postId: data?.data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.POSTDELETE,
        body: body,
      },
      false
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      getFeeds();
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }
  async function fnAddRequest(data) {
    let body = {
      targetUserId: data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.FRIENDREQUESTSEND,
        body: body,
      },
      false
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      getFriendList();
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }
  async function fnCancelRequest(data) {
    let body = {
      userId: UserData?._id,
      targetUserId: data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.FRIENDREQUESTCANCEL,
        body: body,
      },
      false
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      getFriendList();
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }
  function fnComment(value, data, type) {
    setModalType(type);
    setCommentModalShow(value);
    setCommentPostData(data?.data);
  }
  return (
    <>
      <Row className="flex-lg-row flex-column-reverse">
        <Col lg={2}>

          <div className="profile-main">
            <div className="profile-banner">
              <img src="https://media.sproutsocial.com/uploads/5D-LinkedIn-Personal-Blank.png" />
            </div>
            <div className="profile-info">
              <div className="profile-info-detail">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width={"72px"} height={"72px"} />
                <h6>Prakash</h6>
              </div>
            </div>
          </div>

        </Col>
        <Col lg={6} className="main-left">
          <div className="home-main">
            <NewPostCard RefreshFeed={getFeeds} />
            <div>
              {Loading ? (
                "Loading..."
              ) : FeedData?.length > 0 ? (
                FeedData?.map((item, index) => (
                  <React.Fragment key={index}>
                    <FeedCard
                      data={item}
                      onLike={fnLike}
                      onDelete={fnDelete}
                      onComment={fnComment}
                    />
                    {index % 10 === 9 && (
                      <>
                        <h4 className="mt-4">People you may know</h4>
                        <div className="home-suggest-slide my-4 d-flex">
                          {SugLoading
                            ? "Loading..."
                            : FriendData?.length > 0 &&
                            FriendData?.map((item, index) => (
                              <div key={index} className="tweet-header mb-2 me-3    align-items-center">
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
                                  className="avator m-0 mb-2"
                                />

                                <div className="tweet-header-info m-0">
                                  <p className="m-0">
                                    <b>
                                      {item?.displayname} {item?.lastname}
                                    </b>
                                  </p>
                                  {item.friendRequests.find(
                                    (f) => f === UserData._id
                                  ) ? (
                                    <>
                                      <Button
                                        onClick={() => fnCancelRequest(item)}
                                        variant="secondary"
                                        className="mt-2 "
                                      >
                                        Cancel Request
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      onClick={() => fnAddRequest(item)}
                                      className="mt-2"
                                    >
                                      Add friend
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Nodata />
              )}
            </div>
          </div>
        </Col>
        <Col lg={4} className=" main-right">
          <div className="contact-chat">
            <Tabs
              defaultActiveKey={TabValue}
              id="uncontrolled-tab-example"
              className="mb-3"
              fill
              onSelect={(k) => setTabValue(k)}
            >
              <Tab eventKey="Friendsrequests" title="Followers">
                {TabValue === "Friendsrequests" && (
                  <FriendList type="Friendsrequests" />
                )}
              </Tab>
              <Tab eventKey="Friends" title="Followings">
                {TabValue === "Friends" && <FriendList type="Friends" />}
              </Tab>
              <Tab eventKey="Suggestions" title="Suggestions">
                {TabValue === "Suggestions" && <FriendList type="Suggestions" />}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
      {CommentModalShow && (
        <CommentModal
          show={CommentModalShow}
          data={CommentPostData}
          type={ModalType}
          // setdata={setCommentPostData}
          bindlist={getFeeds}
          onHide={() => setCommentModalShow(false)}
        />
      )}
    </>
  );
};

export default Home;
