import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { VMS_URL } from './Config';
import { Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../Assests/Images/cwilogo.png';
import axios from 'axios';

const Base1 = ({ children }) => {

    const [sessionUserData, setSessionUserData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    useEffect(() => {
        const userDataString = sessionStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setSessionUserData(userData);
            // console.log(userData)
        } else {
            console.log('User data not found in sessionStorage');
        }
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${VMS_URL}LogOut`, {
                UserId: sessionUserData.Id
            });
            
            if (response.data.ResultData[0].Status === 'Success') {
                sessionStorage.clear();
                // localStorage.clear();
                navigate('/');
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error('Logout failed:', error);
        }
    };
    
    const content = (
        <div className="text-dark">
            <div className="menu-item px-3">
                <div className="menu-content d-flex align-items-center px-3">
                    <div className="symbol symbol-50px me-5">
                        {/* <img alt="Logo" src="assets/media/avatars/300-3.jpg" /> */}
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "skyblue",
                                color: "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                            >
                            {/* {sessionUserData?.Name?.charAt(0)} */}
                            <i className="fa-regular fa-user text-white"></i>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="fw-bold d-flex align-items-center fs-5">{sessionUserData.Name}
                        <span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">{setSessionUserData.RoleName}</span></div>
                        <a href="#" className="fw-semibold text-muted text-hover-primary fs-7">{sessionUserData.Email}</a>
                    </div>
                </div>
            </div>
            <div className="separator my-2"></div>
            <div className="menu-item px-5">
                <a className="menu-link px-5 text-dark text-hover-warning"><i className="fa-regular fa-user text-info me-2"></i> My Profile</a>
            </div>            
            
            <div className="menu-item px-5">
                <a className="menu-link px-5 text-dark text-hover-warning" onClick={handleLogout}>
                    <i className="fa-solid fa-arrow-right-from-bracket text-danger me-2"></i> Sign Out
                </a>
            </div>
        </div>
    );

    useEffect(() => {
        if (sessionUserData.OrgId) {
            const fetchMenuData = async () => {
                try {
                const sessionData = sessionStorage.getItem("menuData");
        
                if (sessionData) {
                    setMenuItems(JSON.parse(sessionData));
                    // console.log("Data loaded from session storage", sessionData);
                } else {
                    const response = await fetch(
                        `${VMS_URL}getmenu?OrgId=${sessionUserData.OrgId}&RoleId=${sessionUserData.RoleId}`
                    );
        
                    if (response.ok) {
                        const data = await response.json();
                        setMenuItems(data.ResultData);
                        console.log(data)
                        sessionStorage.setItem("menuData", JSON.stringify(data.ResultData));
                    } else {
                        console.error("Failed to fetch menu data:", response.statusText);
                    }
                }
                } catch (error) {
                    console.error("Error fetching menu data:", error.message);
                }
            };
        
            fetchMenuData();
        }
    }, [VMS_URL, sessionUserData]);

    const toggleDropdown = (index) => {
        setActiveDropdown((prevIndex) => (prevIndex === index ? null : index));
    };
    
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    };
    
    const spinnerStyle = {
        width: '60px',
        height: '60px',
        border: '6px solid #ccc',
        borderTop: '6px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    return (
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
            {loading && (
                <div style={overlayStyle}>
                    <div style={spinnerStyle}></div>
                </div>
            )}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                <div id="kt_app_header" className="app-header text-white" data-kt-sticky="true" style={{ backgroundColor: '#90e0ef' }}
                    data-kt-sticky-activate="{default: true, lg: true}" data-kt-sticky-name="app-header-minimize" data-kt-sticky-offset="{default: '200px', lg: '0'}" data-kt-sticky-animation="false">
                    <div className="app-container container-fluid d-flex align-items-stretch justify-content-between" id="kt_app_header_container">
                        <div className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2" title="Show sidebar menu">
                            <div className="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_sidebar_mobile_toggle">
                                <i className="ki-duotone ki-abstract-14 fs-2 fs-md-1 text-white"
                                    data-bs-toggle="offcanvas" 
                                    data-bs-target="#offcanvasLeftNav" 
                                    aria-controls="offcanvasLeftNav"
                                >
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                </i>
                            </div>
                        </div>
                        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                            <Link to='/dashboard' className="d-lg-none">
                                <img alt="Logo" src={LogoImg} className="h-30px" />
                            </Link>
                        </div>
                        <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1" id="kt_app_header_wrapper">
                            <div className="app-header-menu app-header-mobile-drawer align-items-stretch" data-kt-drawer="true" data-kt-drawer-name="app-header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_header_menu_toggle" data-kt-swapper="true" data-kt-swapper-mode="{default: 'append', lg: 'prepend'}" data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}">
                                <div className="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0" id="kt_app_header_menu" data-kt-menu="true">
                                    <a href='/dashboard' className='mt-2'>
                                        <img alt="Logo" src={LogoImg} className="h-55px app-sidebar-logo-default" />
                                        <img alt="Logo" src={LogoImg} className="h-20px app-sidebar-logo-minimize" />
                                    </a>
                                    {/* <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-0 me-lg-2">
                                        <span className="menu-link">
                                            <span className="menu-title text-white">Pages</span>
                                            <span className="menu-arrow d-lg-none"></span>
                                        </span>
                                    </div>
                                    <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item here show menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                        <span className="menu-link">
                                            <span className="menu-title text-white">Apps</span>
                                            <span className="menu-arrow d-lg-none"></span>
                                        </span>
                                    </div>
                                    <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-0 me-lg-2">
                                        <span className="menu-link">
                                            <span className="menu-title text-white">Layouts</span>
                                            <span className="menu-arrow d-lg-none"></span>
                                        </span>
                                    </div>
                                    <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                        <span className="menu-link">
                                            <span className="menu-title text-white">Help</span>
                                            <span className="menu-arrow d-lg-none"></span>
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                            <div className="app-navbar flex-shrink-0">
                                {/* <div className="app-navbar-item align-items-stretch ms-1 ms-md-4">
                                    <div id="kt_header_search" className="header-search d-flex align-items-stretch" data-kt-search-keypress="true" data-kt-search-min-length="2" data-kt-search-enter="enter" data-kt-search-layout="menu" data-kt-menu-trigger="auto" data-kt-menu-overflow="false" data-kt-menu-permanent="true" data-kt-menu-placement="bottom-end">
                                        <div className="d-flex align-items-center" data-kt-search-element="toggle" id="kt_header_search_toggle">
                                            <div className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px">
                                                <i className="ki-duotone ki-magnifier fs-2">
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                </i>
                                            </div>
                                        </div>
                                        <div data-kt-search-element="content" className="menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px">
                                            <div data-kt-search-element="wrapper">
                                                <form data-kt-search-element="form" className="w-100 position-relative mb-3" autocomplete="off">
                                                    <i className="ki-duotone ki-magnifier fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-0">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                    </i>
                                                    <input type="text" className="search-input form-control form-control-flush ps-10" name="search" value="" placeholder="Search..." data-kt-search-element="input" />
                                                </form>
                                                <div className="separator border-gray-200 mb-6"></div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="app-navbar-item ms-1 ms-md-4">
                                    <div className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px" id="kt_activities_toggle">
                                        <i className="ki-duotone ki-messages fs-2">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                            <span className="path5"></span>
                                        </i>
                                    </div>
                                </div> */}
                                <div className="app-navbar-item ms-1 ms-md-4 ">
                                    {/* <div className="text-hover-primary btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end" id="kt_menu_item_wow">
                                        <i className="ki-duotone ki-notification-status fs-2 text-white ">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                        </i>
                                    </div> */}
                                    
                                </div>
                                <div className="app-navbar-item ms-1 ms-md-4">
                                    <div className="text-hover-primary btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary  btn-active-color-primary w-35px h-35px position-relative" id="kt_drawer_chat_toggle">
                                        <i className="ki-duotone ki-message-text-2 fs-1 text-info">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                        </i>
                                        <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"></span>
                                    </div>
                                </div>
                                {/* <div className="app-navbar-item ms-1 ms-md-4">
                                    <div className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                        <i className="ki-duotone ki-element-11 fs-2">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                        </i>
                                    </div>
                                </div> */}
                                {/* <div className="app-navbar-item ms-1 ms-md-4">
                                    <a href="#" className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px" data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                        <i className="ki-duotone ki-night-day theme-light-show fs-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                            <span className="path5"></span>
                                            <span className="path6"></span>
                                            <span className="path7"></span>
                                            <span className="path8"></span>
                                            <span className="path9"></span>
                                            <span className="path10"></span>
                                        </i>
                                    </a>
                                </div> */}
                            <div className="app-navbar-item ms-1 ms-md-4">
                                    <Popover placement="bottom" content={content} className='border p-2 rounded border-dark'>
                                        <div className="text-hover-primary text-dark btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary  btn-active-color-primary w-35px h-35px position-relative" id="kt_drawer_chat_toggle">
                                            {/* <i className="fa-regular fa-user text-white"></i> */}
                                            {sessionUserData?.Name?.charAt(0)}
                                        </div>
                                    </Popover>
                                </div>
                                {/* <div className="app-navbar-item d-lg-none ms-2 me-n2" title="Show header menu">
                                    <div className="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px" id="kt_app_header_menu_toggle">
                                        <i className="ki-duotone ki-element-4 fs-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    {`
                    .text-highlight {
                            color: #0dcaf0 !important; /* Same as Bootstrap's text-info */
                        }
                        .menu-link.hover-effect {
                            transition: all 0.2s ease-in-out;
                        }

                        .menu-link.hover-effect:hover {
                            color: #0dcaf0 !important; 
                            transform: translateX(4px);
                            text-decoration: none;
                        }
                    `}
                </style>
                
                <div className="app-wrapper flex-row flex-row-fluid" id="kt_app_wrapper">
                    <div id="kt_app_sidebar" className="app-sidebar flex-column" data-kt-drawer="true" style={{ width: '220px' }}>
                        {/* Sidebar */}
                        <div className="app-sidebar-menu overflow-hidden flex-column-fluid bg-white">
                            <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper">
                                <div id="kt_app_sidebar_menu_scroll" className="scroll-y my-5 mx-3" data-kt-scroll="true" data-kt-scroll-activate="true" 
                                    data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer" data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px" data-kt-scroll-save-state="true">
                                    <div className="menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
                                        <div data-kt-menu-trigger="click" className="menu-item menu-accordion">
                                            {menuItems &&
                                                menuItems.map((item, index) => (
                                                    <div key={index} className="menu-item menu-accordion">
                                                        <a
                                                            href={item.MenuPath}
                                                            className={`menu-link ${item.SubItems?.length ? "dropdown-toggle" : ""} ${item.MenuPath === currentPath ? "text-highlight fw-bold" : "text-dark"} hover-effect`}
                                                            onClick={(e) => {
                                                                if (item.SubItems?.length) {
                                                                    e.preventDefault();
                                                                    toggleDropdown(index);
                                                                }
                                                            }}
                                                            data-bs-toggle={item.SubItems?.length ? "dropdown" : undefined}
                                                            aria-expanded={activeDropdown === index}
                                                        >
                                                            <i className={`me-3 ${item.IconName}`}></i>
                                                            <span className="menu-title">{item.MenuName}</span>
                                                        </a>
                                                        {item.SubItems && item.SubItems.length > 0 && (
                                                            <ul className={`dropdown-menu ${activeDropdown === index ? "show" : ""}`}>
                                                                {item.SubItems.map((subItem, subIndex) => (
                                                                    <li key={subIndex}>
                                                                        <a href={subItem.MenuPath} className="dropdown-item">
                                                                            {subItem.MenuName}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">

                        {children}

                        <div id="kt_app_footer" className="app-footer sticky-bottom bg-white">
                            <div className="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                                <div className="text-gray-900 order-2 order-md-1">
                                    <span className="text-muted fw-semibold me-1">2025&copy;</span>
                                    <a href='https://cooperwind.de/' target="_blank" className="text-gray-800 text-hover-primary">Cooper Wind India</a>
                                </div>
                                {/* <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                                    <li className="menu-item">
                                        <a target="_blank" className="menu-link px-2">About</a>
                                    </li>
                                    <li className="menu-item">
                                        <a target="_blank" className="menu-link px-2">Support</a>
                                    </li>
                                    <li className="menu-item">
                                        <a target="_blank" className="menu-link px-2">Purchase</a>
                                    </li>
                                </ul> */ }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasLeftNav"
                aria-labelledby="offcanvasLeftLabel"
                style={{ minWidth: "64%", maxWidth: "64%" }}
            >
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div className="offcanvas-body" style={{ marginTop: "-2rem", maxHeight: "42rem", overflowY: "auto" }}>
                    {menuItems &&
                        menuItems.map((item, index) => (
                            <div key={index} className="menu-item menu-accordion">
                                <a
                                    href={item.MenuPath}
                                    className={`menu-link ${item.SubItems?.length ? "dropdown-toggle" : ""} ${item.MenuPath === currentPath ? "text-info fw-bold" : "text-dark"}`}
                                    onClick={(e) => {
                                        if (item.SubItems?.length) {
                                            e.preventDefault();
                                            toggleDropdown(index);
                                        }
                                    }}
                                    data-bs-toggle={item.SubItems?.length ? "dropdown" : undefined}
                                    aria-expanded={activeDropdown === index}
                                >
                                    <i className={`me-3 fs-2 ${item.IconName}`}></i>
                                    <span className="menu-title fs-4">{item.MenuName}</span>
                                </a>

                                {item.SubItems?.length > 0 && (
                                    <ul className={`dropdown-menu ${activeDropdown === index ? "show" : ""}`}>
                                        {item.SubItems.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <a
                                                    href={subItem.MenuPath}
                                                    className={`dropdown-item ${subItem.MenuPath === currentPath ? "text-primary fw-bold" : ""}`}
                                                >
                                                    <i className="fa-solid fa-arrow-right me-2"></i>
                                                    {subItem.MenuName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
};

export default Base1;
