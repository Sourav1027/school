import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileSpreadsheet, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Data = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    section: '',
    class: '',
    division: ''
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      // Simulating upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadStatus('success');
    } catch {
      setUploadStatus('error');
    }
  };

  const handleDownloadFormat = () => {
    // Download format implementation
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Student Excel Upload</CardTitle>
        <Button
          onClick={handleDownloadFormat}
          variant="outline"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          <Download size={18} />
          Download Format
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleSelectChange}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleSelectChange}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Class</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Division</label>
              <select
                name="division"
                value={formData.division}
                onChange={handleSelectChange}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Division</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
              </select>
            </div>
          </div>

          <div 
            className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
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
              <div>
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
          </div>

          {uploadStatus !== 'idle' && (
            <Alert className={uploadStatus === 'success' ? 'bg-green-50' : 'bg-red-50'}>
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

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`flex items-center gap-2 ${
                !selectedFile 
                  ? 'bg-green-600  hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Data;