import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileSpreadsheet, Check, X, Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as XLSX from 'xlsx';
import { StudentFilter } from './StudentFilter';
import {StudentService} from './studentservice';

interface StudentData {
  id: string;
  name: string;
  section: string;
  class: string;
  division: string;
}

const StudentDataUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: StudentData[] = XLSX.utils.sheet_to_json(worksheet);

        // Validate and process data
        const processedStudents = StudentService.processStudentData(jsonData);
        setStudents(processedStudents);
        setFilteredStudents(processedStudents);
        setUploadStatus('success');
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        Name: 'John Doe',
        Section: 'A',
        Class: '10',
        Division: 'Science'
      }
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'student_template.xlsx');
  };

  const handleExportStudents = () => {
    if (filteredStudents.length === 0) {
      alert('No students to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students_export.xlsx');
  };

  const handleFilterApply = (filters: { section?: string; class?: string; division?: string }) => {
    const filtered = StudentService.filterStudents(students, filters);
    setFilteredStudents(filtered);
    setIsFilterModalOpen(false);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 w-full">
        <CardTitle className="text-2xl font-bold">Students Data</CardTitle>
        <div className="flex space-x-2">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Download size={18} />
            Download Template
          </Button>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 text-green-600 hover:text-green-800"
          >
            <Filter size={18} />
            Filter Students
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* File Upload Section */}
        <div 
          className={`relative border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileSpreadsheet size={40} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              {selectedFile ? (
                <span className="font-medium text-blue-600">{selectedFile.name}</span>
              ) : (
                <>
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  <br />
                  Excel files only (xlsx, xls)
                </>
              )}
            </p>
          </div>
        </div>

        {/* Upload Status Alert */}
        {uploadStatus !== 'idle' && (
          <Alert className={uploadStatus === 'success' ? 'bg-green-50 mb-6' : 'bg-red-50 mb-6'}>
            <div className="flex items-center gap-2">
              {uploadStatus === 'success' ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={
                uploadStatus === 'success' ? 'text-green-700' : 'text-red-700'
              }>
                {uploadStatus === 'success' 
                  ? 'File uploaded successfully!' 
                  : 'Error uploading file. Please try again.'}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Student List and Export */}
        {filteredStudents.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Students ({filteredStudents.length})
              </h2>
              <Button 
                onClick={handleExportStudents}
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Export Students
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Section</th>
                    <th className="border p-2">Class</th>
                    <th className="border p-2">Division</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border p-2">{student.id}</td>
                      <td className="border p-2">{student.name}</td>
                      <td className="border p-2">{student.section}</td>
                      <td className="border p-2">{student.class}</td>
                      <td className="border p-2">{student.division}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`flex items-center gap-2 ${
              !selectedFile 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
        </div>
      </CardContent>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <StudentFilter 
          onApplyFilters={handleFilterApply}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
    </Card>
  );
};

export default StudentDataUpload;