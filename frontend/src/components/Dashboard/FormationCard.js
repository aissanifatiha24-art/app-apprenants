import React from "react";

const FormationCard = ({ titre, dateDebut, dateFin, progression }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <h3 className="font-semibold text-base" style={{ color: "#1f2937" }}>
        {titre}
      </h3>
      <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
        {dateDebut} - {dateFin}
      </p>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex-1 mr-4">
          <div
            className="w-full rounded-full h-2 overflow-hidden"
            style={{ backgroundColor: "#fef3c7" }}
          >
            <div
              className="rounded-full h-2 transition-all"
              style={{ width: `${progression}%`, backgroundColor: "#3b82f6" }}
            ></div>
          </div>
        </div>
        <span className="font-bold text-sm" style={{ color: "#3b82f6" }}>
          {progression}%
        </span>
      </div>
    </div>
  );
};

export default FormationCard;
