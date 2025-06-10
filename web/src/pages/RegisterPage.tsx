import { RegisterForm } from "@/components/register-form";
import { useAppDispatch } from "@/hooks/store";
import { useRegisterMutation } from "@/lib/api/api";
import { setCredentials } from "@/lib/slices/auth.slice";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await register({ email, username, password }).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
        })
      );
      navigate("/home");
    } catch {
      toast.error(
        "Registration failed. Please check your details and try again."
      );
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
