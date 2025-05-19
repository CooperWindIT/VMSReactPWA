
import React, { useState, useEffect, useRef } from "react";
import Base1 from "../Config/Base1";
import { Popover } from 'antd';
import { VMS_URL } from "../Config/Config";
import '../Config/Pagination.css';
import AddUser from "./Add";
// import ViewPassCheckInOut from "./PassCheckInOut";
import Swal from 'sweetalert2';
// import EditContactor from "./Edit";
import '../Config/Loader.css';
import EditUser from "./Edit";
import { Link, useNavigate } from "react-router-dom";

export default function UsersList () {

    const navigate = useNavigate();
    const [sessionUserData, setSessionUserData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [eitData, setEditData] = useState([]);

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
            const response = await fetch(`${VMS_URL}getUsers?OrgId=${sessionUserData.OrgId}`);
            if (response.ok) {
                const data = await response.json();
                setUsersData(data.ResultData);
                // console.log(data.ResultData)
            } else {
                console.error('Failed to fetch attendance data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error.message);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchData();
        }
    }, [sessionUserData]);

    const filteredData = usersData && usersData.filter((item) => {
        const userName = item?.Name?.toLowerCase() || '';
        const email = item?.Email?.toLowerCase() || '';
        const role = item?.RoleName?.toLowerCase() || '';
    
        const query = searchQuery.toLowerCase();
    
        return (
            userName.includes(query) ||
            email.includes(query) ||
            role.includes(query)
        );
    });

    const handleEdit = (item) => {
        setEditData(item);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    // Get current records to display
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

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

    
    const handleDeleteUser = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
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
                        UpdatedBy: sessionUserData.Id,
                        Id: item.Id
                    };

                    console.log(payload, item)

                    const response = await fetch(`${VMS_URL}UsersInActive`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    const result = await response.json();
                    console.log(result)
                    if (result.ResultData[0].Status === 'Success') {
                        fetchData();
                        Swal.fire("Success!", "User has been deleted.", "success");
                    } else {
                        const errorData = await response.json();
                        Swal.fire("Error!", errorData.message || "Failed to delete user.", "error");
                    }
                } catch (error) {
                    console.error("Error during user delete:", error.message);
                    Swal.fire("Error!", "An unexpected error occurred.", "error");
                }
            }
        });
    };

    return (
        <Base1>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">Users List</h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                                <Link to='/dashboard' className="text-muted text-hover-primary">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-500 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted">Users</li>
                        </ul>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                        {/* <div className="m-0">
                            <a className="btn btn-sm btn-flex btn-secondary fw-bold" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                <i className="ki-duotone ki-filter fs-6 text-muted me-1">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                </i>Filter
                            </a>
                        </div> */}
                        <a
                            className={`btn btn-primary ${
                                sessionUserData.RoleId === 3 || sessionUserData.RoleId === 1 ? "d-block" : "d-none"
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
                    <div className="row gy-10 gx-xl-10"></div>
                    <div className="card mt-5">
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
                                        placeholder="Search Users" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="card-toolbar">
                                <div className="d-flex justify-content-end" data-kt-customer-table-toolbar="base">
                                    {/* <div className="w-150px me-3">
                                        <select className="form-select form-select-solid" data-control="select2" data-hide-search="true" data-placeholder="Status" data-kt-ecommerce-order-filter="status">
                                            <option>Status</option>
                                            <option value="all">All</option>
                                            <option value="active">Active</option>
                                            <option value="locked">Locked</option>
                                        </select>
                                    </div>
                                    <button type="button" className="btn btn-light-primary me-3" 
                                        data-bs-toggle="offcanvas" 
                                        data-bs-target="#offcanvasRightPassCheckIn" 
                                        aria-controls="offcanvasRightPassCheckIn"
                                    >
                                        <i className="ki-duotone ki-exit-up fs-2">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                        Pass Check In/Out
                                    </button> */}
                                    {/* <button type="button" className="btn btn-primary" data-bs-toggle="offcanvas" 
                                        data-bs-target="#offcanvasRightAdd" 
                                        aria-controls="offcanvasRightAdd">Add</button> */}
                                </div>
                                <div className="d-flex justify-content-end align-items-center d-none" data-kt-customer-table-toolbar="selected">
                                    <div className="fw-bold me-5">
                                    <span className="me-2" data-kt-customer-table-select="selected_count"></span>Selected</div>
                                    <button type="button" className="btn btn-danger" data-kt-customer-table-select="delete_selected">Delete Selected</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            <div className="table-responsive">
                                <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_customers_table">
                                    <thead>
                                        <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                            <th className="">S.No</th>
                                            <th className="min-w-125px">Name</th>
                                            <th className="min-w-125px">Email</th>
                                            <th className="min-w-125px">Mobile</th>
                                            <th className="min-w-125px">Gender</th>
                                            <th className="min-w-100px">Role</th>
                                            {/* <th className="min-w-125px">Status</th> */}
                                            <th className="">Actions</th>
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
                                                        <a className="text-gray-800 text-hover-primary mb-1">{item.Name}</a>
                                                    </td>
                                                    <td>
                                                        <a href="#" className="text-gray-600 text-hover-primary mb-1">{item.Email}</a>
                                                    </td>
                                                    <td>{item.Mobile || 'N/A'}</td>
                                                    <td>{item.Gender === 1 ? 'Male' : 'Female'}</td>
                                                    <td className="text-info">{item.RoleName}</td>
                                                    {/* <td>
                                                        <div className={"badge badge-light-success"}>
                                                            Active
                                                        </div>
                                                    </td> */}
                                                    <td className="">
                                                        <Popover 
                                                            placement="bottom" 
                                                            content={
                                                                <div style={{ width: '8rem' }}>
                                                                    {/* <p 
                                                                        style={{ cursor: 'pointer' }}
                                                                        className="text-hover-warning"
                                                                        data-bs-toggle="offcanvas" 
                                                                        data-bs-target="#offcanvasRightView" 
                                                                        aria-controls="offcanvasRightView"    
                                                                        onClick={() => handleView(item)}
                                                                    
                                                                    ><i className="fa-regular fa-eye me-2 text-primary"></i>View</p> */}
                                                                    <p 
                                                                        style={{ cursor: 'pointer' }} 
                                                                        className="text-hover-warning"
                                                                        data-bs-toggle="offcanvas" 
                                                                        data-bs-target="#offcanvasRightEdit" 
                                                                        aria-controls="offcanvasRightEdit"    
                                                                        onClick={() => handleEdit(item)}
                                                                    >
                                                                        <i className="fa-regular fa-pen-to-square me-2 text-info"></i>
                                                                        Edit
                                                                    </p>
                                                                    <p 
                                                                        style={{ cursor: 'pointer' }} 
                                                                        className="text-hover-warning"
                                                                        onClick={() => handleDeleteUser(item)}
                                                                    >
                                                                        <i className="fa-regular fa-trash-can text-danger me-2"></i>
                                                                        Delete
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

                                            {/* Page Numbers */}
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

                                            {/* Next Button */}
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

            <AddUser />  
            <EditUser editObj={eitData} />
                 
        </Base1>
    )
}