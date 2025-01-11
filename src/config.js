const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://df-challenge.onrender.com"
    : "http://localhost:4000";

export default BASE_URL;
