import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import { Form } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import { commonservices } from "../../Common Service/CommonServices";
const ResetPassword = () => {
  let navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    emailid: "",
    errors: {
      emailid: "",
      ValidationRules: [
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
      };
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.VERIFYEMAIL,
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
            <h2 className="mb-5 text-center">Forgot Password</h2>
            <Form onSubmit={(e) => HandleSubmit(e)}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
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

              <Button
                variant="primary w-100 my-4"
                disabled={Loading}
                type="submit"
              >
                {Loading ? "Loading..." : "Get Paasowrd"}
              </Button>
            </Form>
            <p className="text-center">
              Have other account?{" "}
              <span className="cursor-pointer" onClick={() => navigate("/")}>
                <b>Sign in</b>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
