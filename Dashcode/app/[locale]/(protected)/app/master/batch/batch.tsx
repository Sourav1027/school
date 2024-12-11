'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import Swal from 'sweetalert2';
import AddBatch from './addBatch';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface Batch {
  id: number;
  name: string;
  passingYear: string;
  schoolOpenDate: string;
  createdAt: string
}

const Batch: React.FC = () => {
  const [batch, setbatch] = useState<Batch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);


  // API headers configuration
  const token = localStorage.getItem("auth_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Fetch batch data
  const fetchBatch = async (
    page: number = 1,
    limit: number = 5,
    query: string = ''
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiurl}v1/batch?page=${page}&limit=${limit}&search=${query}`,
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
        passingYear: item.passingYear,
        schoolOpenDate: item.schoolOpenDate,
        createdAt: item.createdAt,

      }));

      setbatch(formattedData);
      setTotalRecords(data.total); // Set total records for pagination
    } catch (error) {
      console.error('Error fetching batch:', error);
      Swal.fire('Error', 'Failed to fetch batch', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch(currentPage, parseInt(recordsPerPage), searchQuery);
  }, [currentPage, recordsPerPage, searchQuery]);

  const handleAddBatch = () => {
    setIsDialogOpen(true);
    setSelectedBatch(null); // Reset selected batch for adding a new batch
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchBatch(currentPage, parseInt(recordsPerPage), searchQuery); // Refresh after adding
  };

  const handleEditBatch = (batch: Batch) => {
    setIsDialogOpen(true);
    setSelectedBatch(batch); // Pass selected batch data for editing
  };

  const handleDeleteBatch = async (batchId: number) => {
    const token = localStorage.getItem("auth_token");

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this batch?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiurl}v1/batch/${batchId}`, {
          method: 'DELETE',
          headers: headers,
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'The batch has been deleted.', 'success');
          fetchBatch(currentPage, parseInt(recordsPerPage), searchQuery); // Refresh after deletion
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
      {/* Header Section */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Batch Management</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search batch..."
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
            <Button
              className="bg-green-500 hover:bg-green-600 text-white font-montserrat"
              onClick={handleAddBatch}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Batch
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
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Batch Name</TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Passing Year </TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">School Open Date </TableHead>
              <TableHead className="py-4 text-center px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Create Date</TableHead>
              <TableHead className="w-[100px] text-center py-4 px-6 text-gray-700 font-semibold border-b font-montserrat">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 font-montserrat">Loading... </TableCell>
              </TableRow>
            ) : batch.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 font-montserrat">
                  No batch found
                </TableCell>
              </TableRow>
            ) : (
              batch.map((batch, index) => (
                <TableRow
                  key={batch.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell className="py-4 px-6 text-center border-r font-medium text-gray-900 font-montserrat">
                    {(currentPage - 1) * parseInt(recordsPerPage) + index + 1}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{batch.name}</TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{batch.passingYear}</TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{batch.schoolOpenDate}</TableCell>
                  <TableCell className="py-4 px-6 text-center border-r text-gray-700 font-montserrat">{batch.createdAt}</TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex justify-center gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 hover:bg-blue-50 text-blue-600 font-montserrat"
                        onClick={() => handleEditBatch(batch)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-50 text-red-600 font-montserrat"
                        onClick={() => handleDeleteBatch(batch.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
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

      {/* Add Batch Dialog */}
      <AddBatch isOpen={isDialogOpen} onClose={handleCloseDialog}   selectedBatch={selectedBatch} />
    </div>
  );
};

export default Batch;
