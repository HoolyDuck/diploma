import { LoginForm } from "@/components/login-form";
import { useAppDispatch } from "@/hooks/store";
import { useLoginMutation } from "@/lib/api/api";
import { setCredentials } from "@/lib/slices/auth.slice";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
        })
      );
      navigate("/home");
    } catch {
      toast.error(
        "Не вдалося увійти. Перевірте свої облікові дані."
      );
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
