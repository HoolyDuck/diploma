import { Outlet } from "react-router";
import { useGetMeQuery } from "./lib/api/api";
import { Toaster } from "./components/ui/sonner";

function App() {
  const { isLoading } = useGetMeQuery(undefined);

  return (
    <>
      <div className="flex flex-col h-screen gap-4">
        <div>{isLoading ? <div>Loading...</div> : <Outlet />}</div>
      </div>
      <Toaster />
    </>
  );
}

export default App;

