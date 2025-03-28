"use client";

import { motion } from "framer-motion";
import { useState } from "react";

function SaveLoadMenu({ onSave, onLoad, onClose }) {
  const [activeTab, setActiveTab] = useState("save");
  const slots = [1, 2, 3];

  const getSaveInfo = (slotId) => {
    const saveData = localStorage.getItem(`visualNovelSave_${slotId}`);
    if (saveData) {
      const { currentSceneId } = JSON.parse(saveData);
      const date = new Date().toLocaleString();
      return { exists: true, info: `Scene: ${currentSceneId} - ${date}` };
    }
    return { exists: false, info: "Empty Slot" };
  };

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-95 p-6 rounded-lg shadow-lg z-50 w-96"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Game Menu</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex mb-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 ${
            activeTab === "save"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("save")}
        >
          Save
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "load"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("load")}
        >
          Load
        </button>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => {
          const { exists, info } = getSaveInfo(slot);
          return (
            <div
              key={slot}
              className="flex justify-between items-center bg-gray-800 p-3 rounded"
            >
              <div className="text-sm">
                <div className="text-white font-medium">Slot {slot}</div>
                <div className="text-gray-400 text-xs">{info}</div>
              </div>
              <button
                onClick={() =>
                  activeTab === "save" ? onSave(slot) : onLoad(slot)
                }
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === "load" && !exists
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-purple-700 text-white hover:bg-purple-600"
                }`}
                disabled={activeTab === "load" && !exists}
              >
                {activeTab === "save" ? "Save" : "Load"}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SaveLoadMenu;
