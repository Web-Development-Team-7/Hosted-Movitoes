import React from 'react';
import './styles/login.css'
import {useState} from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, EmailAuthCredential  } from 'firebase/auth';
import { auth, provider} from '../Firebase'
import {Link, useNavigate} from 'react-router-dom';

export default function Login(){
    //UseState hooks of user input fields.
    var [email, setEmail] = useState('');
    var [password, setPass] = useState('');
    const nav = useNavigate();
    
    /**
    * On click, opens a pop up where users can sign in with their google account
    * @constructor
    * @param {signInWithPopUp(auth, provider)} - Validates the user signing in, and saves their information such as
    * user name, account photo, and id to local storage.
     */
    const GoogleSignIn = () =>{
        event?.preventDefault();
        //Open a pop up tab that allows users to sign in with user accounts
        signInWithPopup(auth, provider).then((res) =>{
            //Use the google account displayName as the account name.
            const user = res.user.displayName;
            const profile = res.user.photoURL;
            const uid = res.user.uid;
            //If statement exists because typescript is unsure if user is null or not
            if(user && profile){
                //If the user does exist, set the users name in the storage to verify a user is logged in.
                localStorage.setItem("user", user);
                localStorage.setItem("photo", profile);
                localStorage.setItem("uid", uid);
                //Navigate to home page.
                nav('/home');
            }     
        }).catch((error) =>{
            alert(error.message);
        })
    }

    /**
    * Signs in a user by validating their email and password
    * @constructor
    * @param {email, password} - Data that is binded to the input of the user email and password
     * @param {signInWithEmailAndPassword(auth, email, password)} - 
     * Validates that the user email exists, and the password matches in firebase. If the prior all returns true,
     * authorizes the user to enter the database by rerouting them to the homepage.
     */
    const UserSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        //Check if user input fields correctly.
        if(email === '' || password === ''){
            return alert("Must Fill In All Fields");
        }
        //If successful, set the user as the email name. Will add option in future to update display name.
        //Otherwise, same function as above.
        signInWithEmailAndPassword(auth, email, password).then((userCredentials) =>{
            var user = auth.currentUser;
            var photo = user?.photoURL;
            const uid = user?.uid;
            if(user && user.displayName && uid){
                localStorage.setItem("user", user.displayName);
                localStorage.setItem('uid', uid);
            }
            if(photo){
            localStorage.setItem("photo", photo);
            }
            else{
                localStorage.setItem("user", email);
            }
            nav('/home');
        }).catch((error) => {
            alert(error.message)
        })
    }

    //Returns the login form componenet
    return(
        <React.Fragment>
           <div className='flex justify-center w-full' id = "LogFlex">
            <form className='bg-white flex relative rounded-md border-solid border-2 w-1/3 border-black h-4/5' id="LogForm">
                <h1 className="text-3xl font-bold mt-10">Welcome</h1>
                <p className="text-2xl font-medium mt-10">Log In</p>
                <input id="Loginput" type = "email"  className= 'bg-slate-200 mt-10 h-10 w-64 rounded-lg text-center' name="Email"  onChange={(e) => setEmail(e.target.value)} placeholder = "Enter Email" />
                <input id="Loginput" type = "password" name ="Password" className='bg-slate-200 mt-5 h-10 w-64 rounded-lg text-center'  onChange = {(e) => setPass(e.target.value)} placeholder = "Enter Password"/>
                <button id="LogButton" onClick={UserSignIn} className='mt-10 bg-blue-500 h-10 w-64 text-center rounded-lg border-solid border-black border text-black text-lg font-500 ' >Log In</button>
                <button id="GoogleLog" onClick={GoogleSignIn} className = "bg-white rounded-md text-center mt-96 h-10 w-48 font-500 absolute z-10 border-black border border-solid">
                    <img src = 'http://44.211.151.177/Assets/Google.png' className='h-15 w-8 top-1 absolute' alt='Google Logo'></img>Log In With Google</button>
                <h3 className='mt-20'>Don't Have An Account?
                <Link to='/Signup' id="LinkSign" className='text-blue-600'>Sign Up!</Link></h3>
            </form>
        </div>
        </React.Fragment>
    )
}