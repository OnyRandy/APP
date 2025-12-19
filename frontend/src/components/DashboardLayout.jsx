import { useState } from "react";
import { Users, Folder, CheckSquare, LogOut, Menu, X, Home, Settings, Bell } from "lucide-react";

export default function DashboardLayout({ role, sections }) {
  const [activeSection, setActiveSection] = useState(Object.keys(sections)[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sectionIcons = {
    users: Users,
    projects: Folder,
    tasks: CheckSquare,
    home: Home,
    settings: Settings
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 flex flex-col transition-all duration-300`}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                {role[0]}
              </div>
              <div>
                <h2 className="font-bold text-lg">{role}</h2>
                <p className="text-xs text-gray-400">En ligne</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto">
              {role[0]}
            </div>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded transition"
            title={sidebarOpen ? "Réduire" : "Étendre"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <div className="flex flex-col space-y-2">
            {Object.keys(sections).map((section) => {
              const Icon = sectionIcons[section] || CheckSquare;
              return (
                <button
                  key={section}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setActiveSection(section)}
                  title={!sidebarOpen ? sections[section].title : ""}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{sections[section].title}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = sectionIcons[activeSection] || CheckSquare;
                return <Icon size={28} className="text-blue-400" />;
              })()}
              <div>
                <h1 className="text-2xl font-bold">{sections[activeSection].title}</h1>
                <p className="text-gray-400 text-sm">Panneau {role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {sections[activeSection].component}
        </div>
      </main>
    </div>
  );
}