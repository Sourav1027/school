import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

export interface StudentData {
    // Define the full student data interface based on your schema
    id?: string;
    grNumber: string;
    firstName: string;
    lastName: string;
    // ... other fields from your schema
}

export const StudentService = {
    async createStudent(studentData: StudentData) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(`${apiUrl}v1/student`, studentData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    async updateStudent(studentId: string, studentData: StudentData) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.put(`${apiUrl}v1/student/${studentId}`, studentData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    },

    async getStudentById(studentId: string) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${apiUrl}v1/student/${studentId}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching student:', error);
            throw error;
        }
    },

    async listStudents(params?: { 
        page?: number, 
        limit?: number, 
        search?: string 
    }) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${apiUrl}v1/students`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error listing students:', error);
            throw error;
        }
    }
};