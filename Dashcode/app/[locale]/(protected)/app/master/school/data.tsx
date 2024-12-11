'use client'
import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

// Update the interface to match AddSchoolForm data
interface SchoolData {
  id: number;
  schoolId: string;
  schoolCode: string;
  name: string;
  address: string;
  principalName: string;
  contactNo: string;
  landlineNo?: string;
  email: string;
  medium: 'english' | 'hindi' | 'both';
  board: 'cbse' | 'icse' | 'state' | 'ib' | 'igcse' | 'up' | 'bihar' | 'mp';
}

const Data = () => {
  const [data, setData] = useState<SchoolData[]>([]);
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

  const filteredData = data.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="mt-4 text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-gray-900 font-montserrat">
          School Records
        </div>
        <div className="flex-none">
          <input
            type="text"
            placeholder="Search by school name..."
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
              <th className="px-6 py-3 font-montserrat">S.No</th>
              <th className="px-6 py-3 font-montserrat">School ID</th>
              <th className="px-6 py-3 font-montserrat">School Code</th>
              <th className="px-6 py-3 font-montserrat">School Name</th>
              <th className="px-6 py-3 font-montserrat">Address</th>
              <th className="px-6 py-3 font-montserrat">Principal</th>
              <th className="px-6 py-3 font-montserrat">Contact Info</th>
              <th className="px-6 py-3 font-montserrat">Medium</th>
              <th className="px-6 py-3 font-montserrat">Board</th>
              <th className="px-6 py-3 font-montserrat">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium font-montserrat">
                      No Schools Found
                    </span>
                    <span className="text-gray-400 text-sm mt-1 font-montserrat">
                      There are no school records to display
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((school, index) => (
                <tr key={school.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium font-montserrat">{index + 1}</td>
                  <td className="px-6 py-4 font-montserrat">{school.schoolId}</td>
                  <td className="px-6 py-4 font-montserrat">{school.schoolCode}</td>
                  <td className="px-6 py-4 font-montserrat">{school.name}</td>
                  <td className="px-6 py-4 font-montserrat">{school.address}</td>
                  <td className="px-6 py-4 font-montserrat">{school.principalName}</td>
                  <td className="px-6 py-4 font-montserrat">
                    <div className="flex flex-col">
                      <span>{school.contactNo}</span>
                      {school.landlineNo && (
                        <span className="text-gray-400 font-montserrat">{school.landlineNo}</span>
                      )}
                      <span className="text-gray-400 font-montserrat">{school.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-montserrat">
                      {school.medium}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-montserrat">
                      {school.board.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(school.id)}
                        className="text-gray-600 hover:text-gray-900 font-montserrat"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(school.id)}
                        className="text-blue-600 hover:text-blue-900 font-montserrat"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="text-red-600 hover:text-red-900 font-montserrat"
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