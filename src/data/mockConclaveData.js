// Mock data for BNI Conclave Member and Captain portals

// 1. Table members list (used in Member Dashboard & Member Current Round)
export const tableMembers = [
  { name: "Sanjay Joshi", company: "Zenith Systems", category: "IT INFRASTRUCTURE", chapter: "BNI Phoenix Chapter", initials: "SJ" },
  { name: "Manish Tiwari", company: "Prime Realty Group", category: "REAL ESTATE", chapter: "BNI Synergy Chapter", initials: "MT" },
  { name: "Anita Rao", company: "Spark Media", category: "DIGITAL MARKETING", chapter: "BNI Global Chapter", initials: "AR" },
  { name: "Deepak Chawla", company: "Logistics Pro", category: "SUPPLY CHAIN", chapter: "BNI Summit Chapter", initials: "DC" },
  { name: "Ekta Ramachandran", company: "Rodriguez Partners", category: "LAW & LEGAL", chapter: "BNI Elite Chapter", initials: "ER" },
  { name: "Ganesh V. (Captain)", company: "WealthWise Advisors", category: "FINANCIAL PLANNING", chapter: "BNI Prosperity Chapter", initials: "GV", isCaptain: true }
];

// 2. Member seating round agenda steps (used in Member Current Round)
export const getAgendaSteps = (timeLeft) => [
  {
    time: "00:00 - 05:00",
    title: "Table Check-In & Greeting",
    desc: "Introduce yourself to Table Captain Ganesh V. and exchange business cards with table members.",
    completed: timeLeft < 300 // past 5 min mark
  },
  {
    time: "05:00 - 25:00",
    title: "2-Minute Elevator Pitch & Ask",
    desc: "Deliver your 30-second introduction and state your target referral ask clearly. Listen to other members.",
    completed: timeLeft < 150 // past 25 min mark
  },
  {
    time: "25:00 - 40:00",
    title: "1-to-1 Discussion & Referral Match",
    desc: "Identify matching synergy categories and exchange contact details. Record potential referral leads.",
    completed: false
  },
  {
    time: "40:00 - 45:00",
    title: "Round Wrap-Up & Feedback",
    desc: "Confirm attendance check-in with your table captain and prepare for the next round transition.",
    completed: false
  }
];

// 3. Schedule round 3 participants (used in Member Schedule)
export const r3Participants = [
  { name: "Ananya S.", category: "Digital Marketing", initials: "AS" },
  { name: "Vikram K.", category: "Commercial Realty", initials: "VK" },
  { name: "Ganesh R. (Captain)", category: "Financial Planning", initials: "GR" },
  { name: "Sanjay Joshi", category: "IT Infrastructure", initials: "SJ" }
];

// 4. Conclave history events (used in Member Conclave History)
export const conclavesHistory = [
  {
    id: 1,
    title: "Annual Global Summit 2024",
    status: "Completed",
    location: "Grand Hyatt, Dubai",
    date: "Oct 12, 2024",
    year: "2024",
    rounds: "6/6 Rounds",
    icon: "event_available",
    details: {
      subtitle: "Global Summit 2024",
      rounds: [
        { name: "Round 1 (9:00 AM)", table: "Table #14", captain: "Rohan Wagle", attendeesCount: 5 },
        { name: "Round 2 (10:30 AM)", table: "Table #08", captain: "Ekta Ramachandran", attendeesCount: 5 },
        { name: "Round 3 (12:00 PM)", table: "Networking Lunch", type: "Lunch" }
      ],
      contacts: 34,
      referrals: 12,
      recommendation: "Significant interest from the Logistics sector in Round 2. Follow-up recommended with Rohan Wagle."
    }
  },
  {
    id: 2,
    title: "Regional Directors Meet",
    status: "Completed",
    location: "Convention Centre, Mumbai",
    date: "Aug 24, 2024",
    year: "2024",
    rounds: "4/4 Rounds",
    icon: "corporate_fare",
    details: {
      subtitle: "Regional Directors Meet",
      rounds: [
        { name: "Round 1 (10:00 AM)", table: "Table #02", captain: "Sanjay Joshi", attendeesCount: 4 },
        { name: "Round 2 (11:30 AM)", table: "Table #05", captain: "Manish Tiwari", attendeesCount: 4 }
      ],
      contacts: 21,
      referrals: 8,
      recommendation: "Strong synergy with Manish Tiwari regarding real estate leads. Schedule one-to-one."
    }
  },
  {
    id: 3,
    title: "Quarterly Synergy 2024 Q2",
    status: "Cancelled",
    location: "Virtual Event",
    date: "May 15, 2024",
    year: "2024",
    rounds: "0/4 Rounds",
    icon: "event_busy"
  },
  {
    id: 4,
    title: "National Business Conclave 2023",
    status: "Completed",
    location: "Taj Palace, New Delhi",
    date: "Dec 05, 2023",
    year: "2023",
    rounds: "6/6 Rounds",
    icon: "event_available",
    details: {
      subtitle: "National Conclave 2023",
      rounds: [
        { name: "Round 1 (9:00 AM)", table: "Table #11", captain: "Deepak Chawla", attendeesCount: 6 },
        { name: "Round 2 (10:30 AM)", table: "Table #03", captain: "Meera Gupta", attendeesCount: 6 }
      ],
      contacts: 28,
      referrals: 15,
      recommendation: "Deepak Chawla expressed interest in digital marketing collaboration."
    }
  }
];

// 5. Captain active round participants (used in Captain Current Round)
export const captainParticipants = [
  { name: "Rahul Sharma", company: "Apex Solutions", type: "Software", chapter: "Alpha", initials: "RS" },
  { name: "Sanjay Joshi", company: "BuildRight Ltd", type: "Construction", chapter: "Summit", initials: "SJ" },
  { name: "Vikram Mehta", company: "Prudent Fin", type: "Finance", chapter: "Alpha", initials: "VM" },
  { name: "Ananya Roy", company: "HealthFirst", type: "Healthcare", chapter: "Unity", initials: "AR" },
  { name: "Deepak Chawla", company: "Global Mfg", type: "Manufacturing", chapter: "Summit", initials: "DC" },
  { name: "Priya Singh", company: "Design Pro", type: "Marketing", chapter: "Alpha", initials: "PS" }
];

export const captainCategories = ["Software", "Construction", "Finance", "Healthcare", "Manufacturing"];

// 6. Captain round seating lists (used in Captain Table)
export const captainRoundData = {
  1: [
    { id: 'm-107', name: 'Amit Patel', category: 'Retail', company: 'Patel Merchants Ltd', initials: 'AP', chapter: 'Vista Chapter', bniId: '#BNI-5112', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' },
    { id: 'm-102', name: 'Rajesh Varma', category: 'Finance', company: 'Varma & Associates', initials: 'RV', chapter: 'South Phoenix', bniId: '#BNI-8842', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' },
    { id: 'm-108', name: 'Priya Singh', category: 'Marketing', company: 'Singh Advertisers Agency', initials: 'PS', chapter: 'Alpha Chapter', bniId: '#BNI-2031', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-109', name: 'Rahul Sharma', category: 'Software', company: 'Sharma Devs Studio', initials: 'RS', chapter: 'Alpha Chapter', bniId: '#BNI-1982', bgClass: 'bg-rose-50/50 text-rose-700 border-rose-100/50' },
    { id: 'm-106', name: 'Jagdish Wagle', category: 'Software', company: 'CloudScale Systems Corp', initials: 'JW', chapter: 'Vista Chapter', bniId: '#BNI-3398', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-105', name: 'Meera Gupta', category: 'Manufacturing', company: 'Precision Parts Inc', initials: 'MG', chapter: 'Phoenix Chapter', bniId: '#BNI-1029', bgClass: 'bg-rose-50/50 text-rose-700 border-rose-100/50' }
  ],
  2: [
    { id: 'm-103', name: 'Sanjay Joshi', category: 'Construction', company: 'BuildRight Solutions', initials: 'SJ', chapter: 'Phoenix Chapter', bniId: '#BNI-7731', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' },
    { id: 'm-110', name: 'Vikram Mehta', category: 'Finance', company: 'Prudent Fin Advisors', initials: 'VM', chapter: 'Alpha Chapter', bniId: '#BNI-6610', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' },
    { id: 'm-111', name: 'Ananya Roy', category: 'Healthcare', company: 'HealthFirst Clinics', initials: 'AR', chapter: 'Unity Chapter', bniId: '#BNI-3301', bgClass: 'bg-purple-50/50 text-purple-700 border-purple-100/50' },
    { id: 'm-101', name: 'Anita Sharma', category: 'Software', company: 'Blue Lotus Architecture', initials: 'AS', chapter: 'Phoenix Chapter', bniId: '#BNI-9921', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-102', name: 'Rajesh Varma', category: 'Finance', company: 'Varma & Associates', initials: 'RV', chapter: 'South Phoenix', bniId: '#BNI-8842', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' },
    { id: 'm-106', name: 'Jagdish Wagle', category: 'Software', company: 'CloudScale Systems Corp', initials: 'JW', chapter: 'Vista Chapter', bniId: '#BNI-3398', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' }
  ],
  3: [
    { id: 'm-101', name: 'Anita Sharma', category: 'Software', company: 'Blue Lotus Architecture', initials: 'AS', chapter: 'Phoenix Chapter', bniId: '#BNI-9921', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-102', name: 'Rajesh Varma', category: 'Finance', company: 'Varma & Associates', initials: 'RV', chapter: 'South Phoenix', bniId: '#BNI-8842', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' },
    { id: 'm-103', name: 'Sanjay Joshi', category: 'Construction', company: 'BuildRight Solutions', initials: 'SJ', chapter: 'Phoenix Chapter', bniId: '#BNI-7731', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' },
    { id: 'm-104', name: 'Deepak Chawla', category: 'Healthcare', company: 'Apex Medical Group', initials: 'DC', chapter: 'Downtown Chapter', bniId: '#BNI-4412', bgClass: 'bg-purple-50/50 text-purple-700 border-purple-100/50' },
    { id: 'm-105', name: 'Meera Gupta', category: 'Manufacturing', company: 'Precision Parts Inc', initials: 'MG', chapter: 'Phoenix Chapter', bniId: '#BNI-1029', bgClass: 'bg-rose-50/50 text-rose-700 border-rose-100/50' },
    { id: 'm-106', name: 'Jagdish Wagle', category: 'Software', company: 'CloudScale Systems Corp', initials: 'JW', chapter: 'Vista Chapter', bniId: '#BNI-3398', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' }
  ],
  4: [
    { id: 'm-109', name: 'Rahul Sharma', category: 'Software', company: 'Sharma Devs Studio', initials: 'RS', chapter: 'Alpha Chapter', bniId: '#BNI-1982', bgClass: 'bg-rose-50/50 text-rose-700 border-rose-100/50' },
    { id: 'm-103', name: 'Sanjay Joshi', category: 'Construction', company: 'BuildRight Solutions', initials: 'SJ', chapter: 'Phoenix Chapter', bniId: '#BNI-7731', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' },
    { id: 'm-110', name: 'Vikram Mehta', category: 'Finance', company: 'Prudent Fin Advisors', initials: 'VM', chapter: 'Alpha Chapter', bniId: '#BNI-6610', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' },
    { id: 'm-111', name: 'Ananya Roy', category: 'Healthcare', company: 'HealthFirst Clinics', initials: 'AR', chapter: 'Unity Chapter', bniId: '#BNI-3301', bgClass: 'bg-purple-50/50 text-purple-700 border-purple-100/50' },
    { id: 'm-104', name: 'Deepak Chawla', category: 'Healthcare', company: 'Apex Medical Group', initials: 'DC', chapter: 'Downtown Chapter', bniId: '#BNI-4412', bgClass: 'bg-purple-50/50 text-purple-700 border-purple-100/50' },
    { id: 'm-108', name: 'Priya Singh', category: 'Marketing', company: 'Singh Advertisers Agency', initials: 'PS', chapter: 'Alpha Chapter', bniId: '#BNI-2031', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-107', name: 'Amit Patel', category: 'Retail', company: 'Patel Merchants Ltd', initials: 'AP', chapter: 'Vista Chapter', bniId: '#BNI-5112', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' }
  ],
  5: [
    { id: 'm-101', name: 'Anita Sharma', category: 'Software', company: 'Blue Lotus Architecture', initials: 'AS', chapter: 'Phoenix Chapter', bniId: '#BNI-9921', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-104', name: 'Deepak Chawla', category: 'Healthcare', company: 'Apex Medical Group', initials: 'DC', chapter: 'Downtown Chapter', bniId: '#BNI-4412', bgClass: 'bg-purple-50/50 text-purple-700 border-purple-100/50' },
    { id: 'm-105', name: 'Meera Gupta', category: 'Manufacturing', company: 'Precision Parts Inc', initials: 'MG', chapter: 'Phoenix Chapter', bniId: '#BNI-1029', bgClass: 'bg-rose-50/50 text-rose-700 border-rose-100/50' },
    { id: 'm-109', name: 'Rahul Sharma', category: 'Software', company: 'Sharma Devs Studio', initials: 'RS', chapter: 'Alpha Chapter', bniId: '#BNI-1982', bgClass: 'bg-rose-50/50 text-rose-700 border-rose-100/50' },
    { id: 'm-110', name: 'Vikram Mehta', category: 'Finance', company: 'Prudent Fin Advisors', initials: 'VM', chapter: 'Alpha Chapter', bniId: '#BNI-6610', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' }
  ],
  6: [
    { id: 'm-102', name: 'Rajesh Varma', category: 'Finance', company: 'Varma & Associates', initials: 'RV', chapter: 'South Phoenix', bniId: '#BNI-8842', bgClass: 'bg-amber-50/50 text-amber-700 border-amber-100/50' },
    { id: 'm-103', name: 'Sanjay Joshi', category: 'Construction', company: 'BuildRight Solutions', initials: 'SJ', chapter: 'Phoenix Chapter', bniId: '#BNI-7731', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' },
    { id: 'm-111', name: 'Ananya Roy', category: 'Healthcare', company: 'HealthFirst Clinics', initials: 'AR', chapter: 'Unity Chapter', bniId: '#BNI-3301', bgClass: 'bg-purple-50/50 text-purple-700 border-purple-100/50' },
    { id: 'm-108', name: 'Priya Singh', category: 'Marketing', company: 'Singh Advertisers Agency', initials: 'PS', chapter: 'Alpha Chapter', bniId: '#BNI-2031', bgClass: 'bg-blue-50/50 text-blue-700 border-blue-100/50' },
    { id: 'm-107', name: 'Amit Patel', category: 'Retail', company: 'Patel Merchants Ltd', initials: 'AP', chapter: 'Vista Chapter', bniId: '#BNI-5112', bgClass: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50' }
  ]
};

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

