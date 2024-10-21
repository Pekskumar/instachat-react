import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditIcon from "../../Assets/Images/EditIcon";
import UserPlaceholder from "../../Assets/Images/userimages.jpg";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import FeedCard from "../../Components/FeedCard";
import Nodata from "../../Components/Nodata";
import CommentModal from "../../Modals/CommentModal";
import UpdateProfileModal from "../../Modals/UpdateProfileModal";

const Profile = () => {
  let param = useParams();
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const [ProfileModalShow, setProfileModalShow] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ProfileDetail, setProfileDetail] = useState();
  const [FeedData, setFeedData] = useState([]);
  const [CommentPostData, setCommentPostData] = useState();
  const [ModalType, setModalType] = useState();
  const [SugLoading, setSugLoading] = useState(false);
  const [CommentModalShow, setCommentModalShow] = useState(false);
  const [FriendData, setFriendData] = useState([]);

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
      setFeedData(
        response?.data?.data.filter((f) => f.userId._id === param.id)
      );
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }
  async function getProfile() {
    let body = {
      userId: param.id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.GETPROFILE,
        body: body,
      },
      false
    );
    let response = apiResponse(false, resData);
    if (response?.isValidate) {
      setProfileDetail(response?.data?.data);
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
  useEffect(() => {
    getProfile();
    getFeeds();
  }, [param]);

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

  useEffect(() => {
    getFriendList();
  }, []);

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
    let response = apiResponse(true, resData);
    if (response?.isValidate) {
      getFeeds();
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
      <Row className="flex-lg-row flex-column-reverse gap-2 gap-lg-0">
        <Col lg={8} >
          <div className="home-main">
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
        <Col lg={4}>
          {ProfileDetail && (
            <div className="text-center position-relative profile-card">
              <div className="position-relative">
                <img
                  src={
                    ProfileDetail?.profilepic !== ""
                      ? ProfileDetail?.profilepic
                      : UserPlaceholder
                  }
                  alt={ProfileDetail?.profilepic}
                  className="avator m-0 mb-3"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = UserPlaceholder;
                  }}
                />
                {UserData?._id === ProfileDetail?._id && (
                  <span
                    className="update-icon"
                    onClick={() => setProfileModalShow(true)}
                  >
                    <EditIcon />
                  </span>
                )}
              </div>

              <h4 className="mb-3">
                {ProfileDetail?.displayname} {ProfileDetail?.lastname}
              </h4>
              <div
                className="d-flex justify-content-center gap-3 align-items-center">
                <div className="tweet-wrap">
                  <p className="m-0">Posts</p>
                  <h5 className="m-0">{FeedData?.length}</h5>
                </div>
                <div className="tweet-wrap">
                  <p className="m-0">Followings</p>
                  <h5 className="m-0">{ProfileDetail?.friends?.length}</h5>
                </div>
                <div className="tweet-wrap">
                  <p className="m-0">Followers</p>
                  <h5 className="m-0">
                    {ProfileDetail?.friendRequests?.length}
                  </h5>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
      {ProfileModalShow && (
        <UpdateProfileModal
          bindlist={getProfile}
          type="profilepage"
          show={ProfileModalShow}
          onHide={() => setProfileModalShow(false)}
        />
      )}
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

export default Profile;
