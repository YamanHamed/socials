import { useEffect, useRef, useState } from "react";
import "../login.css";
import "../index.css";
import landingImg from "../imgs/login-img.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Button from "../components/Button";

const LogIn = () => {
  // == GENERAL ==
  const { loginUser, registerUser, isAuthLoading, clearAuthError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // == MAIN STATES ==
  const [logType, setLogType] = useState("login");
  const [signinInfo, setSigninInfo] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    image: null, // For profile image upload during signup
  });
  // == SETTING LOG TYPE ==
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const logTypeParam = params.get("logType");

    if (logTypeParam === "login") {
      setLogType("login");
    } else if (logTypeParam === "signup") {
      setLogType("signup");
    }
    // Clean logging info when changing log type
    clearAuthError();
  }, [location, clearAuthError]);

  // == HANDLERS ==
  // async function handleLogin() {
  //   if (!signinInfo.username || !signinInfo.password) return;

  //   const response = await loginUser(signinInfo.username, signinInfo.password);
  //   if (response.success) {
  //     showToast("Welcome back! Loading your timeline...", "success");
  //     navigate("/");
  //   } else {
  //     showToast(response.error || "Invalid username or password.", "danger");
  //   }
  // }
  // async function handleSignup() {
  //   if (
  //     !signinInfo.username ||
  //     !signinInfo.password ||
  //     !signinInfo.name ||
  //     !signinInfo.email
  //   )
  //     return;

  //   const response = await registerUser(
  //     signinInfo.username,
  //     signinInfo.password,
  //     signinInfo.name,
  //     signinInfo.email,
  //     signinInfo.image,
  //   );

  //   if (response.success) {
  //     showToast("Registration successful! Welcome to the platform.", "success");
  //     navigate("/");
  //   } else {
  //     showToast(response.error || "Account creation rejected.", "danger");
  //   }
  // }
  async function handleLogin() {
    // 🔍 Check for missing fields
    if (!signinInfo.username || !signinInfo.password) {
      showToast("Please enter both your username and password.", "danger");
      return;
    }

    const response = await loginUser(signinInfo.username, signinInfo.password);
    if (response.success) {
      showToast("Welcome back! Loading your timeline...", "success");
      navigate("/");
    } else {
      showToast(response.error || "Invalid username or password.", "danger");
    }
  }

  async function handleSignup() {
    // 🔍 Check for any missing required fields
    if (
      !signinInfo.name ||
      !signinInfo.username ||
      !signinInfo.email ||
      !signinInfo.password
    ) {
      showToast(
        "All fields are required. Please fill out the form completely.",
        "danger",
      );
      return;
    }

    // 📧 Basic Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signinInfo.email)) {
      showToast("Please enter a valid email address.", "danger");
      return;
    }

    // 🔒 Optional: Minimum password length check (highly recommended for UX)
    if (signinInfo.password.length < 6) {
      showToast("Password must be at least 6 characters long.", "danger");
      return;
    }

    const response = await registerUser(
      signinInfo.username,
      signinInfo.password,
      signinInfo.name,
      signinInfo.email,
      signinInfo.image,
    );

    if (response.success) {
      showToast("Registration successful! Welcome to the platform.", "success");
      navigate("/");
    } else {
      showToast(response.error || "Account creation rejected.", "danger");
    }
  }

  // == Image ==
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSigninInfo({ ...signinInfo, image: file });

      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSigninInfo({ ...signinInfo, image: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="wrapper">
      <div className="main-container rounded-3">
        <div className="login-sec">
          {logType === "login" && <h2>Log in </h2>}
          {logType === "signup" && <h2>Sign Up </h2>}
          {logType === "login" && <h3> Welcome Back </h3>}

          <div className="form-container ">
            {logType === "login" ? (
              <Link
                disabled={isAuthLoading}
                className={`sign-in-link ${isAuthLoading ? "disabled-link" : ""}`}
                to="/login?logType=signup"
              >
                click, if you are new here
              </Link>
            ) : (
              <Link
                disabled={isAuthLoading}
                className={`sign-in-link ${isAuthLoading ? "disabled-link" : ""}`}
                to="/login?logType=login"
              >
                click, if you already have an account
              </Link>
            )}

            {/* Dynamic Name Input Target for Sign Up Layout[cite: 2] */}
            {logType === "signup" && (
              <>
                <label>name</label>
                <input
                  type="text"
                  className="name  rounded-2"
                  value={signinInfo.name}
                  onChange={(e) =>
                    setSigninInfo({ ...signinInfo, name: e.target.value })
                  }
                  disabled={isAuthLoading}
                  required
                />
              </>
            )}

            <label>username</label>
            <input
              type="text"
              className="username  rounded-2"
              value={signinInfo.username}
              onChange={(e) =>
                setSigninInfo({ ...signinInfo, username: e.target.value })
              }
              disabled={isAuthLoading}
              required
            />

            {/* Dynamic Email Input Target for Sign Up Layout[cite: 2] */}
            {logType === "signup" && (
              <>
                <label>email</label>
                <input
                  type="email"
                  className="name  rounded-2"
                  value={signinInfo.email}
                  onChange={(e) =>
                    setSigninInfo({ ...signinInfo, email: e.target.value })
                  }
                  disabled={isAuthLoading}
                  required
                />
              </>
            )}

            <label>password</label>
            <input
              type="password"
              className="password  rounded-2"
              value={signinInfo.password}
              onChange={(e) =>
                setSigninInfo({ ...signinInfo, password: e.target.value })
              }
              disabled={isAuthLoading}
              required
            />

            {logType === "signup" && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="d-none"
                />
                {imagePreview && (
                  <div className="position-relative mb-4 rounded-3 overflow-hidden border bg-light d-flex justify-content-center align-items-center modal-preview-box">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-100 object-fit-cover"
                      style={{ maxHeight: "220px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-dark btn-sm rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center"
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: "#0f172a",
                      }}
                      onClick={handleRemoveImage}
                      disabled={isAuthLoading}
                    >
                      <i className="bi bi-x-lg small text-white"></i>
                    </button>
                  </div>
                )}

                <Button
                  variant="notFilled"
                  onClick={() => fileInputRef.current.click()}
                  type="button"
                  style={{ border: "1px solid #c1bbbb" }}
                  className="mb-3"
                  disabled={isAuthLoading}
                >
                  <i className="bi bi-camera"></i>
                  <small className="ms-2 fw-semibold text-secondary">
                    {imagePreview ? "Change Photo" : "Add Photo"}
                  </small>
                </Button>
              </>
            )}

            {/* Action buttons equipped with asynchronous loading spinner layout protections */}
            {logType === "login" ? (
              <button
                className=" rounded-3 btn-gradient d-flex justify-content-center align-items-center"
                onClick={handleLogin}
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            ) : (
              <button
                className=" rounded-3 btn-gradient d-flex justify-content-center align-items-center"
                onClick={handleSignup}
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            )}
          </div>
        </div>

        <div className="image-sec">
          <img src={landingImg} alt="Authentication presentation graphics" />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
