import imageCompression from "browser-image-compression";
import Picker from "emoji-picker-react";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import FeedPlaceholder from "../Assets/Images/placeholder.webp";
import VideoPlaceholder from "../Assets/Images/video_player_placeholder.gif";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import { commonservices } from "../Common Service/CommonServices";
import { noticeCount } from "../ReduxTookit/UserInfoSlice";
import DeleteIcon from "../Assets/Images/DeleteIcon";
import UploadIcon from "../Assets/Images/UploadIcon";
// import { toast } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';

const NewPostCard = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);

  let dispatch = useDispatch();
  const defaultInputState = {
    imageUrl: "",
    content: "",
    errors: {
      imageUrl: "",
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
  const [Loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState();
  const onEmojiClick = (emojiObject, event) => {
    setInput((prevInput) => ({
      ...prevInput,
      content: prevInput.content + emojiObject.emoji,
    }));
    setShowPicker(false);
  };

  async function fngetNotification() {
    let resData = await apiCall(
      {
        method: "GET",
        url: API_URL.BASEURL + API_URL.GETNOTIFICATIONS,
      },
      false
    );
    let response = apiResponse(false, resData);
    if (response?.isValidate) {
      dispatch(noticeCount(response?.data?.data.filter((n) => !n.read).length));
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
        content: input.content.trim(),
        imageUrl: input.imageUrl,
      };
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.CREATEPOSTS,
          body: body,
        },
        true
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        props.RefreshFeed();
        setInput(defaultInputState);
        setFile();
        setFileType();
        fngetNotification();
      }
      if (!response?.isValidate) {
        console.log("Error getting country list", response);
      }
    }
  }

  const reset = () => {
    setFile();
    setFileType();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
  
    // Get the MIME type of the file
    const fileMimeType = file.type;
  
    // Check if the file is an image or video
    if (!fileMimeType.startsWith("image/") && !fileMimeType.startsWith("video/")) {
      // If the file is neither an image nor a video, show a toast notification and return
      toast.error("Only image and video files are allowed.");
      setFile(); // Reset the file state if necessary
      setFileType(); // Reset the file type state if necessary
      return;
    }
  
    // Set the file type (either video/mp4 for videos or the file's MIME type for images)
    setFileType(fileMimeType.startsWith("video/") ? "video/mp4" : fileMimeType);
    setFile(URL.createObjectURL(file));
  
    // Check file size
    const maxSizeMB = 5; // 5 MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
    if (file.size > maxSizeBytes) {
      setInput({
        ...input,
        imageUrl: "",
        errors: {
          ...input.errors,
          imageUrl: "File size exceeds 5 MB. Please choose a smaller file.",
        },
      });
      return;
    }
  
    let compressedFile = file;
  
    try {
      if (fileMimeType.startsWith("image/")) {
        // Image compression options
        const imageOptions = {
          maxSizeMB: 0.05, // 50 KB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, imageOptions);
      }
  
      setInput({
        ...input,
        imageUrl: compressedFile,
        errors: {
          ...input.errors,
          imageUrl: "",
        },
      });
    } catch (error) {
      console.error("File handling error:", error);
      setInput({
        ...input,
        imageUrl: "",
        errors: {
          ...input.errors,
          imageUrl: "File processing failed. Please try again.",
        },
      });
    }
  };

  return (
    <div className="tweet-wrap  new-post">
      <div className="tweet-header">
        <img
          src={
            UserData?.profilepic !== "" ? UserData?.profilepic : UserPlaceholder
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = UserPlaceholder;
          }}
          alt={UserData?.profilepic}
          className="avator"
        />
        <div className="tweet-header-info w-100">
          <Form.Group
            className="mb-3 input-share position-relative"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Control
              as="textarea"
              placeholder="What is in your mind...😄"
              // maxLength={2000}
              value={input.content}
              onChange={(e) =>
                setInput({
                  ...input,
                  content: e.target.value,
                })
              }
              isInvalid={input.errors.content}
            />
            {input.errors.content && (
              <Form.Control.Feedback type="invalid">
                {input.errors.content}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <div className="d-flex position-relative    justify-content-between align-items-center create-post-btn">
            <div className="    d-flex   align-items-center">
              <div className="tweet-info-counts m-0 position-relative upload-btn">
                {file ? (
                  <>
                    {fileType === "video/mp4" ? (
                      <video
                        // loop
                        // controls
                        // muted
                        onError={({ currentTarget }) => {
                          // Hide the video element and display an image placeholder
                          currentTarget.style.display = "none";
                          const imgElement = document.createElement("img");
                          imgElement.src = VideoPlaceholder;
                          imgElement.alt = "Video not available";
                          imgElement.className = "tweet-img";
                          currentTarget.parentNode.appendChild(imgElement);
                        }}
                      >
                        <source src={file} type="video/mp4" />
                        {/* Optional: Display a message or placeholder if the video fails to load */}
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={
                          file !== "" && file !== null ? file : FeedPlaceholder
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = FeedPlaceholder;
                        }}
                        alt=""
                        className="tweet-img"
                      />
                    )}
                    <span className="reset-img" onClick={() => reset()}>
                      <DeleteIcon size='15px' />
                    </span>
                  </>
                ) : (
                  <div className="upload-btn-wrapper m-0">
                    <button className="btn">
                      <UploadIcon />
                    </button>
                    <input
                      type="file"
                      name="myfile"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
              <div className="emoji upload-btn">
              <img
                className=" emoji-icon "
                src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                onClick={() => setShowPicker((val) => !val)}
                alt="emoji picker"
              />
              {input.errors.imageUrl && (
              <div className="tweet-info-counts text-danger">
                {input.errors.imageUrl}
              </div>
            )}
            </div>
            </div>
            <Button
              disabled={Loading}
              variant="primary ms-3"
              onClick={(e) => HandleSubmit(e)}
            >
              {Loading ? "Loading..." : "Post"}
            </Button>
            
            {showPicker && (
                <Picker
                  pickerStyle={{ width: "100%" }}
                  onEmojiClick={onEmojiClick}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostCard;
