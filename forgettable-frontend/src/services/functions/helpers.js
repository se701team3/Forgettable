
import axios from 'axios';

const SERVER_URL = 'http://localhost:3001/api/';

export const getHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) return null;
  const headers = {Authorization: `${token}`};

  return headers;
};

const tokenExpired = (message) => {
  if (message === 'JWT has expired') {
    localStorage.removeItem('token');
    window.location.reload();
  }
};

export const getData = async (url, data) => {
  const response = await axios.get(
      `${SERVER_URL}${url}`,
      {
        headers: getHeaders(),
        ...(data && {params: data}),
      },
  ).catch((error) => {
    if (!error?.response) {
      throw new Error(
          'The server seems to be down :(  Try again later.',
      );
    }
    tokenExpired(error.response.data.message);
    throw new Error(`${error.response.data.message}`);
  });

  return response.data;
};


export const postData = async (url, data) => {
  const response = await axios.post(
      `${SERVER_URL}${url}`,
      data,
      {
        headers: getHeaders(),
      },
  )
      .catch((error) => {
        if (!error?.response) {
          throw new Error(
              'The server seems to be down :(  Try again later.',
          );
        }
        tokenExpired(error.response.data.message);
        throw new Error(`${error.response.data.message}`);
      });
  return response.data;
};

export const putData = async (url, data) => {
  const response = await axios.put(
      `${SERVER_URL}${url}`,
      data,
      {
        headers: getHeaders(),
      },
  )
      .catch((error) => {
        if (!error?.response) {
          throw new Error(
              'The server seems to be down :(  Try again later.',
          );
        }
        tokenExpired(error.response.data.message);
        throw new Error(`${error.response.data.message}`);
      });
  return response.data;
};
