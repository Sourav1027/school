import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddClass from './addclass';

interface Section {
    id: string;
    name: string;
    classes: {
        id: string;
        class: string;
        division: string;
        section: string;
        subjects: string[];
    }[];
}

const Data: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([
        {
            id: '1',
            name: 'Main',
            classes: [
                { 
                    id: 'class1',
                    class: '5', 
                    division: 'A', 
                    section: 'Bio', 
                    subjects: ['hindi', 'english'] 
                },
                { 
                    id: 'class2',
                    class: '6', 
                    division: 'B', 
                    section: 'CS', 
                    subjects: ['math', 'science'] 
                }
            ]
        },
    ]);

    const [editingClass, setEditingClass] = useState<string | null>(null);
    const [newClass, setNewClass] = useState<string>('');
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
    const [recordsPerPage, setRecordsPerPage] = useState('5');
    const [totalRecords, setTotalRecords] = useState(sections.reduce((total, section) => total + section.classes.length, 0));
    const [currentPage, setCurrentPage] = useState(1);

    const handleAddClassCustom = (sectionId: string) => {
        setEditingClass(sectionId);
        setNewClass('');
    };

    const handleSaveClass = (sectionId: string) => {
        const classNumber = parseInt(newClass);
        if (!isNaN(classNumber) && classNumber > 0 && classNumber <= 12) {
            // Prompt for division
            const division = prompt('Enter Division (e.g., A, B, C):');
            const section = prompt('Enter Section (e.g., Science, Arts):');

            if (division && section) {
                setSections(sections.map(sec => {
                    if (sec.id === sectionId) {
                        // Check if class already exists
                        const classExists = sec.classes.some(
                            cls => cls.class === newClass &&
                                   cls.division === division &&
                                   cls.section === section
                        );

                        if (!classExists) {
                            const newClassEntry = {
                                id: `class_${Date.now()}`,
                                class: newClass,
                                division,
                                section,
                                subjects: []
                            };

                            return {
                                ...sec,
                                classes: [...sec.classes, newClassEntry]
                                    .sort((a, b) => parseInt(a.class) - parseInt(b.class)),
                            };
                        } else {
                            alert('This class already exists in the section!');
                            return sec;
                        }
                    }
                    return sec;
                }));
            }
        } else {
            alert('Please enter a valid class number between 1 and 12');
        }
        setEditingClass(null);
        setNewClass('');
    };

    const handleCancelAdd = () => {
        setEditingClass(null);
        setNewClass('');
    };

    const handleRemoveClass = (sectionId: string, classToRemove: {
        id: string;
        class: string;
        division: string;
        section: string;
        subjects: string[];
    }) => {
        const confirmRemove = window.confirm("Are you sure you want to remove this class?");

        if (confirmRemove) {
            setSections(sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        classes: section.classes.filter(cls => cls.id !== classToRemove.id),
                    };
                }
                return section;
            }));
            alert("Class removed successfully!");
        }
    };

    const handleEditClasses = (sectionId: string) => {
        setEditingSection(sectionId);
    };

    const handleSaveEdit = () => {
        setEditingSection(null);
        alert('Changes saved successfully!');
    };

    const handleAddClass = () => {
        setIsAddClassDialogOpen(true);
    };

    const handleCloseAddClassDialog = () => {
        setIsAddClassDialogOpen(false);
    };

    const handleAddClassSubmit = (classData: {
        class: string;
        division: string;
        section: string;
        subjects: string[];
    }) => {
        // Check if the section already exists
        const existingSectionIndex = sections.findIndex(section =>
            section.name === classData.section
        );

        if (existingSectionIndex !== -1) {
            // Update existing section
            const updatedSections = [...sections];
            updatedSections[existingSectionIndex] = {
                ...updatedSections[existingSectionIndex],
                classes: [
                    ...updatedSections[existingSectionIndex].classes,
                    {
                        id: `class_${Date.now()}`,
                        class: classData.class,
                        division: classData.division,
                        section: classData.section,
                        subjects: classData.subjects,
                    }
                ]
            };
            setSections(updatedSections);
        } else {
            // Create new section
            const newSection: Section = {
                id: `section_${Date.now()}`,
                name: classData.section,
                classes: [{
                    id: `class_${Date.now()}`,
                    class: classData.class,
                    division: classData.division,
                    section: classData.section,
                    subjects: classData.subjects,
                }]
            };
            setSections([...sections, newSection]);
        }

        // Update total records
        setTotalRecords(prevTotal => prevTotal + 1);

        alert('Class added successfully!');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm mt-3">
            {/* Header Section */}
            <div className='mb-2'>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Section Management</h2>
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search sections..."
                            className="pl-10 w-[250px] bg-white border-gray-200 shadow-sm font-montserrat"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <Select value={recordsPerPage} onValueChange={setRecordsPerPage}>
                        <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
                            <SelectValue placeholder="Records per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 records per page</SelectItem>
                            <SelectItem value="10">10 records per page</SelectItem>
                            <SelectItem value="20">20 records per page</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        className="h-8 text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleAddClass}
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Class
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[100px] py-4 px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Sr No</TableHead>
                            <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Section Name</TableHead>
                            <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r font-montserrat">Class</TableHead>
                            <TableHead className="w-[180px] py-4 px-6 text-gray-700 font-semibold border-b font-montserrat">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections.map((section, sectionIndex) => (
                            <TableRow key={section.id} className={sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <TableCell className="py-4 px-6 text-center border-r font-medium text-gray-600 font-montserrat">
                                    {(currentPage - 1) * parseInt(recordsPerPage) + sectionIndex + 1}
                                </TableCell>
                                <TableCell className="py-4 px-6 border-r text-gray-700 font-montserrat">{section.name}</TableCell>
                                <TableCell className="py-4 px-6 border-r font-montserrat">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {section.classes.map((cls) => (
                                            <div key={cls.id} className="flex items-center gap-1">
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium font-montserrat">
                                                    {cls.class} {cls.division} - {cls.section}
                                                    {cls.subjects && cls.subjects.length > 0 && (
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            ({cls.subjects.join(", ")})
                                                        </span>
                                                    )}
                                                </span>
                                                {editingSection === section.id && (
                                                    <XMarkIcon
                                                        className="w-4 h-4 text-red-500 cursor-pointer"
                                                        onClick={() => handleRemoveClass(section.id, cls)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        {editingClass === section.id && (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="12"
                                                    value={newClass}
                                                    onChange={(e) => setNewClass(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveClass(section.id);
                                                        if (e.key === 'Escape') handleCancelAdd();
                                                    }}
                                                    className="w-20 h-8 text-sm font-montserrat"
                                                    placeholder="1-12"
                                                    autoFocus
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSaveClass(section.id)}
                                                    className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white font-montserrat"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleCancelAdd}
                                                    className="h-8 px-2 bg-gray-500 hover:bg-gray-600 text-white font-montserrat"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-200 hover:bg-blue-50 text-blue-600 font-montserrat"
                                            onClick={() => handleAddClassCustom(section.id)}
                                            disabled={editingClass !== null}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </Button>
                                        {editingSection === section.id ? (
                                            <Button
                                                size="sm"
                                                onClick={handleSaveEdit}
                                                className="bg-green-500 hover:bg-green-600 text-white font-montserrat"
                                            >
                                                Save
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-montserrat"
                                                onClick={() => handleEditClasses(section.id)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-600 font-montserrat">
                    Showing {Math.min((currentPage - 1) * parseInt(recordsPerPage) + 1, totalRecords)} to{' '}
                    {Math.min(currentPage * parseInt(recordsPerPage), totalRecords)} of {totalRecords} entries
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled
                        className="border-gray-200 text-gray-600 font-montserrat"
                    >
                        ← Previous
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-montserrat">1</Button>
                    <Button
                        variant="outline"
                        disabled
                        className="border-gray-200 text-gray-600 font-montserrat"
                    >
                        Next →
                    </Button>
                </div>
            </div>
            <AddClass
                isOpen={isAddClassDialogOpen}
                onClose={handleCloseAddClassDialog}
                onAddClass={handleAddClassSubmit}
            />
        </div>
    );
};

export default Data;
