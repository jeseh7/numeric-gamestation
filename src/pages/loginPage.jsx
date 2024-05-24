import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { supabase } from "../supabase"; // Import your Supabase instance
import './loginCSS.css';

export const Login = ({ user }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(true);

    const handleMethodChange = () => {
        setIsSignUpActive(!isSignUpActive);
    }

    const handleSignUp = async () => {
        if (!email || !password || !username) return;

        try {
            const { user: firebaseUser, error } = await createUserWithEmailAndPassword(auth, email, password);

            if (error) {
                throw error;
            }

            // Store username in Supabase
            const { data, error: profileError } = await supabase
                .from('user_profiles')
                .insert([{ email, username, firebase_uid: firebaseUser.uid }]);
            
            if (profileError) {
                throw profileError;
            }

            console.log("User signed up successfully:", firebaseUser);
            navigate('/game');
        } catch (error) {
            console.error("Error signing up:", error.message);
        }
    }

    const handleSignIn = async () => {
        if (!email || !password) return;

        try {
            const { user: firebaseUser, error } = await signInWithEmailAndPassword(auth, email, password);

            if (error) {
                throw error;
            }

            console.log("User signed in successfully:", firebaseUser);
            navigate('/game');
        } catch (error) {
            console.error("Error signing in:", error.message);
        }
    }

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleUsernameChange = (event) => setUsername(event.target.value);

    if (user) {
        return null;
    }

    return (
        <section>
            <form className="loginPage">
                <fieldset className="fieldset">
                    {!isSignUpActive && <input className="input" type="text" id="username" placeholder="Username" onChange={handleUsernameChange} />}
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
