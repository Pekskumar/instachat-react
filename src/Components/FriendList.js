import React, { useEffect, useState } from "react";
import { apiCall } from "../Common Service/AxiosService";
import { API_URL } from "../Common Service/APIRoute";
import { apiResponse } from "../Common Service/APIResponse";
import Button from "react-bootstrap/esm/Button";
import FeedPlaceholder from "../Assets/Images/placeholder.webp";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nodata from "../Components/Nodata";

const FriendList = (props) => {
  let navigate = useNavigate();
  const UserData = useSelector((state) => state.userinfo.UserInfo);

  const [Loading, setLoading] = useState(false);
  const [FriendData, setFriendData] = useState([]);
  async function getFriendList() {
    setLoading(true);
    let resData = "";
    if (props.type === "Friends") {
      resData = await apiCall(
        {
          method: "GET",
          url: API_URL.BASEURL + API_URL.MYFRIENDS,
        },
        false
      );
    } else if (props.type === "Suggestions") {
      resData = await apiCall(
        {
          method: "GET",
          // url: API_URL.BASEURL + API_URL.FRIENDSUGGESTIONS,
          // currently all user comes
          url: API_URL.BASEURL + API_URL.ALLUSER,
        },
        false
      );
    } else if (props.type === "Friendsrequests") {
      resData = await apiCall(
        {
          method: "GET",
          url: API_URL.BASEURL + API_URL.FRIENDREQUESTS,
        },
        false
      );
    }

    let response = apiResponse(false, resData, setLoading);
    if (response?.isValidate) {
      setLoading(false);
      setFriendData(response?.data?.data);
      // if (props.type === "Suggestions") {

      // }
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  useEffect(() => {
    getFriendList();
  }, []);

  async function fnConfirmRequest(data) {
    let body = {
      requesterId: data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.FRIENDREQUESTACCEPT,
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
  async function fnRemoveRequest(data) {
    let body = {
      userId: UserData?._id,
      requesterId: data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.FRIENDREQUESTDELETE,
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
  async function fnRemoveFriend(data) {
    let body = {
      userId: UserData?._id,
      friendId: data?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.DELETEFRIEND,
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

  return (
    <div className="friend-main">
      {Loading ? (
        "Loading..."
      ) : FriendData?.length > 0 ? (
        FriendData?.map((item, index) => item.type !== "group" && (
          <div key={index} className="tweet-header mb-2    align-items-center">
            <div className="right">
              <img
                src={item?.profilepic !== "" ? item?.profilepic : UserPlaceholder}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = UserPlaceholder;
                }}
                alt={item?.profilepic}
                className="avator"
                onClick={() =>
                  props.type === "Friends" && navigate(`/profile/${item?._id}`)
                }
              />
              <p
                className="m-0"
                onClick={() =>
                  props.type === "Friends" && navigate(`/profile/${item?._id}`)
                }
              >
                  {item?.displayname} {item?.lastname}
              </p>
            </div>
            <div className="tweet-header-info m-0">



              {props.type === "Friendsrequests" && (
                <>
                  <Button
                    onClick={() => fnConfirmRequest(item)}
                    className="mt-2"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => fnRemoveRequest(item)}
                    className="mt-2 ms-2"
                    variant="secondary"
                  >
                    Remove
                  </Button>
                </>
              )}
              {props.type === "Friends" && (
                <>
                  <Button
                    onClick={() => fnRemoveFriend(item)}
                    variant="secondary"
                    className="mt-2 "
                  >
                    Remove
                  </Button>
                </>
              )}
              {props.type === "Suggestions" && (
                <>
                  {item.friendRequests.find((f) => f === UserData._id) ? (
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
                    <Button onClick={() => fnAddRequest(item)} className="mt-2">
                      Add friend
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <Nodata />
      )}
    </div>
  );
};

export default FriendList;
