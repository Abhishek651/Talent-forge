import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  withCredentials: true,
});

/**
 * @function getResumeDetails
 * @description fetch user resume details from db
 * @returns {Promise<Object>} - The fetched resume data
 */

export const getResumeDetails = async()=>{
  try{
    console.log('req received in profile api')
    const response = await api.get("/my-resume/get-details");
    console.log(response.data.data);
    return response.data.data;
  }catch(err){
    console.error("Error fetching resume details:", err);
    res.status(500).json({
      message: "Error fetching resume details",
      success: false
    })
  }
}



/**
 * @function submitResumeDetails
 * @description submit user resume details to db
 * @returns {Promise<Object>} - The fetched resume data
 */

export const submitResumeDetails = async(data)=>{
  try{
    console.log('req received in submit profile api')
    await api.post("/my-resume/save-details",data);
    console.log('submitted successfully');
  }catch(err){
    console.error("Error submitting resume details:", err);
    res.status(500).json({
      message: "Error submitting resume details",
      success: false
    })
  }
}