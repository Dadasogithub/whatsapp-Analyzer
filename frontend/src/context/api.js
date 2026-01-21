const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    UPLOAD_CHAT: `${API_BASE_URL}/upload`,
}

export default API_BASE_URL;
