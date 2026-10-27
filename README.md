# Bobby Esarapu — Premium Game Developer Portfolio

A cinematic, production-ready portfolio and content management system engineered for **Bobby Esarapu**, Unity Game Developer and member of **Redundant Studios**. Built with React, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

---

## 🎮 Highlights & Features

- **Cinematic Game-Dev UI/UX**: Deep charcoal aesthetic (`#0a0d0f`), restrained neon-lime accents, subtle ambient coordinate network, and editorial typography.
- **Published Games Showcase**: Detailed project cards with category filters, interactive modals, YouTube/gameplay trailer embeds, and direct store links for:
  - **DEADZONE** (Top-Down Zombie Survival Shooter on Google Play)
  - **SURVIVAL ISLAND** (3D Mobile Survival Shooter on Itch.io)
  - **ENDLESS RUNNER GAME** (Object Pooling & Procedural Spawning)
  - **BADRI DRIVING** (Physics Vehicle Prototype)
  - **CUSTOM-BUILT VILLAGE** (3D Environment & Lighting Design)
- **Technical Competency Matrix**: Engine systems, C#, C, Python, web fundamentals, tools (Visual Studio, Git, Figma), and core OOP/profiling concepts.
- **Authentic Experience & Education**: Redundant Studios (Game Developer), AllReal Labs (Intern), and Sasi Institute of Technology and Engineering (B.Tech ECT 2023–2027).
- **Private Admin Dashboard (`/admin`)**:
  - Full CRUD for projects (Create, Edit, Delete with safety confirmation, Duplicate, Reorder, Featured toggle).
  - Draft vs Published workflow (drafts remain strictly hidden from public visitors).
  - Dynamic skill editor and experience timeline manager.
  - Theme customizer with safe accent colorway presets (Lime, Emerald, Cyan, Amber, Violet).
  - Storage & Media Manager with file validation for screenshots, covers, and PDF resume updates.
  - Secure Contact Message inbox with direct email reply actions.
- **Enterprise-Grade Security**: Supabase Row Level Security (RLS) policies protecting database tables and storage buckets against unauthorized reads, writes, and modifications.
- **Motion Design System**: Snappy, hardware-accelerated animations using Framer Motion (Motion for React):
  - **Hero SplitText**: Non-blocking staggered text reveal with smooth blur-to-focus transition.
  - **Hero Atmospheric Spotlight & Parallax**: Soft ambient spotlight pulse and desktop mouse parallax with physics spring damping.
  - **Dynamic Navigation Pill**: Smooth `layoutId` pill sliding between active section anchors during scrolling.
  - **3D Tilt & Spotlight Cards**: Interactive card tilt with cursor-following radial spotlight shine (Aceternity UI & React Bits reference), with automatic graceful touch fallback.
  - **Animated Filtering & Layout Transitions**: Seamless project grid reorganization using `AnimatePresence` and layout animations.
  - **Accessible & Performance-Minded**: Full support for `prefers-reduced-motion` and mobile touch optimization.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, PostCSS, Custom Theme Variables |
| **Motion & Icons** | Framer Motion, Lucide React |
| **Routing** | React Router v6 (with Vercel SPA rewrites) |
| **Backend & Database** | Supabase (PostgreSQL, Supabase Auth, Supabase Storage) |
| **Hosting** | Vercel |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/esarapubobby/bobby-game-portfolio.git
cd bobby-game-portfolio

# Install npm packages
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the keys with your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ADMIN_EMAIL=esarapubobby@gmail.com
```
*(Note: If you launch without `.env`, the portfolio operates in offline sandbox mode with preloaded seed data so you can test all features immediately!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄 Database & Supabase Configuration

### Step 1: Run the Database Migration
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. In the Supabase Dashboard, open **SQL Editor**.
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
4. (Optional) Run [`supabase/seed.sql`](./supabase/seed.sql) to populate your database with initial data.

This automatically configures:
- `projects`, `skill_categories`, `skills`, `experience`, `education`, `site_settings`, `contact_messages`, and `admin_users` tables.
- Row Level Security (RLS) policies enforcing read-only public access to published projects, and administrator-only writes.
- Storage buckets (`project-media`, `documents`) with upload size and MIME validations.

### Step 2: Create the Initial Administrator Account
1. In the Supabase Dashboard, go to **Authentication > Users**.
2. Click **Add User** -> **Create User**.
   - Email: `esarapubobby@gmail.com`
   - Password: Choose a strong, private password.
   - Toggle: **Auto Confirm User?** -> `Yes`.
3. In the **SQL Editor**, register this user as an authorized administrator using their generated UUID:
   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('<PASTE-USER-UUID-HERE>', 'esarapubobby@gmail.com', 'admin');
   ```
4. Now visit [http://localhost:5173/admin/login](http://localhost:5173/admin/login) and log in with your credentials!

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete production-ready game developer portfolio"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import `bobby-game-portfolio`.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase public anon key
   - `VITE_ADMIN_EMAIL` = `esarapubobby@gmail.com`
5. Click **Deploy**. Vercel will build using `npm run build` and serve the site with zero-config SPA routing via [`vercel.json`](./vercel.json).

---

## 🔒 Security Best Practices Implemented

- **No Secrets in Frontend**: Client code only uses the public Supabase Anon key. Administrative privileges are verified server-side through Supabase RLS `is_admin()` checks.
- **Row Level Security**: Public visitors cannot modify tables, access draft projects, or view submitted contact messages.
- **Storage Isolation**: Storage buckets only accept uploads and deletes signed by authenticated administrators.
- **Sanitized Inputs & Error Guards**: Form validations prevent injection and malformed URLs.

---

## 👤 Author

**Bobby Esarapu**
- **Title**: Unity Game Developer
- **Team**: Redundant Studios
- **Email**: [esarapubobby@gmail.com](mailto:esarapubobby@gmail.com)
- **GitHub**: [github.com/esarapubobby](https://github.com/esarapubobby)
- **LinkedIn**: [linkedin.com/in/bobby-esarapu-68543230](https://linkedin.com/in/bobby-esarapu-68543230)
- **Itch.io**: [bobby-esarapu.itch.io](https://bobby-esarapu.itch.io)
