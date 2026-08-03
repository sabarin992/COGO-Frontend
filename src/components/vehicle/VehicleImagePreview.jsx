import { Crop, Trash2 } from "lucide-react";

const VehicleImagePreview = ({
  images,
  rawImages,
  setImages,
  setRawImages,
  setCropIndex,
  setTempImageSrc,
  setCropModalOpen,
}) => {

  const handleReCrop = (index) => {
    const file = rawImages[index];

    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    setCropIndex(index);
    setTempImageSrc(objectUrl);
    setCropModalOpen(true);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedRawImages = [...rawImages];

    updatedImages.splice(index, 1);
    updatedRawImages.splice(index, 1);

    setImages(updatedImages);
    setRawImages(updatedRawImages);
  };

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">

      {images.map((image, index) => (

        <div
          key={index}
          className="relative overflow-hidden rounded-2xl border border-gray-200 group aspect-[16/10]"
        >

          <img
            src={
              typeof image === "string"
                ? image
                : URL.createObjectURL(image)
            }
            alt={`Vehicle ${index + 1}`}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">

            <button
              type="button"
              onClick={() => handleReCrop(index)}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow hover:bg-gray-100 transition"
            >
              <Crop className="h-3.5 w-3.5" />
              Crop
            </button>

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-700 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>

          </div>

        </div>

      ))}

    </div>
  );
};

export default VehicleImagePreview;