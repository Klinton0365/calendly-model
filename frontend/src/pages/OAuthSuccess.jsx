import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthToken } from "../api";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      setAuthToken(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Signing you in...</p>;
}
