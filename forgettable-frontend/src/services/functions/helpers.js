
import axios from 'axios';
import {authentication} from '../auth';
const SERVER_URL = 'http://localhost:3001/api/';

/**
 * This file contains all the helper functions that are used for
 * making API calls to the backend. All API calls should be made
 * through one of these functions for consistency and simplicity.
 *
 * Author: Mercury Lin (lin8231)
 */

export const getHeaders = async () => {
  const token = await authentication.currentUser.getIdToken();

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
        headers: await getHeaders(),
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

export const deleteData = async (url, data) => {
  const response = await axios.delete(
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
