"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useTeams } from "./TeamsContext";
import { useMatches } from "./MatchesContext";

const ReservationContext = createContext();

export const useReservation = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const { teams, removeTeam } = useTeams();
  const { matches, cancelMatch } = useMatches();

  // Load reservations from localStorage
  useEffect(() => {
    try {
      const storedReservations =
        JSON.parse(localStorage.getItem("reservations")) || [];
      setReservations(storedReservations);
    } catch (error) {
      console.error("Error loading reservations from localStorage:", error);
      setReservations([]);
    }
  }, []);

  // Save reservations to localStorage
  const saveReservationsToStorage = useCallback((reservationsToSave) => {
    try {
      localStorage.setItem("reservations", JSON.stringify(reservationsToSave));
    } catch (error) {
      console.error("Error saving reservations to localStorage:", error);
    }
  }, []);

  // Check for expired reservations every minute
  useEffect(() => {
    const checkExpiredReservations = () => {
      const now = new Date();
      const updatedReservations = [...reservations];
      let hasChanges = false;

      // Check each reservation
      reservations.forEach((reservation) => {
        if (!reservation.paid) {
          const expiryDate = new Date(reservation.expiresAt);

          if (now >= expiryDate) {
            console.log("Expired reservation found:", reservation);

            // Find teams using this reservation
            const relatedTeams = teams.filter(
              (team) =>
                team.stadiumId === reservation.stadiumId &&
                team.playDate === reservation.date &&
                team.playTime === reservation.time
            );

            // Find matches using this reservation
            const relatedMatches = matches.filter(
              (match) =>
                match.stadiumId === reservation.stadiumId &&
                match.date === reservation.date &&
                match.time === reservation.time
            );

            // Remove related teams
            relatedTeams.forEach((team) => {
              console.log("Removing expired team:", team.name);
              removeTeam(team.id);
            });

            // Cancel related matches
            relatedMatches.forEach((match) => {
              console.log("Canceling expired match:", match.id);
              cancelMatch(match.id);
            });

            // Mark reservation for removal
            const index = updatedReservations.findIndex(
              (r) => r.id === reservation.id
            );
            if (index !== -1) {
              updatedReservations.splice(index, 1);
              hasChanges = true;
            }
          }
        }
      });

      // Update reservations if any were removed
      if (hasChanges) {
        setReservations(updatedReservations);
        saveReservationsToStorage(updatedReservations);
      }
    };

    // Run the check immediately
    checkExpiredReservations();

    // Set up interval to check every minute
    const intervalId = setInterval(checkExpiredReservations, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [
    reservations,
    teams,
    matches,
    removeTeam,
    cancelMatch,
    saveReservationsToStorage,
  ]);

  // Check if a stadium is available at a specific date and time
  const isStadiumAvailable = useCallback(
    (stadiumId, date, time) => {
      return !reservations.some(
        (reservation) =>
          reservation.stadiumId === stadiumId &&
          reservation.date === date &&
          reservation.time === time
      );
    },
    [reservations]
  );

  // Add a new reservation
  const addReservation = useCallback(
    (reservation) => {
      setReservations((prevReservations) => {
        const newReservations = [...prevReservations, reservation];
        saveReservationsToStorage(newReservations);
        return newReservations;
      });
    },
    [saveReservationsToStorage]
  );

  // Update an existing reservation
  const updateReservation = useCallback(
    (updatedReservation) => {
      setReservations((prevReservations) => {
        const newReservations = prevReservations.map((reservation) =>
          reservation.id === updatedReservation.id
            ? updatedReservation
            : reservation
        );
        saveReservationsToStorage(newReservations);
        return newReservations;
      });
    },
    [saveReservationsToStorage]
  );

  // Remove a reservation
  const removeReservation = useCallback(
    (reservationId) => {
      setReservations((prevReservations) => {
        const newReservations = prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        );
        saveReservationsToStorage(newReservations);
        return newReservations;
      });
    },
    [saveReservationsToStorage]
  );

  // Get reservations for a specific user
  const getUserReservations = useCallback(
    (userId) => {
      return reservations.filter(
        (reservation) => reservation.userId === userId
      );
    },
    [reservations]
  );

  // Get reservations for a specific stadium
  const getStadiumReservations = useCallback(
    (stadiumId) => {
      return reservations.filter(
        (reservation) => reservation.stadiumId === stadiumId
      );
    },
    [reservations]
  );

  // Context value
  const contextValue = {
    reservations,
    isStadiumAvailable,
    addReservation,
    updateReservation,
    removeReservation,
    getUserReservations,
    getStadiumReservations,
  };

  return (
    <ReservationContext.Provider value={contextValue}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationProvider;
