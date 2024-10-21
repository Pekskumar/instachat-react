import moment from "moment";
// import FoodIcon from "../Assets/Images/FoodIcon";
// import UtilitiesIcon from "../Assets/Images/UtilitiesIcon";
// import OthersIcon from "../Assets/Images/OthersIcon";
// import RentIcon from "../Assets/Images/RentIcon";
// import BillIcon from "../Assets/Images/BillIcon";
// import TransportationIcon from "../Assets/Images/TransportationIcon";
// import InsuranceIcon1 from "../Assets/Images/InsuranceIcon1";
// import ShopingIcon from "../Assets/Images/ShopingIcon";
// import EntertainmentIcon from "../Assets/Images/EntertainmentIcon";
// import TaxesIcon from "../Assets/Images/TaxesIcon";
// import ClothingIcon from "../Assets/Images/ClothingIcon";
// import MedicalIcon from "../Assets/Images/MedicalIcon";
// import HousingIcon from "../Assets/Images/HousingIcon";
const localTimezone = localStorage.getItem("timezone");
export const TransactionTypeArray = ["Expense", "Income"];

export const DateFilterArray = [
  "Last 7 Days",
  "All time (Till - Today)",
  "Last 30 Days",
  "Last 12 Months",
  "Today",
  "Yesterday",
  "Tomorrow",
  "Last 28 Days",
  "Last 90 Days",
  "Last Calendar Year",
  "This Year (January - Today)",

  "Custom",
];
export const PaymentModeArray = ["Cash", "Online", "Debit Card", "Credit Card"];
export const TransactionCategoryArray = [
  "Others",
  "Rent",
  "Food",
  "Bill",
  "Utilities",
  "Transportation",
  "Insurance",
  "Shopping",
  "Entertainment",
  "Medical",
  "Housing",
  "Taxes",
  "Clothing",
  "Education",
];
export const StatusArray = ["Incomplete","Complete" ];

export const commonservices = {
  fnCheckValidationOfObject,
  getItem,
  getColorCode,
  // getColorIcon,
  getDaysName,
  createGuid,
  NewUTCFormat,
  BasicUTCTime,
  // getDecryptData,
  // setItem,
  getDayDateMonthTimeSeconds,
  getDayDateMonthTimeTransaction,
  SendTimeInFormat,
  getAgo,
  getDayDateMonthTimeWallet,
  getDayDateMonthTime,
  HidePassword,
  // getLoginUserData,
  getDateInFormat,
  getTimeInFormat,
  // getDecryptData,
  getDayDateMonth,
  getHeadersFromData,
  getHeaders,
  getDateMOnthFormat,
  getDateInFormatCustom,
  getDateTimeFormat,
  getShowDateTimeFormat,
  dateRangesFormat,
  // getAllUserData,s
};
const cryptoKey = "SqT_cL@SsRoOm_Pr@k@$h_393987";

export const AppConfigData = {
  CryptoKey: cryptoKey,
};
function dateRangesFormat(date) {
  if (date !== null && date !== "" && date !== undefined) {
    return moment(date).format("YYYY-MM-DD");
  }
}
function getColorCode(item) {
  if (item !== null && item !== "" && item !== undefined) {
    if (item === "Food") {
      return "#FADBD8"; // Pastel Pink
    } else if (item === "Utilities") {
      return "#AED6F1"; // Baby Blue Eyes
    } else if (item === "Others") {
      return "#F9E79F"; // Naples Yellow
    } else if (item === "Rent") {
      return "#D5DBDB"; // Silver Sand
    } else if (item === "Bill") {
      return "#E59866"; // Dark Terra Cotta
    } else if (item === "Transportation") {
      return "#85C1E9"; // Jordy Blue
    } else if (item === "Insurance") {
      return "#F7DC6F"; // Naples Yellow Crayola
    } else if (item === "Shopping") {
      return "#F1948A"; // Salmon Pink
    } else if (item === "Entertainment") {
      return "#AF7AC5"; // Light Slate Blue
    } else if (item === "Taxes") {
      return "#EAEDED"; // Platinum
    } else if (item === "Clothing") {
      return "#F5B041"; // Saffron
    } else if (item === "Medical") {
      return "#EC7063"; // Light Red
    } else if (item === "Housing") {
      return "#52BE80"; // Caribbean Green
    } else if (item === "Travel") {
      return "#58D68D"; // Light Green
    }
  }
}
// function getColorIcon(item) {
//   if (item !== null && item !== "" && item !== undefined) {
//     if (item === "Food") {
//       return <FoodIcon />;
//     } else if (item === "Utilities") {
//       return <UtilitiesIcon />; // Baby Blue Eyes
//     } else if (item === "Others") {
//       return <OthersIcon />; // Naples Yellow
//     } else if (item === "Rent") {
//       return <RentIcon />; // Silver Sand
//     } else if (item === "Bill") {
//       return <BillIcon />; // Dark Terra Cotta
//     } else if (item === "Transportation") {
//       return <TransportationIcon />; // Jordy Blue
//     } else if (item === "Insurance") {
//       return <InsuranceIcon1 />; // Naples Yellow Crayola
//     } else if (item === "Shopping") {
//       return <ShopingIcon />; // Salmon Pink
//     } else if (item === "Entertainment") {
//       return <EntertainmentIcon />; // Light Slate Blue
//     } else if (item === "Taxes") {
//       return <TaxesIcon />; // Platinum
//     } else if (item === "Clothing") {
//       return <ClothingIcon />; // Saffron
//     } else if (item === "Medical") {
//       return <MedicalIcon />; // Light Red
//     } else if (item === "Housing") {
//       return <HousingIcon />; // Caribbean Green
//     } else if (item === "Travel") {
//       return "#58D68D"; // Light Green
//     }
//   }
// }

function getDateTimeFormat(date) {
  if (date !== null && date !== "" && date !== undefined)
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  else return "";
}
function getShowDateTimeFormat(date) {
  if (date !== null && date !== "" && date !== undefined)
    return moment(date).format("DD-MM-YYYY HH:mm:ss A");
  else return "";
}

// custom Validation for All Fields
export function fnCheckValidationOfObject(obj) {
  let IsValid = true;
  if (obj?.errors !== null) {
    if (obj?.errors?.ValidationRules) {
      for (let i = 0; i < obj.errors.ValidationRules.length; i++) {
        obj.errors[obj.errors.ValidationRules[i].FieldName] = "";
      }

      for (let i = 0; i < obj.errors.ValidationRules.length; i++) {
        let objRules = obj.errors.ValidationRules[i];

        if (objRules !== null) {
          // Required validation :
          if (objRules.ValidationType.toLowerCase() === "required") {
            if (
              obj[objRules.FieldName] === "" ||
              obj[objRules.FieldName] === null ||
              obj[objRules.FieldName] === undefined
            ) {
              IsValid = false;
              obj.errors[objRules.FieldName] = objRules.ValidationMessage;
            }
          }

          if (
            obj[objRules.FieldName] !== "" &&
            obj[objRules.FieldName] !== null &&
            obj[objRules.FieldName] !== undefined
          ) {
            //  Range validation
            if (objRules.ValidationType.toLowerCase() === "range") {
              if (objRules.FieldName === "old_password") {
                if (obj.old_password.length < 6) {
                  IsValid = false;
                  obj.errors[objRules.FieldName] = objRules.ValidationMessage;
                }
              }
              if (objRules.FieldName === "new_password") {
                if (obj.new_password.length < 6) {
                  IsValid = false;
                  obj.errors[objRules.FieldName] = objRules.ValidationMessage;
                }
              }
            }

            // Masking Validation
            if (objRules.ValidationType.toLowerCase() === "mobile-mask") {
              // if (!obj[objRules.FieldName].toString().match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)) {
              if (!obj[objRules.FieldName].toString().match(/^[0-9]{10}$/)) {
                IsValid = false;
                obj.errors[objRules.FieldName] = objRules.ValidationMessage;
              }
            }

            // Email Validation
            if (
              obj.errors[objRules.FieldName] === "" &&
              objRules.ValidationType.toLowerCase() === "email"
            ) {
              var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
              if (!obj[objRules.FieldName].toString().match(mailformat)) {
                IsValid = false;
                obj.errors[objRules.FieldName] = objRules.ValidationMessage;
              }
            }

            //  Number validation
            if (
              objRules.ValidationType.toLowerCase() === "number" &&
              obj.errors[objRules.FieldName] === ""
            ) {
              var mailformat = /^[0-9]/;
              if (!obj[objRules.FieldName].toString().match(mailformat)) {
                IsValid = false;
                obj.errors[objRules.FieldName] = objRules.ValidationMessage;
              }
            }

            //  Compare Field Value

            if (
              obj.errors[objRules.FieldName] === "new_password" &&
              obj.errors[objRules.CompareFieldName] ===
                "confirm_new_password" &&
              objRules.ValidationType.toLowerCase() === "comparefieldvalue"
            ) {
              // var mailformat = /^[0-9]*$/;

              if (obj[objRules.FieldName] !== obj[objRules.CompareFieldName]) {
                IsValid = false;
                obj.errors[objRules.FieldName] = objRules.ValidationMessage;
              }
            }

            //date validation
            if (objRules.ValidationType.toLowerCase() === "date") {
              if (moment(obj[objRules.FieldName]) <= moment("1900-01-01")) {
                IsValid = false;
                obj.errors[objRules.FieldName] = objRules.ValidationMessage;
              }
            }
            if (objRules.ValidationType.toLowerCase() === "checkbox") {
              if (obj[objRules.FieldName].length === 0) {
                IsValid = false;
                obj.errors[objRules.FieldName] = objRules.ValidationMessage;
              }
            }
          }
        }
      }
    }
  }
  return { isValid: IsValid, obj: obj };
}

export function getItem(key) {
  let dataValues = localStorage.getItem(key) || "";
  return dataValues;
}

function getHeadersFromData() {
  return {
    // "Content-Type": "multipart/form-data",
    accept: "*/*",
    Authorization: "Bearer " + getItem("Token"),
  };
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: "Bearer " + getItem("Token"),
  };
}

// create Guid
function createGuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
}

// encrypt data
// Crypto convert for userdata
// function setItem(key, strString) {
//   let CryptoJS = require("crypto-js");
//   localStorage.setItem(key, CryptoJS.AES.encrypt(strString, cryptoKey));
// }
// decrypt data
// function getDecryptData(key) {
//   let CryptoJS = require("crypto-js");
//   let dataValues = localStorage.getItem(key) || "";
//   let dataStr = "";
//   if (dataValues !== "") {
//     var bytes = CryptoJS.AES.decrypt(dataValues, cryptoKey);
//     dataStr = bytes.toString(CryptoJS.enc.Utf8);
//   }
//   return dataStr;
// }

// get user data
// function getLoginUserData() {
//   var data = [];
//   let dtstr = getDecryptData("Userdata");
//   if (dtstr !== "") {
//     data = JSON.parse(dtstr);
//   }
//   return data;
// }

// get user data
// function getAllUserData() {
//   var data = [];
//   let dtstr = getDecryptData("AllUserData");
//   if (dtstr !== "") {
//     data = JSON.parse(dtstr);
//   }
//   return data;
// }

// date Format
function getDateInFormat(date) {
  if (date !== null && date !== "" && date !== undefined)
    return moment(date).format("DD/MM/yyyy");
  else return "";
}
function getDateInDDMMYYYY(date) {
  if (date !== null && date !== "" && date !== undefined)
    return moment(date).format("DD MMM YYYY");
  else return "";
}
function getDaysName(date) {
  // const date = getDateInDDMMYYYY(date)
  let today = getDateInFormat(new Date());

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let prevDay = getDateInFormat(yesterday);

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let nextDay = getDateInFormat(tomorrow);

  if (date === today) {
    return <>Today</>;
  } else if (date === nextDay) {
    return <>Tomorrow</>;
  } else if (date === prevDay) {
    return <>Yesterday</>;
  } else {
    return <>{date}</>;
  }
}
function getDateInFormatCustom(date, timezone, format) {
  if (date !== null && date !== "" && date !== undefined) {
    // if (date !== null && date !== "" && date !== undefined)
    //   return moment(date).format("HH:mm");
    // else return "";
    const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
    const localTimezone = localStorage.getItem("timezone");
    // Convert UTC time to local time
    const localTime = utcTime.tz(timezone == null ? localTimezone : timezone);
    // Format the local time as a string
    const formattedLocalTime = localTime.format(format);
    return formattedLocalTime;
  }
}

function getTimeInFormat(date) {
  if (date !== null && date !== "" && date !== undefined)
    return moment(date).format("DD-MM");
  else return "";
}

function getDayDateMonth(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
    const localTimezone = localStorage.getItem("timezone");
    const localTime = utcTime.tz(localTimezone);
    const formattedLocalTime = localTime.format("dddd DD MMM");
    return formattedLocalTime;
  }
}
function getDayDateMonthTime(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
    const localTimezone = localStorage.getItem("timezone");
    const localTime = utcTime.tz(localTimezone);
    const formattedLocalTime = localTime.format("dddd DD MMM | hh:mm A");
    return formattedLocalTime;
  }
}
function getDayDateMonthTimeSeconds(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
    const localTimezone = localStorage.getItem("timezone");
    const localTime = utcTime.tz(localTimezone);
    const formattedLocalTime = localTime.format("YYYY-MM-DD HH:mm:ss");
    return formattedLocalTime;
  }
}
function getDayDateMonthTimeWallet(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
    const localTimezone = localStorage.getItem("timezone");
    const localTime = utcTime.tz(localTimezone);
    const formattedLocalTime = localTime.format("ddd DD MMM | HH:mm");
    return formattedLocalTime;
  }
}
function getDayDateMonthTimeTransaction(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
    const localTimezone = localStorage.getItem("timezone");
    const localTime = utcTime.tz(localTimezone);
    const formattedLocalTime = localTime.format("dddd DD MMM YYYY | HH:mm");
    return formattedLocalTime;
  }
}
function NewUTCFormat(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const dateToConvert = new Date(date);
    const utcDate = new Date(
      dateToConvert.getUTCFullYear(),
      dateToConvert.getUTCMonth(),
      dateToConvert.getUTCDate(),
      dateToConvert.getUTCHours(),
      dateToConvert.getUTCMinutes(),
      dateToConvert.getUTCSeconds()
    );

    const utcDateString = utcDate.toISOString();

    return utcDateString;
  }
}
function BasicUTCTime(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const dateToConvert = new Date(date);
    const utcDate = new Date(
      Date.UTC(
        dateToConvert.getUTCFullYear(),
        dateToConvert.getUTCMonth(),
        dateToConvert.getUTCDate(),
        dateToConvert.getUTCHours(),
        dateToConvert.getUTCMinutes(),
        dateToConvert.getUTCSeconds()
      )
    );

    const utcTimeString = utcDate.toISOString().split("T")[1]; // Extracting only the time part
    return utcTimeString;
  }
}

function getAgo(date) {
  if (date !== null && date !== "" && date !== undefined) {
    const utcTime = moment.utc(date);
    const localTimezone = localStorage.getItem("timezone");
    const localTime = utcTime.tz(localTimezone);

    return moment(new Date(localTime)).fromNow();
  }
}
function SendTimeInFormat(date) {
  // if (date !== null && date !== "" && date !== undefined)
  //   return moment(date).format("HH:mm");
  // else return "";
  const utcTime = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
  const localTimezone = localStorage.getItem("timezone");
  // Convert UTC time to local time
  const localTime = utcTime.tz(localTimezone);
  // Format the local time as a string
  const formattedLocalTime = localTime.format("YYYY-MM-DD HH:mm:ss");
  return formattedLocalTime;
}
// date Format for body
function getDateMOnthFormat(date) {
  if (date !== null && date !== "" && date !== undefined)
    return moment(date).format("DD-MM");
  else return "";
}

// HidePassword
function HidePassword(password) {
  let str = "";
  if (password !== "" && password !== null && password !== undefined) {
    for (let i = 0; i < password.length; i++) {
      str = str + "*";
    }
  }
  return str;
}
