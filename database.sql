-- ============================================================
--  CareerNest — Full Database Setup (Enhanced)
-- ============================================================

CREATE DATABASE IF NOT EXISTS jobportal;
USE jobportal;

CREATE TABLE IF NOT EXISTS admins (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(80)  NOT NULL,
  email    VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(80)  NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id     INT PRIMARY KEY,
  resume_link TEXT,
  photo_link  TEXT,
  skills      VARCHAR(255),
  experience  VARCHAR(100),
  education   VARCHAR(100),
  bio         TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  company      VARCHAR(255) NOT NULL,
  location     VARCHAR(255) NOT NULL,
  type         ENUM('Full-time','Part-time','Internship','Contract','Remote') DEFAULT 'Full-time',
  salary       VARCHAR(100) DEFAULT '',
  description  TEXT NOT NULL,
  requirements TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  job_id     INT NOT NULL,
  user_id    INT NOT NULL,
  status     ENUM('Applied','Under Review','Interview','Selected','Rejected') DEFAULT 'Applied',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_app (job_id, user_id),
  FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed: default admin (password: admin123)
INSERT IGNORE INTO admins (name, email, password)
VALUES ('Admin', 'admin@jobportal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');

-- Seed: 20 sample jobs
INSERT IGNORE INTO jobs (id, title, company, location, type, salary, description, requirements) VALUES
(1, 'Frontend Developer', 'TechCorp', 'Bangalore, India', 'Full-time', '8-12 LPA',
 'Build modern web apps using React and TypeScript. Work with a talented team on cutting-edge products used by millions. You will own features end-to-end, collaborate with designers and backend engineers, and contribute to our open-source component library.',
 'React, TypeScript, CSS, 1+ years experience'),

(2, 'Backend Engineer', 'DataSoft', 'Remote', 'Full-time', '10-15 LPA',
 'Design and build scalable REST APIs and microservices using Node.js and PostgreSQL. You will architect systems that handle 10M+ requests per day, optimize query performance, and mentor junior engineers.',
 'Node.js, Express, SQL, System Design'),

(3, 'UI/UX Designer', 'PixelLabs', 'Mumbai, India', 'Full-time', '6-10 LPA',
 'Create beautiful, user-centric interfaces for our mobile and web products. Lead design sprints, build prototypes, and work closely with product and engineering to ship high-quality experiences.',
 'Figma, Adobe XD, Prototyping, User Research'),

(4, 'Data Analyst', 'FinEdge', 'Hyderabad, India', 'Full-time', '7-11 LPA',
 'Analyze large datasets and generate actionable business insights using SQL and Python. Build automated dashboards, present findings to leadership, and drive data-informed decisions across the organization.',
 'SQL, Python, Excel, Tableau, Power BI'),

(5, 'DevOps Engineer', 'CloudBase', 'Remote', 'Contract', '12-18 LPA',
 'Manage CI/CD pipelines, cloud infrastructure, and container orchestration. Ensure 99.9% uptime across production systems, automate deployments, and build observability tooling.',
 'AWS/GCP, Docker, Kubernetes, Terraform'),

(6, 'Software Intern', 'StartupX', 'Delhi, India', 'Internship', '15-25k/month',
 'Join a fast-paced startup and work on real features from day one. You will ship code in your first week, attend design reviews, and get direct mentorship from senior engineers.',
 'Any programming language, eagerness to learn'),

(7, 'Machine Learning Engineer', 'AIVentures', 'Bangalore, India', 'Full-time', '15-25 LPA',
 'Build and deploy machine learning models at scale. Work on NLP, computer vision, and recommendation systems. Collaborate with research scientists to bring cutting-edge models to production.',
 'Python, TensorFlow/PyTorch, MLOps, Docker, Strong math background'),

(8, 'Product Manager', 'GrowthHQ', 'Gurugram, India', 'Full-time', '12-20 LPA',
 'Define the product roadmap, gather customer insights, and work cross-functionally to ship features that drive growth. Own key metrics and present to C-level stakeholders in weekly reviews.',
 '3+ years product experience, Analytical thinking, Communication skills, Agile/Scrum'),

(9, 'Android Developer', 'AppFusion', 'Pune, India', 'Full-time', '8-14 LPA',
 'Build and maintain our Android applications with 2M+ active users. Implement new features, optimize performance, and ensure a smooth user experience across a wide range of devices.',
 'Kotlin, Android SDK, Jetpack Compose, REST APIs, Git'),

(10, 'Cybersecurity Analyst', 'SecureNet', 'Chennai, India', 'Full-time', '10-16 LPA',
 'Monitor security events, respond to incidents, conduct vulnerability assessments, and implement security controls. Work with the team to protect infrastructure serving 5M+ users.',
 'SIEM, Firewalls, Penetration Testing, OWASP, CEH/CISSP preferred'),

(11, 'Full Stack Developer', 'WebForge', 'Remote', 'Full-time', '10-18 LPA',
 'Own the entire stack from database to browser. Build new product features, improve infrastructure, write tests, and help define engineering best practices. Great for someone who loves variety.',
 'React, Node.js, PostgreSQL, Docker, AWS'),

(12, 'Data Science Intern', 'AnalyticsHub', 'Bangalore, India', 'Internship', '20-30k/month',
 'Work alongside senior data scientists on live projects. Clean datasets, build exploratory models, and present insights. Learn from professionals working on India\'s largest retail dataset.',
 'Python, Pandas, Scikit-learn, Basic statistics, Jupyter notebooks'),

(13, 'Cloud Solutions Architect', 'NimbusTech', 'Remote', 'Contract', '18-28 LPA',
 'Design cloud architectures for enterprise clients migrating to AWS and Azure. Lead technical workshops, produce architecture documents, and provide guidance to implementation teams.',
 'AWS/Azure, Enterprise Architecture, Terraform, Networking, 5+ years experience'),

(14, 'Graphic Designer', 'CreativeCo', 'Mumbai, India', 'Part-time', '3-5 LPA',
 'Create stunning visual content for social media, print, and digital campaigns. Work with a vibrant creative team on brand identity projects for D2C clients across India.',
 'Adobe Photoshop, Illustrator, InDesign, Brand Design, Motion Graphics'),

(15, 'iOS Developer', 'AppFusion', 'Pune, India', 'Full-time', '9-15 LPA',
 'Develop and maintain our iOS apps delivering premium experiences to 1M+ iPhone users. Build with SwiftUI, integrate with our backend APIs, and follow Apple\'s HIG for best-in-class design.',
 'Swift, SwiftUI, UIKit, Xcode, REST APIs'),

(16, 'QA Engineer', 'Qualiteam', 'Hyderabad, India', 'Full-time', '5-9 LPA',
 'Design and execute test plans, build automated test suites, and ensure product quality across releases. Work closely with developers to catch bugs early and champion quality culture.',
 'Selenium, Cypress, JIRA, Manual testing, Python or JavaScript'),

(17, 'Blockchain Developer', 'CryptoLabs', 'Remote', 'Contract', '15-22 LPA',
 'Build decentralized applications and smart contracts on Ethereum and Solana. Audit contracts for security, optimize gas usage, and collaborate with the product team on DeFi features.',
 'Solidity, Rust, Web3.js, Ethereum, Smart Contract Security'),

(18, 'Technical Writer', 'DocuFlow', 'Remote', 'Part-time', '4-7 LPA',
 'Create clear, accurate, and engaging technical documentation for developer APIs and user guides. Work with engineering teams to understand complex features and translate them for various audiences.',
 'Technical writing, Markdown, API documentation, Git, Good communication'),

(19, 'Business Analyst', 'StratEdge', 'Delhi, India', 'Full-time', '8-12 LPA',
 'Gather business requirements, document workflows, and bridge the gap between stakeholders and the development team. Analyze process inefficiencies and propose solutions that drive ROI.',
 'Business analysis, SQL, BPMN, Stakeholder management, Excel'),

(20, 'React Native Developer', 'MobiStack', 'Bangalore, India', 'Full-time', '10-16 LPA',
 'Build cross-platform mobile applications using React Native for iOS and Android. Collaborate with designers, integrate REST APIs, optimize app performance, and publish to the app stores.',
 'React Native, JavaScript/TypeScript, Redux, Native modules, Mobile UI design');
