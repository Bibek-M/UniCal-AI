import { apiUrl } from "../../api";
import { Eye, EyeOff, Lock, MoveRight, UserRound, AlertCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../../utils/auth";

const InputForm = () => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const identifier = text.trim();
    if (!identifier || !password) {
      setError("Please enter both registration number and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(apiUrl("/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: identifier,
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please check your details.");
      }

      // Save credentials and user data
      setAuth(data.token, data.user);

      // Navigate to student home dashboard
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full">
      {error && (
        <div className="w-3/4 mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="font-bold my-2 text-slate-800">Registration Number</div>
      <div className="flex shadow-sm border border-slate-300 w-3/4 items-center px-2 py-1 rounded-sm gap-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
        <UserRound className="text-slate-400" size={18} />
        <input
          className="w-full p-1.5 outline-none text-sm text-slate-800"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter Your registration number"
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
            placeholder="Enter Your password"
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
        className="bg-blue-600 hover:bg-blue-700 text-white text-xl w-3/4 p-2.5 flex justify-center items-center gap-3.5 rounded-sm mt-8 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <div>Login</div>
            <MoveRight size={20} />
          </>
        )}
      </button>

      <div className="w-3/4 text-center mt-4 text-xs text-slate-500 space-y-1.5">
        <div>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Sign up
          </Link>
        </div>
        <div>
          Administrator?{" "}
          <Link to="/signinAdmin" className="text-blue-600 font-bold hover:underline">
            Sign in as Admin
          </Link>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
