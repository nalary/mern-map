import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Register({ setShowLogin, myStorage, setCurrentUser }) {
    const [failure, setFailure] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };

        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("pinUser", res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setFailure(false);
        } catch (err) {
            console.log(err);
            setFailure(true);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                HO : Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" ref={usernameRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className="loginButton">Login</button>
                {failure && <span className="failure">Something went wrong !</span>}                
            </form>
            <Cancel className="loginCancel" onClick={() => setShowLogin(false)}/>
        </div>
    )
}
