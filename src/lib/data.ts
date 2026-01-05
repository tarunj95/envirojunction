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
  name: 'Alex Doe',
  headline: 'Aspiring Environmentalist',
  location: 'Bangalore, India',
  skills: ['Data Analysis', 'Research', 'Community Outreach', 'Waste Management', 'Clean Energy'],
  avatarUrl: 'https://picsum.photos/seed/user/100/100',
  avatarHint: 'person face',
  about: "Passionate about making a difference in the environmental sector. Eager to learn and contribute to projects related to waste management and clean energy. Currently seeking internship opportunities to apply my skills in a practical setting.",
  experience: [
    {
      title: 'Volunteer',
      company: 'Green Bangalore Initiative',
      period: 'Jan 2023 - May 2023',
      description: 'Participated in tree planting drives and community awareness campaigns about waste segregation.'
    }
  ],
  education: [
    {
      institution: 'Bangalore University',
      degree: 'B.Sc. in Environmental Science',
      period: '2021 - 2024'
    }
  ]
};
