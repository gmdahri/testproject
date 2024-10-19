import axios from "./axios-instance.js";
import { useAsyncFn } from "react-use";

const makeRequest = async (method, url, data = {}, config = {}) => {
  switch (method.toUpperCase()) {
    case "GET":
      return await axios.get(url, config);
    case "PUT":
      return await axios.put(url, data, config);
    case "POST":
      return await axios.post(url, data, config);
    case "DELETE":
      return await axios.delete(url, config);
    case "PATCH":
      return await axios.patch(url, data, config);
    default:
      throw new Error("Unsupported request method");
  }
};

const useAxios = () => {
  const [{ loading, error, value }, fetch] = useAsyncFn(
    async (method, url, data = {}, config = {}) => {
      return await makeRequest(method, url, data, config);
    }
  );

  return { loading, error, value, fetch };
};

export default useAxios;
