import React, { useState } from "react";
import { adminLogin } from "../../services/authService";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      toast.success("Admin login successful!");
      
      // Redirect to the Admin Dashboard
      window.location.replace("/admin/dashboard");
    } catch (error) {
      const details = error?.response?.data?.detail;
      const message = Array.isArray(details)
        ? details[0]?.msg
        : details || "Invalid admin credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[420px] animate-in fade-in duration-700 space-y-8">
        
        {/* Logo Branding */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black tracking-tight mb-2">
            COGO
          </h1>
          <p className="text-xs uppercase tracking-[4px] text-gray-500 font-medium">
            Management Console
          </p>
        </div>

        {/* Login Card */}
        <section className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
          {/* Header */}
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-black">Sign In</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Enter your admin credentials to proceed.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="name@cogo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-sm font-medium py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer font-semibold"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 leading-5">
              Protected by COGO Enterprise Security.
              <br />
              Need help? Contact system administrator.
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;