import { CheckIcon, XIcon } from "lucide-react";

const mockVersions = [
  {
    version: "1.0.0",
    createdAt: "2023-01-01",
    fileUrl: "https://example.com/taskmaster-v1.0.0.zip",
    application: {
      title: "TaskMaster",
    },
    status: "IN_REVIEW",
  },
  {
    version: "1.1.0",
    createdAt: "2023-02-15",
    fileUrl: "https://example.com/taskmaster-v1.1.0.zip",
    application: {
      title: "TaskMaster",
    },
    status: "IN_REVIEW",
  },
  {
    version: "2.0.0",
    createdAt: "2023-03-10",
    fileUrl: "https://example.com/taskmaster-v2.0.0.zip",
    application: {
      title: "TaskMaster",
    },
    status: "IN_REVIEW",
  },
];

export const AdminPageVersions = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Версії застосунків</h1>
      <ul className="space-y-2">
        {mockVersions.map((version, index) => (
          <li
            key={index}
            className="p-2 border rounded-md flex gap-2 items-center justify-between"
          >
            <h2 className=" font-semibold">
              {version.application.title} - {version.version}
            </h2>
            <p className="text-gray-600 text-sm">
              {new Date(version.createdAt).toLocaleDateString()}
            </p>

            <a
              href={version.fileUrl}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Файл
            </a>
            <div>
              <CheckIcon className="inline size-4 text-green-500" />
              <XIcon className="inline size-4 text-red-500" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
