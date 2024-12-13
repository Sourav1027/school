'use client'
import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

interface StudentData {
  txnId: string;
  grNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  studentClassDivision: {
    class: string;
    section: string;
    roleNumber: number;
  }[];
  gender: string;
  phoneNumber: string;
  email: string;
  studentParents: {
    type: string;
    name: string;
    phone: string;
  }[];
}

const Data = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('auth_token');
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${apiUrl}v1/students`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        
        const studentsData = await response.json();
        
        // Ensure data is an array and sanitize
        const sanitizedData = Array.isArray(studentsData.data) 
          ? studentsData.data.map((student: { txnId: any; grNumber: any; firstName: any; middleName: any; lastName: any; studentClassDivision: any; gender: any; phoneNumber: any; email: any; studentParents: any; }) => ({
              txnId: student.txnId || '',
              grNumber: student.grNumber || '',
              firstName: student.firstName || '',
              middleName: student.middleName || '',
              lastName: student.lastName || '',
              studentClassDivision: student.studentClassDivision || [],
              gender: student.gender || '',
              phoneNumber: student.phoneNumber || '',
              email: student.email || '',
              studentParents: student.studentParents || []
            }))
          : [];

        setData(sanitizedData);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setData([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleView = (txnId: string) => {
    console.log('View clicked for ID:', txnId);
  };

  const handleEdit = (txnId: string) => {
    console.log('Edit clicked for ID:', txnId);
  };

  const handleDelete = (txnId: string) => {
    console.log('Delete clicked for ID:', txnId);
  };

  // Safe filtering with additional null checks
  const filteredData = data.filter(student => 
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-4 text-lg font-medium text-gray-700">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-gray-900">
          Students Records
        </div>
        <div className="flex-none">
          <input
            type="text"
            placeholder="Search by Student name..."
            className="px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">GR No</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Class</th>
              <th className="px-6 py-3">Section</th>
              <th className="px-6 py-3">Role No</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Father Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (  
              <tr>
                <td colSpan={11} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      No Student Found
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      There are no Students records to display
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((student, index) => (
                <tr key={student.txnId} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">{student.grNumber}</td>
                  <td className="px-6 py-4">
                    {student.firstName}{student.lastName}
                  </td>
                  <td className="px-6 py-4">
                    {student.studentClassDivision[0]?.class || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {student.studentClassDivision[0]?.section || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {student.studentClassDivision[0]?.roleNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">{student.phoneNumber}</td>
                  <td className="px-6 py-4">
                    {student.studentParents.find(parent => parent.type === 'Father')?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(student.txnId)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Student Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(student.txnId)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Student"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.txnId)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Student"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Data;