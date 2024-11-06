"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Add gender to TeacherData interface
export interface TeacherData {
  id: string | number;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  joiningDate: string;
  qualification: string;
  status: "active" | "inactive" | "on-leave";
  gender: "male" | "female" | "other";
  avatar?: string;
}

// Default avatar URLs based on gender
const defaultAvatars = {
  male: "/avatars/male-avatar.png",  // Replace with your male avatar path
  female: "/avatars/female-avatar.png", // Replace with your female avatar path
  other: "/avatars/default-avatar.png"  // Replace with your default avatar path
};

export const columns: ColumnDef<TeacherData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="xl:w-16">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "teacherId",
    header: "Teacher ID",
    cell: ({ row }) => <span>{row.getValue("teacherId")}</span>,
  },
  {
    accessorKey: "name",
    header: "Teacher Name",
    cell: ({ row }) => {
      const teacher = row.original;
      const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
      };

      // Get appropriate avatar based on gender
      const avatarSrc = teacher.avatar || defaultAvatars[teacher.gender];

      // Get background color based on gender for fallback
      const getFallbackColor = (gender: string) => {
        switch(gender) {
          case 'male':
            return 'bg-blue-100';
          case 'female':
            return 'bg-pink-100';
          default:
            return 'bg-gray-100';
        }
      };

      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <Avatar className={cn(
              "rounded-full w-8 h-8 shadow-sm border-2 border-white",
              getFallbackColor(teacher.gender)
            )}>
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} alt={teacher.name} className="object-cover" />
              ) : (
                <AvatarFallback className={getFallbackColor(teacher.gender)}>
                  {getInitials(teacher.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-default-600 whitespace-nowrap">
                {teacher.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)}
              </span>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span>{row.getValue("subject")}</span>,
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
    cell: ({ row }) => <span>{row.getValue("qualification")}</span>,
  },
  {
    accessorKey: "joiningDate",
    header: "Joining Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joiningDate"));
      return <span>{date.toLocaleDateString()}</span>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        active: "bg-success/20 text-success",
        inactive: "bg-destructive/20 text-destructive",
        "on-leave": "bg-warning/20 text-warning"
      };
      const status = row.getValue<string>("status");
      const statusStyles = statusColors[status] || "default";
      return (
        <Badge className={cn("rounded-full px-5", statusStyles)}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="bg-transparent ring-offset-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4 text-default-800" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0" align="end">
            <DropdownMenuItem className="p-2 border-b text-default-700 group focus:bg-default focus:text-primary-foreground rounded-none">
              <Eye className="w-4 h-4 me-1.5" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="p-2 border-b text-default-700 group focus:bg-default focus:text-primary-foreground rounded-none">
              <SquarePen className="w-4 h-4 me-1.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="p-2 text-destructive bg-destructive/30 focus:bg-destructive focus:text-destructive-foreground rounded-none">
              <Trash2 className="w-4 h-4 me-1.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
];