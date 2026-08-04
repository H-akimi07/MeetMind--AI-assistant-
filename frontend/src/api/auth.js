import API from "./axios";


export const loginUser = (data) => {

  return API.post("/auth/login", data);

};


export const registerUser = (data) => {

  return API.post("/auth/register", data);

};


export const getProfile = () => {

  return API.get("/users/profile");

};