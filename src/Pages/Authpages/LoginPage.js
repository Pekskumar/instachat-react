import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import { commonservices } from "../../Common Service/CommonServices";
import { userInfo, userToken } from "../../ReduxTookit/UserInfoSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = (props) => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    emailid: "",
    password: "",
    errors: {
      emailid: "",
      password: "",
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
      ],
    },
  });

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
      };
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.SIGNIN,
          body: body,
        },
        false
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        dispatch(userToken(response?.data?.data?.token));
        dispatch(userInfo(response?.data?.data?.user));
      }
      if (!response?.isValidate) {
        console.log("Error  getting country list", response);
      }
    }
  }
  return (
    <>
      <Form onSubmit={(e) => HandleSubmit(e)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Email"
            maxLength={146}
            value={input.emailid}
            onChange={(e) =>
              setInput({
                ...input,
                ["emailid"]: e.target.value,
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
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter only 6 digit or number"
            maxLength={6}
            value={input.password}
            onChange={(e) =>
              setInput({
                ...input,
                ["password"]: e.target.value,
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
        <p
          className="m-0 text-end cursor-pointer"
          onClick={() => navigate("/reset-password")}
        >
          Forgot Password ?
        </p>
        <Button variant="primary w-100 my-4" disabled={Loading} type="submit">
          {Loading ? "Loading..." : "Login"}
        </Button>
      </Form>
      <p className="text-center">
        Don’t have account?{" "}
        <span onClick={() => props.data(true)} className="cursor-pointer">
          <b>Sign up</b>
        </span>
      </p>
    </>
  );
};

export default LoginPage;
