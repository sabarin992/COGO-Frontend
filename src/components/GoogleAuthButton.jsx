import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthButton = ({ onSuccess }) =>{
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default GoogleAuthButton