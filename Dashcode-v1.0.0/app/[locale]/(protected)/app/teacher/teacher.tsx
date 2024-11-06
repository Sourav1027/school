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
        <Button className="p-6 ml-4 flex items-center " onClick={handleAddRole}>
        <PlusIcon className="w-5 h-5 mr-2" />
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