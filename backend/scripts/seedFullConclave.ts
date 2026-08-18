import { db, collections } from "../src/config/firebase.js";

interface DummyMember {
  uid: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  chapter: string;
  region: string;
}

const REGIONS = [
  "Guntur",
  "Vijayawada",
  "Hyderabad East",
  "Visakhapatnam"
];

const DUMMY_MEMBERS: DummyMember[] = [
  {
    uid: "dummy_user_01",
    name: "Rahul Sharma",
    email: "rahul.sharma@bni-guntur.com",
    phone: "+91 98765 43210",
    company: "Sharma Tech Solutions",
    category: "IT & Software Services",
    chapter: "Titans",
    region: "Guntur"
  },
  {
    uid: "dummy_user_02",
    name: "Priya Verma",
    email: "priya.verma@bni-guntur.com",
    phone: "+91 98765 43211",
    company: "Apex Real Estate & Developers",
    category: "Real Estate & Construction",
    chapter: "Titans",
    region: "Guntur"
  },
  {
    uid: "dummy_user_03",
    name: "Vikram Reddy",
    email: "vikram.reddy@bni-guntur.com",
    phone: "+91 98765 43212",
    company: "Reddy Supply Chain & Logistics",
    category: "Logistics & Freight",
    chapter: "Express",
    region: "Guntur"
  },
  {
    uid: "dummy_user_04",
    name: "Anitha Rao",
    email: "anitha.rao@bni-vijayawada.com",
    phone: "+91 98765 43213",
    company: "Green Leaf Organics",
    category: "Agriculture & Food Processing",
    chapter: "Royals",
    region: "Vijayawada"
  },
  {
    uid: "dummy_user_05",
    name: "Karthik Nair",
    email: "karthik.nair@bni-hyderabad.com",
    phone: "+91 98765 43214",
    company: "Nair Financial & Tax Advisory",
    category: "Financial Services & Tax",
    chapter: "Champions",
    region: "Hyderabad East"
  },
  {
    uid: "dummy_user_06",
    name: "Meena Sundaram",
    email: "meena.sundaram@bni-hyderabad.com",
    phone: "+91 98765 43215",
    company: "Sundaram Architectural Interiors",
    category: "Interior Design & Decor",
    chapter: "Champions",
    region: "Hyderabad East"
  },
  {
    uid: "dummy_user_07",
    name: "Suresh Babu",
    email: "suresh.babu@bni-vizag.com",
    phone: "+91 98765 43216",
    company: "Babu Industrial Contractors",
    category: "Electrical Contracting",
    chapter: "Bay",
    region: "Visakhapatnam"
  },
  {
    uid: "dummy_user_08",
    name: "Divya Menon",
    email: "divya.menon@bni-vizag.com",
    phone: "+91 98765 43217",
    company: "Creative Wave Digital Media",
    category: "Digital Marketing & PR",
    chapter: "Bay",
    region: "Visakhapatnam"
  },
  {
    uid: "dummy_user_09",
    name: "Sravan Kumar",
    email: "sravan.kumar@bni-guntur.com",
    phone: "+91 98765 43218",
    company: "Kumar Healthcare Supplies",
    category: "Medical & Diagnostic Equipment",
    chapter: "Titans",
    region: "Guntur"
  },
  {
    uid: "dummy_user_10",
    name: "Bhanu Prakash",
    email: "bhanu.prakash@bni-guntur.com",
    phone: "+91 98765 43219",
    company: "Prakash Legal Chambers",
    category: "Corporate & Civil Law",
    chapter: "Express",
    region: "Guntur"
  },
  {
    uid: "dummy_user_11",
    name: "Deepa Patel",
    email: "deepa.patel@bni-vijayawada.com",
    phone: "+91 98765 43220",
    company: "Patel Renewable Energy Systems",
    category: "Solar & Green Energy",
    chapter: "Royals",
    region: "Vijayawada"
  },
  {
    uid: "dummy_user_12",
    name: "Rajesh Khanna",
    email: "rajesh.khanna@bni-vijayawada.com",
    phone: "+91 98765 43221",
    company: "Khanna Textiles & Fabrics",
    category: "Garments & Apparel",
    chapter: "Royals",
    region: "Vijayawada"
  },
  {
    uid: "dummy_user_13",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@bni-hyderabad.com",
    phone: "+91 98765 43222",
    company: "Kulkarni Corporate Events",
    category: "Event Management & Hospitality",
    chapter: "Champions",
    region: "Hyderabad East"
  },
  {
    uid: "dummy_user_14",
    name: "Amit Gupta",
    email: "amit.gupta@bni-hyderabad.com",
    phone: "+91 98765 43223",
    company: "Gupta Surveillance Systems",
    category: "CCTV & Security Solutions",
    chapter: "Champions",
    region: "Hyderabad East"
  },
  {
    uid: "dummy_user_15",
    name: "Kavitha Rao",
    email: "kavitha.rao@bni-vizag.com",
    phone: "+91 98765 43224",
    company: "Rao Dental Speciality Clinic",
    category: "Healthcare & Dental Care",
    chapter: "Bay",
    region: "Visakhapatnam"
  },
  {
    uid: "dummy_user_16",
    name: "Harish Varma",
    email: "harish.varma@bni-vizag.com",
    phone: "+91 98765 43225",
    company: "Varma Motors & Sales",
    category: "Automobile Dealership",
    chapter: "Bay",
    region: "Visakhapatnam"
  },
  {
    uid: "dummy_user_17",
    name: "Swathi Naidu",
    email: "swathi.naidu@bni-guntur.com",
    phone: "+91 98765 43226",
    company: "Naidu Agro Foods & Exports",
    category: "Food Processing & Spices",
    chapter: "Titans",
    region: "Guntur"
  },
  {
    uid: "dummy_user_18",
    name: "Venkat Rao",
    email: "venkat.rao@bni-guntur.com",
    phone: "+91 98765 43227",
    company: "Venkateshwara High-Tech Printers",
    category: "Commercial Printing & Packaging",
    chapter: "Express",
    region: "Guntur"
  },
  {
    uid: "dummy_user_19",
    name: "Pooja Hegde",
    email: "pooja.hegde@bni-vijayawada.com",
    phone: "+91 98765 43228",
    company: "Hegde Executive Search & HR",
    category: "Staffing & Recruitment",
    chapter: "Royals",
    region: "Vijayawada"
  },
  {
    uid: "dummy_user_20",
    name: "Tarun Joshi",
    email: "tarun.joshi@bni-hyderabad.com",
    phone: "+91 98765 43229",
    company: "Joshi Structural Consultants",
    category: "Civil & Structural Engineering",
    chapter: "Champions",
    region: "Hyderabad East"
  }
];

const DUMMY_CONCLAVES = [
  {
    id: "conclave_past_2025_01",
    title: "BNI Annual Mega Conclave 2025",
    theme: "Synergy & Exponential Business Growth",
    region: "Guntur",
    location: "Hotel Grand Nagarjuna, Guntur",
    status: "completed",
    date: "2025-11-15T09:00:00.000Z",
    registrationCloseDate: "2025-11-10T23:59:59.000Z",
    isRegistrationOpen: false,
    registrationFee: 1500,
    totalRounds: 4,
    currentRound: 4,
    participantsCount: 20,
    tablesCount: 4,
    coordinator: "Ganesh",
    adminEmail: "ganesh@bni.com",
    createdAt: "2025-10-01T10:00:00.000Z"
  },
  {
    id: "conclave_past_2025_02",
    title: "Guntur Business Leadership Summit 2025",
    theme: "Transformational Leadership & Cross-Chapter Referrals",
    region: "Guntur",
    location: "VIVA Convention Center, Guntur",
    status: "completed",
    date: "2025-12-20T10:00:00.000Z",
    registrationCloseDate: "2025-12-15T23:59:59.000Z",
    isRegistrationOpen: false,
    registrationFee: 2000,
    totalRounds: 4,
    currentRound: 4,
    participantsCount: 20,
    tablesCount: 4,
    coordinator: "Ganesh",
    adminEmail: "ganesh@bni.com",
    createdAt: "2025-11-01T10:00:00.000Z"
  },
  {
    id: "conclave_active_2026_01",
    title: "BNI 121 Speed Networking Conclave 2026",
    theme: "Accelerating 1-on-1 High Value Connections",
    region: "Guntur",
    location: "Royal Convention Hall, Guntur",
    status: "active",
    date: "2026-08-17T09:00:00.000Z",
    registrationCloseDate: "2026-08-16T23:59:59.000Z",
    isRegistrationOpen: true,
    registrationFee: 1200,
    totalRounds: 4,
    currentRound: 1,
    currentRoundStartedAt: new Date().toISOString(),
    participantsCount: 20,
    tablesCount: 4,
    coordinator: "Ganesh",
    adminEmail: "ganesh@bni.com",
    createdAt: "2026-08-01T10:00:00.000Z"
  },
  {
    id: "conclave_upcoming_2026_01",
    title: "BNI Q3 Regional Business Conclave 2026",
    theme: "Scaling Enterprises & Strategic Joint Ventures",
    region: "Guntur",
    location: "The Gateway Hotel, Vijayawada Road, Guntur",
    status: "upcoming",
    date: "2026-09-25T09:30:00.000Z",
    registrationCloseDate: "2026-09-20T23:59:59.000Z",
    isRegistrationOpen: true,
    registrationFee: 1800,
    totalRounds: 4,
    currentRound: 0,
    participantsCount: 20,
    tablesCount: 4,
    coordinator: "Ganesh",
    adminEmail: "ganesh@bni.com",
    createdAt: "2026-08-10T10:00:00.000Z"
  },
  {
    id: "conclave_upcoming_2026_02",
    title: "BNI AP State Business Summit 2026",
    theme: "Connecting Leaders Across Andhra Pradesh",
    region: "Vijayawada",
    location: "Novotel Varun Beach, Vijayawada",
    status: "upcoming",
    date: "2026-11-10T10:00:00.000Z",
    registrationCloseDate: "2026-11-05T23:59:59.000Z",
    isRegistrationOpen: true,
    registrationFee: 2500,
    totalRounds: 5,
    currentRound: 0,
    participantsCount: 20,
    tablesCount: 4,
    coordinator: "eb@gmail.com",
    adminEmail: "eb@gmail.com",
    createdAt: "2026-08-12T10:00:00.000Z"
  }
];

async function seedData() {
  console.log("🌱 Seeding 20 members with clean chapter names for ganesh@bni.com and eb@gmail.com...");

  // Batch 1: Admin setup & Users
  const batch1 = db.batch();

  const adminQuery = await db.collection(collections.admins).where("email", "==", "ganesh@bni.com").limit(1).get();
  if (!adminQuery.empty) {
    batch1.set(adminQuery.docs[0].ref, { email: "ganesh@bni.com", region: "Guntur", role: "admin" }, { merge: true });
  } else {
    batch1.set(db.collection(collections.admins).doc("admin_ganesh_01"), {
      uid: "admin_ganesh_01",
      name: "Ganesh",
      email: "ganesh@bni.com",
      mobile: "+91 98765 00002",
      role: "admin",
      region: "Guntur",
      grantedAt: new Date().toISOString()
    }, { merge: true });
  }

  const ebAdminQuery = await db.collection(collections.admins).where("email", "==", "eb@gmail.com").limit(1).get();
  if (!ebAdminQuery.empty) {
    batch1.set(ebAdminQuery.docs[0].ref, { email: "eb@gmail.com", region: "Vijayawada", role: "admin" }, { merge: true });
  } else {
    batch1.set(db.collection(collections.admins).doc("admin_eb_01"), {
      uid: "admin_eb_01",
      name: "eb@gmail.com",
      email: "eb@gmail.com",
      mobile: "+91 98765 00009",
      role: "admin",
      region: "Vijayawada",
      grantedAt: new Date().toISOString()
    }, { merge: true });
  }

  for (const m of DUMMY_MEMBERS) {
    batch1.set(db.collection(collections.users).doc(m.uid), {
      uid: m.uid,
      name: m.name,
      email: m.email,
      phone: m.phone,
      mobile: m.phone,
      company: m.company,
      businessName: m.company,
      category: m.category,
      businessCategory: m.category,
      chapter: m.chapter,
      region: m.region,
      role: "member",
      isCaptain: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  await batch1.commit();
  console.log(`✅ Seeded admin ganesh@bni.com and 20 members with clean chapter names.`);

  // Batch 2: Conclaves & Registrations
  for (const c of DUMMY_CONCLAVES) {
    const cBatch = db.batch();
    cBatch.set(db.collection(collections.conclaves).doc(c.id), c, { merge: true });

    for (let i = 0; i < DUMMY_MEMBERS.length; i++) {
      const m = DUMMY_MEMBERS[i];
      const tableNumber = (i % 4) + 1;
      const regRef = db.collection(collections.conclaves).doc(c.id).collection(collections.registrations).doc(m.uid);
      cBatch.set(regRef, {
        userId: m.uid,
        uid: m.uid,
        name: m.name,
        email: m.email,
        phone: m.phone,
        company: m.company,
        businessName: m.company,
        category: m.category,
        businessCategory: m.category,
        chapter: m.chapter,
        role: "member",
        isCaptain: false,
        isTableCaptain: false,
        tableNumber: tableNumber,
        registeredAt: new Date().toISOString(),
        paymentStatus: 'paid',
        amountPaid: c.registrationFee
      }, { merge: true });
    }
    await cBatch.commit();
  }
  console.log(`✅ Seeded ${DUMMY_CONCLAVES.length} conclaves with clean chapter registrations.`);

  console.log("🎉 All dummy data updated successfully!");
  console.log("------------------------------------------------");
  console.log("Summary:");
  console.log(`- Admin Email: ganesh@bni.com (Region: Guntur Central)`);
  console.log(`- Regions (${REGIONS.length}): ${REGIONS.join(', ')}`);
  console.log(`- Members: 20 members (Clean chapters: Titans, Express, Royals, Champions, Bay)`);
  console.log("------------------------------------------------");
}

seedData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error seeding dummy data:", err);
    process.exit(1);
  });
