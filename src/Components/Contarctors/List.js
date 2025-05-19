import React, { useState, useEffect, useRef } from "react";
import Base1 from "../Config/Base1";
import { Popover } from 'antd';
import { VMS_URL, VMS_URL_CONTRACTOR } from "../Config/Config";
import '../Config/Pagination.css';
import AddContactor from "./Add";
import ViewPassCheckInOut from "./PassCheckInOut";
import Swal from 'sweetalert2';
import EditContactor from "./Edit";
import '../Config/Loader.css';
import { Link, useNavigate } from "react-router-dom";
import AddContactorCL from "./AddCL";
import EditContactorCL from "./EditCL";
import CheckInContactorCL from "./CheckIn";
import CheckOutContactorCL from "./CheckOut";
import Screen from "../Visitings/Screen";
import AadhaarScanner from "../Dashboard/adar1";

export default function ContactorsList () {

    const navigate = useNavigate();
    const [sessionUserData, setSessionUserData] = useState([]);
    const [contractorsData, setContactorsData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewDataId, setViewDataId] = useState([]);
    const [addConCL, setAddConCL] = useState([]);
    const [editConCL, setEditConCL] = useState([]);
    const [checkInConCL, setCheckInConCL] = useState([]);
    const [checkOutConCL, setCheckOutConCL] = useState([]);
    const [checkOutCL, setCheckOutCL] = useState([]);
    const [eitDataId, setEditDataId] = useState([]);
    const [selectedShiftType, setSelectedShiftType] = useState(null);
    const [shiftsData, setShiftsData] = useState([]);

    useEffect(() => {
        const userDataString = sessionStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setSessionUserData(userData);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const fetchData = async () => {
        setDataLoading(true);
        try {
            const response = await fetch(`${VMS_URL_CONTRACTOR}getContractors?OrgId=${sessionUserData.OrgId}&ShiftTypeId=0`);
            if (response.ok) {
                const data = await response.json();
                setContactorsData(data.ResultData);
                // console.log(data.ResultData);
            } else {
                console.error('Failed to fetch attendance data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error.message);
        } finally {
            setDataLoading(false);
        }
    };

    const fetchFilterData = async () => {
        setDataLoading(true);
        try {
            const response = await fetch(`${VMS_URL_CONTRACTOR}getContractors?OrgId=${sessionUserData.OrgId}&ShiftTypeId=${selectedShiftType}`);
            if (response.ok) {
                const data = await response.json();
                setContactorsData(data.ResultData);
            } else {
                console.error('Failed to fetch attendance data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error.message);
        } finally {
            setDataLoading(false);
        }
    };

     const fetchShiftsData = async () => {
        try {
            const response = await fetch(`${VMS_URL_CONTRACTOR}getShiftTimings?OrgId=${sessionUserData.OrgId}`);
            if (response.ok) {
                const data = await response.json();
                setShiftsData(data.ResultData);
            } else {
                console.error('Failed to fetch shifts data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching shifts data:', error.message);
        } 
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchShiftsData();
        }
    }, [sessionUserData]);

    useEffect(() => {
        if (selectedShiftType) {
            fetchFilterData();
        }
    }, [selectedShiftType]);    

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

    // const filteredData = contractorsData && contractorsData.filter((item) => {
    //     const contractorName = item?.ContractorName?.toLowerCase() || '';
    //     const shiftname = item?.ShiftName?.toLowerCase() || '';
    
    //     const query = searchQuery.toLowerCase();
    
    //     return (
    //         contractorName.includes(query) ||
    //         shiftname.includes(query) 
    //     );
    // });pavan

    const filteredData = contractorsData && contractorsData.filter((item) => {
        const contractorName = item?.ContractorName?.toLowerCase() || '';
        const shiftname = item?.ShiftName?.toLowerCase() || '';
    
        const query = searchQuery.toLowerCase();
    
        return contractorName.includes(query) || shiftname.includes(query); // pavan
    });
    

    const handleView = (item) => {
        setViewDataId(item.Id);
    };
    const handleEdit = (item) => {
        setEditDataId(item);
    };
    const handleAddConCL = (item) => {
        setAddConCL(item);
    };
    const handleEditConCL = (item) => {
        setEditConCL(item);
    };
    const handleCheckInConCL = (item) => {
        setCheckInConCL(item);
    };
    const handleCheckOutConCL = (item) => {
        setCheckOutConCL(item);
    };
    const handleCheckOutCL = (item) => {
        setCheckOutCL(item);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const totalPages = Math.ceil((filteredData?.length || 0) / recordsPerPage);

    // Get current records to display
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = (filteredData || []).slice(indexOfFirstRecord, indexOfLastRecord);

    const getPaginationNumbers = () => {
        const visiblePages = [];
        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
        } else {
            if (currentPage <= 3) {
                visiblePages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
            }
            else if (currentPage > 3 && currentPage < totalPages - 2) {
                visiblePages.push(1, 2, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1, totalPages);
            }
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

    const handleGeneratePass = (item, action) => {
            const confirmButtonText = 'Yes, generate it!';
        
            Swal.fire({
                title: `Are you sure?`,
                text: `Do you want to generate pass?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: confirmButtonText
            }).then((result) => {
                if (result.isConfirmed) {
                    // setAcceptFormData(item);
                    handleActionSubmit(item, action);
                }
            });
    };

    const handleActionSubmit = async (item, action) => {   
        const currentDate = new Date();     
        const payload = {
            "orgid": sessionUserData.OrgId,
            "userid": sessionUserData.Id,
            "Time": currentDate.toLocaleTimeString(),
            "Date": currentDate.toISOString().split('T')[0],
            "QRCode": `QR-000${item.Id}`,
            "ContractorId": item.Id
        };
        
        console.log(payload, 'payloadpayload')
    
        try {
            const response = await fetch(`${VMS_URL_CONTRACTOR}ManageLaborQRPass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(result)
            
            if (response.ok) {
                if (result.Status) {
                    fetchData();
                }
                throw new Error("Request failed with status " + response.status);
            }
            console.log("Request successful:", await response.json());
        } catch (error) {
            console.error("Error submitting action:", error);
        }
    };

    const handleCheckInLabour = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to check in this labours?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, check in!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const now = new Date();
                    const currentTime = `${now.getFullYear()}-${String(
                    now.getMonth() + 1
                    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
                    now.getHours()
                    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
                    now.getSeconds()
                    ).padStart(2, "0")}.000`;

                    const payload = {
                        CheckIn: currentTime,
                        UpdatedBy: sessionUserData.Id,
                        ContractorId: item.Id
                    };

                    // console.log(payload, item)

                    const response = await fetch(`${VMS_URL}LaborCheckIn`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    const result = await response.json();
                    // console.log(result)
                    if (result.ResultData[0].Status === 'Success') {
                        fetchData();
                        Swal.fire("Success!", "Labours has been checked in.", "success");
                    } else {
                        const errorData = await response.json();
                        Swal.fire("Error!", errorData.message || "Failed to check in labours.", "error");
                    }
                } catch (error) {
                    console.error("Error during check-in:", error.message);
                    Swal.fire("Error!", "An unexpected error occurred.", "error");
                }
            }
        });
    };

    const handleCheckOutLabour = async (item) => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to check out this labours?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, check out!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const now = new Date();
                const currentTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.000`;

                const payload = {
                    CheckOut: currentTime,
                    UpdatedBy: sessionUserData.Id,
                    ContractorId: item.Id
                };

                console.log("Payload:", payload);

                const response = await fetch(`${VMS_URL}LaborCheckOut`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                // Log HTTP status code for debugging
                console.log("HTTP Status:", response.status);

                const resultData = await response.json();
                console.log("API Response:", resultData);

                if (response.ok && resultData.ResultData && resultData.ResultData[0].Status === 'Success') {
                    fetchData();
                    Swal.fire("Success!", "Labours has been checked out.", "success");
                } else {
                    // If API returns an error message in the response, use it
                    const errorMessage = resultData.message || "Failed to check out labours.";
                    Swal.fire("Error!", errorMessage, "error");
                }
            } catch (error) {
                console.error("Error during check-out:", error);
                Swal.fire("Error!", error.message || "An unexpected error occurred.", "error");
            }
        }
    });
};
    return (
        <Base1>
           <div className="d-flex flex-column flex-column-fluid">
                <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                    <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">Contractors List</h1>
                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                                <li className="breadcrumb-item text-muted">
                                    <Link to='/dashboard' className="text-muted text-hover-primary">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                </li>
                                <li className="breadcrumb-item text-muted">Contractors</li>
                            </ul>
                        </div>
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                            <a
                                className={`btn btn-primary ${
                                    sessionUserData.RoleId === 3 || sessionUserData.RoleId === 1 ? "d-block" : "d-none"
                                }`}
                                style={{ height: "3rem" }}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRightAdd"
                                aria-controls="offcanvasRightAdd">Request Contracting Agency
                            </a>
                        </div>
                    </div>
                </div>

                <div id="kt_app_content" className="app-content flex-column-fluid">
                    <div id="kt_app_content_container" className="app-container container-xxl">
                        <div className="card">
                            <div className="card-header border-0 pt-6">
                                <div className="card-title">
                                    <div className="d-flex align-items-center position-relative my-1">
                                        <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                        <input
                                            type="text" 
                                            data-kt-customer-table-filter="search" 
                                            className="form-control form-control-solid w-250px ps-13"
                                            placeholder="Search Contractors" 
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
                                                <th className="min-w-125px">Agency Name</th>
                                                <th className="min-w-125px">Agency Email</th>
                                                <th className="min-w-125px">Agency Mobile</th>
                                                {/* <th className="min-w-125px">CL Count</th> */}
                                                <th className="min-w-125px">Status</th>
                                                <th className="text-end min-w-70px">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fw-semibold text-gray-600">
                                            {dataLoading ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        <div className="container"></div>
                                                    </td>
                                                </tr>
                                            ) : currentRecords && currentRecords.length > 0 ? (
                                                currentRecords.map((item, index) => (
                                                    <tr>
                                                        <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                                                        <td>
                                                            <a
                                                                className="text-gray-800 text-hover-primary mb-1"
                                                                title={item.ContractorName}
                                                            >
                                                                {item.ContractorName.length > 25
                                                                ? item.ContractorName.slice(0, 25) + "..."
                                                                : item.ContractorName}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <a
                                                                className="text-gray-600 text-hover-primary mb-1"
                                                                title={item.Email}
                                                            >
                                                                {item.Email.length > 30
                                                                ? item.Email.slice(0, 30) + "..."
                                                                : item.Email}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <a className="text-gray-600 text-hover-primary mb-1">{item.PhoneNumber}</a>
                                                        </td>
                                                        {/* <td className="text-primary">{item.CLCount}</td> */}
                                                        <td>
                                                            <div className={"badge badge-light-success"}>
                                                                Active
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <Popover 
                                                                placement="bottom" 
                                                                content={
                                                                    <div style={{ width: '12rem' }}>
                                                                        {/* <p 
                                                                            style={{ cursor: 'pointer' }}
                                                                            className="text-hover-warning"
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightView" 
                                                                            aria-controls="offcanvasRightView"    
                                                                            onClick={() => handleView(item)}
                                                                        
                                                                        ><i className="fa-regular fa-eye me-2 text-primary"></i>View</p> */}
                                                                        <p
                                                                            className={`text-hover-warning cursor-pointer ${sessionUserData.RoleId === 3 || sessionUserData.RoleId === 1 ? 'd-block' : 'd-none'}`}
                                                                            data-bs-toggle="offcanvas"
                                                                            data-bs-target="#offcanvasRightEdit"
                                                                            aria-controls="offcanvasRightEdit"
                                                                            onClick={() => handleEdit(item)}
                                                                        >
                                                                            <i className="fa-regular fa-pen-to-square me-2 text-info"></i>
                                                                            Edit 
                                                                        </p>
                                                                        <p 
                                                                            className="text-hover-warning cursor-pointer"
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightAddCL" 
                                                                            aria-controls="offcanvasRightAddCL"    
                                                                            onClick={() =>handleAddConCL(item)}
                                                                        >
                                                                            <i className="fa-solid fa-helmet-safety me-2 text-primary"></i>
                                                                            Add CL
                                                                        </p>
                                                                        {/* <p
                                                                            style={{ cursor: "pointer" }}
                                                                            className="text-hover-warning"
                                                                            onClick={() => handleCheckInLabour(item)}
                                                                        >
                                                                            <i className="fa-solid fa-arrow-right me-2 text-success"></i>
                                                                            Check In
                                                                        </p> */}
                                                                        {/* <p
                                                                            style={{ cursor: "pointer" }}
                                                                            className="text-hover-warning"
                                                                            onClick={() => handleCheckOutLabour(item)}
                                                                        >
                                                                            <i className="fa-solid fa-arrow-left me-2 text-danger"></i>
                                                                            Check Out
                                                                        </p>
                                                                        <p 
                                                                            style={{ cursor: 'pointer' }} 
                                                                            className="text-hover-warning"
                                                                            onClick={() =>handleGeneratePass(item)}
                                                                        >
                                                                            <i className="fa-regular fa-address-card me-2 text-warning"></i>Pass
                                                                        </p> */}
                                                                        {/* <p 
                                                                            style={{ cursor: 'pointer' }} 
                                                                            className="text-hover-warning"
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightAddCL" 
                                                                            aria-controls="offcanvasRightAddCL"   
                                                                            onClick={() =>handleAddConCL(item)}
                                                                        >
                                                                            <i className="fa-regular fa-address-card me-2 text-warning"></i>Add CL
                                                                        </p> 
                                                                        <p 
                                                                            style={{ cursor: 'pointer' }} 
                                                                            className="text-hover-warning"
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightEditCL" 
                                                                            aria-controls="offcanvasRightEditCL"   
                                                                            onClick={() =>handleEditConCL(item)}
                                                                        >
                                                                            <i className="fa-regular fa-address-card me-2 text-info"></i>Edit CL
                                                                        </p> 
                                                                        <p 
                                                                            style={{ cursor: 'pointer' }} 
                                                                            className="text-hover-warning"
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightChekInCL" 
                                                                            aria-controls="offcanvasRightChekInCL"   
                                                                            onClick={() =>handleCheckInConCL(item)}
                                                                        >
                                                                            <i className="fa-solid fa-arrow-right-arrow-left me-2 text-success"></i>Check In
                                                                        </p> 
                                                                        <p 
                                                                            style={{ cursor: 'pointer' }} 
                                                                            className="text-hover-warning"
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightChekOutCL" 
                                                                            aria-controls="offcanvasRightChekOutCL"   
                                                                            onClick={() =>handleCheckOutConCL(item)}
                                                                        >
                                                                            <i className="fa-solid fa-arrow-right-arrow-left me-2 text-danger"></i>Check Out
                                                                        </p>  */}
                                                                         <p 
                                                                            className="text-hover-warning cursor-pointer" 
                                                                            data-bs-toggle="offcanvas" 
                                                                            data-bs-target="#offcanvasRightChekOutCLScan" 
                                                                            aria-controls="offcanvasRightChekOutCLScan"   
                                                                            onClick={() =>handleCheckOutCL(item)}
                                                                        >
                                                                            <i className="fa-solid fa-arrow-right-arrow-left me-2 text-danger"></i>Checkin/Checkout
                                                                        </p> 
                                                                    </div>
                                                                }
                                                                trigger="click"
                                                            >
                                                                <button 
                                                                    className="btn"
                                                                >
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
                                                    className={`dt-paging-button page-item ${currentPage === 1 ? "disabled" : ""}`}
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

            <AddContactor />  
            <EditContactor editObj={eitDataId} />
            <ViewPassCheckInOut viewId={viewDataId} />
            <AddContactorCL conObj={addConCL} />
            <EditContactorCL conObj={editConCL} />
            <CheckInContactorCL conObj={checkInConCL} />
            <CheckOutContactorCL conObj={checkOutConCL} />
            <AadhaarScanner conObj={checkOutCL} />
        </Base1>
    )
}