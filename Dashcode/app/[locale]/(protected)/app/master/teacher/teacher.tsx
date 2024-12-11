'use client'
import React, { useState } from 'react';
import Data from './data';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/solid';
import AddTeacherForm from './addTeacherForm';



const Teacher = () =>{
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddRole = () =>{
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () =>{
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div>
      <Button className=" h-8 text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white  " onClick={handleAddRole}>
        <PlusIcon className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>
      <Data />
      <AddTeacherForm 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Teacher;