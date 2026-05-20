import React from "react";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminHeader from "../../components/admin/AdminHeader";
import { 
  Users, 
  Bike, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle 
} from "lucide-react";

const AdminDashboard = () => {
  // Mock Data
  const stats = [
    {
      label: "Total Users",
      value: "1,284",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Active Riders",
      value: "324",
      change: "+4.2%",
      trend: "up",
      icon: Bike,
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      label: "Today's Bookings",
      value: "89",
      change: "+18.7%",
      trend: "up",
      icon: Calendar,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "Total Revenue",
      value: "₹45,850",
      change: "-2.4%",
      trend: "down",
      icon: CreditCard,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  const recentBookings = [
    {
      id: "BK-9082",
      passenger: "Ananya Sharma",
      rider: "Rajesh Kumar",
      from: "Indiranagar",
      to: "Koramangala",
      amount: "₹180",
      status: "Ongoing",
      time: "5 mins ago",
    },
    {
      id: "BK-9081",
      passenger: "Rahul Mehra",
      rider: "Amit Patel",
      from: "HSR Layout",
      to: "Whitefield",
      amount: "₹350",
      status: "Completed",
      time: "25 mins ago",
    },
    {
      id: "BK-9080",
      passenger: "Priya Patel",
      rider: "Sunil Singh",
      from: "MG Road",
      to: "Indiranagar",
      amount: "₹120",
      status: "Completed",
      time: "1 hour ago",
    },
  ];

  const activeAlerts = [
    {
      id: 1,
      type: "SOS Alert",
      desc: "Rider reported passenger emergency near MG Road",
      time: "Just now",
      severity: "High",
    },
    {
      id: 2,
      type: "KYC Pending",
      desc: "32 new rider applications awaiting verification",
      time: "10 mins ago",
      severity: "Medium",
    },
  ];

  return (
    <>
      <AdminSideBar />
      <AdminHeader />
      
      <main className="ml-72 pt-20 min-h-screen bg-gray-50">
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-black">Console Dashboard</h2>
            <p className="text-gray-500 mt-1">
              Real-time overview of your ride-sharing network.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                        stat.trend === "up" 
                          ? "bg-green-50 text-green-700" 
                          : "bg-red-50 text-red-700"
                      }`}>
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                        )}
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-400">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl border ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Middle Column (Recent Bookings & Trends) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Custom SVG Trend Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg text-black">Booking Trends</h4>
                    <p className="text-xs text-gray-500">Weekly traffic overview</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +18% traffic
                  </div>
                </div>
                
                {/* SVG Line Graph */}
                <div className="h-64 w-full pt-4">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#000" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                    
                    {/* Filled Area */}
                    <path
                      d="M 0,200 L 0,160 Q 80,120 120,130 T 250,80 T 380,60 T 500,40 L 500,200 Z"
                      fill="url(#chartGrad)"
                    />
                    
                    {/* Path line */}
                    <path
                      d="M 0,160 Q 80,120 120,130 T 250,80 T 380,60 T 500,40"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Dots */}
                    <circle cx="120" cy="130" r="4.5" fill="#000" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="250" cy="80" r="4.5" fill="#000" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="380" cy="60" r="4.5" fill="#000" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="500" cy="40" r="4.5" fill="#000" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                  
                  {/* Labels */}
                  <div className="flex justify-between text-[10px] font-semibold tracking-wider uppercase text-gray-400 mt-2 px-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h4 className="font-bold text-lg text-black">Live Bookings</h4>
                  <button className="text-xs font-semibold text-gray-500 hover:text-black transition-colors cursor-pointer">
                    View All
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                        <th className="px-6 py-3">Booking ID</th>
                        <th className="px-6 py-3">Details</th>
                        <th className="px-6 py-3">Route</th>
                        <th className="px-6 py-3">Fare</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {recentBookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-black">{bk.id}</td>
                          <td className="px-6 py-4">
                            <div className="leading-tight">
                              <p className="font-medium text-black">{bk.passenger}</p>
                              <p className="text-xs text-gray-400">Rider: {bk.rider}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <span>{bk.from}</span>
                              <span className="text-gray-400">→</span>
                              <span>{bk.to}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-black">{bk.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bk.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {bk.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (Alerts & Activity) */}
            <div className="space-y-6">
              
              {/* SOS Alerts */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-bold text-lg text-black">Console Notifications</h4>
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === "High"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {alert.severity} Severity
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{alert.time}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-black flex items-center gap-1.5">
                          <AlertTriangle className={`w-4 h-4 ${alert.severity === "High" ? "text-red-500" : "text-amber-500"}`} />
                          {alert.type}
                        </p>
                        <p className="text-xs text-gray-500 leading-normal">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-bold text-lg text-black">Quick Administration</h4>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                  <button className="p-3 bg-black text-white rounded-xl hover:opacity-90 transition cursor-pointer">
                    Verify Riders
                  </button>
                  <button className="p-3 border border-gray-200 hover:bg-gray-50 text-black rounded-xl transition cursor-pointer">
                    SOS Console
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;