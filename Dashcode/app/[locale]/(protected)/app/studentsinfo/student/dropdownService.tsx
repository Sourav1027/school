import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

export interface DropdownOption {
    value: string;
    label: string;
}

export const DropdownService = {
    async getClasses(): Promise<DropdownOption[]> {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${apiUrl}v1/class`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.map((item: any) => ({
                value: item.id.toString(),
                label: `Class ${item.name}`
            }));
        } catch (error) {
            console.error('Error fetching classes:', error);
            return [];
        }
    },

    async getSections(): Promise<DropdownOption[]> {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${apiUrl}v1/section`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.map((item: any) => ({
                value: item.id.toString(),
                label: item.name
            }));
        } catch (error) {
            console.error('Error fetching sections:', error);
            return [];
        }
    },

    async getDivisions(): Promise<DropdownOption[]> {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${apiUrl}v1/division`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.map((item: any) => ({
                value: item.id.toString(),
                label: item.name
            }));
        } catch (error) {
            console.error('Error fetching divisions:', error);
            return [];
        }
    },

    async getBatches(): Promise<DropdownOption[]> {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${apiUrl}v1/batch`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.map((item: any) => ({
                value: item.id.toString(),
                label: item.name
            }));
        } catch (error) {
            console.error('Error fetching batches:', error);
            return [];
        }
    }
};