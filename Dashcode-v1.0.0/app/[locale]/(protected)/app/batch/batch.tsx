'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/solid';
import AddBatch from './addBatch';



const Batch = () =>{
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddRole = () =>{
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () =>{
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex gap-2 justify-self-start">
        <Button className=" h-8 text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white  " onClick={handleAddRole}>
        <PlusIcon className="w-4 h-4 mr-2" />
          Add Batch
        </Button>
      </div>
      <AddBatch 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default Batch;