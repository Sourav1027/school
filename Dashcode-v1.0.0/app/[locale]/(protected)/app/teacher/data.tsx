import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface TeacherData {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  joiningDate: string;
  qualification: string;
  status: 'active' | 'inactive' | 'on-leave';
}

const TeacherTable = () => {
  const [data, setData] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const teachersData = await response.json();
        setData(teachersData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
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
        <div className="flex-1 text-xl font-medium text-gray-900">
          Teacher Records
        </div>
        <div className="flex-none">
          <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

    <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Teacher ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Qualification</th>
              <th className="px-6 py-3">Joining Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      No Teachers Found
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      There are no teacher records to display
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((teacher, index) => (
                <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">{teacher.teacherId}</td>
                  <td className="px-6 py-4">{teacher.name}</td>
                  <td className="px-6 py-4">{teacher.email}</td>
                  <td className="px-6 py-4">{teacher.phone}</td>
                  <td className="px-6 py-4">{teacher.subject}</td>
                  <td className="px-6 py-4">{teacher.qualification}</td>
                  <td className="px-6 py-4">
                    {new Date(teacher.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        teacher.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : teacher.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(teacher.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(teacher.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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

export default TeacherTable;