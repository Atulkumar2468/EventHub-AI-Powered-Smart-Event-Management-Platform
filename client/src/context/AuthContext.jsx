import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('eventhub_user') || 'null'),
  token: localStorage.getItem('eventhub_token') || null,
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START': return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      localStorage.setItem('eventhub_token', action.payload.token);
      localStorage.setItem('eventhub_user', JSON.stringify(action.payload));
      return { ...state, loading: false, user: action.payload, token: action.payload.token, error: null };
    case 'AUTH_ERROR': return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('eventhub_token');
      localStorage.removeItem('eventhub_user');
      return { ...initialState, user: null, token: null };
    case 'UPDATE_USER': return { ...state, user: { ...state.user, ...action.payload } };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await authAPI.login({ email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      return { success: false, error: msg };
    }
  };

  const register = async (formData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await authAPI.register(formData);
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      return { success: false, error: msg };
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
