import { Children } from "react";

export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  icon?: string; // Add optional icon
  children?: SubChildren[];
};

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: string; // Ensure icon is a string
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  submenus: Submenu[];
  id: string;
  children?: SubChildren[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard/analytics",
          label: t("dashboard"),
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: t("Students"),
      id: "student",
      menus: [
        {
          id: "student",
          href: "/app/studentsinfo",
          label: t("student"),
          active: pathname.includes("/app/studentsinfo"),
          icon: "heroicons-outline:user-group",
          submenus: [
            {
            
              href: "/app/studentsinfo/student",
              label: t("student"),
              active: pathname.includes("/app/studentsinfo/student"),
              icon: "heroicons-outline:user-plus",
              children: [],
            },
            {
            
              href: "/app/studentsinfo/importstudentdata",
              label: t("importstudentdata"),
              active: pathname.includes("/app/studentsinfo/importstudentdata"),
              icon: "heroicons-outline:cloud-arrow-up",
              children: [],
            },

          ],
        },
      ],
    },
    {
      groupLabel: t("apps"),
      id: "app",
      menus: [
      
        {
          id: "section",
          href: "/app/section",
          label: t("section"),
          active: pathname.includes("/app/section"),
          icon: "heroicons-outline:table-cells",
           submenus: [],
        },
      ],
    },
    {
      groupLabel: t("master"),
      id: "master",
      menus: [
        {
          id: "master",
          href: "/app/master",
          label: t("master"),
          active: pathname.includes("/master"),
          icon: "heroicons-outline:adjustments-horizontal",
          submenus: [
            {
              href: "/app/master/role",
              label: t("role"),
              active: pathname.includes("/app/master/role"),
              icon: "heroicons-outline:user-group", // Added icon for role
              children: [],
            },
            {
              href: "/app/master/batch",
              label: t("batch"),
              active: pathname.includes("/app/master/batch"),
              icon: "heroicons-outline:calendar-days", // Added icon for batch
              children: [],
            },
            {
              href: "/app/master/subject",
              label: t("subject"),
              active: pathname.includes("/app/master/subject"),
              icon: "heroicons-outline:book-open", // Added icon for subject
              children: [],
            },
            {
              href: "/app/master/division",
              label: t("division"),
              active: pathname.includes("/app/master/division"),
              icon: "heroicons-outline:view-columns", // Added icon for division
              children: [],
            },
            {
              href: "/app/master/class",
              label: t("class"),
              active: pathname.includes("/app/master/class"),
              icon: "heroicons-outline:bookmark-square", // Added icon for class
              children: [],
            },
            {
              href: "/app/master/teacher",
              label: t("teacher"),
              active: pathname.includes("/app/master/teacher"),
              icon: "heroicons-outline:academic-cap", // Added icon for teacher
              children: [],
            },
            {
              href: "/app/master/school",
              label: t("school"),
              active: pathname.includes("/app/master/school"),
              icon: "heroicons-outline:building-office-2",
              children: [],
            },
          ],
        },
      ],

    },
    {
      groupLabel: t("Utilities"),
      id: "utilities",
      menus: [
        {
          id: "utilities",
          href: "/app/utilities",
          label: t("Utilities"),
          active: pathname.includes("/app/utilities"),
          icon: "heroicons-outline:wrench-screwdriver",
          submenus: [
            {
              href: "/app/utilities/notification",
              label: t("notification"),
              active: pathname.includes("/app/utilities/notification"),
              icon: "heroicons-outline:bell-alert",
              children: [],
            },
            {
              href: "/app/utilities/homework",
              label: t("homework"),
              active: pathname.includes("/app/utilities/homework"),
              icon: "heroicons-outline:book-open",
              children: [],
            },
            {
              href: "/app/utilities/sms",
              label: t("sms"),
              active: pathname.includes("/app/utilities/sms"),
              icon: "heroicons-outline:chat-bubble-left-right",
              children: [],
            },
            {
              href: "/app/utilities/profile",
              label: t("profile"),
              active: pathname.includes("/app/utilities/profile"),
              icon: "heroicons-outline:user-circle",
              children: [],
            },
          ],
        },
      ],
    },
  ];
}

export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard/analytics",
          label: t("dashboard"),
          active: pathname.includes("/dashboard"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
   
    {
      groupLabel: t("Students"),
      id: "student",
      menus: [
        {
          id: "student",
          href: "/app/studentsinfo",
          label: t("student"),
          active: pathname.includes("/app/studentsinfo"),
          icon: "heroicons-outline:user-group",
          submenus: [
            {
            
              href: "/app/studentsinfo/student",
              label: t("student"),
              active: pathname.includes("/app/studentsinfo/student"),
              icon: "heroicons-outline:user-plus",
              children: [],
            },
            {
            
              href: "/app/studentsinfo/importstudentdata",
              label: t("importstudentdata"),
              active: pathname.includes("/app/studentsinfo/importstudentdata"),
              icon: "heroicons-outline:cloud-arrow-up",
              children: [],
            },

          ],
        },
      ],
    },
    {
      groupLabel: t("master"),
      id: "master",
      menus: [
        {
          id: "master",
          href: "/app/master",
          label: t("master"),
          active: pathname.includes("/app/master"),
          icon: "heroicons-outline:adjustments-horizontal",
          submenus: [
            {
              href: "/app/master/batch",
              label: t("batch"),
              active: pathname === "/app/master/batch",
              icon: "heroicons-outline:calendar-days",
              children: [],
            },
            {
              href: "/app/master/role",
              label: t("role"),
              active: pathname.includes("/app/master/role"),
              icon: "heroicons-outline:user-group",
              submenus: [],
            },
            {
              href: "/app/master/subject",
              label: t("subject"),
              active: pathname === "/app/master/subject",
              icon: "heroicons-outline:book-open",
              children: [],
            },
            {
              href: "/app/master/division",
              label: t("division"),
              active: pathname === "/app/master/division",
              icon: "heroicons-outline:view-columns",
              children: [],
            },
            {
              href: "/app/master/class",
              label: t("class"),
              active: pathname === "/app/master/class",
              icon: "heroicons-outline:bookmark-square",
              children: [],
            },
            {
              href: "/app/master/teacher",
              label: t("teacher"),
              active: pathname === "/app/master/teacher",
              icon: "heroicons-outline:academic-cap",
              children: [],
            },
            {
              href: "/app/master/school",
              label: t("school"),
              active: pathname === ("/app/master/school"),
              icon: "heroicons-outline:building-office-2",
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: t("Utilities"),
      id: "utilities",
      menus: [
        {
          id: "utilities",
          href: "/app/utilities",
          label: t("Utilities"),
          active: pathname.includes("/app/utilities"),
          icon: "heroicons-outline:wrench-screwdriverl",
          submenus: [
            {
              href: "/app/utilities/notification",
              label: t("notification"),
              active: pathname === "/app/utilities/notification",
              icon: "heroicons-outline:bell-alert",
              children: [],
            },
            {
              href: "/app/utilities/homework",
              label: t("homework"),
              active: pathname === "/app/utilities/homework",
              icon: "heroicons-outline:book-open",
              children: [],
            },
            {
              href: "/app/utilities/sms",
              label: t("sms"),
              active: pathname === ("/app/utilities/sms"),
              icon: "heroicons-outline:chat-bubble-left-right",
              children: [],
            },
            {
              href: "/app/utilities/profile",
              label: t("profile"),
              active: pathname === ("/app/utilities/profile"),
              icon: "heroicons-outline:user-circle",
              children: [],
            },
          ],
        },
      ],
    },
  ];
}