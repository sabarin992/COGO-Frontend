// Dummy route service
// Later this function will call Google Directions API

export const getRoutes = async (source, destination) => {
  return [
    {
      id: 1,
      name: "Via NH544",
      distance: "74 km",
      duration: "1 hr 20 min",
    },
    {
      id: 2,
      name: "Via NH66",
      distance: "78 km",
      duration: "1 hr 35 min",
    },
    {
      id: 3,
      name: "Via SH22",
      distance: "82 km",
      duration: "1 hr 40 min",
    },
  ];
};