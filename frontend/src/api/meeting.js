import API from "./axios";


export const createMeeting = (data) => {
  return API.post("/meetings", data);
};




export const updateMeetingNotes = (id, notes) => {
  return API.put(
    `/meetings/${id}/notes`,
    {
      notes
    }
  );
};


export const getMyMeetings = () => {
  return API.get("/meetings");
};


export const getMeetingById = (id) => {
  return API.get(`/meetings/${id}`);
};


export const generateMeetingSummary = (id) => {
  return API.post(`/meetings/${id}/summary`);
};

export const joinMeeting = (meetingCode)=>{

return API.post(
"/meetings/join",
{
meetingCode
}
);

};

export const deleteMeeting = (id) => {

  return API.delete(
    `/meetings/${id}`
  );

};

export const updateMeeting = (id, data)=>{

return API.put(
`/meetings/${id}`,
data
);

};

export const askMeetingAI = (id, question)=>{

return API.post(
`/meetings/${id}/chat`,
{
question
}
);

};

export const uploadMeetingFile = async (meetingId, file) => {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );


  return API.post(
    `/meetings/${meetingId}/upload`,
    formData,
    {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }
  );

};