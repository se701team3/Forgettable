import {getData, postData, putData} from './functions/helpers';

import axios from 'axios';

const TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYxZDU2YTI1MWU0ZGRhM2Y0NWM0MWZkNWQ0ZGEwMWQyYjlkNzJlMGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZm9yZ2V0dGFibGUtNzhiOTYiLCJhdWQiOiJmb3JnZXR0YWJsZS03OGI5NiIsImF1dGhfdGltZSI6MTY0NzM0Njg3OSwidXNlcl9pZCI6IlJnUFNjSnlqZWFic3ZBT3dnMEdJS2pTa1g0NjIiLCJzdWIiOiJSZ1BTY0p5amVhYnN2QU93ZzBHSUtqU2tYNDYyIiwiaWF0IjoxNjQ3MzQ2ODc5LCJleHAiOjE2NDczNTA0NzksImVtYWlsIjoiYWRhbS5hLndpZW5lckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRhbS5hLndpZW5lckBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.VF5ink9jNcy4whXW-Fj4BmeAg0uLBWwYlAA9nJHgXM4XomwCGxhZy0KdfB6JtZvU9zlnyTc-4qgKTH0xmMLWv9-o-aX6QsojyBuZxT5hSIIi7h5QWbBYOX-T2Og0AegQ4UzSqx2z3-xcJDkD-GXE6cSiupD-Xi2XmkRvAEVns1E0cHVvqUvEQDAV1Bcq6mh4CNy-R3295EPNs6O0m3EO5XhTn0YfCpvLKzpJ04F7ApitgeXnbADgsEQJPaDkyJ1Q3XoVmQeXFXbfqdwRB3orvM80B7uqsKDozce17W5oYF6o1j2xQwORw2XX_fTU88U9WWI-U_uouwEqRB3e7VMQJA';


export const getPerson = async (id) => {
  return await getData('persons/' + id);
};

export const getAllPersons = async () => {
  return await getData('persons');
};

export const getUser = async () => {
  return await getData('users');
};

export const createPerson = async (person) => {
  return await postData('persons', person);
};

export const updatePerson = async (id, person) => {
  return await putData('persons/' + id, person);
};
