const API_BASE_URL = "http://localhost:5000/api";

function getAuthToken() {
    return window.AISaksharaAuth?.getToken() || localStorage.getItem('token') || sessionStorage.getItem('token');
}

async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);
    
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error('Unable to connect to AI-Sakshara services. Please try again.');
    }

    let result = {};
    try {
        result = await response.json();
    } catch (error) {
        if (response.ok) throw new Error('Unable to process the response. Please try again.');
    }

    if (response.status === 401) {
        window.AISaksharaAuth?.clearSession();
        window.location.replace('login.html?expired=1');
        throw new Error('Your session has expired. Please sign in again.');
    }
    if (!response.ok) {
        const message = response.status >= 500
            ? 'Unable to connect to AI-Sakshara services. Please try again.'
            : result.message || 'Unable to complete your request. Please try again.';
        throw new Error(message);
    }
    return result;
}

// Authentication
const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);
const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);

// Prediction
const predictAwareness = (data) => apiRequest('/prediction/awareness', 'POST', data);
const getPredictionHistory = () => apiRequest('/prediction/history', 'GET');
const saveSafetyScore = (score) => apiRequest('/safety/score', 'POST', { score });

// NLP & AI
const translateText = (text, sourceLanguage, targetLanguage) => 
    apiRequest('/nlp/translate', 'POST', { text, sourceLanguage, targetLanguage });
const askAI = (question, language) => apiRequest('/ai/ask', 'POST', { question, language });

// General
const getDashboard = () => apiRequest('/dashboard', 'GET');
const getLessons = (lang) => apiRequest(`/lessons?language=${lang}`, 'GET');
const getQuiz = (lang) => apiRequest(`/quiz?language=${lang}`, 'GET');
const submitQuiz = (data) => apiRequest('/quiz/submit', 'POST', data);
const getQuizHistory = () => apiRequest('/quiz/history', 'GET');
const getCertificates = () => apiRequest('/certificates', 'GET');
