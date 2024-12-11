'use client'
import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

// Update the interface to match AddSchoolForm data
interface StudentData {
  id: number;
  grNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  class: string;
  dob: string;
  fatherName: string;
  contactNo: string;
}

const Data = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools');
        if (!response.ok) throw new Error('Failed to fetch schools');
        const schoolsData = await response.json();
        setData(schoolsData);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleView = (id: number) => {
    console.log('View clicked for ID:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit clicked for ID:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete clicked for ID:', id);
  };

  const filteredData = data.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="absolute top-50  left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-0 text-lg font-medium text-gray-700">Loading...</span>
      </div>
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
              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Class</th>
              <th className="px-6 py-3">Section</th>
              <th className="px-6 py-3">Father Name</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (  
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
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
                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">{student.grNumber}</td>
                  <td className="px-6 py-4">{student.firstName}</td>
                  <td className="px-6 py-4">{student.lastName}</td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">{student.class}</td>
                  <td className="px-6 py-4">{student.dob}</td>
                  <td className="px-6 py-4">{student.fatherName}</td>
                  <td className="px-6 py-4">{student.contactNo}</td>
               
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(student.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
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