import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdjustmentsHorizontalIcon, AcademicCapIcon, CheckIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface AddSubjectProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddSubject: React.FC<AddSubjectProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [subjectType, setsubjectType] = useState('Optional'); // Dropdown selection
  const [markingType, setmarkingType] = useState('Marks'); // Dropdown selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000); // 3 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${apiurl}v1/subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          abbreviation: abbreviation.trim(),
          subjectType,
          markingType,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Failed to create subject';
        throw new Error(errorMessage);
      }

      setName('');
      setAbbreviation('');
      setsubjectType('Optional');
      setmarkingType('Marks');
      onSuccess?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subject. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setAbbreviation('');
    setsubjectType('Optional');
    setmarkingType('Marks');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent
        className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
        style={{ marginTop: '0px', transform: 'none', maxWidth: '700px', width: '90%' }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-montserrat">
            <div className="h-8 w-2 bg-green-500 rounded-full" />
            Add New Subject
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <Alert className="bg-red-50 text-red-900 border-red-200 transition-opacity duration-300 font-montserrat">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="subjectName" className="text-sm font-medium text-gray-700 font-montserrat">
              Subject Name
            </Label>
            <div className="relative">
              <DocumentTextIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
              <Input
                id="subjectName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 focus:ring-green-500 focus:border-green-500 text-black font-montserrat"
                placeholder="Enter Subject name"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviation" className="text-sm font-medium text-gray-700 font-montserrat">
              Abbreviation
            </Label>
            <div className="relative">
              <AdjustmentsHorizontalIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
              <Input
                id="abbreviation"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className="pl-10 focus:ring-green-500 focus:border-green-500 text-black font-montserrat"
                placeholder="Enter Abbreviation (e.g., ENG)"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
  <div className="grid grid-cols-2 gap-6">
    {/* Is Subject Mandatory Field */}
    <div>
      <Label htmlFor="subjectType" className="text-sm text-gray-600 block mb-1">
        Is Subject Mandatory / Optional?
      </Label>
      <div className="relative">
        <CheckIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
        <select
          id="subjectType"
          value={subjectType}
          onChange={(e) => setsubjectType(e.target.value)}
          className="pl-10 w-full border-gray-300 rounded focus:ring-green-500 focus:border-green-500 text-black font-montserrat h-10"
          disabled={loading}
        >
          <option value="Mandatory">Mandatory</option>
          <option value="Optional">Optional</option>
        </select>
      </div>
    </div>

    {/* Grading Type Field */}
    <div>
      <Label htmlFor="markingType" className="text-sm text-gray-600 block mb-1">
        Grading Type
      </Label>
      <div className="relative">
        <AcademicCapIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
        <select
          id="markingType"
          value={markingType}
          onChange={(e) => setmarkingType(e.target.value)}
          className="pl-10 w-full border-gray-300 rounded focus:ring-green-500 focus:border-green-500 text-black font-montserrat h-10"
          disabled={loading}
        >
          <option value="Marks">Marks</option>
          <option value="Grade">Grade</option>
        </select>
      </div>
    </div>
  </div>
</div>



          <DialogFooter className="mt-6 flex gap-2 justify-self-start">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white h-8 text-sm px-3 py-1 font-montserrat"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Subject'}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white h-8 text-sm px-3 py-1 font-montserrat"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubject;
