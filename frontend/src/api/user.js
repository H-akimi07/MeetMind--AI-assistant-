// import API from "./axios";

// export const getProfile = () => API.get("/users/profile");

// export const updateProfile = (data) => API.put("/users/profile", data);

// export const changePassword = (data) => {
//   return API.put("/users/change-password", {
//     currentPassword: data.oldPassword,
//     newPassword: data.newPassword,
//   });
// };
// // export const uploadAvatar = (file) => {
// //   const formData = new FormData();

// //   formData.append("avatar", file);

// //   return API.put("/users/profile/avatar", formData);
// // };

// export const uploadAvatar = (formData) => {
//   return API.put("/users/profile/avatar", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

import API from "./axios";

export const getProfile = () => API.get("/users/profile");

export const updateProfile = (data) => API.put("/users/profile", data);

export const changePassword = (data) =>
  API.put("/users/change-password", {
    currentPassword: data.oldPassword,
    newPassword: data.newPassword,
  });

export const uploadAvatar = (file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  return API.put("/users/profile/avatar", formData);
};
