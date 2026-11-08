import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  SignUpHero,
  SignUpRoleToggle,
  SignUpForm,
  type SignUpRole,
  ADMIN_DEPARTMENTS,
} from "../components/common/SignUp";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // Role toggle state
  const [role, setRole] = useState<SignUpRole>("Student");

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [semester, setSemester] = useState("1st Semester");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  // Feedback and loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-suggest portal username from email if untyped or synced
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!username || username === email.split("@")[0]) {
      const suggested = val.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
      setUsername(suggested);
    }
  };

  // Switch role and update defaults
  const handleRoleToggle = (selectedRole: SignUpRole) => {
    setRole(selectedRole);
    setError(null);
    if (selectedRole === "Admin") {
      setDepartment(ADMIN_DEPARTMENTS[0].id);
      setSemester("Administration");
    } else {
      setDepartment("CSE");
      setSemester("1st Semester");
      setAdminKey("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (role === "Student" && !rollNumber.trim()) {
      setError("Registration / Roll number is required for students.");
      return;
    }

    if (role === "Admin" && !adminKey.trim()) {
      setError("Admin Key is required to create an administrator account.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const effectiveUsername = username.trim() || email.split("@")[0].trim();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          username: effectiveUsername,
          password: password,
          rollNumber: rollNumber.trim() || undefined,
          department: department,
          semester: role === "Admin" ? "Staff" : semester,
          role: role,
          adminKey: role === "Admin" ? adminKey.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account. Please try again.");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate(role === "Admin" ? "/signinAdmin" : "/signin");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-300 min-h-screen lg:h-screen w-full flex justify-center items-center p-3 sm:p-5 lg:p-6 overflow-x-hidden">
      <div className="rounded-3xl w-full max-w-6xl xl:max-w-7xl flex flex-col lg:flex-row shadow-2xl overflow-hidden bg-white border border-white/60 lg:h-[90vh] lg:max-h-[820px]">
        {/* Left Side: Campus Hero Showcase */}
        <SignUpHero />

        {/* Right Side: Account Creation Form Panel */}
        <div className="lg:w-1/2 w-full bg-white px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-6 flex flex-col justify-between overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Top Login Redirect Link */}
          <div className="flex justify-end items-center text-xs text-slate-600 font-medium mb-1.5 sm:mb-2">
            <span>Already have an account?</span>
            <Link
              to={role === "Admin" ? "/signinAdmin" : "/signin"}
              className="text-blue-600 font-bold ml-1.5 hover:underline flex items-center gap-0.5"
            >
              <span>Login</span>
            </Link>
          </div>

          <div className="max-w-md w-full mx-auto my-auto py-1">
            {/* Header Titles */}
            <div className="mb-2.5 sm:mb-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create an Account
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sign up to get a personalized university experience.
              </p>
            </div>

            {/* Role Switcher Pill Toggle */}
            <SignUpRoleToggle
              role={role}
              onRoleChange={handleRoleToggle}
              disabled={loading}
            />

            {/* Feedback Alerts */}
            {error && (
              <div className="mb-2.5 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-2.5 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {/* Form Fields Component */}
            <SignUpForm
              role={role}
              name={name}
              setName={setName}
              email={email}
              onEmailChange={handleEmailChange}
              username={username}
              setUsername={setUsername}
              rollNumber={rollNumber}
              setRollNumber={setRollNumber}
              department={department}
              setDepartment={setDepartment}
              semester={semester}
              setSemester={setSemester}
              adminKey={adminKey}
              setAdminKey={setAdminKey}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Footer note */}
          <div className="mt-2 text-center text-[10.5px] text-slate-400">
            By creating an account, you agree to the UniCal AI University Portal terms & policies.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
