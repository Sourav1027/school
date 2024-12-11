"use client"
import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, 
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, 
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, 
  DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon"
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useRouter } from "@/components/navigation";

// Define user type for TypeScript
interface User {
  name: string;
  email: string;
  image: string;
}

const ProfileInfo = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const DEFAULT_AVATAR = "/images/users/user-3.jpg"; 

  // Centralized function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("auth_token");
  };

  // Centralized function to remove auth token
  const removeAuthToken = () => {
    localStorage.removeItem("auth_token");
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    const token = getAuthToken();
    if (!token) {
      // Redirect to login if no token
      router.push("/");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}v1/users/detail`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If response is not successful, remove token and redirect to login
        removeAuthToken();
        router.push("/");
        return;
      }

      const userData = await response.json();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      removeAuthToken();
      router.push("/");
    }
  };

  // Handle logout 
  const handleLogout = () => {
    try {
      // Optional: Call logout API if your backend requires it
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token and redirect
      removeAuthToken();
      router.push("/");
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Loading state
  if (isLoading) {
    return <div className="md:block hidden">Loading...</div>;
  }

  // If no user, don't render the dropdown
  if (!user) {
    return null;
  }

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="flex items-center gap-3 text-default-800">
            <Image
              src={user.image}
              alt={user.name?.charAt(0) || 'U'}
              className="rounded-full h-10 w-10 "
              onError={(e) => {
                // Fallback to default image if image fails to load
                (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
              }}
            />

            <div className="text-sm font-medium capitalize lg:block hidden">
              {user.name}
            </div>
            <span className="text-base me-2.5 lg:inline-block hidden">
              <Icon icon="heroicons-outline:chevron-down" />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-0" align="end">
          <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
            <Image
              src={user.image}
              alt={user.name?.charAt(0) || 'U'}
              className="rounded-full h-10 w-10 "
              onError={(e) => {
                // Fallback to default image if image fails to load
                (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <div className="text-sm font-medium text-default-800 capitalize">
                {user.name}
              </div>
              <Link
                href="/dashboard"
                className="text-xs text-default-600 hover:text-primary"
              >
                {user.email}
              </Link>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {[
              {
                name: "profile",
                icon: "heroicons:user",
                href: "/user-profile"
              },
              {
                name: "Billing",
                icon: "heroicons:megaphone",
                href: "/dashboard"
              },
              {
                name: "Settings",
                icon: "heroicons:paper-airplane",
                href: "/dashboard"
              },
              {
                name: "Keyboard shortcuts",
                icon: "heroicons:language",
                href: "/dashboard"
              },
            ].map((item, index) => (
              <Link
                href={item.href}
                key={`info-menu-${index}`}
                className="cursor-pointer"
              >
                <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                  <Icon icon={item.icon} className="w-4 h-4" />
                  {item.name}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/dashboard" className="cursor-pointer">
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                <Icon icon="heroicons:user-group" className="w-4 h-4" />
                team
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 ">
                <Icon icon="heroicons:user-plus" className="w-4 h-4" />
                Invite user
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {[
                    { name: "email" },
                    { name: "message" },
                  ].map((item, index) => (
                    <Link
                      href="/dashboard"
                      key={`message-sub-${index}`}
                      className="cursor-pointer"
                    >
                      <DropdownMenuItem className="text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                        {item.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <Link href="/dashboard">
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                <Icon icon="heroicons:variable" className="w-4 h-4" />
                Github
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                <Icon icon="heroicons:phone" className="w-4 h-4" />
                Support
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {[
                    { name: "portal" },
                    { name: "slack" },
                    { name: "whatsapp" },
                  ].map((item, index) => (
                    <Link href="/dashboard" key={`message-sub-${index}`}>
                      <DropdownMenuItem className="text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                        {item.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="mb-0 dark:bg-background" />
          <DropdownMenuItem
            className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 cursor-pointer"
          >
            <div>
              <button 
                onClick={handleLogout} 
                type="button" 
                className="w-full flex items-center gap-2"
              >
                <Icon icon="heroicons:power" className="w-4 h-4" />
                Log out
              </button>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileInfo;