import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalURL = error.config;

    if (originalURL.url.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalURL._retry) {
      originalURL._retry = true;
      try {
        const role = originalURL.url.split("/")[1];
        await axios.post(
          `http://localhost:3000/api/v1/${role}/refresh-token`,
          {},
          { withCredentials: true },
        );
        return api(originalURL);
      } catch (refreshError) {
        console.log(refreshError);
        window.location.href = `/${role}/login`;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
