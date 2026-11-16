/**
 * Calculates the completion percentage of a user's profile.
 * Total possible: 100%.
 * Required for Home access: > 70%.
 */
export function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  let score = 0;

  // Name: 10%
  if (profile.name && typeof profile.name === 'string' && profile.name.trim().length > 0) {
    score += 10;
  }

  // Job Title / Role: 10%
  const title = profile.title || profile.role;
  if (title && typeof title === 'string' && title.trim().length > 0) {
    score += 10;
  }

  // Headline: 15%
  if (profile.headline && typeof profile.headline === 'string' && profile.headline.trim().length > 0) {
    score += 15;
  }

  // About / Bio: 15%
  const about = profile.about || profile.bio;
  if (about && typeof about === 'string' && about.trim().length > 0) {
    score += 15;
  }

  // Phone Number: 10%
  if (profile.phone && typeof profile.phone === 'string' && profile.phone.trim().length > 0) {
    score += 10;
  }

  // Professional Skills: 15%
  const skills = profile.professional_skills || (Array.isArray(profile.skills) ? profile.skills : (profile.skills ? [profile.skills] : []));
  if (Array.isArray(skills) && skills.length > 0) {
    score += 15;
  }

  // Work Experience: 15%
  const exps = profile.work_experience || profile.experiences;
  if (Array.isArray(exps) && exps.length > 0) {
    score += 15;
  }

  // Education: 10%
  const edus = profile.education || profile.educations;
  if (Array.isArray(edus) && edus.length > 0) {
    score += 10;
  }

  return Math.min(100, score);
}

