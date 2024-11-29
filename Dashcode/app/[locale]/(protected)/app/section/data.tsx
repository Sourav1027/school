import React, { useState } from 'react';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import CustomSnackbar from '../others/snackbar';
import Swal from 'sweetalert2';

interface Section {
    id: number;
    name: string;
    classes: number[];
}

const Data: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([
        { id: 1, name: 'Hindi', classes: [5, 6, 7, 8, 9, 10] },
        { id: 2, name: 'English', classes: [5, 6, 7, 8, 9, 10] },
        { id: 3, name: 'Marathi', classes: [5] },
    ]);

    const [editingClass, setEditingClass] = useState<number | null>(null);
    const [newClass, setNewClass] = useState<string>('');
    const [editingSection, setEditingSection] = useState<number | null>(null);
 

    const handleAddClass = (sectionId: number) => {
        setEditingClass(sectionId);
        setNewClass('');
    };

    const handleSaveClass = (sectionId: number) => {
        const classNumber = parseInt(newClass);
        if (!isNaN(classNumber) && classNumber > 0 && classNumber <= 12) {
            setSections(sections.map(section => {
                if (section.id === sectionId) {
                    if (!section.classes.includes(classNumber)) {
                        return {
                            ...section,
                            classes: [...section.classes, classNumber].sort((a, b) => a - b),
                        };
                    }
                }
                return section;
            }));
        }
        setEditingClass(null);
        setNewClass('');
    };

    const handleCancelAdd = () => {
        setEditingClass(null);
        setNewClass('');
    };

    const handleKeyPress = (e: React.KeyboardEvent, sectionId: number) => {
        if (e.key === 'Enter') {
            handleSaveClass(sectionId);
        } else if (e.key === 'Escape') {
            handleCancelAdd();
        }
    };

    const handleRemoveClass = async (sectionId: number, classToRemove: number) => {
        const result = await CustomSnackbar(
            "Are you sure?",
            "Do you really want to remove this class?",
            "Yes, delete it!",
            "No, cancel"
        );

        if (result.isConfirmed) {
            setSections(sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        classes: section.classes.filter(classNum => classNum !== classToRemove),
                    };
                }
                return section;
            }));
            Swal.fire("Deleted!", "The class has been removed.", "success");
        } else {
            Swal.fire("Cancelled", "The class was not removed.", "error");
        }
    };

    const handleEditClasses = (sectionId: number) => {
        setEditingSection(sectionId);
    };

    const handleSaveEdit = () => {
        setEditingSection(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm mt-3">
            {/* Header Section */}
            <div className='mb-2'>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Section Management</h2>
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search sections..."
                            className="pl-10 w-[250px] bg-white border-gray-200 shadow-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <Select defaultValue="5">
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
                                <SelectValue placeholder="Records per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 records per page</SelectItem>
                                <SelectItem value="10">10 records per page</SelectItem>
                                <SelectItem value="20">20 records per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[100px] py-4 px-6 text-gray-700 font-semibold border-b border-r">Sr No</TableHead>
                            <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r">Section Name</TableHead>
                            <TableHead className="py-4 px-6 text-gray-700 font-semibold border-b border-r">Class</TableHead>
                            <TableHead className="w-[180px] py-4 px-6 text-gray-700 font-semibold border-b">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections.map((section, index) => (
                            <TableRow key={section.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <TableCell className="py-4 px-6 border-r font-medium text-gray-900">{section.id}</TableCell>
                                <TableCell className="py-4 px-6 border-r text-gray-700">{section.name}</TableCell>
                                <TableCell className="py-4 px-6 border-r">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {section.classes.map((classNum) => (
                                            <div key={classNum} className="flex items-center gap-1">
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    Class {classNum}
                                                </span>
                                                {editingSection === section.id && (
                                                    <XMarkIcon
                                                        className="w-4 h-4 text-red-500 cursor-pointer"
                                                        onClick={() => handleRemoveClass(section.id, classNum)}
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
                                                    onKeyDown={(e) => handleKeyPress(e, section.id)}
                                                    className="w-20 h-8 text-sm"
                                                    placeholder="1-12"
                                                    autoFocus
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSaveClass(section.id)}
                                                    className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleCancelAdd}
                                                    className="h-8 px-2 bg-gray-500 hover:bg-gray-600 text-white"
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
                                            className="border-blue-200 hover:bg-blue-50 text-blue-600"
                                            onClick={() => handleAddClass(section.id)}
                                            disabled={editingClass !== null}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </Button>
                                        {editingSection === section.id ? (
                                            <Button
                                                size="sm"
                                                onClick={handleSaveEdit}
                                                className="bg-green-500 hover:bg-green-600 text-white"
                                            >
                                                Save
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white"
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
                <div className="text-sm text-gray-600">
                    Showing 1 to {sections.length} of {sections.length} entries
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled
                        className="border-gray-200 text-gray-600"
                    >
                        ← Previous
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">1</Button>
                    <Button
                        variant="outline"
                        disabled
                        className="border-gray-200 text-gray-600"
                    >
                        Next →
                    </Button>
                </div>
            </div>
          
        </div>
    );
};

export default Data;
