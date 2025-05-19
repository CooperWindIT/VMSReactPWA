import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { VMS_URL, VMS_VISITORS } from "../Config/Config";

export default function AddUser() {
    const [sessionUserData, setsessionUserData] = useState({});
    const [rolesData, setRolesData] = useState([]);
    const [addSubmitLoading, setAddSubmitLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(0); // Initialize as 0 (unchecked)
    const [isActive, setIsActive] = useState(0); 
    const [manager,setManager] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const [formData, setFormData] = useState({
        RoleId: "",
        Name: "",
        Password: "",
        IsActive: 1,
        CreatedBy: "",
        OrgId: "",
        Mobile: "",
        Email: "",
        IsMobile: 1,
        Gender: "",
        NotifyEmail:"",
        ManagerId:""
    });

    const fetchManagerData = async () => {
        try {
            const response = await fetch(`${VMS_VISITORS}getManagers?OrgId=${sessionUserData.OrgId}`);
            if (response.ok) {
                const data = await response.json();
                setManager(data.ResultData);
            } else {
                console.error('Failed to fetch shifts data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching shifts data:', error.message);
        } 
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchManagerData();
        }
    }, [sessionUserData]);

    useEffect(() => {
        const userDataString = sessionStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setsessionUserData(userData);
            setFormData((prev) => ({
                ...prev,
                CreatedBy: userData.Id,
                OrgId: userData.OrgId,
            }));
        }
    }, []);

    const fetchRolesData = async () => {
        if (sessionUserData.OrgId) {
            try {
                const response = await fetch(`${VMS_URL}getRoles?OrgId=${sessionUserData.OrgId}`);
                if (response.ok) {
                    const data = await response.json();
                    setRolesData(data.ResultData);
                } else {
                    console.error('Failed to fetch attendance data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching attendance data:', error.message);
            }
        }
    };

    useEffect(() => {
        if (sessionUserData.OrgId) {
            fetchRolesData();
        }
    }, [sessionUserData]);

    // const handleInputChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     if (name === 'Mobile') {
    //         if (!/^\d{0,10}$/.test(value)) {
    //             Swal.fire({
    //                 title: "Invalid Input",
    //                 text: "Please enter a valid 10-digit mobile number without letters or special characters.",
    //                 icon: "error",
    //             });
    //             return;
    //         }
    //     }
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    //     }));
    // };    

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (name === 'Mobile') {
            if (!/^\d{0,10}$/.test(value)) {
                Swal.fire({
                    title: "Invalid Input",
                    text: "Please enter a valid 10-digit mobile number without letters or special characters.",
                    icon: "error",
                });
                return;
            }
        }
    
        let formattedValue = value;
    
        if (name === 'Name') {
            formattedValue = toTitleCase(value);
        }
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : formattedValue,
        }));
    };

    const handleMobileChange = (event) => {
        setIsMobile(event.target.checked ? 1 : 0);
    };
    
    const handleActiveChange = (event) => {
        setIsActive(event.target.checked ? 1 : 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddSubmitLoading(true);
        if (!validateEmail(formData.Email)) {
            setEmailError('Please enter a valid email ending with ex: .com or .in');
            setAddSubmitLoading(false);
            return;
        }
        formData.IsActive = 1;
        formData.IsMobile = 1;
        // formData.RoleId = formData.RoleId;

        const payload = {
            ...formData,
            IsMobile: 1,
            OrgId: sessionUserData.OrgId,
            CreatedBy: sessionUserData.Id,
        };

        console.log(payload, 'data sending to api')
        try {
            const response = await fetch(`${VMS_URL}POSTUsers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("ld",data)
                if (data.ResultData[0].Status === "Success") {
                    Swal.fire({
                        title: "Success",
                        text: "User has been added successfully.",
                        icon: "success",
                    }).then(() => window.location.reload());
                } else {
                    Swal.fire({
                        title: "Error",
                        text: data.ResultData[0].ResultMessage,
                        icon: "error",
                    });
                }
            }
        } catch (error) {
            console.error("Error during submission:", error.message);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred.",
                icon: "error",
            });
        } finally {
            setAddSubmitLoading(false);
        }
    };

    const toTitleCase = (str) => {
        return str
          .split(/([.\s])/g) // Split and preserve dots and spaces
          .map(part =>
            /[a-zA-Z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part
          )
          .join('');
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
            style={{ minWidth: "45%", maxWidth: "45%" }}
        >
            <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="offcanvas-header d-flex justify-content-between align-items-center">
                    <h5 id="offcanvasRightLabel" className="mb-0">Add User</h5>
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
                <div className="offcanvas-body" style={{ marginTop: "-2rem", maxHeight: "42rem", overflowY: "auto" }}>
                    <div className="row">
                        <div className="col-6 mb-2">
                            <label className="form-label">User Name<span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="Name"
                                className="form-control"
                                placeholder="Enter user name"
                                value={formData.Name}
                                onChange={handleInputChange}
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="col-6 mb-2 position-relative">
                            <label className="form-label">
                                Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="Password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={formData.Password}
                                    autoComplete="new-password"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={togglePasswordVisibility}>
                                    {showPassword ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
                                </span>
                            </div>
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label">Role<span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="RoleId"
                                value={formData.RoleId}
                                onChange={handleInputChange}
                                required
                            >
                                <option disabled>Select Role</option>
                                {rolesData && rolesData.map((role) => (
                                    <option key={role.Id} value={role.Id}>
                                        {role.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label">Mobile<span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="Mobile"
                                className="form-control"
                                placeholder="Enter mobile number"
                                value={formData.Mobile}
                                onChange={handleInputChange}
                                minLength={10}
                                maxLength={10}
                                required
                            />
                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label">Email<span className="text-danger">*</span></label>
                            <input
                                type="email"
                                name="Email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                placeholder="Enter email address"
                                value={formData.Email}
                                onChange={handleInputChange}
                                required
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}

                        </div>
                        <div className="col-6 mb-2">
                            <label className="form-label">Gender<span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="Gender"
                                value={formData.Gender}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="1">Male</option>
                                <option value="0">Female</option>
                            </select>
                        </div>
                        
                        <div className="col-6 mb-2">
                            <label className="form-label">Manager<span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                name="ManagerId"
                                value={formData.ManagerId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Manager</option>
                                {manager && manager?.map((item, index) => (
                                    <option key={index} value={item.Id}>
                                        {item.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="col-3 mt-10">
                            <label className="form-label" htmlFor="isactive" style={{ cursor: 'pointer' }}>Active</label>
                            <input
                                type="checkbox"
                                id="isactive"
                                className="ms-2"
                                checked={isActive === 1}
                                onChange={handleActiveChange}
                                style={{ cursor: 'pointer' }}
                            />
                        </div> */}
                    </div>
                </div>
            </form>
        </div>
    );
}
