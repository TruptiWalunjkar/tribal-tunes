import React, { useState, useEffect } from "react";
import { InstrumentSection } from "../components/InstrumentSection";
import service from "../appwrite/service.js";
import banner from "../assets/banner.png";
import SearchBar from "../components/SearchBar.jsx";

export const AllInstrument = () => {
  const [loading, setLoading] = useState(true);
  const [allInstruments, setAllInstruments] = useState([]);
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      const response = await service.getAllPosts();
      if (response) {
        setAllInstruments(response.documents); // Assuming the response contains a 'documents' array
        setFilteredInstruments(response.documents);
        
        // Determine categories that have instruments
        const categoriesSet = new Set(response.documents.map(item => item.category));
        setCategories([...categoriesSet]);
      }
      setLoading(false);
    };

    fetchAllItems();
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      const filtered = allInstruments.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInstruments(filtered);

      // Determine categories that have instruments after filtering
      const filteredCategories = new Set(filtered.map(item => item.category));
      setCategories([...filteredCategories]);
    } else {
      setFilteredInstruments(allInstruments);
      
      // Reset categories to show all
      setCategories([...new Set(allInstruments.map(item => item.category))]);
    }
  };

  if (loading) {
    return <div>
    <div role="status" class="animate-pulse">
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
        <div class="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
        <div class="flex items-center justify-center mt-4">
            <svg class="w-8 h-8 text-gray-200 dark:text-gray-700 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
            </svg>
            <div class="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
            <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <span class="sr-only">Loading...</span>
    </div>
    </div>;
  }

  return (
    <div className="bg-gradient-to-t from-gray-100 to-white">
      <section>
        {/* Main image section */}
        <div className="relative py-20 bg-white sm:py-24 lg:py-28">
          {" "}
          {/* Increase the padding */}
          <div className="absolute inset-0">
            <img
              className="object-cover object-right w-full h-full lg:object-center"
              src={banner}
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gray-900 bg-opacity-40"></div>
          <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-lg mx-auto text-center xl:max-w-2xl">
              <h1 className="text-xl font-semibold text-white sm:text-4xl xl:text-3xl font-serif mt-12 mb-12">
                Discover the rich heritage and timeless beauty of traditional
                instruments.
              </h1>
              <p className="max-w-lg mx-auto mt-6 text-base font-normal leading-7 text-gray-300"></p>

              {/* Search bar */}
              <SearchBar items={allInstruments} onSearch={handleSearch} />

              <div className="grid max-w-md grid-cols-2 mx-auto mt-8 md:mt-16 lg:mt-24 xl:mt-32 gap-x-6 grid-col-2"></div>
            </div>
          </div>
        </div>

        {/* Render instrument sections */}
        {categories.map((category) => (
          filteredInstruments.some(inst => inst.category === category) && (
            <InstrumentSection
              key={category}
              instruments={filteredInstruments.filter((inst) => inst.category === category)}
              sectionTitle={`${category} Instruments`}
            />
          )
        ))}
      </section>
    </div>
  );
};
