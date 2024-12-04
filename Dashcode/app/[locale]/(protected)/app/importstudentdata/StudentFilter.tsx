import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { Section, ClassInfo, Division } from './apiservice';

interface StudentFilterProps {
  onApplyFilters: (filters: {
    section?: string;
    class?: string;
    division?: string;
  }) => void;
  onClose: () => void;
}

export const StudentFilter: React.FC<StudentFilterProps> = ({ 
  onApplyFilters, 
  onClose 
}) => {
  const [filters, setFilters] = useState({
    section: '',
    class: '',
    division: ''
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Direct API fetch with console logging
        const fetchSectionsDirectly = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}v1/section`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem("auth_token") || ''}`
                }
              });
  
              if (!response.ok) {
                throw new Error(`Sections HTTP error! status: ${response.status}`);
              }
  
              const responseData = await response.json();
              console.log('Raw Sections Data:', responseData);
  
              return responseData.data.map((item: any) => ({
                id: item.txnId,
                name: item.name
              }));
            } catch (error) {
              console.error('Direct Sections Fetch Error:', error);
              return [];
            }
          };
  
          const fetchClassesDirectly = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}v1/class`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem("auth_token") || ''}`
                }
              });
  
              if (!response.ok) {
                throw new Error(`Classes HTTP error! status: ${response.status}`);
              }
  
              const responseData = await response.json();
              console.log('Raw Classes Data:', responseData);
  
              return responseData.data.map((item: any) => ({
                id: item.txnId,
                name: item.name
              }));
            } catch (error) {
              console.error('Direct Classes Fetch Error:', error);
              return [];
            }
          };
  
          const fetchDivisionsDirectly = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}v1/division`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem("auth_token") || ''}`
                }
              });
  
              if (!response.ok) {
                throw new Error(`Divisions HTTP error! status: ${response.status}`);
              }
  
              const responseData = await response.json();
              console.log('Raw Divisions Data:', responseData);
  
              return responseData.data.map((item: any) => ({
                id: item.txnId,
                name: item.name
              }));
            } catch (error) {
              console.error('Direct Divisions Fetch Error:', error);
              return [];
            }
          };
          
        // Fetch data
        const [sectionsData, classesData, divisionsData] = await Promise.all([
          fetchSectionsDirectly(),
          fetchClassesDirectly(),
          fetchDivisionsDirectly()
        ]);

        console.log('Processed Sections:', sectionsData);
        console.log('Processed Classes:', classesData);
        console.log('Processed Divisions:', divisionsData);

        // Set data with default 'All' option
        setSections([
          { id: '', name: 'All Sections' },
          ...sectionsData
        ]);

        setClasses([
          { id: '', name: 'All Classes' },
          ...classesData
        ]);

        setDivisions([
          { id: '', name: 'All Divisions' },
          ...divisionsData
        ]);

      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError('Failed to load filter options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onApplyFilters(activeFilters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ section: '', class: '', division: '' });
    onApplyFilters({});
    onClose();
  };


  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Students</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              name="division"
              value={filters.division}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-1/2 mr-2"
            >
              Reset Filters
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="w-1/2 ml-2"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};