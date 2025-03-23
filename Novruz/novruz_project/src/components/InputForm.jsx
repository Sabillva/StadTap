"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function InputForm({ onSubmit }) {
  const [inputName, setInputName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inputName.trim()) {
      setError("Zəhmət olmasa adınızı daxil edin")
      return
    }

    if (inputName.trim().length < 2) {
      setError("Ad ən azı 2 hərfdən ibarət olmalıdır")
      return
    }

    setError("")
    onSubmit(inputName.trim())
  }

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Adınızı daxil edin
          </label>
          <input
            type="text"
            id="name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Adınız..."
          />
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-red-700 hover:to-amber-700 transition-all"
        >
          Personajımı Tap!
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">Adınıza əsasən sizə uyğun Novruz personajı təyin ediləcək</p>
      </div>
    </motion.div>
  )
}

