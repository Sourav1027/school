'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Hash, Phone, Mail, User, GraduationCap, Save, X, Home, Building, Map, MapPinned, Navigation, PenTool } from 'lucide-react';
import AlertTitle from '@mui/material/AlertTitle';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from '../../others/loader';


const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

// Update the default values to include userType and userTypeId for both addresses
export const defaultFormValues: SchoolFormData = {
    schoolCode: '',
    name: '',
    principleName: '',
    principleSign: '',
    contact: '',
    landline: '',
    email: '',
    medium: '',
    board: '',
    state: '',
    address: [
        {
            type: 'correspondence',
            userType: 1,
            userTypeId: 1,
            add1: '',
            add2: '',
            add3: '',
            city: '',
            state: '',
            pincode: ''
        },
        {
            type: 'permanent',
            userType: 1,
            userTypeId: 1,
            add1: '',
            add2: '',
            add3: '',
            city: '',
            state: '',
            pincode: ''
        }
    ]
};


// Types remain the same
export type Address = {
    type: 'correspondence' | 'permanent';
    userType: number;
    userTypeId: number;
    add1: string;
    add2: string;
    add3: string;
    city: string;
    state: string;
    pincode: string;
};

export type SchoolFormData = {
    schoolCode: string;
    name: string;
    principleName: string;
    principleSign: string;
    contact: string;
    landline: string;
    email: string;
    medium: string;
    board: string;
    state: string;
    address: [Address, Address];
};

// Board and medium options remain the same
const boardOptions = [
    { value: 'CBSE', label: 'CBSE' },
    { value: 'ICSE', label: 'ICSE' },
    { value: 'STATE', label: 'State Board' },
    { value: 'IGCSE', label: 'IGCSE' },
    // { value: 'up', label: 'UP Board' },
    // { value: 'bihar', label: 'Bihar Board' },
    // { value: 'mp', label: 'MP Board' },
];

const mediumOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'both', label: 'Both (English & Hindi)' },
];

interface School {
    id: number;  // Updated to match API response
    schoolCode: string;
    name: string;   // Updated from schoolName
    principleName: string;
    contact: string;
    medium: string;
    board: string;
    state: string;
    email: string;
    landline: string;
    principleSign: string;
    address: any[];
}

interface SchoolFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: SchoolFormData;
    mode?: 'edit' | 'post';
    schoolId?: string;
    selectedSchool: School | null;
    onSuccess?: () => void;
}

const AddSchoolForm: React.FC<SchoolFormProps> = ({
    isOpen,
    onClose,
    schoolId, selectedSchool,onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [sameAsCorrespondence, setSameAsCorrespondence] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    // First update the useForm hook to use proper typing for defaultValues
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SchoolFormData>({
        defaultValues: defaultFormValues
    });

    const correspondenceAddress = watch('address.0');
    useEffect(() => {
        if (selectedSchool) {
            // Map the selected school data to form fields
            setValue('schoolCode', selectedSchool.schoolCode);
            setValue('name', selectedSchool.name);
            setValue('principleName', selectedSchool.principleName);
            setValue('principleSign', selectedSchool.principleSign);
            setValue('contact', selectedSchool.contact);
            setValue('landline', selectedSchool.landline);
            setValue('email', selectedSchool.email);
            setValue('medium', selectedSchool.medium);
            setValue('board', selectedSchool.board);
            setValue('state', selectedSchool.state);

            // Map addresses if they exist
            if (selectedSchool.address && selectedSchool.address.length >= 2) {
                setValue('address.0', selectedSchool.address[0]);
                setValue('address.1', selectedSchool.address[1]);
            }
        } else {
            reset(defaultFormValues);
        }
    }, [selectedSchool, setValue, reset]);

    const handleCheckboxChange = (checked: boolean) => {
        setSameAsCorrespondence(checked);
        if (checked) {
            setValue('address.1', {
                ...correspondenceAddress,
                type: 'permanent'
            });
        }
    };

    // Function to handle number input
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        e.target.value = value;
    };

    const onSubmit = async (data: SchoolFormData) => {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        try {
            let response;
            let responseData;

            if (selectedSchool) {
                // Update existing school
                response = await fetch(`${apiurl}v1/school/${selectedSchool.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(data)
                });
            } else {
                // Create new school
                response = await fetch(`${apiurl}v1/school`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(data)
                });
            }

            responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to save school');
            }

            setAlert({
                show: true,
                message: selectedSchool ? 'School updated successfully' : 'School created successfully',
                type: 'success'
            });

            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save school';
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
        if (!loading) {
            reset();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '1400px', width: '90%', height: '95vh' }}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                {alert.show && (
                    <Alert
                        className={`mb-4 ${alert.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        <AlertDescription>
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                )}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-montserrat">
                        <div className="h-8 w-2 bg-green-500 rounded-full" />
                        {selectedSchool ? 'Update School' : 'Add New School'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Basic School Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('schoolCode', { required: true })}
                                placeholder="School Code"
                                className="pl-10 font-montserrat"
                            />
                        </div>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('name', { required: true })}
                                placeholder="School Name"
                                className="pl-10 font-montserrat"
                            />
                        </div>
                    </div>

                    {/* Principal Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('principleName', { required: true })}
                                placeholder="Principal Name"
                                className="pl-10 font-montserrat"
                            />
                        </div>
                        <div className="relative">
                            <PenTool className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('principleSign', { required: true })}
                                placeholder="Principal Signature"
                                className="pl-10 font-montserrat"
                            />
                        </div>
                    </div>

                    {/* Contact Information with Number Validation */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('contact', {
                                    required: true,
                                    pattern: /^\d{10}$/
                                })}
                                type="text"
                                placeholder="Contact Number"
                                className="pl-10 font-montserrat"
                                maxLength={10}
                                onInput={handleNumberInput}
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('landline', {
                                    required: true,
                                    pattern: /^\d{10}$/
                                })}
                                type="text"
                                placeholder="Landline Number"
                                className="pl-10 font-montserrat"
                                maxLength={10}
                                onInput={handleNumberInput}
                            />

                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('email', {
                                    required: true,
                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                })}
                                type="email"
                                placeholder="Email"
                                className="pl-10 font-montserrat"
                            />
                        </div>
                    </div>

                    {/* School Type Selection */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative">
                            <Select onValueChange={(value) => setValue('medium', value)}>
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
                        </div>
                        <div className="relative">
                            <Select onValueChange={(value) => setValue('board', value)}>
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
                        </div>
                        <div className="relative">
                            <MapPinned className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                {...register('state', { required: true })}
                                placeholder="State Name"
                                className="pl-10 font-montserrat"
                            />
                        </div>
                    </div>

                    {/* Correspondence Address */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4 flex items-center font-montserrat">
                            <Home className="h-4 w-4 mr-2" />
                            Correspondence Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input {...register('address.0.add1')} placeholder="Addressadd 1" className="pl-10 font-montserrat" />
                            </div>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input {...register('address.0.add2')} placeholder="Addressadd 2" className="pl-10 font-montserrat" />
                            </div>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input {...register('address.0.add3')} placeholder="Addressadd 3" className="pl-10 font-montserrat" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <MapPinned className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input {...register('address.0.city')} placeholder="City" className="pl-10 font-montserrat" />
                            </div>
                            <div className="relative">
                                <Map className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input {...register('address.0.state')} placeholder="State" className="pl-10 font-montserrat" />
                            </div>
                            <div className="relative">
                                <Navigation className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input {...register('address.0.pincode')} placeholder="Pincode" className="pl-10 font-montserrat" />
                            </div>
                        </div>
                    </div>

                    {/* Same as Correspondence Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sameAddress"
                            checked={sameAsCorrespondence}
                            onCheckedChange={handleCheckboxChange}
                        />
                        <label htmlFor="sameAddress" className="text-sm font-medium leading-none font-montserrat">
                            Permanent address same as correspondence address
                        </label>
                    </div>

                    {/* Permanent Address */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4 flex items-center font-montserrat">
                            <Home className="h-4 w-4 mr-2" />
                            Permanent Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('address.1.add1')}
                                    placeholder="Addressadd 1"
                                    className="pl-10 font-montserrat"
                                    disabled={sameAsCorrespondence}
                                />
                            </div>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('address.1.add2')}
                                    placeholder="Addressadd 2"
                                    className="pl-10 font-montserrat"
                                    disabled={sameAsCorrespondence}
                                />
                            </div>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('address.1.add3')}
                                    placeholder="Addressadd 3"
                                    className="pl-10 font-montserrat"
                                    disabled={sameAsCorrespondence}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <MapPinned className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('address.1.city')}
                                    placeholder="City"
                                    className="pl-10 font-montserrat"
                                    disabled={sameAsCorrespondence}
                                />
                            </div>
                            <div className="relative">
                                <Map className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('address.1.state')}
                                    placeholder="State"
                                    className="pl-10 font-montserrat"
                                    disabled={sameAsCorrespondence}
                                />
                            </div>
                            <div className="relative">
                                <Navigation className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    {...register('address.1.pincode')}
                                    placeholder="Pincode"
                                    className="pl-10 font-montserrat"
                                    disabled={sameAsCorrespondence}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 h-8 text-sm px-3 py-1 font-montserrat"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : selectedSchool ? 'Update School' : 'Save School'}
                        </Button>
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={handleClose}
                            className="bg-red-600 hover:bg-red-700 text-white h-8 text-sm px-3 py-1 font-montserrat"
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

export default AddSchoolForm;