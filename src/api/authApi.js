import api from "./config";

// Auth API functions
export const authApi = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Auth API error:", error);

      // Handle network errors
      if (error.code === "ECONNABORTED") {
        throw {
          success: false,
          message:
            "Request timeout - server is not responding. Please check if the server is running.",
        };
      }

      if (error.code === "ERR_NETWORK") {
        throw {
          success: false,
          message:
            "Network error - cannot reach server at " + api.defaults.baseURL,
        };
      }

      if (error.code === "ECONNREFUSED") {
        throw {
          success: false,
          message:
            "Connection refused - server is not running. Please start the backend server.",
        };
      }

      // Handle response errors
      if (error.response) {
        throw (
          error.response.data || {
            success: false,
            message: "Login failed",
          }
        );
      }

      // Generic error handling
      throw {
        success: false,
        message: error.message || "Login failed",
      };
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Get user error:", error);
      throw (
        error.response?.data || {
          success: false,
          message: "Failed to fetch user",
        }
      );
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default api;
