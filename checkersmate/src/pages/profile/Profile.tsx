import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/UserAuthContext";
import randomImage from "../../assets/react.svg";
import "../../css/profile.css";
import { toast } from "react-toastify";
import ReactCountryFlag from "react-country-flag";

interface ProfileData {
  username: string;
  fullName: string;
  email: string;
  country: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    fullName: "",
    email: "",
    country: "",
  });
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data() as ProfileData);
        } else {
          toast.error(
            "No profile related data found! Contact support to fix the issue."
          );
        }
      }
    };
    fetchProfileData();
  }, [currentUser, db]);

  return (
    <div className="profile">
      <div className="profile-header">
        <img src={randomImage} alt="" />
        <h5>{profileData.username}</h5>
        {profileData.country && (
          <ReactCountryFlag
            countryCode={profileData.country}
            svg
            style={{
              width: "2em",
              height: "2em",
            }}
            title={profileData.country}
          />
        )}
      </div>
      <div className="profile-body">
        <div className="data">
          <div className="fields">
            <h5>Username</h5>
            <h5>Full Name</h5>
            <h5>Email Address</h5>
            <h5>Country</h5>
            <h5>Record (W/L/D)</h5>
            <h5>Rating</h5>
          </div>
          <div className="info">
            <h5>{profileData.username}</h5>
            <h5>{profileData.fullName}</h5>
            <h5>{profileData.email}</h5>
            <h5>{profileData.country}</h5>
            <h5>Coming Soon</h5>
            <h5>Coming Soon</h5>
          </div>
        </div>
        <div className="about">
          <h5>About me</h5>
          <input id="aboutme" type="aboutme" placeholder="" name="aboutme" />
          <button>Save</button>
        </div>
      </div>
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </div>
  );
};

export default Profile;
