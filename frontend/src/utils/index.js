import axios from "axios";
import { parseIngredient } from "parse-ingredient";

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

// export const flattenIntoString_OLD = (arr) => {
//   let str = "";
//   if (arr.length) {
//     JSON.parse(arr).forEach((obj) => {
//       Object.keys(obj).forEach((key) => {
//         switch (typeof obj[key]) {
//           case "string":
//             if (obj[key].length && key === "header") {
//               str += "--" + obj[key] + "\n";
//             } else if (obj[key].length) {
//               str += obj[key] + "\n";
//             }
//             break;
//           case "object":
//             if (Array.isArray(obj[key])) {
//               obj[key].forEach((el) => (str += el + "\n"));
//             }
//             break;
//         }
//       });
//     });
//   }
//   return str;
// };

export const flattenIntoString = (arr) => {
  let str = "";
  if (arr.length) {
    JSON.parse(arr).forEach((obj) => {
      if (obj.isGroupHeader) {
        str += "--";
      }
      if (obj.quantity) {
        str += obj.quantity;
        if (obj.quantity2) {
          str += "-" + obj.quantity2 + " ";
        } else {
          str += " ";
        }
      }
      if (obj.unitOfMeasure) {
        str += obj.unitOfMeasure + " ";
      }
      if (obj.description) {
        str += obj.description;
      }
      str += "\n";
    });
  }
  return str;
};

// export const parseIngredients_OLD = (ingredients) => {
//   const split = ingredients.split("\n").filter((el) => el.length);
//   let parsedIngredients = [];
//   const indexes = split
//     .map((ingredient, index) => (ingredient.match(/--./g) ? index : -1))
//     .filter((element) => element !== -1);
//   if (indexes.length) {
//     indexes.forEach((index, i) => {
//       let obj = {};
//       if (i == 0 && index !== 0) {
//         obj["header"] = "";
//         obj["content"] = split.slice(0, index);
//         parsedIngredients.push(obj);
//         obj = {};
//       }
//       obj["header"] = split[index].slice(2);
//       obj["content"] = split.slice(index + 1, indexes[i + 1]);
//       parsedIngredients.push(obj);
//     });
//   } else {
//     let obj = {};
//     obj["header"] = "";
//     obj["content"] = split;
//     parsedIngredients.push(obj);
//   }

//   return JSON.stringify(parsedIngredients);
// };

export const stringify = (str, type) => {
  let parsed = [];
  if (type === "ingredients" && str.length) {
    parsed = parseIngredient(str);
    parsed.forEach((ingredient) => {
      if (ingredient.description.slice(0, 2) === "--") {
        ingredient.isGroupHeader = true;
        ingredient.description = ingredient.description.slice(2);
      }
      //  else {
      //   let isPresent = false;
      //   let i = 0;
      //   while (!isPresent) {
      //     console.log(
      //       ingredient.description,
      //       commonIngredientsList[i],
      //       ingredient.description.includes(commonIngredientsList[i])
      //     );
      //     if (ingredient.description.includes(commonIngredientsList[i])) {
      //       isPresent = true;
      //       ingredient.ingredient = commonIngredientsList[i];
      //     } else {
      //       i++;
      //     }
      //   }
      // }
      // console.log(parsed);
    });
  } else if (type === "steps" && str.length) {
    parsed = str.split("\n").filter((el) => el.length);
    parsed.forEach((step, i) => {
      let obj = {};
      if (step.slice(0, 2) === "--") {
        obj.isGroupHeader = true;
        obj.description = step.slice(2);
      } else {
        obj.isGroupHeader = false;
        obj.description = step;
      }
      parsed[i] = obj;
    });
  }
  return JSON.stringify(parsed);
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
