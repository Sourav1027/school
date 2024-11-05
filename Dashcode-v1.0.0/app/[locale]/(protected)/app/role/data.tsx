// Define interfaces for our data structure
interface TableData {
    id: number;
    roleName: string;
    status: 'active' | 'inactive';
    date: string;
  }
  
  import React, { useState, useEffect } from 'react';
  import { Pencil, Trash2 } from 'lucide-react';
  
  const Data: React.FC = () => {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async (): Promise<void> => {
      try {
        // Replace with your API endpoint
        const response = await fetch('YOUR_API_ENDPOINT');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    const handleEdit = (id: number): void => {
      console.log('Edit clicked for id:', id);
      // Add your edit logic here
    };
  
    const handleDelete = (id: number): void => {
      console.log('Delete clicked for id:', id);
      // Add your delete logic here
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      );
    }
  
    return (
      <div className="p-6">
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Serial No</th>
                <th className="px-6 py-3">Role Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">No Data Found</span>
                      <span className="text-gray-400 text-sm mt-1">There are no records to display</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item: TableData, index: number) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{item.roleName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
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