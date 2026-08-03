import {
  ArrowLeft,
  Car,
  Bike,
  Truck,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import VehicleImageUpload from "./VehicleImageUpload";

const vehicleTypes = [
  {
    id: "Bike",
    label: "Bike",
    icon: Bike,
  },
  {
    id: "Car",
    label: "Car",
    icon: Car,
  },
  {
    id: "SUV",
    label: "SUV",
    icon: Car,
  },
  {
    id: "Van",
    label: "Van",
    icon: Truck,
  },
];

const VehicleForm = ({
  title = "Add Vehicle",
  subtitle = "Register your vehicle before offering rides.",
  submitButtonText = "Save Vehicle",
  vehicleData,
  images,
  setImages,
  rawImages,
  setRawImages,
  cropIndex,
  setCropIndex,
  setTempImageSrc,
  setCropModalOpen,
  loading,
  errors,
  handleInputChange,
  handleSubmit,
  navigate,
}) => {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            {subtitle}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="brand"
                value={vehicleData.brand}
                onChange={handleInputChange}
                placeholder="Toyota"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />

              {errors.brand && (
                <p className="mt-1 text-sm text-red-500">{errors.brand}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Model <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleInputChange}
                placeholder="Innova Crysta"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />

              {errors.model && (
                <p className="mt-1 text-sm text-red-500">{errors.model}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Year <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="year"
                value={vehicleData.year}
                onChange={handleInputChange}
                placeholder="2023"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />

              {errors.year && (
                <p className="mt-1 text-sm text-red-500">{errors.year}</p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Color <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="color"
                value={vehicleData.color}
                onChange={handleInputChange}
                placeholder="White"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />

              {errors.color && (
                <p className="mt-1 text-sm text-red-500">{errors.color}</p>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Registration Number <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="registration_number"
                value={vehicleData.registration_number}
                onChange={handleInputChange}
                placeholder="KL 07 AB 1234"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />

              {errors.registration_number && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.registration_number}
                </p>
              )}
            </div>

            {/* Seating Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Seating Capacity <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="seating_capacity"
                value={vehicleData.seating_capacity}
                onChange={handleInputChange}
                placeholder="5"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />

              {errors.seating_capacity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.seating_capacity}
                </p>
              )}
            </div>
          </div>

          {/* Vehicle Type Cards */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Vehicle Type
              <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {vehicleTypes.map((item) => {
                const Icon = item.icon;

                const selected = vehicleData.vehicle_type === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleInputChange({
                        target: {
                          name: "vehicle_type",
                          value: item.id,
                        },
                      });
                    }}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      selected
                        ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-gray-100">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {errors.vehicle_type && (
              <p className="mt-1 text-sm text-red-500">{errors.vehicle_type}</p>
            )}
          </div>

          {/* Image Upload */}
          <VehicleImageUpload
            images={images}
            setImages={setImages}
            rawImages={rawImages}
            setRawImages={setRawImages}
            cropIndex={cropIndex}
            setCropIndex={setCropIndex}
            setTempImageSrc={setTempImageSrc}
            setCropModalOpen={setCropModalOpen}
            errors={errors}
          />

          {/* Security Note */}
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 border border-gray-200">
            <ShieldCheck className="h-5 w-5 text-gray-700 mt-0.5" />

            <p className="text-xs text-gray-600">
              Your vehicle information is securely stored and used only for
              verification purposes.
            </p>
          </div>

          {/* submit button */}

          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
