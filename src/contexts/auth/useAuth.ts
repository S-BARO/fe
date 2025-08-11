import { useContext } from "react";
import { AuthContext } from "./context";

// AuthContext 사용을 위한 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
