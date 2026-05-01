import { registerGsp } from "@/services/gspApi";
import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";

const AuthCallbackPage: React.FC = () => {
    const {isSignedIn, user, isLoaded} = useUser();
    console.log("Clerk auth state loaded:", { isLoaded, isSignedIn, user });

    if (isSignedIn) {
        // registerGsp()
        console.log("User info from Clerk:", user);
    }
    return <Navigate to="/gsp/dashboard" replace />
}

export default AuthCallbackPage;