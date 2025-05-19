import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { VMS_URL } from './Config';
import { Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../Assests/Images/logo.jpg';

const Base = ({ children }) => {

    const [sessionUserData, setSessionUserData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/');
    }

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
                            {sessionUserData?.Name?.charAt(0)}
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
                    console.log("Data loaded from session storage", sessionData);
                } else {
                    const response = await fetch(
                        `${VMS_URL}getmenu?OrgId=${sessionUserData.OrgId}&RoleId=${sessionUserData.RoleId}`
                    );
        
                    if (response.ok) {
                        const data = await response.json();
                        setMenuItems(data.ResultData);
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


    return (
        <>
            <div className="d-flex flex- flex-root app-root" id="kt_app_root">
                <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                    <div id="kt_app_header" className="app-header bg-primary" >
                        <div
                            className="app-container container-fluid d-flex align-items-stretch justify-content-between"
                            id="kt_app_header_container"
                        >
                            {/* Left Section */}
                            <div className="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2" title="Show sidebar menu">
                                <div className="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_app_sidebar_mobile_toggle">
                                    <i className="ki-duotone ki-abstract-14 fs-2 fs-md-1">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                </div>
                            </div>

                            {/* Center Section */}
                            <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                                <Link to='/dashboard' className="d-lg-none">
                                    <img alt="Logo" src={LogoImg} className="h-40px" />
                                </Link>
                            </div>

                            {/* Right Section */}
                            <div
                                className="d-flex align-items-center ms-auto gap-3"
                                id="kt_app_header_right"
                            >
                                {/* Search */}
                                <div className="btn btn-icon bg-white w-35px h-35px">
                                    <i className="ki-duotone ki-magnifier text-primary fs-2">
                                        <span className="path1 text-primary"></span>
                                        <span className="path2 text-primary"></span>
                                    </i>
                                </div>

                                {/* Notifications */}
                                {/* tn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px */}
                                <div className="btn btn-icon bg-white w-35px h-35px">
                                    <i className="ki-duotone ki-notification-status text-primary fs-2">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                        <span className="path3"></span>
                                        <span className="path4"></span>
                                    </i>
                                </div>

                                {/* Chat */}
                                <div className="btn btn-icon bg-white w-35px h-35px position-relative">
                                    <i className="ki-duotone ki-message-text-2 text-primary fs-2">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                        <span className="path3"></span>
                                    </i>
                                    {/* <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"></span> */}
                                </div>

                                {/* User Avatar */}
                                <Popover placement="bottom" content={content}>
                                    <div className="cursor-pointer symbol symbol-35px">
                                        <img src="assets/media/avatars/300-3.jpg" className="rounded-3" alt="user" />
                                    </div>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <div className="app-wrapper flex- flex-row-fluid" id="kt_app_wrapper">
                        <div id="kt_app_sidebar" className="app-sidebar flex-column" style={{ marginTop: '-6rem', width: '13%' }} data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
                            <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
                                <Link to='/dashboard'>
                                    <img alt="Logo" src={LogoImg} className="h-50px app-sidebar-logo-default" />
                                    <img alt="Logo" src={LogoImg} className="h-50px app-sidebar-logo-minimize" />
                                </Link>
            
                                {/* <div id="kt_app_sidebar_toggle" className="app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate" data-kt-toggle="true" data-kt-toggle-state="active" data-kt-toggle-target="body" data-kt-toggle-name="app-sidebar-minimize">
                                    <i className="ki-duotone ki-black-left-line fs-3 rotate-180">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                </div> */}
                            </div>
                            <div className="app-sidebar-menu overflow-hidden flex-column-fluid" >
                                <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper">
                                    <div id="kt_app_sidebar_menu_scroll" className="scroll-y my-5 mx-3" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer" data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px" data-kt-scroll-save-state="true">
                                        <div className="menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
                                            {/* <div data-kt-menu-trigger="click" className="menu-item here show menu-accordion">
                                                <span className="menu-link">
                                                    <span className="menu-icon">
                                                        <i className="ki-duotone ki-element-11 fs-2">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                            <span className="path4"></span>
                                                        </i>
                                                    </span>
                                                    <span className="menu-title">Dashboards</span>
                                                </span>
                                            </div> */}
                                            {/* {menuItems && menuItems.map((item, index) => (
                                                <div data-kt-menu-trigger="click" className="menu-item menu-accordion" key={index}>
                                                    <Link to={`${item.MenuPath}`}>
                                                        <span className="menu-link">
                                                            <span className="menu-icon">
                                                                <i className="ki-duotone ki-bank fs-2">
                                                                    <span className="path1"></span>
                                                                    <span className="path2"></span>
                                                                </i>
                                                            </span>
                                                            <span className="menu-title">{item.MenuName}</span>
                                                        </span>
                                                    </Link>
                                                </div>
                                            ))} */}

                                            {menuItems &&
                                                menuItems.map((item, index) => (
                                                    <div key={index} className="menu-item menu-accordion">
                                                        <Link
                                                            to={item.MenuPath}
                                                            className={`menu-link text-dark ${item.SubItems && item.SubItems.length > 0 ? "dropdown-toggle" : ""}`}
                                                            onClick={(e) => {
                                                                if (item.SubItems && item.SubItems.length > 0) {
                                                                    e.preventDefault();
                                                                    toggleDropdown(index);
                                                                }
                                                            }}
                                                            data-bs-toggle={item.SubItems && item.SubItems.length > 0 ? "dropdown" : undefined}
                                                            aria-expanded={activeDropdown === index}
                                                        >
                                                            {/* Use the IconClass dynamically */}
                                                            <i className={`me-3 ${item.IconName}`}></i>
                                                            <span className="menu-title">{item.MenuName}</span>
                                                        </Link>

                                                        {item.SubItems && item.SubItems.length > 0 && (
                                                            <ul className={`dropdown-menu ${activeDropdown === index ? "show" : ""}`}>
                                                                {item.SubItems.map((subItem, subIndex) => (
                                                                    <li key={subIndex}>
                                                                        <Link to={subItem.MenuPath} className="dropdown-item">
                                                                            {subItem.MenuName}
                                                                        </Link>
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
                            {/* <div className="app-sidebar-footer flex-column-auto pt-2 pb-6 px-6" id="kt_app_sidebar_footer">
                                <a href="https://preview.keenthemes.com/html/metronic/docs" className="btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss-="click" title="200+ in-house components and 3rd-party plugins">
                                    <span className="btn-label">Docs & Components</span>
                                    <i className="ki-duotone ki-document btn-icon fs-2 m-0">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                </a>
                            </div> */}
                        </div>
                        <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                            <div className="d-flex flex-column flex-column-fluid">
                                {children}
                            </div>
                            <div id="kt_app_footer" className="app-footer">
                                <div className="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                                    <div className="text-gray-900 order-2 order-md-1">
                                        <span className="text-muted fw-semibold me-1">2024&copy;</span>
                                        <a href="" className="text-gray-800 text-hover-primary">Copper Wind</a>
                                    </div>
                                    <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                                        <li className="menu-item">
                                            <a href="" className="menu-link px-2">About</a>
                                        </li>
                                        <li className="menu-item">
                                            <a href="" className="menu-link px-2">Support</a>
                                        </li>
                                        <li className="menu-item">
                                            <a href="" className="menu-link px-2">Purchase</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
		    </div>             
        </>
    )
};

export default Base;
    