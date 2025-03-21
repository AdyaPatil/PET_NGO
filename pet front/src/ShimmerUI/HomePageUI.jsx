const HomePageShimmerUI = () => {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-yellow-100 text-gray-800 min-h-screen flex flex-col ">
      {/* Hero Section */}
      <header className="relative bg-white rounded-3xl shadow-lg overflow-hidden mx-4 md:mx-6 mb-10 animate-pulse">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full object-cover" />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>

        {/* Text Content */}
        <div className="relative z-10 p-6 md:p-10 text-white">
          <h1 className="text-3xl md:text-6xl font-extrabold mb-4">Find Your Furry Friend</h1>
          <p className="text-base md:text-xl mb-6">
            Explore our shelter and adopt your perfect companion.
          </p>
        </div>
      </header>

      {/* Pet Carousel */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full px-4 md:px-6 space-y-10 ">
        <div className="w-full">
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth whitespace-nowrap animate-pulse">
            {Array(4)
              .fill("")
              ?.map((pet, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 inline-block min-w-[150px] md:min-w-[200px]"
                >
                  <div className="w-full h-32 md:h-48 object-cover rounded-lg mb-4 bg-gray-200" />
                  <h2 className="text-lg md:text-xl font-bold mb-2 bg-gray-200 h-8">{}</h2>
                  <p className="text-gray-600 text-wrap bg-gray-200 h-8">{}</p>
                </div>
              ))}

            <div className="bg-white p-4 rounded-lg shadow-lg text-center items-center justify-center cursor-pointer transition-transform transform hover:scale-105 inline-block min-w-[150px] md:min-w-[200px]">
              <div>
                <p className="text-lg font-bold mr-2">See All Pets</p>
                <p>➡️</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Your Pet Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-4xl mx-auto mt-10 animate-pulse">
          <h2 className="text-xl md:text-3xl font-bold mb-4">Have a Pet to Give?</h2>
          <p className="text-base md:text-xl text-gray-600 mb-6">
            Help another family find their new best friend by adding your pet to our adoption list.
          </p>
          <div className="w-full h-48 md:h-64 object-cover rounded-lg mb-6 mx-auto bg-gray-200" />
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition">
            Add Your Pet
          </div>
        </div>

        {/* Help Someone to Get a Friend Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-4xl mx-auto animate-pulse">
          <h2 className="text-xl md:text-3xl font-bold mb-4">Help Someone to Get a Friend</h2>
          <p className="text-base md:text-xl text-gray-600 mb-6">
            By donating to our shelter, you can help us care for more animals in need and assist
            others in finding their new best friend.
          </p>
          <div>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition">
              Donate Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePageShimmerUI;
