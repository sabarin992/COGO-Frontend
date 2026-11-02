import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Derives the WebSocket base URL from the existing VITE_API_URL env variable.
 *
 * VITE_API_URL is e.g. "http://localhost:8000/api/v1"
 *   → ws://localhost:8000/api/v1
 * When served over HTTPS it becomes wss://.
 *
 * The authentication cookie is sent automatically by the browser because:
 *   1. The WS handshake is an HTTP Upgrade request.
 *   2. The cookie's domain matches (same host as the API).
 *   3. We never need to send the JWT in query parameters.
 */
function getWsBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  // Replace http(s):// with ws(s)://
  return apiUrl.replace(/^http/, "ws");
}

/**
 * useLocationWebSocket
 *
 * @param {object} options
 * @param {number|null}  options.rideId   - The ride_id to connect to. Pass null to disable.
 * @param {"driver"|"passenger"} options.role - "driver" sends GPS; "passenger" receives.
 * @param {boolean} options.enabled       - Set false to skip connecting (e.g. wrong status).
 *
 * Returns:
 *   status        – "connecting" | "open" | "closed" | "error"
 *   driverLocation – { lat, lng, timestamp } | null  (passenger view)
 *   geoError      – string | null  (driver geolocation permission error)
 *   wsError       – string | null  (WebSocket-level error)
 */
export default function useLocationWebSocket({ rideId, role, enabled = true }) {
  const [status, setStatus] = useState("closed");
  const [driverLocation, setDriverLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [wsError, setWsError] = useState(null);

  // Stable refs so the cleanup callbacks in useEffect don't capture stale values.
  const wsRef = useRef(null);
  const geoWatchIdRef = useRef(null);

  // Stable send helper — only sends when the socket is OPEN.
  const sendLocation = useCallback((lat, lng) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ lat, lng }));
    }
  }, []);

  useEffect(() => {
    // Only connect when we have a rideId, a valid role, and tracking is enabled.
    if (!rideId || !enabled || !role) return;

    const wsUrl = `${getWsBaseUrl()}/location/ws/${rideId}`;
    setStatus("connecting");
    setWsError(null);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");

      if (role === "driver") {
        // Start watching GPS position.
        if (!navigator.geolocation) {
          setGeoError("Geolocation is not supported by your browser.");
          return;
        }

        geoWatchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            sendLocation(lat, lng);
          },
          (err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                setGeoError(
                  "Location permission denied. Please allow location access to share your position."
                );
                break;
              case err.POSITION_UNAVAILABLE:
                setGeoError("Location information is unavailable.");
                break;
              case err.TIMEOUT:
                setGeoError("Location request timed out.");
                break;
              default:
                setGeoError("An unknown geolocation error occurred.");
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 3000,   // Accept positions up to 3 s old
            timeout: 10000,     // Give up after 10 s
          }
        );
      }
    };

    ws.onmessage = (event) => {
      if (role !== "passenger") return; // Driver ignores incoming broadcast

      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "location") {
          setDriverLocation({
            lat: msg.lat,
            lng: msg.lng,
            timestamp: msg.timestamp,
          });
        }
        // "error" frames from the server are informational for the driver.
        // Passengers don't send anything so they won't receive error frames.
      } catch {
        // Non-JSON frame — ignore silently.
      }
    };

    ws.onerror = () => {
      // onerror fires before onclose; onclose provides the specific code and reason.
    };

    ws.onclose = (event) => {
      setStatus("closed");
      if (event.code === 1000) {
        // Normal closure (ride completed, component unmounted, etc.)
        setWsError(null);
      } else if (event.code === 1008) {
        // Code 1008 = server rejected the connection (auth, booking status, or ride status check failed).
        setWsError(
          event.reason ||
            "Connection rejected by server. You may not be authorized, or the ride is not active."
        );
      } else if (event.code === 1006) {
        // Abnormal closure (e.g. handshake failure, network dropped)
        setWsError("Unable to connect to live location service. Please check your connection.");
      } else {
        setWsError(event.reason || "Live location connection closed.");
      }
    };

    return () => {
      // Cleanup on unmount or when deps change.
      if (geoWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
        geoWatchIdRef.current = null;
      }
      if (wsRef.current) {
        // Only close if not already closing/closed.
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
        wsRef.current = null;
      }
    };
  }, [rideId, role, enabled, sendLocation]);

  return { status, driverLocation, geoError, wsError };
}
