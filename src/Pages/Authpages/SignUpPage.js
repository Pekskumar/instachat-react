import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserPlaceholder from "../../Assets/Images/userimages.jpg";
import { useDispatch } from "react-redux";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import { commonservices } from "../../Common Service/CommonServices";
import { userInfo, userToken } from "../../ReduxTookit/UserInfoSlice";
import imageCompression from "browser-image-compression";
// import { toast } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';

const SignUpPage = (props) => {
  const dispatch = useDispatch();
  const inputFile = useRef();
  const [Loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [input, setInput] = useState({
    emailid: "",
    displayname: "",
    lastname: "",
    password: "",
    mobilenumber: "",
    profilepic: "",
    errors: {
      emailid: "",
      displayname: "",
      lastname: "",
      password: "",
      mobilenumber: "",
      ValidationRules: [
        {
          FieldName: "password",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "emailid",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "emailid",
          ValidationType: "email",
          ValidationMessage: "Incorrect email address",
        },
        {
          FieldName: "displayname",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "lastname",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "mobilenumber",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
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

  const reset = () => {
    inputFile.current.value = "";
    setFile("");
    setInput({
      ...input,
      profilepic: "",
    });
  };

  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    if (obj.isValid) {
      setLoading(true);
      let body = {
        emailid: input?.emailid.trim(),
        password: input?.password.trim(),
        displayname: input?.displayname.trim(),
        lastname: input?.lastname.trim(),
        mobilenumber: input?.mobilenumber.trim(),
        profilepic: input.profilepic,
      };
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.SIGNUP,
          body: body,
        },
        true
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        dispatch(userToken(response?.data?.data?.token));
        dispatch(userInfo(response?.data?.data?.user));
      } else {
        console.log("Error signing up:", response);
      }
    }
  }

  return (
    <>
      <Form onSubmit={(e) => HandleSubmit(e)}>
        <Row>
          <Form.Group className="mb-3" controlId="formProfilePic">
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
                {file ? (
                  <img
                    src={file}
                    alt={input.profilepic ? file : UserPlaceholder}
                  />
                ) : (
                  <img
                    src={input.profilepic || UserPlaceholder}
                    alt={input.profilepic ? file : UserPlaceholder}
                  />
                )}
              </label>
            </div>
          </Form.Group>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formDisplayName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                maxLength={150}
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
            </Form.Group></Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                maxLength={146}
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
            </Form.Group></Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                maxLength={146}
                value={input.emailid}
                onChange={(e) =>
                  setInput({
                    ...input,
                    emailid: e.target.value,
                  })
                }
                isInvalid={input.errors.emailid}
              />
              {input.errors.emailid && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.emailid}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formMobileNumber">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mobile No."
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
          </Col>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter only 6 digits or number"
              maxLength={6}
              value={input.password}
              onChange={(e) =>
                setInput({
                  ...input,
                  password: e.target.value,
                })
              }
              isInvalid={input.errors.password}
            />
            {input.errors.password && (
              <Form.Control.Feedback type="invalid">
                {input.errors.password}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row>
        <Button variant="primary w-100 my-4" disabled={Loading} type="submit">
          {Loading ? "Loading..." : "Sign Up"}
        </Button>
      </Form>
      <p className="text-center">
        Already have an account?{" "}
        <span onClick={() => props.data(false)} className="cursor-pointer">
          <b>Login</b>
        </span>
      </p>
    </>
  );
};

export default SignUpPage;
