import axios from "axios";
import imageCompression from "browser-image-compression";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Select from "react-select";
import GroupPlaceholder from "../Assets/Images/Groupplaceholder.jpg";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";

const GroupModal = (props) => {
  let tokenValue = localStorage.getItem("Token");
  const inputFile = useRef();
  const [file, setFile] = useState();
  const [MyFriendList, setMyFriendList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    groupPic: "",
    name: "",
    description: "",
    members: [],
    errors: {
      name: "", // Ensure errors are initialized correctly
      description: "",
      members: [],
      ValidationRules: [
        {
          FieldName: "name",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
      ],
    },
  });

  useEffect(() => {
    const temp =
      props?.Friends?.filter((element) => element?.type === "friend").map(
        (element) => ({
          value: element?._id,
          label: `${element?.displayname} ${element?.lastname}`,
        })
      ) || [];
    setMyFriendList(temp);

    if (props?.type === "edit") {
      setInput((prevInput) => ({
        ...prevInput,
        name: props?.groupdata?.name,
        description: props?.groupdata?.description,
        groupPic: props?.groupdata?.groupPic,
        members: props?.groupdata?.members || [],
      }));
    }
  }, [props]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return toast.error("Only PNG and JPEG images are allowed.");
    }
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setInput((prevInput) => ({
        ...prevInput,
        groupPic: compressedFile,
      }));
      setFile(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Image compression failed:", error);
      toast.error("Image compression failed. Please try again.");
    }
  };
  async function HandleSubmit(e) {
    e.preventDefault();
    let errors = { ...input.errors };
    if (!input?.name?.trim()) {
      errors.name = "This Field is a required field"; // Set the error message
    } else {
      errors.name = ""; // Clear error if validation passes
    }
    setInput((prevInput) => ({
      ...prevInput,
      errors: errors,
    }));
    if (errors.name) {
      toast.error("Please correct the errors and try again.");
      return;
    }
    if (input.members.length === 0) {
      toast.error("Please select any one member from Friend list.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", input?.name?.trim());
    formData.append("description", input?.description?.trim());
    if (input.groupPic) {
      formData.append("groupPic", input.groupPic);
    }
    input.members.forEach((member, index) => {
      formData.append(`members[${index}]`, member);
    });
    let url = API_URL.BASEURL + API_URL.GROUPCREATE;
    try {
      if (props.type === "edit") {
        formData.append("userId", props?.groupdata?.creator?._id);
        url = API_URL.BASEURL + API_URL.GROUPEDIT + `/${props?.groupdata?._id}`;
      }
      const resData = await axios({
        method: "POST",
        url: url,
        data: formData,
        headers: {
          accept: "*/*",
          Authorization: tokenValue,
        },
      });
      const response = apiResponse(true, resData?.data, setLoading);
      if (response?.isValidate) {
        props.bindlist();
        props.onHide();
      } else {
        console.error("Error updating profile:", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to create or update the group.");
    } finally {
      setLoading(false);
    }
  }

  function fnHandleFriends(selectedItems) {
    const selectedMembers = selectedItems.map((item) => item.value);
    setInput((prevInput) => ({
      ...prevInput,
      members: selectedMembers,
    }));
  }
  const selectedMembers = MyFriendList.filter((friend) =>
    input.members.includes(friend.value)
  );
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
            {props.type} Group
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={HandleSubmit}>
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
                    alt={input.groupPic ? file : GroupPlaceholder}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = GroupPlaceholder;
                    }}
                  />
                )}
                {!file && (
                  <img
                    src={input.groupPic || GroupPlaceholder}
                    alt={input.groupPic ? file : GroupPlaceholder}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = GroupPlaceholder;
                    }}
                  />
                )}
              </label>
            </div>
            {props?.type === "edit" && (
              <>
                <h6 className="text-center my-2">
                  {props?.groupdata?.members?.length} Members
                </h6>
                <hr />
                <p className="m-0">
                  <b>Created By </b>: {props?.groupdata?.creator?.displayname},
                  {moment(props?.groupdata?.createdAt).format(
                    "DD MMMM hh:mm A"
                  )}
                </p>
                <hr />
              </>
            )}
            <Form.Group className="mb-3" controlId="formname">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Group Name"
                maxLength={20}
                value={input.name}
                onChange={(e) =>
                  setInput((prevInput) => ({
                    ...prevInput,
                    name: e.target.value,
                  }))
                }
                isInvalid={!!input.errors.name} // Ensure isInvalid is properly set
              />
              {input.errors.name && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formdescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                maxLength={200}
                value={input.description}
                onChange={(e) =>
                  setInput((prevInput) => ({
                    ...prevInput,
                    description: e.target.value,
                  }))
                }
                isInvalid={!!input.errors.description}
              />
              {input.errors.description && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.description}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formdescription">
              <Form.Label>Select Friends</Form.Label>
              <Select
                value={selectedMembers} // Use value instead of defaultValue
                isMulti
                name="MyFriendList"
                options={MyFriendList}
                placeholder="Select Friends..."
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={fnHandleFriends}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" disabled={Loading} type="submit">
              {Loading ? "Loading..." : `${props.type} Group`}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default GroupModal;
