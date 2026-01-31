
import React, { useState, useMemo } from 'react';
import OrgChart from './components/OrgChart';
import ChatInterface from './components/ChatInterface';
import UpcomingEvents from './components/UpcomingEvents';
import MemberProfileModal from './components/MemberProfileModal';
import { CABINET_DATA, NEIGHBORNET_DATA, ALL_SHURA_DATA, COLORS } from './constants';
import { ShuraMember } from './types';

const App: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<ShuraMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract NNC Leadership (SRC -> all NNCs)
  const nncLeadershipData = useMemo(() => {
    return NEIGHBORNET_DATA.filter(m => m.role === 'NNC' || m.id === 'maaz');
  }, []);

  // Group Neighbor-Net Core Teams by Chapter/Area
  const nnCoreData = useMemo(() => {
    const nncs = NEIGHBORNET_DATA.filter(m => m.role === 'NNC');
    return nncs.map(nnc => {
      const coreTeam = NEIGHBORNET_DATA.filter(m => m.parentId === nnc.id);
      // We need to make the NNC the root for this specific mini-chart
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Poppins']">
      <MemberProfileModal 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />

      {/* Header */}
      <header className="w-full bg-gradient-to-b from-[#0b3d2e] to-[#072c21] py-16 shadow-2xl relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center relative z-10">
          <div 
            className="w-24 h-1.5 bg-gold-500 rounded-full mb-8 shadow-glow" 
            style={{ backgroundColor: COLORS.accent, boxShadow: `0 0 15px ${COLORS.accent}` }}
          ></div>
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-[0.25em] uppercase text-center drop-shadow-2xl">
            YM MA/RI Shura
          </h1>
          <p className="text-[#c8a951] mt-4 text-sm font-bold tracking-[0.3em] uppercase opacity-90">Est. 2022</p>
          
          {/* Quick Search */}
          <div className="mt-12 w-full max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Quick search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-5 text-white placeholder-white/40 backdrop-blur-md outline-none focus:ring-2 focus:ring-[#c8a951] transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[50] max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
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
                  <div className="px-6 py-8 text-center text-gray-400 text-sm">No members found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 flex gap-8">
          <a href="#visuals" className="py-5 text-sm font-black uppercase tracking-widest text-[#0b3d2e] border-b-2 border-[#0b3d2e]">Visual Chart</a>
          <a href="#calendar" className="py-5 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#0b3d2e] transition-colors">Calendar</a>
        </div>
      </div>

      <main className="flex-1 max-w-[1700px] mx-auto w-full px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 md:gap-20 items-start">
          
          <div className="xl:col-span-3 space-y-16 md:space-y-24">
            <div id="visuals" className="space-y-16 md:space-y-24">
              {/* Sub-regional Shura Section */}
              <section className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sub-regional Shura</h2>
                    <p className="text-base text-gray-400 mt-1 font-medium italic">Cabinet leadership and department leads.</p>
                  </div>
                </div>
                <OrgChart data={CABINET_DATA} allowZoom={false} onNodeClick={setSelectedMember} />
              </section>

              {/* NNC Leadership Section */}
              <section className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">NeighborNet Coordinators</h2>
                    <p className="text-lg text-gray-400 mt-2 font-medium">Regional leadership structure connecting SRC to local chapters.</p>
                  </div>
                </div>
                <OrgChart data={nncLeadershipData} allowZoom={false} onNodeClick={setSelectedMember} />
              </section>

              {/* Team Overview Dashboard (HCM Stats) */}
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
                       <h2 className="text-3xl font-black text-white tracking-tight">Team Overview</h2>
                       <p className="text-[#c8a951]/70 text-sm font-bold uppercase tracking-[0.2em] mt-1">MA/RI Regional HCM Dashboard</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                      {[
                        { label: 'Leadership', val: '7 Core Leads', desc: 'Sub-Regional Cabinet' },
                        { label: 'NeighborNets', val: '6 Chapters', desc: 'Local Growth Centers' },
                        { label: 'Active Core', val: `${ALL_SHURA_DATA.length} Members`, desc: 'Full Shura Strength' },
                        { label: 'Youth Reach', val: '700+', desc: 'Estimated Impact' }
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

              {/* Neighbor-Net Core Teams Section - Grid of Charts */}
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

            {/* Google Calendar Section */}
            <section id="calendar" className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-50 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Events Calendar</h2>
                  <p className="text-lg text-gray-400 mt-2 font-medium">Keep track of sub-regional meetings, events, and important deadlines.</p>
                </div>
                <div className="flex gap-4">
                  <a 
                    href="https://calendar.google.com/calendar/u/0/r" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#0b3d2e] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#145945] transition-all shadow-lg shadow-green-900/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Add to My Google Calendar
                  </a>
                </div>
              </div>
              
              <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 shadow-inner">
                {/* Note: Replace 'en.usa#holiday@group.v.calendar.google.com' with the actual YM MA/RI Shura Calendar ID when available */}
                <iframe 
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5" 
                  style={{ border: 0 }} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no"
                  title="Shared Google Calendar"
                ></iframe>
              </div>
              
              <div className="mt-8 flex items-start gap-4 p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                <div className="p-2 bg-emerald-100 rounded-xl text-[#0b3d2e]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div className="text-xs text-emerald-800 font-medium leading-relaxed">
                  <span className="font-black uppercase tracking-wider block mb-1">Calendar Sync Info</span>
                  Events are shown in Eastern Time (ET). If you are an NNC or Lead, please ensure all local chapter events are cross-posted here for visibility across the sub-region.
                </div>
              </div>
            </section>

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
            <UpcomingEvents />
            <ChatInterface />
            
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
              <div className="p-4 bg-emerald-50 rounded-2xl inline-flex mb-6 text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Usage Tip</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                You can interact with the charts using gestures to zoom and pan. Click any member card to view their full profile and reporting line.
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
