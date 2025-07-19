const API_URL = 'http://localhost:5000/api';

// Helper to get auth header
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// User API calls
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Invalid credentials');
  }
  
  return data;
};

// Item API calls
export const getItems = async () => {
  const response = await fetch(`${API_URL}/items`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch items');
  }
  
  return data;
};

export const getItemById = async (id) => {
  const response = await fetch(`${API_URL}/items/${id}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch item');
  }
  
  return data;
};

export const createItem = async (itemData) => {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(itemData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create item');
  }
  
  return data;
};

export const updateItem = async (id, itemData) => {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(itemData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update item');
  }
  
  return data;
};

export const deleteItem = async (id) => {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete item');
  }
  
  return data;
};

// Bid API calls
export const createBid = async (bidData) => {
  const response = await fetch(`${API_URL}/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(bidData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to place bid');
  }
  
  return data;
};

export const getBidsByItem = async (itemId) => {
  const response = await fetch(`${API_URL}/bids/item/${itemId}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bids');
  }
  
  return data;
};

export const getUserBids = async () => {
  const response = await fetch(`${API_URL}/bids/user`, {
    headers: authHeader(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch your bids');
  }
  
  return data;
};