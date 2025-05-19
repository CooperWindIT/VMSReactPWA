import React, { useState, useEffect } from "react";
import Base1 from "../Config/Base1";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { VMS_URL, VMS_URL_CONTRACTOR, VMS_URL_REPORT } from "../Config/Config";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PDFEXCELLOGO from '../Assests/Images/cwilogo.png';
import '../Config/Loader.css';


export default function ReportData () {

    const location = useLocation();

    // Use URLSearchParams to get the query parameter
    const queryParams = new URLSearchParams(location.search);
    const ReportId = queryParams.get('reportId');
    // console.log(ReportId)

    // const { ReportId } = useParams();
    const navigate = useNavigate();
    const [sessionUserData, setsessionUserData] = useState({});
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState("");
    const [shiftsData, setShiftsData] = useState([]);
    const [contactorsData, setContactorsData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedShiftId, setSelectedShiftId] = useState(null);
    const [selectedContId, setSelectedContId] = useState(null);
    const [selectedDepId, setSelectedDepId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [reportHead, setReportHead] = useState("");
    const { data, headers } = report;

    useEffect(() => {
        const userDataString = sessionStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setsessionUserData(userData);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const fetchReportHead = async () => {
        try {
            if (sessionUserData && sessionUserData.Id && sessionUserData.OrgId) {
                const response = await fetch(`${VMS_URL_REPORT}getreporthead?OrgId=${sessionUserData.OrgId}&UserId=${sessionUserData.Id}&ReportId=${ReportId}`);
                if (response.ok) {
                    const data = await response.json();
                    setReportHead(data.ResultData[0]);
                    // console.log(data.ResultData[0]);
                } else {
                    console.error('Failed to fetch report header data:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error fetching report header data:', error.message);
        }
    };

    const fetchDepartmentsData = async () => {
            try {
                if (sessionUserData.OrgId) { 
                    const response = await fetch(`${VMS_URL}getDepts?OrgId=9333`);
                    if (response.ok) {
                        const data = await response.json();
                        setDepartments(data.ResultData);
                    } else {
                        console.error('Failed to fetch shifts data:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error fetching shifts data:', error.message);
            }
    };

    const fetchShiftsData = async () => {
        try {
            if (sessionUserData && sessionUserData.OrgId) {
                const response = await fetch(`${VMS_URL_CONTRACTOR}getShiftTimings?OrgId=${sessionUserData.OrgId}`);
                if (response.ok) {
                    const data = await response.json();
                    setShiftsData(data.ResultData);
                } else {
                    console.error('Failed to fetch shifts data:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error fetching shifts data:', error.message);
        }
    };

    const fetchContractorsData = async () => {
        try {
            if (sessionUserData && sessionUserData.OrgId) {
                const response = await fetch(`${VMS_URL_CONTRACTOR}getContractors?OrgId=${sessionUserData.OrgId}&ShiftTypeId=0`);
                if (response.ok) {
                    const data = await response.json();
                    setContactorsData(data.ResultData);
                } else {
                    console.error('Failed to fetch attendance data:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error.message);
        } finally {
            // setDataLoading(false);
        }
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchReportHead();
            fetchDepartmentsData();
            fetchShiftsData();
            fetchContractorsData();
        }
    }, [sessionUserData]);

    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const [selectedFromDt, setSelectedFromDt] = useState(formatDate(startOfMonth));
    const [selectedEndDt, setSelectedEndDt] = useState(formatDate(today));

    const recordsPerPage = 10;
    const totalPages = Math.ceil((data?.length || 0) / recordsPerPage);

    // Get current records to display
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = (data || []).slice(indexOfFirstRecord, indexOfLastRecord);

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

    const fetchReport = async (e) => {
        setLoading(true);
        setError(null);

        const payload = {
            "OrgId": sessionUserData.OrgId,
            "UserId": sessionUserData.Id,
            "ReportId": ReportId,
            "ReportCriteria": {
                "FromDate": selectedFromDt,
                "ToDate": selectedEndDt,
                "ShiftTypeId": 0,
                "DeptId": 0,
                "ContractorId": 0,
            },
        }
        console.log(payload, 'data sending in json payload');

        try {
            const response = await fetch(`${VMS_URL_REPORT}getreport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error("Failed to fetch the report");
            }

            const data = await response.json();
            setLoading(false);
            setReport(data);
            console.log(data, 'reports data getting..');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const reportFilters = reportHead?.ReportFilter?.split(",") || [];

    const generatePDF = () => {
        if (!report?.data || report.data.length === 0) {
            console.warn("No data available for PDF generation.");
            return;
        }
    
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
    
        doc.setProperties({
            title: reportHead.ReportTitle || "Report Data",
            author: "Your Name",
            creator: "Your Application",
        });
    
        const imgWidth = 50;
        const imgHeight = 20;
        const imgX = (pageWidth - imgWidth) / 2; 
    
        doc.addImage(PDFEXCELLOGO, "PNG", imgX, 5, imgWidth, imgHeight);
    
        doc.setFontSize(16);
        doc.text(reportHead.ReportTitle || "Report Data", 10, 30);
    
        const headers = report.headers.map(header => header.trim());
        const tableData = report.data.map(item =>
            headers.map(header =>
                item[header] !== null && item[header] !== undefined 
                    ? item[header].toLocaleString("en-IN") 
                    : "0"
            )
        );
    
        autoTable(doc, {
            startY: 35,
            head: [headers],
            body: tableData,
        });
    
        doc.save(`${reportHead.ReportTitle || "ReportsData"}.pdf`);
    };    
        
    const generateEXCEL = () => {
        if (!report?.data || report.data.length === 0) {
            console.warn("No data available for Excel generation.");
            return;
        }
    
        const wb = XLSX.utils.book_new();
        const headers = report.headers.map(header => header.trim());
    
        const wsData = [
            [reportHead.ReportTitle || "ReportData"],
            ["Logo: Attached in PDF"],   
            [],                           
            headers,                   
            ...report.data.map((item) =>
                headers.map(header =>
                    item[header] !== null && item[header] !== undefined
                        ? item[header].toLocaleString("en-IN") 
                        : "0"
                )
            )
        ];
    
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "ReportData");
        XLSX.writeFile(wb, `${reportHead.ReportTitle || "ReportData"}.xlsx`);
    };
    
    return (
        <Base1>
            <div className="d-flex flex-column flex-column-fluid">
                <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                    <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">{reportHead && reportHead?.ReportTitle}</h1>
                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                                <li className="breadcrumb-item text-muted">
                                    <Link to='/dashboard' className="text-muted text-hover-primary">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                </li>
                                <li className="breadcrumb-item text-muted">Report</li>
                            </ul>
                        </div>
                        <div className="col-2 d-flex justify-content-end ">
                            <button className={`btn border border-md-none border-danger p-0 me-2 ${currentRecords.length === 0 ? 'd-none' : 'd-block'}`}
                                    type="button "
                                    onClick={generatePDF}
                                    disabled={currentRecords.length === 0}
                                >
                                    <i class="fa-regular fa-file-lines text-danger fs-1 p-3"></i>
                                </button>
                                <button className={`btn border border-md-none border-success p-0 me-2 ${currentRecords.length === 0 ? 'd-none' : 'd-block'}`}
                                    type="button"
                                    onClick={generateEXCEL}
                                    disabled={currentRecords.length === 0}
                                >
                                    <i class="fa-regular fa-file-excel text-success fs-1 p-3"></i>
                                </button>
                            </div>
                    </div>
                </div>
                <div id="kt_app_content" className="app-content flex-column-fluid pt-1">
                    <div id="kt_app_content_container" className="app-container container-xxl">
                        <div className="d-flex jusitify-content-between align-items-end">
                            <div className="row col-12 col-md-10">
                                {reportFilters.includes("FromDate") && (
                                    <div className="col-6 col-md-2">
                                        <label className="form-label">From Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={selectedFromDt}
                                            onChange={(e) => setSelectedFromDt(e.target.value)}
                                        />
                                    </div>
                                )}
                                {reportFilters.includes("ToDate") && (
                                    <div className="col-6 col-md-2">
                                        <label className="form-label">To Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={selectedEndDt}
                                            onChange={(e) => setSelectedEndDt(e.target.value)}
                                        />
                                    </div>
                                )}
                                {reportFilters.includes("ShiftTypeId") && (
                                    <div className={`col-6 col-md-2`}>
                                        <label className="form-label">Shift</label>
                                        <select
                                            className="form-select"
                                            name="ShiftTypeId"
                                            value={selectedShiftId}
                                            onChange={(e) => setSelectedShiftId(e.target.value)}
                                        >
                                            <option value="">Choose Shift</option>
                                            {shiftsData && shiftsData?.map((item, index) => (
                                                <option key={index} value={item.Id}>
                                                    {item.ShiftName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {reportFilters.includes("DeptId") && (
                                    <div className={`col-6 col-md-2`}>
                                        <label className="form-label">Department</label>
                                        <select
                                            className="form-select"
                                            name="DeptId"
                                            value={selectedDepId}
                                            onChange={(e) => setSelectedDepId(e.target.value)}
                                        >
                                            <option value="">Choose department</option>
                                            {departments && departments?.map((item, index) => (
                                                <option key={index} value={item.Id}>
                                                    {item.DeptName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {reportFilters.includes("ContractorId") && (
                                    <div className={`col-6 col-md-2`}>
                                        <label className="form-label">Contractor</label>
                                        <select
                                            className="form-select"
                                            name="DeptId"
                                            value={selectedContId}
                                            onChange={(e) => setSelectedContId(e.target.value)}
                                        >
                                            <option value="">Choose contractor</option>
                                            {contactorsData && contactorsData?.map((item, index) => (
                                                <option key={index} value={item.Id}>
                                                    {item.ContractorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="col-1 d-flex align-items-end">
                                    <button className="btn btn-primary" type="button" disabled={loading} onClick={fetchReport}>Submit</button>
                                </div>
                            </div>
                          
                        </div>
                        <div className="card mt-5">
                            <div className="table-responsive">
                                <table className="table align-middle table-row-dashed fs-6 gy-5">
                                    <tr>
                                        {loading && (
                                            <td colSpan="12" className="text-center">
                                                <div className="container"></div>
                                            </td>
                                        )}
                                    </tr>
                                    {!loading && (
                                        <>
                                            <thead>
                                                <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                                                    {headers && headers?.map((header, index) => (
                                                        <th key={index} style={{ padding: "8px", textAlign: "center" }}>
                                                            {header.trim()}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="fw-semibold text-gray-600">
                                                {currentRecords.length > 0 ? (
                                                    currentRecords && currentRecords?.map((row, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            {headers.map((header, colIndex) => (
                                                                <td key={colIndex} style={{ padding: "8px", textAlign: "center" }}>
                                                                    {row[header.trim()] || "N/A"}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={headers && headers?.length} className="text-center">No records found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </>
                                    )}
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
        </Base1>
    )
}