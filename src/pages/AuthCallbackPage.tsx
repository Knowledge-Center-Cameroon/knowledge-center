import { Navigate } from "react-router-dom";

const AuthCallbackPage: React.FC = () => {
  return <Navigate to="/gsp/dashboard" replace />;
};

export default AuthCallbackPage;
