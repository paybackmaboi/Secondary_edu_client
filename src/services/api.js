import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                config.headers['x-user-id'] = userData.id;
                // Future: Add JWT token here
                // config.headers['Authorization'] = `Bearer ${userData.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// ============================================
// STUDENTS API - All endpoints available ✅
// ============================================
export const studentsAPI = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    getReportCard: (id) => api.get(`/students/${id}/report-card`),
};

// ============================================
// GRADES API - All endpoints available ✅
// ============================================
export const gradesAPI = {
    getByStudent: (studentId) => api.get(`/grades/student/${studentId}`),
    create: (data) => api.post('/grades', data),
    update: (id, data) => api.put(`/grades/${id}`, data),
    delete: (id) => api.delete(`/grades/${id}`),
};

// ============================================
// ATTENDANCE API - All endpoints available ✅
// ============================================
export const attendanceAPI = {
    getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
    create: (data) => api.post('/attendance', data),
    update: (id, data) => api.put(`/attendance/${id}`, data),
    delete: (id) => api.delete(`/attendance/${id}`),
};

// ============================================
// OBSERVED VALUES API - All endpoints available ✅
// ============================================
export const observedValuesAPI = {
    getByStudent: (studentId) => api.get(`/observed-values/student/${studentId}`),
    create: (data) => api.post('/observed-values', data),
    update: (id, data) => api.put(`/observed-values/${id}`, data),
    delete: (id) => api.delete(`/observed-values/${id}`),
};

// ============================================
// SUBJECTS API - All endpoints available ✅
// ============================================
export const subjectsAPI = {
    getAll: () => api.get('/subjects'),
    getById: (id) => api.get(`/subjects/${id}`),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    delete: (id) => api.delete(`/subjects/${id}`),
};

// ============================================
// ACCOUNTS API - All endpoints available ✅
// ============================================
export const accountsAPI = {
    getAll: () => api.get('/accounts'),
    getById: (id) => api.get(`/accounts/${id}`),
    create: (data) => api.post('/accounts', data),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`),
};

// ============================================
// ANALYTICS API - For Super Admin Dashboard ✅
// ============================================
export const analyticsAPI = {
    getDashboardStats: () => api.get('/analytics/dashboard-stats'),
    getStudentDistribution: () => api.get('/analytics/student-distribution'),
    getGradePerformance: () => api.get('/analytics/grade-performance'),
    getAttendanceTrend: (year) => api.get(`/analytics/attendance-trend?year=${year || new Date().getFullYear()}`),
    getGradeDistribution: () => api.get('/analytics/grade-distribution'),
};

// ============================================
// REPORTS API - For Reports Module ✅
// ============================================
export const reportsAPI = {
    getClassSummary: (params) => api.get('/reports/class-summary', { params }),
    getGradeAnalytics: (params) => api.get('/reports/grade-analytics', { params }),
    getAttendanceSummary: (params) => api.get('/reports/attendance-summary', { params }),
};

// ============================================
// AUTHENTICATION API ✅
// ============================================
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
};
