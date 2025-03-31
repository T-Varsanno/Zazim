import React, { createContext, useContext, useState } from 'react';
import { activities as initialActivities } from '../Data/mockData';

const ActivitiesContext = createContext();

export const ActivitiesProvider = ({ children }) => {
  const [activities, setActivities] = useState(initialActivities);

  const markActivityCompleted = (id) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, completed: true } : a
      )
    );
  };

  return (
    <ActivitiesContext.Provider value={{ activities, markActivityCompleted }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => useContext(ActivitiesContext);
