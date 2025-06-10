import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

type LoginFormProps = {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export function LoginForm({
  className,
  handleSubmit = (e) => e.preventDefault(),
  isLoading = false,
  ...props
}: React.ComponentProps<"div"> & LoginFormProps) {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Увійти</CardTitle>
          <CardDescription>
            Введіть свої облікові дані, щоб увійти до системи.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Електронна пошта</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  name="password"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 />
                      Входимо в систему...
                    </>
                  ) : (
                    "Увійти"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Не маєте облікового запису?{" "}
              <Link
                to="/register"
                className="underline underline-offset-4"
              >
                Зареєструватися
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
