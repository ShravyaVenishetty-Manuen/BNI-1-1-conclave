# BNI 1-to-1 Conclave Management System — Complete Platform Documentation

> **System Blueprint & Operating Manual**  
> *Covering Super Admin, Regional Admin, Table Captain, and Member Portals, Data Workflows, API Interfaces, and Page Specifications.*

---

## Table of Contents
1. [Platform Architecture & Engine Overview](#1-platform-architecture--engine-overview)
2. [Super Admin Portal](#2-super-admin-portal)
   - [2.1 Global Dashboard](#21-global-dashboard)
   - [2.2 Regional Admins Management](#22-regional-admins-management)
   - [2.3 Global Conclaves Directory](#23-global-conclaves-directory)
   - [2.4 System Settings & Audit Logs](#24-system-settings--audit-logs)
3. [Regional Admin Portal](#3-regional-admin-portal)
   - [3.1 Regional Executive Dashboard](#31-regional-executive-dashboard)
   - [3.2 Conclaves Management](#32-conclaves-management)
   - [3.3 Schedule Generator](#33-schedule-generator)
   - [3.4 Schedule Review & Manual Editor](#34-schedule-review--manual-editor)
   - [3.5 Round Runner Command Center](#35-round-runner-command-center)
   - [3.6 Members Directory & Roster](#36-members-directory--roster)
   - [3.7 Captains Management](#37-captains-management)
   - [3.8 Business Types & Conflict Dictionary](#38-business-types--conflict-dictionary)
   - [3.9 Active Users Tracker](#39-active-users-tracker)
   - [3.10 Reports & Advanced Analytics](#310-reports--advanced-analytics)
   - [3.11 Admin Profile & Settings](#311-admin-profile--settings)
4. [Table Captain Portal](#4-table-captain-portal)
   - [4.1 Captain Table Dashboard](#41-captain-table-dashboard)
   - [4.2 Current Round Table View](#42-current-round-table-view)
   - [4.3 Multi-Round Table Schedule](#43-multi-round-table-schedule)
5. [Member Portal](#5-member-portal)
   - [5.1 Member Home Dashboard](#51-member-home-dashboard)
   - [5.2 Current Round Table Map](#52-current-round-table-map)
   - [5.3 Referral Exchange Hub](#53-referral-exchange-hub)
   - [5.4 Personal Seating Itinerary](#54-personal-seating-itinerary)
   - [5.5 Member Profile](#55-member-profile)
6. [Backend Core API & Synchronization Engine](#6-backend-core-api--synchronization-engine)

---

## 1. Platform Architecture & Engine Overview

The **BNI 1-to-1 Conclave System** automates high-density networking events for BNI chapters. During a conclave event, 50 to 200+ members rotate across 4 to 8 timed seating rounds. 

### **Core Problem Solved**
Manual table seating produces business category conflicts (e.g. two real estate agents at the same table) and repeat member pairings. The BNI Conclave Matching Engine solves this by computing optimized seating matrices with zero category conflicts, maximum unique pairings, and auto-assigned Table Captain anchors.

### **Technology Stack**
- **Frontend Framework**: React 18, Vite, Tailwind CSS, Recharts, Canvas-Confetti, Lucide Icons.
- **Backend Runtime**: Node.js, Express.js, TypeScript.
- **Database & Auth**: Google Cloud Firestore, Firebase Authentication, Firebase Admin SDK.
- **Sync Protocol**: Multi-client sync API (`POST /api/conclaves/:id/sync`) with dual-verification attendance merge and real-time referral slip logging.

---

## 2. Super Admin Portal

### **2.1 Global Dashboard**
- **Navigation Path**: `/superadmin/dashboard`
- **Primary Purpose**: Provides top-level executive visibility across all regional BNI nodes and global server health.
- **Detailed Page Breakdown**:
  - **Header Bar**: Displays global system status indicator ("All Systems Operational") and quick multi-region switcher.
  - **Global KPI Cards**:
    - *Active Regions*: Total regional administrative nodes (e.g., Guntur, Vijayawada, Visakhapatnam).
    - *Total Conclaves*: Cumulative conclaves generated across all regions.
    - *Regional Admins*: Total active admin coordinator accounts.
    - *System Uptime*: Real-time database cluster availability metric (99.9%).
  - **Cross-Regional Conclaves Overview Table**: Multi-column table listing Conclave Name, Region, Assigned Coordinator, Member Count, Table Count, and Lifecycle Status.
- **Backend API Integration**: Calls `GET /api/admin/conclaves` and `GET /api/admin/regions`.

---

### **2.2 Regional Admins Management**
- **Navigation Path**: `/superadmin/admins`
- **Primary Purpose**: Create, configure, and manage Regional Administrator accounts.
- **Detailed Page Breakdown**:
  - **Admin Directory Table**: Displays Administrator Name, Email Address, Mobile Number, Assigned Scope/Region, Account ID (`ADM-XXXXXX`), and Status (`Active` / `Suspended`).
  - **Create Regional Admin Modal**: Form collecting Admin Name, Email, Temporary Password, Mobile (+91 format), and Region.
  - **Direct Firebase Auth Integration**: On submission, the backend executes `auth.createUser()`, creating the Firebase Authentication account (`emailVerified: true`) and setting the Firestore document in `admins/{uid}`.
  - **Action Buttons**: Instant account suspension toggle, password reset link dispatcher, and region re-assignment.
- **Backend API Integration**: Calls `POST /api/admin/coordinators`, `PATCH /api/admin/coordinators/:uid`.

---

### **2.3 Global Conclaves Directory**
- **Navigation Path**: `/superadmin/conclaves`
- **Primary Purpose**: Master registry of all conclaves created across all chapters and regions.
- **Detailed Page Breakdown**:
  - **Regional Filter Tabs**: Filter conclaves by region or status (`Draft`, `Registration Open`, `Running`, `Completed`, `Cancelled`).
  - **Emergency Override Action Menu**: Super admin override options to force-start, force-complete, or cancel any stuck conclave.
  - **Export Center**: Export master conclave logs, seating matrices, and referral exchange statistics to CSV or JSON formats.
- **Backend API Integration**: Calls `GET /api/admin/conclaves`, `POST /api/admin/conclaves/:id/cancel`.

---

### **2.4 System Settings & Audit Logs**
- **Navigation Path**: `/superadmin/settings`
- **Primary Purpose**: Monitor platform security, database backup pings, and administrator audit trails.
- **Detailed Page Breakdown**:
  - **Security Audit Logs Table**: Chronological table displaying Event Title, Action Description, Timestamp, IP Address, and Status Badge.
  - **Backup & Health Status Card**: Displays automated Cloud Firestore backup timestamps, storage quota, and active SSL cipher status (`AES-256 Active`).
- **Backend API Integration**: Calls `GET /api/me`.

---

## 3. Regional Admin Portal

### **3.1 Regional Executive Dashboard**
- **Navigation Path**: `/admin/dashboard`
- **Primary Purpose**: Command hub for managing active regional conclave operations.
- **Detailed Page Breakdown**:
  - **Conclave Selector Header**: Switch between active regional conclaves.
  - **KPI Overview Cards**: Total Members (`61`), Active Captains (`11`), Total Referrals Exchanged, Coordinator Name.
  - **Active Session Banner**: Highlighted card when a conclave is in `Running` status, providing 1-click access to Round Runner.
  - **Quick Action Launcher**: Buttons to open Schedule Generator, Schedule Review, Members Roster, or Conclave Settings.
  - **Recent Activity Feed**: Real-time log showing round transitions and timestamped system events.
- **Backend API Integration**: Calls `GET /api/admin/conclaves`, `GET /api/admin/conclaves/:id/stats`.

---

### **3.2 Conclaves Management**
- **Navigation Path**: `/admin/conclaves`
- **Primary Purpose**: Setup, configure, and transition conclaves through their lifecycle stages.
- **Detailed Page Breakdown**:
  - **Conclaves Data Table**: Displays Conclave ID, Name, Region, Coordinator Avatar & Name, Date Schedule, Venue, Registered Members Count, Captains Count, and Status (`Draft`, `Upcoming`, `Running`, `Completed`).
  - **Create Conclave Modal**: Setup form collecting:
    - *Conclave Name & Region*
    - *Date, Start Time & End Time*
    - *Venue Name & Address*
    - *Persons per Table*: Clamped between 2 and 8 (default: 7/8).
    - *Round Count*: Number of seating rounds (4 to 8).
  - **Status Lifecycle Actions**: Buttons to open registration, close registration, start event, or mark event completed.
- **Backend API Integration**: Calls `GET /api/admin/conclaves`, `POST /api/admin/conclaves`, `PATCH /api/admin/conclaves/:id`.

---

### **3.3 Schedule Generator**
- **Navigation Path**: `/admin/schedule-gen`
- **Primary Purpose**: Execute the automated constraint matching engine to produce optimized seating schedules.
- **Detailed Page Breakdown**:
  - **Seating Analytics Banner**: Displays calculated seating parameters: Total Members, Total Tables, Persons per Table, and Seating Density.
  - **Rule Engine Checklist**:
    - 🟢 *Business Category Isolation*: Enforces zero category overlaps per table.
    - 🟢 *Unique Pairing Maximizer*: Minimizes repeat member encounters across rounds.
    - 🟢 *Table Captain Anchoring*: Ensures every table has an assigned Captain in every round.
  - **Generate Schedule Button**: Triggers the matching algorithm and saves the seating layout to Firestore (`conclaves/{id}.schedule`).
- **Backend API Integration**: Calls `POST /api/admin/conclaves/:id/generate-schedule`.

---

### **3.4 Schedule Review & Manual Editor**
- **Navigation Path**: `/admin/schedule-review`
- **Primary Purpose**: Inspect, validate, and manually edit computed seating grids before going live.
- **Detailed Page Breakdown**:
  - **Round Selector Tabs**: Switch view between Round 1, Round 2, ..., Round N.
  - **Table Seating Grid**: Interactive grid displaying Table 1 through Table N. Each table card lists the Captain name and assigned Member names with business category badges.
  - **Conflict Detection Alerts**: Highlights any category overlaps or repeat pairings with yellow/red warning borders.
  - **Manual Member Swap Modal**: Select two members from any tables to swap positions manually.
  - **Auto-Fix Engine Button**: One-click re-balancer to automatically resolve remaining warning flags.
- **Backend API Integration**: Calls `GET /api/admin/conclaves/:id`, `PATCH /api/admin/conclaves/:id`.

---

### **3.5 Round Runner Command Center**
- **Navigation Path**: `/admin/round-runner`
- **Primary Purpose**: Live event orchestration during the conclave.
- **Detailed Page Breakdown**:
  - **Global Stage Header**: Displays Current Round (e.g., `Round 2 of 4`), Round Status (`Running`), and Global Event Completion (%).
  - **Control Action Bar**:
    - *Start Round X Button*: Advances event to the next round and broadcasts rosters.
    - *Timer Controls*: Play, Pause, and Reset round countdown timer.
  - **Seating Countdown Timer**: Prominent 12:45 / 15:00 visual timer synchronized across client apps.
  - **Live Activity Feed**: Real-time activity log built 100% strictly from database events (`Referral Logged`, `Round Active`).
  - **Top 3 Referrals Leaderboard**: Live ranking of top referral givers during the event.
  - **Referrals & Attendance Tracker**:
    - *Referrals Analytics*: Breakdown of Connected, Pending, and Closed referral slips.
    - *Live Attendance Monitor*: Real-time polling (every 5s) showing member check-ins and captain table submissions.
- **Backend API Integration**: Calls `POST /api/admin/conclaves/:id/start-round`, `GET /api/admin/conclaves/:id/referrals`, `GET /api/admin/conclaves/:id/attendance`.

---

### **3.6 Members Directory & Roster**
- **Navigation Path**: `/admin/members`
- **Primary Purpose**: Master registry of all registered members for the conclave.
- **Detailed Page Breakdown**:
  - **Search & Filter Bar**: Search by member name, company, business category, or chapter.
  - **Members Table**: Displays Member Avatar, Name, Email, Phone, Company, Category, Chapter, Role (`Member` / `Captain`), and Status (`Active` / `Inactive`).
  - **Role Assign Modal**: Promote members to Table Captain or revert to regular member.
- **Backend API Integration**: Calls `GET /api/admin/conclaves/:id/registrations`, `POST /api/admin/conclaves/:id/registrations/:uid/role`.

---

### **3.7 Captains Management**
- **Navigation Path**: `/admin/captains`
- **Primary Purpose**: Manage assigned Table Captains and review table duty allocations.
- **Detailed Page Breakdown**:
  - **Captains Overview Cards**: Total Captains (`11`), Assigned Captains (`11`), Available Captains (`0`).
  - **Captains Roster Table**: Displays Captain Name, Business Category, Chapter, Assigned Table Number per round, and Contact Phone.
- **Backend API Integration**: Calls `GET /api/admin/conclaves/:id/registrations`.

---

### **3.8 Business Types & Conflict Dictionary**
- **Navigation Path**: `/admin/business-types`
- **Primary Purpose**: Manage business categories for conflict detection.
- **Detailed Page Breakdown**:
  - **Dynamic Category Extractor**: Automatically lists all unique business categories present in active member registrations (e.g. Computer Services, Dentist, Restaurant, Bakery, Mutual Funds Advisor).
  - **Category Cards Grid**: Displays Category ID (`BT-001`), Category Name, Description, Active Status, and Member Count per category.
- **Backend API Integration**: Calls `GET /api/admin/conclaves/:id/registrations`.

---

### **3.9 Active Users Tracker**
- **Navigation Path**: `/admin/active-users`
- **Primary Purpose**: Monitor real-time device pings and online member presence.
- **Detailed Page Breakdown**:
  - **Live Online/Offline Status Cards**: Green pulse indicators for members currently active on their mobile apps.
  - **Last Ping Timestamp**: Displays exact time of last `/api/conclaves/:id/sync` call.

---

### 3.10 Reports & Advanced Analytics
- **Navigation Path**: `/admin/reports`
- **Primary Purpose**: Post-event and live analytical reporting for chapter leadership.
- **Detailed Page Breakdown**:
  - **Dynamic Filter Bar**: Conclave Selector, Business Category filter, Captains filter, and Round filter (derived dynamically from backend data).
  - **KPI Executive Cards**:
    - *Checked-In Ratio (%)*: $\frac{\text{Active}}{\text{Registered}} \times 100\%$
    - *Absent Members Count*: Total registered minus active check-ins.
    - *Total Referrals Logged*: Cumulative referral lead slips.
    - *Avg Referrals per Attendee*: Direct business productivity ratio.
    - *Seated Captains*: Total table captains on duty.
  - **Recharts Data Visualizations**:
    - *Participation Bar Chart*: Round-by-round member vs. captain table seating counts.
    - *Business Diversity Donut Chart*: Proportional distribution of business categories.
  - **Print & Export Tools**: PDF print preview and CSV data exporter.
- **Backend API Integration**: Calls `GET /api/admin/conclaves`, `GET /api/admin/conclaves/:id/stats`.

---

### **3.11 Admin Profile & Settings**
- **Navigation Path**: `/admin/profile`
- **Primary Purpose**: Manage Regional Admin credentials, contact details, and account settings.
- **Detailed Page Breakdown**:
  - **Authenticated Admin Hero Card**: Displays Display Name, Email, Designation, Organization, Region, Admin ID (`ADM-XXXXXX`), and Account Created Date fetched live from `GET /api/me`.
  - **Edit Profile Modal**: Editable form updating admin name, phone, designation, and region directly in Firestore (`PUT /api/me`).
  - **Live System KPIs**: Conclaves Coordinated (`6`), Active Captains (`11`), Table Assignments.
- **Backend API Integration**: Calls `GET /api/me`, `PUT /api/me`.

---

## 4. Table Captain Portal

### **4.1 Captain Table Dashboard**
- **Navigation Path**: `/captain/dashboard`
- **Primary Purpose**: Live table management hub for the active round.
- **Detailed Page Breakdown**:
  - **Current Table Header**: Displays assigned Table Number (e.g. Table 4) and active Round Number.
  - **Member Roster Checklist**: Lists all members seated at the captain's table.
  - **Interactive Attendance Toggles**: Clickable **Present** 🟢 or **Absent** 🔴 toggle buttons for each seated member.
  - **Submit & Lock Attendance Button**: Submits table attendance array to `POST /api/conclaves/:id/sync`, saving to Firestore `conclaves/{id}/attendance`.
  - **Presentation Countdown Timer**: 1.5-minute timer per speaker to manage table presentation order.
- **Backend API Integration**: Calls `POST /api/conclaves/:id/sync`.

---

### **4.2 Current Round Table View**
- **Navigation Path**: `/captain/table`
- **Primary Purpose**: In-depth view of member business cards at the captain's table.
- **Detailed Page Breakdown**:
  - **Member Business Profile Cards**: View member company name, business category, chapter, email, and phone.
  - **Quick Refer Button**: Opens pre-filled Referral Modal to log a lead slip for any table member.

---

### **4.3 Multi-Round Table Schedule**
- **Navigation Path**: `/captain/schedule`
- **Primary Purpose**: View captain's full itinerary across all rounds.
- **Detailed Page Breakdown**:
  - **Multi-Round Route Grid**: Displays assigned table numbers for Rounds 1 through N.
  - **Roster Previews**: Inspect occupant rosters for upcoming rounds.

---

## 5. Member Portal

### **5.1 Member Home Dashboard**
- **Navigation Path**: `/member/dashboard`
- **Primary Purpose**: Main member home screen during the conclave.
- **Detailed Page Breakdown**:
  - **Current Active Table Card**: Displays active Round Number, assigned Table Number (e.g. Table 4), Table Captain name, and time remaining.
  - **Mark My Attendance Button**: Self check-in button sending presence record (`isPresent: true`) directly to `POST /api/conclaves/:id/sync`.
  - **Table Occupants List**: Searchable list of members seated at the table with business category badges.
  - **Referral Slips Summary**: Counts of referrals sent and received.
  - **Presentation Timer**: Synced round countdown timer.
- **Backend API Integration**: Calls `POST /api/conclaves/:id/sync`, `GET /api/me`.

---

### **5.2 Current Round Table Map**
- **Navigation Path**: `/member/current-round`
- **Primary Purpose**: Interactive seating map for the active round.
- **Detailed Page Breakdown**:
  - **Table Seating Circle**: Visual seat layout showing member positions around the table.
  - **Member Card Modal Trigger**: Click any seat to view full business details or send a referral slip.

---

### **5.3 Referral Exchange Hub**
- **Navigation Path**: `/member/referrals`
- **Primary Purpose**: Manage and track business referral lead slips.
- **Detailed Page Breakdown**:
  - **Sent & Received Sub-Tabs**: Switch between referrals given and received.
  - **Interactive Lifecycle Status Controls**:
    - Recipient sees **Mark Connected** button to transition status from `Pending` 🟡 $\rightarrow$ `Connected` 🔵.
    - Recipient sees **Mark Closed (TYFCB)** button to transition status from `Connected` 🔵 $\rightarrow$ `Closed` 🟢.
    - Status updates sync live to local state and Firestore via `POST /api/conclaves/:id/sync`.
  - **Send Referral Slip Modal**: Form to select recipient member, select referral type (Inside / Outside), enter description notes, and submit.
- **Backend API Integration**: Calls `POST /api/conclaves/:id/sync`, `GET /api/admin/conclaves/:id/referrals`.

---

### **5.4 Personal Seating Itinerary**
- **Navigation Path**: `/member/my-schedule`
- **Primary Purpose**: Personal table itinerary across all rounds.
- **Detailed Page Breakdown**:
  - **Round-by-Round Timeline**: Displays assigned Table Number, Round Start Time, and Table Captain Name for Rounds 1 through N.
  - **Round Status Badges**: Shows `Completed`, `Active`, or `Upcoming`.

---

### **5.5 Member Profile**
- **Navigation Path**: `/member/profile`
- **Primary Purpose**: View and edit member business profile.
- **Detailed Page Breakdown**:
  - **Profile Form**: Member Name, Company Name, Business Category, Chapter, Mobile, Email, Address.
  - **Save Profile**: Updates user document in Firestore.

---

## 6. Backend Core API & Synchronization Engine

### **Master REST API Directory**

| Route Endpoint | HTTP Method | Auth Guard | Description |
| :--- | :---: | :---: | :--- |
| `/api/me` | `GET / PUT` | Authenticated User | Fetch or update authenticated user profile. |
| `/api/admin/conclaves` | `GET / POST` | Admin | List all conclaves or create a new conclave. |
| `/api/admin/conclaves/:id` | `GET / PATCH` | Admin | Fetch single conclave details or update properties. |
| `/api/admin/conclaves/:id/generate-schedule` | `POST` | Admin | Execute automated constraint matching algorithm. |
| `/api/admin/conclaves/:id/start-round` | `POST` | Admin | Advance conclave to active round number. |
| `/api/admin/conclaves/:id/referrals` | `GET` | Admin | Fetch all referral slips exchanged in conclave. |
| `/api/admin/conclaves/:id/attendance` | `GET` | Admin | Fetch live attendance check-ins per round/table. |
| `/api/conclaves/:id/sync` | `POST` | Authenticated User | Dual-sync endpoint for mobile attendance & referrals. |
| `/api/admin/coordinators` | `POST` | Superadmin | Provision regional admin in Firebase Auth & Firestore. |

---

### **Attendance Merge & Priority Logic**
```
Captain Table Mark (Highest Priority) ──► Overrides Self-Mark ──► Saves to Firestore
Member Self-Mark (Fallback Priority)  ──► Used if Captain Misses ─► Saves to Firestore
```

### **Referral Lifecycle Pipeline**
```
[Pending] (Lead Shared) ──► [Connected] (Contact Established) ──► [Closed] (TYFCB Business Realized)
```

---
*Documentation compiled and verified against production codebase.*
