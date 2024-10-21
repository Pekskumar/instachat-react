import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FeedPlaceholder from "../Assets/Images/placeholder.webp";
import VideoPlaceholder from "../Assets/Images/video_player_placeholder.gif";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import { Dropdown } from "react-bootstrap";
import ThreeDotIcon from "../Assets/Images/ThreeDotIcon";
import { useNavigate } from "react-router-dom";
// import ShareProfileModal from "../Modals/SharePostModal";
import SharePostModal from "../Modals/SharePostModal";

const FeedCard = (props) => {
  let navigate = useNavigate();
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const [ShareProfileData, setShareProfileData] = useState();
  const [ShareProfileModalShow, setShareProfileModalShow] = useState(false);

  function fnLikesColor() {
    let temp = props?.data?.likes?.find((f) => f?.userId === UserData?._id);
    if (temp) {
      return "red";
    } else {
      return "none";
    }
  }

  function fnShareProfile(data) {
    setShareProfileData(data);
    setShareProfileModalShow(true);
  }

  return (
    <div className="tweet-wrap position-relative">
      {UserData?._id === props?.data?.userId?._id && (
        <div className="delete-post">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <ThreeDotIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => props.onDelete(props)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      <div
        className="tweet-header tweet-header2"
        onClick={() => navigate(`/profile/${props?.data?.userId?._id}`)}
      >
        <img
          src={
            props?.data?.userId?.profilepic !== ""
              ? props?.data?.userId?.profilepic
              : UserPlaceholder
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = UserPlaceholder;
          }}
          alt={props?.data?.userId?.profilepic}
          className="avator"
        />
        <div className="tweet-header-info">
          {props?.data?.userId?.displayname}{" "}

          <span>
            {/* . */}
            {moment(props?.data?.createdAt).format("DD MMMM hh:mm A")}
          </span>
          <p>@{props?.data?.userId?.displayname}</p>
        </div>

      </div>
      <div className="tweet-header-text">
        <p>{props?.data?.content}</p>
      </div>
      {props?.data?.mediaUrl !== "" && (
        <div className="tweet-img-wrap">
          {props?.data?.mediaType === "video" ? (
            <video
              loop
              controls
              muted
              onClick={() => props?.onComment(true, props, "comment")}
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
              <source
                onClick={() => props?.onComment(true, props, "comment")}
                src={props?.data?.mediaUrl}
                type="video/mp4"
              />
              {/* Optional: Display a message or placeholder if the video fails to load */}
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={
                props?.data?.mediaUrl !== "" && props?.data?.mediaUrl !== null
                  ? props?.data?.mediaUrl
                  : FeedPlaceholder
              }
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = FeedPlaceholder;
              }}
              alt=""
              className="tweet-img"
              onClick={() => props?.onComment(true, props, "comment")}
            />
          )}
        </div>
      )}
      <div className="tweet-info-counts tweet-info-counts2">
        <div
          className="comments like-hover cursor-pointer"
          onClick={() => props?.onComment(true, props, "comment")}
        >
          <svg
            className="feather feather-message-circle sc-dnqmqq jxshSx"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <div className="comment-count">{props?.data?.commentsCount}</div>
        </div>
        <div className="likes like-hover cursor-pointer">
          <span onClick={() => props?.onLike(props)}>
            <svg
              className="feather feather-heart sc-dnqmqq jxshSx"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={fnLikesColor()}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </span>
          {props?.data?.likesCount > 0 ? (
            <div
              onClick={() => props?.onComment(true, props, "like")}
              className="likes-count "
            >
              {props?.data?.likesCount}
            </div>
          ) : (
            <div
              // onClick={() => props?.onComment(true, props, "like")}
              className="likes-count  "
            >
              {props?.data?.likesCount}
            </div>
          )}
        </div>

        <div className="message like-hover" onClick={() => fnShareProfile(props?.data)}>
          <svg
            className="feather feather-send sc-dnqmqq jxshSx"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      </div>
      {ShareProfileModalShow && (
        <SharePostModal
          show={ShareProfileModalShow}
          ShareProfileData={ShareProfileData}
          onHide={() => setShareProfileModalShow(false)}
        />
      )}
    </div>
  );
};

export default FeedCard;
