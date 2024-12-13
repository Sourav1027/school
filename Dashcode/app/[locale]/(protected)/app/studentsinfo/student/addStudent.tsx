import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, CalendarDaysIcon, Users, BookOpen, Shield, Hash, Home, Building, Save, X, Upload, Droplet, EllipsisVertical } from 'lucide-react';
import CustomDatePicker from './customDatePicker';
import ImageCropper from './imageCropper';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { ChartRelationship, Email, GenderMale } from '@carbon/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsPraying } from '@fortawesome/free-solid-svg-icons';

const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Previous helper functions remain the same
const getCurrentYear = () => new Date().getFullYear();

const preffixOptions = ['Mr', 'Mrs', "Miss"];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const casteOptions = ['General', 'OBC', 'SC', 'ST', 'NT', 'Other'];
const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhism', 'Jainism', 'Animism/Adivasi'];
const categoryOptions = ['Regular', 'Integrated'];


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface AddStudentFormProps {
    isOpen: boolean;
    onClose: () => void;
}


const AddStudentForm: React.FC<AddStudentFormProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [sameAddress, setSameAddress] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);
    const [divisionOptions, setDivisionOptions] = useState<{ value: string; label: string }[]>([]);
    const [sectionOptions, setSectionOptions] = useState<{ value: string; label: string }[]>([]);

    const [formData, setFormData] = useState({
        grNumber: '',
        dateOfAdmission: '',
        rollNumber: '',
        preffix: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        bloodGroup: '',
        class: '',
        division: '',
        section: '',
        dob: '',
        fatherName: '',
        fatherOccupation: '',
        fatherMobile: '',
        motherName: '',
        motherOccupation: '',
        motherMobile: '',
        fatherEmail: '',
        motherEmail: '',
        religion: '',
        sscBoard: '',
        sscSeatNo: '',
        aadharNumber: '',
        placeOfBirth: '',
        category: '',
        caste: '',
        nationality: '',
        emergencyName: '',
        emergencyContact: '',
        emergencyEmail: '',
        emergencyRelation: '',
        emergencyOccupation: '',
        apaarNumber: '',
        photo: '',
        correspondenceAddress1: '',
        correspondenceAddress2: '',
        correspondenceAddress3: '',
        correspondenceCity: '',
        correspondenceState: '',
        correspondencePincode: '',
        permanentAddress1: '',
        permanentAddress2: '',
        permanentAddress3: '',
        permanentCity: '',
        permanentState: '',
        permanentPincode: '',
        sameAsCorrespondence: '',
        previousSchool:"",
        dateOfLeaving: ' ',
        studentEmail: '',
        studentContact:''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
     // New useEffect to handle same address functionality
     useEffect(() => {
        if (sameAddress) {
            // Copy correspondence address to permanent address
            setFormData(prev => ({
                ...prev,
                permanentAddress1: prev.correspondenceAddress1,
                permanentAddress2: prev.correspondenceAddress2,
                permanentAddress3: prev.correspondenceAddress3,
                permanentCity: prev.correspondenceCity,
                permanentState: prev.correspondenceState,
                permanentPincode: prev.correspondencePincode
            }));
        } else {
            // Reset permanent address if unchecked
            setFormData(prev => ({
                ...prev,
                permanentAddress1: '',
                permanentAddress2: '',
                permanentAddress3: '',
                permanentCity: '',
                permanentState: '',
                permanentPincode: ''
            }));
        }
    }, [sameAddress, 
        formData.correspondenceAddress1, 
        formData.correspondenceAddress2, 
        formData.correspondenceAddress3, 
        formData.correspondenceCity, 
        formData.correspondenceState, 
        formData.correspondencePincode
    ]);


    // Modify the S handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("auth_token");
    
        try {
            setLoading(true);
    
            // Structured request body
            const requestBody = {
             
                    prefix: formData.preffix,
                    firstName: formData.firstName,
                    middleName: formData.middleName,
                    lastName: formData.lastName,
                    gender: formData.gender,
                    dateOfBirth: formData.dob,
                    bloodGroup: formData.bloodGroup,
                    selectReligion: formData.religion,
                    caste: formData.caste,
                    category: formData.category,
                    nationality: formData.nationality,
                    aadhaarNumber: formData.aadharNumber,
                    placeOfBirth: formData.placeOfBirth,
                    apaarNumber: formData.apaarNumber,
                    boardSeatNumber: formData.sscSeatNo,
                    grNumber: formData.grNumber,
                    admissionDate: formData.dateOfAdmission,
                    dateOfLeaving: formData.dateOfLeaving,
                    phoneNumber: formData.studentContact,
                    email: formData.studentEmail,
                    board: formData.sscBoard,
                    photo: formData.photo,
                academicInfo: {
                    
                    divisionId: formData.division,
                    classId: formData.class,
                    sectionId: formData.section,
                    previousSchool: formData.previousSchool,
                    roleNumber: formData.rollNumber ? parseInt(formData.rollNumber, 10) : null
                    },
                    
                parentInfo: {
                    father: {
                        
                        name: formData.fatherName,
                        phone: formData.fatherMobile,
                        email: formData.fatherEmail,
                        occupation: formData.fatherOccupation
                    },
                    mother: {
                        
                        name: formData.motherName,
                        phone: formData.motherMobile,
                        email: formData.motherEmail,
                        occupation: formData.motherOccupation
                    }
                },
                emergencyContact: {
                    
                    name: formData.emergencyName,
                    relationship: formData.emergencyRelation,
                    phone: formData.emergencyContact,
                    email: formData.emergencyEmail,
                    occupation: formData.emergencyOccupation
                },
                address: [
                    {
                     
                        type: "Correspondence",
                        add1: formData.correspondenceAddress1,
                        add2: formData.correspondenceAddress2 || '',
                        add3: formData.correspondenceAddress3 || '',
                        city: formData.correspondenceCity,
                        state: formData.correspondenceState,
                        pincode: formData.correspondencePincode
                    },
                    {
                        txnId: '', // Backend might generate this
                        type: "Permanent",
                        add1: formData.permanentAddress1,
                        add2: formData.permanentAddress2 || '',
                        add3: formData.permanentAddress3 || '',
                        city: formData.permanentCity,
                        state: formData.permanentState,
                        pincode: formData.permanentPincode
                    }
                ]
            };
    
            const response = await fetch(`${apiUrl}v1/students`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add new student');
            }
    
            const responseData = await response.json();
    
            // Show success message
            alert('New student has been successfully added');
    
            // Reset form and close dialog
            onClose();
        } catch (error) {
            console.error('Error creating student:', error);
            alert(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        if (!loading) {
            //  onreset();
            setPhotoPreview(null);
            onClose();
        }
    };


    // Callback to receive the cropped image from ImageCropper
    const handleImageCropped = (croppedImage: File) => {
        setPhotoFile(croppedImage);
        const previewUrl = URL.createObjectURL(croppedImage);
        setPhotoPreview(previewUrl);
        // setValue('photo', croppedImage); // Update the form value
    };
    const tabConfigurations = [
        {
            value: "general",
            label: "General Information",
            icon: <User className="mr-2 h-5 w-5" />,
            activeColor: "bg-blue-100",
            activeTextColor: "text-blue-700",

        },
        {
            value: "address",
            label: "Address Details",
            icon: <MapPin className="mr-2 h-5 w-5" />,
            activeColor: "bg-green-100",
            activeTextColor: "text-green-700"
        },
        {
            value: "parentInfo",
            label: "Parent Info",
            icon: <Users className="mr-2 h-5 w-5" />,
            activeColor: "bg-purple-100",
            activeTextColor: "text-purple-700"
        },
        {
            value: "academic",
            label: "Academic Info",
            icon: <BookOpen className="mr-2 h-5 w-5" />,
            activeColor: "bg-orange-100",
            activeTextColor: "text-orange-700"
        },
        {
            value: "emergency",
            label: "Emergency Contact",
            icon: <Shield className="mr-2 h-5 w-5" />,
            activeColor: "bg-red-100",
            activeTextColor: "text-red-700"
        }
    ];

    const objects = async () => {
        const token = localStorage.getItem("auth_token");
        try {
            const [classesResponse, sectionsResponse, divisionsResponse] = await Promise.all([
                fetch(`${apiUrl}v1/class`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${apiUrl}v1/section`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${apiUrl}v1/division`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
            ]);

            if (!classesResponse.ok || !sectionsResponse.ok || !divisionsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            // Parse the responses as JSON
            const classesData = await classesResponse.json();
            const sectionsData = await sectionsResponse.json();
            const divisionsData = await divisionsResponse.json();

            // Map the API data to the Select options format
            const classOptions = classesData.data.map((item: { txnId: any; name: any; }) => ({
                value: item.txnId,
                label: item.name
            }));
            const sectionOptions = sectionsData.data.map((item: { txnId: any; name: any; }) => ({
                value: item.txnId,
                label: item.name
            }));
            const divisionOptions = divisionsData.data.map((item: { txnId: any; name: any; }) => ({
                value: item.txnId,
                label: item.name
            }));

            // Update state with the options
            setClassOptions(classOptions);
            setSectionOptions(sectionOptions);
            setDivisionOptions(divisionOptions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        objects();
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="flex flex-col p-6 absolute top-0 left-0 right-0 inset-0 mx-auto max-w-full h-auto overflow-y-auto bg-white shadow-lg rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '1400px', width: '90%', height: '98vh' }}
                onPointerDownOutside={(e) => {
                    e.preventDefault(); // Prevent closing on click outside
                }}
                onInteractOutside={(e) => {
                    e.preventDefault(); // Prevent any interaction outside
                }}>
                <DialogHeader className="px-4 py-0 border-b sticky top-0">
                    <DialogTitle className="text-xl font-semibold font-montserrat">Add New Student</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto ">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid grid-cols-5">
                                {tabConfigurations.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className={`flex items-center justify-center  px-4 py-2  font-montserrat transition-all duration-300 
                                        ${activeTab === tab.value
                                                ? `${tab.activeColor} ${tab.activeTextColor} font-bold` : 'text-gray-600 hover:bg-gray-200'}
                                     rounded-md
                                     ${activeTab === tab.value ? 'scale-105' : 'scale-100'} `}
                                        onClick={() => setActiveTab(tab.value)}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="general" className="space-y-8">
                                {/* Photo Upload Section */}
                                <div className="flex gap-8 ">
                                    <div className="flex flex-col items-center space-y-4 mt-8">
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
                                    <div className="flex-1 space-y-8">
                                        <div className="grid grid-cols-4 gap-4 mt-5">
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Prefix</label>
                                                <EllipsisVertical className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Select
                                                    name="preffix"
                                                    value={formData.preffix}
                                                    onValueChange={(value) => handleInputChange({
                                                        target: { name: 'preffix', value }
                                                    } as React.ChangeEvent<HTMLSelectElement>)}
                                                >
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Prefix" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {preffixOptions.map((option) => (
                                                            <SelectItem key={option} value={option.toLowerCase()}>
                                                                {option}
                                                            </SelectItem>))}
                                                    </SelectContent>
                                                </Select>
                                                {/* {errors.preffix && <p className="text-red-500 text-sm mt-1">{errors.preffix.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">First Name</label>
                                                <User className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="firstName" value={formData.firstName}
                                                    onChange={handleInputChange} placeholder="First Name" className="pl-10 font-montserrat" />
                                                {/* {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Middle Name</label>
                                                <User className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Middle Name" className="pl-10 font-montserrat" />
                                                {/* {errors.middleName && <p className="text-red-500 text-sm mt-1">{errors.middleName.message}</p>} */}
                                            </div>

                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Last Name</label>
                                                <User className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="pl-10 font-montserrat" />
                                                {/* {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>} */}
                                            </div>


                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Gender</label>
                                                <GenderMale className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Select name="gender" value={formData.gender}
                                                    onValueChange={(value) => handleInputChange({
                                                        target: { name: 'gender', value }
                                                    } as React.ChangeEvent<HTMLSelectElement>)} >
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {/* {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>} */}
                                            </div>
                                          
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">
                                                    Date of Birth
                                                </label>
                                                <CalendarDaysIcon className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <CustomDatePicker
                                                    value={formData.dob ? new Date(formData.dob) : undefined}
                                                    onChange={(date: Date | undefined) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            dob: date ? date.toISOString() : '',
                                                        }));
                                                    }}
                                                    label="Date of Birth"
                                                    icon={<CalendarDaysIcon className="h-4 w-4 text-gray-500" />}
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Contact</label>
                                                <Phone className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="studentContact" value={formData.studentContact} onChange={handleInputChange} placeholder="Contact No" className="pl-10 font-montserrat" />
                                                {/* {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Email</label>
                                                <Email className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="studentEmail" value={formData.studentEmail} onChange={handleInputChange} placeholder="Email" className="pl-10 font-montserrat" />
                                                {/* {errors.studentEmail && <p className="text-red-500 text-sm mt-1">{errors.studentEmail.message}</p>} */}
                                            </div>


                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Blood Group</label>
                                                <Droplet className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Select
                                                    name="bloodGroup"
                                                    value={formData.bloodGroup}
                                                    onValueChange={(value) => handleInputChange({
                                                        target: { name: 'bloodGroup', value }
                                                    } as React.ChangeEvent<HTMLSelectElement>)}
                                                >
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Blood Group" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bloodGroupOptions.map((option) => (
                                                            <SelectItem key={option} value={option.toLocaleLowerCase()}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {/* {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">GR No.</label>
                                                <Hash className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="grNumber" value={formData.grNumber} onChange={handleInputChange} placeholder="GR Number" className="pl-10 font-montserrat" />
                                                {/* {errors.grNumber && <p className="text-red-500 text-sm mt-1">{errors.grNumber.message}</p>} */}
                                            </div>

                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">
                                                    Date of Admission
                                                </label>
                                                <CalendarDaysIcon className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <CustomDatePicker
                                                    value={formData.dateOfAdmission ? new Date(formData.dateOfAdmission) : undefined}
                                                    onChange={(date: Date | undefined) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            dateOfAdmission: date ? date.toISOString() : '',
                                                        }));
                                                    }}
                                                    label="Date of Admission"
                                                    icon={<CalendarDaysIcon className="h-4 w-4 text-gray-500" />}
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">
                                                    Date of Leaving
                                                </label>
                                                <CalendarDaysIcon className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <CustomDatePicker
                                                    value={formData.dateOfLeaving ? new Date(formData.dateOfLeaving) : undefined}
                                                    onChange={(date: Date | undefined) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            dateOfLeaving: date ? date.toISOString() : '',
                                                        }));
                                                    }}
                                                    label="Date of Admission"
                                                    icon={<CalendarDaysIcon className="h-4 w-4 text-gray-500" />}
                                                />
                                            </div>


                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Aadhar No.</label>
                                                <Hash className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} type="text" placeholder="Aadhar Number" className="pl-10 font-montserrat" />
                                                {/* {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Apaar No.</label>
                                                <Hash className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="apaarNumber" value={formData.apaarNumber} onChange={handleInputChange} type="text" placeholder="Aadhar Number" className="pl-10 font-montserrat" />
                                                {/* {errors.apaarNumber && <p className="text-red-500 text-sm mt-1">{errors.apaarNumber.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Nationality</label>
                                                <MapPin className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="nationality" value={formData.nationality} onChange={handleInputChange} type="text" placeholder="Place of Birth" className="pl-10 font-montserrat" />
                                                {/* {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Religion</label>
                                                <FontAwesomeIcon icon={faHandsPraying} className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Select
                                                    name="religion"
                                                    value={formData.religion}
                                                    onValueChange={(value) => handleInputChange({
                                                        target: { name: 'religion', value }
                                                    } as React.ChangeEvent<HTMLSelectElement>)}
                                                >
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select Religion" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {religionOptions.map((option) => (
                                                            <SelectItem key={option} value={option.toLocaleLowerCase()}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {/* {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Caste</label>
                                                <FontAwesomeIcon icon={faHandsPraying} className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Select
                                                    name="caste"
                                                    value={formData.caste}
                                                    onValueChange={(value) => handleInputChange({
                                                        target: { name: 'caste', value }
                                                    } as React.ChangeEvent<HTMLSelectElement>)}
                                                >
                                                    <SelectTrigger className="pl-10 font-montserrat">
                                                        <SelectValue placeholder="Select caste" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {casteOptions.map((option) => (
                                                            <SelectItem key={option} value={option.toLocaleLowerCase()}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {/* {errors.caste && <p className="text-red-500 text-sm mt-1">{errors.caste.message}</p>} */}
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Place of Birth</label>
                                                <MapPin className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} type="text" placeholder="Place of Birth" className="pl-10 font-montserrat" />
                                                {/* {errors.placeOfBirth && <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth.message}</p>} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </TabsContent>
                            {/* academic */}
                            <TabsContent value="academic" className="space-y-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Roll No.</label>
                                                <Hash className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                                <Input name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} placeholder="Roll Number" className="pl-10 font-montserrat" />
                                                {/* {errors.rollNumber && <p className="text-red-500 text-sm mt-1">{errors.rollNumber.message}</p>} */}
                                            </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Board</label>
                                        <Hash className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="sscBoard" value={formData.sscBoard} onChange={handleInputChange} type="text" placeholder='SSC Board' className="pl-10 font-montserrat" />
                                        {/* {errors.sscBoard && <p className="text-red-500 text-sm mt-1">{errors.sscBoard.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">SSC Seat No</label>
                                        <Hash className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="sscSeatNo" value={formData.sscSeatNo} onChange={handleInputChange} type="text" className="pl-10 font-montserrat" />
                                        {/* {errors.sscSeatNo && <p className="text-red-500 text-sm mt-1">{errors.sscSeatNo.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Category</label>
                                        <BookOpen className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Select
                                            name="category"
                                            value={formData.category}
                                            onValueChange={(value) => handleInputChange({
                                                target: { name: 'category', value }
                                            } as React.ChangeEvent<HTMLSelectElement>)}
                                        >
                                            <SelectTrigger className="pl-10 font-montserrat">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map((option) => (
                                                    <SelectItem key={option} value={option.toLocaleLowerCase()}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/* {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Section</label>
                                        <AdjustmentsHorizontalIcon className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Select
                                            name="section"
                                            value={formData.section}
                                            onValueChange={(value) => handleInputChange({
                                                target: { name: 'section', value }
                                            } as React.ChangeEvent<HTMLSelectElement>)}
                                        >
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
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Class</label>
                                        <BookOpen className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Select
                                            name="class"
                                            value={formData.class}
                                            onValueChange={(value) => handleInputChange({
                                                target: { name: 'class', value }
                                            } as React.ChangeEvent<HTMLSelectElement>)}
                                        >
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
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Division</label>
                                        <BookOpen className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Select
                                            name="division"
                                            value={formData.division}
                                            onValueChange={(value) => handleInputChange({
                                                target: { name: 'division', value }
                                            } as React.ChangeEvent<HTMLSelectElement>)}
                                        >
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
                                    </div>

                                </div>

                            </TabsContent>

                            {/* parentInfo */}
                            <TabsContent value="parentInfo" className="space-y-4 mb-4">

                                <div className="grid grid-cols-2 gap-4 mt-10">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Father Name</label>
                                        <Users className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="fatherName" value={formData.fatherName} onChange={handleInputChange} type="text" placeholder="Father's Name" className="pl-10 font-montserrat" />
                                        {/* {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>} */}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Father Occupation</label>
                                        <Building className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleInputChange} placeholder="Father's Occupation" className="pl-10 font-montserrat" />
                                        {/* {errors.fatherOccupation && <p className="text-red-500 text-sm mt-1">{errors.fatherOccupation.message}</p>} */}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Father Contact</label>
                                        <Phone className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="fatherMobile" value={formData.fatherMobile} onChange={handleInputChange} placeholder="Father's Mobile Number" className="pl-10 font-montserrat" />
                                        {/* {errors.fatherMobile && <p className="text-red-500 text-sm mt-1">{errors.fatherMobile.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Father Email</label>
                                        <Mail className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="fatherEmail" value={formData.fatherEmail} onChange={handleInputChange} type="email" placeholder="Father Email" className="pl-10 font-montserrat" />
                                        {/* {errors.fatherEmail && <p className="text-red-500 text-sm mt-1">{errors.fatherEmail.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Mother Name</label>
                                        <Users className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="Mother's Name" className="pl-10 font-montserrat" />
                                        {/* {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Mother Occupation</label>
                                        <Building className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="motherOccupation" value={formData.motherOccupation} onChange={handleInputChange} placeholder="Mother's Occupation" className="pl-10 font-montserrat" />
                                        {/* {errors.motherOccupation && <p className="text-red-500 text-sm mt-1">{errors.motherOccupation.message}</p>} */}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Mother Contact</label>
                                        <Phone className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="motherMobile" value={formData.motherMobile} onChange={handleInputChange} placeholder="Mother's Mobile Number" className="pl-10 font-montserrat" />
                                        {/* {errors.motherMobile && <p className="text-red-500 text-sm mt-1">{errors.motherMobile.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Mother Email</label>
                                        <Mail className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="motherEmail" value={formData.motherEmail} onChange={handleInputChange} type="email" placeholder="Mother Email" className="pl-10 font-montserrat" />
                                        {/* {errors.motherEmail && <p className="text-red-500 text-sm mt-1">{errors.motherEmail.message}</p>} */}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="address" className="space-y-4">
                                {/* Correspondence Address */}
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h3 className="font-medium">Correspondence Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Address 1</label>
                                            <Home className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="correspondenceAddress1" value={formData.correspondenceAddress1} onChange={handleInputChange} placeholder="Address 1" className="pl-10 font-montserrat text-black" />
                                            {/* {errors.correspondenceAddress1 && <p className="text-red-500 text-sm mt-1">{errors.correspondenceAddress1.message}</p>} */}
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Address 2</label>
                                            <Home className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="correspondenceAddress2" value={formData.correspondenceAddress2} onChange={handleInputChange} placeholder="Address Line 2" className="pl-10 font-montserrat text-black" />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Address 3</label>
                                            <Home className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="correspondenceAddress3" value={formData.correspondenceAddress3} onChange={handleInputChange} placeholder="Address Line 3" className="pl-10 text-black" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">City</label>
                                            <Building className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="correspondenceCity" value={formData.correspondenceCity} onChange={handleInputChange} placeholder="City" className="pl-10 text-black" />
                                            {/* {errors.correspondenceCity && <p className="text-red-500 text-sm mt-1">{errors.correspondenceCity.message}</p>} */}
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">state</label>
                                            <MapPin className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="correspondenceState" value={formData.correspondenceState} onChange={handleInputChange} placeholder="State" className="pl-10 text-black" />
                                            {/* {errors.correspondenceState && <p className="text-red-500 text-sm mt-1">{errors.correspondenceState.message}</p>} */}
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Pincode</label>
                                            <Hash className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="correspondencePincode" value={formData.correspondencePincode} onChange={handleInputChange} placeholder="Pincode" className="pl-10 text-black" />
                                            {/* {errors.correspondencePincode && <p className="text-red-500 text-sm mt-1">{errors.correspondencePincode.message}</p>} */}
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Address 1</label>
                                            <Home className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="permanentAddress1" value={formData.permanentAddress1} onChange={handleInputChange} placeholder="Address Line 1" className="pl-10 text-black" disabled={sameAddress} />
                                            {/* {errors.permanentAddress1 && <p className="text-red-500 text-sm mt-1">{errors.permanentAddress1.message}</p>} */}
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Address 2</label>
                                            <Home className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="permanentAddress2" value={formData.permanentAddress2} onChange={handleInputChange} placeholder="Address Line 2" className="pl-10 text-black" disabled={sameAddress} />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Address 3</label>
                                            <Home className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="permanentAddress3" value={formData.permanentAddress3} onChange={handleInputChange} placeholder="Address Line 3" className="pl-10 text-black" disabled={sameAddress} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">City</label>
                                            <Building className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="permanentCity" value={formData.permanentCity} onChange={handleInputChange} placeholder="City" className="pl-10 font-montserrat  text-black" disabled={sameAddress} />
                                            {/* {errors.permanentCity && <p className="text-red-500 text-sm mt-1">{errors.permanentCity.message}</p>} */}
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">State</label>
                                            <MapPin className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="permanentState" value={formData.permanentState} onChange={handleInputChange} placeholder="State" className="pl-10 font-montserrat text-black" disabled={sameAddress} />
                                            {/* {errors.permanentState && <p className="text-red-500 text-sm mt-1">{errors.permanentState.message}</p>} */}
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Pincode</label>
                                            <Hash className="absolute left-3 top-8 h-4 w-4  text-gray-500" />
                                            <Input name="permanentPincode" value={formData.permanentPincode} onChange={handleInputChange} placeholder="Pincode" className="pl-10 font-montserrat text-black" disabled={sameAddress} />
                                            {/* {errors.permanentPincode && <p className="text-red-500 text-sm mt-1">{errors.permanentPincode.message}</p>} */}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="emergency" className="space-y-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Name</label>
                                        <User className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} placeholder="Emergency Name" className="pl-10 font-montserrat" />
                                        {/* {errors.emergencyName && <p className="text-red-500 text-sm mt-1">{errors.emergencyName.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Relationship</label>
                                        <ChartRelationship className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="emergencyRelation" value={formData.emergencyRelation} onChange={handleInputChange} placeholder="Relationship" className="pl-10 font-montserrat" />
                                        {/* {errors.emergencyRelation && <p className="text-red-500 text-sm mt-1">{errors.emergencyRelation.message}</p>} */}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Contact No.</label>
                                        <Phone className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Contact Number" className="pl-10 font-montserrat" />
                                        {/* {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Email</label>
                                        <Email className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="emergencyEmail" value={formData.emergencyEmail} onChange={handleInputChange} placeholder="Email" className="pl-10 font-montserrat" />
                                        {/* {errors.emergencyEmail && <p className="text-red-500 text-sm mt-1">{errors.emergencyEmail.message}</p>} */}
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">Occupation</label>
                                        <Building className="absolute left-3 top-8 h-4 w-4 text-gray-500" />
                                        <Input name="emergencyOccupation" value={formData.emergencyOccupation} onChange={handleInputChange} placeholder="Occupation" className="pl-10 font-montserrat" />
                                        {/* {errors.emergencyOccupation && <p className="text-red-500 text-sm mt-1">{errors.emergencyOccupation.message}</p>} */}
                                    </div>
                                </div>
                            </TabsContent>

                        </Tabs>

                        <DialogFooter className="absolute bottom-0 left-0 right-0  flex gap-2 justify-self-start p-4 ">
                            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700  text-sm px-3 py-1 font-montserrat">
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Saving...' : 'Save Student'}
                            </Button>
                            <Button type="button" disabled={loading} onClick={handleClose} className="bg-red-600 hover:bg-red-700 text-white  text-sm px-3 py-1 font-montserrat">
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