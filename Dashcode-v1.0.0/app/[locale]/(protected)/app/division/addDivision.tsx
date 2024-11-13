import React, { useState } from 'react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

interface AddClassProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddDivision: React.FC<AddClassProps> = ({ isOpen, onClose, onSuccess }) => {
    const [divisionName, setdivisionName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!divisionName.trim()) {
            setError('Class name is required');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: divisionName.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to create class');
            }

            setdivisionName('');
            onSuccess?.();
            onClose();
        } catch (err) {
            setError('Failed to create class. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setdivisionName('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent
                className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '1200px', width: '90%' }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="h-8 w-2 bg-green-500 rounded-full" />
                        Add New Division 
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {error && (
                        <Alert className="bg-red-50 text-red-900 border-red-200">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="className" className="text-sm font-medium text-gray-700">
                            Division Name
                        </Label>
                        <div className="relative">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
                            <Input
                                id="divisionName"
                                value={divisionName}
                                onChange={(e) => setdivisionName(e.target.value)}
                                className="pl-10 focus:ring-green-500 focus:border-green-500 text-black"
                                placeholder="Enter Class name"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                    <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white  h-8 text-sm px-3 py-1"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Division'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white h-8 text-sm px-3 py-1"
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

export default AddDivision;