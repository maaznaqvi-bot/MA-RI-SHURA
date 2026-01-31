
import React from 'react';
import { COLORS } from '../constants';

interface Event {
  id: number | string;
  title: string;
  date: string;
  time: string;
  category: string;
  googleDate: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const scrollToCalendar = () => {
    const el = document.getElementById('calendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateGoogleCalLink = (event: Event) => {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.googleDate}&details=${encodeURIComponent('Shared via YM MA/RI Shura Portal')}`;
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden transition-all duration-300">
      <div className="p-6 bg-gradient-to-br from-[#0b3d2e] to-[#072c21] text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black tracking-tight uppercase">Upcoming Events</h3>
          <span className="p-2 bg-white/10 rounded-xl">
            <svg className="w-5 h-5 text-[#c8a951]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </div>
        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
          {events.length > 0 ? 'Synced Shura Schedule' : 'No Calendars Linked'}
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        {events.length > 0 ? (
          <>
            {events.map((event) => (
              <div key={event.id} className="group flex items-start gap-4 animate-in slide-in-from-left-4 duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                  <span className="text-[10px] font-black text-[#0b3d2e] leading-none mb-1">{event.date.split(' ')[0]}</span>
                  <span className="text-sm font-black text-gray-900 leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{event.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-[#c8a951] uppercase tracking-tighter">{event.time}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <a 
                      href={generateGoogleCalLink(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                    >
                      + Add to Cal
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto text-gray-300">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              Events will appear here once you link a chapter calendar.
            </p>
          </div>
        )}
        
        <button 
          onClick={scrollToCalendar}
          className="w-full mt-4 py-3 bg-gray-50 hover:bg-[#0b3d2e] text-gray-900 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 transition-all flex items-center justify-center gap-2"
        >
          {events.length > 0 ? 'View Full Calendar' : 'Go to Linking Portal'}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
