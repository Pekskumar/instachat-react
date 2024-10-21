import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import { commonservices } from "../../Common Service/CommonServices";

const ForgotPassword = (props) => {
  let location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("e");

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    emailid: email,
    password: "",
    confirmpassword: "",
    errors: {
      password: "",
      confirmpassword: "",
      ValidationRules: [
        {
          FieldName: "password",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "confirmpassword",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
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
    if (input?.password !== input?.confirmpassword) {
      toast.error("password not match");
      return;
    }
    if (obj.isValid) {
      setLoading(true);
      let body = {
        emailid: input?.emailid.trim(),
        password: input?.password.trim(),
      };

      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.FORGOTPASSWORD,
          body: body,
        },
        false
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        navigate("/");
        // dispatch(userToken(response?.data?.data?.token));
        // dispatch(userInfo(response?.data?.data?.user));
      }
      if (!response?.isValidate) {
        console.log("Error  getting country list", response);
      }
    }
  }
  return (
    <>
      <div className="login-page">
        <div className="login-right">
          <div className="w-100">
            <h2 className="mb-5 text-center">Reset Password</h2>
            <Form onSubmit={(e) => HandleSubmit(e)}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
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
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter only 6 digit or number"
                  maxLength={6}
                  value={input.confirmpassword}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      ["confirmpassword"]: e.target.value,
                    })
                  }
                  isInvalid={input.errors.confirmpassword}
                />
                {input.errors.confirmpassword && (
                  <Form.Control.Feedback type="invalid">
                    {input.errors.confirmpassword}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button
                variant="primary w-100 my-4"
                disabled={Loading}
                type="submit"
              >
                {Loading ? "Loading..." : "Reset Password"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
