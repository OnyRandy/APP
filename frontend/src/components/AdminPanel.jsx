// AdminPanel.jsx
import { useState, useEffect } from "react";
import { Folder, CheckSquare, Plus } from 'lucide-react';
import DashboardLayout from "./DashboardLayout";
import Table from "./Table";

export default function AdminPanel() {
  // State management
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Generic fetch function with error handling
  const fetchData = async (url, setter) => {
    try {
      const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setter(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Erreur lors du fetch de ${url}:`, err);
      setter([]);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData("http://localhost:3001/api/users", setUsers),
        fetchData("http://localhost:3001/api/projects", setProjects),
        fetchData("http://localhost:3001/api/tasks", setTasks)
      ]);
      setLoading(false);
    };

    loadData();
  }, [token]);

  // Utility function for role badges
  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      manager: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      user: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    };
    
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${roleStyles[role] || roleStyles.user}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Utility function for status badges
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { style: 'bg-green-500/20 text-green-300 border-green-500/50', label: 'Terminé' },
      in_progress: { style: 'bg-blue-500/20 text-blue-300 border-blue-500/50', label: 'En cours' },
      pending: { style: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50', label: 'En attente' }
    };
    
    const config = statusConfig[status] || { style: 'bg-gray-500/20 text-gray-300 border-gray-500/50', label: 'À faire' };
    
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${config.style}`}>
        {config.label}
      </span>
    );
  };

  // Sections configuration
  const sections = {
    users: {
      title: "Utilisateurs",
      component: loading ? (
        <div className="text-center text-gray-400 py-8">Chargement des utilisateurs...</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Gestion des utilisateurs</h2>
              <p className="text-sm text-gray-400 mt-1">{users.length} utilisateur(s) au total</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus size={18} />
              <span className="font-medium">Ajouter</span>
            </button>
          </div>

          {/* Table */}
          <Table
            columns={[
              { 
                header: 'ID', 
                key: 'id',
                render: (row) => <span className="font-mono text-sm text-gray-400">#{row.id}</span>
              },
              { 
                header: 'Email', 
                key: 'email',
                render: (row) => <span className="font-medium text-white">{row.email}</span>
              },
              { 
                header: 'Rôle', 
                key: 'role',
                render: (row) => getRoleBadge(row.role)
              }
            ]}
            data={users}
          />
        </div>
      )
    },

    projects: {
      title: "Projets",
      component: loading ? (
        <div className="text-center text-gray-400 py-8">Chargement des projets...</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Gestion des projets</h2>
              <p className="text-sm text-gray-400 mt-1">{projects.length} projet(s) au total</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus size={18} />
              <span className="font-medium">Nouveau projet</span>
            </button>
          </div>

          {/* Table */}
          <Table
            columns={[
              { 
                header: 'ID', 
                key: 'id',
                render: (row) => <span className="font-mono text-sm text-gray-400">#{row.id}</span>
              },
              { 
                header: 'Nom du projet', 
                key: 'name',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Folder size={16} className="text-blue-400" />
                    <span className="font-medium text-white">{row.name}</span>
                  </div>
                )
              },
              { 
                header: 'Description', 
                key: 'description',
                render: (row) => (
                  <span className="text-gray-400 line-clamp-1">
                    {row.description || <span className="italic">Aucune description</span>}
                  </span>
                )
              }
            ]}
            data={projects}
          />
        </div>
      )
    },

    tasks: {
      title: "Tâches",
      component: loading ? (
        <div className="text-center text-gray-400 py-8">Chargement des tâches...</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Gestion des tâches</h2>
              <p className="text-sm text-gray-400 mt-1">{tasks.length} tâche(s) au total</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Plus size={18} />
              <span className="font-medium">Nouvelle tâche</span>
            </button>
          </div>

          {/* Table */}
          <Table
            columns={[
              { 
                header: 'ID', 
                key: 'id',
                render: (row) => <span className="font-mono text-sm text-gray-400">#{row.id}</span>
              },
              { 
                header: 'Titre', 
                key: 'title',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-green-400" />
                    <span className="font-medium text-white">{row.title}</span>
                  </div>
                )
              },
              { 
                header: 'Statut', 
                key: 'status',
                render: (row) => getStatusBadge(row.status)
              },
              { 
                header: 'Projet', 
                key: 'project_name',
                render: (row) => (
                  <span className="text-gray-400">
                    {row.project_name || <span className="italic">Non assigné</span>}
                  </span>
                )
              }
            ]}
            data={tasks}
          />
        </div>
      )
    }
  };

  return <DashboardLayout role="Admin" sections={sections} />;
}