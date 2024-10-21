import { default as React, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
import { apiResponse } from "../Common Service/APIResponse";
import UserPlaceholder from "../Assets/Images/userimages.jpg";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import { commonservices } from "../Common Service/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import { userInfo } from "../ReduxTookit/UserInfoSlice";
import imageCompression from "browser-image-compression";

const UpdateProfileModal = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const dispatch = useDispatch();
  const inputFile = useRef();
  const [file, setFile] = useState();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    displayname: UserData?.displayname,
    lastname: UserData?.lastname,
    mobilenumber: UserData?.mobilenumber,
    profilepic: UserData?.profilepic,
    emailid: UserData?.emailid,
    errors: {
      displayname: "",
      lastname: "",
      mobilenumber: "",
      ValidationRules: [
        {
          FieldName: "displayname",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "lastname",
          ValidationType: "required",
          ValidationMessage: "Incorrect email address",
        },
        {
          FieldName: "mobilenumber",
          ValidationType: "required",
          ValidationMessage: "Incorrect email address",
        },
      ],
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Check file type
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return toast.error("Only PNG and JPEG images are allowed.");
    }

    // Image compression options
    const options = {
      maxSizeMB: 0.05, // 50 KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setInput({
        ...input,
        profilepic: compressedFile,
      });
      setFile(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Image compression failed:", error);
      toast.error("Image compression failed. Please try again.");
    }
  };

  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    if (input.newPassword !== input.confirmNewPassword) {
      return toast.error("Confirm password does not match new password");
    }
    if (obj.isValid) {
      setLoading(true);
      let body = {
        displayname: input.displayname.trim(),
        lastname: input.lastname.trim(),
        mobilenumber: input.mobilenumber.trim(),
        profilepic: input.profilepic,
        emailid: input.emailid.trim(),
      };

      let resData = await apiCall(
        {
          method: "PUT",
          url: API_URL.BASEURL + API_URL.UPDATEPROFILE,
          body: body,
        },
        true
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        dispatch(userInfo(response?.data?.data));
        props.onHide();
        if (props?.type === "profilepage") {
          props.bindlist();
        }
      } else {
        console.log("Error updating profile:", response);
      }
    }
  }

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Profile
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => HandleSubmit(e)}>
          <Modal.Body>
            <div className="file-input">
              <input
                type="file"
                className="form-control d-none"
                id="profileImg"
                ref={inputFile}
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
              <label className="file-input__label" htmlFor="profileImg">
                {file && (
                  <img
                    src={file}
                    alt={input.profilepic ? file : UserPlaceholder}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = UserPlaceholder;
                    }}
                  />
                )}
                {!file && (
                  <img
                    src={input.profilepic || UserPlaceholder}
                    alt={input.profilepic ? file : UserPlaceholder}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = UserPlaceholder;
                    }}
                  />
                )}
              </label>
            </div>
            <Form.Group className="mb-3" controlId="formDisplayName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                maxLength={20}
                value={input.displayname}
                onChange={(e) =>
                  setInput({
                    ...input,
                    displayname: e.target.value,
                  })
                }
                isInvalid={input.errors.displayname}
              />
              {input.errors.displayname && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.displayname}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                maxLength={20}
                value={input.lastname}
                onChange={(e) =>
                  setInput({
                    ...input,
                    lastname: e.target.value,
                  })
                }
                isInvalid={input.errors.lastname}
              />
              {input.errors.lastname && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.lastname}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMobileNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mobile Number"
                maxLength={10}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={input.mobilenumber}
                onChange={(e) =>
                  setInput({
                    ...input,
                    mobilenumber: e.target.value,
                  })
                }
                isInvalid={input.errors.mobilenumber}
              />
              {input.errors.mobilenumber && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.mobilenumber}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                disabled
                placeholder="Email"
                value={input.emailid}
                onChange={(e) =>
                  setInput({
                    ...input,
                    emailid: e.target.value,
                  })
                }
                isInvalid={input.errors.emailid}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" disabled={Loading} type="submit">
              {Loading ? "Loading..." : "Update Profile"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateProfileModal;
