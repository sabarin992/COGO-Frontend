import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import ModernImageCropper from "../../components/ModernImageCropper";
import VehicleForm from "../../components/vehicle/VehicleForm";

import { getVehicleById, updateVehicle } from "../../services/vehicleService";

const EditVehicle = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setPageLoading(true);
        const response = await getVehicleById(vehicleId);
        const data = response?.data;

        if (data) {
          setVehicleData({
            vehicle_type: data.vehicle_type || "",
            brand: data.brand || "",
            model: data.model || "",
            year: data.year || "",
            color: data.color || "",
            registration_number: data.registration_number || "",
            seating_capacity: data.seating_capacity || "",
          });

          // Set existing image URLs if available
          if (Array.isArray(data.images)) {
            setImages(data.images);
          }
        }
      } catch (error) {
        toast.error(
          error.response?.data?.detail || "Failed to load vehicle details."
        );
        navigate("/profile/vehicles");
      } finally {
        setPageLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId, navigate]);

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
      newErrors.registration_number = "Registration number is required.";

    if (!vehicleData.seating_capacity)
      newErrors.seating_capacity = "Seating capacity is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitLoading(true);

      const formData = new FormData();

      Object.entries(vehicleData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append image files if new File objects exist in images array
      images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      const response = await updateVehicle(vehicleId, formData);

      toast.success(
        response?.data?.message || "Vehicle updated successfully."
      );

      navigate("/profile/vehicles");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to update vehicle."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        <p className="text-sm font-medium text-gray-500">Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <>
      <VehicleForm
        title="Edit Vehicle"
        subtitle="Update your vehicle information and images."
        submitButtonText="Update Vehicle"
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
        loading={submitLoading}
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

export default EditVehicle;
