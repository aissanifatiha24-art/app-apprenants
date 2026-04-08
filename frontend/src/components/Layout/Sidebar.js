// frontend/src/components/Layout/Sidebar.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Mail,
  ShieldCheck,
  Zap,
  BookOpen,
  Briefcase,
  BarChart2,
  Star,
  Calendar,
  Home,
  FolderIcon,
  ClipboardList,
  Clock,
  Edit3,
  CheckCircle,
  MessageSquare,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";

const Sidebar = ({ isOpen = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const role = user?.role;
  const userData = user;
  const userName =
    userData?.prenom && userData?.nom
      ? `${userData.prenom} ${userData.nom}`
      : userData?.email || "Utilisateur";
  const userMatricule = userData?.matricule || "N/A";
  const userEmail = userData?.email || "email@example.com";

  // Configuration des menus par rôle
  const getMenuItems = () => {
    if (role === "admin") {
      return [
        { path: "/admin", name: "Tableau de bord", icon: LayoutDashboard },
        { path: "/admin/formations", name: "Formations", icon: BookOpen },
        { path: "/admin/utilisateurs", name: "Utilisateurs", icon: Users },
        { path: "/admin/services", name: "Services", icon: Briefcase },
        { path: "/admin/statistiques", name: "Statistiques", icon: BarChart2 },
        { path: "/profile", name: "Mon Profil", icon: User },
        { path: "/settings", name: "Paramètres", icon: Settings },
      ];
    } else if (role === "formateur") {
      return [
        { path: "/formateur", name: "Tableau de bord", icon: LayoutDashboard },
        { path: "/formateur/mes-cours", name: "Mes Cours", icon: BookOpen },
        {
          path: "/formateur/mes-apprenants",
          name: "Mes Apprenants",
          icon: Users,
        },
        { path: "/formateur/evaluations", name: "Évaluations", icon: Star },
        { path: "/formateur/planning", name: "Planning", icon: Calendar },
        { path: "/profile", name: "Mon Profil", icon: User },
      ];
    } else if (role === "apprenant") {
      return [
        { path: "/apprenant", name: "Tableau de bord", icon: Home },
        {
          path: "/apprenant/mes-formations",
          name: "Mes formations",
          icon: BookOpen,
        },
        { path: "/apprenant/planning", name: "Planning", icon: Calendar },
        { path: "/apprenant/ressources", name: "Ressources", icon: FolderIcon },
        {
          path: "/apprenant/cahier-suivi",
          name: "Cahier de suivi",
          icon: ClipboardList,
        },
        { path: "/apprenant/historique", name: "Historique", icon: Clock },
        { path: "/apprenant/quiz", name: "Quiz & Examens", icon: Edit3 },
        {
          path: "/apprenant/certificats",
          name: "Certificats",
          icon: CheckCircle,
        },
        { path: "/apprenant/messages", name: "Messages", icon: MessageSquare },
        {
          path: "/apprenant/feedback",
          name: "Feedback",
          icon: MessageCircleIcon,
        },
        { path: "/profile", name: "Mon Profil", icon: User },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  // Configuration des couleurs par rôle
  const getRoleConfig = () => {
    const configs = {
      admin: {
        icon: "👑",
        color: "from-purple-500 to-pink-500",
        badge: "Administrateur",
        bgColor: "bg-purple-500/10",
        sidebarBg: "bg-[#0f172a]",
        borderColor: "border-slate-800",
        textColor: "text-slate-300",
        activeBg: "bg-emerald-500/10",
        activeText: "text-emerald-400",
        activeBorder: "border-emerald-500/20",
        hoverBg: "hover:bg-slate-800/50",
        hoverText: "hover:text-white",
        cardBg: "bg-slate-800/40",
        cardBorder: "border-slate-700",
        buttonBg: "bg-rose-500/10",
        buttonHover: "hover:bg-rose-500",
        buttonText: "text-rose-500",
      },
      formateur: {
        icon: "🎓",
        color: "from-blue-500 to-cyan-500",
        badge: "Formateur",
        bgColor: "bg-blue-500/10",
        sidebarBg: "bg-blue-900",
        borderColor: "border-blue-800",
        textColor: "text-blue-200",
        activeBg: "bg-blue-500/20",
        activeText: "text-blue-400",
        activeBorder: "border-blue-500",
        hoverBg: "hover:bg-blue-800",
        hoverText: "hover:text-white",
        cardBg: "bg-blue-800/40",
        cardBorder: "border-blue-700",
        buttonBg: "bg-rose-500/10",
        buttonHover: "hover:bg-rose-500",
        buttonText: "text-rose-400",
      },
      apprenant: {
        icon: "👤",
        color: "from-emerald-500 to-teal-500",
        badge: "Apprenant",
        bgColor: "bg-emerald-500/10",
        sidebarBg: "#1e3a5f",
        borderColor: "#2a4a7a",
        textColor: "#c8dce8",
        activeBg: "#2a4a7a",
        activeText: "#f59e0b",
        activeBorder: "#f59e0b",
        hoverBg: "hover:bg-[#2a4a7a]",
        hoverText: "hover:text-white",
        cardBg: "rgba(255,255,255,0.05)",
        cardBorder: "rgba(255,255,255,0.1)",
        buttonBg: "bg-rose-500/10",
        buttonHover: "hover:bg-rose-500",
        buttonText: "#f59e0b",
      },
    };
    return configs[role] || configs.apprenant;
  };

  const roleConfig = getRoleConfig();

  // Sections pour apprenant (style spécifique)
  const getApprenantSections = () => {
    if (role !== "apprenant") return null;

    return [
      {
        title: "NAVIGATION",
        items: [
          { path: "/apprenant", name: "Tableau de bord", icon: Home },
          {
            path: "/apprenant/mes-formations",
            name: "Mes formations",
            icon: BookOpen,
          },
          { path: "/apprenant/planning", name: "Planning", icon: Calendar },
          {
            path: "/apprenant/ressources",
            name: "Ressources",
            icon: FolderIcon,
          },
          {
            path: "/apprenant/cahier-suivi",
            name: "Cahier de suivi",
            icon: ClipboardList,
          },
          { path: "/apprenant/historique", name: "Historique", icon: Clock },
        ],
      },
      {
        title: "ÉVALUATION",
        items: [
          { path: "/apprenant/quiz", name: "Quiz & Examens", icon: Edit3 },
          {
            path: "/apprenant/certificats",
            name: "Certificats",
            icon: CheckCircle,
          },
        ],
      },
      {
        title: "COMMUNICATION",
        items: [
          {
            path: "/apprenant/messages",
            name: "Messages",
            icon: MessageSquare,
          },
          {
            path: "/apprenant/feedback",
            name: "Feedback",
            icon: MessageCircleIcon,
          },
        ],
      },
    ];
  };

  const apprenantSections = getApprenantSections();

  if (!role) {
    return (
      <aside
        className={`w-72 h-screen ${role === "admin" ? "bg-[#0f172a]" : role === "formateur" ? "bg-blue-900" : "#1e3a5f"} flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </aside>
    );
  }

  // Rendu pour Apprenant (style spécifique avec sections)
  if (role === "apprenant") {
    return (
      <aside
        className={`h-screen fixed left-0 top-0 flex flex-col shadow-xl transition-all duration-300 z-20 ${!isOpen ? "w-20" : "w-64"}`}
        style={{ backgroundColor: roleConfig.sidebarBg }}
      >
        {/* Logo */}
        <div
          className="p-5 border-b"
          style={{ borderColor: roleConfig.borderColor }}
        >
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#f59e0b" }}
              >
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-wide text-white">
                  ALGÉRIE POSTE
                </h1>
                <p
                  className="text-xs tracking-wide"
                  style={{ color: "#f59e0b" }}
                >
                  E-LEARNING
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#f59e0b" }}
              >
                <span className="text-white font-bold text-sm">AP</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className="px-4 py-4">
          <div
            className={`rounded-xl p-3 border`}
            style={{
              backgroundColor: roleConfig.cardBg,
              borderColor: roleConfig.cardBorder,
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${roleConfig.color} rounded-xl flex items-center justify-center text-lg`}
              >
                {roleConfig.icon}
              </div>
              {isOpen && (
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-sm text-white truncate">
                    {userName}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {userMatricule}
                  </p>
                </div>
              )}
            </div>
            {isOpen && (
              <>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span className="text-xs text-slate-400">Détails</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showProfile ? "rotate-180" : ""}`}
                  />
                </button>
                {showProfile && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-300">
                      <Mail size={12} />
                      <span className="truncate">{userEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-300">
                      <ShieldCheck size={12} />
                      <span className="capitalize">{role}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Navigation avec sections */}
        <nav className="flex-1 overflow-y-auto">
          {apprenantSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {isOpen && (
                <div className="px-4 mb-2">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#a8c8e8" }}
                  >
                    {section.title}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center transition-all duration-200 ${!isOpen ? "justify-center px-3 py-3" : "px-4 py-2.5"}
                      ${isActive ? "border-r-4" : ""}
                    `}
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? roleConfig.activeBg
                        : "transparent",
                      color: isActive
                        ? roleConfig.activeText
                        : roleConfig.textColor,
                      borderRightColor: isActive
                        ? roleConfig.activeBorder
                        : "transparent",
                    })}
                  >
                    <item.icon className={`h-5 w-5 ${isOpen ? "mr-3" : ""}`} />
                    {isOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all"
            style={{ backgroundColor: "#f59e0b20", color: "#f59e0b" }}
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
          {isOpen && (
            <p className="text-[9px] text-center text-slate-500 mt-3">
              Algérie Poste Learning © 2026
            </p>
          )}
        </div>
      </aside>
    );
  }

  // Rendu pour Admin et Formateur (style moderne)
  return (
    <aside
      className={`h-screen fixed left-0 top-0 flex flex-col shadow-xl z-30 overflow-y-auto ${!isOpen ? "w-20" : "w-72"} ${roleConfig.sidebarBg} ${roleConfig.textColor} border-r ${roleConfig.borderColor}`}
      style={{ backgroundColor: roleConfig.sidebarBg }}
    >
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${roleConfig.color} rounded-xl flex items-center justify-center`}
          >
            <Zap className="text-white" size={20} />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-white">AP Learning</h1>
              <p className="text-[10px] text-slate-500 uppercase">
                {roleConfig.badge}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 mb-6">
        <div
          className={`rounded-xl p-4 border ${roleConfig.cardBorder}`}
          style={{ backgroundColor: roleConfig.cardBg }}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${roleConfig.color} rounded-xl flex items-center justify-center text-xl`}
            >
              {roleConfig.icon}
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-sm text-white truncate">
                  {userName}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  {userMatricule}
                </p>
              </div>
            )}
          </div>
          {isOpen && (
            <>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-700/50 transition-all"
              >
                <span className="text-xs text-slate-400">Détails</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showProfile ? "rotate-180" : ""}`}
                />
              </button>
              {showProfile && (
                <div className="mt-3 space-y-2 pt-3 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <Mail size={12} className="text-cyan-400" />
                    <span className="truncate">{userEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="capitalize">{role}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 space-y-1">
        {isOpen && (
          <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">
            Menu Principal
          </p>
        )}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center ${!isOpen ? "justify-center" : "justify-between"} px-4 py-2.5 rounded-xl transition-all
              ${isActive ? `${roleConfig.activeBg} ${roleConfig.activeText} border ${roleConfig.activeBorder}` : `${roleConfig.hoverBg} ${roleConfig.hoverText}`}
            `}
            title={!isOpen ? item.name : ""}
          >
            <div className={`flex items-center ${!isOpen ? "" : "space-x-3"}`}>
              <item.icon size={18} />
              {isOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </div>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${!isOpen ? "justify-center" : "justify-center space-x-2"} px-4 py-3 ${roleConfig.buttonBg} ${roleConfig.buttonText} rounded-xl ${roleConfig.buttonHover} hover:text-white transition-all`}
          title={!isOpen ? "Déconnexion" : ""}
        >
          <LogOut size={16} />
          {isOpen && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
        {isOpen && (
          <div className="mt-4 text-center">
            <p className="text-[9px] text-slate-500">
              Algérie Poste Learning © 2026
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
