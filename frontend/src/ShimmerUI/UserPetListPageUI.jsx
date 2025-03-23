const UserPetListPageUI = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
      {/* Shimmer Cards */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gray-300 animate-pulse rounded-lg"></div>
          </div>
          <div className="h-6 bg-gray-300 animate-pulse rounded-lg mb-2 w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-300 animate-pulse rounded-lg w-1/2 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export default UserPetListPageUI;
