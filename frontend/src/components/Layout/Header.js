// frontend/src/components/Layout/Header.js
import React, { useState } from "react";
import { Bell, Search, UserCircle, Menu, LogOut } from "lucide-react";

const Header = ({ user, onMenuClick, sidebarOpen, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getFullName = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    if (user?.nom) return user.nom;
    if (user?.email) return user.email.split("@")[0];
    return "Utilisateur";
  };

  const getRoleLabel = () => {
    const role = user?.role;
    if (role === "admin") return "Administrateur";
    if (role === "formateur") return "Formateur";
    return "Apprenant";
  };

  const notifications = [
    {
      id: 1,
      message: "Nouveau cours disponible",
      time: "Il y a 2h",
      read: false,
    },
    { id: 2, message: "Votre certificat est prêt", time: "Hier", read: false },
    {
      id: 3,
      message: "Rappel: Quiz demain",
      time: "Il y a 1 jour",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex items-center justify-between">
        {/* Partie gauche - Bouton menu */}
        <div className="flex items-center flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 mr-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{ backgroundColor: "#f9fafb" }}
              />
            </div>
          </div>
        </div>

        {/* Partie droite - Notifications + Profil */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1 text-gray-400 hover:text-gray-600"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 border-b border-gray-50 hover:bg-gray-50"
                    >
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div className="w-px h-6 bg-gray-200"></div>

          {/* Profil utilisateur avec menu déroulant */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-1 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {getFullName()}
                </p>
                <p className="text-xs text-gray-500">{getRoleLabel()}</p>
              </div>
            </button>

            {/* Menu déroulant */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    Mon profil
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
