/**
 * Utility to extract and assign relevant environmental tags and sector metadata to jobs, tenders, and profiles.
 */

export function getJobEnvironmentalTags(job: {
  title?: string;
  description?: string;
  organisation?: string;
  company?: string;
  requirements?: string;
  responsibilities?: string;
  job_type?: string;
  type?: string;
}): string[] {
  const text = `${job.title || ''} ${job.description || ''} ${job.organisation || job.company || ''} ${job.requirements || ''} ${job.responsibilities || ''} ${job.job_type || job.type || ''}`.toLowerCase();
  const tags: string[] = [];

  const mappings: { keyword: RegExp; tag: string }[] = [
    { keyword: /\b(solar|clean energy|photovoltaic|renewables?|wind|green hydrogen|energy transition)\b/, tag: 'Renewable Energy' },
    { keyword: /\b(climate|greenhouse|ghg|carbon|net zero|emissions?|climate change)\b/, tag: 'Climate & Carbon' },
    { keyword: /\b(water|hydrology|remediation|sanitation|river|aquatic|effluent)\b/, tag: 'Water Resources' },
    { keyword: /\b(ecolog(y|ical)|wildlife|biodiversity|forest(ry|s)?|habitat|species|conservation)\b/, tag: 'Ecology & Biodiversity' },
    { keyword: /\b(waste|circular economy|recycl(ing|e)|plastic|solid waste|compost)\b/, tag: 'Waste & Circularity' },
    { keyword: /\b(policy|governance|advocacy|regulatory|legislation|compliance|public policy)\b/, tag: 'Policy & Governance' },
    { keyword: /\b(gis|remote sensing|spatial|mapping|geospatial|data analysis|python|modelling)\b/, tag: 'GIS & Mapping' },
    { keyword: /\b(esg|sustainability|corporate responsibility|csr|auditing)\b/, tag: 'ESG & Sustainability' },
    { keyword: /\b(graphic|visual|design|communications?|media|outreach|editorial|digital)\b/, tag: 'Communications' },
    { keyword: /\b(research|fellow|scientist|analyst|survey|evaluation|policy research)\b/, tag: 'Research & Analysis' },
    { keyword: /\b(urban|smart cit(y|ies)|transport|mobility|electric vehicle|ev)\b/, tag: 'Sustainable Mobility' },
    { keyword: /\b(intern|internship|trainee|apprentice)\b/, tag: 'Internship' },
  ];

  for (const { keyword, tag } of mappings) {
    if (keyword.test(text) && !tags.includes(tag)) {
      tags.push(tag);
      if (tags.length >= 3) break;
    }
  }

  // Ensure minimum relevant tags
  if (tags.length === 0) {
    tags.push('Environmental Science', 'Sustainability');
  } else if (tags.length === 1) {
    tags.push('Sustainability');
  }

  return tags;
}

export function getTenderSectorTag(tender: {
  title?: string;
  details?: string;
  organization?: string;
}): string {
  const text = `${tender.title || ''} ${tender.details || ''} ${tender.organization || ''}`.toLowerCase();
  
  if (/solar|photovoltaic|renewable|wind|clean energy/.test(text)) return 'Solar & Clean Energy';
  if (/water|sanitation|effluent|river|sewage|remediation/.test(text)) return 'Water & Sanitation';
  if (/electric vehicle|ev|bus|transport|mobility/.test(text)) return 'Electric Mobility';
  if (/waste|recycl|biogas|solid waste/.test(text)) return 'Waste Management';
  if (/forest|biodiversity|afforestation|wildlife|tree/.test(text)) return 'Forestry & Biodiversity';
  if (/hydrogen|electrolyzer/.test(text)) return 'Green Hydrogen';

  return 'Clean Infrastructure';
}
