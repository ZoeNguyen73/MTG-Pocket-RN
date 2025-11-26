import axios from "axios";
const BASE_URL = "http://192.168.0.238:3000/api/v1";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json"},
});