import API from "./axios";

// MEETING CRUD

// Create a new MeetMind meeting
export const createMeeting = (data) => {
  return API.post("/meetings", data);
};

// Get all meetings belonging to logged-in user
export const getMyMeetings = () => {
  return API.get("/meetings");
};

// Get one meeting by ID
export const getMeetingById = (id) => {
  return API.get(`/meetings/${id}`);
};

// Update an existing meeting
export const updateMeeting = (id, data) => {
  return API.put(`/meetings/${id}`, data);
};

// Delete a meeting
export const deleteMeeting = (id) => {
  return API.delete(`/meetings/${id}`);
};

// MEETING NOTES

export const updateMeetingNotes = (id, notes) => {
  return API.put(`/meetings/${id}/notes`, {
    notes,
  });
};

// JOIN EXISTING MEETING

export const joinMeeting = (meetingCode) => {
  return API.post("/meetings/join", {
    meetingCode,
  });
};

// AI

// Generate AI summary
export const generateMeetingSummary = (id) => {
  return API.post(`/meetings/${id}/summary`);
};

// Ask AI a question about the meeting
export const askMeetingAI = (id, question) => {
  return API.post(`/meetings/${id}/chat`, {
    question,
  });
};

// AI MEETING BOT
// User only needs to provide the Google Meet URL.
// Backend will find/create the MeetMind meeting.
//
// IMPORTANT:
// Do NOT pass meetingId from the frontend.
//

export const startMeetingBot = (meetingUrl) => {
  return API.post("/meeting-bot/join", {
    meetingUrl,
  });
};

// NYLAS NOTETAKER

export const saveMeetingNotetaker = (meetingId, notetakerId) => {
  return API.put(`/meetings/${meetingId}/notetaker`, {
    notetakerId,
  });
};

// RECORDING

export const getMeetingRecording = (meetingId) => {
  return API.get(`/meetings/${meetingId}/recording`);
};

// FILES

// Upload a document to a meeting
export const uploadMeetingFile = (meetingId, file) => {
  const formData = new FormData();

  formData.append("file", file);

  // return API.post(`/meetings/${meetingId}/upload`, formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });

  return API.post(`/meetings/${meetingId}/upload`, formData);
};

// Download an uploaded meeting file
export const downloadMeetingFile = (meetingId, fileId) => {
  return API.get(`/meetings/${meetingId}/files/${fileId}/download`, {
    responseType: "blob",
  });
};

// Delete an uploaded meeting file

export const deleteMeetingFile = (meetingId, fileId) => {
  return API.delete(`/meetings/${meetingId}/files/${fileId}`);
};
