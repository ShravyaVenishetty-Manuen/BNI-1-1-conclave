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
export const mockRegions = [
  { id: "reg-1", name: "Guntur Region", membersCount: 142, conclavesCount: 5, status: "Active" },
  { id: "reg-2", name: "Phoenix Chapter", membersCount: 220, conclavesCount: 3, status: "Active" },
  { id: "reg-3", name: "London Central", membersCount: 310, conclavesCount: 4, status: "Active" },
  { id: "reg-4", name: "Singapore Metro", membersCount: 170, conclavesCount: 2, status: "Active" }
];

export const mockAdmins = [
  { id: "adm-1", name: "Sanjay Wagle", email: "guntur.admin@bni.com", mobile: "9876543220", region: "Guntur Region", status: "Active" },
  { id: "adm-2", name: "Ananya Sen", email: "phoenix.admin@bni.com", mobile: "9876543221", region: "Phoenix Chapter", status: "Active" },
  { id: "adm-3", name: "Vikram Reddy", email: "london.admin@bni.com", mobile: "9876543222", region: "London Central", status: "Active" },
  { id: "adm-4", name: "Meera Nair", email: "singapore.admin@bni.com", mobile: "9876543223", region: "Singapore Metro", status: "Inactive" }
];

export const mockGlobalConclaves = [
  { id: "c-101", title: "Annual Business Conclave 2026", region: "Guntur Region", creator: "Sanjay Wagle", venue: "V Convention, Guntur", date: "Jan 14, 2026", status: "Completed", tablesCount: 24, membersCount: 120 },
  { id: "c-102", title: "Quarterly Synergy Q1", region: "Guntur Region", creator: "Sanjay Wagle", venue: "Grand Convention Hall, Guntur", date: "Jul 20, 2026", status: "Active", tablesCount: 12, membersCount: 68 },
  { id: "c-103", title: "Regional Directors Meet 2026", region: "Phoenix Chapter", creator: "Ananya Sen", venue: "Hyatt Regency, Phoenix", date: "Feb 10, 2026", status: "Completed", tablesCount: 16, membersCount: 84 },
  { id: "c-104", title: "National Conclave 2026", region: "London Central", creator: "Vikram Reddy", venue: "Grand Hyatt, London", date: "Oct 12, 2026", status: "Upcoming", tablesCount: 30, membersCount: 180 },
  { id: "c-105", title: "Quarterly Synergy Q2", region: "London Central", creator: "Vikram Reddy", venue: "Convention Hall, London", date: "Apr 15, 2026", status: "Completed", tablesCount: 20, membersCount: 95 },
  { id: "c-106", title: "Singapore Business Summit 2026", region: "Singapore Metro", creator: "Meera Nair", venue: "Marina Bay Sands, SG", date: "Nov 05, 2026", status: "Upcoming", tablesCount: 24, membersCount: 130 }
];

export const mockGlobalMembers = [
  { id: "m-201", name: "Anjali Sharma", category: "IT Infrastructure", company: "Zenith Systems", chapter: "Apex Chapter", region: "Guntur Region", email: "anjali@zenith.com", mobile: "+91 98765 43210" },
  { id: "m-202", name: "Manish Tiwari", category: "Real Estate", company: "Prime Realty Group", chapter: "Apex Chapter", region: "Guntur Region", email: "manish@primerealty.com", mobile: "+91 98765 43211" },
  { id: "m-203", name: "Anita Rao", category: "Digital Marketing", company: "Spark Media", chapter: "Prosperity Chapter", region: "Guntur Region", email: "anita@sparkmedia.in", mobile: "+91 98765 43212" },
  { id: "m-204", name: "Deepak Chawla", category: "Supply Chain", company: "Logistics Pro", chapter: "Prosperity Chapter", region: "Guntur Region", email: "deepak@logisticspro.com", mobile: "+91 98765 43213" },
  { id: "m-205", name: "Ekta Ramachandran", category: "Law & Legal", company: "Rodriguez Partners", chapter: "Phoenix Central", region: "Phoenix Chapter", email: "ekta@rodriguezlaw.com", mobile: "+1 480 555 0199" },
  { id: "m-206", name: "Ganesh Viswanathan", category: "Financial Planning", company: "WealthWise Advisors", chapter: "Phoenix Central", region: "Phoenix Chapter", email: "ganesh@wealthwise.com", mobile: "+1 480 555 0198" },
  { id: "m-207", name: "Siddharth Mehta", category: "Commercial Realty", company: "Mehta Developers", chapter: "London Central Elite", region: "London Central", email: "sid@mehtadevelopers.com", mobile: "+44 20 7946 0958" },
  { id: "m-208", name: "Priya Nair", category: "Wealth Management", company: "Nair Finance", chapter: "London Central Elite", region: "London Central", email: "priya@nairfinance.co.uk", mobile: "+44 20 7946 0959" },
  { id: "m-209", name: "Kunal Shah", category: "Digital Marketing", company: "Shah Marketing Agency", chapter: "Singapore Prosperity", region: "Singapore Metro", email: "kunal@shahmarketing.sg", mobile: "+65 6789 0123" },
  { id: "m-210", name: "Sneha Reddy", category: "Logistics", company: "Reddy Shipping", chapter: "Singapore Prosperity", region: "Singapore Metro", email: "sneha@reddyshipping.com", mobile: "+65 6789 0124" }
];

