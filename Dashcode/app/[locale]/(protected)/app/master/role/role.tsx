'use client'
import React, { useState } from 'react';
import Data from './data';
import { Button } from '@/components/ui/button';
import DialogFormOpen from './dialogform';
import { PlusIcon } from '@heroicons/react/24/solid';



const Role = () =>{
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
        <Button className="p-6 ml-6 flex items-center" onClick={handleAddRole}>
        <PlusIcon className="w-5 h-5 mr-2" />
          Add Role
        </Button>
      </div>
      <Data />
      <DialogFormOpen 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Role;