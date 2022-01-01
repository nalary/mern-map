import { Cancel, Room } from "@material-ui/icons";
import { useRef, useState } from "react";
import { axiosInstance } from "../config";
import "./register.css";

export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        try {
            await axiosInstance.post("/users/register", newUser);
            setSuccess(true);
            setFailure(false);
        } catch (err) {
            console.log(err);
            setFailure(true);
        }
    };

    return (
        <div className="registerContainer">
            <div className="logo">
                <Room />
                HO : Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" ref={usernameRef}/>
                <input type="text" placeholder="Email" ref={emailRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className="registerButton">Register</button>
                {success && <span className="success">Registration successful !</span>}
                {failure && <span className="failure">Something went wrong !</span>}                
            </form>
            <Cancel className="registerCancel" onClick={() => setShowRegister(false)}/>
        </div>
    )
}
