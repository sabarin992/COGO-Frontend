import {
  ArrowLeft,
  Car,
  Bike,
  Truck,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import React from "react";
import Select from "react-select";

import VehicleImageUpload from "./VehicleImageUpload";
import { useCarData } from "../../hooks/useCarData";

const customStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '0.75rem',
    borderColor: state.isFocused ? '#111827' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px #111827' : 'none',
    padding: '2px',
    '&:hover': {
      borderColor: state.isFocused ? '#111827' : '#e5e7eb',
    }
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#111827' : state.isFocused ? '#f9fafb' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#111827',
      color: 'white',
    }
  })
};

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
  const { brands, fetchingBrands, models, fetchingModels } = useCarData(vehicleData.brand);

  const brandOptions = brands.map(b => ({ value: b, label: b }));
  if (vehicleData.brand && !brands.includes(vehicleData.brand)) {
    brandOptions.unshift({ value: vehicleData.brand, label: vehicleData.brand });
  }

  const modelOptions = models.map(m => ({ value: m, label: m }));
  if (vehicleData.model && !models.includes(vehicleData.model)) {
    modelOptions.unshift({ value: vehicleData.model, label: vehicleData.model });
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });

  const colorOptions = [
    "White", "Black", "Silver", "Gray", "Red", "Blue", "Brown", "Green", "Yellow", "Orange", "Purple", "Gold", "Beige"
  ].map(c => ({ value: c, label: c }));

  const seatingOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15].map(s => ({ value: s, label: s.toString() }));

  const handleSelectChange = (name, selectedOption) => {
    handleInputChange({
      target: {
        name,
        value: selectedOption ? selectedOption.value : "",
      }
    });
  };

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

              <Select
                name="brand"
                value={brandOptions.find(o => o.value === vehicleData.brand) || null}
                onChange={(option) => handleSelectChange("brand", option)}
                options={brandOptions}
                isLoading={fetchingBrands}
                placeholder={fetchingBrands ? "Loading brands..." : "Select Brand"}
                styles={customStyles}
                isClearable
                isSearchable
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

              <Select
                name="model"
                value={modelOptions.find(o => o.value === vehicleData.model) || null}
                onChange={(option) => handleSelectChange("model", option)}
                options={modelOptions}
                isDisabled={!vehicleData.brand || fetchingModels}
                isLoading={fetchingModels}
                placeholder={fetchingModels ? "Loading models..." : "Select Model"}
                styles={customStyles}
                isClearable
                isSearchable
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

              <Select
                name="year"
                value={yearOptions.find(o => o.value === Number(vehicleData.year)) || null}
                onChange={(option) => handleSelectChange("year", option)}
                options={yearOptions}
                placeholder="2023"
                styles={customStyles}
                isClearable
                isSearchable
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

              <Select
                name="color"
                value={colorOptions.find(o => o.value === vehicleData.color) || null}
                onChange={(option) => handleSelectChange("color", option)}
                options={colorOptions}
                placeholder="White"
                styles={customStyles}
                isClearable
                isSearchable
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

              <Select
                name="seating_capacity"
                value={seatingOptions.find(o => o.value === Number(vehicleData.seating_capacity)) || null}
                onChange={(option) => handleSelectChange("seating_capacity", option)}
                options={seatingOptions}
                placeholder="5"
                styles={customStyles}
                isClearable
                isSearchable
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
