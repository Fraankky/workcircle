import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";

export function useAuthRedirect(to = "/discover") {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate({ to });
  }, [isAuthenticated, isLoading, navigate, to]);
}
