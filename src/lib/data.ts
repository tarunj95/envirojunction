import type { NewsArticle, Job, Tender, Professional, FreelanceProject, UserProfile } from './types';

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Global Carbon Emissions Reach New High, Report Warns',
    source: 'Global Environmental Times',
    publishedDate: '2024-07-28',
    imageUrl: 'https://picsum.photos/seed/news1/600/400',
    imageHint: "wind turbine",
    summary: 'A new international report indicates that despite global efforts, carbon emissions have continued to rise over the past year, posing a severe threat to climate goals.',
    category: 'Climate Change'
  },
  {
    id: '2',
    title: 'Breakthrough in Solar Panel Efficiency Could Revolutionize Clean Energy',
    source: 'TechGreen Today',
    publishedDate: '2024-07-27',
    imageUrl: 'https://picsum.photos/seed/news2/600/400',
    imageHint: "solar panels",
    summary: 'Researchers have developed a new material that significantly boosts solar panel efficiency, promising cheaper and more accessible solar power.',
    category: 'Clean Energy'
  },
  {
    id: '3',
    title: 'India Launches Ambitious National Reforestation Project',
    source: 'The Indian Chronicle',
    publishedDate: '2024-07-26',
    imageUrl: 'https://picsum.photos/seed/news3/600/400',
    imageHint: "planting tree",
    summary: 'The government of India has initiated a massive project to plant 1 billion trees over the next five years to combat deforestation and improve air quality.',
    category: 'Conservation'
  },
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Social Media Assistant',
    company: 'Nomad',
    location: 'Paris, France',
    type: 'Full-Time',
    postedDate: '2024-07-25',
    description: 'Looking for a social media assistant.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nomad_Logo.png/600px-Nomad_Logo.png',
    logoHint: 'company logo',
    applied: 5,
    capacity: 10,
    tags: ['Marketing', 'Design']
  },
  {
    id: '2',
    title: 'Brand Designer',
    company: 'Dropbox',
    location: 'San Fransisco, USA',
    type: 'Full-Time',
    postedDate: '2024-07-24',
    description: 'Looking for a brand designer.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Dropbox_logo_2017.svg/600px-Dropbox_logo_2017.svg.png',
    logoHint: 'company logo',
    applied: 2,
    capacity: 10,
    tags: ['Marketing', 'Design']
  },
  {
    id: '3',
    title: 'Interactive Developer',
    company: 'Terraform',
    location: 'Hamburg, Germany',
    type: 'Full-Time',
    postedDate: '2024-07-22',
    description: 'Join our team to develop interactive things.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Terraform_Logo.svg/600px-Terraform_Logo.svg.png',
    logoHint: 'company logo',
    applied: 8,
    capacity: 12,
    tags: ['Marketing', 'Design']
  },
  {
    id: '4',
    title: 'Solar Energy Engineer',
    company: 'CleanPath',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    postedDate: '2024-07-21',
    description: 'Design and optimize large-scale commercial solar installations.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 14,
    capacity: 20,
    tags: ['Engineering', 'Solar']
  },
  {
    id: '5',
    title: 'Sustainability Manager',
    company: 'Patagonia',
    location: 'Ventura, USA',
    type: 'Full-Time',
    postedDate: '2024-07-20',
    description: 'Lead initiatives to minimize corporate carbon and material footprint.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Patagonia_Inc_logo.svg/600px-Patagonia_Inc_logo.svg.png',
    logoHint: 'company logo',
    applied: 32,
    capacity: 40,
    tags: ['Management', 'Conservation']
  },
  {
    id: '6',
    title: 'Wind Turbine Specialist',
    company: 'SkyWind',
    location: 'Chicago, USA',
    type: 'Contract',
    postedDate: '2024-07-19',
    description: 'Supervise maintenance and diagnostics on offshore wind turbines.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 4,
    capacity: 5,
    tags: ['Engineering', 'Wind']
  },
  {
    id: '7',
    title: 'Environmental Analyst',
    company: 'EcoMetrics',
    location: 'London, UK',
    type: 'Full-Time',
    postedDate: '2024-07-18',
    description: 'Assess compliance, research carbon footprints, and produce ESG metrics.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 11,
    capacity: 15,
    tags: ['Analyst', 'Science']
  },
  {
    id: '8',
    title: 'Water Quality Technician',
    company: 'AquaPure',
    location: 'Berlin, Germany',
    type: 'Full-Time',
    postedDate: '2024-07-17',
    description: 'Monitor, test, and analyze wastewater treatment systems.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 3,
    capacity: 8,
    tags: ['Science', 'Water']
  },
  {
    id: '9',
    title: 'GIS Mapping Specialist',
    company: 'GreenMap',
    location: 'Denver, USA',
    type: 'Part-Time',
    postedDate: '2024-07-16',
    description: 'Create interactive spatial maps for tracking deforestation patterns.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 9,
    capacity: 10,
    tags: ['Design', 'Technology']
  },
  {
    id: '10',
    title: 'Climate Risk Consultant',
    company: 'CarbonZero',
    location: 'Tokyo, Japan',
    type: 'Full-Time',
    postedDate: '2024-07-15',
    description: 'Help global enterprises align with net-zero carbon goals.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 6,
    capacity: 12,
    tags: ['Consulting', 'Climate']
  },
  {
    id: '11',
    title: 'Conservation Biologist',
    company: 'WWF',
    location: 'Seattle, USA',
    type: 'Full-Time',
    postedDate: '2024-07-14',
    description: 'Analyze local ecosystems and implement species protection programs.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/WWF_logo.svg/1200px-WWF_logo.svg.png',
    logoHint: 'company logo',
    applied: 25,
    capacity: 30,
    tags: ['Science', 'Conservation']
  },
  {
    id: '12',
    title: 'Waste Management Engineer',
    company: 'Recyclo',
    location: 'Paris, France',
    type: 'Full-Time',
    postedDate: '2024-07-13',
    description: 'Redesign sorting systems to maximize recyclable output.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 7,
    capacity: 10,
    tags: ['Engineering', 'Waste']
  },
  {
    id: '13',
    title: 'EV Battery Researcher',
    company: 'VoltMotors',
    location: 'Munich, Germany',
    type: 'Full-Time',
    postedDate: '2024-07-12',
    description: 'Develop high-efficiency battery cells for electric vehicles.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    logoHint: 'company logo',
    applied: 18,
    capacity: 20,
    tags: ['Research', 'Technology']
  },
  {
    id: '14',
    title: 'Renewable Energy Analyst',
    company: 'BrightGrid',
    location: 'Boston, USA',
    type: 'Full-Time',
    postedDate: '2024-07-11',
    description: 'Evaluate feasibility studies for wind and solar farm funding.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 10,
    capacity: 15,
    tags: ['Analyst', 'Finance']
  },
  {
    id: '15',
    title: 'Sustainable Architect',
    company: 'GreenDesign',
    location: 'Mumbai, India',
    type: 'Contract',
    postedDate: '2024-07-10',
    description: 'Architect energy-efficient structures aiming for LEED Platinum certification.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 15,
    capacity: 25,
    tags: ['Design', 'Architecture']
  },
  {
    id: '16',
    title: 'Forest Officer',
    company: 'GreenNGO',
    location: 'Nairobi, Kenya',
    type: 'Full-Time',
    postedDate: '2024-07-09',
    description: 'Oversee and audit reforestation sites across East Africa.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Greenpeace_logo.svg/600px-Greenpeace_logo.svg.png',
    logoHint: 'company logo',
    applied: 22,
    capacity: 25,
    tags: ['Science', 'Forestry']
  },
  {
    id: '17',
    title: 'Hydrologist',
    company: 'AquaFlow',
    location: 'Amsterdam, Netherlands',
    type: 'Full-Time',
    postedDate: '2024-07-08',
    description: 'Model groundwater replenishment under varying climate scenarios.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 5,
    capacity: 10,
    tags: ['Science', 'Water']
  },
  {
    id: '18',
    title: 'Ecotourism Coordinator',
    company: 'WildTravel',
    location: 'Sydney, Australia',
    type: 'Part-Time',
    postedDate: '2024-07-07',
    description: 'Coordinate and scale low-impact, local-led travel tours.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 12,
    capacity: 15,
    tags: ['Marketing', 'Travel']
  },
  {
    id: '19',
    title: 'Air Quality Analyst',
    company: 'PureAir',
    location: 'New Delhi, India',
    type: 'Full-Time',
    postedDate: '2024-07-06',
    description: 'Monitor, process, and forecast smog levels using machine learning.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 19,
    capacity: 20,
    tags: ['Science', 'Climate']
  },
  {
    id: '20',
    title: 'Corporate CSR Manager',
    company: 'EcoImpact',
    location: 'Toronto, Canada',
    type: 'Full-Time',
    postedDate: '2024-07-05',
    description: 'Oversee the implementation of company-wide green standards.',
    logoUrl: '',
    logoHint: 'company logo',
    applied: 8,
    tags: ['Management', 'Corporate']
  }
];

export const emdAmount = (isENTTender: boolean, tender: any) => isENTTender ? "₹50,000 (Fixed)" : `₹${tender.value.replace(/^[₹$]/, "").replace(/\s*(Crore|crore|Million|million).*/, "")} (Fixed)`;

export const tenders: Tender[] = [
  {
    id: '1',
    title: 'Development of a Solar Power Park in Rajasthan',
    organization: 'Ministry of New & Renewable Energy, Govt. of India',
    deadline: '2024-09-15',
    value: '₹500 Crore',
    details: 'The Ministry of New & Renewable Energy invites bids for the development of a 200 MW solar power park in Rajasthan. The project includes land acquisition, infrastructure development, and grid integration. The goal is to enhance India\'s renewable energy capacity and promote sustainable power generation.',
  },
  {
    id: '2',
    title: 'National River Cleaning and Remediation Program',
    organization: 'World Bank & Ministry of Jal Shakti',
    deadline: '2024-10-01',
    value: '₹2,490 Crore',
    details: 'International tender for a large-scale river cleaning and water remediation project for major Indian rivers. Scope includes setting up water treatment plants and implementing pollution control measures. This initiative aims to restore river ecosystems and improve water quality for millions.',
  },
  {
    id: '3',
    title: 'Supply of Electric Buses for Urban Transport',
    organization: 'Delhi Transport Corporation',
    deadline: '2024-08-30',
    value: '₹150 Crore',
    details: 'Tender for the supply and maintenance of 500 electric buses for public transport in Delhi. This move is part of the city\'s plan to reduce air pollution and shift towards green mobility solutions. The buses should meet modern standards of efficiency and passenger comfort.',
  },
  {
    id: '4',
    title: 'Rate Contract for supply of ENT consumables for AB-PMJAY at AIIMS Nagpur',
    organization: 'All India Institute of Medical Science-Nagpur',
    deadline: '2026-05-30',
    value: '₹50,000 (EMD)',
    details: 'Bids are invited for the rate contract for supply of ENT consumables for AB-PMJAY at AIIMS Nagpur. The tender is for the supply of high-quality medical consumables under open tender guidelines. Manufacturers and authorized dealers are requested to submit bids.',
  },
];

export const professionals: Professional[] = [
  {
    id: '6afb03499547ad6f5d154c75',
    name: 'Vivek Ojha',
    headline: 'Senior Environmental Consultant & Sustainability Strategist',
    title: 'Senior Environmental Consultant',
    location: 'Noida / New Delhi, India',
    skills: ['Sustainability', 'Environmental Management', 'EIA & Advisory', 'Waste Management', 'Renewable Energy', 'Ecology'],
    bio: 'Dedicated environmental consultant with over 8 years of experience in environmental impact assessment (EIA), corporate sustainability frameworks, green infrastructure advisory, and ecological regulatory compliance.',
    avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLcr6DnFZJsAGPMh1EyhxmB9P1VMXkkeprhk-gGMdHqWjwO6Tc97w=s96-c',
    avatarHint: 'male environmental consultant',
    email: 'vivekojha09@gmail.com',
    phone: '+91 98110 54321',
    sectors: ['Environmental Management', 'Sustainability & ESG', 'Renewable Energy', 'Infrastructure'],
    languages: ['English', 'Hindi'],
    education: [
      { title: 'M.Tech in Environmental Engineering', name: 'Delhi Technological University (DTU)', start_year: 2014, end_year: 2016 },
      { title: 'B.Tech in Civil Engineering', name: 'Dr. A.P.J. Abdul Kalam Technical University', start_year: 2010, end_year: 2014 }
    ],
    certifications: [
      { title: 'Certified Environmental Impact Assessor (EIA Coordinator)', name: 'Quality Council of India (QCI / NABET)', start_year: 2018, end_year: 2023 },
      { title: 'LEED Green Associate', name: 'U.S. Green Building Council', start_year: 2019, end_year: 2024 }
    ],
    work_experience: [
      { title: 'Senior Environmental Consultant', name: 'EnviroJunction Network', start_year: 2020, about: 'Leading environmental impact assessments, ESG regulatory compliance, and green transition roadmaps for commercial infrastructure.', isPresent: true },
      { title: 'Environmental Specialist', name: 'Ecotech Sustainable Solutions', start_year: 2016, end_year: 2020, about: 'Conducted field baseline monitoring, air & water quality audits, and environmental management plans across industrial hubs.' }
    ],
    services: ['Environmental Impact Assessment (EIA)', 'Sustainability & ESG Advisory', 'Regulatory Compliance Auditing', 'Waste Management & Resource Efficiency', 'Air & Water Quality Monitoring'],
    projects: [
      {
        title: 'Integrated Urban Green Infrastructure & Biodiversity Assessment',
        name: 'National Ecological Development Council',
        location: 'Delhi NCR, India',
        projectType: 'Consulting',
        time: '2023 - 2024',
        status: 'Completed',
        tags: ['Sustainability', 'EIA', 'Urban Ecology'],
        description: 'Led end-to-end environmental compliance assessment, air quality baseline modeling, and ecological mitigation planning across commercial corridors.'
      },
      {
        title: 'Industrial Effluent & Solid Waste Management Optimization',
        name: 'State Pollution Control Authority',
        location: 'Uttar Pradesh, India',
        projectType: 'Advisory',
        time: '2021 - 2023',
        status: 'Completed',
        tags: ['Waste Management', 'Circular Economy', 'Compliance'],
        description: 'Developed closed-loop recycling and zero-liquid discharge recommendations for industrial manufacturing clusters.'
      }
    ]
  },
  {
    id: '1',
    name: 'Dr. Anjali Sharma',
    headline: 'Environmental Scientist & Water Remediation Expert',
    title: 'Lead Water Remediation Scientist',
    location: 'Pune, Maharashtra, India',
    skills: ['Water Quality Analysis', 'Soil Remediation', 'Water & Sanitation', 'Environmental Policy', 'Ecology'],
    bio: 'Over 12 years of research and field leadership in industrial wastewater treatment, river basin ecological remediation, and groundwater contamination assessment.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female environmental scientist',
    email: 'anjali.sharma@aquaterra.org',
    phone: '+91 98230 45112',
    sectors: ['Water Resources', 'Environmental Management', 'Public Policy'],
    languages: ['English', 'Hindi', 'Marathi'],
    education: [
      { title: 'Ph.D. in Environmental Science & Engineering', name: 'Indian Institute of Technology Bombay', start_year: 2012, end_year: 2017 },
      { title: 'M.Sc. in Chemistry', name: 'Savitribai Phule Pune University', start_year: 2010, end_year: 2012 }
    ],
    certifications: [
      { title: 'Certified Environmental Professional (CEP)', name: 'National Association of Environmental Professionals', start_year: 2018, end_year: 2023 }
    ],
    work_experience: [
      { title: 'Lead Water Remediation Scientist', name: 'AquaTerra Solutions', start_year: 2018, about: 'Leading river basin pollution tracking, industrial effluent neutralization, and aquifer mapping projects.', isPresent: true },
      { title: 'Senior Research Fellow', name: 'National Chemical Laboratory', start_year: 2015, end_year: 2018, about: 'Synthesized biocompatible adsorbents for heavy-metal extraction from industrial wastewater.' }
    ],
    services: ['Water Quality Analysis', 'Groundwater Remediation', 'Effluent Treatment Plant (ETP) Auditing', 'Environmental Impact Assessment'],
    projects: [
      {
        title: 'Clean River Basin Remediation Initiative',
        name: 'Maharashtra Ecological Council',
        location: 'Pune, India',
        projectType: 'Full time',
        time: '2022 - 2024',
        status: 'Completed',
        tags: ['Water Remediation', 'Circular Economy', 'Ecological Impact'],
        description: 'Spearheaded technical baseline water quality monitoring across 14 municipal sampling sites, eliminating heavy-metal discharges.'
      }
    ]
  },
  {
    id: '2',
    name: 'Rohan Verma',
    headline: 'Renewable Energy Consultant & Solar PV Specialist',
    title: 'Principal Solar Energy Consultant',
    location: 'Hyderabad, Telangana, India',
    skills: ['Solar PV Design', 'Renewable Energy', 'Energy Auditing', 'Grid Integration', 'Battery Storage'],
    bio: 'Specialist in utility-scale solar PV system design, techno-economic feasibility studies, and industrial clean power transition roadmaps across India and APAC.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'male solar energy consultant',
    email: 'rohan.verma@suryagrid.com',
    phone: '+91 94401 28901',
    sectors: ['Renewable Energy', 'Clean Technology', 'Power & Utilities'],
    languages: ['English', 'Hindi', 'Telugu'],
    education: [
      { title: 'M.Tech in Energy Systems', name: 'NIT Warangal', start_year: 2014, end_year: 2016 },
      { title: 'B.Tech in Electrical Engineering', name: 'JNTU Hyderabad', start_year: 2010, end_year: 2014 }
    ],
    certifications: [
      { title: 'Certified Energy Manager (CEM)', name: 'Bureau of Energy Efficiency (BEE)', start_year: 2017, end_year: 2022 }
    ],
    work_experience: [
      { title: 'Principal Solar Consultant', name: 'SuryaGrid Power Solutions', start_year: 2019, about: 'Overseeing engineering design and grid compliance for 500MW+ solar projects.', isPresent: true },
      { title: 'Senior Solar Systems Engineer', name: 'Adani Solar', start_year: 2016, end_year: 2019, about: 'Conducted PVsyst modeling, loss calculations, and balance-of-plant design.' }
    ],
    services: ['Solar PV Feasibility & EPC Advisory', 'Industrial Energy Audits', 'Microgrid & BESS Design', 'Grid Interconnection Modeling'],
    projects: [
      {
        title: '120MW Utility Solar Farm Interconnection',
        name: 'Southern Power Grid Corp',
        location: 'Telangana, India',
        projectType: 'Full time',
        time: '2023',
        status: 'Completed',
        tags: ['Renewable Energy', 'Solar Farm', 'Grid Integration'],
        description: 'Designed 33kV evacuation substations and managed grid compliance testing for a utility-scale solar park.'
      }
    ]
  },
  {
    id: '3',
    name: 'Priya Mehta',
    headline: 'Green Building Architect & LEED AP BD+C',
    title: 'Senior Sustainable Architecture Specialist',
    location: 'Mumbai, Maharashtra, India',
    skills: ['Sustainable Design', 'LEED Certification', 'GRIHA', 'BIM Modeling', 'Urban Planning', 'Sustainability'],
    bio: 'Architectural consultant specializing in net-zero energy buildings, daylight simulation, circular construction materials, and IGBC/LEED green building certifications.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female green building architect',
    email: 'priya.mehta@ecohabitats.in',
    phone: '+91 98200 77140',
    sectors: ['Sustainable Architecture', 'Urban Planning', 'Real Estate ESG'],
    languages: ['English', 'Hindi', 'Gujarati'],
    education: [
      { title: 'Master of Architecture (Sustainable Design)', name: 'CEPT University Ahmedabad', start_year: 2014, end_year: 2016 },
      { title: 'Bachelor of Architecture', name: 'Sir J.J. College of Architecture', start_year: 2009, end_year: 2014 }
    ],
    certifications: [
      { title: 'LEED AP Building Design + Construction', name: 'U.S. Green Building Council', start_year: 2017, end_year: 2024 },
      { title: 'GRIHA Certified Professional', name: 'The Energy and Resources Institute', start_year: 2018, end_year: 2023 }
    ],
    work_experience: [
      { title: 'Senior Sustainable Design Architect', name: 'EcoHabitats Studio', start_year: 2020, about: 'Directing bioclimatic building design and green rating compliance for major corporate towers.', isPresent: true },
      { title: 'Architectural Consultant', name: 'Hafeez Contractor Associates', start_year: 2016, end_year: 2020, about: 'Implemented passive cooling systems and energy modeling for commercial developments.' }
    ],
    services: ['LEED & GRIHA Green Building Certification', 'Net-Zero Carbon Building Design', 'Building Energy & Daylight Simulation'],
    projects: [
      {
        title: 'Mumbai Corporate Tower Net-Zero Retrofit',
        name: 'Narayana Realty Group',
        location: 'Mumbai, India',
        projectType: 'Consulting',
        time: '2023',
        status: 'Completed',
        tags: ['LEED Platinum', 'Energy Simulation', 'Decarbonization'],
        description: 'Achieved LEED Platinum status reducing energy consumption by 42% through passive solar orientation and high-efficiency HVAC.'
      }
    ]
  },
  {
    id: '4',
    name: 'Rajeshwar Iyer',
    headline: 'Environmental Policy Advisor & Compliance Counsel',
    title: 'Director of Environmental Policy Advisory',
    location: 'New Delhi, India',
    skills: ['Environmental Policy', 'EIA Regulatory Compliance', 'Environmental Law', 'Policy', 'Audit', 'Sustainability'],
    bio: 'Advising infrastructure developers, municipal corporations, and multilateral agencies on EIA clearances, National Green Tribunal mandates, and national environmental regulations.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'male environmental policy advisor',
    email: 'rajeshwar.iyer@envirolegal.org',
    phone: '+91 98110 33490',
    sectors: ['Environmental Policy', 'Infrastructure Clearances', 'Corporate Governance'],
    languages: ['English', 'Hindi', 'Tamil'],
    education: [
      { title: 'LL.M. in Environmental Law & Policy', name: 'National Law School of India University', start_year: 2011, end_year: 2013 },
      { title: 'B.A. LL.B. (Hons)', name: 'Faculty of Law, University of Delhi', start_year: 2006, end_year: 2011 }
    ],
    certifications: [
      { title: 'Certified Regulatory Compliance Specialist', name: 'Indian Institute of Corporate Affairs', start_year: 2015, end_year: 2020 }
    ],
    work_experience: [
      { title: 'Director of Environmental Policy Advisory', name: 'EnviroLegal Partners', start_year: 2018, about: 'Formulating legal defense and statutory clearance workflows under the Environment Protection Act.', isPresent: true }
    ],
    services: ['EIA Statutory Clearances', 'Pollution Control Board Legal Advisory', 'Environmental Due Diligence for Mergers'],
    projects: [
      {
        title: 'National Green Express Highway Ecological Clearance',
        name: 'National Highways Authority',
        location: 'New Delhi, India',
        projectType: 'Advisory',
        time: '2023 - 2024',
        status: 'Completed',
        tags: ['Environmental Policy', 'Forest Clearance', 'EIA'],
        description: 'Drafted mitigation framework approved by Central Empowered Committee for green highway corridor.'
      }
    ]
  },
  {
    id: '5',
    name: 'Dr. Sunita Rao',
    headline: 'Wildlife Biologist & Conservation Ecologist',
    title: 'Lead Conservation Ecologist',
    location: 'Bengaluru, Karnataka, India',
    skills: ['Ecology', 'Biodiversity Assessment', 'Habitat Restoration', 'Wildlife Conservation', 'Flora & Fauna Surveys'],
    bio: '15+ years surveying Western Ghats biodiversity corridors, conducting critical habitat assessments (CHA), and designing mitigation plans for vulnerable species.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female wildlife biologist',
    email: 'sunita.rao@biosphere.org',
    phone: '+91 99801 55678',
    sectors: ['Ecology & Biodiversity', 'Wildlife Conservation', 'Forestry'],
    languages: ['English', 'Kannada', 'Hindi'],
    education: [
      { title: 'Ph.D. in Conservation Biology', name: 'Indian Institute of Science (IISc)', start_year: 2009, end_year: 2014 },
      { title: 'M.Sc. in Zoology & Wildlife', name: 'Bangalore University', start_year: 2007, end_year: 2009 }
    ],
    certifications: [
      { title: 'IUCN Red List Assessor Certification', name: 'IUCN Species Survival Commission', start_year: 2016, end_year: 2022 }
    ],
    work_experience: [
      { title: 'Lead Conservation Ecologist', name: 'BioSphere Conservation Trust', start_year: 2015, about: 'Spearheading biodiversity assessments and community-managed ecological sanctuaries.', isPresent: true }
    ],
    services: ['Biodiversity Impact Assessments', 'Ecological Restoration Planning', 'Wildlife Corridor Mapping'],
    projects: [
      {
        title: 'Western Ghats Elephant Corridor Conservation Program',
        name: 'Wildlife Trust of India',
        location: 'Karnataka, India',
        projectType: 'Field Research',
        time: '2022 - 2024',
        status: 'Completed',
        tags: ['Ecology', 'Wildlife Protection', 'Corridor Connectivity'],
        description: 'Restored 240 hectares of fragmented canopy connectivity, eliminating human-elephant conflict incidents.'
      }
    ]
  },
  {
    id: '6',
    name: 'Neha Kulkarni',
    headline: 'Lead Carbon Accountant & GHG Inventory Specialist',
    title: 'Senior Carbon Accounting Manager',
    location: 'Chennai, Tamil Nadu, India',
    skills: ['Carbon Accounting', 'Carbon', 'GHG Protocol Scope 1-3', 'Carbon Offsetting', 'SBTi Targets', 'Sustainability'],
    bio: 'Empowering manufacturing, logistics, and tech corporations to accurately quantify Scope 1, 2, and 3 emissions and achieve Science Based Targets (SBTi).',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female carbon accountant',
    email: 'neha.kulkarni@decarbmetrics.com',
    phone: '+91 98402 11984',
    sectors: ['Carbon Accounting', 'Corporate Decarbonization', 'Supply Chain ESG'],
    languages: ['English', 'Hindi', 'Marathi'],
    education: [
      { title: 'M.Sc. in Climate Change & Carbon Management', name: 'University of Edinburgh', start_year: 2015, end_year: 2016 },
      { title: 'B.E. in Environmental Engineering', name: 'Anna University', start_year: 2011, end_year: 2015 }
    ],
    certifications: [
      { title: 'Certified GHG Verifier (ISO 14064)', name: 'BSI Group', start_year: 2018, end_year: 2023 }
    ],
    work_experience: [
      { title: 'Senior Carbon Accounting Manager', name: 'DecarbMetrics Global', start_year: 2018, about: 'Auditing corporate GHG emissions portfolios across 60+ global industrial facilities.', isPresent: true }
    ],
    services: ['Corporate Carbon Footprint Calculation', 'Scope 3 Supply Chain Emission Audits', 'Net-Zero Transition Modeling'],
    projects: [
      {
        title: 'Tier-1 Automotive Manufacturer Scope 1-3 GHG Audit',
        name: 'AutoTech India',
        location: 'Chennai, India',
        projectType: 'Audit',
        time: '2023',
        status: 'Completed',
        tags: ['Carbon Accounting', 'Scope 3', 'SBTi Roadmap'],
        description: 'Quantified 450,000 tCO2e across global vendor tiers and designed a 2030 decarbonization roadmap.'
      }
    ]
  },
  {
    id: '7',
    name: 'Divya Chawla',
    headline: 'GIS & Remote Sensing Environmental Analyst',
    title: 'Senior Spatial Data Scientist',
    location: 'Dehradun, Uttarakhand, India',
    skills: ['GIS', 'Remote Sensing', 'Satellite Image Processing', 'Spatial Modeling', 'Land Use Mapping', 'ArcGIS', 'Ecology'],
    bio: 'Leveraging multi-spectral satellite imagery, LiDAR, and spatial modeling to track deforestation, urban heat islands, watershed hydrology, and coastal erosion.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female GIS specialist',
    email: 'divya.chawla@geoeco.res.in',
    phone: '+91 97600 84310',
    sectors: ['GIS & Remote Sensing', 'Climate Modeling', 'Natural Resource Management'],
    languages: ['English', 'Hindi', 'Punjabi'],
    education: [
      { title: 'M.Tech in Remote Sensing & GIS', name: 'Indian Institute of Remote Sensing (IIRS)', start_year: 2016, end_year: 2018 },
      { title: 'B.Sc. (Hons) in Geology', name: 'Panjab University', start_year: 2013, end_year: 2016 }
    ],
    certifications: [
      { title: 'Esri Certified ArcGIS Professional', name: 'Esri', start_year: 2019, end_year: 2024 }
    ],
    work_experience: [
      { title: 'Senior Spatial Data Scientist', name: 'GeoEcological Analytics', start_year: 2019, about: 'Processing satellite constellations to generate dynamic forest cover change and wetland indices.', isPresent: true }
    ],
    services: ['Satellite Land Cover Classification', 'Flood Inundation & Catchment Modeling', 'Ecological Spatial Analytics'],
    projects: [
      {
        title: 'State Forest Canopy Density & Carbon Biomass Survey',
        name: 'Forest Survey of India',
        location: 'Uttarakhand, India',
        projectType: 'Consulting',
        time: '2023 - 2024',
        status: 'Completed',
        tags: ['GIS & Remote Sensing', 'Satellite Mapping', 'Forest Biomass'],
        description: 'Processed Sentinel-2 imagery across 18,000 sq km to map biomass density with 94.6% ground accuracy.'
      }
    ]
  },
  {
    id: '8',
    name: 'Amitav Roy',
    headline: 'Lead Environmental Auditor & ISO 14001 Consultant',
    title: 'Principal Environmental Compliance Auditor',
    location: 'Kolkata, West Bengal, India',
    skills: ['Audit', 'Environmental Audits', 'ISO 14001', 'EMS Implementation', 'Hazardous Waste Auditing', 'Industrial Safety'],
    bio: 'Conducted over 120 comprehensive environmental compliance and hazardous waste audits for chemical, textile, and manufacturing plants across South Asia.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'male environmental auditor',
    email: 'amitav.roy@sgscompliance.com',
    phone: '+91 98311 09245',
    sectors: ['Environmental Audits', 'Industrial Compliance', 'Manufacturing Safety'],
    languages: ['English', 'Bengali', 'Hindi'],
    education: [
      { title: 'B.Tech in Chemical Engineering', name: 'Jadavpur University', start_year: 2011, end_year: 2015 }
    ],
    certifications: [
      { title: 'IRCA Certified Lead Environmental Auditor (ISO 14001)', name: 'CQI | IRCA', start_year: 2017, end_year: 2024 }
    ],
    work_experience: [
      { title: 'Principal Environmental Auditor', name: 'SGS Environmental Services', start_year: 2016, about: 'Auditing industrial environmental management systems and effluent disposal compliance.', isPresent: true }
    ],
    services: ['ISO 14001 EMS Implementation & Certification', 'Hazardous Waste Management Auditing', 'Pollution Compliance Verification'],
    projects: [
      {
        title: 'Major Port Facility Comprehensive Environmental Audit',
        name: 'Kolkata Port Trust',
        location: 'West Bengal, India',
        projectType: 'Audit',
        time: '2023',
        status: 'Completed',
        tags: ['Environmental Audits', 'ISO 14001', 'Hazardous Materials'],
        description: 'Identified key pollution containment actions, bringing the marine terminal into full regulatory adherence.'
      }
    ]
  },
  {
    id: '9',
    name: 'Shalini Gupta',
    headline: 'Circular Economy & Waste Management Strategist',
    title: 'Head of Circular Strategies & EPR',
    location: 'Ahmedabad, Gujarat, India',
    skills: ['Circular Economy', 'Waste', 'Waste Management', 'EPR Compliance', 'Plastics Recycling', 'Sustainability'],
    bio: 'Helping FMCG brands and municipal bodies achieve Extended Producer Responsibility (EPR) compliance, design closed-loop packaging, and divert waste from landfills.',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female waste management specialist',
    email: 'shalini.gupta@zerowaste.in',
    phone: '+91 97240 68112',
    sectors: ['Circular Economy', 'Waste Management', 'FMCG Sustainability'],
    languages: ['English', 'Hindi', 'Gujarati'],
    education: [
      { title: 'M.Sc. in Sustainable Waste Management', name: 'TERI School of Advanced Studies', start_year: 2014, end_year: 2016 },
      { title: 'B.Sc. in Environmental Sciences', name: 'Gujarat University', start_year: 2011, end_year: 2014 }
    ],
    certifications: [
      { title: 'Certified TRUE Zero Waste Advisor', name: 'Green Business Certification Inc. (GBCI)', start_year: 2018, end_year: 2023 }
    ],
    work_experience: [
      { title: 'Head of Circular Strategies & EPR', name: 'ZeroWaste Solutions', start_year: 2018, about: 'Directing plastic collection networks and EPR fulfillment for 20+ consumer goods enterprises.', isPresent: true }
    ],
    services: ['EPR Plastic Credit & Collection Strategies', 'Zero Waste to Landfill Facility Audits', 'Circular Packaging Materials Transition'],
    projects: [
      {
        title: 'City-Wide Dry Waste Segregation & Recovery Network',
        name: 'Ahmedabad Municipal Corporation',
        location: 'Gujarat, India',
        projectType: 'Public Sector',
        time: '2022 - 2024',
        status: 'Completed',
        tags: ['Circular Economy', 'Waste Management', 'Plastics Recovery'],
        description: 'Established 6 material recovery facilities processing 180 tonnes/day of dry waste with 92% diversion from landfills.'
      }
    ]
  },
  {
    id: '10',
    name: 'Kabir Deshmukh',
    headline: 'Corporate Sustainability & ESG Advisory Lead',
    title: 'Director of ESG Advisory Services',
    location: 'Gurugram, Haryana, India',
    skills: ['Sustainability', 'ESG Disclosure (BRSR, GRI)', 'CDP Reporting', 'Supply Chain ESG', 'Materiality Assessment', 'Policy'],
    bio: 'Guiding listed enterprises on SEBI Business Responsibility and Sustainability Reporting (BRSR), materiality assessments, and climate transition disclosure frameworks.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'male ESG consultant',
    email: 'kabir.deshmukh@greenhorizon.com',
    phone: '+91 98108 55421',
    sectors: ['Sustainability & ESG', 'Financial Services', 'Corporate Strategy'],
    languages: ['English', 'Hindi'],
    education: [
      { title: 'MBA in Sustainability Management', name: 'Xavier Institute of Management', start_year: 2013, end_year: 2015 },
      { title: 'B.Com (Hons)', name: 'Shri Ram College of Commerce (SRCC)', start_year: 2010, end_year: 2013 }
    ],
    certifications: [
      { title: 'GRI Certified Sustainability Professional', name: 'Global Reporting Initiative', start_year: 2017, end_year: 2024 },
      { title: 'FSA Credential (SASB)', name: 'Value Reporting Foundation', start_year: 2019, end_year: 2024 }
    ],
    work_experience: [
      { title: 'Director of ESG Advisory Services', name: 'GreenHorizon Advisory', start_year: 2017, about: 'Leading ESG gap assessments, BRSR filings, and carbon transition strategies for Fortune 500 firms.', isPresent: true }
    ],
    services: ['BRSR & GRI Sustainability Reporting', 'Double Materiality Assessment', 'ESG Risk Due Diligence for Investors'],
    projects: [
      {
        title: 'Nifty 50 Commercial Bank ESG Framework Integration',
        name: 'Apex Financial Services',
        location: 'Mumbai & Gurugram, India',
        projectType: 'Advisory',
        time: '2023 - 2024',
        status: 'Completed',
        tags: ['Sustainability & ESG', 'BRSR Mandate', 'Green Finance'],
        description: 'Developed green lending framework and complete SEBI BRSR Core disclosures.'
      }
    ]
  },
  {
    id: '11',
    name: 'Vikramaditya Sen',
    headline: 'Hydrologist & Water Resources Management Specialist',
    title: 'Senior Hydrological Modeling Consultant',
    location: 'Chandigarh, India',
    skills: ['Water', 'Water Resources', 'Hydrology', 'Rainwater Harvesting', 'Watershed Management', 'Hydrogeology'],
    bio: 'Specializing in watershed restoration, artificial aquifer recharge, and municipal drought resilience modeling across agrarian regions in North India.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'male hydrologist',
    email: 'vikram.sen@jalshakti.org',
    phone: '+91 98880 12765',
    sectors: ['Water Resources', 'Agrarian Ecology', 'Civil Infrastructure'],
    languages: ['English', 'Hindi', 'Punjabi'],
    education: [
      { title: 'M.Tech in Water Resources Engineering', name: 'Punjab Engineering College', start_year: 2013, end_year: 2015 },
      { title: 'B.Tech in Civil Engineering', name: 'Thapar Institute of Engineering', start_year: 2009, end_year: 2013 }
    ],
    certifications: [
      { title: 'Certified Professional Hydrologist', name: 'American Institute of Hydrology', start_year: 2018, end_year: 2023 }
    ],
    work_experience: [
      { title: 'Senior Hydrological Consultant', name: 'JalShakti Engineering Partners', start_year: 2018, about: 'Designing micro-watersheds and aquifer recharge zones across Punjab and Haryana.', isPresent: true }
    ],
    services: ['Watershed Catchment Modeling', 'Industrial Rainwater Harvesting Design', 'Groundwater Depletion Remediation'],
    projects: [
      {
        title: 'Malwa Agri-Basin Aquifer Rejuvenation Project',
        name: 'State Water Resources Authority',
        location: 'Punjab, India',
        projectType: 'Government Project',
        time: '2022 - 2024',
        status: 'Completed',
        tags: ['Water Resources', 'Aquifer Recharge', 'Hydrology'],
        description: 'Constructed 140 recharge shafts stabilizing water table levels across 12,000 hectares of farmland.'
      }
    ]
  },
  {
    id: '12',
    name: 'Meera Nair',
    headline: 'Forestry Specialist & Ecological Restoration Officer',
    title: 'Head of Forest Landscape Restoration',
    location: 'Kochi, Kerala, India',
    skills: ['Ecology', 'Forestry', 'Afforestation', 'Miyawaki Urban Forests', 'Carbon Sequestration', 'Sustainability'],
    bio: 'Directing large-scale native afforestation programs, agroforestry transitions for smallholders, and urban green lung creation through the Miyawaki technique.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    avatarHint: 'female forestry expert',
    email: 'meera.nair@restorenature.org',
    phone: '+91 94470 98214',
    sectors: ['Ecology & Biodiversity', 'Forestry & Carbon Sinks', 'Urban Greening'],
    languages: ['English', 'Malayalam', 'Tamil'],
    education: [
      { title: 'M.Sc. in Forestry', name: 'Forest Research Institute (FRI) Dehradun', start_year: 2013, end_year: 2015 },
      { title: 'B.Sc. in Botany', name: 'University of Kerala', start_year: 2010, end_year: 2013 }
    ],
    certifications: [
      { title: 'Certified Silviculturalist', name: 'Society of American Foresters', start_year: 2017, end_year: 2023 }
    ],
    work_experience: [
      { title: 'Head of Forest Landscape Restoration', name: 'Western Ghats Restoration Network', start_year: 2017, about: 'Restoring native rainforest buffers and managing community tree nurseries.', isPresent: true }
    ],
    services: ['Native Species Afforestation Design', 'Miyawaki Urban Forest Installation', 'Forest Carbon Stock Measurement'],
    projects: [
      {
        title: '500-Acre Native Forest Corridor Regeneration',
        name: 'Kerala State Biodiversity Board',
        location: 'Wayanad, Kerala, India',
        projectType: 'Field Conservation',
        time: '2021 - 2024',
        status: 'Completed',
        tags: ['Ecology', 'Native Afforestation', 'Carbon Sink'],
        description: 'Planted 250,000 indigenous trees with an 89% two-year survival rate, creating a wildlife buffer.'
      }
    ]
  }
];

export const freelanceProjects: FreelanceProject[] = [
  {
    id: '1',
    title: 'Environmental Impact Assessment (EIA) Report',
    client: 'InfraBuild Corp.',
    budget: '₹80,000',
    deadline: '2024-08-20',
    description: 'Need a certified environmental professional to conduct an EIA and prepare a comprehensive report for a new industrial project.',
    skills: ['EIA', 'Report Writing', 'Environmental Law']
  },
  {
    id: '2',
    title: 'Corporate Sustainability Report (CSR) Content',
    client: 'Innovate Inc.',
    budget: '₹50,000',
    deadline: '2024-09-01',
    description: 'Looking for a freelancer to write compelling content for our annual sustainability report, highlighting our green initiatives.',
    skills: ['Content Writing', 'Corporate Sustainability', 'GRI Standards']
  }
];

export const currentUser: UserProfile = {
  name: 'Tarun Jajoria',
  headline: 'Ticktech',
  location: 'Via Camilla Cavour, Florence (FI), Tuscany, Italy',
  followers: '10k',
  employees: '200-500',
  avatarUrl: 'https://images.pexels.com/photos/2927773/pexels-photo-2927773.jpeg',
  avatarHint: 'person portrait',
  about: "Our goal is simple - making our customers' financial portfolios look good while providing optimal services. Check out our Linkedin to learn so much more about us!",
  skills: ['Lorem ipsum dolor sit', 'Lorem ipsum dolor sit', 'Lorem ipsum dolor sit'],
  experience: [
    {
      title: 'Freelance UX/UI designer',
      company: 'Lorem ipsum',
      location: 'Lorem ipsum',
      period: 'Jun 2022 — Present',
      duration: '1 yrs 02 mos',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus eros eu vehicula interdum. Cras nec ultricies massa. Curabitur rutrum, diam id consequat consequat',
      logoColor: '#FAA12E'
    },
    {
      title: 'UX/UI designer',
      company: 'Lorem ipsum',
      location: 'Lorem ipsum',
      period: 'Jun 2022 — Present',
      duration: '3 mos',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus eros eu vehicula interdum.',
      logoColor: '#007AB9'
    }
  ],
  education: [
    {
      institution: 'Bangalore University',
      degree: 'B.Sc. in Environmental Science',
      period: '2021 - 2024'
    }
  ],
  posts: [
    {
      id: "1",
      authorName: "Tejinder Singh",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      followers: "10k",
      time: "1d",
      content: "How about adding some information about this post here, eh? Maybe a nice SEO-optimized caption? Get your social media manager onboard!",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
    },
    {
      id: "2",
      authorName: "Tejinder Singh",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      followers: "10k",
      time: "1d",
      content: "How about adding some information about this post here, eh? Maybe a nice SEO-optimized caption? Get your social media manager onboard!",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
    }
  ],
  viewedPages: [
    {
      id: "1",
      name: "Page Optional",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/600px-Volkswagen_logo_2019.svg.png",
      industry: "Cars and Insurance",
      followers: "80 followers"
    },
    {
      id: "2",
      name: "Another optional page",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
      industry: "Cars and Insurance",
      followers: "120 followers"
    },
    {
      id: "3",
      name: "A third optional page",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_logo.svg/2048px-Mercedes-Benz_logo.svg.png",
      industry: "Cars and Insurance",
      followers: "120 followers"
    }
  ],
  peopleKnown: [
    {
      id: "1",
      name: "Karl Mill",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      info: "User information"
    }
  ],
  recommendations: [
    {
      id: "1",
      title: "Lorem ipsum dolor sit amet",
      views: "17,963 viewers",
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
    },
    {
      id: "2",
      title: "Lorem ipsum dolor sit amet",
      views: "4,598 viewers",
      thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "3",
      title: "Lorem ipsum dolor sit amet",
      views: "31,258 viewers",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
    }
  ]
};
