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
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  rating: {
    normal: number;
    enforcedJumps: number;
  };
  aboutMe?: string;
}

/**
 * Displays and allows editing of the user's profile, including personal information and game statistics.
 * Users can view their username, full name, email address, country, game record (wins, losses, draws),
 * ratings (normal, enforced jumps), and a personal description ("About me").
 * The "About me" section can be edited and saved to the database.
 */
const Profile = () => {
  // State for storing and updating profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    fullName: "",
    email: "",
    country: "",
    record: {
      wins: 0,
      losses: 0,
      draws: 0,
    },
    rating: {
      normal: 0,
      enforcedJumps: 0,
    },
  });
  // State for the "About me" text area
  const [aboutMe, setAboutMe] = useState("");
  // Context hook for accessing the current user
  const { currentUser } = useAuth();
  const db = getFirestore();

  // Context hook for changing body background
  const { changeBodyBackground } = useStyle();

  /**
   * Sets the profile's background image on component mount and reverts it back on unmount.
   */
  useEffect(() => {
    changeBodyBackground(backgroundImage);
    return () => changeBodyBackground("wheat");
  }, [changeBodyBackground]);

  /**
   * Handles changes to the "About me" text area, updating the local state.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event from the text area.
   */
  const handleAboutMeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAboutMe(event.target.value);
  };

  /**
   * Saves the "About me" text to the user's profile in the database.
   * Displays a success message on successful update or an error message on failure.
   *
   * @async
   */
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

  /**
   * Fetches the user's profile data from Firestore on component mount
   * and updates the profile state accordingly.
   */
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
              <h5>{`${profileData.record.wins}-${profileData.record.losses}-${profileData.record.draws}`}</h5>
              <h5>{`${profileData.rating.normal}/${profileData.rating.enforcedJumps}`}</h5>
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
      </div>
    </>
  );
};

export default Profile;
