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
    id: '1',
    name: 'Dr. Anjali Sharma',
    headline: 'Environmental Scientist & Water Remediation Expert',
    location: 'Pune, India',
    skills: ['Water Quality Analysis', 'Soil Remediation', 'Environmental Policy', 'Climate Modeling'],
    avatarUrl: 'https://picsum.photos/seed/prof1/100/100',
    avatarHint: 'person portrait'
  },
  {
    id: '2',
    name: 'Rohan Verma',
    headline: 'Renewable Energy Consultant & Solar Specialist',
    location: 'Hyderabad, India',
    skills: ['Solar PV Design', 'Energy Auditing', 'Project Management', 'Grid Integration'],
    avatarUrl: 'https://picsum.photos/seed/prof2/100/100',
    avatarHint: 'person portrait'
  },
  {
    id: '3',
    name: 'Priya Mehta',
    headline: 'Green Building Architect & LEED AP',
    location: 'Mumbai, India',
    skills: ['Sustainable Design', 'LEED Certification', 'BIM', 'Urban Planning'],
    avatarUrl: 'https://picsum.photos/seed/prof3/100/100',
    avatarHint: 'person portrait'
  },
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
