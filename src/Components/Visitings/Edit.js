import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {VMS_URL, VMS_VISITORS} from "../Config/Config";
import Swal from 'sweetalert2';
import axios from 'axios';


export default function EditPass ({passObj}) {

    const [sessionUserData, setsessionUserData] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [attendeesData, setAttendeesData] = useState([]);
    const [Dep, setDep] = useState([]);
    const [errors, setErrors] = useState({});
    const [emailErrors, setEmailErrors] = useState({});

    const [editData, setEditData] = useState({
        "orgid": sessionUserData.OrgId,
        "userid": 1,
        "Operation": "EDIT",
        "RequestPass": {
            "RequestId": "",
            "RequestDate": "",
            'MeetingDate': "",
            'MeetingTime': "",
            'ExpiryDate': "",
            "Remarks": "",
            "VisitorType": "",
            "Status": "",
            "AutoIncNo": "",
        },
        "Attendees": []
    });

    useEffect(() => {
        // console.log(passObj);
        setEditData((prevData) => ({
            ...prevData,
            orgid: sessionUserData.OrgId,
            userid: sessionUserData.UserId,
            Operation: "EDIT",
            RequestPass: {
                RequestId: passObj?.RequestId,
                RequestDate: passObj?.RequestDate,
                MeetingDate: passObj?.MeetingDate ? passObj.MeetingDate.split('T')[0] : "",
                MeetingTime: passObj?.MeetingTime ? passObj.MeetingTime.split('T')[1].split('.')[0] : "",
                ExpiryDate: passObj?.ExpiryDate ? passObj.ExpiryDate.split('T')[0] : "",
                Remarks: passObj?.Remarks,
                VisitorType: passObj?.VisitorType,
                Status: passObj?.Status,
                AutoIncNo: passObj?.AutoIncNo,
            },
            Attendees: prevData.Attendees.length > 0 ? prevData.Attendees : passObj?.Attendees || []
        }));
    }, [passObj, sessionUserData]);    

    const fetchDep = async () => {
        try {
            const response = await fetch(`${VMS_URL}getDepts?OrgId=9333`);
            if (response.ok) {
                const data = await response.json();
                setDep(data.ResultData);
            } else {
                console.error('Failed to fetch shifts data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching shifts data:', error.message);
        }
    };
    
    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchDep();
        }
    }, [sessionUserData]);
      
    useEffect(() => {
        const userDataString = sessionStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setsessionUserData(userData);
        } else {
            console.log('User data not found in sessionStorage');
        }
    }, []);

    const fetchViewEditData = async () => {
        setViewLoading(true);
        try {
            const response = await fetch(`${VMS_URL}getReqPassById?RequestId=${passObj.RequestId}`);
            if (response.ok) {
                const data = await response.json();
                // console.log(data)
                if (data.Status) {
                    const attendeesWithDefaults = data.ResultData.map(attendee => ({
                        Id: attendee.Id || "",
                        Name: attendee.Name || "",
                        Email: attendee.Email || "",
                        Mobile: attendee.Mobile || "",
                        CompanyName: attendee.CompanyName || "",
                        Designation: attendee.Designation || "",
                        IsVehicle: attendee.IsVehicle ?? 0,  // Default value in case undefined
                        VehicleInfo: attendee.VehicleInfo || "",
                        DeptId: attendee.DeptId || "",
                        Notify: attendee.Notify || 0
                    }));
    
                    setAttendeesData(attendeesWithDefaults);
    
                    setEditData((prevData) => ({
                        ...prevData,
                        Attendees: attendeesWithDefaults
                    }));
                } else {
                    setAttendeesData([]);
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
    }, [passObj.RequestId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            RequestPass: {
                ...prevData.RequestPass,
                [name]: value, // This key must match the input's name attribute
            },
        }));
    };

    const handleAddAttendee = () => {
        setEditData((prevData) => ({
            ...prevData,
            Attendees: [
                ...(prevData.Attendees || []), // Ensure Attendees array exists
                {
                    Id: 0,
                    Name: "",
                    Email: "",
                    Mobile: "",
                    CompanyName: "",
                    Designation: "",
                    IsVehicle: 0,
                    VehicleInfo: "",
                    DeptId: "",
                    Notify: 1
                }
            ]
        }));
    };        

    const handleAttendeeChange = (index, key, value) => {
        setEmailErrors({});
        if (key === 'Mobile') {
            // Allow only numbers and ensure a maximum of 10 digits
            if (!/^\d{0,10}$/.test(value)) {
            Swal.fire({
                title: "Invalid Input",
                text: "Please enter a valid 10-digit mobile number without letters or special characters.",
                icon: "error",
            });
            return;
            }
        }
        setEditData((prevData) => {
            const updatedAttendees = [...prevData.Attendees];
    
            if (!updatedAttendees[index]) {
                updatedAttendees[index] = {
                    Id: "",
                    Name: "",
                    Email: "",
                    Mobile: "",
                    CompanyName: "",
                    Designation: "",
                    IsVehicle: 0,
                    VehicleInfo: "",
                    DeptId: "",
                    Notify: 0
                };
            }
    
            updatedAttendees[index][key] = value;
    
            return { ...prevData, Attendees: updatedAttendees };
        });
    };

    const validateForm = () => {
        const newErrors = {};
      
        editData.Attendees.forEach((attendee, index) => {
          if (!attendee.Name) newErrors[`Name-${index}`] = "Name is required.";
          if (!attendee.Mobile) newErrors[`Mobile-${index}`] = "Phone is required.";
          else if (!/^\d{10}$/.test(attendee.Mobile)) newErrors[`Mobile-${index}`] = "Enter a valid 10-digit phone number.";
          if (!attendee.Email) newErrors[`Email-${index}`] = "Email is required.";
          else if (!/\S+@\S+\.\S+/.test(attendee.Email)) newErrors[`Email-${index}`] = "Enter a valid email.";
          if (!attendee.CompanyName) newErrors[`CompanyName-${index}`] = "Company Name is required.";
          if (!attendee.DeptId) newErrors[`DeptId-${index}`] = "Department is required.";
          if (!attendee.Designation) newErrors[`Designation-${index}`] = "Designation is required.";
        });
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.(com|in|gov|tech|info|org|net|us|edu|shop|dev)$/i;
        return regex.test(email);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        let hasInvalidEmail = false;
        const newEmailErrors = {};

        editData.Attendees.forEach((attendee, index) => {
            if (!validateEmail(attendee.Email)) {
                newEmailErrors[index] = 'Please enter a valid email ending with .com or .in';
                hasInvalidEmail = true;
            }
        });

        setEmailErrors(newEmailErrors);

        if (hasInvalidEmail) {
            setEditLoading(false);
            return;
        }
    
        if (!validateForm()) {
            Swal.fire({
              title: 'Error',
              text: 'Please fill all required fields correctly.',
              icon: 'error',
            });
            return;
          }
    
        try {
            const payload = {
                ...editData,
                orgid: sessionUserData?.OrgId,
                userid: sessionUserData?.Id,
            };
    
            console.log(payload, 'data sending to API');
    
            setEditLoading(true);
    
            const response = await fetch(`${VMS_VISITORS}ManageVisitorsPass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            const result = await response.json();
            console.log(result[0])
            if (response.ok) {
                if (result[0].Success === 1) {
                    console.log("🎯 Edit successful:", result);
                    Swal.fire({
                        title: 'Success',
                        text: 'The record has been updated successfully.',
                        icon: 'success',
                    }).then(() => window.location.reload());
                }
            }
             else {
                console.error("Edit failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting data:", error.message);
        } finally {
            setEditLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    }; 
    
    const handleDeleteAttendee = async (attendee, index) => {
        // If attendee has not been saved yet, just remove it from local state
        if (!attendee.Id) {
            setEditData((prev) => {
                const updated = [...prev.Attendees];
                updated.splice(index, 1);
                return { ...prev, Attendees: updated };
            });
            return;
        }
    
        try {
            console.log(sessionUserData.Id, attendee.Id)
            const response = await axios.post(`${VMS_VISITORS}AttendeInActive`, {
                UserId: sessionUserData.Id,
                AttendeId: attendee.Id
            });
            console.log(response.data.ResultData[0])
            if (response.status === 200) {
                if (response.data.ResultData[0].Status === 'Success') {
                    await fetchViewEditData();
                    setEditData((prev) => {
                        const updated = [...prev.Attendees];
                        updated.splice(index, 1);
                        return { ...prev, Attendees: updated };
                    });
                }
            } else {
                console.error('Failed to delete attendee:', response);
                Swal.fire("Error", "Failed to delete attendee.", "error");
            }
        } catch (error) {
            console.error('Error deleting attendee:', error);
            Swal.fire("Error", "Error occurred while deleting attendee.", "error");
        }
    };

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
    };

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRightEdit" aria-labelledby="offcanvasRightLabel"
            style={{ width: '85%' }}
        >
            <style>
                {`
                    #offcanvasRightEdit {
                    width: 80%; /* Default for mobile devices */
                    }

                    @media (min-width: 768px) {  
                    #offcanvasRightEdit {
                        width: 50% !important; /* Medium screens and up */
                    }
                    }

                    @media (min-width: 1200px) {  
                    #offcanvasRightEdit {
                        width: 45% !important; /* Even narrower for large desktops if needed */
                    }
                    }
                `}
            </style>
            <div className="offcanvas-header d-flex justify-content-between align-items-center">
               <h5 id="offcanvasRightLabel" className="mb-0">Edit Visit</h5>
               <div className="d-flex align-items-center">
                   <button 
                       className="btn btn-primary me-2"
                       type="button"
                       onClick={(e) => handleSubmit(e)}  
                   >
                       {editLoading ? 'Updating...' : 'Update'}
                   </button>
                   <button 
                       type="button" 
                       className="btn-close" 
                       data-bs-dismiss="offcanvas" 
                       aria-label="Close"
                   ></button>
               </div>
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
                        <div className="col-6 mb-2">
                            <label className="form-label justify-content-start d-flex">Requested Date</label>
                            <input 
                                type="text"
                                className="form-control"
                                value={formatDate(passObj?.RequestDate)}
                                readOnly
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label justify-content-start d-flex">Meeting Date<span className="text-danger fw-bold">*</span></label>
                            <input 
                                type="date"
                                className="form-control"
                                name="MeetingDate" 
                                value={editData.RequestPass.MeetingDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label justify-content-start d-flex">Time<span className="text-danger fw-bold">*</span></label>
                            <input 
                                type="time"
                                className="form-control"
                                name="MeetingTime" 
                                value={editData.RequestPass.MeetingTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label justify-content-start d-flex">Expiry Date<span className="text-danger fw-bold">*</span></label>
                            <input 
                                type="date"
                                className="form-control"
                                name="ExpiryDate" 
                                value={editData.RequestPass.ExpiryDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label justify-content-start d-flex">Visitor Type<span className="text-danger fw-bold">*</span></label>
                            <select 
                                className="form-select"
                                name="VisitorType" 
                                value={editData.RequestPass.VisitorType}
                                onChange={handleChange}
                            >
                                <option disabled>Choose type</option>
                                <option value='1'>Supplier</option>
                                <option value='2'>Customer</option>
                                <option value='3'>Frequent Visitor</option>
                            </select>
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label justify-content-start d-flex">Remarks</label>
                            <textarea 
                                name="Remarks"
                                className="form-control" 
                                rows={3} 
                                placeholder="Notes.."
                                value={editData.RequestPass.Remarks}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex mt-2">
                        <h4 className={`text-start mt-2 mb-4 ${attendeesData?.length > 0 ? 'd-block' : 'd-none'}`}>Attendees:</h4>
                        <button className="btn btn-info d-flex ms-auto text-hover-primary" type="button" onClick={handleAddAttendee}>
                            <i className="fa-solid fa-person-circle-plus fs-3"></i>
                        </button>
                    </div>
                    {editData.Attendees.map((attendee, index) => (
                        <div key={index} className="mb-2 align-items-center">
                            <div className="row">
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label">Name<span className="text-danger fw-bold">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors[`Name-${index}`] ? 'is-invalid' : ''}`}
                                        value={attendee.Name || ""}
                                        // onChange={(e) => handleAttendeeChange(index, "Name", e.target.value)}
                                        onChange={(e) => handleAttendeeChange(index, "Name", toTitleCase(e.target.value))}
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label">Phone<span className="text-danger fw-bold">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors[`Mobile-${index}`] ? 'is-invalid' : ''}`}
                                        value={attendee.Mobile || ""}
                                        onChange={(e) => handleAttendeeChange(index, "Mobile", e.target.value)}
                                        minLength={10}
                                        maxLength={10}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        placeholder="Enter phone no"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label">Email<span className="text-danger fw-bold">*</span></label>
                                    <input
  type="email"
  className={`form-control ${emailErrors[index] ? 'is-invalid' : ''}`}
  value={attendee.Email || ""}
  onChange={(e) => handleAttendeeChange(index, "Email", e.target.value)}
  placeholder="Enter email"
/>
{emailErrors[index] && <div className="invalid-feedback">{emailErrors[index]}</div>}

                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label justify-content-start d-flex">Company Name<span className="text-danger fw-bold">*</span></label>
                                    <input 
                                        type="text"
                                        className={`form-control ${errors[`CompanyName-${index}`] ? 'is-invalid' : ''}`}
                                        name="CompanyName" 
                                        value={attendee.CompanyName}
                                        onChange={(e) => handleAttendeeChange(index, "CompanyName", e.target.value.toUpperCase())}
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label justify-content-start d-flex">Department<span className="text-danger fw-bold">*</span></label>
                                    <select
                                        className="form-select"
                                        name="DeptId"
                                        value={attendee.DeptId}
                                        onChange={(e) => handleAttendeeChange(index, "DeptId", toTitleCase(e.target.value))}
                                    >
                                        <option value="">Choose Dep</option>
                                        {Dep.map((item, index) => (
                                            <option key={index} value={item.Id}>
                                                {item.DeptName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label justify-content-start d-flex">Designation</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="Designation" 
                                        value={attendee.Designation}
                                        onChange={(e) => handleAttendeeChange(index, "Designation", toTitleCase(e.target.value))}
                                        placeholder="Enter designation"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label justify-content-start d-flex">Vehicle No</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter vehicle no"
                                        name="VehicleInfo" 
                                        value={attendee.VehicleInfo}
                                        onChange={(e) => handleAttendeeChange(index, "VehicleInfo", e.target.value)}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <label className="form-label justify-content-start d-flex">Notify</label>
                                    <input 
                                        type="checkbox"
                                        name="Notify" 
                                        checked={attendee.Notify} 
                                        onChange={(e) => handleAttendeeChange(index, "Notify", e.target.checked ? 1 : 0)}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 my-1">
                                    <button 
                                        className="btn text-danger" 
                                        onClick={() => handleDeleteAttendee(attendee, index)}
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                            <hr className="text-primary shadow"/>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
};

EditPass.propTypes = {
    passObj: PropTypes.object.isRequired
};