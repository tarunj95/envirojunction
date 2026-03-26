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
    title: 'Waste Management Specialist',
    company: 'EcoWaste Innovators',
    location: 'Mumbai, India',
    type: 'Full-time',
    postedDate: '2024-07-25',
    description: 'Seeking an experienced specialist to oversee and improve our urban waste management programs.',
    logoUrl: 'https://picsum.photos/seed/logo2/100/100',
    logoHint: 'company logo'
  },
  {
    id: '2',
    title: 'Clean Energy Internship',
    company: 'GreenTech Solutions',
    location: 'Bangalore, India',
    type: 'Internship',
    postedDate: '2024-07-24',
    description: 'An exciting internship opportunity for students passionate about renewable energy technologies.',
    logoUrl: 'https://picsum.photos/seed/logo1/100/100',
    logoHint: 'company logo'
  },
  {
    id: '3',
    title: 'Green Architect',
    company: 'Sustainable Designs Co.',
    location: 'Delhi, India',
    type: 'Full-time',
    postedDate: '2024-07-22',
    description: 'Join our team to design eco-friendly buildings and sustainable urban spaces.',
    logoUrl: 'https://picsum.photos/seed/logo3/100/100',
    logoHint: 'company logo'
  },
];

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
    value: '$300 Million',
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
  name: 'Tejinder Singh',
  headline: 'Ticktech',
  location: 'Via Camilla Cavour, Florence (FI), Tuscany, Italy',
  followers: '10k',
  employees: '200-500',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
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
