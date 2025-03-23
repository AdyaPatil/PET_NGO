const PetListPageUI = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Image Section */}
          <div className="bg-gray-300 h-72 w-full"></div>

          {/* Text Section */}
          <div className="p-6 bg-teal-50">
            <div className="bg-gray-300 h-6 w-3/4 mb-4"></div>
            <div className="bg-gray-300 h-6 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetListPageUI;
