const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function for making API calls
const makeApiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.responseMessages || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Quote API
export const quoteAPI = {
  getAllQuotes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `/quotes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await makeApiCall(endpoint, { method: 'GET' });
  },

  getQuoteById: async (id) => {
    return await makeApiCall(`/quotes/${id}`, { method: 'GET' });
  },

  createQuote: async (quoteData) => {
    return await makeApiCall('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  likeQuote: async (id) => {
    return await makeApiCall(`/quotes/${id}/like`, { method: 'POST' });
  },

  unlikeQuote: async (id) => {
    return await makeApiCall(`/quotes/${id}/unlike`, { method: 'POST' });
  },

  getRandomQuotes: async (count = 10, category = null) => {
    const queryParams = new URLSearchParams();
    queryParams.append('count', count);
    if (category) queryParams.append('category', category);
    
    return await makeApiCall(`/quotes/random?${queryParams.toString()}`, { method: 'GET' });
  }
};

// User API
export const userAPI = {
  login: async (credentials) => {
    const response = await makeApiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {},
    });

    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  },

  register: async (userData) => {
    return await makeApiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {},
    });
  },

  getProfile: async () => {
    return await makeApiCall('/user/profile', { method: 'GET' });
  }
};

export default { quoteAPI, userAPI };