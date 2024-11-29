import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { X, Save } from 'lucide-react';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;

interface SubModule {
  name: string;
  permissions: {
    read: boolean;
    write: boolean;
  };
}

interface Module {
  name: string;
  subModules: SubModule[];
}

interface DialogFormOpenProps {
  isOpen: boolean;
  onClose: () => void;
}

const DialogFormOpen: React.FC<DialogFormOpenProps> = ({ isOpen, onClose }) => {
  const [roleName, setRoleName] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([
    {
      name: 'Settings',
      subModules: [
        { name: 'Profile', permissions: { read: false, write: false } },
      ],
    },
    {
      name: 'Master',
      subModules: [
        { name: 'Student', permissions: { read: false, write: false } },
        { name: 'Class', permissions: { read: false, write: false } },
        { name: 'Division', permissions: { read: false, write: false } },
        { name: 'Subject', permissions: { read: false, write: false } },
      ],
    },
    {
      name: 'Exams',
      subModules: [
        { name: 'Subject', permissions: { read: false, write: false } },
      ],
    },
  ]);

  const handleRoleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(event.target.value);
  };

  const handlePermissionChange = (moduleIndex: number, subModuleIndex: number, permission: 'read' | 'write') => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        subModules: [...newModules[moduleIndex].subModules]
      };
      newModules[moduleIndex].subModules[subModuleIndex] = {
        ...newModules[moduleIndex].subModules[subModuleIndex],
        permissions: {
          ...newModules[moduleIndex].subModules[subModuleIndex].permissions,
          [permission]: !newModules[moduleIndex].subModules[subModuleIndex].permissions[permission]
        }
      };
      return newModules;
    });
  };

  const handleAllPermissions = (moduleIndex: number, checked: boolean) => {
    setModules(prevModules => {
      const newModules = [...prevModules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        subModules: newModules[moduleIndex].subModules.map(subModule => ({
          ...subModule,
          permissions: {
            read: checked,
            write: checked
          }
        }))
      };
      return newModules;
    });
  };

  const resetForm = () => {
    setRoleName('');
    setModules([
      {
        name: 'Settings',
        subModules: [
          { name: 'Profile', permissions: { read: false, write: false } },
        ],
      },
      {
        name: 'Master',
        subModules: [
          { name: 'Student', permissions: { read: false, write: false } },
          { name: 'Class', permissions: { read: false, write: false } },
          { name: 'Division', permissions: { read: false, write: false } },
          { name: 'Subject', permissions: { read: false, write: false } },
        ],
      },
      {
        name: 'Exams',
        subModules: [
          { name: 'Subject', permissions: { read: false, write: false } },
        ],
      },
    ]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Role Name:', roleName);
    console.log('Modules:', modules);
    onClose();
    resetForm(); // Reset form on save
  };

  return (
    <AlertDialog open={isOpen}>
 <AlertDialogContent
    className="absolute top-0 left-0 right-0 mx-auto max-w-4xl h-auto p-6 overflow-y-auto bg-white shadow-lg rounded-lg"
    style={{ marginTop: '0px', transform: 'none' }}> 
       <AlertDialogTitle className="h-2 mb-4">Add Role</AlertDialogTitle>
        <AlertDialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                Role Name
              </label>
              <Input
                id="roleName"
                type="text"
                value={roleName}
                onChange={handleRoleNameChange}
                className="w-1/4 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter role name"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Module</th>
                    <th className="px-4 py-2 border-b text-left">SubModule</th>
                    <th className="px-4 py-2 border-b text-center">Read</th>
                    <th className="px-4 py-2 border-b text-center">Write</th>
                    <th className="px-4 py-2 border-b text-center">All</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module, moduleIndex) => (
                    <React.Fragment key={module.name}>
                      {module.subModules.map((subModule, subModuleIndex) => (
                        <tr key={subModule.name}>
                          {subModuleIndex === 0 && (
                            <td
                              rowSpan={module.subModules.length}
                              className="px-4 py-2 font-medium border-b text-left"
                            >
                              {module.name}
                            </td>
                          )}
                          <td className="px-4 py-2 border-b text-left">{subModule.name}</td>
                          <td className="px-4 py-2 border-b text-center">
                            <Checkbox
                              checked={subModule.permissions.read}
                              onCheckedChange={() => handlePermissionChange(moduleIndex, subModuleIndex, 'read')}
                              className="text-blue-500 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            <Checkbox
                              checked={subModule.permissions.write}
                              onCheckedChange={() => handlePermissionChange(moduleIndex, subModuleIndex, 'write')}
                              className="text-blue-500 focus:ring-blue-500"
                            />
                          </td>
                          {subModuleIndex === 0 && (
                            <td
                              rowSpan={module.subModules.length}
                              className="px-4 py-2 border-b text-center"
                            >
                              <Checkbox
                                checked={module.subModules.every(
                                  (sub) => sub.permissions.read && sub.permissions.write
                                )}
                                onCheckedChange={(checked) =>
                                  handleAllPermissions(moduleIndex, checked === true)
                                }
                                className="text-blue-500 focus:ring-blue-500"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg mr-2"
                onClick={() => {
                  onClose();
                  resetForm(); // Reset form on cancel
                }}
              >
                <X className="mr-2 h-5 w-5" /> 
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
              >
                <Save className="mr-2 h-5 w-5" />
                Save
              </Button>
            </div>
          </form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogFormOpen;
