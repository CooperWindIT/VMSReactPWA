import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { VMS_URL, VMS_VISITORS } from "../Config/Config";
import PropTypes from "prop-types";

export default function EditUser({ editObj }) {

  const [sessionUserData, setsessionUserData] = useState({});
  const [rolesData, setRolesData] = useState([]);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);
  const [manager,setManager] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
  };

  const [formData, setFormData] = useState({
    Id: '',
    RoleId: "",
    Name: "",
    Password: "",
    IsActive: true,
    CreatedBy: "",
    OrgId: "",
    Mobile: "",
    Email: "",
    IsMobile: false,
    Gender: "",
    ManagerId:"",
    UpdatedBy: sessionUserData.Id,
  });

  // Fetch session user data
  useEffect(() => {
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setsessionUserData(userData);
      setFormData((prev) => ({
        ...prev,
        CreatedBy: userData.Id,
        OrgId: userData.OrgId,
        UpdatedBy: userData.Id
      }));
    }
  }, []);

   const fetchManagerData = async () => {
      try {
          const response = await fetch(`${VMS_VISITORS}getManagers?OrgId=${sessionUserData.OrgId}`);
          if (response.ok) {
              const data = await response.json();
              console.log("l",data)
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
  }, [editObj]);

  // Fetch roles data
  const fetchRolesData = async () => {
    try {
      const response = await fetch(`${VMS_URL}getRoles?OrgId=${sessionUserData.OrgId}`);
      if (response.ok) {
        const data = await response.json();
        setRolesData(data.ResultData);
        console.log(data.ResultData)
      } else {
        console.error("Failed to fetch roles:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, [editObj]);

  useEffect(() => {
    if (editObj) {
      setFormData({
        Id: editObj.Id,
        RoleId: editObj.RoleId || "",
        Name: editObj.Name || "",
        Password: editObj.Password || "",
        IsActive: editObj.IsActive ? 1 : 0,
        CreatedBy: editObj.CreatedBy || "",
        OrgId: editObj.OrgId || "",
        Mobile: editObj.Mobile || "",
        Email: editObj.Email || "",
        IsMobile: editObj.IsMobile ? 1 : 0,
        Gender: editObj.Gender ? 1 : 0,
        ManagerId: editObj.ManagerId || "",
        UpdatedBy: sessionUserData.Id,
      });
    }
  }, [editObj, sessionUserData.Id]);  

  // Handle form input changes
  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   if (name === 'Mobile') {
  //     if (!/^\d{0,10}$/.test(value)) {
  //       Swal.fire({
  //         title: "Invalid Input",
  //         text: "Please enter a valid 10-digit mobile number without letters or special characters.",
  //         icon: "error",
  //       });
  //       return;
  //     }
  //   }
    
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleInputChange = (e) => {
    setEmailError("");
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
  
    // Apply title case formatting for specific fields
    const formattedValue = (name === 'Name' || name === 'City' || name === 'Department')
      ? toTitleCase(value)
      : value;
  
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };
  

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|in|gov|tech|info|org|net|us|edu|shop|dev)$/i;
    return regex.test(email);
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitLoading(true);
    
    if (!validateEmail(formData.Email)) {
      setEmailError('Please enter a valid email ending with ex: .com or .in');
      setEditSubmitLoading(false);
      return;
  }

    try {
        // if (formData.IsMobile) {
        //     formData.IsMobile = 1;
        // }
        // if (!formData.IsMobile) {
        //     formData.IsMobile = 0;
        // }
        console.log(formData);
      const response = await fetch(`${VMS_URL}UPDTUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.ResultData[0].Status === "Success") {
          Swal.fire({
            title: "Success",
            text: "User has been updated successfully.",
            icon: "success",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({
            title: "Error",
            text: data?.ResultData[0]?.Message || "Failed to update user.",
            icon: "error",
          });
        }
      } else {
        console.error("Failed to submit form:", response.statusText);
        Swal.fire({
          title: "Error",
          text: "Failed to submit form.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error during submission:", error.message);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    } finally {
      setEditSubmitLoading(false);
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


  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasRightEdit"
      aria-labelledby="offcanvasRightLabel"
      style={{ minWidth: "45%", maxWidth: "45%" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="offcanvas-header d-flex justify-content-between align-items-center">
          <h5 id="offcanvasRightLabel" className="mb-0">Edit User</h5>
          <div className="d-flex align-items-center">
            <button className="btn btn-primary me-2" type="submit" disabled={editSubmitLoading}>
              {editSubmitLoading ? "Submitting..." : "Submit"}
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
              <label className="form-label">Name<span className="text-danger">*</span></label>
              <input
                type="text"
                name="Name"
                className="form-control"
                placeholder="Enter user name"
                value={formData.Name}
                onChange={handleInputChange}
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
                // required
              >
                <option value="">Select Role</option>
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
              <label className="form-label" htmlFor="IsMobile">Is Mobile</label>
              <input
                type="checkbox"
                name="IsMobile"
                className="ms-2"
                checked={formData.IsMobile}
                onChange={handleInputChange}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="col-3 mt-10">
              <label className="form-label" htmlFor="IsActive" style={{ cursor: 'pointer' }}>Active</label>
              <input
                type="checkbox"
                name="IsActive"
                className="ms-2"
                checked={formData.IsActive}
                onChange={handleInputChange}
                style={{ cursor: 'pointer' }}
              />
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
}

EditUser.propTypes = {
  editObj: PropTypes.object.isRequired,
};
