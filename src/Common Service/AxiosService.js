import axios from "axios";
import { commonservices } from "./CommonServices";

let tokenValue = "";

export const apiCall = async (data, formType) => {
  tokenValue = localStorage.getItem("Token");
  if (tokenValue !== "" && tokenValue !== undefined && tokenValue !== null) {
    try {
      let formData = new FormData();

      if (formType) {
        for (const [key, value] of Object.entries(data?.body)) {
          if (
            typeof value === "object" &&
            Array.isArray(value) &&
            key !== "componentjson"
          ) {
            value?.map((item, index) => {
              for (const [nestedKey, nestedValue] of Object.entries(item)) {
                formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
              }
            });
          } else {
            formData.append(`${key}`, value);
          }
        }
      }
      // if (formType) {
      //   for (const [key, value] of Object.entries(data?.body)) {
      //     // Check if the value is an array
      //     if (Array.isArray(value)) {
      //       // Append array values in the format `members[0]`, `members[1]`, etc.
      //       value.forEach((item, index) => {
      //         formData.append(`${key}[${index}]`, item);
      //       });
      //     } else if (typeof value === "object" && value !== null) {
      //       // If value is an object, handle nested keys
      //       for (const [nestedKey, nestedValue] of Object.entries(value)) {
      //         formData.append(`${key}.${nestedKey}`, nestedValue);
      //       }
      //     } else {
      //       // For regular key-value pairs
      //       formData.append(key, value);
      //     }
      //   }
      // }
      let response = await axios({
        method: data.method,
        url: data?.url,
        maxBodyLength: Infinity,
        data: formType ? formData : data?.body,
        // headers: formType
        //   ? commonservices.getHeadersFromData()
        //   : commonservices.getHeaders(),
        headers: formType
          ? {
              accept: "*/*",
              Authorization: tokenValue,
            }
          : {
              "Content-Type": "application/json",
              accept: "*/*",
              Authorization: tokenValue,
            },
      });
      return response?.data;
    } catch (error) {
      return error;
    }
  } else {
    try {
      let formData = new FormData();

      if (formType) {
        for (const [key, value] of Object.entries(data?.body)) {
          if (
            typeof value === "object" &&
            Array.isArray(value) &&
            key !== "componentjson"
          ) {
            value?.map((item, index) => {
              for (const [nestedKey, nestedValue] of Object.entries(item)) {
                formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
              }
            });
          } else {
            formData.append(`${key}`, value);
          }
        }
      }
      let response = await axios({
        method: data.method,
        url: data?.url,
        data: formType ? formData : data?.body,
        headers: formType
          ? {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
            }
          : { "Content-Type": "application/json", Accept: "*/*" },
      });
      return response?.data;
    } catch (error) {
      return error;
    }
  }
};

export const apiCallformData = async (data, formType) => {
  if (tokenValue !== "" && tokenValue !== undefined && tokenValue !== null) {
    try {
      let response = await axios({
        method: "POST",
        url: data?.url,
        maxBodyLength: Infinity,
        data: formType ? data?.body : data?.body,
        headers: formType
          ? commonservices.getHeadersFromData()
          : commonservices.getHeaders(),
      });
      return response?.data;
    } catch (error) {
      return error;
    }
  } else {
    try {
      let formData = new FormData();

      if (formType) {
        for (const [key, value] of Object.entries(data?.body)) {
          if (
            typeof value === "object" &&
            Array.isArray(value) &&
            key !== "componentjson"
          ) {
            value?.map((item, index) => {
              for (const [nestedKey, nestedValue] of Object.entries(item)) {
                formData.append(`${key}[${index}].${nestedKey}`, nestedValue);
              }
            });
          } else {
            formData.append(`${key}`, value);
          }
        }
      }
      let response = await axios({
        method: data.method,
        url: data?.url,
        data: formType ? formData : data?.body,
        headers: formType
          ? commonservices.getHeadersFromData()
          : commonservices.getHeaders(),
      });
      return response?.data;
    } catch (error) {
      return error;
    }
  }
};

export function ServerSideAjaxCall(url, data) {
  var json = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: null,
  };
  return {
    url: url,
    method: "POST",
    data: data,
    headers: {
      // "Content-Type": "multipart/form-data",
      accept: "*/*",
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
    beforeSend: function (re) {},
    error: function () {},
    dataFilter: function (data) {
      data = JSON.parse(data);
      if (data?.status_code === 1) {
        json = {
          recordsTotal: data?.data[0]?.TotalRecords,
          recordsFiltered: data?.data[0]?.TotalRecords,
          data: data?.data,
        };
      }

      return JSON.stringify(json);
    },
  };
}
