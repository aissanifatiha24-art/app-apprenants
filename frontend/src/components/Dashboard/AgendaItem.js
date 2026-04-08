import React from "react";

const AgendaItem = ({ horaire, titre, type }) => {
  const getTypeColor = () => {
    switch (type) {
      case "Cours":
        return "#3b82f6";
      case "Évaluation":
        return "#f59e0b";
      case "Pratique":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      className="flex items-center justify-between py-3 border-b"
      style={{ borderColor: "#f3f4f6" }}
    >
      <div className="flex-1">
        <p className="font-medium text-sm" style={{ color: "#1f2937" }}>
          {titre}
        </p>
        <p className="text-xs mt-0.5" style={{ color: getTypeColor() }}>
          {type}
        </p>
      </div>
      <p className="font-semibold text-sm" style={{ color: "#1f2937" }}>
        {horaire}
      </p>
    </div>
  );
};

export default AgendaItem;
