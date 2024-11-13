

export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
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
    } ,
  
    {
      groupLabel: t("apps"),
      id: "app",
      menus: [ 
       
        {
          id: "role",
          href: "/app/role",
          label: t("role"),
          active:pathname.includes("/app/role"),
          icon: "heroicons-outline:user-plus",
          submenus: [],
        },
        {
          id: "school",
          href: "/app/school",
          label: t("school"),
          active:pathname.includes("/app/school"),
          icon: "heroicons-outline:building-office-2",
          submenus: [],
        },
        {
          id: "teacher",
          href: "/app/teacher",
          label: t("teacher"),
          active:pathname.includes("/app/teacher"),
          icon: "heroicons-outline:academic-cap",
          submenus: [],
        },
        {
          id: "student",
          href: "/app/student",
          label: t("student"),
          active:pathname.includes("/app/student"),
          icon: "heroicons-outline:user-plus",
          submenus: [],
        },
        {
          id: "importstudentdata",
          href: "/app/importstudentdata",
          label: t("importstudentdata"),
          active:pathname.includes("/app/importstudentdata"),
          icon: "heroicons-outline:cloud-arrow-up",
          submenus: [],
        },
       
        {
          id: "class",
          href: "/app/class",
          label: t("class"),
          active: pathname.includes("/app/class"),
          icon: "heroicons-outline:bookmark-square",
          submenus: [],
        },
        {
          id: "section",
          href: "/app/section",
          label: t("section"),
          active: pathname.includes("/app/section"),
          icon: "heroicons-outline:table-cells",
          submenus: [],
        },
        {
          id: "division",
          href: "/app/division",
          label: t("division"),
          active: pathname.includes("/app/division"),
          icon: "heroicons-outline:table-cells",
          submenus: [],
        },
        {
          id: "batch",
          href: "/app/batch",
          label: t("batch"),
          active: pathname.includes("/app/batch"),
          icon: "heroicons-outline:calendar-days",
          submenus: [],
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
      groupLabel: t("apps"),
      id: "app",
      menus: [
        {
          id: "app",
          href: "/app/chat",
          label: t("apps"),
          active: pathname.includes("/app/chat"),
          icon: "heroicons-outline:chat",
          submenus: [
           
            //============================================================================
            {
              href: "/app/role",
              label: t("role"),
              active: pathname === "/app/role",
              icon: "heroicons-outline:user-plus",
              children: [],
            },
            {
              href: "/app/teacher",
              label: t("teacher"),
              active: pathname === "/app/teacher",
              icon: "heroicons-outline:academic-cap",
              children: [],
            },
            {
              href: "/app/student",
              label: t("student"),
              active: pathname === "/app/student",
              icon: "heroicons-outline:user-plus",
              children: [],
            },
            {
              href: "/app/school",
              label: t("school"),
              active: pathname === "/app/school",
              icon: "heroicons-outline:building-office-2",
              children: [],
            },
            {
              href: "/app/importstudentdata",
              label: t("importstudentdata"),
              active: pathname === "/app/importstudentdata",
              icon: "heroicons-outline:cloud-arrow-up",
              children: [],
            },
           
            {
              href: "/app/class",
              label: t("class"),
              active: pathname === "/app/class",
              icon: "heroicons-outline:bookmark-square",
              children: [],
            },
            {
              href: "/app/section",
              label: t("section"),
              active: pathname === "/app/section",
              icon: "heroicons-outline:table-cells",
              children: [],
            },
            {
              href: "/app/division",
              label: t("division"),
              active: pathname === "/app/division",
              icon: "heroicons-outline:table-cells",
              children: [],
            },
            {
              href: "/app/batch",
              label: t("batch"),
              active: pathname === "/app/batch",
              icon: "heroicons-outline:calendar-days",
              children: [],
            },
            
          ],
        },
      ],
   
    },
  ];
}


