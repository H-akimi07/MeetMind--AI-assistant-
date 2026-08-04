import axios from "axios";


const MeetingAPI = axios.create({

  baseURL: "http://localhost:5000/api/meetings",

});


MeetingAPI.interceptors.request.use((config)=>{

  const token = localStorage.getItem("token");


  if(token){

    config.headers.Authorization = `Bearer ${token}`;

  }


  return config;

});


export default MeetingAPI;