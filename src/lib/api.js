const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Generic fetch wrapper for the Report Card API
 * @param {string} endpoint - The API endpoint (e.g., '/students')
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise<any>} - The response JSON
 */
async function fetchAPI(endpoint, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

// Specific API methods
export const api = {
  students: {
    list: () => fetchAPI('/students'),
    get: (id) => fetchAPI(`/students/${id}`),
    create: (data) => fetchAPI('/students', { method: 'POST', body: data }),
    getReportCard: (id) => fetchAPI(`/students/${id}/report-card`),
  },
  grades: {
    getByStudent: (studentId) => fetchAPI(`/grades/student/${studentId}`),
    add: (data) => fetchAPI('/grades', { method: 'POST', body: data }),
    update: (id, data) => fetchAPI(`/grades/${id}`, { method: 'PUT', body: data }),
  },
  attendance: {
    getByStudent: (studentId) => fetchAPI(`/attendance/student/${studentId}`),
    add: (data) => fetchAPI('/attendance', { method: 'POST', body: data }),
  },
  observedValues: {
    getByStudent: (studentId) => fetchAPI(`/observed-values/student/${studentId}`),
    add: (data) => fetchAPI('/observed-values', { method: 'POST', body: data }),
  },
  subjects: {
    list: () => fetchAPI('/subjects'),
    create: (data) => fetchAPI('/subjects', { method: 'POST', body: data }),
    delete: (id) => fetchAPI(`/subjects/${id}`, { method: 'DELETE' }),
  },
  accounts: {
    login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: credentials }),
    list: () => fetchAPI('/accounts'),
    create: (data) => fetchAPI('/accounts', { method: 'POST', body: data }),
    delete: (id) => fetchAPI(`/accounts/${id}`, { method: 'DELETE' }),
  }
};
