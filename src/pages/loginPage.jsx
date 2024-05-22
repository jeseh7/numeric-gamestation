import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Corrected import statement
import './loginCSS.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export const Login = ({ user }) => {
    const navigate = useNavigate(); // Initialize navigate
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(true);
    const handleMethodChange = () => {
        setIsSignUpActive(!isSignUpActive);
    }

    const handleSignUp = () => {
        if (!email || !password) return;
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            navigate('/game'); // Redirect to /game after sign up
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    const handleSignIn = () => {
        if (!email || !password) return;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            navigate('/game'); // Redirect to /game after sign in
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    if (user) {
        return null; // No need to render anything here
    }

    return (
        <section>
            <form className="loginPage">
                <fieldset className="fieldset">
                    <input className="input" type="text" id="email" placeholder="Email" onChange={handleEmailChange} />
                    <input className="input" type="password" id="password" placeholder="Password" onChange={handlePasswordChange} />
                    {!isSignUpActive && <button type="button" className="loginPageButton" onClick={handleSignUp}>Sign Up</button>}
                    {isSignUpActive && <button type="button" className="loginPageButton" onClick={handleSignIn}>Login</button>}
                    {!isSignUpActive && <a className="switchButton" onClick={handleMethodChange}>Login</a>}
                    {isSignUpActive && <a className="switchButton" onClick={handleMethodChange}>Create An Account</a>}
                </fieldset>
            </form>
        </section>
    );
};
