import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { VMS_URL_CONTRACTOR } from "../Config/Config";


export default function AddContactor () {

    const [sessionUserData, setsessionUserData] = useState([]);
    const [shiftsData, setShiftsData] = useState([]);
    const [addSubmitLoading, setAddSubmitLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const userDataString = sessionStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setsessionUserData(userData);
        } else {
            console.log('User data not found in sessionStorage');
        }
    }, []);

    const [formData, setFormData] = useState({
        ContractorName: "",
        ContractorMobileNo: "",
        ContractorEmail: "",
        ContractorCLCount: 0,
    });

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

    const toTitleCase = (str) => {
        return str
          .split(/([.\s])/g) // Split and preserve dots and spaces
          .map(part =>
            /[a-zA-Z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part
          )
          .join('');
      };
      
    
    const handleContactorChange = (e) => {
        setEmailError("");
        const { name, value } = e.target;
    
        if (name === 'ContractorMobileNo') {
            if (!/^\d{0,10}$/.test(value)) {
                Swal.fire({
                    title: "Invalid Input",
                    text: "Please enter a valid 10-digit mobile number without letters or special characters.",
                    icon: "error",
                });
                return;
            }
        }
    
        const updatedValue = name === 'ContractorName' ? toTitleCase(value) : value;
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: updatedValue,
        }));
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(formData.ContractorEmail)) {
            setEmailError('Please enter a valid email ending with ex: .com or .in');
            setAddSubmitLoading(false);
            return;
        }
        try {
            setAddSubmitLoading(true);
            formData.UserId = sessionUserData.UserId

            const payload = {
                OrgId: sessionUserData.OrgId,
                UserId: sessionUserData.Id,
                ContractorName: formData.ContractorName,
                PhoneNumber: formData.ContractorMobileNo,
                CLCount: 0,
                Email: formData.ContractorEmail,
            };
            console.log(payload, 'data sending to api');

            const response = await fetch(`${VMS_URL_CONTRACTOR}POSTContractors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.ResultData, 'result');
                setAddSubmitLoading(false);

                if (data.ResultData[0].Status === 'Success') {
                    Swal.fire({
                        title: "Success",
                        text: "The contractor has been added successfully.",
                        icon: "success",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: data?.ResultData[0]?.ResultMessage || "There was an error adding the contractor.",
                        icon: "error",
                    });
                }
            } else {
                console.error("Request failed:", response.statusText);
                Swal.fire({
                    title: "Error",
                    text: "Failed to submit request",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Error during submission:", error.message);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred",
                icon: "error",
            });
        } finally {
            setAddSubmitLoading(false);
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.(com|in|gov|tech|info|org|net|us|edu|shop|dev)$/i;
        return regex.test(email);
    };

    return (
        <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasRightAdd"
            aria-labelledby="offcanvasRightLabel"
            style={{ width: '75%' }}
        >
            <style>
                {`
                    @media (min-width: 768px) { /* Medium devices and up (md) */
                        #offcanvasRightAdd {
                            width: 30% !important;
                        }
                    }
                `}
            </style>
            <form onSubmit={handleSubmit}>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 id="offcanvasRightLabel" className="mb-0">Request Contracting Agency</h5>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-primary me-2" type="submit" disabled={addSubmitLoading}>
                            {addSubmitLoading ? "Submitting..." : "Submit"}
                        </button>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div className="offcanvas-body" style={{ marginTop: "-2rem", maxHeight: "100vh", overflowY: "auto" }}>
                    <div className="row">
                        <div className="col-12 mb-2">
                            <label className="form-label">Agency Name<span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="ContractorName"
                                className="form-control"
                                placeholder="Enter agency name"
                                value={formData.ContractorName}
                                onChange={handleContactorChange}
                                required
                            />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label">Agency Mobile No<span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="ContractorMobileNo"
                                className="form-control"
                                placeholder="Enter agency mobile no"
                                value={formData.ContractorMobileNo}
                                minLength={10}
                                maxLength={10}
                                onChange={handleContactorChange}
                                required
                            />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label">Agency Email<span className="text-danger">*</span></label>
                            <input
                                type="email"
                                name="ContractorEmail"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                placeholder="Enter agency email address"
                                value={formData.ContractorEmail}
                                onChange={handleContactorChange}
                                required
                            />
                             {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>
                        {/* <div className="col-12 mb-2">
                            <label className="form-label">CL's Count<span className="text-danger">*</span></label>
                            <input
                                type="number"
                                name="ContractorCLCount"
                                className="form-control"
                                placeholder="Enter CL's Count"
                                value={formData.ContractorCLCount}
                                onChange={handleContactorChange}
                                onWheel={(e) => e.target.blur()}
                                required
                            />
                        </div> */}
                    </div>
                </div>
            </form>
        </div>
    )
}