import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, X, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from '../../others/loader';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface AddBatchProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    selectedBatch: Batch | null;
}
interface Batch {
    id: number;       // Changed from txnId to id to match main component
    name: string;
    passingYear: string;
    schoolOpenDate: string;
}

const AddBatch: React.FC<AddBatchProps> = ({ isOpen, onClose, onSuccess, selectedBatch }) => {
    const [formData, setFormData] = useState({
        name: '',
        passingYear: '',
        schoolOpenDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    // Function to convert DD/MM/YYYY to YYYY-MM-DD
    const convertToInputDateFormat = (dateString: string) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Function to convert YYYY-MM-DD to DD/MM/YYYY
    const convertToApiDateFormat = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (selectedBatch) {
            setFormData({
                name: selectedBatch.name,
                passingYear: selectedBatch.passingYear,
                schoolOpenDate: convertToInputDateFormat(selectedBatch.schoolOpenDate) // Convert date for input field
            });
        } else {
            setFormData({
                name: '',
                passingYear: '',
                schoolOpenDate: ''
            });
        }
    }, [selectedBatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        try {
            const formattedData = {
                ...formData,
                schoolOpenDate: convertToApiDateFormat(formData.schoolOpenDate)
            };

            let response;
            let data;
            if (selectedBatch) {
                // Update existing batch
                response = await fetch(`${apiurl}v1/batch/${selectedBatch.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formattedData)
                });
                data = await response.json();
            } else {
                // Create new batch
                response = await fetch(`${apiurl}v1/batch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formattedData)
                });
                data = await response.json();
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create/update batch');
            }

            setAlert({
                show: true,
                message: selectedBatch ? 'Batch updated successfully' : 'Batch created successfully',
                type: 'success'
            });

            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create/update batch. Please try again.';
            setAlert({
                show: true,
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            passingYear: '',
            schoolOpenDate: ''
        });
        setAlert({ show: false, message: '', type: 'success' });
        onClose();
    };

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert.show]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg transform"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '700px', width: '90%' }}
                onPointerDownOutside={(e) => {
                    e.preventDefault(); // Prevent closing on click outside
                  }}
                  onInteractOutside={(e) => {
                    e.preventDefault(); // Prevent any interaction outside
                  }}
            >
                {alert.show && (
                    <Alert
                        className={`mb-4 ${
                            alert.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800 font-montserrat' 
                                : 'bg-red-50 border-red-200 text-red-800 font-montserrat'
                        }`}
                    >
                        <AlertDescription>
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                )}
               
                <DialogHeader className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-t-lg">
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2 font-montserrat">
                        <BookOpen className="w-6 h-6" />
                        {selectedBatch ? 'Update Batch' : 'Add New Batch'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="className" className="text-sm font-medium text-gray-700 flex items-center gap-2 font-montserrat">
                            <Calendar className="w-4 h-4 text-green-500" />
                            Batch Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500 font-montserrat"
                            placeholder="e.g., YYYY-YYYY"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passingYear" className="text-sm font-medium text-gray-700 flex items-center gap-2 font-montserrat">
                            <GraduationCap className="w-4 h-4 text-green-500" />
                            Passing Year
                        </Label>
                        <Input
                            id="passingYear"
                            name="passingYear"
                            value={formData.passingYear}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500 font-montserrat"
                            placeholder="e.g., YYYY"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="schoolOpenDate" className="text-sm font-medium text-gray-700 flex items-center gap-2 font-montserrat">
                            <Calendar className="w-4 h-4 text-green-500" />
                            School Open Date
                        </Label>
                        <Input
                            id="schoolOpenDate"
                            name="schoolOpenDate"
                            type="date"
                            value={formData.schoolOpenDate}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500 font-montserrat"
                            disabled={loading}
                            required
                        />
                    </div>

                    <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white h-8 text-sm px-3 py-1 font-montserrat"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : selectedBatch ? 'Update Batch' : 'Save Batch'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white h-8 text-sm px-3 py-1 font-montserrat"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        {loading && <Loader />}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBatch;