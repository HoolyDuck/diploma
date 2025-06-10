import { useTypedSelector } from "@/hooks/store";
import { selectUser } from "@/lib/slices/auth.slice";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const user = useTypedSelector(selectUser);

  console.log("ProtectedRoute user", user);

  if (user === null) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
};
