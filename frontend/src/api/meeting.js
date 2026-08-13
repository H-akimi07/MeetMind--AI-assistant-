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

// Update user-written meeting notes
export const updateMeetingNotes = (id, notes) => {
  return API.put(`/meetings/${id}/notes`, {
    notes,
  });
};

// JOIN MEETING

// Join an existing MeetMind meeting using meeting code
export const joinMeeting = (meetingCode) => {
  return API.post("/meetings/join", {
    meetingCode,
  });
};

// AI

// Generate AI summary from meeting notes,
// transcripts, and uploaded documents
export const generateMeetingSummary = (id) => {
  return API.post(`/meetings/${id}/summary`);
};

// Ask AI a question about a meeting
export const askMeetingAI = (id, question) => {
  return API.post(`/meetings/${id}/chat`, {
    question,
  });
};

// AI MEETING BOT

// Send MeetMind AI bot to a Google Meet
export const startMeetingBot = (meetingUrl) => {
  return API.post("/meeting-bot/join", {
    meetingUrl,
  });
};

// NYLAS NOTETAKER

// Save the Nylas Notetaker ID to a MeetMind meeting
export const saveMeetingNotetaker = (meetingId, notetakerId) => {
  return API.put(`/meetings/${meetingId}/notetaker`, {
    notetakerId,
  });
};

// FILES

// Upload a document to a meeting
// Supported by backend: PDF, DOCX, TXT
export const uploadMeetingFile = (meetingId, file) => {
  const formData = new FormData();

  formData.append("file", file);

  return API.post(`/meetings/${meetingId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete an uploaded meeting file
export const deleteMeetingFile = (meetingId, fileId) => {
  return API.delete(`/meetings/${meetingId}/files/${fileId}`);
};
