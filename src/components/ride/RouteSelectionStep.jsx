import { useRide } from "../../context/RideContext";
import { useEffect, useState, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Navigation, Clock, Check, RefreshCw, Compass } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

export default function RouteSelectionStep() {
  const { rideData, updateRideData } = useRide();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startCoords, setStartCoords] = useState(rideData.source_coords || null);
  const [endCoords, setEndCoords] = useState(rideData.destination_coords || null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Geocode address if coords are not already in context
  const geocodeLocation = useCallback(async (query) => {
    if (!query || !MAPBOX_TOKEN) return null;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates; // [lng, lat]
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
    return null;
  }, []);

  // Fetch routes from Mapbox Directions API
  const fetchRoutes = useCallback(async () => {
    setLoading(true);

    let srcCoords = rideData.source_coords || startCoords;
    let dstCoords = rideData.destination_coords || endCoords;

    if (!srcCoords && rideData.source) {
      srcCoords = await geocodeLocation(rideData.source);
      if (srcCoords) setStartCoords(srcCoords);
    }

    if (!dstCoords && rideData.destination) {
      dstCoords = await geocodeLocation(rideData.destination);
      if (dstCoords) setEndCoords(dstCoords);
    }

    if (srcCoords && dstCoords && MAPBOX_TOKEN) {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${srcCoords[0]},${srcCoords[1]};${dstCoords[0]},${dstCoords[1]}?alternatives=true&geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const formattedRoutes = data.routes.map((r, index) => {
            const distKm = (r.distance / 1000).toFixed(1);
            const durationMins = Math.round(r.duration / 60);
            const hrs = Math.floor(durationMins / 60);
            const mins = durationMins % 60;
            const durationStr = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
            const name = r.legs?.[0]?.summary
              ? `Via ${r.legs[0].summary}`
              : `Route ${index + 1}`;

            return {
              id: index + 1,
              name,
              distance: `${distKm} km`,
              duration: durationStr,
              geometry: r.geometry,
            };
          });

          setRoutes(formattedRoutes);
          if (!rideData.route && formattedRoutes.length > 0) {
            updateRideData({ route: formattedRoutes[0].name });
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Mapbox Directions API failed:", err);
      }
    }

    // Fallback dummy routes if API unavailable or locations missing
    const fallbackRoutes = [
      { id: 1, name: "Via Main Highway (NH544)", distance: "74 km", duration: "1 hr 20 min" },
      { id: 2, name: "Via Coastal Route (NH66)", distance: "78 km", duration: "1 hr 35 min" },
      { id: 3, name: "Via State Highway (SH22)", distance: "82 km", duration: "1 hr 40 min" },
    ];
    setRoutes(fallbackRoutes);
    if (!rideData.route) {
      updateRideData({ route: fallbackRoutes[0].name });
    }
    setLoading(false);
  }, [rideData.source, rideData.destination, rideData.source_coords, rideData.destination_coords, geocodeLocation, updateRideData, rideData.route, startCoords, endCoords]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // Initialize and update Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        accessToken: MAPBOX_TOKEN,
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: startCoords || [76.2673, 9.9312],
        zoom: 9,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    const map = mapRef.current;

    const renderMapElements = () => {
      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds = new mapboxgl.LngLatBounds();

      // Add Start Marker
      if (startCoords) {
        const el = document.createElement("div");
        el.className = "flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-bold shadow-lg border-2 border-white text-xs";
        el.innerText = "A";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(startCoords)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`Source: ${rideData.source || "Start"}`))
          .addTo(map);

        markersRef.current.push(marker);
        bounds.extend(startCoords);
      }

      // Add End Marker
      if (endCoords) {
        const el = document.createElement("div");
        el.className = "flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold shadow-lg border-2 border-white text-xs";
        el.innerText = "B";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(endCoords)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`Destination: ${rideData.destination || "End"}`))
          .addTo(map);

        markersRef.current.push(marker);
        bounds.extend(endCoords);
      }

      // Draw route layers
      routes.forEach((route) => {
        const sourceId = `route-source-${route.id}`;
        const layerId = `route-layer-${route.id}`;
        const isSelected = rideData.route === route.name;

        if (route.geometry) {
          if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(route.geometry);
          } else {
            map.addSource(sourceId, {
              type: "geojson",
              data: route.geometry,
            });

            map.addLayer({
              id: layerId,
              type: "line",
              source: sourceId,
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": isSelected ? "#2563eb" : "#9ca3af",
                "line-width": isSelected ? 6 : 4,
                "line-opacity": isSelected ? 0.9 : 0.5,
              },
            });
          }

          // Update paint properties dynamically
          if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, "line-color", isSelected ? "#2563eb" : "#9ca3af");
            map.setPaintProperty(layerId, "line-width", isSelected ? 6 : 4);
            map.setPaintProperty(layerId, "line-opacity", isSelected ? 0.95 : 0.45);
          }

          // Extend bounds to include route coordinates
          if (route.geometry?.coordinates) {
            route.geometry.coordinates.forEach((coord) => bounds.extend(coord));
          }
        }
      });

      // Fit map bounds to encompass all markers and routes
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
      }
    };

    if (map.isStyleLoaded()) {
      renderMapElements();
    } else {
      map.on("load", renderMapElements);
    }

  }, [routes, rideData.route, startCoords, endCoords, rideData.source, rideData.destination]);

  const handleSelectRoute = (route) => {
    updateRideData({
      route: route.name,
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Route</h2>
        <p className="text-gray-500">
          Select your preferred route for this journey.
        </p>

        {/* Source & Destination Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>{rideData.source || "Source"}</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-2 text-red-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>{rideData.destination || "Destination"}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Route Options */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Available Routes ({routes.length})
            </h3>
            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                <RefreshCw size={12} className="animate-spin" /> Fetching routes...
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map((route) => {
                const isSelected = rideData.route === route.name;
                return (
                  <div
                    key={route.id}
                    onClick={() => handleSelectRoute(route)}
                    className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-black bg-gray-900 text-white shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-400 text-gray-900"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-base">
                            {route.name}
                          </h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-500 text-white">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className={`flex items-center gap-4 text-xs ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                          <span className="flex items-center gap-1">
                            <Navigation size={13} /> {route.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {route.duration}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? "border-white bg-white text-black" : "border-gray-300 group-hover:border-gray-500"
                      }`}>
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Map Container */}
        <div className="lg:col-span-7">
          <div className="w-full h-[420px] lg:h-[480px] rounded-xl overflow-hidden shadow-inner border border-gray-200 relative bg-gray-100">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {/* Map Overlay Badge */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-gray-700 border border-gray-200/60 flex items-center gap-2">
              <Compass size={14} className="text-blue-600" />
              <span>Interactive Route Preview</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}