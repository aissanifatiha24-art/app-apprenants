import React from "react";

const FormationDetail = ({ formation }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: "#1f2937" }}>
            {formation.titre}
          </h3>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {formation.dateDebut} - {formation.dateFin}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: "#3b82f6" }}>
            {formation.progression}%
          </p>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            Progression
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div
        className="w-full rounded-full h-2 mb-4 overflow-hidden"
        style={{ backgroundColor: "#fef3c7" }}
      >
        <div
          className="rounded-full h-2 transition-all"
          style={{
            width: `${formation.progression}%`,
            backgroundColor: "#3b82f6",
          }}
        ></div>
      </div>

      {/* Modules */}
      <div className="space-y-2">
        {formation.modules?.map((module, idx) => (
          <div key={idx} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-3"
              style={{
                backgroundColor: module.completed ? "#3b82f6" : "#fef3c7",
              }}
            ></div>
            <span
              className="text-sm"
              style={{ color: module.completed ? "#1f2937" : "#9ca3af" }}
            >
              {module.nom}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormationDetail;
