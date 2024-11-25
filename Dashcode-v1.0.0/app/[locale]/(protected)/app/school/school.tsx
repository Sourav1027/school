'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Swal from 'sweetalert2';
import AddSchoolForm from './addSchoolForm';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface School {
  id:number;
  txnId: number;  // Updated to match API response
  schoolCode: string;
  name: string;   // Updated from schoolName
  principleName: string;
  contact: string;
  medium: string;
  board: string;
  state: string;
  email: string;
  landline: string;
  createdAt: string;
  updatedAt: string;
  principleSign: string;
  address: any[];
}

interface ApiResponse {
  data: School[];
  total: number;
  page: string;
  limit: string;
  totalPages: number;
}

const School: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Updated fetch schools function to match API response structure
  const fetchSchools = async (page: number = 1, limit: number = 5, query: string = '') => {
    const token = localStorage.getItem("auth_token");
    try {
      setLoading(true);
      const response = await fetch(
        `${apiurl}v1/school?page=${page}&limit=${limit}&search=${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      setSchools(result.data);
      setTotalRecords(result.total);

    } catch (error) {
      console.error('Error fetching schools:', error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to fetch schools',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSchools(currentPage, parseInt(recordsPerPage), searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, recordsPerPage, searchQuery]);

  const handleAddSchool = () => {
    setIsDialogOpen(true);
    setSelectedSchool(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchSchools(currentPage, parseInt(recordsPerPage), searchQuery);
  };

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setIsDialogOpen(true);
  };

  const handleDeleteSchool = async (schoolId: number) => {
    const token = localStorage.getItem("auth_token");

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this school?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      try {
        console.log(`Deleting school with ID: ${schoolId}`);
        const response = await fetch(`${apiurl}v1/school/${schoolId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'The batch has been deleted.', 'success');
          fetchSchools(currentPage, parseInt(recordsPerPage), searchQuery); // Refresh after deletion
        } else {
          throw new Error('Failed to delete batch');
        }
      } catch (error) {
        console.error('Error deleting batch:', error);
        Swal.fire('Error', 'Failed to delete the batch.', 'error');
      }
    }
  };

  const totalPages = Math.ceil(totalRecords / parseInt(recordsPerPage));

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm mt-3">
      {/* ... Header Section (same as before) ... */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">School Management</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search school..."
              className="pl-10 w-[250px] bg-white border-gray-200 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Select value={recordsPerPage} onValueChange={setRecordsPerPage}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
                <SelectValue placeholder="Records per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 records per page</SelectItem>
                <SelectItem value="10">10 records per page</SelectItem>
                <SelectItem value="20">20 records per page</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleAddSchool}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add School
            </Button>
          </div>
        </div>
      </div>
      {/* Updated Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] text-center py-4 px-6 text-gray-700 font-semibold border-b border-r">Sr No</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">School Code</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">School Name</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">Principal Name</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">Contact</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">Landline</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">Email</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r">Created At</TableHead>
              <TableHead className="w-[100px] text-center py-4 px-6 text-gray-700 font-semibold border-b">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No schools found
                </TableCell>
              </TableRow>
            ) : (

              schools.map((school, index) => {
                console.log('School:', school); // Log the full school object to ensure it contains 'id'
                return (
                  <TableRow
                    key={school.txnId}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <TableCell className="py-4 px-6 text-center border-r font-medium text-gray-900">
                      {(currentPage - 1) * parseInt(recordsPerPage) + index + 1}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.schoolCode}</TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.name}</TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.principleName}</TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.contact}</TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.landline}</TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.email}</TableCell>
                    <TableCell className="py-4 px-6 text-center border-r text-gray-700">{school.createdAt}</TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 hover:bg-blue-50 text-blue-600"
                          onClick={() => handleEditSchool(school)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 hover:bg-red-50 text-red-600"

                          onClick={() => {
                            console.log('Attempting to delete school with ID:', school.txnId); // Check the ID value
                            handleDeleteSchool(school.txnId);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}

          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * parseInt(recordsPerPage) + 1, totalRecords)} to{' '}
          {Math.min(currentPage * parseInt(recordsPerPage), totalRecords)} of {totalRecords} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="border-gray-200 text-gray-600"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant="outline"
              className={i + 1 === currentPage ? 'bg-blue-500 text-white' : 'border-gray-200 text-gray-600'}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            className="border-gray-200 text-gray-600"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Add/Edit School Dialog */}
      <AddSchoolForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedSchool={selectedSchool}
      />
    </div>
  );
};

export default School;