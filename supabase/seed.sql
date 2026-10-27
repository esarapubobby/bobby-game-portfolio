-- ==============================================================================
-- BOBBY ESARAPU — SEED DATA
-- Populate initial portfolio projects, skills, experience, education, and settings
-- ==============================================================================

-- 1. Site Settings
insert into public.site_settings (
  id,
  hero_name,
  hero_title,
  hero_quote,
  hero_availability_text,
  about_bio_p1,
  about_bio_p2,
  about_location,
  contact_email,
  github_url,
  linkedin_url,
  itch_url,
  resume_url,
  accent_color,
  show_availability,
  footer_text
) values (
  'current',
  'BOBBY ESARAPU',
  'UNITY GAME DEVELOPER',
  'Building immersive gameplay experiences, one system at a time.',
  'Open for Game Dev Roles & Indie Collaborations',
  'I am a Unity Game Developer and B.Tech student in Electronics and Communication Technology at Sasi Institute of Technology and Engineering (2023–2027), based in Tadepalligudem, Andhra Pradesh. My passion lies in crafting responsive, mechanically deep gameplay experiences from concept to publication.',
  'As a member of the three-person team at Redundant Studios, I specialize in C# gameplay programming, state machine enemy AI, mobile controls, and Android optimization. Having brought projects like DEADZONE from prototype to Google Play, I prioritize writing clean, maintainable systems that turn creative ideas into playable reality.',
  'Tadepalligudem, Andhra Pradesh, India',
  'esarapubobby@gmail.com',
  'https://github.com/esarapubobby',
  'https://linkedin.com/in/bobby-esarapu-68543230',
  'https://bobby-esarapu.itch.io',
  '/Bobby_Esarapu_Resume.pdf',
  'lime',
  true,
  '© Bobby Esarapu. Built for high-performance gameplay systems & web experience.'
) on conflict (id) do update set
  hero_name = excluded.hero_name,
  hero_title = excluded.hero_title,
  hero_quote = excluded.hero_quote;

-- 2. Initial Projects
insert into public.projects (
  id,
  title,
  category,
  short_description,
  detailed_description,
  cover_image,
  screenshots,
  gameplay_video_url,
  google_play_url,
  technologies,
  status,
  featured,
  published,
  sort_order
) values (
  'deadzone',
  'DEADZONE',
  'Top-Down Zombie Survival Shooter',
  'A published zombie survival game featuring enemy AI, wave spawning, combat, mobile controls, and UI.',
  'Deadzone is an intense top-down zombie survival shooter published on Google Play. Built from the ground up for mobile platforms, it features custom enemy AI state machines with pathfinding, wave-based horde spawning logic, responsive dual-joystick mobile touch controls, weapon swap mechanics, audio feedback, and optimized Android performance for stable framerates even with dozens of active ragdolls and enemy entities.',
  '',
  '{}',
  'https://youtu.be/OihvAqWn06w',
  'https://play.google.com/store/apps/details?id=com.redundantstudios.deadzonegame',
  array['Unity', 'C#', 'Enemy AI', 'Wave Spawning', 'Mobile Controls', 'Android SDK', 'UI System'],
  'Published',
  true,
  true,
  1
) on conflict (id) do nothing;

insert into public.projects (
  id,
  title,
  category,
  short_description,
  detailed_description,
  cover_image,
  screenshots,
  itch_url,
  technologies,
  status,
  featured,
  published,
  sort_order
) values (
  'survival-island',
  'SURVIVAL ISLAND',
  '3D Mobile Survival Shooter',
  'A third-person survival shooter involving combat, resource collection, enemy AI, and mobile controls.',
  'Survival Island places the player in an expansive 3D island terrain with dynamic challenges. Key gameplay systems include player inventory management, resource gathering, third-person aiming and shooting mechanics, smart hostile AI patrols, and intuitive on-screen touch controls tailored for mobile gameplay.',
  '',
  '{}',
  'https://bobby-esarapu.itch.io/survival-island',
  array['Unity', 'C#', '3D Combat', 'Resource Gathering', 'Enemy AI', 'Mobile Controls', 'Terrain'],
  'Completed',
  true,
  true,
  2
) on conflict (id) do nothing;

insert into public.projects (
  id,
  title,
  category,
  short_description,
  detailed_description,
  cover_image,
  screenshots,
  demo_url,
  technologies,
  status,
  featured,
  published,
  sort_order
) values (
  'endless-runner-game',
  'ENDLESS RUNNER GAME',
  'Fast-Paced Mobile Arcade',
  'An endless runner featuring obstacle spawning, player movement, and score tracking.',
  'Engineered with performance as priority, this endless runner utilizes object pooling to continuously spawn and recycle obstacles, tracks, and collectables without runtime garbage collection spikes. Features fluid swipe-based lane switching, jump/slide mechanics, speed scaling, and high-score persistence.',
  '',
  '{}',
  'https://l1nk.dev/v7u30x1',
  array['Unity', 'C#', 'Object Pooling', 'Procedural Spawning', 'Score System', 'Mobile UI'],
  'Completed',
  true,
  true,
  3
) on conflict (id) do nothing;

insert into public.projects (
  id,
  title,
  category,
  short_description,
  detailed_description,
  cover_image,
  screenshots,
  demo_url,
  technologies,
  status,
  featured,
  published,
  sort_order
) values (
  'badri-driving',
  'BADRI DRIVING',
  'Vehicle Simulation',
  'A driving simulation featuring vehicle controls and camera systems.',
  'A Unity vehicle simulation prototype exploring wheel collider physics, motor torque curves, friction slip dynamics, gear shifts, and smooth lerping third-person chase camera setups with cockpit toggle.',
  '',
  '{}',
  'https://tinyurl.com/Badri-Driving',
  array['Unity', 'C#', 'Vehicle Physics', 'Wheel Colliders', 'Camera Controller', 'Input Management'],
  'Prototype',
  false,
  true,
  4
) on conflict (id) do nothing;

insert into public.projects (
  id,
  title,
  category,
  short_description,
  detailed_description,
  cover_image,
  screenshots,
  demo_url,
  technologies,
  status,
  featured,
  published,
  sort_order
) values (
  'custom-built-village',
  'CUSTOM-BUILT VILLAGE',
  '3D Environment Design',
  'A detailed 3D village environment created using Unity.',
  'An atmospheric environment showcasing 3D level layout, asset composition, custom lighting baking, post-processing volume configuration, occlusion culling, and camera walkthrough cinematography inside Unity.',
  '',
  '{}',
  'https://tinyurl.com/Custom-Built-Village',
  array['Unity', 'Level Design', 'Lighting & Post-Processing', 'Environment Art', 'Cinemachine'],
  'Completed',
  false,
  true,
  5
) on conflict (id) do nothing;

-- 3. Skill Categories
insert into public.skill_categories (id, name, description, sort_order)
values
  ('cat-game-dev', 'Game Development', 'Core engine architecture, gameplay systems, and mobile deployment.', 1),
  ('cat-programming', 'Programming Languages', 'Object-oriented programming, game scripts, and web fundamentals.', 2),
  ('cat-tools', 'Tools & Workflows', 'Integrated development environments, version control, and design.', 3),
  ('cat-core', 'Core Concepts', 'Software engineering principles and target platform expertise.', 4)
on conflict (id) do nothing;

-- 4. Skills
insert into public.skills (id, category_id, name, highlight, sort_order)
values
  ('g1', 'cat-game-dev', 'Unity Engine', true, 1),
  ('g2', 'cat-game-dev', 'Gameplay Programming', true, 2),
  ('g3', 'cat-game-dev', 'Enemy AI & State Machines', true, 3),
  ('g4', 'cat-game-dev', 'Animation & Mecanim', false, 4),
  ('g5', 'cat-game-dev', 'UI / Canvas Architecture', false, 5),
  ('g6', 'cat-game-dev', 'Mobile Controls (Touch/Joystick)', true, 6),
  ('g7', 'cat-game-dev', 'Object Pooling & Optimization', true, 7),
  ('p1', 'cat-programming', 'C#', true, 1),
  ('p2', 'cat-programming', 'C', false, 2),
  ('p3', 'cat-programming', 'Python', false, 3),
  ('p4', 'cat-programming', 'HTML5', false, 4),
  ('p5', 'cat-programming', 'CSS3', false, 5),
  ('p6', 'cat-programming', 'JavaScript', false, 6),
  ('t1', 'cat-tools', 'Visual Studio', false, 1),
  ('t2', 'cat-tools', 'VS Code', false, 2),
  ('t3', 'cat-tools', 'Git', true, 3),
  ('t4', 'cat-tools', 'GitHub', true, 4),
  ('t5', 'cat-tools', 'Figma', false, 5),
  ('c1', 'cat-core', 'Object-Oriented Programming (OOP)', true, 1),
  ('c2', 'cat-core', 'Debugging & Profiling', true, 2),
  ('c3', 'cat-core', 'Problem Solving & Logic', true, 3),
  ('c4', 'cat-core', 'Android Game Development & SDK', true, 4)
on conflict (id) do nothing;

-- 5. Experience
insert into public.experience (id, company, role, duration, location, description, achievements, technologies, sort_order)
values
  ('exp-redundant-studios', 'Redundant Studios', 'Game Developer', 'Active Member', 'Remote', 'Collaborated with a three-member indie game development team to develop, test, optimize, and publish Unity games targeting Android devices. Focused on core gameplay mechanics, mobile joystick input, enemy wave AI, and build pipeline to Google Play.', array['Published DEADZONE on Google Play Store with full gameplay loop, combat, and touch controls.', 'Implemented optimized object pooling and physics layers for consistent Android framerates.', 'Designed responsive UI scaling and audio management across diverse Android device resolutions.'], array['Unity', 'C#', 'Android SDK', 'Google Play Console', 'Git'], 1),
  ('exp-allreal-labs', 'AllReal Labs', 'Intern', 'June 2026 – July 2026', 'India', 'Completed an internship and gained practical industry experience through assigned technical tasks and professional engineering practices.', array['Applied software development fundamentals to assigned engineering objectives.', 'Collaborated within structured technical workflows and source control best practices.'], array['Software Engineering', 'Technical Problem Solving', 'Git'], 2)
on conflict (id) do nothing;

-- 6. Education
insert into public.education (id, institution, degree, field, duration, location, details, sort_order)
values
  ('edu-sasi', 'Sasi Institute of Technology and Engineering', 'B.Tech', 'Electronics and Communication Technology', '2023 – 2027', 'Tadepalligudem, Andhra Pradesh, India', 'Focusing on core engineering concepts, computational logic, microcontrollers, embedded systems, and applied software engineering alongside game development.', 1)
on conflict (id) do nothing;
