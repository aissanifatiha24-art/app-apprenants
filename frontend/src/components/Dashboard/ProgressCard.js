import React from "react";

const ProgressionCard = ({ progression, completed, total }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: "#1f2937" }}>
            Progression globale
          </h3>
          <p className="text-3xl font-bold mt-2" style={{ color: "#3b82f6" }}>
            {progression}%
          </p>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {completed} formations sur {total} complétées
          </p>
        </div>
      </div>
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
  );
};

export default ProgressionCard;
