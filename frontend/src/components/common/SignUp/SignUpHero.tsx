import React from "react";
import collegeBg from "../../assets/college.png";
import AppLogo from "../../StudentComponents/AppLogo";
import SignUpFeaturePills from "./SignUpFeaturePills";

const SignUpHero: React.FC = () => {
  return (
    <div
      className="lg:w-1/2 w-full bg-cover bg-center bg-no-repeat relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[340px] lg:min-h-0 lg:h-full"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      {/* Subtle gradient overlay to enhance legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/25 via-transparent to-black/30 pointer-events-none" />

      {/* Top Logo */}
      <div className="relative z-10">
        <AppLogo />
      </div>

      {/* Middle Typography */}
      <div className="relative z-10 flex flex-col my-4 sm:my-6 lg:my-auto max-w-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Create Your <br />
          <span className="text-blue-700">UniCal AI Account</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base font-semibold text-slate-800 leading-relaxed max-w-md">
          Sign up to stay updated with your university events, exams, holidays and important notices all in one place.
        </p>
      </div>

      {/* Bottom Floating Feature Badges */}
      <SignUpFeaturePills />
    </div>
  );
};

export default SignUpHero;
