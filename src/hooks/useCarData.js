import { useState, useEffect } from "react";

export const useCarData = (selectedBrand) => {
  const [brands, setBrands] = useState([]);
  const [fetchingBrands, setFetchingBrands] = useState(false);
  const [models, setModels] = useState([]);
  const [fetchingModels, setFetchingModels] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setFetchingBrands(true);
      try {
        const response = await fetch("https://api.api-ninjas.com/v2/carfacets?facets=make", {
          headers: {
            "X-Api-Key": import.meta.env.VITE_NINJA_API_KEY,
          },
        });
        const data = await response.json();

        if (data && Array.isArray(data.make)) {
          const makes = data.make.map((item) => item.value).sort();
          setBrands(makes);
        }
      } catch (error) {
        console.error("Failed to fetch car makes:", error);
      } finally {
        setFetchingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      setFetchingModels(true);
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v2/carfacets?facets=model&make=${encodeURIComponent(
            selectedBrand
          )}`,
          {
            headers: {
              "X-Api-Key": import.meta.env.VITE_NINJA_API_KEY,
            },
          }
        );
        const data = await response.json();

        if (data && Array.isArray(data.model)) {
          const fetchedModels = data.model.map((item) => item.value).sort();
          setModels(fetchedModels);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setFetchingModels(false);
      }
    };

    fetchModels();
  }, [selectedBrand]);

  return { brands, fetchingBrands, models, fetchingModels };
};
