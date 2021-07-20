const axios = require("axios");
const token = process.env.API_KEY;

axios.interceptors.request.use((request) => {
  // console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

axios.validateStatus = (status) => {
  return status < 500; // Resolve only if the status code is less than 500
};

const del = (userId) => {
  return axios.delete(`https://gorest.co.in/public/v1/users/${userId}`);
};

const get = (userId) => {
  return axios.get(`https://gorest.co.in/public/v1/users/${userId}`);
};

const getAll = (page = 1) => {
  return axios.get(`https://gorest.co.in/public/v1/users`, {
    params: {
      page,
    },
  });
};

const post = ({ name, gender, email, status }) => {
  return axios.post(
    `https://gorest.co.in/public/v1/users`,
    {
      name,
      gender,
      email,
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    }
  );
  // response.status
  // response.data
};

const put = ({ name, email, status }) => {
  return axios.put(`https://gorest.co.in/public/v1/users`, {
    name,
    email,
    status,
  });
};

module.exports = {
  getAll,
  get,
  post,
  put,
  del,
};
