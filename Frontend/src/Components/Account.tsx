import React, { useState,useEffect } from 'react';
import Navbar from './navbar';
import { getAuth, signOut, updateProfile, updatePassword, deleteUser } from "firebase/auth"
import {useNavigate} from 'react-router-dom'
import './styles/Account.css'

export default function AccountPage(){
    const auth = getAuth();
    const nav = useNavigate();
    //The photo URL that will be displayed to the user
    var [photoURL, setPhotoURL] = useState('');
    //Will be used to update the photo displayed
    var [updatePhoto, setUpdatePhoto] = useState('');
    //Display the username in frontend
    var [uname, setUname] = useState('');
    //Toggle the screen overlay to change photo
    var [toggleChoose, setChangeImage] = useState(false);

    //On page load, set the username and photo attributes
    useEffect(() => {
        //Use temporary values, and use if statements incase values are null.
        var temp = localStorage.getItem('user');
        var temp2 = localStorage.getItem('photo');
        if(temp && temp2){
            setUname(temp);
            setPhotoURL(temp2);
        }
      }, []);

    //useState hook to take input of user profile changes
    var [ChangeUser, setChangeUser] = useState('');
    var [ChangePass, setChangePass] = useState('');
    
    /**
    * Logs Out the user
    * @constructor
    * @param {auth} - The authentication credentials of the current user.
    * This function logs out the user by removing their authentication, and removing all of their user information such
    * as their display name and account photo from the local storage. It then reroutes them back into the log in page.
    */
    function LogOut(){
      const user = auth.currentUser;
      if(!user){
        alert('Please Log In');
        nav('/');
        return;
      }
        signOut(auth).then(() => {
            //Clears local storage of user information such as name and pfp.
            localStorage.clear();
            nav('/');
         }).catch((error) => {
            alert(error.message);
        });
    }

    /**
    * Updates the users display name
    * @constructor
    * @param {ChangeUser, user} -Change user is the username that the user wishes to change to. User is the current user
    * that is logged in with firebase.
    * @param {updateProfile(user, displayName} - 
    * This function allows a user to change their display name by first checking if they entered a valid input,
    * if valid, it then routes their data through a firebase function. If a success occurs, the user display name is 
    * successfully updated in the database and their username reference is updated in the frontend to reflect the change.
    * If a failure occurs due to the user being no longer validated, it returns the user to the login page where they 
    * have to reauthenticate.
    */
    function UpdateUser(event: React.MouseEvent<HTMLButtonElement>){
        event?.preventDefault();
        //If the username hook has not been changed, return an error
        if(ChangeUser === ''){
            return alert("Please Fill In Valid Value!");
        }
        const user = auth.currentUser;
        if(!user){
          alert('Please Log In');
          nav('/');
          return;
        }
        //Checks if the user is not null to prevent errors
        if(user!== null){
        //Updates username, and updates the display variable in frontend
        updateProfile(user, {
            displayName: ChangeUser
          }).then(() => {
            alert("Update Successful!");
            localStorage.setItem('user', ChangeUser);
            setUname(ChangeUser);
          }).catch((error) => {
            //When an error occurs, it usually due to a period of inactivity
            //Redirect user to login page to sign in again
            alert(error.message);
            LogOut();
          });
        }
    }

    /**
    * Changes the display photo of a user's account.
    * @constructor
    * @param {updatePhoto} - The Url of the photo the user wishes to be their account photo.
    * This function takes in an input of a URL to a photo, validates that the user inputted a url, and then
    * updates the user's photo in the firebase database. If an error occurs, it reroutes the user to the login page 
    * to reauthenticate as users have to be authenticated to update account details.
    */
    function UpdateImage(){
        event?.preventDefault();

        //If no url has been inputted, return error
        if(!updatePhoto){
            return alert("Please Input Valid File");
        }
        const user = auth.currentUser;
        if(!user){
          alert('Please Log In');
          nav('/');
          return;
        }
        
        //If the user is not null to satisfy typescript checking
        if(user!== null){
            //Updates the user profile picture
        updateProfile(user, {
            photoURL: updatePhoto
          }).then(() => {
            //Set a temporary variable to the photourl, check if variable is not null
            //If variable is not null, update display on frontend
            alert("Update Successful!");
            var x = user.photoURL;
            if(x){
                setPhotoURL(updatePhoto);
                localStorage.setItem('photo', x);
            }
          }).catch((error) => {
            //When an error occurs, it usually due to a period of inactivity
            //Redirect user to login page to sign in again
            alert(error.message);
            LogOut();
          });
        }
    }

    //Changes the variable that conditionally renders the form to update account photo
    function ChooseImage(){
        event?.preventDefault();
        setChangeImage(prevCheck => !prevCheck);
    }

   /**
    * Deletes the user account from the database
    * @constructor
    * @param {auth.currentUser} - The authentication credentials of the current user.
    * This function removes the user account from the database through a firebase function, if successful the user 
    * account has been deleted and the user is rerouted back to the login page. If an error occurs, the user is rerouted
    * back to the login page to reauthenticate.
    */
    function DeleteUser(event: React.MouseEvent<HTMLButtonElement>){
        event?.preventDefault();
        const user = auth.currentUser;
        if(!user){
          alert('Please Log In');
          nav('/');
          return;
        }
        if(user){
            deleteUser(user).then(() => {
                //If successful, redirect user to login page
                nav('/');
              }).catch((error) => {
                //If not successful, show user error and log them out to reauthenticate
                alert(error.message);
                LogOut();
              });
        }
    }

    /**
    * Updates the password of the user to access this database.
    * @constructor
    * @param {ChangePass} - The password that the user wants to change to.
    * This function validates that the user is currently authenticated, if not, it throws an error and forces the user to 
    * reauthenticate by rerouting to the login page. If the user is authenticated, it updates the password to access this
    * web application in the firebase database. Does not change the passwords for google accounts, just for this site.
    */
    function UpdatePassword(event: React.MouseEvent<HTMLButtonElement>){
        event?.preventDefault();
        //If user has not inputted any password, return error.
        if(ChangePass === ''){
            return alert("Please Fill In Valid Value!");
        }
        const user = auth.currentUser;
        if(!user){
          alert('Please Log In');
          nav('/');
          return;
        }
        
        if(user!== null){
            updatePassword(user, ChangePass).then(() => {
                alert("Success");
              }).catch((error) => {
                //If not successful, show user error and log them out to reauthenticate
                alert(error.message)
                LogOut();
              });
            }
    }

    return(
        <div>
        <Navbar/>
        <div className = 'h-screen justify-center flex'>
            <img onClick={ChooseImage} id="Accountpfp" alt="User Profile Picture" src={photoURL || 'http://44.211.151.177/Assets/pfp.png'} className='h-48 mt-10 w-48 absolute rounded-full'/>
            {toggleChoose &&
            <div className=' mt-28 h-1/2 w-1/2 bg-slate-200 flex justify-center z-10 absolute'>
                <h1 id="ImageExit" onClick={ChooseImage} className="text-2xl font-bold text-black ml-auto mr-2 aboslute">X</h1>
                <input type="text" className='mt-48 ml-1 absolute w-1/2 h-10 bg-white rounded-lg text-center' placeholder="Input Image Link"
                onChange={(e) => setUpdatePhoto(e.target.value)}></input>
                <button id='PassChange' onClick={UpdateImage} className = "mt-72 mr-10 bg-white h-10 ml-10 w-2/12 absolute text-center rounded-lg border-solid border-blue-500 border text-black text-sm font-600" 
                >Update</button>
            </div>
            }
            <h1 className='text-3xl font-bold text-center absolute text-black mt-60'>{uname}</h1>
            <form className='justify-center flex content-center mt-56 flex-col h-96'>
                <input id="Loginput" type = "text" className= 'bg-slate-200 mt-20  h-10 w-64 rounded-lg text-center' name="text"   placeholder = "Change Username" 
                onChange={(e) => setChangeUser(e.target.value)}/>
                <button id="UserChange" className = "mt-5 bg-blue-500 h-10 ml-10 w-2/3 text-center rounded-lg border-solid border-black border text-white text-sm font-600" 
                onClick={UpdateUser}>Update User</button>
                <input id="Loginput" type = "password"  className= 'bg-slate-200 mt-5 h-10 w-64 rounded-lg text-center' name="text"   placeholder = "Change Password" 
                onChange={(e) => setChangePass(e.target.value)}/>
                <button id='PassChange' onClick={UpdatePassword} className = "mt-5 bg-white h-10 ml-10 w-2/3 text-center rounded-lg border-solid border-blue-500 border text-black text-sm font-600" 
                >Update Password</button>
                <button id="DelAccount" className = "mt-10 bg-red-500 h-10 w-2/3 ml-10 text-center rounded-lg border-solid border-black border text-black text-lg font-400" 
                onClick={DeleteUser}>Delete Account</button>
            </form>
        </div>
        </div>
    )
}