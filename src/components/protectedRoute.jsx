import React from "react";
import './popup.css'; // Import the CSS file

export const ProtectedRoute = ({ children, user }) => {
  const handleProtectedRouteClick = () => {
    if (!user) {
      alert("Please log in to access this page.");
    }
  };
  const handleNavigation = (url) => {
    window.location.href = url;
  };
  

  return user ? (
    children
  ) : (
    <section>
            <form className="loginPage2">
                <fieldset className="fieldset2">
                     <p className="input2" >Please login to an account to be able to play</p>
                     <button type="button" className="loginPageButton2" onClick={() => handleNavigation('/login')}>Log In</button>
                </fieldset>
            </form>
        </section>
  );
};
