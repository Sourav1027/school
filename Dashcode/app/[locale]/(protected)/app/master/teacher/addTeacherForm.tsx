import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, MapPin, Building2, Map, BookOpen, GraduationCap, Calendar, Save, X, KeyRound, Droplet, User2 } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { GenderMale } from '@carbon/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsPraying } from '@fortawesome/free-solid-svg-icons';


interface AddTeacherFormProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TeacherFormData {
    section: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    religion: string;
    address: string;
    subject: string;
    qualification: string;
    joiningDate: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    role: 'teacher' | 'office' | 'admin';
    releavingDate: string;
    dob: string;
}

const AddTeacherForm: React.FC<AddTeacherFormProps> = ({ isOpen, onClose }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TeacherFormData>({
        defaultValues: {
            section: '',
            name: '',
            email: '',
            password: '',
            phone: '',
            religion: '',
            address: '',
            subject: '',
            qualification: '',
            joiningDate: '',
            gender: 'male',
            bloodGroup: 'A+',
            role: 'teacher',
            releavingDate: '',
            dob: '',
        },
    });

    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<TeacherFormData> = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch('/api/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add teacher');
            }

            toast({
                title: "Success",
                description: "Teacher added successfully!",
            });

            reset(); // Reset the form on successful submission
            onClose(); // Close the dialog
        } catch (error) {
            console.error('Error adding teacher:', error);
            toast({
                title: "Error",
                description: "Failed to add teacher. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset(); // Reset the form when canceling
        onClose(); // Close the dialog
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="absolute top-0 left-0 right-0 mx-auto max-w-full h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '1200px', width: '90%' }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Add New Teacher
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">

                        {/* Teacher Section */}
                        <div className="space-y-2">
                            <Label htmlFor="section">Section</Label>
                            <div className="relative">
                                <Select {...register("section", { required: "Section is required" })}>
                                    <SelectTrigger className="pl-10" >
                                        <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="english">English</SelectItem>
                                        <SelectItem value="hindi">Hindi</SelectItem>
                                        <SelectItem value="none">None</SelectItem>
                                    </SelectContent>
                                </Select>
                                <AdjustmentsHorizontalIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.section && <span className="text-red-500 text-sm">{errors.section.message}</span>}
                        </div>


                        {/* Teacher Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    {...register("name", { required: "Full name is required" })}
                                    placeholder="Enter full name"
                                    className="pl-10 text-black"
                                />
                                <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                    placeholder="Enter email address"
                                    className="pl-10 text-black"
                                />
                                <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password", { required: "Password is required" })}
                                    placeholder="Enter password address"
                                    className="pl-10 text-black"
                                />
                                <KeyRound className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Input
                                    id="phone"
                                    {...register("phone", { required: "Phone number is required" })}
                                    placeholder="Enter phone number"
                                    className="pl-10 text-black"
                                />
                                <Phone className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                        </div>

                        {/* Religion */}
                        <div className="space-y-2">
                            <Label htmlFor="religion">Religion</Label>
                            <div className="relative">
                                <Input
                                    id="religion"
                                    type="religion"
                                    {...register("religion", { required: "Religion is required" })}
                                    placeholder="Enter religion address"
                                    className="pl-10 text-black"
                                />
                                <FontAwesomeIcon icon={faHandsPraying} className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.religion && <span className="text-red-500 text-sm">{errors.religion.message}</span>}
                        </div>
                        {/* Gender */}
                        <div className="space-y-2 text-black">
                            <Label htmlFor="gender">Gender</Label>
                            <div className="relative">
                                <Select {...register("gender", { required: "Gender is required" })}>
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger >
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <GenderMale className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.gender && <span className="text-red-500 text-sm">{errors.gender.message}</span>}
                        </div>


                        {/* Dob */}
                        <div className="space-y-2">
                            <Label htmlFor="dob">DOB</Label>
                            <div className="relative">
                                <Input id="dob" type="date"{...register("dob",
                                    { required: "DOB is required" })} className="pl-10 text-black"
                                />
                                <Calendar className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
                        </div>
                        {/* Blood group */}
                        <div className="space-y-2">
                            <Label htmlFor="bloodGroup">Blood Group</Label>
                            <div className="relative">
                                <Select {...register("bloodGroup", { required: "Blood Group is required" })}>
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Droplet className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.bloodGroup && <span className="text-red-500 text-sm">{errors.bloodGroup.message}</span>}
                        </div>

                        {/* Role */}
                        <div className="space-y-2 text-black">
                            <Label htmlFor="role">Role</Label>
                            <div className="relative">
                                <Select {...register("role", { required: "Role is required" })}>

                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="office">Office</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <User2 className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
                        </div>


                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <div className="relative">
                                <Input
                                    id="subject"
                                    {...register("subject", { required: "Subject is required" })}
                                    placeholder="Enter subject"
                                    className="pl-10 text-black"
                                />
                                <BookOpen className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
                        </div>


                        {/* Joining Date */}
                        <div className="space-y-2">
                            <Label htmlFor="joiningDate">Joining Date</Label>
                            <div className="relative">
                                <Input
                                    id="joiningDate"
                                    type="date"
                                    {...register("joiningDate", { required: "Joining date is required" })}
                                    className="pl-10 text-black"
                                />
                                <Calendar className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.joiningDate && <span className="text-red-500 text-sm">{errors.joiningDate.message}</span>}
                        </div>
                        {/* Re-Leaving Date */}
                        <div className="space-y-2">
                            <Label htmlFor="releavingDate">Re-Leaving Date</Label>
                            <div className="relative">
                                <Input
                                    id="releavingDate"
                                    type="date"
                                    {...register("releavingDate", { required: "Re-Leaving Date is required" })}
                                    className="pl-10 text-black"
                                />
                                <Calendar className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.releavingDate && <span className="text-red-500 text-sm">{errors.releavingDate.message}</span>}
                        </div>
                          {/* Address */}
                          <div className="col-span-2 space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <div className="relative">
                                <Input
                                    id="address"
                                    {...register("address", { required: "Address is required" })}
                                    placeholder="Enter full address"
                                    className="pl-10 text-black"
                                />
                                <MapPin className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                            </div>
                            {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                        </div>

                    </div>

                    <DialogFooter className="mt-6 flex gap-2 justify-self-start">
                    <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 h-8 text-sm px-3 py-1"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Teacher'}
                        </Button>
                    <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white h-8 text-sm px-3 py-1"
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

export default AddTeacherForm;
