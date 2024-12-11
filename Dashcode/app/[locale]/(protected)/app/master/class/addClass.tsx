import React, { useState, useEffect } from 'react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface AddClassProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddClass: React.FC<AddClassProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Error timing effect
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
            setError('Class name is required');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("auth_token");

        try {
            const response = await fetch(`${apiurl}v1/class`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: name.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || data.error || 'Failed to create class';
                throw new Error(errorMessage);
            }

            setname('');
            onSuccess?.();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create class. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setname('');
        setError('');
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
                        Add New Class
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {error && (
                        <Alert className="bg-red-50 text-red-900 border-red-200 transition-opacity duration-300 font-montserrat">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="className" className="text-sm font-medium text-gray-700 font-montserrat">
                            Class Name
                        </Label>
                        <div className="relative">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 absolute left-3 top-2 text-gray-500" />
                            <Input
                                id="className"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                className="pl-10 focus:ring-green-500 focus:border-green-500 text-black font-montserrat"
                                placeholder="Enter Class name"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white h-8 text-sm px-3 py-1 font-montserrat"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Class'}
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

export default AddClass;