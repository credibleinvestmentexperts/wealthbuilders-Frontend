import axios from "axios";

const logVisitor = async (page) => {
  try {
    const ipResponse = await axios.get("https://api.ipify.org?format=json"); // fetch IP
    const ip = ipResponse.data.ip;

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/visitors/all`, {
      page,
      ip,
    });
  } catch (error) {
    console.error("Failed to log visitor:", error.message);
  }
};

export default logVisitor;
