import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/UserAuthContext";
import randomImage from "../../assets/img/redKing.png";
import "../../css/profile.css";
import { ToastContainer, toast } from "react-toastify";
import ReactCountryFlag from "react-country-flag";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { useStyle } from "../../context/StyleContext";
import backgroundImage from "../../assets/img/background.png";

interface ProfileData {
  username: string;
  fullName: string;
  email: string;
  country: string;
  aboutMe?: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    fullName: "",
    email: "",
    country: "",
  });
  const [aboutMe, setAboutMe] = useState("");
  const { currentUser } = useAuth();
  const db = getFirestore();

  const { changeBodyBackground } = useStyle();

  useEffect(() => {
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  const handleAboutMeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAboutMe(event.target.value);
  };

  const handleSaveAboutMe = async () => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, { aboutMe }, { merge: true });
        toast.success("Profile updated successfully!");
      } catch (error) {
        const e = error as Error;
        toast.error(`Failed to update profile: ${e.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data() as ProfileData;
          setProfileData(userData);
          setAboutMe(userData.aboutMe || "");
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
    <>
      <ToastContainer />
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
              <h5>Rating (N/EJ)</h5>
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
            <textarea
              id="aboutme"
              name="aboutme"
              placeholder="Tell us about yourself..."
              value={aboutMe}
              onChange={handleAboutMeChange}
            />
            <button onClick={handleSaveAboutMe}>Save</button>
          </div>
        </div>
        <div className="footer-section">Made by Daniyal Ashraf Khan</div>
      </div>
    </>
  );
};

export default Profile;
