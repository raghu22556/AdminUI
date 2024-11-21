import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import DashbordIcon from '../../assets/DashbordIcon';
import DashbordIconActive from '../../assets/DashbordIconActive';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdCardGiftcard, MdClose, MdNotifications, MdTouchApp } from 'react-icons/md';
import '../component.css';

export default function Sidebar(props) {
  const navigate = useNavigate();
  const { handleToggle } = props;
  const { pathname } = useLocation();

  let menu = JSON.parse(localStorage.getItem('menu'));

  const handleNavigate = (path) => navigate(path);


  /*
  Injecting Cards manually
  let manageFiles = [
    {
      cardText: 'Manage Files',
      children: null,
      displayText: 'Manage Files',
      hideCard: false,
      hideHeader: false,
      menuId: 'b340b97a-42a3-4718-a13f-0bc48b0a6f8f',
      subText: '',
      tableName: null,
      url: 'UploadPdf',
    },
  ];
  // Find the "AI Management" item and add "manageFiles" if not already present
  menu = menu.map((menuItem) => {
    if (menuItem.cardText === 'AI Management') {
      const foundManageFiles = menuItem.children?.some(
        (child) => child.cardText === 'Manage Files',
      );
      if (!foundManageFiles) {
        if (menuItem.children) {
          menuItem.children.push(...manageFiles);
        } else {
          menuItem.children = manageFiles;
        }
      }
    }
    return menuItem;
  });
  // Set the updated menu back in local storage
  localStorage.setItem('menu', JSON.stringify(menu));
  */
  const UserProfileSetting = [
    {
      name: 'User Profile',
      path: '/userProfileUpdate',
    },
    {
      name: 'Password',
      path: '/password',
    },
  ];

  const navLinks = [
    {
      name: 'Dashboard',
      icon: <DashbordIcon />,
      activeIcon: <DashbordIconActive />,
      path: '/dashboard',
    },
    /*{
     name: 'Organization',
     icon: <DashbordIcon />,
     activeIcon: <DashbordIconActive />,
     path: '/OnBoarding/Organization',
   },
    {
      name: 'Projects',
      icon: <DashbordIcon />,
      activeIcon: <DashbordIconActive />,
      path: '/OnBoarding/Project',
    },*/
  ];

  const navLinksModules = [];
  menu.forEach((menuItem) => {
    let newNavItem = {
      name: menuItem.cardText,
      path: '/' + menuItem.url,
      icon: <DashbordIcon />,
      activeIcon: <DashbordIconActive />,
    };

    //{
    //  name: "Reports",
    // icon: <DashbordIcon />,
    // activeIcon: <DashbordIconActive />,
    // path: "/Reports",
    //},

    // {
    //   name: "Masters",
    //   icon: <DashbordIcon />,
    //   activeIcon: <DashbordIconActive />,
    //   path: "/UserManagement",
    //   child: [
    //     {
    //       name: "User Management",
    //       path: "/userpage",
    //       icon: <SubIcons />,
    //       activeIcon: <SubIcons />,
    //     },
    //     {
    //       name: "Designations",
    //       path: "/Masters/UserManagement",
    //       icon: <SubIcons />,
    //       activeIcon: <SubIcons />,
    //     },
    //     {
    //       name: "Roles",
    //       path: "/Masters/UserManagement",
    //       icon: <SubIcons />,
    //       activeIcon: <SubIcons />,
    //     },
    //     {
    //       name: "Access Control",
    //       path: "/Masters/UserManagement",
    //       icon: <SubIcons />,
    //       activeIcon: <SubIcons />,
    //     },
    //   ],
    // },
    if (menuItem.children && menuItem.children.length > 0) {
      newNavItem.child = menuItem.children.map((childItem) => ({
        name: childItem.cardText,
        path: '/' + menuItem.cardText + '/' + childItem.url,
      }));
    }

    navLinksModules.push(newNavItem);
  });
  const isActive = (path) => pathname.startsWith(path);
  return (
    <div className="flex flex-col w-full h-full max-w-xs bg-white h-screen md:h-auto fixed md:relative z-50 dark:bg-black dark:text-white">
      <div className="px-4 py-2 flex justify-between items-center">
        <h1
          className="text-2xl font-bold"
          onClick={() => navigate('/dashboard')}
          style={{
            fontWeight: 800,
            fontSize: '26px',
            width: '100%',
            lineHeight: '38.78px',
            letterSpacing: '2%',
            color: '#056EE9',
            cursor: 'pointer',
          }}
        >
          MaidenCube
        </h1>
        <MdClose onClick={handleToggle} className="text-color text-xl md:hidden cursor-pointer" />
      </div>
      {pathname === '/userProfileUpdate' || pathname === '/password' ? (
        <>
          <div className="space-y-2 px-3 py-4" style={{ width: '100%' }}>
            <h2
              className="text-lg font-semibold"
              style={{
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '18px',
              }}
            >
              Profile Setting
            </h2>
            {UserProfileSetting.map((item) => {

              return (
                <div key={item.name} className="navLinkCustomButton">
                  <Button
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    }}
                    className={`buttonStyle flex items-center space-x-2 w-full dark:bg-gray-900 dark:transition-none transition-none ${isActive(item.path) ? 'active' : ''}`}
                    variant="filled"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div style={{ flexShrink: 0 }}>
                      {isActive(item.path) ? <DashbordIconActive /> : <DashbordIcon />}
                    </div>
                    <span className=" font-normal text-xs leading-6 capitalize dark:text-gray-400">
                      {item.name}
                    </span>
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 px-3 py-4" style={{ width: '100%' }}>
            <h2
              className="text-lg font-semibold"
              style={{
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '18px',
              }}
            >
              Main
            </h2>
            {navLinks.map((item) => {
              return (
                <div key={item.name} className="navLinkCustomButton">
                  <Button
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    }}
                    className={`buttonStyle flex items-center space-x-2 w-full dark:bg-gray-900 dark:transition-none transition-none ${isActive(item.path) ? 'active' : ''}`}
                    variant="filled"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div style={{ flexShrink: 0 }}>
                      {isActive(item.path) ? <DashbordIconActive /> : <DashbordIcon />}
                    </div>
                    <span className=" font-normal text-xs leading-6 capitalize dark:text-gray-400">
                      {item.name}
                    </span>
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="space-y-2 px-3 py-1" style={{ width: '100%' }}>
            <h2
              className="text-lg font-semibold"
              style={{
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '18px',
              }}
            >
              Modules
            </h2>
            {navLinksModules.map((item) => {
              return (
                <div key={item.name} className="navLinkCustomButton">
                  <Button
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    }}
                    className={`flex items-center space-x-2 w-full buttonStyle dark:bg-gray-900 dark:transition-none transition-none ${isActive(item.path) ? 'active' : ''}`}
                    variant="filled"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <div style={{ flexShrink: 0 }}>
                      {isActive(item.path) ? <DashbordIconActive /> : <DashbordIcon />}
                    </div>
                    <span className=" font-normal text-xs leading-6 capitalize dark:text-gray-400">
                      {item.name}
                    </span>
                  </Button>
                </div>
              );
            })}
            {/*}
            <span
              className="flex items-center space-x-2 w-full py-2"
              variant="default"
              style={{ marginTop: '15px' }}
            >
              <PlusIcon style={{ color: '#95A4FC' }} className="h-4 w-4" />
              <span
                style={{
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#95A4FC',
                  textTransform: 'capitalize',
                }}
              >
                Create Module
              </span>
            </span>*/}
          </div>

          {/*
          <div className="space-y-2 px-3" style={{ width: '100%' }}>
            <h2
              className="text-lg font-semibold"
              style={{
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '18px',
              }}
            >
              Settings
            </h2>
            <Button
              style={{
                margin: '10px 0px',
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                border: '0px',
                padding: '7px 12px',
                color: '#A9A9A9 ',
              }}
              className={`flex items-center space-x-2 buttonStyle dark:bg-gray-900 dark:transition-none dark:border-none transition-none`}
            >
              <BellIcon style={{ color: 'rgb(138 134 134)' }} className="h-5 w-5" />
              <span
                style={{
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '18px',
                  textTransform: 'capitalize',
                }}
                className="dark:text-gray-400"
              >
                Notification Settings
              </span>
            </Button>
            <Button
              style={{
                margin: '10px 0px',
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                border: '0px',
                padding: '7px 12px',
                color: '#A9A9A9 ',
              }}
              className={`flex items-center space-x-2 buttonStyle dark:bg-gray-900 dark:transition-none transition-none`}
              variant="default"
            >
              <UserCircleIcon style={{ color: 'rgb(138 134 134)' }} className="h-5 w-5" />
              <span
                style={{
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '18px',
                  textTransform: 'capitalize',
                }}
                className="dark:text-gray-400"
              >
                Profile Setting
              </span>
            </Button>
          </div>
          */}
        </>
      )}
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function UserCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}
