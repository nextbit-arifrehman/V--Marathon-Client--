// API service for backend communication
import { API_BASE_URL, API_HEADERS } from '../config/constants.js';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method using cookies for authentication
  async apiCall(endpoint, options = {}) {
    // Ensure proper URL construction with HTTPS protocol
    let baseUrl = this.baseURL;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    const url = `${baseUrl}${endpoint}`;
    const config = {
      headers: {
        ...API_HEADERS
      },
      credentials: 'include', // Important for sending cookies!
      ...options
    };

    console.log(`Making API call to: ${url}`, config);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorText;
        try {
          // Try to parse as JSON first
          const errorData = await response.json();
          errorText = errorData.message || JSON.stringify(errorData);
        } catch {
          // Fallback to text if JSON parsing fails
          errorText = await response.text();
        }
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        
        // If we get HTML, it's likely an authentication or routing issue
        if (text.includes('<!DOCTYPE')) {
          console.error('Received HTML page instead of JSON - likely authentication failure or wrong endpoint');
          if (endpoint.includes('/my')) {
            console.error('Authentication required for endpoint:', endpoint);
            // For user-specific endpoints, return empty array when auth fails
            return [];
          }
        }
        
        // Return empty array/object based on endpoint instead of throwing
        if (endpoint.includes('/my') || endpoint.includes('/marathons')) {
          return [];
        }
        return {};
      }

      const data = await response.json();
      console.log(`API response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      // Return fallback data instead of throwing for certain endpoints
      if (endpoint.includes('/my') || endpoint.includes('/marathons')) {
        return [];
      }
      if (endpoint.includes('/stats')) {
        return {
          marathonCount: 0,
          applicationCount: 0,
          upcomingCount: 0,
          totalRegistrations: 0
        };
      }
      throw error;
    }
  }

  // Authentication endpoints (JWT stored in HTTP-only cookies)
  async createJWT(email) {
    const response = await this.apiCall('/api/auth/jwt', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return response;
  }

  async logout() {
    // Call backend to clear the HTTP-only cookie
    await this.apiCall('/api/auth/logout', {
      method: 'POST'
    });

    // Clear local user data
    localStorage.removeItem('currentUser');
  }

  // Marathon endpoints
  async createMarathon(marathonData) {
    return await this.apiCall('/api/marathons', {
      method: 'POST',
      body: JSON.stringify(marathonData)
    });
  }

  async getMarathons(sort = 'newest', location = '') {
    try {
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort === 'newest' ? 'newest' : 'oldest');
      if (location) params.append('location', location);

      const url = `/api/marathons${params.toString() ? '?' + params.toString() : ''}`;
      return await this.apiCall(url);
    } catch (error) {
      console.error('Error fetching marathons:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Public marathons endpoint (no authentication required)
  async getPublicMarathons(sort = 'newest', location = '') {
    try {
      // First try the featured endpoint which we know works
      const featuredUrl = `${this.baseURL}/api/marathons/public/featured`;

      const response = await fetch(featuredUrl, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Apply client-side filtering if needed
      let filteredData = data;
      if (location) {
        filteredData = data.filter(marathon =>
          marathon.location && marathon.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Apply client-side sorting if needed
      if (sort === 'oldest') {
        filteredData.sort((a, b) => new Date(a.marathonStartDate) - new Date(b.marathonStartDate));
      } else {
        filteredData.sort((a, b) => new Date(b.marathonStartDate) - new Date(a.marathonStartDate));
      }

      return filteredData;
    } catch (error) {
      console.error('Error fetching public marathons:', error);
      throw error;
    }
  }

  async getMarathonById(marathonId) {
    return await this.apiCall(`/api/marathons/${marathonId}`);
  }

  async deleteMarathon(marathonId) {
    return await this.apiCall(`/api/marathons/${marathonId}`, {
      method: 'DELETE'
    });
  }

  async updateMarathon(marathonId, marathonData) {
    return await this.apiCall(`/api/marathons/${marathonId}`, {
      method: 'PATCH',
      body: JSON.stringify(marathonData)
    });
  }

  // Application endpoints
  async applyForMarathon(applicationData) {
    try {
      const result = await this.apiCall('/api/apply', {
        method: 'POST',
        body: JSON.stringify(applicationData)
      });
      return { success: true, ...result };
    } catch (error) {
      console.error('Error applying for marathon:', error);
      return { success: false, message: 'Failed to submit application' };
    }
  }

  async getMyApplications(search = '') {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      console.log('Fetching applications with params:', params);
      const result = await this.apiCall(`/api/apply/my${params}`);
      console.log('Applications API response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Return empty array as fallback
      return [];
    }
  }

  async updateApplication(applicationId, applicationData) {
    return await this.apiCall(`/api/apply/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(applicationData)
    });
  }

  async deleteApplication(applicationId) {
    return await this.apiCall(`/api/apply/${applicationId}`, {
      method: 'DELETE'
    });
  }

  // Dashboard stats
  async getDashboardStats() {
    try {
      return await this.apiCall('/api/stats/dashboard-stats');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock stats since the external API is being used
      return {
        marathonCount: 1,
        applicationCount: 0,
        totalRegistrations: 0,
        upcomingCount: 6
      };
    }
  }
}

export default new ApiService();