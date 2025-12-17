# **AI Dev Peru Manager \- Product Specifications & Design Guidelines**

## **Part 1: Product Specifications (User Stories)**

### **1\. Dashboard & Navigation**

* **As an Organizer**, I want a **persistent top navigation bar** so I can easily switch between modules (Events, Speakers, Marketing, Analytics) without losing context.  
* **As an Organizer**, I want to see a **visual grid of my events** on the dashboard, displaying key metadata (Date, Title, Status, Format) at a glance.  
* **As an Organizer**, I want to **filter events by Year** and **Status** (In Progress vs. Done) using dropdown menus to focus on relevant meetups.  
* **As an Organizer**, I want to see **visual indicators** on event cards for key resources (Luma, YouTube) so I know what is already configured.

### **2\. Event Creation & Management**

* **As an Organizer**, I want to **create a new event** via a modal that pre-fills the current date and a default time (19:00), so I can quickly start planning.  
* **As an Organizer**, I want to define the **Event Format** (In-Person, Remote, or Hybrid) to better categorize my meetups.  
* **As an Organizer**, I want a centralized **"Important Links"** section to manage URLs for Registration (Luma), Streaming (YouTube, StreamYard), Assets (Drive), Location (Maps), and Community (WhatsApp).  
* **As an Organizer**, I want to **delete an event** permanently if it was created by mistake or cancelled.

### **3\. Agenda & Content**

* **As an Organizer**, I want to **add talks** to an event's agenda and edit their titles inline.  
* **As an Organizer**, I want to **assign speakers** to a talk by searching the existing directory or **creating a new speaker on the fly** directly from the agenda input field.  
* **As an Organizer**, I must attach a **Slides URL** to every talk before I can mark the event as "Done," ensuring all assets are captured.

### **4\. Checklists & Readiness**

* **As an Organizer**, I want an **"Event Readiness" checklist** that automatically checks itself off when I complete system fields (e.g., adding a description or setting a date), so I know what core data is missing.  
* **As an Organizer**, I want to create **custom checklist items** for logistics and promotion.  
* **As an Organizer**, I want to **edit task text inline** and mark items as complete using a checkbox, keeping the workflow fluid without popups.

### **5\. Speaker Management**

* **As an Organizer**, I want a dedicated **Speakers Directory** to browse all community experts.  
* **As an Organizer**, I want to view a **Speaker's Detail Page** that shows their profile, contact info (Email, Phone, Twitter), and a history of all events they have participated in.  
* **As an Organizer**, I want to **edit speaker details** in a full-page view to keep their information up to date.

### **6\. The "Definition of Done"**

* **As an Organizer**, I want to click **"Mark as Done"** to close an event.  
* **As a System**, I want to **validate** that the event has a Date, Description, non-empty Agenda, and Slide Links for all talks before allowing it to be marked "Done."  
* **As an Organizer**, I want to input the final **Attendee Count** upon completion for historical tracking.

## **Part 2: Design Guidelines (Luma-Inspired)**

### **1\. Visual Identity**

* **Theme:** **Deep Zinc Dark Mode**. The application relies on bg-zinc-950 as the primary background, with zinc-900 for cards and zinc-100 for primary text.  
* **Accent:** A very subtle **Radial Gradient** (from-indigo-500/10) at the top of the page adds depth and brand alignment without overwhelming the content.  
* **Typography:** Clean Sans-serif (Inter-style).  
  * **Headers:** White, Bold/Semi-bold, Tracking-tight.  
  * **Metadata:** Zinc-500, Uppercase, Small text, Tracking-wider.

### **2\. Layout Patterns**

* **Navigation:**  
  * **Global:** Sticky top bar with backdrop-blur-md and a subtle bottom border (border-white/10).  
  * **Contextual:** Secondary tab strips (Details, Agenda, etc.) used within workspaces to separate concerns.  
* **Cards:**  
  * **Structure:** Distinct "Date Block" on the left (Month/Day stack) \+ Content on the right.  
  * **Interaction:** Subtle border lighten on hover (hover:border-zinc-700). No heavy shadow lifts.  
* **Forms:**  
  * Inputs use bg-black/50 with border-zinc-800.  
  * Focus states use ring-zinc-600.  
  * Icons are placed inside inputs (left-aligned) for clearer context (e.g., Calendar icon for Date).

### **3\. Component Library**

* **Badges:** Outlined, pill-shaped badges.  
  * *In Progress:* Blue text/border.  
  * *Done:* Emerald text/border.  
* **Buttons:**  
  * *Primary:* White background, Black text.  
  * *Secondary:* Zinc-900 background, White text, Border.  
  * *Ghost:* Transparent, Gray text.  
* **Modals:**  
  * Centered, backdrop-blur-sm overlay.  
  * bg-zinc-950 with distinct border-zinc-800.  
  * Zoom-in animation on open.