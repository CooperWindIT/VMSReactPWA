import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { VMS_URL } from "../Config/Config";


export default function ViewVisit ({ viewObj }) {

    // console.log(viewId);

    const [sessionUserData, setsessionUserData] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewData, setViewData] = useState([]);

    // useEffect(() => {
    //     const userDataString = sessionStorage.getItem('userData');
    //     if (userDataString) {
    //         const userData = JSON.parse(userDataString);
    //         setsessionUserData(userData);
    //     } else {
    //         console.log('User data not found in sessionStorage');
    //     }
    // }, []);

    const fetchViewEditData = async () => {
        // console.log(viewObj);
        setViewLoading(true);
        try {
            const response = await fetch(`${VMS_URL}getReqPassById?RequestId=${viewObj.RequestId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.Status) {
                    setViewData(data.ResultData);
                    console.log(data.ResultData, 'getting from serivec view');
                } else {
                    setViewData([]);
                }
            } else {
                console.error('Failed to fetch attendees data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching attendees data:', error.message);
        } finally {
            setViewLoading(false);
        }
    };
    useEffect(() => {
        fetchViewEditData();
    }, [viewObj]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    };      

    const formatDateTime = (dateString, timeString) => {
        if (!dateString) return "Invalid Date";
        
        const date = new Date(dateString);
        
        // Handle cases where timeString is missing or not in correct format
        let hours = "00";
        let minutes = "00";
      
        if (timeString && timeString.match(/T(\d{2}):(\d{2})/)) {
          const timeMatch = timeString.match(/T(\d{2}):(\d{2})/);
          hours = timeMatch[1];
          minutes = timeMatch[2];
        }
      
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
      
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };      

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRightView" aria-labelledby="offcanvasRightLabel"
            // style={{ width: '80%' }}
        >
             <style>
                {`
                    #offcanvasRightView {
                    width: 80%; /* Default for mobile devices */
                    }

                    @media (min-width: 768px) {  
                    #offcanvasRightView {
                        width: 50% !important; /* Medium screens and up */
                    }
                    }

                    @media (min-width: 1200px) {  
                    #offcanvasRightView {
                        width: 45% !important; /* Even narrower for large desktops if needed */
                    }
                    }
                `}
                
            </style>

            <div className="offcanvas-header">
                <h5>View Request</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            {viewLoading ? <p className="text-center">Loading...</p> :
                <div className="offcanvas-body" style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingBottom: '2rem',
                    maxHeight: 'calc(100vh - 100px)',
                    marginTop: '-2rem'
                }}>
                    <div className="row">
                        <div className="col-6 col-md-4 col-lg-4 mb-2">
                            <label className="form-label justify-content-start d-flex">Requested Date</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formatDate(viewData && viewData[0]?.RequestDate)}
                                readOnly
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-4 mb-2">
                            <label className="form-label justify-content-start d-flex">Meeting Date</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formatDateTime(viewData && viewData[0]?.MeetingDate, viewData[0]?.MeetingTime)}
                                readOnly
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-4 mb-2">
                            <label className="form-label justify-content-start d-flex">Visitor Type</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={viewData && viewData[0]?.VisitorType == 2 ? 'Customer' : viewData[0]?.VisitorType == 3 ? 'Frequent Visitor' : 'Supplier'}
                                readOnly
                            />
                        </div>
                        <div className={`col-6 col-md-4 col-lg-4 mb-2 ${viewData[0]?.VisitorType == 3 ? 'd-block' : 'd-none'}`}>
                            <label className="form-label justify-content-start d-flex">Expiry Date</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formatDateTime(viewData && viewData[0]?.ExpiryDate)}
                                readOnly
                            />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label justify-content-start d-flex">Remarks</label>
                            <textarea 
                                name="Remarks"
                                className="form-control" 
                                rows={3} 
                                value={viewData && viewData[0]?.VisitorsRemarks}
                                readOnly
                            ></textarea>
                        </div>
                    </div>
                    <h4 className={`text-start my-2 ${viewData?.length > 0 ? 'd-block' : 'd-none'}`}>Attendees:</h4>
                    {Array.isArray(viewData) && viewData.map((attendee, index) => (
                        <div className={`${viewData.length >= 1 ? 'd-block' : 'd-none'}`}>
                            <div key={index} className={`row mb-2 align-items-center`}>
                                <div className="col-md-4 col-lg-4 col-6">
                                    <label className="form-label justify-content-start d-flex">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={attendee.Name}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-4 col-lg-4 col-6">
                                    <label className="form-label justify-content-start d-flex">
                                        Mobile
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={attendee.Mobile}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-4 col-lg-4 col-6">
                                    <label className="form-label justify-content-start d-flex">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={attendee.Email}
                                        placeholder="Email id"
                                        readOnly
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 mb-2">
                                    <label className="form-label justify-content-start d-flex">Company Name</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={attendee.CompanyName || "N/A"}
                                        readOnly
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 mb-2">
                                    <label className="form-label justify-content-start d-flex">Designation</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={attendee.Designation || "N/A"}
                                        readOnly
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 mb-2">
                                    <label className="form-label justify-content-start d-flex">Department</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={attendee.DeptName || "N/A"}
                                        readOnly
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 mb-2">
                                    <label className="form-label justify-content-start d-flex">Vehicle No</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={attendee.VehicleInfo}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
};

ViewVisit.propTypes = {
    viewObj: PropTypes.object.isRequired
};