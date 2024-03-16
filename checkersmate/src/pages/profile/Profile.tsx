import randomImage from "../../assets/react.svg";
import "../../css/profile.css";

const Profile = () => {
  return (
    <div className="profile">
      <div className="profile-header">
        <img src={randomImage} alt="" />
        <h5>username</h5>
        <h5>flag icon</h5>
      </div>
      <div className="profile-body">
        <div className="data">
          <div className="fields">
            <h5>Username</h5>
            <h5>Full Name</h5>
            <h5>Email Address</h5>
            <h5>Country</h5>
            <h5>Language</h5>
            <h5>Record (W/L/D)</h5>
            <h5>Rating</h5>
          </div>
          <div className="info">
            <h5>random</h5>
            <h5>random</h5>
            <h5>random</h5>
            <h5>random</h5>
            <h5>random</h5>
            <h5>random</h5>
            <h5>random</h5>
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
