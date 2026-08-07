import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ModernImageCropper from "../../components/ModernImageCropper";
import VehicleForm from "../../components/vehicle/VehicleForm";

import { createVehicle } from "../../services/vehicleService";

const AddVehicle = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [vehicleData, setVehicleData] = useState({
    vehicle_type: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    registration_number: "",
    seating_capacity: "",
  });

  const [images, setImages] = useState([]);

  const [rawImages, setRawImages] = useState([]);

  const [cropModalOpen, setCropModalOpen] = useState(false);

  const [cropIndex, setCropIndex] = useState(null);

  const [tempImageSrc, setTempImageSrc] = useState(null);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setVehicleData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!vehicleData.vehicle_type.trim())
      newErrors.vehicle_type = "Vehicle type is required.";

    if (!vehicleData.brand.trim())
      newErrors.brand = "Brand is required.";

    if (!vehicleData.model.trim())
      newErrors.model = "Model is required.";

    if (!vehicleData.year)
      newErrors.year = "Year is required.";

    if (!vehicleData.color.trim())
      newErrors.color = "Color is required.";

    if (!vehicleData.registration_number.trim())
      newErrors.registration_number =
        "Registration number is required.";

    if (!vehicleData.seating_capacity)
      newErrors.seating_capacity =
        "Seating capacity is required.";

    if (images.length === 0)
      newErrors.images = "Please upload vehicle images.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(vehicleData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await createVehicle(formData);

      toast.success(data.message);

      navigate("/profile/vehicles");

    } catch (error) {
      console.log(error.response);
      
      toast.error(
        error.response?.data?.message ??
          "Failed to create vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VehicleForm
        vehicleData={vehicleData}
        setVehicleData={setVehicleData}
        images={images}
        setImages={setImages}
        rawImages={rawImages}
        setRawImages={setRawImages}
        cropModalOpen={cropModalOpen}
        setCropModalOpen={setCropModalOpen}
        cropIndex={cropIndex}
        setCropIndex={setCropIndex}
        tempImageSrc={tempImageSrc}
        setTempImageSrc={setTempImageSrc}
        loading={loading}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />

      {cropModalOpen && (
        <ModernImageCropper
          imageSrc={tempImageSrc}
          aspectRatio={16 / 10}
          title="Crop Vehicle Image"
          onApply={(croppedResult) => {
            const updatedImages = [...images];
            updatedImages[cropIndex] = croppedResult.file;

            setImages(updatedImages);

            setCropModalOpen(false);
          }}
          onCancel={() => setCropModalOpen(false)}
        />
      )}
    </>
  );
};

export default AddVehicle;