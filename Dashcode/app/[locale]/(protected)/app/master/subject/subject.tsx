'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Swal from 'sweetalert2';
import AddSubject from './addsubject';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface Subject {
  id: number;
  name: string;
  abbreviation: string;
  subjectType: string;
  markingType: string;
  createdAt: string;
}

const Subject: React.FC = () => {
  const [subjects, setsubjects] = useState<Subject[]>([]); // Renamed from `class` to `subjects`
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // API headers configuration
  const token = localStorage.getItem("auth_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Fetch classes data
  const fetchSubjects = async (
    page: number = 1,
    limit: number = 5,
    query: string = ''
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiurl}v1/subject?page=${page}&limit=${limit}&search=${query}`,
        {
          method: 'GET',
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedData = data.data.map((item: any) => ({
        id: item.txnId,
        name: item.name,
        abbreviation: item.abbreviation,
        subjectType: item.subjectType,
        markingType: item.markingType,
        createdAt: item.createdAt,
      }));

      setsubjects(formattedData);
      setTotalRecords(data.total); // Set total records for pagination
    } catch (error) {
      console.error('Error fetching subjects:', error);
      Swal.fire('Error', 'Failed to fetch subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects(currentPage, parseInt(recordsPerPage), searchQuery);
  }, [currentPage, recordsPerPage, searchQuery]);

  const handleAddClass = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchSubjects(currentPage, parseInt(recordsPerPage), searchQuery); // Refresh after adding
  };

  const handleDeleteClass = async (subjectId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this class?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiurl}v1/Subject/${subjectId}`, {
          method: 'DELETE',
          headers: headers,
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'The class has been deleted.', 'success');
          fetchSubjects(currentPage, parseInt(recordsPerPage), searchQuery); // Refresh after deletion
        } else {
          throw new Error('Failed to delete class');
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        Swal.fire('Error', 'Failed to delete the class.', 'error');
      }
    }
  };

  const totalPages = Math.ceil(totalRecords / parseInt(recordsPerPage));

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm mt-3">
      {/* Header Section */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Subject List</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search class..."
              className="pl-10 w-[250px] bg-white border-gray-200 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Select value={recordsPerPage} onValueChange={(value) => setRecordsPerPage(value)}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
                <SelectValue placeholder="Records per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 records per page</SelectItem>
                <SelectItem value="10">10 records per page</SelectItem>
                <SelectItem value="20">20 records per page</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-montserrat" onClick={handleAddClass}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] text-center py-4 px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Sr No </TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Subject Name</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Abbreviation</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Subject Type</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Marking Type</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Create Date</TableHead>
              <TableHead className="w-[100px] text-center py-4 px-6 text-gray-700 font-semibold border-b font-montserrat">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 font-montserrat">Loading...</TableCell>
              </TableRow>
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 font-montserrat">No Subject found</TableCell>
              </TableRow>
            ) : (
              subjects.map((subjectItem, index) => (
                <TableRow key={subjectItem.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="py-4 px-6 text-center border-r  text-gray-700 font-montserrat">
                    {(currentPage - 1) * parseInt(recordsPerPage) + index + 1}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center border-r  text-gray-700 font-montserrat">{subjectItem.name} </TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{subjectItem.abbreviation} </TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{subjectItem.subjectType} </TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{subjectItem.markingType} </TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{subjectItem.createdAt}</TableCell>
                  <TableCell className="py-4 px-6 font-montserrat">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 hover:bg-red-50 text-red-600 font-montserrat"
                      onClick={() => handleDeleteClass(subjectItem.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600 font-montserrat">
          Showing {Math.min((currentPage - 1) * parseInt(recordsPerPage) + 1, totalRecords)} to{' '}
          {Math.min(currentPage * parseInt(recordsPerPage), totalRecords)} of {totalRecords} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="border-gray-200 text-gray-600 font-montserrat"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              className={i + 1 === currentPage ? 'bg-blue-500 text-white' : 'border-gray-200 text-gray-600 font-montserrat'}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            className="border-gray-200 text-gray-600 font-montserrat"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Add Class Dialog */}
      <AddSubject isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default Subject;