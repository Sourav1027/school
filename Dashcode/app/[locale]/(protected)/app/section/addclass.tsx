import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from '@/components/ui/checkbox';
import { Save, X } from 'lucide-react';

interface AddClassProps {
    isOpen: boolean;
    onClose: () => void;
    onAddClass?: (classData: any) => void;
    editData?: any;
}

interface ClassItem {
    txnId: string;
    name: string;
}

interface SectionItem {
    txnId: string;
    name: string;
}

interface DivisionItem {
    txnId: string;
    name: string;
}

interface SubjectItem {
    txnId: string;
    name: string;
}

const AddClass: React.FC<AddClassProps> = ({
    isOpen,
    onClose,
    onAddClass,
    editData
}) => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [sections, setSections] = useState<SectionItem[]>([]);
    const [divisions, setDivisions] = useState<DivisionItem[]>([]);
    const [subject, setSubject] = useState<SubjectItem[]>([]);

    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // API Configuration
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const token = localStorage.getItem("auth_token");

    // Fetch classes and divisions
    const fetchClassesAndDivisions = async () => {
        try {
            const [classesResponse, sectionsResponse, divisionsResponse, subjectResponse] = await Promise.all([
                fetch(`${apiUrl}v1/class`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${apiUrl}v1/section`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${apiUrl}v1/division`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`${apiUrl}v1/subject`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
            ]);

            if (!classesResponse.ok || !sectionsResponse.ok || !divisionsResponse.ok || !subjectResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const classesData = await classesResponse.json();
            const sectionsData = await sectionsResponse.json();
            const divisionsData = await divisionsResponse.json();
            const subjectData = await subjectResponse.json();

            setClasses(classesData.data);
            setSections(sectionsData.data);
            setDivisions(divisionsData.data);
            setSubject(subjectData.data);

            if (editData) {
                setSelectedSection(editData.sectionId);
                setSelectedClass(editData.classId);
                setSelectedDivision(editData.divisionId);
                setSelectedSubject(editData.subject.map((s: any) => s.subjectId));
            }
        } catch (error) {
            console.error('Error fetching classes or divisions:', error);
            alert('Unable to load classes, sections, and divisions');
        }
    };

    // Fetch data when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchClassesAndDivisions();
        }
    }, [isOpen, editData]);

    // POST Method for Adding New Section Setup
    const postNewSectionSetup = async () => {
        setLoading(true);

        const classData = {
            sectionId: selectedSection,
            classId: selectedClass,
            divisionId: selectedDivision,
            subject: selectedSubject.map((subjectId, index) => ({
                subjectId,
                orderBy: index + 1,
            })),
        };

        try {
            const response = await fetch(`${apiUrl}v1/sectionSetup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classData),
            });

            if (!response.ok) {
                throw new Error('Failed to add new class');
            }

            // Show success message
            alert('New class has been successfully added');

            // Call onAddClass callback if provided
            onAddClass && onAddClass(classData);

            // Close the dialog
            onClose();
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Unable to add class');
        } finally {
            setLoading(false);
        }
    };

    // PUT Method for Updating Existing Section Setup
    const updateExistingSectionSetup = async () => {
        setLoading(true);

        const classData = {
            sectionId: selectedSection,
            classId: selectedClass,
            divisionId: selectedDivision,
            subject: selectedSubject.map((subjectId, index) => ({
                subjectId,
                orderBy: index + 1,
            })),
        };

        try {
            const response = await fetch(`${apiUrl}v1/sectionSetup/${editData.txnId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classData),
            });

            if (!response.ok) {
                throw new Error('Failed to update the class');
            }

            // Show success message
            alert('Section setup updated successfully');

            // Call onAddClass callback if provided
            onAddClass && onAddClass(classData);

            // Close the dialog
            onClose();
        } catch (error) {
            console.error('Error updating class:', error);
            alert('Unable to update class');
        } finally {
            setLoading(false);
        }
    };

    // Unified Submit Function that Decides Between POST and PUT
    const handleSubmitOrUpdateClass = () => {
        // Reset form state
        if (editData) {
            updateExistingSectionSetup();
        } else {
            postNewSectionSetup();
        }
    };

    const handleCancel = () => {
        setSelectedClass(null);
        setSelectedDivision(null);
        setSelectedSection(null);
        setSelectedSubject([]);
        onClose();
    };

    const handleSubjectChange = (txnId: string) => {
        setSelectedSubject((prev) =>
            prev.includes(txnId) ? prev.filter((id) => id !== txnId) : [...prev, txnId]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Class' : 'Add Class'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Section */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="section">Section</Label>
                        <Select value={selectedSection || undefined} onValueChange={setSelectedSection}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map((sectionItem) => (
                                    <SelectItem key={sectionItem.txnId} value={sectionItem.txnId}>
                                        {sectionItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Class */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class">Class</Label>
                        <Select value={selectedClass || undefined} onValueChange={setSelectedClass}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((classItem) => (
                                    <SelectItem key={classItem.txnId} value={classItem.txnId}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Division */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="division">Division</Label>
                        <Select value={selectedDivision || undefined} onValueChange={setSelectedDivision}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Division" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisions.map((divisionItem) => (
                                    <SelectItem key={divisionItem.txnId} value={divisionItem.txnId}>
                                        {divisionItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Subject */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject">Subjects</Label>
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                {subject.map((subjectItem) => (
                                    <div key={subjectItem.txnId} className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`subject-${subjectItem.txnId}`}
                                            checked={selectedSubject.includes(subjectItem.txnId)}
                                            onCheckedChange={() => handleSubjectChange(subjectItem.txnId)}
                                        />
                                        <label>{subjectItem.name}</label>
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCancel} variant="outline">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitOrUpdateClass} disabled={loading} >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Processing...' : (editData ? 'Update' : 'Save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 

export default AddClass;