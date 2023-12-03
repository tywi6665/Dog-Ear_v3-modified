import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  // scrapeRecipe,
  setTaskID,
  setScrapingStatus,
  setUniqueID,
  setScrapedRecipe,
  setUrl,
  setHadError,
} from "../../reducers/scrapedRecipeSlice";

let statusInterval = 1;

export const connect = (type, url, user, dispatch) => {
  if (type === "blank") {
    set_ScrapedRecipe(
      {
        unique_id: uuidv4(),
        url: "",
        title: "",
        author: "",
        description: "",
        has_made: false,
        img_src: "",
        notes: [],
        rating: 0,
        tags: [],
        ingredients: "",
        steps: "",
        timestamp: Date.now(),
      },
      dispatch
    );
  } else {
    startScrape(url, user, dispatch);
  }
};

export const disconnect = (
  type,
  unique_id,
  hadError,
  setEntryType,
  setIsSubmitted,
  dispatch
) => {
  if (hadError == true) {
    set_HadError(false);
  } else if (type === "scrape") {
    // delete_ScrapedRecipe(unique_id);
  }
  set_ScrapedRecipe({}, dispatch);
  set_TaskID("", dispatch);
  set_ScrapingStatus("", dispatch);
  set_UniqueID("", dispatch);
  set_pastedUrl("", dispatch);
  setEntryType("");
  setIsSubmitted(false);
};

async function startScrape(url, user, dispatch) {
  if (!url || !user) {
    return false;
  }
  let unique_id = uuidv4();
  // const entryAdded = createDBEntry(unique_id, url);
  // if (entryAdded) {
  set_UniqueID(unique_id, dispatch);
  const response = await axios
    .post("/api/v1/scraper/", {
      headers: {
        "Content-Type": "application/json",
      },
      body: { method: "POST", unique_id: unique_id, url: url, user: user },
    })
    .then((response) => response.data)
    .then((data) => {
      set_TaskID(data.task_id, dispatch);
      set_ScrapingStatus(data.status, dispatch);
      statusInterval = setInterval(
        () => checkScrapeStatus(data.task_id, unique_id, url, user, dispatch),
        2000
      );
    })
    .catch((error) => console.error("Error:", error));
  // } else {
  //   return false;
  // }
}

async function checkScrapeStatus(task_id, unique_id, url, user, dispatch) {
  const data = {
    method: "GET",
    task_id: task_id,
    unique_id: unique_id,
    user: user,
  };
  // Making a request to server to ask status of crawling job
  const response = await axios
    .post("/api/v1/scraper/", {
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
    .then((response) => {
      // console.log(response);
      if (response.data.hasOwnProperty("data")) {
        clearInterval(statusInterval);
        set_ScrapingStatus("finished", dispatch);
        set_ScrapedRecipe(response.data.data, dispatch);
      } else if (response.error) {
        console.log(response.error);
        clearInterval(statusInterval);
        set_ScrapingStatus("finished", dispatch);
        set_HadError(true, dispatch);
        let newID = uuidv4();
        set_ScrapedRecipe(
          {
            unique_id: newID,
            url: url,
            title: "",
            author: "",
            description: "",
            has_made: false,
            img_src: "",
            notes: [],
            rating: 0,
            tags: [],
            ingredients: "",
            steps: "",
            timestamp: Date.now(),
          },
          dispatch
        );
      } else if (response.status) {
        set_ScrapingStatus("Pending", dispatch);
      }
    });
}

// async function createDBEntry(unique_id, url) {
//   await axios
//     .post("/api/v1/scrapedrecipe/", { unique_id: unique_id, url: url })
//     .then((res) => {
//       console.log("Blank DB entry successfully added");
//       return true;
//     })
//     .catch((error) => {
//       console.log(error);
//       return false;
//     });
// }

// export const delete_ScrapedRecipe = (id) => {
//   axios
//     .delete(`/api/v1/scrapedrecipe/${id}/`)
//     .then((res) => {
//       console.log(`ScrapedRecipeItem for ${id} was successfully deleted`);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

export const set_TaskID = (id, dispatch) => {
  dispatch(setTaskID(id));
};

export const set_ScrapingStatus = (status, dispatch) => {
  dispatch(setScrapingStatus(status));
};

export const set_UniqueID = (id, dispatch) => {
  dispatch(setUniqueID(id));
};

export const set_HadError = (error, dispatch) => {
  dispatch(setHadError(error));
};

export const set_ScrapedRecipe = (recipe, dispatch) => {
  dispatch(setScrapedRecipe(recipe));
};

export const set_pastedUrl = (url, dispatch) => {
  dispatch(setUrl(url));
};
