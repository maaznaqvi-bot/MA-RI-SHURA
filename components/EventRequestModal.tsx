
import React, { useState } from 'react';

interface EventRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventRequestModal: React.FC<EventRequestModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', description: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulation: In a real app, this would call an API or send an email
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">Request Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-lg font-bold text-gray-900">Request Sent!</p>
            <p className="text-sm text-gray-500">Your event has been submitted to the Events Lead for review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Event Title</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0b3d2e] transition-all font-semibold"
                placeholder="e.g. Lowell Chapter Halaqa"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Preferred Date</label>
              <input 
                type="date"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0b3d2e] transition-all font-semibold"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brief Description</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0b3d2e] transition-all font-semibold min-h-[100px]"
                placeholder="Location, time, and purpose..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-[#0b3d2e] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#145945] transition-all shadow-lg shadow-green-900/10"
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventRequestModal;
