import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://outreach-xeno.onrender.com',
  withCredentials: true,
});

// Auth
export const getMe = () => API.get('/auth/me');
export const logout = () => API.post('/auth/logout');
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Customers
export const getCustomers = (params) => API.get('/api/customers', { params });
export const getCustomerById = (id) => API.get(`/api/customers/${id}`);
export const createCustomer = (data) => API.post('/api/customers', data);
export const createCustomersBulk = (data) => API.post('/api/customers/bulk', data);
export const updateCustomer = (id, data) => API.put(`/api/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/api/customers/${id}`);
export const getCustomerStats = () => API.get('/api/customers/stats');

// Orders
export const getOrders = (params) => API.get('/api/orders', { params });
export const createOrder = (data) => API.post('/api/orders', data);
export const createOrdersBulk = (data) => API.post('/api/orders/bulk', data);
export const getOrderStats = () => API.get('/api/orders/stats');

// Segments
export const getSegments = () => API.get('/api/segments');
export const getSegmentById = (id) => API.get(`/api/segments/${id}`);
export const createSegment = (data) => API.post('/api/segments', data);
export const previewSegment = (data) => API.post('/api/segments/preview', data);
export const deleteSegment = (id) => API.delete(`/api/segments/${id}`);

// Campaigns
export const getCampaigns = () => API.get('/api/campaigns');
export const getCampaignById = (id) => API.get(`/api/campaigns/${id}`);
export const createCampaign = (data) => API.post('/api/campaigns', data);
export const sendCampaign = (id) => API.post(`/api/campaigns/${id}/send`);

// Analytics
export const getDashboardStats = () => API.get('/api/analytics/dashboard');
export const getRevenueTrend = () => API.get('/api/analytics/revenue-trend');
export const getRecentCallbacks = () => API.get('/api/analytics/recent-callbacks');

// AI
export const aiSegmentRules = (prompt) => API.post('/api/ai/segment-rules', { prompt });
export const aiGenerateMessage = (data) => API.post('/api/ai/message', data);
export const aiInsights = (data) => API.post('/api/ai/insights', data);
export const aiChat = (message, history) => API.post('/api/ai/chat', { message, history });

export default API;
