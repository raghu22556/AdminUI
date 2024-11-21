import React, { useState, useEffect } from 'react';
import { BsChatDots, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { HiOutlineMenu, HiOutlineSearch } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';
import { URL } from '../../app-config';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import Popper from '@material-ui/core/Popper';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import ModeEditSharpIcon from '@mui/icons-material/ModeEditSharp';
import FullScreen from '../FullScreen';
import '../component.css';
import toast, { Toaster } from 'react-hot-toast';
import FeedbackModal from '../Modals/FeedbackModal';
import { useSelector, useDispatch } from 'react-redux';
import { darkTheme, whiteTheme } from '../../utils/theme';

const languageOptions = [
  { value: 'en', label: 'English', icon: '/united-states.png' },
  { value: 'es', label: 'Spanish', icon: '/spanish.png' },
  { value: 'pt', label: 'Portuguese', icon: '/portuguese.png' },
  { value: 'ar', label: 'Arabic', icon: '/arabic.png' },
  { value: 'cn', label: 'Chinese', icon: '/china.png' },
];
const themeOptions = [
  { value: 'light', label: 'Light', icon: '/lightMode.png' },
  { value: 'dark', label: 'Dark', icon: '/darkMode.png' },
];
const Navbar = (props) => {
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [languageSelectedOption, setlanguageSelectedOption] = useState(languageOptions[0]);
  const [langOpen, setlangOpen] = useState(false);
  const [themeOpen, setthemeOpen] = useState(false);
  const initialTheme = localStorage.getItem('themename') || 'light';
  const initialThemeOption = themeOptions.find((option) => option.value === initialTheme);
  const [themeSelectedOption, setthemeSelectedOption] = useState(initialThemeOption);
  const [userProfile, setUserProfile] = useState({});
  const [theme, setTheme] = useState(initialTheme);
  const [currentTheme, setCurrentTheme] = useState(
    initialTheme === 'dark' ? darkTheme : whiteTheme,
  );

  if (localStorage.getItem('currentTheme') == null) {
    localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
  }

  const login_result = useSelector((state) => state?.login);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const { handleToggle, handleOpenToggle, drawer, t, handleUserProfileSetting } = props;
  useEffect(() => {
    const selectedTheme = theme === 'dark' ? darkTheme : whiteTheme;
    setCurrentTheme(selectedTheme);
    localStorage.setItem('currentTheme', JSON.stringify(selectedTheme));
    localStorage.setItem('themename', theme);
    localStorage.setItem('selectedTheme', selectedTheme);
  }, [theme]);
  useEffect(() => {
    const storedThemeName = localStorage.getItem('themename');
    const storedTheme = localStorage.getItem('currentTheme');
    if (storedTheme && storedThemeName) {
      setTheme(storedThemeName);
      setCurrentTheme(JSON.parse(storedTheme));
      const storedThemeOption = themeOptions.find((option) => option.value === storedThemeName);
      if (storedThemeOption.value == 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      setthemeSelectedOption(storedThemeOption);
    }
  }, []);
  const handleThemes = (event) => {
    setTheme(event.target.value); // Function to handle theme change
  };
  let projects = JSON.parse(localStorage.getItem('project'));
  const showProfile = () => {
    setProfile(!profile);
  };
  const languageSelect = (option) => {
    setlanguageSelectedOption(option);
    setlangOpen(false);
    if (option.value) {
      let selectedLang = option.value;
      props.i18n.changeLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', selectedLang);
      moment.locale(selectedLang);
    }
  };
  const themeSelect = (option) => {
    if (option.value == 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    setthemeSelectedOption(option);
    setthemeOpen(false);
    if (option.value) {
      const selectedTheme = option.value === 'dark' ? darkTheme : whiteTheme;
      setCurrentTheme(selectedTheme);
      setTheme(option.value);
      localStorage.setItem('currentTheme', JSON.stringify(selectedTheme));
      localStorage.setItem('themename', option.value);
    }
  };

  useEffect(() => {
    if (login_result?.data?.userInfo) {
      setUserProfile(login_result.data.userInfo);
      localStorage.setItem('email', login_result.data.userInfo.Email);
    }
  }, [login_result]);
  useEffect(() => {
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang) {
      const selectedLangOption = languageOptions.find((option) => option.value === storedLang);
      setlanguageSelectedOption(selectedLangOption);
      props.i18n.changeLanguage(storedLang);
      moment.locale(storedLang);
    }
  }, []);

  const handleClick = () => {
    // check is the previous drop-down is open or closed and do opposite
    setOpen((prev) => !prev);
  };

  const handleToggles = () => {
    setOpen(false); // if you click away anywhere then it will close the drop-down
  };

  const handlePop = () => {
    setPop((prev) => !prev);
  };
  const handleTogglePop = () => {
    setPop(false);
  };

  const onProjectChange = (e) => {
    let projectOnSelect = e.target.value;
    setSelectedProject(projectOnSelect);

    if (projectOnSelect) {
      navigate('/' + projectOnSelect);
    }
  };

  const userProfileSetting = () => {
    navigate('/userProfileUpdate');
  };

  const handleNotification = () => {
    toast('No New Notifications', {
      duration: 4000,
      position: 'top-right',

      // Styling
      style: {},
      className: '',

      // Custom Icon
      icon: '😞',

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: '#000',
        secondary: '#fff',
      },

      // Aria
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
  };

  return (
    <>
      {/* navbar */}
      <div className="p-4 bg-white sticky z-40 border-b top-0 left-0 shadow-sm flex items-center dark:bg-black dark:border-b dark:border-gray-800">
        {!drawer ? (
          <img
            src="leftArrow.png"
            alt=""
            onClick={handleToggle}
            className="p-2 dark:rounded rounded bg-gray-100 hover:bg-gray-100 dark:bg-gray-400  w-9 dark:w-8 font-bold cursor-pointer dark:cursor-pointer"
          />
        ) : (
          <img
            src="rightArrow.png"
            alt=""
            className="p-2 dark:rounded rounded bg-gray-100 hover:bg-gray-100 dark:bg-gray-400  w-9 dark:w-8 font-bold cursor-pointer dark:cursor-pointer"
            onClick={handleToggle}
          />
        )}

        <div className={`sm:ml-5 ml-2.5 ${drawer ? 'hidden md:flex' : 'flex md:hidden'}`}>
          <Typography
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
          </Typography>
        </div>
         
        <section className="flex ml-auto gap-2 sm:gap-4 md:gap-5 ">
          {/**
          <div className="relative mr-7 hidden md:flex">
            <div
              className="bg-[#F7F9FB] p-2 px-5 border border-lightgray rounded-md cursor-pointer flex items-center justify-between dark:bg-gray-900 dark:text-white dark:border-gray-700"
              style={{ width: '200px' }}
              onClick={() => setIsOpen(!isOpen)}
            >
              <img src="/Projects.svg" alt="" style={{ width: '16px' }} />{' '}
              <span style={{ fontSize: '14px' }}>Project Name</span>
              {isOpen ? <BsChevronUp className="ml-2" /> : <BsChevronDown className="ml-2" />}
            </div>
            {isOpen && (
              <div
                className="absolute bg-white border border-lightgray rounded-md mt-2 z-10 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                style={{ marginTop: '65px' }}
              >
                {projects.map((item) => (
                  <div
                    key={item.ProjectId}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-400 dark:hover:text-black bold  w-[200px] mt-2 mb-2 "
                    onClick={() => onProjectChange(item)}
                  >
                    <p
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      {item.ProjectName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          */}
          <section
            className="hidden md:flex items-center gap-1.5 sm:gap-3 ml-2"
            style={{ marginTop: '-3px' }}
          >
            <div className=" icon-bg text-color flex justify-center items-center  cursor-pointer">
              <img
                className="p-2 dark:rounded-full rounded-full hover:bg-gray-100 dark:bg-gray-400  w-9 dark:w-8"
                src="notification.png"
                alt="icon"
                onClick={handleNotification}
              />
              <Toaster />
            </div>
          </section>

          <div className="hidden md:flex items-center gap-1.5 sm:gap-3 ml-2 ">
            <FullScreen />
          </div>

          <div className="ml-auto relative hidden md:flex" style={{ marginRight: '-50px' }}>
            <div
              className="flex items-center gap-2  p-2 px-5  rounded-md cursor-pointer"
              style={{ width: '100px' }}
              onClick={() => setthemeOpen(!themeOpen)}
            >
              <img
                src={themeSelectedOption.icon}
                alt=""
                className="p-2 dark:rounded-full rounded-full hover:bg-gray-100 dark:bg-gray-400  w-9 dark:w-8 font-bold"
              />{' '}
            </div>
            {themeOpen && (
              <ClickAwayListener onClickAway={() => setthemeOpen(false)}>
                <div
                  className="absolute bg-white  rounded-md mt-5 z-10 md:mt-5 w-40 border border-gray-300 dark:bg-gray-900  "
                  style={{ marginTop: '50px', width: '130px' }}
                >
                  {themeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={` rounded-full dark:bg-gray-400 bg-gray-100 flex items-center p-2 cursor-pointer  hover:bg-gray-200 transition-all duration-200 ease-in-out ${
                        themeSelectedOption.value === option.value
                          ? 'bg-gray-200 text-black bold'
                          : ''
                      }`}
                      onClick={() => themeSelect(option)}
                      style={{ borderRadius: '4px', margin: '10px' }}
                    >
                      <img src={option.icon} alt="" style={{ width: '16px' }} />{' '}
                      <span className="text-sm ml-3 ">{option.label}</span>
                      {themeSelectedOption.value === option.value && (
                        <FaCheck className="ml-auto text-color text-blue-700" />
                      )}
                    </div>
                  ))}
                </div>
              </ClickAwayListener>
            )}
          </div>

          <div className="ml-auto relative hidden md:flex" style={{ marginRight: '-50px' }}>
            <div
              className="flex items-center gap-2  p-2 px-5  rounded-md cursor-pointer "
              style={{ width: '170px' }}
              onClick={() => setlangOpen(!langOpen)}
            >
              <img src={languageSelectedOption.icon} alt="" style={{ width: '18px' }} />{' '}
              <span className="dark:text-white" style={{ fontSize: '14px' }}>
                {languageSelectedOption.label}
              </span>
            </div>
            {langOpen && (
              <ClickAwayListener onClickAway={() => setlangOpen(false)}>
                <div
                  className="absolute bg-white border border-lightgray rounded-md mt-2 z-10 dark:bg-gray-900 dark:text-white"
                  style={{ marginTop: '40px', width: '170px' }}
                >
                  {languageOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center p-2 cursor-pointer  hover:bg-gray-200 transition-all duration-200 ease-in-out ${
                        languageSelectedOption.value === option.value
                          ? 'bg-gray-200 text-black bold'
                          : ''
                      }`}
                      onClick={() => languageSelect(option)}
                      style={{ borderRadius: '4px', margin: '10px' }}
                    >
                      <img src={option.icon} alt="" style={{ width: '16px' }} />{' '}
                      <span className="text-sm ml-3">{option.label}</span>
                      {languageSelectedOption.value === option.value && (
                        <FaCheck className="ml-auto text-color text-blue-700" />
                      )}
                    </div>
                  ))}
                </div>
              </ClickAwayListener>
            )}
          </div>
          <div className="mt-2">
            {userProfile.ProfileImage || (
              <img
                onClick={showProfile}
                alt="Profile Image"
                src="/noProfilePic.png"
                className="relative inline-block object-cover object-center w-9 h-9 rounded-full cursor-pointer"
                data-popover-target="profile-menu"
              />
            )}

            {profile && (
              <ul
                role="menu"
                data-popover="profile-menu"
                data-popover-placement="bottom"
                className="absolute mx-[-160px] my-5 flex min-w-[200px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none dark:bg-gray-900 dark:text-white"
              >
                <div className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 pl-0 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ">
                  {userProfile.ProfileImage || (
                    <img
                      alt=""
                      src="/noProfilePic.png"
                      className="relative inline-block object-cover object-center w-9 h-9 rounded-full cursor-pointer"
                      data-popover-target="profile-menu"
                    />
                  )}

                  <div className="text-sm hidden md:flex flex-col">
                    <span className="text-color font-semibold">{userProfile.Name || 'Admin'}</span>
                    <span className="text-gray-500 text-xs">
                      {userProfile.Email || localStorage.getItem('email')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={userProfileSetting}
                  role="menuitem"
                  className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 pl-1 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                      fill="#90A4AE"
                    />
                  </svg>
                  <p className="block font-sans text-sm antialiased font-medium leading-normal text-inherit">
                    My Profile
                  </p>
                </button>
                <FeedbackModal />

                <hr className="my-2 border-blue-gray-50" role="menuitem" />
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate('/');
                    // toast.success("LogOut Success!");
                  }}
                  role="menuitem"
                  className="flex w-full cursor-pointer select-none items-center gap-2 pl-1 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                >
                  {' '}
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                      fill="#90A4AE"
                    />
                  </svg>
                  <p className="block font-sans text-sm antialiased font-medium leading-normal text-inherit">
                    Sign Out
                  </p>
                </button>
              </ul>
            )}
          </div>
        </section>
      </div>
      {/* subheader */}
      <div
        className="subheader"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '0px',
          width: '100%',
          padding: '0px 10px',
        }}
      >
        <div
          className={`sm:ml-5 ml-2.5 ${drawer ? 'hidden md:flex' : 'flex md:hidden'}`}
          style={{
            backgroundColor: '#fff',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
            position: 'fixed',
            zIndex: '1',
            boxShadow: '10px 11px 28px -16px rgba(0,0,0,0.40',
          }}
        >
          <div className="flex items-center md:mt-0">
            <section
              className="md:hidden flex items-center gap-1.5 sm:gap-3 ml-2 mr-6"
              style={{ marginTop: '-3px' }}
            >
              <div className="icon-bg text-color text-lg sm:text-xl  w-9 h-9 md:w-9 md:h-9 flex justify-center items-center rounded-full p-1.5 cursor-pointer">
                <img
                  className="h-5 w-5"
                  src="/Notifications.svg"
                  alt="icon"
                  onClick={handleNotification}
                />
              </div>
            </section>

            {/* <div
              className="ml-auto relative md:hidden  gap-1.5 sm:gap-3"
              style={{ marginRight: '-50px' }}
            >
              <div
                className="flex items-center gap-2  p-2 px-5  rounded-md cursor-pointer"
                style={{ width: '100px' }}
                onClick={() => setthemeOpen(!themeOpen)}
              >
                <img src={themeSelectedOption.icon} alt="" className="w-5 font-bold" />{' '}
              </div>
              {themeOpen && (
                <ClickAwayListener onClickAway={() => setthemeOpen(false)}>
                  <div
                    className="absolute bg-white  rounded-md mt-2 z-10 md:mt-4 w-40 border border-gray-300"
                    style={{ marginTop: '10px', width: '130px' }}
                  >
                    {themeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center p-2 cursor-pointer  hover:bg-gray-200 transition-all duration-200 ease-in-out ${
                          themeSelectedOption.value === option.value
                            ? 'bg-gray-200 text-black bold'
                            : ''
                        }`}
                        onClick={() => themeSelect(option)}
                        style={{ borderRadius: '4px', margin: '10px' }}
                      >
                        <img src={option.icon} alt="" style={{ width: '16px' }} />{' '}
                        <span className="text-sm ml-3 ">{option.label}</span>
                        {themeSelectedOption.value === option.value && (
                          <FaCheck className="ml-auto text-color text-blue-700" />
                        )}
                      </div>
                    ))}
                  </div>
                </ClickAwayListener>
              )}
            </div> */}

            <div className="ml-auto relative md:hidden" style={{ marginRight: '-45px' }}>
              <div
                className="flex items-center gap-2  p-2 px-5  rounded-md cursor-pointer"
                style={{ width: '170px' }}
                onClick={() => setlangOpen(!langOpen)}
              >
                <img src={languageSelectedOption.icon} alt="" style={{ width: '18px' }} />{' '}
                <span style={{ fontSize: '14px' }}>{languageSelectedOption.label}</span>
              </div>
              {langOpen && (
                <ClickAwayListener onClickAway={() => setlangOpen(false)}>
                  <div
                    className="absolute bg-white border border-lightgray rounded-md mt-2 z-10"
                    style={{ marginTop: '10px', width: '170px' }}
                  >
                    {languageOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center p-2 cursor-pointer  hover:bg-gray-200 transition-all duration-200 ease-in-out ${
                          languageSelectedOption.value === option.value
                            ? 'bg-gray-200 text-black bold'
                            : ''
                        }`}
                        onClick={() => languageSelect(option)}
                        style={{ borderRadius: '4px', margin: '10px' }}
                      >
                        <img src={option.icon} alt="" style={{ width: '16px' }} />{' '}
                        <span className="text-sm ml-3">{option.label}</span>
                        {languageSelectedOption.value === option.value && (
                          <FaCheck className="ml-auto text-color text-blue-700" />
                        )}
                      </div>
                    ))}
                  </div>
                </ClickAwayListener>
              )}
            </div>
            {/*
            <div className="relative md:hidden">
              <div
                className="bg-[#F7F9FB] p-2 px-5 border border-lightgray rounded-md cursor-pointer flex items-center justify-between"
                style={{ width: '150px' }}
                onClick={() => setIsOpen(!isOpen)}
              >
                <img src="/Projects.svg" alt="" style={{ width: '12px' }} />{' '}
                <span style={{ fontSize: '10px' }}>Project Name</span>
                {isOpen ? <BsChevronUp className="ml-2" /> : <BsChevronDown className="ml-2" />}
              </div>
              {isOpen && (
                <div className="absolute bg-white border border-lightgray rounded-md mt-2">
                  {projects.map((item) => (
                    <div
                      key={item.ProjectId}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200 w-[150px] mt-2"
                      onClick={() => onProjectChange(item)}
                    >
                      <p style={{ fontSize: '10px' }}>{item.ProjectName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            */}
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(Navbar);
