import { SearchBox as MapboxSearchBox } from "@mapbox/search-js-react";

/**
 * Reusable Location SearchBox component using Mapbox Search JS API
 * 
 * @param {Object} props
 * @param {string} props.value - Controlled input string value
 * @param {Function} props.onChange - Handler called when input text changes: (val: string) => void
 * @param {Function} [props.onSelect] - Handler called when a suggestion is selected: (detail: { place_name: string, coordinates: number[], feature: object }) => void
 * @param {string} [props.placeholder="Search location..."] - Placeholder text
 * @param {string} [props.label] - Field label text
 * @param {string} [props.name] - Form field name
 * @param {string} [props.className=""] - Extra container styling
 * @param {string} [props.accessToken] - Override Mapbox API Token (defaults to VITE_MAPBOX_API_KEY)
 * @param {Object} [props.options] - Extra Mapbox search options (e.g. { country: 'in', limit: 5 })
 * @param {boolean} [props.required=false] - Field requirement flag
 */
export default function SearchBox({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search location...",
  label,
  name,
  className = "",
  accessToken = import.meta.env.VITE_MAPBOX_API_KEY,
  options = {country:"IN"},
  required = false,
}) {
  const handleRetrieve = (res) => {
    const feature = res?.features?.[0];
    if (!feature) return;

    const placeName =
      feature.properties?.full_address ||
      feature.properties?.place_name ||
      feature.properties?.name ||
      feature.text ||
      "";

    const coordinates = feature.geometry?.coordinates || null;

    if (onChange) {
      onChange(placeName);
    }

    if (onSelect) {
      onSelect({
        place_name: placeName,
        coordinates,
        feature,
      });
    }
  };

  const handleChange = (val) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {accessToken ? (
        <div className="searchbox-wrapper relative">
          <MapboxSearchBox
            accessToken={accessToken}
            value={value}
            onChange={handleChange}
            onRetrieve={handleRetrieve}
            placeholder={placeholder}
            options={options}
            theme={{
              variables: {
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                boxShadow: "none",
                fontFamily: "inherit",
                colorText: "#1f2937",
                padding: "0.5rem 0.75rem",
              },
            }}
          />
        </div>
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full border rounded-lg p-3 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
      )}
    </div>
  );
}
