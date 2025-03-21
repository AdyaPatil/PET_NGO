const PetInformationPageUI = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Ad Strip Shimmer */}
      <div className="bg-gray-300 animate-pulse h-10 mb-6 rounded-lg"></div>

      {/* Page Title Shimmer */}
      <div className="h-10 bg-gray-300 animate-pulse mb-6 rounded-lg w-1/3 mx-auto"></div>

      {/* Image Slider Shimmer */}
      <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
        <div className="flex-1 flex items-center justify-center relative w-full">
          <div className="w-full h-60 md:w-fit md:h-[500px] bg-gray-300 animate-pulse rounded-lg shadow-lg"></div>
        </div>
      </div>

      {/* Pet Details Shimmer */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-6">
          <div className="h-8 bg-gray-300 animate-pulse mb-4 w-1/4"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/3"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/2"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/4"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-full"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-2/3"></div>
          </div>

          {/* Vaccination Status Shimmer */}
          <div className="my-4">
            <div className="h-8 bg-gray-300 animate-pulse mb-2 w-1/4"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/2"></div>
          </div>

          {/* Google Maps Shimmer */}
          <div className="my-4 md:my-6">
            <div className="h-64 md:h-96 bg-gray-300 animate-pulse rounded-lg"></div>
          </div>

          {/* Owner Information Shimmer */}
          <div className="bg-teal-50 shadow-lg rounded-lg p-4 mt-4">
            <div className="h-8 bg-gray-300 animate-pulse mb-4 w-1/4"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/2"></div>
              <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/3"></div>
              <div className="h-6 bg-gray-300 animate-pulse rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Strip Shimmer at the Bottom */}
      <div className="bg-gray-300 animate-pulse h-10 mt-6 rounded-lg"></div>
    </div>
  );
};

export default PetInformationPageUI;
