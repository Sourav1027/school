import React, { useState, useEffect } from 'react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface AddSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddSection: React.FC<AddSectionProps> = ({ isOpen, onClose, onSuccess }) => {
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');
  const [showAlert, setShowAlert] = useState(false);
  const [error,setError]=useState(" ");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Close the alert after 3 seconds
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [showAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage('');
    setError('');

    if (!sectionName.trim()) {
      setAlertType('error');
      setAlertMessage('Section name is required');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("auth_token");
    console.log(token,"token")

    try {
      const response = await fetch(`${apiurl}v1/section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: sectionName.trim() }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create section');
      }

      const responseData = await response.json();
      setAlertType('success');
      setAlertMessage(responseData.message || 'Section created successfully');
      setShowAlert(true);

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
      setSectionName('');
    } catch (err: any) {
      setAlertType('error');
      setAlertMessage(err.message || 'Failed to create section. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSectionName('');
    setAlertMessage('');
    setShowAlert(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent
        className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
        style={{ marginTop: '0px', transform: 'none', maxWidth: '700px', width: '90%' }}
        onPointerDownOutside={(e) => {
          e.preventDefault(); // Prevent closing on click outside
        }}
        onInteractOutside={(e) => {
          e.preventDefault(); // Prevent any interaction outside
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-montserrat">
            <div className="h-8 w-2 bg-green-500 rounded-full" />
            Add New Section
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {showAlert && (
            <Alert
              className={`${
                alertType === 'success' ? 'bg-green-50 text-green-900 border-green-200' : 'bg-red-50 text-red-900 border-red-200 font-montserrat'
              }`}
            >
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="sectionName" className="text-sm font-medium text-gray-700 font-montserrat">
              Section Name
            </Label>
            <div className="relative">
              <AdjustmentsHorizontalIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500 font-montserrat" />
              <Input
                id="sectionName"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="pl-10 focus:ring-green-500 focus:border-green-500 font-montserrat"
                placeholder="Enter section name"
                disabled={loading}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2 justify-self-start">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white  h-8 text-sm px-3 py-1 font-montserrat"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Section'}
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

export default AddSection;
