import { env } from 'process';

export interface Section { 
  id: string; 
  name: string; 
} 
 
export interface ClassInfo { 
  id: string; 
  name: string; 
} 

export interface Division {
  id: string;
  name: string;
}
 
export class ApiService { 
  private static apiurl = process.env.NEXT_PUBLIC_SITE_URL || '';

  // Create headers with authentication
  private static getHeaders(): Headers {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
    
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Generic method to handle fetch requests
  private static async fetchData<T>(endpoint: string): Promise<T[]> {
    try {
      const response = await fetch(`${this.apiurl}v1/${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item: any) => ({
        id: item._id,
        name: item.name
      }));
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  }

  // Method for fetching sections 
  static async fetchSections(): Promise<Section[]> { 
    return this.fetchData<Section>('section');
  } 
 
  // Method for fetching classes 
  static async fetchClasses(): Promise<ClassInfo[]> { 
    return this.fetchData<ClassInfo>('class');
  }

  // Method for fetching divisions
  static async fetchDivisions(): Promise<Division[]> {
    return this.fetchData<Division>('division');
  }

  // Helper method to check if user is authenticated
  static isAuthenticated(): boolean {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("auth_token");
      return !!token; // Returns true if token exists, false otherwise
    }
    return false;
  }

  // Method to handle login and store token
  static login(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem("auth_token", token);
    }
  }

  // Method to handle logout and remove token
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token");
    }
  }
}