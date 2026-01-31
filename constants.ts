
import { ShuraMember } from './types';

export const COLORS = {
  primary: '#0b3d2e', // Deep Green
  secondary: '#145945', // Lighter Green
  accent: '#c8a951', // Gold
  white: '#ffffff',
  text: '#1f2937',
};

// Updated Default Calendar ID
export const DEFAULT_CALENDAR_ID = 'c_8bc4a558316fd6f9f0d6a72d8e324583d9dd7feb869be42a2b39f1cb9b68ea1a@group.calendar.google.com'; 

// Root node shared by both hierarchies
const ROOT_MAAZ: ShuraMember = { 
  id: 'maaz', 
  name: 'Maaz Naqvi', 
  role: 'SRC', 
  email: 'maaz.naqvi@youngmuslims.com',
  phone: '508-579-2075',
  description: 'Sub-Regional Coordinator leading the MA/RI sub-region. Responsible for overall vision, strategy, and leadership.' 
};

export const CABINET_DATA: ShuraMember[] = [
  ROOT_MAAZ,
  { 
    id: 'asad-shahzad', 
    name: 'Asad Shahzad', 
    role: 'SG', 
    parentId: 'maaz', 
    email: 'asad.shahzad@youngmuslims.com',
    phone: '401-419-8352',
    description: 'Secretary General responsible for administrative oversight, documentation, and cross-departmental coordination.'
  },
  { 
    id: 'abdurrahman-abou', 
    name: 'Abdurrahman Aboumahmoud', 
    role: 'Tarbiyyah Lead', 
    parentId: 'maaz', 
    email: 'abdurrahman.aboumahmoud@youngmuslims.com',
    phone: '978-960-7613',
    description: 'Responsible for the spiritual growth and educational curriculum across all local chapters.'
  },
  { 
    id: 'ahmad-somakia', 
    name: 'Ahmad Somakia', 
    role: 'Events Lead', 
    parentId: 'maaz', 
    email: 'ahmad.somakia@youngmuslims.com',
    phone: '774-315-8606',
    description: 'Coordinates sub-regional events, camps, and workshops to foster brotherhood and community.'
  },
  { 
    id: 'nabil-barkallah', 
    name: 'Nabil Barkallah', 
    role: 'Societal Impact Lead', 
    parentId: 'maaz', 
    email: 'nabil.barkallah@youngmuslims.com',
    phone: '978-989-3133',
    description: 'Oversees community service initiatives, social activism, and external outreach programs.'
  },
  { 
    id: 'abdullah-abou', 
    name: 'Abdullah Aboumahmoud', 
    role: 'Expansion Lead', 
    parentId: 'maaz', 
    email: 'abdullah.aboumahmoud@youngmuslims.com',
    phone: '978-483-7030',
    description: 'Focused on scaling the organization by opening new NeighborNets and supporting emerging communities.'
  },
  { 
    id: 'haris-waqar', 
    name: 'Haris Waqar', 
    role: 'Expansion + Cloud', 
    parentId: 'maaz', 
    email: 'haris.waqar@youngmuslims.com',
    description: 'Manages digital infrastructure and reporting tools while supporting expansion logistics.'
  },
  { 
    id: 'aiman-baig', 
    name: 'Aiman Baig', 
    role: 'Expansion + Cloud', 
    parentId: 'maaz', 
    email: 'aiman.baig@youngmuslims.com',
    description: 'Technical coordinator focusing on cloud-based management systems and local expansion growth.'
  },
];

export const NEIGHBORNET_DATA: ShuraMember[] = [
  ROOT_MAAZ,
  // Worcester
  { 
    id: 'amin-badmos', 
    name: 'Amin Badmos', 
    role: 'NNC', 
    parentId: 'maaz', 
    email: 'amin.badmos@youngmuslims.com',
    description: 'NeighborNet Coordinator for Worcester. Manages local chapter operations and core team.'
  },
  { id: 'farhan-hussain', name: 'Farhan Hussain', role: 'Core Team', parentId: 'amin-badmos', description: 'Assists in planning weekly Worcester activities and community engagement.' },
  { id: 'jemal-mohamud', name: 'Jemal Mohamud', role: 'Core Team', parentId: 'amin-badmos', description: 'Focuses on Worcester outreach and local youth mentorship.' },
  { id: 'mohamed-diallo', name: 'Mohamed Diallo', role: 'Core Team', parentId: 'amin-badmos', description: 'Handles logistics and coordination for Worcester local events.' },
  { id: 'hassan-ali', name: 'Hassan Ali', role: 'Core Team', parentId: 'amin-badmos', description: 'Supports administrative and tarbiyyah efforts in Worcester.' },

  // Metrowest
  { 
    id: 'abdullah-mohammed', 
    name: 'Abdullah Mohammed', 
    role: 'NNC', 
    parentId: 'maaz', 
    email: 'abdullah.mohammed@youngmuslims.com',
    description: 'NeighborNet Coordinator for Metrowest. Leading local growth and youth development.'
  },
  { id: 'omar-ahmed', name: 'Omar Ahmed', role: 'Core Team', parentId: 'abdullah-mohammed', description: 'Assists in Metrowest program execution and member retention.' },
  { id: 'bilal-ali', name: 'Bilal Ali', role: 'Core Team', parentId: 'abdullah-mohammed', description: 'Local lead for Metrowest sports and social activities.' },
  { id: 'bilal-adnan', name: 'Bilal Adnan', role: 'Core Team', parentId: 'abdullah-mohammed', description: 'Assists in Metrowest weekly halaqa planning.' },
  { id: 'abdullah-ismail', name: 'Abdullah Ismail', role: 'Core Team', parentId: 'abdullah-mohammed', description: 'Supports Metrowest community service projects.' },

  // Sharon
  { 
    id: 'yussuf-nasri', 
    name: 'Yussuf Nasri', 
    role: 'NNC', 
    parentId: 'maaz', 
    email: 'yussuf.nasri@youngmuslims.com',
    description: 'NeighborNet Coordinator for Sharon. Leading local chapter strategy and team building.'
  },
  { id: 'talha-kausar', name: 'Talha Kausar', role: 'Core Team', parentId: 'yussuf-nasri', description: 'Supports Sharon chapter activities and internal coordination.' },
  { id: 'noor-haq', name: 'Noor Haq', role: 'Core Team', parentId: 'yussuf-nasri', description: 'Local Sharon lead for education and spiritual programming.' },
  { id: 'ryan-musto', name: 'Ryan Musto', role: 'Core Team', parentId: 'yussuf-nasri', description: 'Assists with Sharon community outreach and event logistics.' },
  { id: 'noah-jaber', name: 'Noah Jaber', role: 'Core Team', parentId: 'yussuf-nasri', description: 'Supports Sharon member engagement and local initiatives.' },

  // Lowell
  { 
    id: 'hassan-jafri', 
    name: 'Hassan Jafri', 
    role: 'NNC', 
    parentId: 'maaz', 
    email: 'hassan.jafri@youngmuslims.com',
    description: 'NeighborNet Coordinator for Lowell. Building a vibrant local youth community.'
  },
  { id: 'ibrahim-haroon', name: 'Ibrahim Haroon', role: 'Core Team', parentId: 'hassan-jafri', description: 'Assists Lowell coordinator in operational tasks and youth mentoring.' },
  { id: 'ramzi-abdulmagid', name: 'Ramzi Abdulmagid', role: 'Core Team', parentId: 'hassan-jafri', description: 'Supports Lowell chapter programming and service projects.' },
  { id: 'imran-akbar', name: 'Imran Akbar', role: 'Core Team', parentId: 'hassan-jafri', description: 'Handles internal communications for the Lowell chapter.' },

  // Pawtucket
  { 
    id: 'hanzalah-qamar', 
    name: 'Hanzalah Qamar', 
    role: 'NNC', 
    parentId: 'maaz', 
    email: 'hanzalah.qamar@youngmuslims.com',
    description: 'NeighborNet Coordinator for Pawtucket. Managing RI regional presence.'
  },
  { id: 'talha-qamar', name: 'Talha Qamar', role: 'Core Team', parentId: 'hanzalah-qamar', description: 'Supports Pawtucket weekly activities and local outreach.' },
  { id: 'adam-aljallad', name: 'Adam Aljallad', role: 'Core Team', parentId: 'hanzalah-qamar', description: 'Local Pawtucket lead for youth sports and engagement.' },
  { id: 'haider-amad', name: 'Haider Amad', role: 'Core Team', parentId: 'hanzalah-qamar', description: 'Assists in Pawtucket tarbiyyah curriculum delivery.' },
  { id: 'nazir-alnahas', name: 'Nazir Alnahas', role: 'Core Team', parentId: 'hanzalah-qamar', description: 'Handles local logistics for Pawtucket community service.' },

  // Quincy
  { 
    id: 'yoseph-hassan', 
    name: 'Yoseph Hassan', 
    role: 'NNC', 
    parentId: 'maaz', 
    email: 'yoseph.hassan@youngmuslims.com',
    description: 'NeighborNet Coordinator for Quincy. Fostering a new local chapter growth.'
  },
  { id: 'ali-goutay', name: 'Ali Goutay', role: 'Core Team', parentId: 'yoseph-hassan', description: 'Assists in Quincy weekly halaqa planning and member growth.' },
  { id: 'ahmad-barry', name: 'Ahmad Barry', role: 'Core Team', parentId: 'yoseph-hassan', description: 'Supports Quincy community service and youth networking.' },
  { id: 'saeed-quincy', name: 'Saeed', role: 'Core Team', parentId: 'yoseph-hassan', description: 'Supports local chapter activities and Quincy youth engagement.' },
];

export const ALL_SHURA_DATA: ShuraMember[] = [
  ...CABINET_DATA,
  ...NEIGHBORNET_DATA.filter(m => m.id !== 'maaz')
];
