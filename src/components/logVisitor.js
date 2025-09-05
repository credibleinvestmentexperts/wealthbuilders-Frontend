import axios from "axios";

const logVisitor = async (page) => {
  try {
    console.log("Sending visitor log to backend:", page); // 👈 add this

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/visitors/all`, {
      page,
    });
  } catch (error) {
    console.error("Failed to log visitor:", error.message);
  }
};

export default logVisitor;
