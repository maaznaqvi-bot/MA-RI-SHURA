
import React from 'react';
import { ShuraMember } from '../types';
import { COLORS } from '../constants';

interface MemberProfileModalProps {
  member: ShuraMember | null;
  onClose: () => void;
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header/Cover Area */}
        <div className="h-32 bg-gradient-to-r from-[#0b3d2e] to-[#145945] relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-10 -mt-16 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-xl mb-4">
              <div className="w-full h-full rounded-[1.8rem] bg-gray-100 flex items-center justify-center text-3xl font-bold text-[#0b3d2e] border-2 border-dashed border-gray-200">
                {getInitials(member.name)}
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900">{member.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="px-4 py-1 rounded-full bg-amber-50 text-[#c8a951] text-[11px] font-black uppercase tracking-widest border border-amber-100">
                {member.role}
              </span>
              {member.parentId && (
                <span className="text-gray-400 text-xs font-medium italic">
                  Reports to {member.parentId}
                </span>
              )}
            </div>

            <p className="mt-6 text-gray-500 text-sm leading-relaxed max-w-sm">
              {member.description || "Leading strategic initiatives for the YM MA/RI sub-region for the 2026 term."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {member.email ? (
              <a 
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-3 py-4 bg-[#0b3d2e] hover:bg-[#145945] text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-900/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold opacity-50">
                Email N/A
              </div>
            )}

            {member.phone ? (
              <a 
                href={`tel:${member.phone}`}
                className="flex items-center justify-center gap-3 py-4 border-2 border-[#0b3d2e] text-[#0b3d2e] hover:bg-gray-50 rounded-2xl font-bold transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 border-2 border-gray-200 text-gray-400 rounded-2xl font-bold opacity-50">
                Call N/A
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
