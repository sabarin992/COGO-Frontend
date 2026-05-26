import React from "react";

const Home = () => {
  return (
    <>
    <main className="flex-grow">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end justify-center pb-10 overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC6Xi_GG-0EzTzBTXOY9cpZZFs0LYYz9my7tsa-ETonqMCS-vh48OssORrD6RpMSo8RUGAxt2-DP9Zc3ptpbp65lHUM9eRvZO94OCMbZTnw8qT36Zr_o6KogBu9vktezQ7-dUIqALRJ8kv8CyZTkBK4ZyHmSFn8JHDmTo-zcF-0vysd6Inybafrdu0wRTQEoDardXKM-xJzURg5lwrerZAbCl2TkIhYuxFjQWAN5yiO3uOKNAht704hMhtdC5sx4WZSTnY8WFmuQ"
            alt="COGO Hero"
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            COGO
          </h1>

          <h2 className="text-2xl md:text-5xl font-bold text-white max-w-4xl mt-4 leading-tight drop-shadow-lg">
            Travel with Strangers at an Affordable Cost
          </h2>
        </div>

        {/* Search Box */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              
              {/* From */}
              <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 flex-1 w-full">
                <span className="text-black">📍</span>

                <input
                  type="text"
                  placeholder="Leaving from"
                  className="bg-transparent outline-none w-full text-black placeholder:text-gray-500"
                />
              </div>

              {/* To */}
              <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 flex-1 w-full">
                <span className="text-black">📌</span>

                <input
                  type="text"
                  placeholder="Going to"
                  className="bg-transparent outline-none w-full text-black placeholder:text-gray-500"
                />
              </div>

              {/* Date */}
              <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 flex-1 w-full">
                <span>📅</span>

                <input
                  type="date"
                  className="bg-transparent outline-none w-full text-black"
                />
              </div>

              {/* Passenger */}
              <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 w-full md:w-32">
                <span>👤</span>

                <select className="bg-transparent outline-none w-full text-black">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>

              {/* Button */}
              <button className="bg-black text-white rounded-xl px-8 py-3 font-semibold hover:opacity-90 transition w-full md:w-auto">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="mb-16 max-w-2xl">
          
          <h2 className="text-4xl font-bold text-black mb-4">
            Utilitarian Luxury
          </h2>

          <p className="text-gray-600 text-lg leading-8">
            Experience urban mobility stripped of excess.
            We prioritize speed, safety, and a premium
            ride-sharing experience in every journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 md:col-span-2 relative overflow-hidden">
            
            <div className="relative z-10">
              <span className="text-5xl mb-6 block">⚡</span>

              <h3 className="text-3xl font-bold text-black mb-4">
                Electric Fleet
              </h3>

              <p className="text-gray-600 max-w-md leading-7">
                Our electric vehicles offer silent,
                smooth, and environmentally friendly
                transit for the modern city.
              </p>
            </div>

            <div className="absolute bottom-0 right-0 text-[120px] opacity-5">
              ⚡
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 flex flex-col justify-between">
            
            <div>
              <span className="text-5xl mb-6 block">🛡</span>

              <h3 className="text-3xl font-bold text-black mb-4">
                Safety First
              </h3>

              <p className="text-gray-600 leading-7">
                Rigorous standards and continuous
                monitoring ensure peace of mind.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 md:col-span-3">
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              <div className="bg-gray-100 rounded-full p-5">
                <span className="text-4xl">🤝</span>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-black mb-4">
                  Cooperative Ownership
                </h3>

                <p className="text-gray-600 leading-7 max-w-4xl">
                  A shared mobility network where drivers
                  and riders participate in a sustainable,
                  efficient ecosystem built on trust,
                  affordability, and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
};

export default Home;

// import React from "react";
// import api from "../api";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/header";
// import Footer from "../components/Footer";

// const Home = () => {
//   // useNavigate hook returns a function to navigate between routes
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const response = await api.post("/auth/logout");
//       toast.success(response?.data?.message);
//       navigate("/login", { replace: true });
//     } catch (error) {
//       toast.error(error?.response?.data);
//     }
//   };

//   const handleProfile = async () => {
//     try {
//       const response = await api.get("/user/profile");
//       console.log(response.data);
//     } catch (error) {
//       console.log(error.response);
//     }
//   };
//   return (
//     <>
//       <Header />
//       <main className="min-h-screen flex justify-center items-center">
//         <h1 className="text-3xl">Home Page</h1>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default Home;
