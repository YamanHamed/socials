import { useContext, useEffect, useState } from "react";
import {} from "../login.css";
import landingImg from "../imgs/login-img.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logContext } from "../components/AuthContext";
import { logIn, register } from "../components/Auth";

const LogIn = () => {
  // eslint-disable-next-line
  const [loggedIn, setLoggedIn] = useContext(logContext);
  const [logType, setLogType] = useState("login");

  const [signinInfo, setSigninInfo] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [requestInfo, setRequestInfo] = useState({
    message: "", // ( error message, success)
    status: "", // ( initial, success, failure )
  });

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const logTypeParam = params.get("logType"); // login,signup

    if (logTypeParam === "login") {
      setLogType("login");
    } else if (logTypeParam === "signup") {
      setLogType("signup");
    }
  }, [location]);

  async function handleLogin() {
    const response = await logIn(signinInfo.username, signinInfo.password);
    if (response.success) {
      setRequestInfo({
        message: "success",
        status: "success",
      });
      setTimeout(() => {
        setLoggedIn(true);
        navigate(`/Home1`);
      }, 500);
    } else {
      //TODO ( handle errors )
      setRequestInfo({
        message: response.error,
        status: "failure",
      });
    }
  }
  async function handleSignup() {
    const response = await register(
      signinInfo.username,
      signinInfo.password,
      signinInfo.name,
      signinInfo.email,
    );
    if (response.success) {
      setRequestInfo({
        message: "success",
        status: "success",
      });
      setTimeout(() => {
        setLoggedIn(true);
        navigate(`/Home1`);
      }, 500);
    } else {
      //TODO ( handle errors )
      setRequestInfo({
        message: response.error,
        status: "failure",
      });
    }
  }

  return (
    <div className="wrapper ">
      <div className="main-container">
        <div className="login-sec">
          {logType === "login" && <h2>Log in </h2>}
          {logType === "signup" && <h2>Sign Up </h2>}

          {logType === "login" && <h3> Welcome Back </h3>}
          {/* todo add social icon */}

          <div className="form-container">
            {/* todo link with state and add icon*/}
            {logType === "login" && (
              <Link className=" sign-in-link" to="/login?logType=signup">
                {" "}
                click, if you are new here
              </Link>
            )}
            {logType === "signup" && (
              <Link className=" sign-in-link" to="/login?logType=login">
                {" "}
                click, if you already have an account{" "}
              </Link>
            )}

            {logType === "signup" && (
              <>
                <label>name</label>
                <input
                  onChange={(e) => {
                    setSigninInfo({ ...signinInfo, name: e.target.value });
                  }}
                  className="name"
                  required={true}
                />
              </>
            )}
            <label>username</label>
            <input
              onChange={(e) => {
                setSigninInfo({ ...signinInfo, username: e.target.value });
              }}
              className="username"
              required={true}
            />
            {logType === "signup" && (
              <>
                <label>email</label>
                <input
                  onChange={(e) => {
                    setSigninInfo({ ...signinInfo, email: e.target.value });
                  }}
                  type="email"
                  className="name"
                  required={true}
                />
              </>
            )}
            <label>password</label>
            <input
              onChange={(e) => {
                setSigninInfo({ ...signinInfo, password: e.target.value });
              }}
              type="password"
              className="password"
              required={true}
            />
            {requestInfo.status === "success" && (
              <SuccessAlert message={requestInfo.message} />
            )}
            {requestInfo.status === "failure" && (
              <FailureAlert message={requestInfo.message} />
            )}

            {logType === "login" && (
              <button className="mylogin-btn" onClick={handleLogin}>
                Login
              </button>
            )}

            {logType === "signup" && (
              <button className="mylogin-btn" onClick={handleSignup}>
                Sign Up
              </button>
            )}
          </div>
        </div>

        <div className="image-sec">
          <img src={landingImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default LogIn;

const SuccessAlert = ({ hidden, message = "success" }) => {
  return (
    !hidden && (
      <div className="alert alert-success" role="alert">
        {message}
      </div>
    )
  );
};

const FailureAlert = ({ hidden, message = "Fail" }) => {
  return (
    !hidden && (
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    )
  );
};
