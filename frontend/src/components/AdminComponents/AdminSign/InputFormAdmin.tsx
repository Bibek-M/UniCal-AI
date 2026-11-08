import { Eye, EyeOff, Lock, MoveRight, UserRound, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../../../utils/auth";

const InputFormAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError("Please provide both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUser,
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please verify your details.");
      }

      // Verify user has Admin role
      if (data.user?.role !== "Admin") {
        throw new Error("Access denied. Only administrator accounts can sign in here.");
      }

      // Save token and user details
      setAuth(data.token, data.user);

      // Redirect to Admin dashboard
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to sign in as Administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="w-full">
      {error && (
        <div className="w-3/4 mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="font-bold my-2 text-slate-800 flex items-center gap-1.5">
        <ShieldCheck size={16} className="text-blue-600" />
        <span>Admin Username / Email</span>
      </div>
      <div className="flex shadow-sm border border-slate-300 w-3/4 items-center px-2 py-1 rounded-sm gap-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
        <UserRound className="text-slate-400" size={18} />
        <input
          className="w-full p-1.5 outline-none text-sm text-slate-800"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter administrator username or email"
          required
        />
      </div>

      <div className="font-bold my-2 text-slate-800">Password</div>
      <div className="flex shadow-sm border border-slate-300 w-3/4 items-center px-2 py-1 justify-between rounded-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
        <div className="flex items-center gap-2.5 flex-1">
          <Lock className="text-slate-400" size={18} />
          <input
            className="p-1.5 w-full outline-none text-sm text-slate-800"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter administrator password"
            required
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-slate-500 hover:text-slate-700 cursor-pointer p-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-800 hover:bg-blue-900 text-white text-xl w-3/4 p-2.5 flex justify-center items-center gap-3.5 rounded-sm mt-8 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <div>Admin Login</div>
            <MoveRight size={20} />
          </>
        )}
      </button>

      <div className="w-3/4 text-center mt-4 text-xs text-slate-500 space-y-1.5">
        <div>
          New administrator?{" "}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Create an Admin account
          </Link>
        </div>
        <div>
          Student or Faculty?{" "}
          <Link to="/signin" className="text-blue-600 font-bold hover:underline">
            Go to Student Portal
          </Link>
        </div>
      </div>
    </form>
  );
};

export default InputFormAdmin;
