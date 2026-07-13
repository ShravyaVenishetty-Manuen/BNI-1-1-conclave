# BNI 1-to-1 Conclave Portal

A premium, interactive web portal designed for BNI members and table captains to manage structured 1-to-1 networking rounds, wayfinding, and conclave schedules in real time.

---

## 🚀 Key Portals & Features

### 👤 Member Portal
*   **Live Dashboard**: Real-time round clock timers, wayfinding table indicators, and a clean list of table connection members.
*   **Structured Schedule**: Interactive progress timeline showing current and upcoming table assignments, niches, and seat-mates.
*   **Active Round Guidelines**: Interactive step-by-step agenda guides for the active seating session, keeping elevator pitches timed and matched.
*   **Conclave History**: A comprehensive, filterable archive of past event attendances, connection summary metrics, timeline details drawer, and attendance certificate downloads.
*   **Profile Preferences**: Editable personal details, custom language/time selects, real-time activity tracking feed, and notification preferences.

### 👑 Captain Portal
*   **Station Dashboard**: Complete oversight of assigned tables, attendee counts, active check-in controls, and automated log feeds.
*   **Live Seating Board**: Interactive tabbed view of attendee check-ins across multiple rounds with full filtering, category coloring, and validation markers.
*   **Current Speaker Queue**: Interactive speech order queue with active timers to manage individual 30-second elevator pitches during active rounds.
*   **Event Timeline**: Full conclave session timeline tracking.

### ⚙️ Admin Portal
*   **Enterprise Dashboard**: 
    *   Provides quick metrics overview (Total Members, Active Capacity, Leadership/Table Captains, Conclave pipeline status).
    *   Features quick-management action links (Add Member, Create Conclave, Run Validation, Generate Schedule, View Reports).
    *   Presents active conclave progress updates (Round Progress status, Active tables grid, Venue location wayfinding details).
    *   Renders visual analytics (Attendance distributions, Check-in status chart reports).
*   **Member Database Management**:
    *   Supports paginated lists, direct keyword search, chapter filter widgets, and classification category dropdowns.
    *   Includes forms to register new members or update existing member properties.
*   **Active Users List**:
    *   Monitors real-time attendee logins, web browser session status, device types, and active seating allocations.
*   **Business Categories & Collisions Manager**:
    *   Tracks all networking niches and groups categories into collision matrices to ensure diverse distributions at table pairings.
*   **Table Captains Coordinator**:
    *   Assigns table captains to seating stations and tracks check-in responsiveness.
*   **Conclaves Configuration Hub**:
    *   Sets up new conclave details (Name, Venue, Date, assigned table capacity counts) and tracks event status history.
*   **Live Seating Snapshots**:
    *   Renders a round-by-round interactive layout representation of all tables and assigned seat placements.
*   **Rules Verification Suite (Validation)**:
    *   Runs rule checks against generated schedule sheets to flags conflicts:
        *   **Pairing Repeat Collision**: Flags members paired together multiple times.
        *   **Niche Conflict**: Flags identical industry categories seated at the same table.
        *   **Chapter Collision**: Flags members from the same BNI Chapter placed at the same table.
*   **Schedule Generation Engine (Schedule Gen & Schedule Review)**:
    *   Controls the automated matchmaking algorithm parameters (Rounds count, collision weights) and enables manual seat adjustments before publishing the timeline.
*   **Conclave State Lock & Round Runner**:
    *   Triggers round countdown clock starts, pauses timers, locks seating spreadsheets, and broadcasts real-time alerts.
*   **Reports & Analytics Center**:
    *   Compiles and exports comprehensive conclave reports (pair matrices, attendance history sheets, member interaction logs).

---

## 🛠️ Architecture & Tech Stack
*   **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) for quick reloading and clean components.
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) with a custom design system tailored for BNI branding guidelines.
*   **Icons**: [Lucide React](https://lucide.dev/) for clean outline icon vectors.
*   **Data Separation**: All mock data is decoupled from component files and centralized in [mockConclaveData.js](file:///c:/Users/DELL/OneDrive - MANUEN INFOTECH (OPC) PRIVATE LIMITED/Projects/BNI-1-1-conclave/src/data/mockConclaveData.js) for clean code maintenance.

---

## 💻 Getting Started

### Prerequisites
*   Node.js (v16.x or later recommended)
*   npm

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Build production distribution files:
   ```bash
   npm run build
   ```