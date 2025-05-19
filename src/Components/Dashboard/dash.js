import React, {useState, useEffect} from 'react';
import { VMS_URL, VMS_VISITORS, VMS_URL_CONTRACTOR } from '../Config/Config';
import AddContactor from '../Contarctors/Add';
// import { PieChart } from '@mui/x-charts/PieChart';
// import { desktopOS, valueFormatter } from './webUsageStats';
import { Chart } from "react-google-charts";
import LabourSvg from './labour.svg';
import LaboursSvg from './labours.svg';
// import Slider1 from './8336.jpg';
// import Slider2 from './1598.jpg';
// import Slider3 from './2991.jpg';
import PassCheckIn from '../Visitings/PassCheckIn';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link, useNavigate } from 'react-router-dom';
import ViewVisit from '../Visitings/View';
import Base1 from '../Config/Base1';


export default function Dashboard () {

    const navigate = useNavigate();
    const [sessionUserData, setsessionUserData] = useState({});
    const [dashData, setDashData] = useState({});
    const [visitingData, setVisitorsData] = useState({});
    const [checkedInData, setCheckedInData] = useState({});
    const [checkedInLbrData, setCheckedInLbrData] = useState({});
    const [dataLoading, setDataLoading] = useState(false);
    const [viewDataId, setViewDataId] = useState(null);
    const [visitorsData, setVistorsData] = useState([]);

    useEffect(() => {
        const userDataString = sessionStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setsessionUserData(userData);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const fetchData = async () => {
        if (sessionUserData.OrgId) {
        // setDataLoading(true);
            try {
                const response = await fetch(`${VMS_URL}VMSDashboard?OrgId=${sessionUserData.OrgId}`);
                if (response.ok) {
                    const data = await response.json();
                    setDashData(data);
                    // console.log(data);
                } else {
                    console.error('Failed to fetch attendance data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching attendance data:', error.message);
            }
        }
    };

    useEffect(() => {
        fetchData();
        fetchActiveCheckIns();
        fetchLabourActiveCheckIns();
        fetchTodayVisiotrs();
    }, [sessionUserData]);

    const fetchActiveCheckIns = async () => {
        setDataLoading(true);
        if (sessionUserData && sessionUserData.OrgId) {
            try {
                const response = await fetch(`${VMS_VISITORS}ActiveVisitorCheckIns?OrgId=${sessionUserData.OrgId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.Status) {
                        setCheckedInData(data.ResultData);
                        console.log(data.ResultData, 'getting from serivec view setCheckedInData ');
                    } else {
                        setCheckedInData([]);
                    }
                } else {
                    console.error('Failed to fetch attendees data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching attendees data:', error.message);
            } finally {
                setDataLoading(false);
            }
        }
    };

    const fetchLabourActiveCheckIns = async () => {
        setDataLoading(true);
        try {
            if (sessionUserData && sessionUserData.OrgId) {
                const response = await fetch(`${VMS_URL_CONTRACTOR}ActiveLAbourCheckIns?OrgId=${sessionUserData.OrgId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.Status) {
                        setCheckedInLbrData(data.ResultData);
                        console.log(data.ResultData, '...........................');
                    } else {
                        setCheckedInLbrData([]);
                    }
                } else {
                    console.error('Failed to fetch attendees data:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error fetching attendees data:', error.message);
        } finally {
            setDataLoading(false);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        
        return `${year}-${month}-${day}`;
    };
      
    const fetchTodayVisiotrs = async () => {
        setDataLoading(true);
        const payload = {
            OrgId: sessionUserData.OrgId,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            VisitorType: 0,
            Status:  "APPROVED",
            AutoIncNo: 0,
            RoleId: sessionUserData.RoleId,
            UserId: sessionUserData.Id,
        };

        try {
            const response = await fetch(`${VMS_VISITORS}getReqPasswithFilters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setDataLoading(false);
                const data = await response.json();
                setVistorsData(data);
            } else {
                setDataLoading(false);
                setVistorsData([]);
            }
        } catch (error) {
            setDataLoading(false);
            setVistorsData([]);
        }
    };

    const monthColors = {
        January: "color: #ff5733",
        February: "color: #33ff57",
        March: "color: #3357ff",
        April: "color: #33d6ff",
        May: "color: #ff33f6",
        June: "color: #33fff5",
        July: "color: #f033ff",
        August: "color: #ff8c33",
        September: "color: #338aff",
        October: "color: #a3ff33",
        November: "color: #d633ff",
        December: "color: #33d6ff",
    };

    const chartData = [
        ["Element", "Density", { role: "style" }], // Header row
        ...(dashData?.MonthWiseVisitorsCount
            ? dashData.MonthWiseVisitorsCount.map((item) => [
                  item.MonthName.slice(0, 3), // Use the first 3 letters of the month
                  item.VisitorCount || 0,    // Use 0 if VisitorCount is null or undefined
                  monthColors[item.MonthName] || "color: #000000", // Default to black if no color found
            ])
            : []), // Fallback to an empty array if MonthWiseVisitorsCount is undefined
    ];

    const chartData1 = [
        ["Element", "Density", { role: "style" }], // Header row
        ...(dashData?.MonthWiseCLsCount
            ? dashData.MonthWiseCLsCount.map((item) => [
                  item.MonthName.slice(0, 3), // Use the first 3 letters of the month
                  item.CLsCount || 0,    // Use 0 if VisitorCount is null or undefined
                  monthColors[item.MonthName] || "color: #000000", // Default to black if no color found
            ])
            : []), // Fallback to an empty array if MonthWiseVisitorsCount is undefined
    ];

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,    
        autoplaySpeed: 2000,     
    };

    const handleView = (item) => {
        setViewDataId(item);
        console.log(item)
    };

    const formatDateCheckin = (dateString) => {
        const date = new Date(dateString);
    
        // Extract UTC date components
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getUTCFullYear();
    
        // Extract UTC time components
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };
    
    return (
        <Base1>
            <div className="d-flex flex-column flex-column-fluid">
                <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                    <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                            {/* <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">
                                My Balance: 37,045$</h1> */}
                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                                {/* <li className="breadcrumb-item text-muted">
                                    <a href="index.html" className="text-muted text-hover-primary">Home</a>
                                </li> */}
                                {/* <li className="breadcrumb-item">
                                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                </li> */}
                                <li className="breadcrumb-item text-muted">Dashboard</li>
                            </ul>
                        </div>
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                            <a href="apps/subscriptions/list.html" className={`btn btn-sm fw-bold btn-info ${sessionUserData.RoleId === 3 || sessionUserData.RoleId === 2 ? 'd-none' : 'd-block'}`}
                                data-bs-toggle="offcanvas" 
                                data-bs-target="#offcanvasRightPassCheckIn" 
                                aria-controls="offcanvasRightPassCheckIn">Pass</a>
                        </div>
                    </div>
                </div>
                <div id="kt_app_content" className="app-content flex-column-fluid">
                    <div id="kt_app_content_container" className="app-container container-xxl">
                        <h6>Today Statistics</h6>
                        <div className="row g-5 gx-xl-10 mb-5 mb-xl-10">
                            <div className="" 
                                data-bs-toggle="offcanvas" 
                                data-bs-target="#offcanvasRightTodayLabrCI" 
                                aria-controls="offcanvasRightTodayLabrCI">
                                <div className="row g- gx-xl-10">
                                    <div className="col-md-3">
                                        <div className="card card-flush h-xl-100" style={{ backgroundColor: '#F6E5CA' }}>
                                            <div className="card-header flex-nowrap">
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="card-label fw-bold fs-4 text-gray-800">Labor CheckIn's</span>
                                                    <span className="mt-1 fw-semibold fs-7">{dashData?.TodayActiveLaborCheckIns?.[0]?.TodayActiveLaborCheckins || 0}</span>
                                                </h3>
                                                <div className="card-toolbar">
                                                    <button className="btn btn-icon justify-content-end" data-kt-menu-trigger="click"
                                                        data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true"
                                                        >
                                                        <i className="fa-solid fa-arrow-right-to-bracket fs-1"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card card-flush h-xl-100" style={{ backgroundColor: '#F3D6EF' }}>
                                            <Link to='/contractors'>
                                                <div className="card-header flex-nowrap">
                                                    <h3 className="card-title align-items-start flex-column">
                                                        <span className="card-label fw-bold fs-4 text-gray-800">Contractors</span>
                                                        <span className="mt-1 fw-semibold fs-7" >{dashData?.ContractorCount?.[0]?.ContractorCount || 0}</span>
                                                    </h3>
                                                    <div className="card-toolbar">
                                                        <button className="btn btn-icon justify-content-end" data-kt-menu-trigger="click"
                                                            data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true"
                                                            >
                                                            <i class="fa-solid fa-helmet-safety fs-2"></i>                                                        
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-3" 
                                        data-bs-toggle="offcanvas" 
                                        data-bs-target="#offcanvasRightTodayVisitsCI" 
                                        aria-controls="offcanvasRightTodayVisitsCI"
                                    >
                                        <div className="card card-flush h-xl-100" style={{ backgroundColor: '#BFDDE3' }}>
                                            <div className="card-header flex-nowrap">
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="card-label fw-bold fs-4 text-gray-800">Checked-in Visits</span>
                                                    <span className="mt-1 fw-semibold fs-7" >{dashData?.TodayActiveVisitorsCheckIns?.[0]?.TodayActiveVisitorsCheckins || 0}</span>
                                                </h3>
                                                <div className="card-toolbar">
                                                    <button className="btn btn-icon justify-content-end" data-kt-menu-trigger="click"
                                                        data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true"
                                                        >
                                                        <i class="fa-solid fa-handshake fs-2"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3"
                                        data-bs-toggle="offcanvas" 
                                        data-bs-target="#offcanvasRightTodayVisits" 
                                        aria-controls="offcanvasRightTodayVisits"
                                    >
                                        <div className="card card-flush h-xl-100" style={{ backgroundColor: '#BFDDE3' }}>
                                            <div className="card-header flex-nowrap">
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="card-label fw-bold fs-4 text-gray-800">Visits</span>
                                                    <span className="mt-1 fw-semibold fs-7" >{dashData?.TodayVisitorsCounts?.[0]?.TodayVisitorsCountQUery || 0}</span>
                                                </h3>
                                                <div className="card-toolbar">
                                                    <button className="btn btn-icon justify-content-end" data-kt-menu-trigger="click"
                                                        data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true"
                                                        >
                                                        {/* <i className="ki-duotone ki-dots-square fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                            <span className="path4"></span>
                                                        </i> */}
                                                        <i class="fa-solid fa-user-tie fs-2"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
                            <div className="">
                                <div className="card card-flush overflow-hidden h-xl-100">
                                    <div className="card-header pt-7 mb-2">
                                        <h3 className="card-title text-gray-800 fw-bold">Visit History
                                        </h3>
                                        <div className="card-toolbar">
                                            <div data-kt-daterangepicker="true" data-kt-daterangepicker-opens="left"
                                                className="btn btn-sm btn-light d-flex align-items-center px-4" data-kt-initialized="1">
                                                <div className="text-gray-600 fw-bold">6 Dec 2024 - 4 Jan 2025</div>
                                                <i className="ki-duotone ki-calendar-8 text-gray-500 lh-0 fs-2 ms-2 me-0">
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                    <span className="path3"></span>
                                                    <span className="path4"></span>
                                                    <span className="path5"></span>
                                                    <span className="path6"></span>
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body d-flex justify-content-between flex-column pt-0 pb-1 px-0">
                                        <Chart chartType="ColumnChart" width="100%" height="100%" data={chartData} />
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="card card-flush overflow-hidden h-xl-100">
                                    <div className="card-header pt-7 mb-2">
                                        <h3 className="card-title text-gray-800 fw-bold">Labours History
                                        </h3>
                                        <div className="card-toolbar">
                                            <div data-kt-daterangepicker="true" data-kt-daterangepicker-opens="left"
                                                className="btn btn-sm btn-light d-flex align-items-center px-4" data-kt-initialized="1">
                                                <div className="text-gray-600 fw-bold">6 Dec 2024 - 4 Jan 2025</div>
                                                <i className="ki-duotone ki-calendar-8 text-gray-500 lh-0 fs-2 ms-2 me-0">
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                    <span className="path3"></span>
                                                    <span className="path4"></span>
                                                    <span className="path5"></span>
                                                    <span className="path6"></span>
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body d-flex justify-content-between flex-column pt-0 pb-1 px-0">
                                        <Chart chartType="ColumnChart" width="100%" height="100%" data={chartData1} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* Today Labour Checkin's */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasRightTodayLabrCI"
                aria-labelledby="offcanvasRightLabel"
                style={{ width: '85%' }}
            >
                <style>
                    {`
                        #offcanvasRightTodayLabrCI {
                            width: 80%; /* Default for mobile devices */
                        }

                        @media (min-width: 768px) {  
                            #offcanvasRightTodayLabrCI {
                                width: 50% !important; /* Medium screens and up */
                            }
                        }

                        @media (min-width: 1200px) {  
                            #offcanvasRightTodayLabrCI {
                                width: 45% !important; /* Even narrower for large desktops if needed */
                            }
                        }
                    `}
                </style>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 id="offcanvasRightLabel" className="mb-0">Today Active Labour Checkin's</h5>
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
                    <div className="table-reponsive">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Code</th>
                                    <th>Labor</th>
                                    <th>Check In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataLoading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <div className="container"></div>
                                        </td>
                                    </tr>
                                ) : checkedInLbrData && checkedInLbrData.length > 0 ? (
                                    checkedInLbrData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>CL-{item.Id}</td>
                                    <td>{item.Name}</td>
                                    <td>{formatDateCheckin(item?.ChecKIn)}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        <p>No Data Available</p>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Checked In Visits */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasRightTodayVisitsCI"
                aria-labelledby="offcanvasRightLabel"
                style={{ width: "85%" }}
            >
                <style>
                {`
                    #offcanvasRightTodayVisitsCI {
                    width: 80%; /* Default for mobile devices */
                    }

                    @media (min-width: 768px) {  
                    #offcanvasRightTodayVisitsCI {
                        width: 80% !important; /* Medium screens and up */
                    }
                    }

                    @media (min-width: 1200px) {  
                    #offcanvasRightTodayVisitsCI {
                        width: 45% !important; /* Even narrower for large desktops if needed */
                    }
                    }
                `}
            </style>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 id="offcanvasRightLabel" className="mb-0">Today Checked In Visits</h5>
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
                    <div className="table-reponsive">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Id</th>
                                    <th>Visitor</th>
                                    <th>Mobile</th>
                                    <th>Check In</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataLoading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <div className="container"></div>
                                        </td>
                                    </tr>
                                ) : checkedInData && checkedInData.length > 0 ? (
                                    checkedInData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.AutoIncNo}</td>
                                        <td>{item.Name}</td>
                                        <td>{item.Mobile}</td>
                                        <td>{formatDateCheckin(item.CheckInTime)}</td>
                                        <td
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRightView"
                                            aria-controls="offcanvasRightView"
                                            onClick={() => handleView(item)}
                                        ><i className="fa-regular fa-eye me-2" style={{ cursor: 'pointer' }}></i></td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <p>No Data Available</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Today visits */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasRightTodayVisits"
                aria-labelledby="offcanvasRightLabel"
                style={{ width: "85%" }}
            >
                <style>
                    {`
                        #offcanvasRightTodayVisits {
                            width: 80%; /* Default for mobile devices */
                        }

                        @media (min-width: 768px) {  
                            #offcanvasRightTodayVisits {
                                width: 50% !important; /* Medium screens and up */
                            }
                        }

                        @media (min-width: 1200px) {  
                            #offcanvasRightTodayVisits {
                                width: 45% !important; /* Even narrower for large desktops if needed */
                            }
                        }
                    `}
                </style>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 id="offcanvasRightLabel" className="mb-0">Today Visits</h5>
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
                    <div className="table-reponsive">
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Id</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataLoading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <div className="container"></div>
                                        </td>
                                    </tr>
                                ) : visitorsData && visitorsData.length > 0 ? (
                                    visitorsData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.AutoIncNo}</td>
                                        <td>{new Date(item.MeetingTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{item.Status}</td>
                                        <td
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRightView"
                                            aria-controls="offcanvasRightView"
                                            onClick={() => handleView(item)}
                                        ><i className="fa-regular fa-eye me-2" style={{ cursor: 'pointer' }}></i></td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <p>No Data Available</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <PassCheckIn />
            <AddContactor />
            <ViewVisit viewObj={viewDataId} />         
        </Base1>
    )
}