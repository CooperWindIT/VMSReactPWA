import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VMS_URL, VMS_VISITORS } from "../Config/Config";
import LogoImg from "../Assests/Images/logo.jpg";
import myVideo from "../Assests/Images/1234.mp4";

export default function SignIn() {

    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotEmailBtnLoading, setForgotEmailBtnLoading] = useState(false);
    const [frogotPWDBtnLoading, setFrogotPWDBtnLoading] = useState(false);
    const [dispalyEmail, setDispalyEmail] = useState(true);
    const [dispalyOTP, setDispalyOTP] = useState(false);
    const [dispalyPwd, setDispalyPwd] = useState(false);
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const inputRefs = useRef([]);

    const [formData, setFormData] = useState({
        Name: "",
        NewPassword: "",
        ConfirmPassword: "",
    });

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, otp.length);
    }, [otp]);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(false);
        setErrorMessage(null);

        try {
            setLoading(true);

            const url = `${VMS_URL}SignIn?UserName=${encodeURIComponent(
                userName
            )}&Password=${encodeURIComponent(password)}`;
            // console.log(url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log(result, "rrrrr");
            setLoading(false);

            if (response.ok) {
                if (result.Status) {
                    setLoading(false);
                    sessionStorage.setItem(
                        "userData",
                        JSON.stringify(result["ResultData"][0])
                    );
                    navigate(result["ResultData"][0].MenuPath);
                } else {
                    setLoading(false);
                    setErrorMessage(result.error);
                    console.error("Error during sign-in", result.error);
                    setError(result.error);
                }
            } else {
                setLoading(false);
                setErrorMessage(result.error);
                console.error("Error during sign-in", result.error);
                setError(result.error);
            }
        } catch (err) {
            setErrorMessage("Something went wrong. Please try again later.");
            setLoading(false);
            setError("Something went wrong. Please try again later.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleFPWSubmit = async (e) => {
        e.preventDefault();
        if (formData.NewPassword !== formData.ConfirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setFrogotPWDBtnLoading(true);
        
        try {
            const response = await fetch(`${VMS_URL}ChangePassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: formData.Name,
                    Password: formData.NewPassword,
                }),
            });
            
            if (response.ok) {
                setFrogotPWDBtnLoading(false);
                alert("Password updated successfully!");
                setFormData({ Name: "", NewPassword: "", ConfirmPassword: "" });
                window.location.reload();
            } else {
                setFrogotPWDBtnLoading(false);
                alert("Failed to update password. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setFrogotPWDBtnLoading(false);
            alert("An error occurred. Please try again later.");
        }
    };

    const handleForgotEmail = async (e) => {
        e.preventDefault();
        setForgotEmailBtnLoading(true);

        try {
            console.log(forgotEmail);
            const response = await fetch(`${VMS_VISITORS}ForgotPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Email: forgotEmail,
                }),
            });

            const responseData = await response.json();

            console.log("Response Data:", responseData);

            if (response.ok) {
                if (responseData.Status) {
                    setForgotEmailBtnLoading(false);
                    setDispalyEmail(false);
                    setDispalyPwd(false);
                    setDispalyOTP(true);
                    alert(responseData.message || "OTP sent successfully!");
                }
            } else {
                setForgotEmailBtnLoading(false);
                alert(responseData.error || "Failed to send email. Please try again.");
            }
        } catch (error) {
            setForgotEmailBtnLoading(false);
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const handleChange = (value, index) => {
        if (/^\d$/.test(value)) { // Accept only digits (0-9)
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if available
            if (index < 3 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // Handle Backspace functionality
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            newOtp[index] = ""; // Clear current value
            setOtp(newOtp);

            // Move to the previous input if available
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    // Handle Submit
    const handleOTPSubmit = async (e) => {  // <-- Added `async` here
        e.preventDefault();
        const otpValue = otp.join(""); // Combine digits into one string
        console.log("Entered OTP:", otpValue);
        setForgotEmailBtnLoading(true);

        if (otpValue.length === 4) {
            try {
                console.log(forgotEmail);
                const payload = {
                    Email: forgotEmail,
                    OTP: otpValue
                };

                console.log("📦 JSON Payload:", payload); // ✅ Log the payload

                const response = await fetch(`${VMS_VISITORS}ConfirmOTP`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload), // Sending the payload
                });
                const responseData = await response.json();
                console.log("Response Data:", responseData);

                if (response.ok) {
                    setForgotEmailBtnLoading(false);
                    setForgotEmailBtnLoading(false);
                    setForgotEmailBtnLoading(false);
                    setFrogotPWDBtnLoading(false);
                    setDispalyEmail(false);
                    setDispalyOTP(false);
                    setDispalyPwd(true);
                    if (responseData.Status) {
                        alert(responseData.message || "OTP sent successfully!");
                    }
                } else {
                    setForgotEmailBtnLoading(false);
                    setForgotEmailBtnLoading(false);
                    alert(responseData.error || "Failed to send email. Please try again.");
                }
            } catch (error) {
                setForgotEmailBtnLoading(false);
                setForgotEmailBtnLoading(false);
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            }
        } else {
            alert("Please enter a valid 4-digit OTP.");
        }
    };

    const maskEmail = (email) => {
        if (!email) return "";

        const [user, domain] = email.split("@"); // Split email at '@'
        const maskedUser = user[0] + "*".repeat(user.length - 1); // Mask all characters except the first
        return `${maskedUser}@${domain}`;
    };

    return (
        <>
            <style>
                {`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
        
                .video-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: -1;
                }
        
                .video-container video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
        
                .form-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.5);
                    padding: 30px;
                    border-radius: 10px;
                    text-align: center;
                    color: white;
                    width: 330px;
                    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
                }
        
                .form-container h2 {
                    margin-bottom: 20px;
                }
        
                .form-container input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: none;
                    border-radius: 5px;
                }
        
                .form-container button {
                    width: 100%;
                    padding: 10px;
                    background: #ff5722;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                }
        
                .form-container button:hover {
                    background: #e64a19;
                }
            `}
            </style>

            <div className="video-container">
                <video autoPlay muted loop playsInline>
                    <source src={myVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="form-container">
                <img src={LogoImg} style={{ width: "12rem" }} className="rounded"  />
                <h2 className="text-white mt-3">Sign In</h2>
                <form  onSubmit={handleSubmit} className="mb-3">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={userName}
                        onChange={(e) => {
                            setUserName(e.target.value);
                            setErrorMessage("");
                        }}
                        disabled={loading}
                        required
                    />
                    <div className="fv-row mb-3 position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            name="password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMessage("");
                            }}
                            required
                            disabled={loading}
                        />
                        <span
                            onClick={loading ? null : togglePasswordVisibility}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            <i className={`fa-regular text-dark fa-eye${showPassword ? "" : "-slash"}`}></i>
                        </span>
                    </div>

                    {errorMessage && (
                        <p className="alert alert-danger">{errorMessage}</p>
                    )}
                    <button type="submit">{loading ? "Please wait..." : "Login"}</button>
                </form>
                <a
                    className="link-primary"
                    data-bs-toggle="offcanvas"
                    href="#offcanvasForgotPassword"
                    role="button"
                    aria-controls="offcanvasForgotPassword"
                >
                    Forgot Password?
                </a>
            </div>

            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasForgotPassword"
                aria-labelledby="offcanvasForgotPasswordLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasForgotPasswordLabel">
                        Forgot Password
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <form onSubmit={handleFPWSubmit} className={`${dispalyPwd ? 'd-block' : 'd-none'}`}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="Name"
                                value={formData.Name}
                                className="form-control"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                New Password
                            </label>
                            <div className="input-group">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="NewPassword"
                                    value={formData.NewPassword}
                                    className="form-control"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-group-text">
                                    <i
                                        className={`fa ${showNewPassword ? "fa-eye" : "fa-eye-slash"
                                            }`}
                                        style={{ cursor: "pointer" }}
                                        onClick={toggleShowNewPassword}
                                    ></i>
                                </span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="ConfirmPassword"
                                    value={formData.ConfirmPassword}
                                    className="form-control"
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    required
                                />
                                <span className="input-group-text">
                                    <i
                                        className={`fa ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                                            }`}
                                        style={{ cursor: "pointer" }}
                                        onClick={toggleShowConfirmPassword}
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={forgotEmailBtnLoading}>
                            {forgotEmailBtnLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>

                    <form onSubmit={handleForgotEmail} className={`${dispalyEmail ? 'd-block' : 'd-none'}`}>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={forgotEmail}
                                className="form-control"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                            />
                        </div>
                       
                        <button type="submit" className="btn btn-primary w-100" disabled={forgotEmailBtnLoading}>
                            {forgotEmailBtnLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>

                    <form onSubmit={handleOTPSubmit} className={`${dispalyOTP ? 'd-block' : 'd-none'}`}>
                        <p>
                            An OTP has been sent to your registered email address:  
                            <strong className="text-primary"> {maskEmail(forgotEmail)} </strong>
                        </p>
                        <p className="text-muted">
                            Please enter the 4-digit OTP below to continue. The OTP is valid for the next **5 minutes**.
                        </p>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">OTP</label>
                            <div className="mb-3 d-flex gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="form-control text-center"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            fontSize: "20px",
                                            textAlign: "center",
                                            border: "2px solid #007bff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                       
                        <button type="submit" className="btn btn-primary w-100" disabled={forgotEmailBtnLoading}>
                            {forgotEmailBtnLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}