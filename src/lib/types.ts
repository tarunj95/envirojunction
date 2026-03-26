export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  publishedDate: string;
  imageUrl: string;
  imageHint: string;
  summary: string;
  category: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time";
  postedDate: string;
  description: string;
  logoUrl: string;
  logoHint: string;
};

export type Tender = {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  details: string;
  value: string;
};

export type Professional = {
  id: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  avatarUrl: string;
  avatarHint: string;
};

export type FreelanceProject = {
  id: string;
  title: string;
  client: string;
  budget: string;
  deadline: string;
  description: string;
  skills: string[];
};

export type UserProfile = {
  name: string;
  headline: string;
  location: string;
  followers: string;
  employees: string;
  skills: string[];
  avatarUrl: string;
  avatarHint: string;
  about: string;
  experience: {
    title: string;
    company: string;
    period: string;
    duration: string;
    location: string;
    description: string;
    logoColor: string;
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
  posts: {
    id: string;
    authorName: string;
    authorAvatar: string;
    followers: string;
    time: string;
    content: string;
    imageUrl: string;
  }[];
  viewedPages: {
    id: string;
    name: string;
    logo: string;
    industry: string;
    followers: string;
  }[];
  peopleKnown: {
    id: string;
    name: string;
    avatar: string;
    info: string;
  }[];
  recommendations: {
    id: string;
    title: string;
    views: string;
    thumbnail: string;
  }[];
};
