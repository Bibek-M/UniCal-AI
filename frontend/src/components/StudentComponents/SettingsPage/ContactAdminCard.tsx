import React, { useState } from "react";
import { Mail, Building2, Clock, Copy, Check, HelpCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const ContactAdminCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const adminEmail = "admin@unical.edu";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-100/30 rounded-2xl p-6 border border-amber-200/80 shadow-2xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5 border border-amber-200">
          <HelpCircle size={22} />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Need to Update Personal or Academic Information?
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
              Admin Authority Only
            </span>
          </div>

          <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">
            To maintain university record integrity, critical fields such as your <strong>Full Name</strong>,{" "}
            <strong>Registration / Roll Number</strong>, <strong>Branch / Department</strong>, and{" "}
            <strong>Current Semester</strong> can only be modified through the Academic Administration Office with proper verification.
          </p>

          {/* Contact Details Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
              <Mail size={16} className="text-amber-700 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Admin</div>
                <div className="text-xs font-semibold text-slate-800 truncate">{adminEmail}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1 rounded-md hover:bg-amber-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Copy email address"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Office Location */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
              <Building2 size={16} className="text-amber-700 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Administration Office</div>
                <div className="text-xs font-semibold text-slate-800 truncate">Academic Block A, Room 102</div>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
              <Clock size={16} className="text-amber-700 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Office Hours</div>
                <div className="text-xs font-semibold text-slate-800 truncate">Mon – Fri, 9:00 AM – 5:00 PM</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${adminEmail}?subject=Student%20Record%20Update%20Request`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Mail size={14} />
              <span>Contact Admin via Email</span>
              <ArrowUpRight size={13} />
            </a>

            <Link
              to="/help"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-slate-900 border border-amber-200 text-xs font-semibold transition-colors"
            >
              <span>Visit Student Help Desk / FAQs</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdminCard;
