import axios from "axios";

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const titleCase = (str) => {
  if (str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  } else {
    return "";
  }
};

export const titleCaseArr = (arr) => {
  return arr.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
};

export const setAxiosAuthToken = (token) => {
  if (typeof token !== "undefined" && token) {
    // Apply for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const flattenIntoString = (arr) => {
  let str = "";
  if (arr.length) {
    JSON.parse(arr).forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        switch (typeof obj[key]) {
          case "string":
            if (obj[key].length && key === "header") {
              str += "--" + obj[key] + "\n";
            } else if (obj[key].length) {
              str += obj[key] + "\n";
            }
            break;
          case "object":
            if (Array.isArray(obj[key])) {
              obj[key].forEach((el) => (str += el + "\n"));
            }
            break;
        }
      });
    });
  }
  return str;
};

export const parseIngredients = (ingredients) => {
  const split = ingredients.split("\n").filter((el) => el.length);
  let parsedIngredients = [];
  const indexes = split
    .map((ingredient, index) => (ingredient.match(/--./g) ? index : -1))
    .filter((element) => element !== -1);
  if (indexes.length) {
    indexes.forEach((index, i) => {
      let obj = {};
      if (i == 0 && index !== 0) {
        obj["header"] = "";
        obj["content"] = split.slice(0, index);
        parsedIngredients.push(obj);
        obj = {};
      }
      obj["header"] = split[index].slice(2);
      obj["content"] = split.slice(index + 1, indexes[i + 1]);
      parsedIngredients.push(obj);
    });
  } else {
    let obj = {};
    obj["header"] = "";
    obj["content"] = split;
    parsedIngredients.push(obj);
  }

  return JSON.stringify(parsedIngredients);
};

export const testJSON = (text) => {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};
