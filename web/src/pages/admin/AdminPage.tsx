import { Link, Outlet } from "react-router";

const links = [
  {
    label: "Версії",
    to: "/admin/versions",
  },
  {
    label: "Застосунки",
    to: "/admin/apps",
  },
  {
    label: "Скарги",
    to: "/admin/reports",
  },
];

export const AdminPage = () => {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Адміністративна панель</h1>
        <nav>
          <ul className="flex space-x-4">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-blue-600 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Outlet />;
    </>
  );
};
