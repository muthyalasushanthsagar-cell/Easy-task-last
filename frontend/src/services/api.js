import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  getAll: (params) => api.get('/tasks', { params }).then((res) => res.data),
  getById: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  create: (data) => api.post('/tasks', data).then((res) => res.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  complete: (id) => api.patch(`/tasks/${id}/complete`).then((res) => res.data),
  reopen: (id) => api.patch(`/tasks/${id}/reopen`).then((res) => res.data),
  getToday: () => api.get('/tasks/today').then((res) => res.data),
  getUpcoming: () => api.get('/tasks/upcoming').then((res) => res.data),
  getCompleted: () => api.get('/tasks/completed').then((res) => res.data),
  getOverdue: () => api.get('/tasks/overdue').then((res) => res.data),
};

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary').then((res) => res.data),
};

export const groceryApi = {
  getLists: () => api.get('/grocery-lists').then((res) => res.data),
  getListById: (id) => api.get(`/grocery-lists/${id}`).then((res) => res.data),
  createList: (data) => api.post('/grocery-lists', data).then((res) => res.data),
  updateList: (id, data) => api.put(`/grocery-lists/${id}`, data).then((res) => res.data),
  deleteList: (id) => api.delete(`/grocery-lists/${id}`).then((res) => res.data),
  addItem: (listId, data) => api.post(`/grocery-lists/${listId}/items`, data).then((res) => res.data),
  updateItem: (itemId, data) => api.put(`/grocery-lists/items/${itemId}`, data).then((res) => res.data),
  toggleItem: (itemId) => api.patch(`/grocery-lists/items/${itemId}/toggle`).then((res) => res.data),
  deleteItem: (itemId) => api.delete(`/grocery-lists/items/${itemId}`).then((res) => res.data),
};

export const notificationApi = {
  getAll: () => api.get('/notifications').then((res) => res.data),
  getUnreadCount: () => api.get('/notifications/unread-count').then((res) => res.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => api.patch('/notifications/read-all').then((res) => res.data),
};

export default api;
