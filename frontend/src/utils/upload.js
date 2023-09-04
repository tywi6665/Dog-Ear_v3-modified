import axios from "axios";

export const directUploadStart = ({ fileName, fileType }) => {
  console.log({ file_name: fileName, file_type: fileType });
  return axios.post("/api/v1/upload/direct/start/", {
    file_name: fileName,
    file_type: fileType,
  });
};

export const directUploadDo = ({ data, file }) => {
  const postData = new FormData();
  for (const key in data?.fields) {
    postData.append(key, data.fields[key]);
  }

  postData.append("file", file);

  let postParams = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Method": "POST, PUT, GET, DELETE",
  };

  // If we're uploading to S3, detach the authorization cookie.
  // Otherwise, we'll get CORS error from S3
  if (data?.fields) {
    postParams = {};
  }

  let newURL = data.url.split(".s3.");
  newURL[0] += ".s3.us-east-2.";
  newURL = newURL.join("");

  const PostDataWithParams = { ...Object.fromEntries(postData), ...postParams };

  console.log(data.url, Object.fromEntries(postData));
  return (
    axios
      .post(data.url, postData, postParams)
      // .post(newURL, {
      //   headers: postParams,
      //   body: postData,
      // })
      .then(() => Promise.resolve({ fileId: data.id }))
  );
};

export const directUploadFinish = ({ data }) => {
  return axios.post("/api/v1/upload/direct/finish/", { file_id: data.id });
};
