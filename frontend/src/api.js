import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export function setAuthToken(token) {
  localStorage.setItem("token", token);
}

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export function setAuthToken(token) {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     localStorage.setItem("token", token);
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//     localStorage.removeItem("token");
//   }
// }

// export default api;
