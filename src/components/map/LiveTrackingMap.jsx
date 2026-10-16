import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

/**
 * LiveTrackingMap
 *
 * Renders a Mapbox GL map with a single marker that moves as the driver
 * location updates. Designed to be mounted by both the driver (RideDetails)
 * and the passenger (MyBookingDetails).
 *
 * @param {object}      driverLocation - { lat, lng } | null
 * @param {string}      label          - Short label shown above the map card
 */
export default function LiveTrackingMap({ driverLocation, label = "Live Location" }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialise the map once on mount.
  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (mapRef.current) return; // already initialised

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      // Start at a neutral centre; the map re-centres on the first fix.
      center: [76.2673, 9.9312], // Kochi, Kerala — sensible default for COGO
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []); // Run once — no deps

  // Update the marker whenever driverLocation changes.
  useEffect(() => {
    if (!mapRef.current || !driverLocation) return;

    const { lat, lng } = driverLocation;
    const lngLat = [lng, lat];

    if (markerRef.current) {
      // Move the existing marker — do not create a new one.
      markerRef.current.setLngLat(lngLat);
    } else {
      // Create the driver marker once on the first location fix.
      const el = document.createElement("div");
      el.className = "live-driver-marker";
      // Inline styles so the marker works without a separate CSS file.
      Object.assign(el.style, {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "#2563eb", // blue-600
        border: "3px solid #ffffff",
        boxShadow: "0 0 0 3px rgba(37,99,235,0.35)",
        cursor: "pointer",
      });

      markerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(lngLat)
        .addTo(mapRef.current);
    }

    // Re-centre the map on the driver.
    mapRef.current.easeTo({ center: lngLat, duration: 600 });
  }, [driverLocation]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (!MAPBOX_TOKEN) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Mapbox token is missing. Set <code>VITE_MAPBOX_API_KEY</code> in your{" "}
        <code>.env</code> file.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        {/* Pulsing dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
        {!driverLocation && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">
            Waiting for location…
          </span>
        )}
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} style={{ height: "320px", width: "100%" }} />
    </div>
  );
}
