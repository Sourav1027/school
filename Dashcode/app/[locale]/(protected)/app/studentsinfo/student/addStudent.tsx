import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, CalendarDaysIcon, Users, BookOpen, Hash, Home, Building, Save, X, Upload, Droplet } from 'lucide-react';
import CustomDatePicker from './customDatePicker';
import ImageCropper from './imageCropper';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { GenderMale } from '@carbon/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsPraying } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { DropdownService, DropdownOption } from './dropdownService';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface AddStudentFormProps {
    isOpen: boolean;
    onClose: () => void;
}

// Previous helper functions remain the same
const getCurrentYear = () => new Date().getFullYear();

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => ({
    value: group.toLowerCase(),
    label: group
}));
const casteOptions = ['General', 'OBC', 'SC', 'ST', 'NT', 'Other'].map(caste => ({
    value: caste.toLowerCase(),
    label: caste
}));

const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhism', 'Jainism', 'Animism/Adivasi'].map(religion => ({
    value: religion.toLowerCase(),
    label: religion
}));
const categoryOptions = ['Regular', 'Integrated',].map(category => ({
    value: category.toLowerCase(),
    label: category
}));

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Schema remains the same
const studentSchema = z.object({
    grNumber: z.string().min(1, 'Admission number is required'),
    dateOfAdmission: z.date({ required_error: "Date of admission is required", }),
    rollNumber: z.string().min(1, 'Roll number is required'),
    batch: z.string().min(1, 'Batch is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    gender: z.string().min(1, 'Gender is required'),
    bloodGroup: z.string().min(1, 'Blood group is required'),
    class: z.string().min(1, 'Class is required'),
    division: z.string().min(1, 'Division is required'),
    section: z.string().min(1, 'Section is required'),
    dob: z.date({
        required_error: "Date of birth is required",
    }),
    fatherName: z.string().min(1, 'Father\'s name is required'),
    fatherOccupation: z.string().min(1, 'Father\'s occupation is required'),
    fatherMobile: z.string().min(10, 'Valid mobile number is required'),
    motherName: z.string().min(1, 'Mother\'s name is required'),
    motherOccupation: z.string().min(1, 'Mother\'s occupation is required'),
    motherMobile: z.string().min(10, 'Valid mobile number is required'),
    email: z.string().email('Valid email is required'),
    religion: z.string().min(1, 'Religion is required'),
    sscBoard: z.string().min(1, 'SSC board is required'),
    sscSeatNo: z.string().min(1, 'SSC seat number is required'),
    aadharNumber: z.string().min(12, 'Valid Aadhar number is required'),
    placeOfBirth: z.string().min(1, 'Place of birth is required'),
    category: z.string().min(1, 'Category is required'),
    caste: z.string().min(1, 'Caste is required'),


    photo: z
        .any()
        .refine((files) => files?.length > 0, "Photo is required")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported"
        ),
    correspondenceAddress1: z.string().min(1, 'Address line 1 is required'),
    correspondenceAddress2: z.string().optional(),
    correspondenceAddress3: z.string().optional(),
    correspondenceCity: z.string().min(1, 'City is required'),
    correspondenceState: z.string().min(1, 'State is required'),
    correspondencePincode: z.string().min(6, 'Valid pincode is required'),
    permanentAddress1: z.string().min(1, 'Address line 1 is required'),
    permanentAddress2: z.string().optional(),
    permanentAddress3: z.string().optional(),
    permanentCity: z.string().min(1, 'City is required'),
    permanentState: z.string().min(1, 'State is required'),
    permanentPincode: z.string().min(6, 'Valid pincode is required'),
    sameAsCorrespondence: z.boolean().default(false),
});

type StudentFormData = z.infer<typeof studentSchema>;

const AddStudentForm: React.FC<AddStudentFormProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [sameAddress, setSameAddress] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
    const [divisionOptions, setDivisionOptions] = useState<DropdownOption[]>([]);
    const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);
    const [batchOptions, setBatchOptions] = useState<DropdownOption[]>([]);

    const { register, handleSubmit, reset, setValue, control, watch, formState: { errors }, } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
    });

    const correspondenceFields = watch([
        'correspondenceAddress1',
        'correspondenceAddress2',
        'correspondenceAddress3',
        'correspondenceCity',
        'correspondenceState',
        'correspondencePincode'
    ]);

    useEffect(() => {
        if (sameAddress) {
            setValue('permanentAddress1', correspondenceFields[0]);
            setValue('permanentAddress2', correspondenceFields[1]);
            setValue('permanentAddress3', correspondenceFields[2]);
            setValue('permanentCity', correspondenceFields[3]);
            setValue('permanentState', correspondenceFields[4]);
            setValue('permanentPincode', correspondenceFields[5]);
        }
    }, [sameAddress, correspondenceFields, setValue]);

    // Fetch dropdown options on component mount
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const [classes, divisions, sections, batches] = await Promise.all([
                    DropdownService.getClasses(),
                    DropdownService.getDivisions(),
                    DropdownService.getSections(),
                    DropdownService.getBatches()
                ]);

                setClassOptions(classes);
                setDivisionOptions(divisions);
                setSectionOptions(sections);
                setBatchOptions(batches);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };

        if (isOpen) {
            fetchDropdownOptions();
        }
    }, [isOpen]);


    // Existing submit handler
    const onSubmit = async (data: StudentFormData) => {
        const token = localStorage.getItem("auth_token");
        try {
            setLoading(true);
            const response = await axios.post(`${apiurl}v1/student`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            reset();
            onClose();
        } catch (error) {
            console.error('Error creating student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            reset();
            setPhotoPreview(null);
            onClose();
        }
    };


    // Callback to receive the cropped image from ImageCropper
    const handleImageCropped = (croppedImage: File) => {
        setPhotoFile(croppedImage);
        const previewUrl = URL.createObjectURL(croppedImage);
        setPhotoPreview(previewUrl);
        setValue('photo', croppedImage); // Update the form value
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="flex flex-col p-6 absolute top-0 left-0 right-0 inset-0 mx-auto max-w-full h-auto overflow-y-auto bg-white shadow-lg rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '1400px', width: '90%', height: '92vh' }}
                onPointerDownOutside={(e) => {
                    e.preventDefault(); // Prevent closing on click outside
                }}
                onInteractOutside={(e) => {
                    e.preventDefault(); // Prevent any interaction outside
                }}>
                <DialogHeader className="px-6 py-4 border-b sticky top-0">
                    <DialogTitle className="text-xl font-semibold font-montserrat">Add New Student</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="general"
                                    className={`${activeTab === 'general'
                                        ? 'border-b-2 border-b-blue-500 text-blue-500 shadow-md shadow-blue-500/50 font-montserrat'
                                        : 'border-b-2 border-b-gray-300 text-gray-500 hover:text-gray-700 font-montserrat'
                                        } px-4 py-2 font-medium`}
                                    onClick={() => setActiveTab('general')}
                                >
                                    General Information
                                </TabsTrigger>
                                <TabsTrigger
                                    value="address"
                                    className={`${activeTab === 'address'
                                        ? 'border-b-2 border-b-blue-500 text-blue-500 shadow-md shadow-blue-500/50 font-montserrat'
                                        : 'border-b-2 border-b-gray-300 text-gray-500 hover:text-gray-700 font-montserrat'
                                        } px-4 py-2 font-medium`}
                                    onClick={() => setActiveTab('address')}
                                >
                                    Address Details
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6">
                                {/* Photo Upload Section */}
                                <div className="flex gap-8">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div
                                            className="w-25 h-25 border-2 border-gray-200 rounded-lg overflow-hidden cursor-pointer"
                                            onClick={() => photoPreview && setIsImagePreviewOpen(true)}
                                        >
                                            {photoPreview ? (
                                                <img
                                                    src={photoPreview}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                    <User className="w-40 h-40 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <ImageCropper onImageCropped={handleImageCropped} aspectRatio={1} />

                                    </div>

                                    {/* Basic Info Section */}
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input {...register('grNumber')} placeholder="GR Number" className="pl-10 font-montserrat font-montserrat" />
                                                {errors.grNumber && <p className="text-red-500 text-sm mt-1">{errors.grNumber.message}</p>}
                                            </div>

                                            <div className="relative">
                                                <CalendarDaysIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Controller
                                                    name="dateOfAdmission"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CustomDatePicker

                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            label="Date of Admission"
                                                            error={errors.dateOfAdmission?.message}
                                                            icon={<CalendarDaysIcon className="h-4 w-4 text-gray-500" />}

                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input {...register('firstName')} placeholder="First Name" className="pl-10 font-montserrat" />
                                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                                            </div>

                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input {...register('lastName')} placeholder="Last Name" className="pl-10 font-montserrat" />
                                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                                            </div>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input {...register('fatherName')} placeholder="Father's Name" className="pl-10 font-montserrat" />
                                                {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>}
                                            </div>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input {...register('motherName')} placeholder="Mother's Name" className="pl-10 font-montserrat" />
                                                {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName.message}</p>}
                                            </div>

                                        </div>

                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="relative">
                                                <GenderMale className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Select {...register('gender')}>
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                            </div>
                                            <div className="relative">
                                                <Droplet className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Select {...register('bloodGroup')}>
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Blood Group" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bloodGroupOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
                                            </div>


                                            <div className="relative">
                                                <CalendarDaysIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Controller
                                                    name="dob"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CustomDatePicker
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            label="Date of Birth"
                                                            error={errors.dob?.message}
                                                            icon={<CalendarDaysIcon className="h-4 w-4 text-gray-500" />}

                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="relative">
                                                <CalendarDaysIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Select {...register('batch')}>
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Batch" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {batchOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.batch && <p className="text-red-500 text-sm mt-1">{errors.batch.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input {...register('rollNumber')} placeholder="Roll Number" className="pl-10 font-montserrat" />
                                                {errors.rollNumber && <p className="text-red-500 text-sm mt-1">{errors.rollNumber.message}</p>}
                                            </div>

                                            <div className="relative">
                                                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Select {...register('class')}>
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {classOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>}
                                            </div>

                                            <div className="relative">
                                                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Select {...register('division')}>
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Division" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {divisionOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.division && <p className="text-red-500 text-sm mt-1">{errors.division.message}</p>}
                                            </div>
                                            <div className="relative">
                                                <AdjustmentsHorizontalIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Select {...register('section')}>
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Section" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sectionOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Select {...register('category')}>
                                                <SelectTrigger className="pl-10 font-montserrat">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoryOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('sscBoard')} placeholder="SSC Board" className="pl-10 font-montserrat" />
                                            {errors.sscBoard && <p className="text-red-500 text-sm mt-1">{errors.sscBoard.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('sscSeatNo')} placeholder="SSC Seat No" className="pl-10 font-montserrat" />
                                            {errors.sscSeatNo && <p className="text-red-500 text-sm mt-1">{errors.sscSeatNo.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('aadharNumber')} type="text" placeholder="Aadhar Number" className="pl-10 font-montserrat" />
                                            {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">

                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('fatherOccupation')} placeholder="Father's Occupation" className="pl-10 font-montserrat" />
                                            {errors.fatherOccupation && <p className="text-red-500 text-sm mt-1">{errors.fatherOccupation.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('fatherMobile')} placeholder="Father's Mobile Number" className="pl-10 font-montserrat" />
                                            {errors.fatherMobile && <p className="text-red-500 text-sm mt-1">{errors.fatherMobile.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('motherOccupation')} placeholder="Mother's Occupation" className="pl-10 font-montserrat" />
                                            {errors.motherOccupation && <p className="text-red-500 text-sm mt-1">{errors.motherOccupation.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('motherMobile')} placeholder="Mother's Mobile Number" className="pl-10 font-montserrat" />
                                            {errors.motherMobile && <p className="text-red-500 text-sm mt-1">{errors.motherMobile.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('email')} type="email" placeholder="Parent Email" className="pl-10 font-montserrat" />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faHandsPraying} className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Select {...register('religion')}>
                                                <SelectTrigger className="pl-10 font-montserrat">
                                                    <SelectValue placeholder="Select Religion" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {religionOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faHandsPraying} className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Select {...register('caste')}>
                                                <SelectTrigger className="pl-10 font-montserrat">
                                                    <SelectValue placeholder="Select caste" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {casteOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.caste && <p className="text-red-500 text-sm mt-1">{errors.caste.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input {...register('placeOfBirth')} type="text" placeholder="Place of Birth" className="pl-10 font-montserrat" />
                                            {errors.placeOfBirth && <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth.message}</p>}
                                        </div>
                                    </div>
                                </div>

                            </TabsContent>

                            <TabsContent value="address" className="space-y-4">
                                {/* Correspondence Address */}
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h3 className="font-medium">Correspondence Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('correspondenceAddress1')} placeholder="Address Line 1" className="pl-10 font-montserrat text-black" />
                                            {errors.correspondenceAddress1 && <p className="text-red-500 text-sm mt-1">{errors.correspondenceAddress1.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('correspondenceAddress2')} placeholder="Address Line 2" className="pl-10 font-montserrat text-black" />
                                        </div>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('correspondenceAddress3')} placeholder="Address Line 3" className="pl-10 text-black" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('correspondenceCity')} placeholder="City" className="pl-10 text-black" />
                                            {errors.correspondenceCity && <p className="text-red-500 text-sm mt-1">{errors.correspondenceCity.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('correspondenceState')} placeholder="State" className="pl-10 text-black" />
                                            {errors.correspondenceState && <p className="text-red-500 text-sm mt-1">{errors.correspondenceState.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('correspondencePincode')} placeholder="Pincode" className="pl-10 text-black" />
                                            {errors.correspondencePincode && <p className="text-red-500 text-sm mt-1">{errors.correspondencePincode.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Checkbox for same address */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="sameAddress"
                                        checked={sameAddress}
                                        onCheckedChange={(checked) => {
                                            setSameAddress(checked as boolean);
                                        }}
                                    />
                                    <label htmlFor="sameAddress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-montserrat">
                                        Same as Correspondence Address
                                    </label>
                                </div>

                                {/* Permanent Address */}
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h3 className="font-medium pl-10 font-montserrat">Permanent Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('permanentAddress1')} placeholder="Address Line 1" className="pl-10 text-black" disabled={sameAddress} />
                                            {errors.permanentAddress1 && <p className="text-red-500 text-sm mt-1">{errors.permanentAddress1.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('permanentAddress2')} placeholder="Address Line 2" className="pl-10 text-black" disabled={sameAddress} />
                                        </div>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('permanentAddress3')} placeholder="Address Line 3" className="pl-10 text-black" disabled={sameAddress} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('permanentCity')} placeholder="City" className="pl-10 font-montserrat  text-black" disabled={sameAddress} />
                                            {errors.permanentCity && <p className="text-red-500 text-sm mt-1">{errors.permanentCity.message}</p>}
                                        </div>

                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('permanentState')} placeholder="State" className="pl-10 font-montserrat text-black" disabled={sameAddress} />
                                            {errors.permanentState && <p className="text-red-500 text-sm mt-1">{errors.permanentState.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 h-4 w-4 text-black" />
                                            <Input {...register('permanentPincode')} placeholder="Pincode" className="pl-10 font-montserrat text-black" disabled={sameAddress} />
                                            {errors.permanentPincode && <p className="text-red-500 text-sm mt-1">{errors.permanentPincode.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 h-8 text-sm px-3 py-1 font-montserrat">
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Saving...' : 'Save Student'}
                            </Button>
                            <Button type="button" disabled={loading} onClick={handleClose} className="bg-red-600 hover:bg-red-700 text-white h-8 text-sm px-3 py-1 font-montserrat">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
            {photoPreview && (
                <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="font-montserrat">Photo Preview</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center items-center p-4">
                            <img src={photoPreview}
                                alt="Profile Preview"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => setIsImagePreviewOpen(false)}
                                className="bg-gray-600 hover:bg-gray-700 font-montserrat"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog >
    );
};

export default AddStudentForm;