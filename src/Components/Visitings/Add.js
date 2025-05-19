import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { VMS_URL, VMS_VISITORS } from "../Config/Config";

import { DatePicker, Space } from 'antd';
// import  { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';

export default function AddVisit() {

    const [sessionUserData, setsessionUserData] = useState([]);
    const [addSubmitLoading, setAddSubmitLoading] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [Dep, setDep] = useState([]);
    const [emailErrors, setEmailErrors] = useState({});

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
        orgid: sessionUserData.OrgId,
        userid: sessionUserData.Id,
        Operation: "ADD",
        RequestPass: {
            RequestDate: "",
            MeetingDate: "",
            ExpiryDate: "",
            VisitorType: "",
            Remarks: "",
        },
        Attendees: [],
    });

    const handleRequestPassChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            RequestPass: {
                ...prevState.RequestPass,
                [name]: value,
            },
        }));
    };

    const handleDateChange = (value, dateString) => {
        if (value) {
            const selectedDate = value.format('YYYY-MM-DD');
            const selectedTime = value.format('HH:mm');
            // console.log('Selected Date:', selectedDate);
            // console.log('Selected Time:', selectedTime);
            formData.RequestPass.MeetingDate = selectedDate;
            formData.RequestPass.MeetingTime = selectedTime;
        }
    };
    const handleExpiryDateChange = (value) => {
        if (value) {
            const selectedDate = value.format('YYYY-MM-DD');
            formData.RequestPass.ExpiryDate = selectedDate;
        }
    };

    const addAttendee = () => {
        setAttendees([...attendees,
        {
            AttendeName: "",
            PhoneNumber: "",
            Email: "",
            Vehicleinfo: "",
            IsActive: 1,
            DeptId: "",
            Designation: "",
            IsVehicle: false,
            CompanyName: "",
            Notify: 1,
        }]);
    };

    const removeAttendee = (index) => {
        setAttendees(attendees.filter((_, i) => i !== index));
    };

    const [visitorType, setVisitorType] = useState("");

    const handleChange = (event) => {
        setVisitorType(event.target.value);
        // console.log(typeof(event.target.value));
    };


    // const handleAttendeeChange = (index, field, value) => {
    //     setEmailErrors({});
    //     if (field === 'PhoneNumber') {
    //         if (!/^\d{0,10}$/.test(value)) {
    //             Swal.fire({
    //                 title: "Invalid Input",
    //                 text: "Please enter a valid 10-digit mobile number without letters or special characters.",
    //                 icon: "error",
    //             });
    //             return;
    //         }
    //     }
    
    //     setAttendees((prevAttendees) => {
    //         const updatedAttendees = [...prevAttendees];
    //         updatedAttendees[index] = {
    //             ...updatedAttendees[index],
    //             [field]: value,
    //         };
    //         return updatedAttendees;
    //     });
    // };

    const handleAttendeeChange = (index, field, value) => {
        if (field === 'PhoneNumber') {
            if (!/^\d{0,10}$/.test(value)) {
                Swal.fire({
                    title: "Invalid Input",
                    text: "Please enter a valid 10-digit mobile number without letters or special characters.",
                    icon: "error",
                });
                return;
            }
        }
    
        // Optional: Live validate email field on change
        if (field === 'Email') {
            setEmailErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                if (validateEmail(value)) {
                    delete updatedErrors[index];
                } else {
                    updatedErrors[index] = 'Please enter a valid email ending with .com or .in';
                }
                return updatedErrors;
            });
        }
    
        setAttendees((prevAttendees) => {
            const updatedAttendees = [...prevAttendees];
            updatedAttendees[index] = {
                ...updatedAttendees[index],
                [field]: value,
            };
            return updatedAttendees;
        });
    };
    

    const validateEmail = (email) => {
        // console.log("Validating email:", email); // Check if this logs!
        const regex = /^[^\s@]+@[^\s@]+\.(com|in|gov|tech|info|org|net|us|edu|shop|dev)$/i;
        return regex.test(email);
      };
      

    const fetchDep = async () => {
        try {
            if (sessionUserData.OrgId) { 
                const response = await fetch(`${VMS_URL}getDepts?OrgId=${sessionUserData.OrgId}`);
                if (response.ok) {
                    const data = await response.json();
                    setDep(data.ResultData);
                } else {
                    console.error('Failed to fetch shifts data:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error fetching shifts data:', error.message);
        }
    };

    const disabledTime = (current) => {
        if (!current) return {};
      
        const now = dayjs();
      
        // If the selected date is today
        if (current.isSame(now, 'day')) {
          const disabledHours = [];
          for (let i = 0; i < 24; i++) {
            if (i < now.hour()) disabledHours.push(i);
          }
      
          const disabledMinutes = [];
          if (current.hour() === now.hour()) {
            for (let i = 0; i < 60; i++) {
              if (i < now.minute()) disabledMinutes.push(i);
            }
          }
      
          return {
            disabledHours: () => disabledHours,
            disabledMinutes: () => disabledMinutes,
          };
        }
      
        return {};
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchDep();
        }
    }, [sessionUserData]);

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };    

    //region Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddSubmitLoading(true);

        let hasInvalidEmail = false;
        const newEmailErrors = {};

        formData.Attendees.forEach((attendee, index) => {
            console.log("Checking:", attendee.Email);
            if (!validateEmail(attendee.Email)) {
                newEmailErrors[index] = 'Please enter a valid email ending with .com or .in';
                setAddSubmitLoading(false);
                hasInvalidEmail = true;
                return;
            }
        });

        setEmailErrors(newEmailErrors);

        if (hasInvalidEmail) {
            setAddSubmitLoading(false);
            return;
        }

        if (!formData.RequestPass.MeetingDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Meeting Date',
                text: 'Please choose a meeting date!',
            });
            setAddSubmitLoading(false);
            return;
        }
        
        if (!visitorType) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Visitor Type',
                text: 'Please choose visitor type!',
            });
            setAddSubmitLoading(false);
            return;
        }
        
        if (attendees.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Attendees',
                text: 'Please add at least one attendee!',
            });
            setAddSubmitLoading(false);
            return;
        }
        
        try {
            const cleanedAttendees = attendees.map((attendee) => ({
                Id: 0,
                Name: attendee.AttendeName || "",
                Email: attendee.Email || "",
                Mobile: attendee.PhoneNumber || "",
                CompanyName: attendee.CompanyName || "",
                Designation: attendee.Designation || "",
                IsVehicle: attendee.IsVehicle ? 1 : 0,
                VehicleInfo: attendee.Vehicleinfo || "",
                DeptId: attendee.DeptId ? parseInt(attendee.DeptId) : 0,
                Notify: attendee.Notify || 0,
            }));
    
            const updatedFormData = {
                orgid: sessionUserData.OrgId,
                userid: sessionUserData.Id,
                Operation: "ADD",
                RequestPass: {
                    RequestDate: getCurrentDate(),
                    MeetingDate: formData.RequestPass.MeetingDate,
                    MeetingTime: formData.RequestPass.MeetingTime,
                    ExpiryDate: formData.RequestPass.ExpiryDate || null,
                    Remarks: formData.RequestPass.Remarks,
                    VisitorType: visitorType,
                    Status: "DRAFT"
                },
                Attendees: cleanedAttendees
            };
    
            console.log('Payload being sent:', updatedFormData);
    
            const response = await fetch(`${VMS_VISITORS}ManageVisitorsPass`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormData),
            });
            
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setAddSubmitLoading(false);
                if (data[0]?.Success == 1) {
                    Swal.fire({
                        title: 'Success',
                        text: 'The record has been added successfully.',
                        icon: 'success',
                    }).then(() => {
                        window.location.reload();
                    })
                } else {
                    setAddSubmitLoading(false);
                    Swal.fire({ title: 'Error', text: 'There was an error adding the record.', icon: 'error' });
                }
            } else {
                setAddSubmitLoading(false);
                Swal.fire({ title: 'Error', text: 'Failed to submit request', icon: 'error' });
            }
        } catch (error) {
            setAddSubmitLoading(false);
            console.error('Error:', error);
            Swal.fire({ title: 'Error', text: 'An error occurred', icon: 'error' });
        }
    };
   
    // const toTitleCase = (str) => {
    //     return str.replace(/\w\S*/g, (txt) =>
    //         txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    //     );
    // };

    const toTitleCase = (str) => {
        return str
          .split(/([.\s])/g) // Split and preserve dots and spaces
          .map(part =>
            /[a-zA-Z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part
          )
          .join('');
    };

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRightAdd" aria-labelledby="offcanvasRightLabel"
            style={{
                width: '85%',
            }}
        >
            <style>
                {`
                    @media (min-width: 768px) { /* Medium devices and up (md) */
                        #offcanvasRightAdd {
                            width: 55% !important;
                        }
                    }
                `}
            </style>
            <form onSubmit={handleSubmit}>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">

                    <h5 id="offcanvasRightLabel" className="mb-0">Create Visit</h5>
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-primary me-2"
                            type="submit"
                            disabled={addSubmitLoading} 
                        >
                            {addSubmitLoading ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div className="offcanvas-body" style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingBottom: '2rem',
                    maxHeight: 'calc(100vh - 100px)'
                }}>
                    <div className="row">
                        <div className="col-6">
                            <label className="form-label justify-content-start d-flex">Date<span className="text-danger fw-bold">*</span></label>
                            <DatePicker
                                showTime
                                format="DD-MM-YYYY HH:mm"
                                onChange={handleDateChange}
                                style={{ width: '100%', height: '3.4rem' }}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                disabledTime={disabledTime}
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label justify-content-start d-flex">Visitor Type<span className="text-danger fw-bold">*</span></label>
                            <select
                                className="form-select"
                                value={visitorType}
                                onChange={handleChange}
                                required
                            >
                                <option>Choose visitor type</option>
                                <option value='1'>Supplier</option>
                                <option value='2'>Customer</option>
                                <option value='3'>Frequent Visitor</option>
                            </select>
                        </div>
                        <div className={`col-6 ${visitorType === '3' ? 'd-block' : 'd-none'}`}>
                            <label className="form-label justify-content-start d-flex">Expiry Date<span className="text-danger fw-bold">*</span></label>
                            <DatePicker
                                format="DD-MM-YYYY"
                                onChange={handleExpiryDateChange}
                                style={{ width: '100%', height: '3.4rem' }}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                // disabledTime={disabledTime}
                            />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label justify-content-start d-flex">Remarks <span className="text-danger fw-bold">*</span></label>
                            <textarea
                                name="Remarks"
                                className="form-control"
                                rows={3}
                                placeholder="Enter notes.."
                                onChange={handleRequestPassChange}
                                required
                            ></textarea>
                        </div>

                        <div className="d-flex mt-2">
                            <h6 className="text-start mt-1">Visitor List:</h6>
                            <button className="btn btn-info d-flex ms-auto text-hover-primary" type="button" onClick={addAttendee}>
                                <i className="fa-solid fa-person-circle-plus fs-3"></i>
                            </button>
                        </div>
                        {attendees.map((attendee, index) => {
                            const accordionId = `accordion-${index}`;
                            const headingId = `heading-${index}`;
                            const collapseId = `collapse-${index}`;

                            return (
                                <div className="accordion" id={accordionId} key={index}>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id={headingId}>
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#${collapseId}`}
                                                aria-expanded="true"
                                                aria-controls={collapseId}
                                            >
                                                Attendee {index + 1}
                                            </button>
                                        </h2>
                                        <div id={collapseId} className="accordion-collapse collapse show" aria-labelledby={headingId} data-bs-parent={`#${accordionId}`}>
                                            <div className="accordion-body">
                                                <div className="row mb-2 align-items-center">
                                                    <div className="col-3">
                                                        <label className="form-label justify-content-start d-flex">
                                                            Name <span className="text-danger fw-bold">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={attendee.AttendeName}
                                                            onChange={(e) => handleAttendeeChange(index, 'AttendeName', toTitleCase(e.target.value))}
                                                            placeholder="Attendee name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-3">
                                                        <label className="form-label justify-content-start d-flex">
                                                            Mobile <span className="text-danger fw-bold">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={attendee.PhoneNumber}
                                                            onChange={(e) => handleAttendeeChange(index, 'PhoneNumber', e.target.value)}
                                                            placeholder="Mobile no"
                                                            minLength={10}
                                                            maxLength={10}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-3">
                                                        <label className="form-label justify-content-start d-flex">
                                                            Email <span className="text-danger fw-bold">*</span>
                                                        </label>
                                                        {/* <input
                                                            type="email"
                                                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                                            value={attendee.Email}
                                                            onChange={(e) => handleAttendeeChange(index, 'Email', e.target.value)}
                                                            placeholder="Email id"
                                                            required
                                                        />
                                                         {emailError && <div className="invalid-feedback">{emailError}</div>} */}
                                                         <input
                                                            type="email"
                                                            className={`form-control ${emailErrors[index] ? 'is-invalid' : ''}`}
                                                            value={attendee.Email || ""}
                                                            onChange={(e) => handleAttendeeChange(index, "Email", e.target.value)}
                                                            placeholder="Enter email"
                                                        />
                                                        {emailErrors[index] && <div className="invalid-feedback">{emailErrors[index]}</div>}
                                                    </div>
                                                    <div className="col-3">
                                                        <label className="form-label justify-content-start d-flex">Company Name<span className="text-danger fw-bold">*</span></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter company name"
                                                            value={attendee.CompanyName}
                                                            onChange={(e) => handleAttendeeChange(index, 'CompanyName', e.target.value.toUpperCase())}
                                                            minLength={3}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-3 mt-2">
                                                        <label className="form-label justify-content-start d-flex">Designation<span className="text-danger fw-bold">*</span></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter designation"
                                                            value={attendee.Designation}
                                                            onChange={(e) => handleAttendeeChange(index, 'Designation', toTitleCase(e.target.value))}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-3 mt-2">
                                                        <label className="form-label justify-content-start d-flex">Vehicle No</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter vehicle number"
                                                            value={attendee.Vehicleinfo}
                                                            onChange={(e) => handleAttendeeChange(index, 'Vehicleinfo', e.target.value)}
                                                            minLength={4}
                                                        />
                                                    </div>

                                                    <div className="col-3 mt-2">
                                                        <label className="form-label">Department<span className="text-danger fw-bold">*</span></label>
                                                        <select
                                                            className="form-select"
                                                            value={attendee.DeptId}
                                                            onChange={(e) => handleAttendeeChange(index, 'DeptId', e.target.value)}
                                                            required
                                                        >
                                                            <option value="" disabled>Choose dep</option>
                                                            {Dep.map((item, index) => (
                                                                <option key={index} value={item.Id}>
                                                                    {item.DeptName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-2 mt-2">
                                                        <label className="form-label justify-content-start d-flex">Notify</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={attendee.Notify} 
                                                            onChange={(e) => handleAttendeeChange(index, "Notify", e.target.checked ? 1 : 0)}
                                                        />
                                                    </div>
                                                    <div
                                                        className="col-1 d-flex justify-content-end btn text-hover-warning"
                                                        style={{ marginTop: '2rem', cursor: 'pointer' }}
                                                        onClick={() => removeAttendee(index)}
                                                    >
                                                        <i className="fa-regular fa-trash-can fs-4 text-danger"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </form>
        </div>
    )
}