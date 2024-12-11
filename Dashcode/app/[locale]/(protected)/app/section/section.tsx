'use client'
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, MagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddClass from './addclass';
import AddSection from './addSection';
import axios from 'axios';
import { Pencil, TrashIcon } from 'lucide-react';

interface SectionSetup {
  txnId: string;
  sectionId: string;
  classId: string;
  divisionId: string;
  sectionName: string;
  className: string;
  batchName: string;
  divisionName: string;
  subjectDetails: { subjectId: string; subjectName: string; orderBy: number }[];
  createdAt: string;
  updatedAt: string;
}
interface EditSectionSetup {
  txnId: string;
  sectionId: string;
  classId: string;
  divisionId: string;
  subject: { subjectId: string; orderBy: number }[];
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const Section: React.FC = () => {
  const [sectionSetups, setSectionSetups] = useState<SectionSetup[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editData, setEditData] = useState<EditSectionSetup | null>(null);

  // API Configuration
  const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const token = localStorage.getItem("auth_token");

  // Fetch Section Setups
  const fetchSectionSetups = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}v1/sectionSetup`, {
        params: { page, limit, search },
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const { data, total, page: currentPage, limit: currentLimit, totalPages } = response.data;

      setSectionSetups(data);
      setPaginationMeta({
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages
      });
    } catch (error) {
      console.error('Error fetching section setups:', error);
      alert('Unable to load section setups');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSectionSetups();
  }, []);

  // Handlers for dialogs
  const handleAddSection = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddClass = () => {
    setEditData(null);
    setIsAddClassDialogOpen(true);
  };

  const handleCloseAddClassDialog = () => {
    setIsAddClassDialogOpen(false);
    setEditData(null);
  };

  // Pagination and Search Handlers
  const handlePageChange = (newPage: number) => {
    fetchSectionSetups(newPage, paginationMeta.limit, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchSectionSetups(1, paginationMeta.limit, query);
  };

  const handleRecordsPerPageChange = (limit: string) => {
    fetchSectionSetups(1, parseInt(limit), searchQuery);
  };

  // Add/Update Class Submit Handler
  const handleAddClassSubmit = () => {
    // Refresh data after adding or updating a class
    fetchSectionSetups(paginationMeta.page, paginationMeta.limit, searchQuery);
  };


  const groupBySectionName = (data: SectionSetup[]) => {
    return data.reduce((acc: any, curr) => {
      const { sectionName, className, divisionName, subjectDetails = [], } = curr;

      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push({
        classDivision: `${className} - ${divisionName}`,
        subjects: subjectDetails.map((detail) => detail.subjectName), // Extract subject names
      });

      return acc;
    }, {});
  };

  // Edit Handler
  const handleUpdate = (item: SectionSetup) => {
    // Prepare edit data in the format expected by AddClass component
    const editDataFormatted = {
      txnId: item.txnId,
      sectionId: item.sectionId,
      classId: item.classId,
      divisionId: item.divisionId,
      subject: item.subjectDetails?.map(s => ({
        subjectId: s.subjectId,
        orderBy: s.orderBy
      })) ||[]
    };

      setEditData(editDataFormatted);
      setIsAddClassDialogOpen(true);
    };

  // Delete Handler
  const handleDelete = async (item: SectionSetup) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete section setup for ${item.sectionName}?`);
    if (confirmDelete) {
      try {
        await axios.delete(`${apiUrl}v1/sectionSetup/${item.txnId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        alert('Section setup deleted successfully');
        // Refresh the list, adjusting page if needed
        const newTotalItems = paginationMeta.total - 1;
        const newTotalPages = Math.ceil(newTotalItems / paginationMeta.limit);
        const pageToFetch = paginationMeta.page > newTotalPages 
          ? newTotalPages 
          : paginationMeta.page;
  
        fetchSectionSetups(pageToFetch, paginationMeta.limit, searchQuery);
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Failed to delete the section setup');
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm mt-3">
      {/* Header Section */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Section List</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search class..."
              className="pl-10 w-[250px] bg-white border-gray-200 shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Select
            value={paginationMeta.limit.toString()}
            onValueChange={handleRecordsPerPageChange}
          >
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
            className="h-8 text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white mr-2"
            onClick={handleAddSection}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Section
          </Button>
          <Button
            className="h-8 text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleAddClass}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] py-4 px-6 text-gray-700 font-semibold border-b border-r">Sr No</TableHead>
              <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r">Section Name</TableHead>
              <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r">Class & Division</TableHead>
              <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r">Subjects</TableHead>
              <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : sectionSetups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">No section setups found</TableCell>
              </TableRow>
            ) : (
              Object.entries(groupBySectionName(sectionSetups)).map(
                ([sectionName, groupedData]: any, sectionIndex) => (
                  <React.Fragment key={sectionName}>
                    {groupedData.map((item: any, index: number) => (
                      <TableRow
                        key={`${sectionName}-${index}`}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        {index === 0 && (
                          <>
                            <TableCell rowSpan={groupedData.length}
                              className="py-4 px-6 text-center border-r font-medium text-gray-600">{sectionIndex + 1}</TableCell>
                            <TableCell rowSpan={groupedData.length}
                              className="py-4 px-6 border-r text-gray-700">{sectionName}</TableCell>
                          </>
                        )}
                        <TableCell className="py-4 px-6 border-r">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {item.classDivision}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 border-r text-gray-700">
                          <div className="flex flex-wrap items-center gap-2">
                            {(item.subjects || []).map((subject: string, idx: number) => (
                              <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-600 hover:bg-blue-500 text-blue-600 font-montserrat"
                              onClick={() => handleUpdate(sectionSetups.find(s => s.sectionName === sectionName)!)}
                              >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 hover:bg-red-500 text-red-600 font-montserrat"
                              onClick={() => handleDelete(sectionSetups.find(s => s.sectionName === sectionName)!)}
                              >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600 font-montserrat">
          Showing {Math.min((paginationMeta.page - 1) * paginationMeta.limit + 1, paginationMeta.total)} to{' '}
          {Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)} of {paginationMeta.total} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={paginationMeta.page === 1}
            onClick={() => handlePageChange(paginationMeta.page - 1)}
            className="border-gray-200 text-gray-600 font-montserrat"
          >
            ← Previous
          </Button>
          {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1).map(pageNum => (
            <Button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`${paginationMeta.page === pageNum
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'border-gray-200 text-gray-600'
                } font-montserrat`}
              variant={paginationMeta.page === pageNum ? 'default' : 'outline'}
            >
              {pageNum}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={paginationMeta.page === paginationMeta.totalPages}
            onClick={() => handlePageChange(paginationMeta.page + 1)}
            className="border-gray-200 text-gray-600 font-montserrat"
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddClass
        isOpen={isAddClassDialogOpen}
        onClose={handleCloseAddClassDialog}
        onAddClass={handleAddClassSubmit}
        editData={editData}
      />
      <AddSection
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Section;