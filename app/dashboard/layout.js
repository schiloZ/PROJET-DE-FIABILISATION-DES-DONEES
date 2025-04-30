import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-6 bg-gray-50">{children}</div>
    </div>
  );
}
