import Dashboard from "./dashboard/page";
import DatabaseTest from "./database-test/page";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="flex flex-col gap-3 p-4 items-center w-full min-h-full bg-gray-400">
      <Dashboard />
      <DatabaseTest />
    </div>
  );
}
