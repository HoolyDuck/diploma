import { useTypedSelector } from "@/hooks/store";
import { selectUser } from "@/lib/slices/auth.slice";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";

type Props = {
  onFormSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({ onFormSubmit }) => {
  const user = useTypedSelector(selectUser);

  return (
    <header className="flex items-center justify-between p-4  border-b ">
      <div className="flex items-center">
        <Link to="/home" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10"
          />
        </Link>
        <form
          onSubmit={onFormSubmit}
          className="flex items-center"
        >
          <Input
            placeholder="Шукати..."
            className="w-64 ml-4"
            name="search"
          />
          <button
            type="submit"
            className="hidden"
          >
            Search
          </button>
        </form>
      </div>
      {user ? (
        <div className="flex items-center text-black mr-4">
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
              alt="User Avatar"
            />
          </Avatar>
        </div>
      ) : (
        <Link to="/login">
          <Button
            className="ml-auto"
            asChild
          >
            <span>Login</span>
          </Button>
        </Link>
      )}
    </header>
  );
};
