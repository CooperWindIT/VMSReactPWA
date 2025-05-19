
import React, { useState, useEffect, useRef } from "react";
import Base1 from "../Config/Base1";
import { Popover } from 'antd';
import { VMS_VISITORS } from "../Config/Config";
import ViewVisit from "./View";
import '../Config/Pagination.css';
import AddVisit from "./Add";
import Swal from 'sweetalert2';
import QRCode from 'qrcode'; 
import PrintPass from './PrintPass';
import EditPass from "./Edit";
import PassCheckIn from "./PassCheckIn";
import '../Config/Loader.css';
import { Link, useNavigate } from "react-router-dom";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

export default function VisitingList () {

    const navigate = useNavigate();
    const [sessionUserData, setSessionUserData] = useState([]);
    const [visitorsData, setVistorsData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [viewObjData, setViewObjData] = useState([]);
    const [editData, setEditData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [printData, setPrintData] = useState([]);
    const [momContent, setMomContent] = useState(''); 
    const [requestId, setRequestId] = useState(null);
    const [displayFilters, setDisplayFilters] = useState(false);
    const [momBtnLoading, setMomBtnLoading] = useState(false);
    const [attachmentFile, setAttachmentFile] = useState(null); // file state

    const handleFileChange = (e) => {
    setAttachmentFile(e.target.files[0]); // store selected file
    };

    const [filters, setFilters] = useState({
        FromDate: "0",
        ToDate: "0",
        VisitorType: "0",
        Status: "0",   
        AutoIncNo: "0",
        Status: "0",
        RoleId: sessionUserData.RoleId,
        UserId: sessionUserData.UserId,
    });
    const printRef = useRef();

    useEffect(() => {
        const userDataString = sessionStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setSessionUserData(userData);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const fetchData = async () => {
        setDataLoading(true);
        try {
            const payload = {
                OrgId: sessionUserData.OrgId,
                FromDate: "0",
                ToDate: "0",
                VisitorType: filters.VisitorType || 0,
                Status: filters.Status || 0,
                AutoIncNo: 0,
                RoleId: sessionUserData.RoleId,
                UserId: sessionUserData.Id,
            };
            // console.log(payload, 'dat sending to api for visitors list');
            const response = await fetch(`${VMS_VISITORS}getReqPasswithFilters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                setVistorsData(data);
                // console.log(data)
            } else {
                console.error('Failed to fetch visitors data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching visitors data:', error.message);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchData();
        }
    }, [sessionUserData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-GB');
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${formattedDate} ${formattedTime}`;
    };
    
    const filteredData = (visitorsData || []).filter((item) => {
        const visitorName = item?.EmployeeName?.toLowerCase() || '';
        const empName = item?.ManagerName?.toLowerCase() || '';
        const status = item?.Status?.toLowerCase() || '';
        const autoIncId = item?.AutoIncNo?.toString() || '';
        const mobile = item?.Mobile?.toString() || '';

        const query = searchQuery.toLowerCase();

        return (
            visitorName.includes(query) ||
            status.includes(query) ||
            autoIncId.includes(searchQuery) ||
            mobile.includes(searchQuery) ||
            empName.includes(searchQuery)

        );
    });

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    const getPaginationNumbers = () => {
        const visiblePages = [];
        if (totalPages <= 6) {
            // Display all pages if total pages are <= 6
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
        } else {
            // Start pages
            if (currentPage <= 3) {
                visiblePages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
            }
            // Middle pages
            else if (currentPage > 3 && currentPage < totalPages - 2) {
                visiblePages.push(1, 2, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1, totalPages);
            }
            // End pages
            else {
                visiblePages.push(1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
        }
        return visiblePages;
    };

    const handlePageClick = (page) => {
        if (page !== "...") setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleView = (item) => {
        setViewObjData(item);
    };

    const handleEdit = (item) => {
        setEditData(item);
    };

    const handlePrintVisit = async (item) => {
        // Just open the print window first
        setTimeout(async () => {
            if (printRef.current) {
                const printWindow = window.open('', '_blank');
     
                // Adding a small delay to ensure all content loads properly.
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print</title>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" />
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css" />
                        </head>
                        <body>
                            <div>${printRef.current.innerHTML}</div>
                        </body>
                    </html>
                `);
     
                printWindow.document.close();
     
                setTimeout(() => {
                    printWindow.focus();  // Ensure the window gets focus
                    printWindow.print();
                    printWindow.close();
                }, 500); // Wait to ensure that the content is fully loaded
            } else {
                console.error('printRef.current is undefined');
            }
        }, 100);
     
        // Only update state after printing logic has run
        setPrintData(item);
     
        const qrData = `${item.AutoIncNo}`;
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(qrData);
            setQrCodeUrl(qrCodeDataUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
     };
     

    const handleActionApprove = (item) => {    
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to approve this visit?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Approve'
        }).then((result) => {
            if (result.isConfirmed) {
                handleApproveSubmit(item);
            }
        });
    };

    const handleActionReject = (item) => {    
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to reject this visit?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Reject'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRejectSubmit(item);
            }
        });
    };

    const handleApproveSubmit = async (item) => {
    
        try {
            const url = `${VMS_VISITORS}PassApproval?RequestId=${item.RequestId}&OrgId=${sessionUserData.OrgId}&UserId=${sessionUserData.Id}`;
    
            const response = await fetch(url, {
                method: 'GET',
            });
    
            const result = await response.json();
            console.log(result, 'accept reject');
    
            if (response.ok) {
                if (result.Status) {
                    fetchData();
                    console.log("✅ Action submitted successfully.");
                } else {
                    console.error("❌ Request failed with server response:", result);
                }
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error("❌ Error submitting action:", error);
        }
    };

    const handleRejectSubmit = async (item) => {
    
        try {
            const url = `${VMS_VISITORS}RejectPass?RequestId=${item.RequestId}&OrgId=${sessionUserData.OrgId}&UpdatedBy=${sessionUserData.Id}`;
    
            const response = await fetch(url, {
                method: 'GET',
            });
    
            const result = await response.json();
            console.log(result, 'accept reject');
    
            if (response.ok) {
                if (result.ResultData[0].Status == 'Success') {
                    fetchData();
                    console.log("✅ Action submitted successfully.");
                } else {
                    console.error("❌ Request failed with server response:", result);
                }
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error("❌ Error submitting action:", error);
        }
    };

    const handleActionCancel = (item) => {
        const confirmButtonText = 'Yes Cancel it!';
    
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to cancel this visit?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText
        }).then((result) => {
            if (result.isConfirmed) {
                handleActionCancelSubmit(item);
            }
        });
    };

    const handleActionCancelSubmit = async (item) => {
        try {
            const payload = {
                OrgId: sessionUserData?.OrgId,
                RequestId: item?.RequestId,
                UpdatedBy: sessionUserData.Id
            };
    
            if (!payload.OrgId || !payload.RequestId) {
                console.error("Error: OrgId or RequestId is missing");
                return;
            }
    
            const response = await fetch(`${VMS_VISITORS}CancelVisit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) 
            });
    
            const result = await response.json();
            console.log(result);
    
            if (response.ok) {
                if (result.Status) {
                    fetchData();
                } else {
                    console.error("Request failed with server response:", result);
                }
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error("Error submitting action:", error);
        }
    };     

    const handleCheckinVisit = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to check in this visitor?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, check in!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });

                    const payload = {
                        CheckInTime: currentTime,
                        UpdatedBy: sessionUserData.Id,
                        RequestId: item.RequestId
                    };

                    // console.log(payload)

                    const response = await fetch(`${VMS_VISITORS}PassCheckIn`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    const result = await response.json();
                    
                    if (result.ResultData[0].Status === 'Success') {
                        fetchData();
                        Swal.fire("Success!", "Visitor has been checked in.", "success");
                    } else {
                        const errorData = await response.json();
                        Swal.fire("Error!", errorData.message || "Failed to check in visitor.", "error");
                    }
                } catch (error) {
                    console.error("Error during check-in:", error.message);
                    Swal.fire("Error!", "An unexpected error occurred.", "error");
                }
            }
        });
    };

    const handleCheckoutVisit = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to check out this visitor?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, check out!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });

                    const payload = {
                        checkOutTime: currentTime,
                        UpdatedBy: sessionUserData.Id,
                        RequestId: item.RequestId
                    };

                    // console.log(payload)

                    const response = await fetch(`${VMS_VISITORS}PassCheckOut`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    const result = await response.json();
                   
                    if (result.ResultData[0].Status === 'Success') {
                        fetchData();
                        Swal.fire("Success!", "Visitor has been checked out.", "success");
                    } else {
                        const errorData = await response.json();
                        Swal.fire("Error!", errorData.message || "Failed to checked out visitor.", "error");
                    }
                } catch (error) {
                    console.error("Error during check-out:", error.message);
                    Swal.fire("Error!", "An unexpected error occurred.", "error");
                }
            }
        });
    };

    const handleMOMSubmit = (item) => {
        setRequestId(item.RequestId);
    };
      
    const submitMOM = async () => {
        if (!momContent) {
          Swal.fire("Error", "Please fill out MOM content", "error");
          return;
        }
      
        setMomBtnLoading(true);
      
        const formData = new FormData();
        formData.append("MOM", momContent);
        formData.append("UpdatedBy", sessionUserData.Id);
        formData.append("RequestId", requestId);
      
        if (attachmentFile) {
          formData.append("Attachment", attachmentFile);
        }
      
        try {
          const response = await fetch(`${VMS_VISITORS}MOMSubmitWithAttachment`, {
            method: "POST",
            body: formData,
          });
      
          const data = await response.json();
          console.log(data)
      
          if (response.ok) {
            setMomBtnLoading(false);
            Swal.fire("Success", "MOM submitted successfully", "success").then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire("Error", "Failed to submit MOM", "error");
            setMomBtnLoading(false);
          }
        } catch (error) {
          Swal.fire("Error", "An unexpected error occurred", "error");
          setMomBtnLoading(false);
        }
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevState) => ({
            ...prevState,
            [name]: value || "0",
        }));
    };
    
    const handleFilter = async () => {
        setDataLoading(true);
        const payload = {
            OrgId: sessionUserData.OrgId,
            FromDate: filters.FromDate || "0",
            ToDate: filters.FromDate ? filters.ToDate || getCurrentDate() : (filters.ToDate || undefined),
            VisitorType: filters.VisitorType || 0,
            Status: filters.Status || 0,
            AutoIncNo: 0,
            RoleId: sessionUserData.RoleId,
            UserId: sessionUserData.Id,
        };
        console.log(payload);

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
                console.log(data)
                setVistorsData(data);
            } else {
                setDataLoading(false);
                setVistorsData([]);
                Swal.fire("Error", "Failed to fetch filtered data.", "error");
            }
        } catch (error) {
            setDataLoading(false);
            setVistorsData([]);
            Swal.fire("Error", "An unexpected error occurred.", "error");
            console.error("Filter error:", error);
        }
    };

    const handleDisplayFilters = () => {
        setDisplayFilters(prevState => !prevState);
    };

    const formatDateTime = (dateString, timeString) => {
        const date = new Date(dateString);
      
        const timeMatch = timeString.match(/T(\d{2}):(\d{2})/);
        const hours = timeMatch ? timeMatch[1] : '00';
        const minutes = timeMatch ? timeMatch[2] : '00';
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const draggerProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            setAttachmentFile(file);
            return false;
        },
        onRemove: () => {
            setAttachmentFile(null);
        },
    };
    

    return (
        <Base1>
            <div className="d-flex flex-column flex-column-fluid">
                <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                    <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">Visitors List</h1>
                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                                <li className="breadcrumb-item text-muted">
                                    <Link to='/dashboard' className="text-muted text-hover-primary">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                </li>
                                <li className="breadcrumb-item text-muted">Visitors</li>
                            </ul>
                        </div>
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                            <div className="m-0">
                                <a className="btn btn-sm btn-flex btn-secondary fw-bold" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end"
                                    onClick={handleDisplayFilters}>
                                    <i className="ki-duotone ki-filter fs-6 text-muted me-1">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>Filter
                                </a>
                            </div>
                            <a
                                className={`btn btn-primary ${
                                    sessionUserData.RoleId === 2 ? "d-none" : "d-block"
                                }`}
                                style={{ height: "3rem" }}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRightAdd"
                                aria-controls="offcanvasRightAdd">Create
                            </a>
                        </div>
                    </div>
                </div>
              

                <div id="kt_app_content" className="app-content flex-column-fluid">
                    <div id="kt_app_content_container" className="app-container container-xxl">
                        <div className="d-block d-lg-none">
                            {displayFilters && (
                            <div className="card-toolbar mb-2">
                                <div 
                                    className="d-flex row  justify-content-center align-items-end "
                                    data-kt-customer-table-toolbar="base"
                                >
                                    {/* Filters Section */}
                                        <div
                                            className={`d-flex flex-column mb-md-0 col-6  mb-2 ${
                                                sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2
                                                    ? "d-block"
                                                    : "d-block"
                                            }`}
                                        >
                                            <label className="form-label">From Date</label>
                                            <input
                                                type="date"
                                                name="FromDate"
                                                value={filters.FromDate}
                                                className="form-control"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div
                                            className={`d-flex flex-column  mb-md-0 col-6   mb-2 ${
                                                sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2
                                                    ? "d-block"
                                                    : "d-block"
                                            }`}
                                        >
                                            <label className="form-label">To Date</label>
                                            <input
                                                type="date"
                                                name="ToDate"
                                                value={filters.ToDate}
                                                min={filters.FromDate}
                                                className="form-control"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div
                                            className={`d-flex flex-column  mb-md-0 col-6  mb-2 ${
                                                sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2
                                                    ? "d-block"
                                                    : "d-block"
                                            }`}
                                        >
                                            <label className="form-label">Type</label>
                                            <select
                                                name="VisitorType"
                                                value={filters.VisitorType}
                                                className="form-select"
                                                onChange={handleInputChange}
                                            >
                                                <option disabled>Choose Type</option>
                                                <option value="0">All</option>
                                                <option value="1">Supplier</option>
                                                <option value="2">Customer</option>
                                            </select>
                                        </div>
                                        <div className="d-flex flex-column  mb-md-0 col-6  mb-2">
                                            <label className="form-label">Status</label>
                                            <select
                                                name="Status"
                                                value={filters.Status}
                                                className="form-select"
                                                onChange={handleInputChange}
                                            >
                                                <option disabled>Choose Status</option>
                                                <option value="0">All</option>
                                                <option value="DRAFT">Draft</option>
                                                <option value="APPROVED">Approved</option>
                                                <option value="REJECTED">Rejected</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELED">Canceled</option>
                                            </select>
                                        </div>

                                    {/* Buttons Section */}
                                        <button
                                            className="btn btn-info col-4  my-2"
                                            onClick={handleFilter}
                                        >
                                            <i className="fa-solid fa-filter"></i>Submit
                                        </button>
                                </div>
                            </div>
                            )}
                         </div>
                         <div className="d-none d-lg-block">
                            {displayFilters && (
                                <div className="card-toolbar mb-2">
                                    <div
                                        className="d-flex flex-column flex-lg-row justify-content-lg-end justify-content-between align-items-end "
                                        data-kt-customer-table-toolbar="base"
                                    >
                                        {/* Filters Section */}
                                            <div
                                                className={`d-flex flex-column me-3 mb-3 mb-md-0 ${
                                                    sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2
                                                        ? "d-block"
                                                        : "d-block"
                                                }`}
                                            >
                                                <label className="form-label">From Date</label>
                                                <input
                                                    type="date"
                                                    name="FromDate"
                                                    value={filters.FromDate}
                                                    className="form-control"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div
                                                className={`d-flex flex-column me-3 mb-3 mb-md-0 ${
                                                    sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2
                                                        ? "d-block"
                                                        : "d-block"
                                                }`}
                                            >
                                                <label className="form-label">To Date</label>
                                                <input
                                                    type="date"
                                                    name="ToDate"
                                                    value={filters.ToDate}
                                                    min={filters.FromDate}
                                                    className="form-control"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div
                                                className={`d-flex flex-column me-3 mb-3 mb-md-0 ${
                                                    sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2
                                                        ? "d-block"
                                                        : "d-block"
                                                }`}
                                            >
                                                <label className="form-label">Type</label>
                                                <select
                                                    name="VisitorType"
                                                    value={filters.VisitorType}
                                                    className="form-select"
                                                    onChange={handleInputChange}
                                                >
                                                    <option disabled>Choose Type</option>
                                                    <option value="0">All</option>
                                                    <option value="1">Supplier</option>
                                                    <option value="2">Customer</option>
                                                </select>
                                            </div>
                                            <div className="d-flex flex-column me-3 mb-3 mb-md-0">
                                                <label className="form-label">Status</label>
                                                <select
                                                    name="Status"
                                                    value={filters.Status}
                                                    className="form-select"
                                                    onChange={handleInputChange}
                                                >
                                                    <option disabled>Choose Status</option>
                                                    <option value="0">All</option>
                                                    <option value="DRAFT">Draft</option>
                                                    <option value="APPROVED">Approved</option>
                                                    <option value="REJECTED">Rejected</option>
                                                    <option value="COMPLETED">Completed</option>
                                                    <option value="CANCELED">Canceled</option>
                                                </select>
                                            </div>

                                        {/* Buttons Section */}
                                            <button
                                                className="btn btn-info"
                                                onClick={handleFilter}
                                            >
                                                <i className="fa-solid fa-filter"></i>Submit
                                            </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card">
                            <div className="card-header border-0 pt-6">
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className="d-flex align-items-center position-relative">
                                        <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-3">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                        <input
                                            type="text"
                                            data-kt-customer-table-filter="search"
                                            className="form-control form-control-solid w-250px ps-10"
                                            placeholder="Search Visitors"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card-body pt-0">
                                <div className="table-responsive">
                                    <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_customers_table">
                                        <thead>
                                            <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                            <th className="">S.No</th>
                                            <th className="min-w-125px">Id</th>
                                            <th className="min-w-125px">Manager</th>
                                            <th className="min-w-125px">Employee</th>
                                            <th className="min-w-125px">Visitor Type</th>
                                            <th className="min-w-125px">Scheduled</th>
                                            <th className="min-w-125px">Status</th>
                                            <th className="text-end min-w-70px">Actions</th>
                                            
                                            </tr>
                                        </thead>
                                        <tbody className="fw-semibold text-gray-600">
                                        {dataLoading ? (
                                            <tr>
                                                <td colSpan="12" className="text-center">
                                                    <div className="container"></div>
                                                </td>
                                            </tr>
                                        ) : currentRecords && currentRecords.length > 0 ? (
                                            currentRecords.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                                                    <td>
                                                        <a className="text-gray-800 text-hover-primary mb-1">{item.AutoIncNo}</a>
                                                    </td>
                                                    <td>
                                                        <a className="text-gray-800 text-hover-primary mb-1">{item.ManagerName}</a>
                                                    </td>
                                                    <td>
                                                        <a className="text-gray-800 text-hover-primary mb-1">{item.EmployeeName}</a>
                                                    </td>
                                                    <td>
                                                        {item.VisitorType === 1 ? 'Supplier' : 'Customer'}
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-light-danger">
                                                            {formatDateTime(item.MeetingDate, item.MeetingTime)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={
                                                                item.Status === "DRAFT"
                                                                    ? "badge badge-light-dark"
                                                                    : item.Status === "APPROVED"
                                                                    ? "badge badge-light-info"
                                                                    : item.Status === "REJECTED"
                                                                    ? "badge badge-light-warning"
                                                                    : item.Status === "CHECKEDOUT"
                                                                    ? "badge badge-light-secondary"
                                                                    : item.Status === "CANCELED"
                                                                    ? "badge badge-light-danger"
                                                                    : item.Status === "COMPLETED"
                                                                    ? "badge badge-light-success"
                                                                    : "badge badge-light"
                                                            }
                                                        >
                                                            {item.Status}
                                                        </div>
                                                        
                                                    </td>
                                                    
                                                    <td className="text-end">
                                                        <Popover
                                                            placement="bottom"
                                                            content={
                                                                <div style={{ width: "8rem" }}>
                                                                    <p
                                                                        style={{ cursor: "pointer" }}
                                                                        className="text-hover-warning"
                                                                        data-bs-toggle="offcanvas"
                                                                        data-bs-target="#offcanvasRightView"
                                                                        aria-controls="offcanvasRightView"
                                                                        onClick={() => handleView(item)}
                                                                    >
                                                                        <i className="fa-regular fa-eye me-2"></i>
                                                                        View
                                                                    </p>
                                                                    <p
                                                                        className={`text-hover-warning ${sessionUserData.RoleId === 3 || sessionUserData.RoleId === 1 || sessionUserData.RoleId === 5 ? 'd-block' : 'd-none'}`}
                                                                        style={{
                                                                            cursor:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 3 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                                ? "pointer"
                                                                                : "not-allowed",
                                                                            pointerEvents:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 3 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                                ? "auto"
                                                                                : "none",
                                                                            opacity:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 3 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                                ? 1
                                                                                : 0.5,
                                                                        }}
                                                                        data-bs-toggle="offcanvas"
                                                                        data-bs-target="#offcanvasRightEdit"
                                                                        aria-controls="offcanvasRightEdit"
                                                                        onClick={() => handleEdit(item)}
                                                                    >
                                                                        <i className="fa-regular fa-pen-to-square me-2 text-info"></i>
                                                                        Edit 
                                                                    </p>
                                                                    <p
                                                                        style={{
                                                                            cursor:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                                ? "pointer"
                                                                                : "not-allowed",
                                                                            pointerEvents:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                                ? "auto"
                                                                                : "none",
                                                                            opacity:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                                ? 1
                                                                                : 0.5,
                                                                        }}
                                                                        className={`text-hover-warning ${
                                                                            sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5
                                                                            ? "d-block"
                                                                            : "d-none"
                                                                        }`}
                                                                        onClick={() =>
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "REJECTED")
                                                                            ? handleActionApprove(item)
                                                                            : null
                                                                        }
                                                                    >
                                                                        <i className="fa-solid fa-check me-2 text-success"></i>
                                                                        Approve
                                                                    </p>
                                                                    <p
                                                                        style={{
                                                                            cursor:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED")
                                                                                ? "pointer"
                                                                                : "not-allowed",
                                                                            pointerEvents:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED")
                                                                                ? "auto"
                                                                                : "none",
                                                                            opacity:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED")
                                                                                ? 1
                                                                                : 0.5,
                                                                        }}
                                                                        className={`text-hover-warning ${
                                                                            sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5 || sessionUserData.RoleId === 1
                                                                            ? "d-block"
                                                                            : "d-none"
                                                                        }`}
                                                                        onClick={() =>
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2 || sessionUserData.RoleId === 5) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED")
                                                                            ? handleActionReject(item)
                                                                            : null
                                                                        }
                                                                    >
                                                                        <i className="fa-solid fa-xmark me-2 text-warning"></i>
                                                                        Reject
                                                                    </p>
                                                                    <p
                                                                        style={{
                                                                            cursor:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 3) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED" || item.Status === "REJECTED")
                                                                                ? "pointer"
                                                                                : "not-allowed",
                                                                            pointerEvents:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 3) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED" || item.Status === "REJECTED")
                                                                                ? "auto"
                                                                                : "none",
                                                                            opacity:
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 3) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED" || item.Status === "REJECTED")
                                                                                ? 1
                                                                                : 0.5,
                                                                        }}
                                                                        className={`text-hover-warning ${
                                                                            sessionUserData.RoleId === 2 || sessionUserData.RoleId === 1
                                                                            ? "d-block"
                                                                            : "d-none"
                                                                        }`}
                                                                        onClick={() =>
                                                                            (sessionUserData.RoleId === 1 || sessionUserData.RoleId === 2) &&
                                                                            (item.Status === "DRAFT" || item.Status === "APPROVED" || item.Status === "REJECTED")
                                                                            ? handleActionCancel(item)
                                                                            : null
                                                                        }
                                                                    >
                                                                        <i className="fa-solid fa-ban me-2 text-danger"></i>
                                                                        Cancel
                                                                    </p>
                                                                    {/* <p
                                                                        style={{
                                                                            cursor: item.Status === "DRAFT" ? "not-allowed" : "pointer",
                                                                            pointerEvents: item.Status === "DRAFT" ? "none" : "auto",
                                                                            opacity: item.Status === "DRAFT" ? 0.5 : 1,
                                                                        }}
                                                                        className={`text-hover-warning ${item.Status === "DRAFT" ? 'disable' : ''}`}
                                                                        onClick={() => {
                                                                            if (item.Status !== "DRAFT") handlePrintVisit(item);
                                                                        }}
                                                                    >
                                                                        <i className="fa-solid fa-print me-2"></i>
                                                                        Print
                                                                    </p> */}
                                                                    <p
                                                                        style={{
                                                                            cursor: item.Status === "CHECKEDOUT" ? "pointer" : "not-allowed",
                                                                            pointerEvents: item.Status === "CHECKEDOUT" ? "auto" : "none",
                                                                            opacity: item.Status === "CHECKEDOUT" ? 1 : 0.5,
                                                                        }}
                                                                        className={`text-hover-warning ${sessionUserData.RoleId === 3 || sessionUserData.RoleId === 1 ? 'd-block' : 'd-none'}`}
                                                                        data-bs-toggle="offcanvas"
                                                                        data-bs-target="#offcanvasRightMOM"
                                                                        aria-controls="offcanvasRightMOM"
                                                                        onClick={() => {
                                                                            if (item.Status === "CHECKEDOUT") handleMOMSubmit(item);
                                                                        }}
                                                                    >
                                                                        <i className="fa-regular fa-handshake me-2"></i>
                                                                        MOM
                                                                    </p>
                                                                  
                                                                    {/* <p
                                                                        style={{
                                                                            cursor: item.Status === "CHECKIN" ? "pointer" : "not-allowed", 
                                                                            pointerEvents: item.Status === "CHECKIN" ? "auto" : "none",  
                                                                            opacity: item.Status === "CHECKIN" ? 1 : 0.5,                
                                                                        }}
                                                                        className={`text-hover-warning ${sessionUserData.RoleId === 4 || sessionUserData.RoleId === 1 ? 'd-block' : 'd-none'}`}
                                                                        onClick={() => handleCheckoutVisit(item)}
                                                                    >
                                                                        <i className="fa-solid fa-arrow-left me-2 text-danger"></i>
                                                                        Check Out
                                                                    </p> */}
                                                                </div>
                                                            }
                                                            trigger="click"
                                                        >
                                                            <button className="btn">
                                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                                            </button>
                                                        </Popover>
                                                    </td>
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
                                    <div className="dt-paging paging_simple_numbers">
                                        <nav aria-label="pagination">
                                            <ul className="pagination">
                                                <li
                                                    className={`dt-paging-button page-item ${currentPage === 12 ? "disabled" : ""}`}
                                                >
                                                    <button
                                                        className="page-link previous"
                                                        role="link"
                                                        type="button"
                                                        aria-controls="kt_customers_table"
                                                        aria-disabled={currentPage === 1}
                                                        aria-label="Previous"
                                                        onClick={handlePrevious}
                                                    >
                                                        <i className="previous"></i>
                                                    </button>
                                                </li>

                                                {getPaginationNumbers().map((page, index) => (
                                                    <li
                                                        key={index}
                                                        className={`dt-paging-button page-item ${page === currentPage ? "active" : ""}`}
                                                    >
                                                        <button
                                                            className="page-link"
                                                            role="link"
                                                            type="button"
                                                            aria-controls="kt_customers_table"
                                                            aria-current={page === currentPage ? "page" : undefined}
                                                            onClick={() => handlePageClick(page)}
                                                            disabled={page === "..."}
                                                        >
                                                            {page}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li
                                                    className={`dt-paging-button page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                                >
                                                    <button
                                                        className="page-link next"
                                                        role="link"
                                                        type="button"
                                                        aria-controls="kt_customers_table"
                                                        aria-disabled={currentPage === totalPages}
                                                        aria-label="Next"
                                                        onClick={handleNext}
                                                    >
                                                        <i className="next"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mom Submit */}
            <style>
                {`
                    @media (min-width: 768px) { /* Medium devices and up (md) */
                        #offcanvasRightMOM {
                            width: 45% !important;
                        }
                    }
                `}
            </style>
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasRightMOM"
                aria-labelledby="offcanvasRightLabel"
                style={{ width: '85%' }}
            >
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 id="offcanvasRightLabel" className="mb-0">Submit MOM</h5>
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
                    <div className="row">
                        <div className="col-12">
                            <Dragger {...draggerProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single upload. Strictly prohibited from uploading company data or other
                                    banned files.
                                </p>
                            </Dragger>
                        </div>
                        <div className="col-12 mt-13">
                            <label className="form-label">Remarks</label>
                            <textarea
                                value={momContent}
                                className="form-control"
                                onChange={(e) => setMomContent(e.target.value)}
                                rows="5"
                                placeholder="Enter your MOM details here..."
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary d-flex m-auto mt-5"
                        onClick={submitMOM}
                        disabled={!momContent}
                    >
                        {momBtnLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>

            <ViewVisit viewObj={viewObjData} />         
            <AddVisit />  
            <EditPass passObj={editData} />
            <PassCheckIn />

             {/* print */}
            <div className='d-none'>
                {printData ? (
                    <PrintPass ref={printRef} data={printData} qrCodeUrl={qrCodeUrl}/>
                ) : (
                    <p>Loading...</p>
                )}
            </div>                    
        </Base1>
    )
}