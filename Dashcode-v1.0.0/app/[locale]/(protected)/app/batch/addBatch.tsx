import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, X, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from '../others/loader';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNWM2M2Y5Ny02MDM5LTRlMGEtYjljNy03YTMxZjAxZWE0NzkiLCJ1c2VybmFtZSI6ImRlZXAiLCJzY2hvb2xJZCI6Ijc1NzM2YjAxLWRkZDYtNGE0OS05YTY4LTIwMmE4MDBiZGM0NSIsImlhdCI6MTczMTY2MjM3MCwiZXhwIjoxNzMxNzQ4NzcwfQ.tbo7aiRqOy5Bk-OsBj2yVyDqXyxwLRQ2DPupw3imIs0"
interface AddBatchProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddBatch: React.FC<AddBatchProps> = ({ isOpen, onClose, onSuccess }) => {
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

    const formatDate = (date: string) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

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

        try {
            const formattedData = {
                ...formData,
                schoolOpenDate: formatDate(formData.schoolOpenDate)
            };

            const response = await fetch(`${apiurl}v1/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(formattedData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create batch');
            }

            setAlert({
                show: true,
                message: 'Batch created successfully',
                type: 'success'
            });

            setFormData({
                name: '',
                passingYear: '',
                schoolOpenDate: '',
            });
            
            // Wait for alert to show before closing
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create batch. Please try again.';
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
        <Dialog open={isOpen}>
            <DialogContent
                className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg transform"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '700px', width: '90%' }}
            >
                {alert.show && (
                    <Alert
                        className={`mb-4 ${
                            alert.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        <AlertDescription>
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                )}
               
                <DialogHeader className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-t-lg">
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Add New Batch
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="className" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-500" />
                            Batch Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., YYYY-YYYY"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passingYear" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-green-500" />
                            Passing Year
                        </Label>
                        <Input
                            id="passingYear"
                            name="passingYear"
                            value={formData.passingYear}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., YYYY"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="schoolOpenDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-500" />
                            School Open Date
                        </Label>
                        <Input
                            id="schoolOpenDate"
                            name="schoolOpenDate"
                            type="date"
                            value={formData.schoolOpenDate}
                            onChange={handleChange}
                            className="focus:ring-green-500 focus:border-green-500"
                            disabled={loading}
                            required
                        />
                    </div>

                    <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white h-8 text-sm px-3 py-1"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Batch'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white h-8 text-sm px-3 py-1"
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