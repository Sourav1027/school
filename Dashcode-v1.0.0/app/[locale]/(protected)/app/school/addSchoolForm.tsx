'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Building2, Hash, MapPin, Phone, Mail, User, GraduationCap, Save, X, } from 'lucide-react';

interface AddSchoolFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const boardOptions = [
    { value: 'cbse', label: 'CBSE' },
    { value: 'icse', label: 'ICSE' },
    { value: 'state', label: 'State Board' },
    { value: 'ib', label: 'IB (International Baccalaureate)' },
    { value: 'igcse', label: 'IGCSE' },
    { value: 'up', label: 'UP Board' },
    { value: 'bihar', label: 'Bihar Board' },
    { value: 'mp', label: 'MP Board' },
] as const;

const mediumOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'both', label: 'Both (English & Hindi)' },
] as const;

const schoolSchema = z.object({
    schoolId: z.string().min(1, 'School ID is required'),
    schoolCode: z.string().min(1, 'School code is required'),
    name: z.string().min(1, 'School name is required'),
    address: z.string().min(1, 'Address is required'),
    principalName: z.string().min(1, 'Principal name is required'),
    contactNo: z.string().min(10, 'Valid contact number is required'),
    landlineNo: z.string().optional(),
    email: z.string().email('Valid email is required'),
    medium: z.enum(['english', 'hindi', 'both'], {
        required_error: "Please select a medium of instruction",
    }),
    board: z.enum(['cbse', 'icse', 'state', 'ib', 'igcse', 'up', 'bihar', 'mp'], {
        required_error: "Please select a board",
    }),
});

type SchoolFormData = z.infer<typeof schoolSchema>;



const AddSchoolForm: React.FC<AddSchoolFormProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SchoolFormData>({
        resolver: zodResolver(schoolSchema),
    });

    const onSubmit = async (data: SchoolFormData) => {
        try {
            setLoading(true);
            const response = await fetch('/api/schools', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create school');
            }

            reset();
            onClose();
        } catch (error) {
            console.error('Error creating school:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            reset();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '1200px', width: '90%' }}>
                <DialogHeader>
                    <DialogTitle>Add New School</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <div className="relative flex-1">
                                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('schoolId')}
                                    placeholder="School ID"
                                    className="pl-10"
                                />
                                {errors.schoolId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.schoolId.message}</p>
                                )}
                            </div>
                            <div className="relative flex-1">
                                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('schoolCode')}
                                    placeholder="School Code"
                                    className="pl-10"
                                />
                                {errors.schoolCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.schoolCode.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('name')}
                                placeholder="School Name"
                                className="pl-10"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('address')}
                                placeholder="Address"
                                className="pl-10"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('principalName')}
                                placeholder="Principal Name"
                                className="pl-10"
                            />
                            {errors.principalName && (
                                <p className="text-red-500 text-sm mt-1">{errors.principalName.message}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <div className="relative flex-1">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('contactNo')}
                                    placeholder="Contact Number"
                                    className="pl-10"
                                />
                                {errors.contactNo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactNo.message}</p>
                                )}
                            </div>
                            <div className="relative flex-1">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('landlineNo')}
                                    placeholder="Landline Number (Optional)"
                                    className="pl-10"
                                />
                                {errors.landlineNo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.landlineNo.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="Email"
                                className="pl-10"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Select {...register('medium')}>
                                    <SelectTrigger className="w-full">
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Select Medium" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mediumOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.medium && (
                                    <p className="text-red-500 text-sm mt-1">{errors.medium.message}</p>
                                )}
                            </div>

                            <div className="flex-1">
                                <Select {...register('board')}>
                                    <SelectTrigger className="w-full">
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Select Board" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {boardOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.board && (
                                    <p className="text-red-500 text-sm mt-1">{errors.board.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex items-center gap-2">
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={handleClose}
                            className="bg-red-600 hover:bg-red-700 text-white h-8 text-sm px-3 py-1"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 h-8 text-sm px-3 py-1"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save School'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSchoolForm;