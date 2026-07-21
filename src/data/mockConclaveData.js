// Mock data for BNI Conclave Member and Captain portals

// 1. Table members list (used in Member Dashboard & Member Current Round)
export const tableMembers = [];

// 2. Member seating round agenda steps (used in Member Current Round)
export const getAgendaSteps = () => [];

// 3. Schedule round 3 participants (used in Member Schedule)
export const r3Participants = [];

// 4. Conclave history events (used in Member Conclave History)
export const conclavesHistory = [];

// 5. Captain active round participants (used in Captain Current Round)
export const captainParticipants = [];
export const captainCategories = [];
export const captainRoundData = {};

// 7. Captain schedule timeline items (used in Captain Schedule)
export const captainScheduleItems = [
  {
    id: 'item-1',
    time: '09:00 AM - 09:30 AM',
    title: 'Breakfast & General Networking',
    desc: 'Informal morning meet-and-greet in the Main Reception Hall. Buffet breakfast served.',
    status: 'completed'
  },
  {
    id: 'item-2',
    time: '09:30 AM - 10:00 AM',
    title: 'Opening Ceremony & Keynote Address',
    desc: 'Welcoming address from BNI Regional Directors and annual progress presentation.',
    status: 'completed'
  },
  {
    id: 'item-3',
    time: '10:00 AM - 10:45 AM',
    title: 'Round 3: Business Networking (1-to-1)',
    desc: 'Active round. Captains validate station seating check-in. Presentations restricted to 2 minutes.',
    status: 'active'
  },
  {
    id: 'item-4',
    time: '10:45 AM - 11:00 AM',
    title: 'Networking Coffee Break',
    desc: 'Quick refreshment pause. Participants migrate to next tables.',
    status: 'upcoming'
  },
  {
    id: 'item-5',
    time: '11:00 AM - 11:45 AM',
    title: 'Round 4: Business Networking (1-to-1)',
    desc: 'Next structured pairing session matching synergetic categories.',
    status: 'upcoming'
  },
  {
    id: 'item-6',
    time: '11:45 AM - 12:30 PM',
    title: 'Round 5: Business Networking (1-to-1)',
    desc: 'Final structured matching before noon updates.',
    status: 'upcoming'
  },
  {
    id: 'item-7',
    time: '12:30 PM - 01:30 PM',
    title: 'Lunch & Keynote Panel',
    desc: 'Catered lunch accompanied by panel discussions on business development trends.',
    status: 'upcoming'
  }
];

// 8. Superadmin mock datasets
export const mockRegions = [];
export const mockAdmins = [];
export const mockGlobalConclaves = [];
export const mockGlobalMembers = [];

