import API from "./axios";

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

// Update user-written meeting notes
export const updateMeetingNotes = (id, notes) => {
  return API.put(`/meetings/${id}/notes`, {
    notes,
  });
};

// Join an existing MeetMind meeting using meeting code
export const joinMeeting = (meetingCode) => {
  return API.post("/meetings/join", {
    meetingCode,
  });
};

// Generate AI summary from meeting notes/transcript
export const generateMeetingSummary = (id) => {
  return API.post(`/meetings/${id}/summary`);
};

// Ask AI a question about a meeting
export const askMeetingAI = (id, question) => {
  return API.post(`/meetings/${id}/chat`, {
    question,
  });
};

// Send MeetMind AI bot to a Google Meet
export const startMeetingBot = (meetingUrl) => {
  return API.post("/meeting-bot/join", {
    meetingUrl,
  });
};
// Save the Nylas Notetaker ID to a MeetMind meeting
export const saveMeetingNotetaker = (meetingId, notetakerId) => {
  return API.put(`/meetings/${meetingId}/notetaker`, {
    notetakerId,
  });
};

// Upload a file to a meeting
export const uploadMeetingFile = async (meetingId, file) => {
  const formData = new FormData();

  formData.append("file", file);

  // Download meeting file
  export const downloadMeetingFile = (meetingId, fileId) => {
    return API.get(`/meetings/${meetingId}/files/${fileId}/download`, {
      responseType: "blob",
    });
  };

  // Delete meeting file
  export const deleteMeetingFile = (meetingId, fileId) => {
    return API.delete(`/meetings/${meetingId}/files/${fileId}`);
  };

  return API.post(`/meetings/${meetingId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
