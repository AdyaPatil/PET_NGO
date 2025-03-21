const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-teal-600 mb-8">About Us</h1>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8 sm:mb-12">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Welcome to <span className="font-semibold">[Your Pet NGO Name]</span>, where we believe
            that every pet deserves a loving home, compassionate care, and a life full of joy. Our
            mission is to rescue, rehabilitate, and rehome pets in need, while also educating the
            community on responsible pet ownership.
          </p>
        </div>

        {/* Our Mission Section */}
        <section className="bg-teal-50 rounded-lg shadow-lg p-6 sm:p-8 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-teal-700 mb-4">Our Mission:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>
              <span className="font-bold text-teal-600">Rescue:</span> We take in animals who are
              abandoned, lost, or in distress and provide them with immediate care and shelter.
            </li>
            <li>
              <span className="font-bold text-teal-600">Rehabilitate:</span> Through medical
              treatment, emotional support, and training, we help pets regain their health and
              confidence.
            </li>
            <li>
              <span className="font-bold text-teal-600">Rehome:</span> Finding the perfect forever
              homes for our animals is our top priority, ensuring that every adoption is a life-long
              commitment.
            </li>
          </ul>
        </section>

        {/* Why We Do What We Do Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-teal-700 mb-4">
            Why We Do What We Do:
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            At <span className="font-semibold">PETNGO</span>, we believe that every animal is worthy
            of love, no matter their background. Our goal is to reduce the number of homeless pets,
            support responsible pet ownership, and promote animal welfare through outreach and
            education.
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4">
            We also advocate for the humane treatment of all animals and work to foster strong
            relationships between people and their pets. Through our adoption programs, spay/neuter
            initiatives, and community events, we are changing the lives of pets and their families
            for the better.
          </p>
        </section>

        {/* Get Involved Section */}
        <section className="bg-teal-50 rounded-lg shadow-lg p-6 sm:p-8 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-teal-700 mb-4">Get Involved:</h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            There are so many ways you can help make a difference! Whether it's by adopting a pet,
            volunteering, or making a donation, your support goes a long way in giving these animals
            the care they deserve. Together, we can create a world where every pet has a safe and
            loving home.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
