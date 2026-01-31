
import React, { useState, useMemo } from 'react';
import OrgChart from './components/OrgChart';
import UpcomingEvents from './components/UpcomingEvents';
import MemberProfileModal from './components/MemberProfileModal';
import EventRequestModal from './components/EventRequestModal';
import { CABINET_DATA, NEIGHBORNET_DATA, ALL_SHURA_DATA, COLORS } from './constants';
import { ShuraMember } from './types';

// Mock event data that "appears" when specific calendars are linked
const MOCK_CALENDAR_EVENTS: Record<string, any[]> = {
  'main': [
    { id: 1, title: 'Sub-Regional Shura Meeting', date: 'Mar 15, 2026', time: '8:00 PM', category: 'Meeting', googleDate: '20260315T200000Z/20260315T213000Z' },
    { id: 2, title: 'Ramadan Prep Workshop', date: 'Mar 22, 2026', time: '2:00 PM', category: 'Education', googleDate: '20260322T140000Z/20260322T160000Z' },
  ],
  'local': [
    { id: 3, title: 'Local Chapter Halaqa', date: 'Mar 18, 2026', time: '6:30 PM', category: 'Local', googleDate: '20260318T183000Z/20260318T200000Z' }
  ]
};

const App: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<ShuraMember | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calendar Management - Starts EMPTY
  const [calendarSources, setCalendarSources] = useState<string[]>([]);
  const [newCalId, setNewCalId] = useState('');
  const [isAddingCal, setIsAddingCal] = useState(false);
  
  // Password Protection State
  const [isCalendarAdmin, setIsCalendarAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);

  // Derived Upcoming Events based on linked calendars
  const syncedEvents = useMemo(() => {
    if (calendarSources.length === 0) return [];
    let events: any[] = [];
    if (calendarSources.length > 0) events = [...MOCK_CALENDAR_EVENTS['main']];
    if (calendarSources.length > 1) events = [...events, ...MOCK_CALENDAR_EVENTS['local']];
    return events;
  }, [calendarSources]);

  // Extract NNC Leadership
  const nncLeadershipData = useMemo(() => {
    return NEIGHBORNET_DATA.filter(m => m.role === 'NNC' || m.id === 'maaz');
  }, []);

  // Group Neighbor-Net Core Teams by Chapter/Area
  const nnCoreData = useMemo(() => {
    const nncs = NEIGHBORNET_DATA.filter(m => m.role === 'NNC');
    return nncs.map(nnc => {
      const coreTeam = NEIGHBORNET_DATA.filter(m => m.parentId === nnc.id);
      const nncAsRoot = { ...nnc, parentId: undefined };
      return {
        name: "NN Core Team",
        location: nnc.description?.split('for ')[1]?.split('.')[0] || 'Local Chapter',
        data: [nncAsRoot, ...coreTeam]
      };
    });
  }, []);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return ALL_SHURA_DATA.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.role.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const calendarUrl = useMemo(() => {
    if (calendarSources.length === 0) return null;
    const base = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1";
    const sources = calendarSources.map(id => `&src=${encodeURIComponent(id)}`).join('');
    const colors = ["%23039BE5", "%2333B679", "%23F4511E", "%238E24AA", "%23E67C73"];
    const colorParams = calendarSources.map((_, i) => `&color=${colors[i % colors.length]}`).join('');
    return `${base}${sources}${colorParams}`;
  }, [calendarSources]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Ilovemuneeb') {
      setIsCalendarAdmin(true);
      setShowPasswordError(false);
      setPasswordInput('');
    } else {
      setShowPasswordError(true);
      setPasswordInput('');
    }
  };

  const handleAddCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCalId.trim() && !calendarSources.includes(newCalId.trim())) {
      setCalendarSources([...calendarSources, newCalId.trim()]);
      setNewCalId('');
      setIsAddingCal(false);
    }
  };

  const removeCalendar = (id: string) => {
    setCalendarSources(calendarSources.filter(s => s !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Poppins']">
      <MemberProfileModal 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />
      
      <EventRequestModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />

      {/* Header */}
      <header className="w-full bg-gradient-to-b from-[#0b3d2e] to-[#072c21] py-16 shadow-2xl relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center relative z-10 text-center">
          <div 
            className="w-24 h-1.5 bg-gold-500 rounded-full mb-8 shadow-glow" 
            style={{ backgroundColor: COLORS.accent, boxShadow: `0 0 15px ${COLORS.accent}` }}
          ></div>
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tight uppercase drop-shadow-2xl">
            Young Muslims
          </h1>
          <p className="text-[#c8a951] mt-3 text-xl md:text-2xl font-bold tracking-widest uppercase opacity-95">
            Massachusetts & Rhode Island
          </p>
          <div className="mt-4 px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
            Est. 2022
          </div>
          
          {/* Quick Search */}
          <div className="mt-12 w-full max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search member directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-5 text-white placeholder-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-[#c8a951] transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[50] max-h-96 overflow-y-auto text-left">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedMember(member);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#0b3d2e] font-black text-xs">
                        {member.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{member.name}</div>
                        <div className="text-[10px] font-black text-[#c8a951] uppercase tracking-wider">{member.role}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-400 text-sm">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 flex gap-8">
          <a href="#calendar" className="py-5 text-sm font-black uppercase tracking-widest text-[#0b3d2e] border-b-2 border-[#0b3d2e]">Calendar</a>
          <a href="#visuals" className="py-5 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#0b3d2e] transition-colors">Shura Visuals</a>
          <a href="#directory" className="py-5 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#0b3d2e] transition-colors">Directory</a>
        </div>
      </div>

      <main className="flex-1 max-w-[1700px] mx-auto w-full px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 md:gap-20 items-start">
          
          <div className="xl:col-span-3 space-y-16 md:space-y-24">
            
            {/* Google Calendar Section */}
            <section id="calendar" className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-50 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Events Calendar</h2>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setIsAddingCal(!isAddingCal)}
                    className={`flex items-center gap-2 px-6 py-3 border-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isAddingCal ? 'border-amber-500 text-amber-600 bg-amber-50' : 'border-[#0b3d2e] text-[#0b3d2e] hover:bg-gray-50'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    {isAddingCal ? 'Close Linking' : 'Link Chapter Calendar'}
                  </button>
                  <button 
                    onClick={() => setIsEventModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#0b3d2e] text-[#0b3d2e] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    Request Event
                  </button>
                </div>
              </div>

              {isAddingCal && (
                <div className="mb-8 p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100 animate-in slide-in-from-top-4 duration-300">
                  {!isCalendarAdmin ? (
                    <div className="max-w-md mx-auto py-4 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-amber-100 rounded-full text-amber-700">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2">Admin Authorization Required</h4>
                      <p className="text-xs text-amber-700 mb-4">Entering external links is restricted to authorized personnel.</p>
                      <form onSubmit={handlePasswordSubmit} className="flex gap-2">
                        <input 
                          type="password"
                          autoFocus
                          placeholder="Enter Password"
                          className={`flex-1 bg-white border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 ${showPasswordError ? 'border-red-400 animate-shake' : 'border-amber-200'}`}
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                        />
                        <button type="submit" className="px-6 py-3 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-700 transition-colors">
                          Unlock
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Add Local Chapter Calendar</h4>
                        <button 
                          onClick={() => setIsCalendarAdmin(false)}
                          className="text-[10px] font-black text-amber-600 hover:text-amber-800 uppercase tracking-widest"
                        >
                          Lock Feature
                        </button>
                      </div>
                      <form onSubmit={handleAddCalendar} className="flex flex-col md:flex-row gap-3">
                        <input 
                          type="text"
                          placeholder="Enter Google Calendar ID"
                          className="flex-1 bg-white border border-amber-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                          value={newCalId}
                          onChange={(e) => setNewCalId(e.target.value)}
                        />
                        <button type="submit" className="px-8 py-3 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-700 transition-colors">
                          Merge View
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Active Sources Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 py-2">Active Sources:</span>
                {calendarSources.length === 0 ? (
                   <span className="text-[10px] font-medium text-gray-400 py-2 italic">No calendars linked. Provide an ID to start syncing.</span>
                ) : calendarSources.map((id, i) => (
                  <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#039BE5", "#33B679", "#F4511E", "#8E24AA", "#E67C73"][i % 5] }}></div>
                    <span className="text-[10px] font-bold text-gray-700 truncate max-w-[150px]">{id}</span>
                    {isCalendarAdmin && (
                      <button onClick={() => removeCalendar(id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 shadow-inner flex items-center justify-center">
                {calendarUrl ? (
                  <iframe 
                    src={calendarUrl} 
                    style={{ border: 0 }} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no"
                    title="Merged Shared Calendar"
                  ></iframe>
                ) : (
                  <div className="text-center p-12 space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">No Calendar Linked</h3>
                      <p className="text-xs text-gray-400 font-medium">Link a chapter calendar to populate the regional view and upcoming events.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div id="visuals" className="space-y-16 md:space-y-24">
              {/* Sub-Regional Shura Section */}
              <section className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sub-Regional Shura</h2>
                    <p className="text-base text-gray-400 mt-1 font-medium italic">Cabinet leadership and department leads.</p>
                  </div>
                </div>
                <OrgChart data={CABINET_DATA} allowZoom={false} onNodeClick={setSelectedMember} />
              </section>

              {/* Neighbor-net Coordinators Section */}
              <section className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Neighbor-net Coordinators</h2>
                    <p className="text-lg text-gray-400 mt-2 font-medium">Regional leadership structure connecting SRC to local chapters.</p>
                  </div>
                </div>
                <OrgChart data={nncLeadershipData} allowZoom={false} onNodeClick={setSelectedMember} />
              </section>

              {/* SR Overview Dashboard */}
              <section className="bg-[#0b3d2e] p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-10">
                     <div className="p-3 bg-white/10 rounded-2xl text-[#c8a951]">
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                       </svg>
                     </div>
                     <div>
                       <h2 className="text-3xl font-black text-white tracking-tight">SR Overview</h2>
                       <p className="text-[#c8a951]/70 text-sm font-bold uppercase tracking-[0.2em] mt-1">MA/RI Regional Dashboard</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                      {[
                        { label: 'Leadership', val: '7 SR Shura Leads', desc: 'Sub-Regional Cabinet' },
                        { label: 'Presence', val: '6 Active NN\'s', desc: 'Sub-Regional Presence' },
                        { label: 'Active Core', val: '36 Active Youth Leaders', desc: 'Active Regional Force' },
                        { label: 'Youth Reach', val: '700+ NN Members', desc: 'Estimated Impact' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                          <p className="text-[10px] font-black text-[#c8a951] uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-xl font-black text-white mb-1">{stat.val}</p>
                          <p className="text-[10px] text-white/40 font-medium group-hover:text-white/60">{stat.desc}</p>
                        </div>
                      ))}
                   </div>
                 </div>
              </section>

              {/* Neighbor-Net Core Teams Section */}
              <section className="space-y-12">
                <div className="px-4">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Neighbor-Net Core Teams</h2>
                  <p className="text-lg text-gray-400 mt-2 font-medium italic">Detailed organizational breakdown of our dedicated local leadership teams.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {nnCoreData.map((chapter, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col min-h-[400px]">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight">{chapter.location}</h3>
                          <p className="text-xs font-bold text-[#c8a951] uppercase tracking-widest mt-0.5">{chapter.name}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-tighter">
                          {chapter.data.length - 1} Core Members
                        </div>
                      </div>
                      <div className="flex-1 min-h-0">
                        <OrgChart data={chapter.data} allowZoom={true} onNodeClick={setSelectedMember} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* List Directory Section */}
            <section id="directory" className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-50">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Member Directory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_SHURA_DATA.sort((a,b) => a.name.localeCompare(b.name)).map(member => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-[#0b3d2e] group-hover:bg-[#0b3d2e] group-hover:text-white transition-colors">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{member.name}</div>
                      <div className="text-[10px] font-black text-[#c8a951] uppercase tracking-widest">{member.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-12 xl:sticky xl:top-24">
            <UpcomingEvents events={syncedEvents} />
            
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
              <div className="p-4 bg-emerald-50 rounded-2xl inline-flex mb-6 text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Usage Tip</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Upcoming events in the sidebar are automatically updated whenever you link or refresh a chapter calendar.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-6">
          <p className="font-black text-gray-800 tracking-tight uppercase">YM MA/RI Shura Portal</p>
          <div className="flex gap-8 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            <span>© 2026 Young Muslims</span>
            <span>Privacy Policy</span>
            <span>Internal Access Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
