"use client"

import { useEffect, useState } from "react"
import Popup from "./popup"

export default function PopupWrapper() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if user has seen the popup and when
    const popupData = localStorage.getItem("popupData")
    const currentTime = new Date().getTime()
    
    if (popupData) {
      // Parse the stored data
      const { timestamp } = JSON.parse(popupData)
      
      // Calculate if 24 hours have passed (24 * 60 * 60 * 1000 = 86400000 milliseconds)
      const hasExpired = currentTime - timestamp > 86400000
      
      if (hasExpired) {
        // If 24 hours have passed, show popup again
        setShowPopup(true)
        // Update timestamp
        localStorage.setItem("popupData", JSON.stringify({ timestamp: currentTime }))
      }
    } else {
      // First time user, show popup
      setShowPopup(true)
      // Store current timestamp
      localStorage.setItem("popupData", JSON.stringify({ timestamp: currentTime }))
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)
  }

  return <>{showPopup && <Popup onClose={handleClose} />}</>
}