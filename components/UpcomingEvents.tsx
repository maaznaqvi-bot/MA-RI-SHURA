
import React from 'react';
import { COLORS } from '../constants';

const UPCOMING_EVENTS = [
  { id: 1, title: 'Sub-Regional Shura Meeting', date: 'Mar 15, 2026', time: '8:00 PM', category: 'Meeting' },
  { id: 2, title: 'Ramadan Prep Workshop', date: 'Mar 22, 2026', time: '2:00 PM', category: 'Education' },
  { id: 3, title: 'Regional Qiyam Night', date: 'Apr 05, 2026', time: '10:00 PM', category: 'Spiritual' },
];

const UpcomingEvents: React.FC = () => {
  const scrollToCalendar = () => {
    const el = document.getElementById('calendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-[#0b3d2e] to-[#072c21] text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black tracking-tight uppercase">Upcoming Events</h3>
          <span className="p-2 bg-white/10 rounded-xl">
            <svg className="w-5 h-5 text-[#c8a951]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </div>
        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Featured Shura Schedule</p>
      </div>
      
      <div className="p-6 space-y-4">
        {UPCOMING_EVENTS.map((event) => (
          <div key={event.id} className="group cursor-default">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                <span className="text-[10px] font-black text-[#0b3d2e] leading-none mb-1">{event.date.split(' ')[0]}</span>
                <span className="text-sm font-black text-gray-900 leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#0b3d2e] transition-colors">{event.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-[#c8a951] uppercase tracking-tighter">{event.time}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-[10px] font-medium text-gray-400">{event.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={scrollToCalendar}
          className="w-full mt-4 py-3 bg-gray-50 hover:bg-[#0b3d2e] text-gray-900 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 transition-all flex items-center justify-center gap-2"
        >
          View Full Calendar
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
