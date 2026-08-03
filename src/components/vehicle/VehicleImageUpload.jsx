import { Upload, Crop, Image as ImageIcon } from "lucide-react";

const VehicleImageUpload = ({
  images,
  setImages,
  rawImages,
  setRawImages,
  setCropIndex,
  setTempImageSrc,
  setCropModalOpen,
  errors,
}) => {
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const updatedImages = [...images];
    const updatedRawImages = [...rawImages];

    files.forEach((file) => {
      updatedImages.push(file);
      updatedRawImages.push(file);
    });

    setImages(updatedImages);
    setRawImages(updatedRawImages);
  };

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

  return (
    <div>

      <label className="block text-sm font-semibold text-gray-900 mb-3">
        Vehicle Images <span className="text-red-500">*</span>
      </label>

      <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 cursor-pointer hover:border-gray-400 transition">

        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gray-100 mb-3">
          <Upload className="h-6 w-6 text-gray-700" />
        </div>

        <p className="font-semibold">
          Upload Vehicle Images
        </p>

        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG or JPEG
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

      </label>

      {errors.images && (
        <p className="mt-2 text-sm text-red-500">
          {errors.images}
        </p>
      )}

      {images.length > 0 && (

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
                alt=""
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">

                <button
                  type="button"
                  onClick={() => handleReCrop(index)}
                  className="bg-white rounded-full px-3 py-1 text-xs flex items-center gap-1"
                >
                  <Crop className="h-3 w-3" />
                  Crop
                </button>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-red-600 text-white rounded-full px-3 py-1 text-xs"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default VehicleImageUpload;