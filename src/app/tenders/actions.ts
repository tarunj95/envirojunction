"use server";

import { classifyTenderRelevance } from "@/ai/flows/tender-relevance-classification";
import { currentUser } from "@/lib/data";

export async function getTenderRelevance(tenderDetails: string) {
  // For demonstration, we'll use the mock current user's skills and 'about' section as interests.
  // In a real app, this would come from the logged-in user's profile.
  const userInterests = `User's professional skills are: ${currentUser.skills.join(", ")}. User's professional summary: ${currentUser.about}`;

  try {
    const result = await classifyTenderRelevance({
      tenderDetails,
      userInterests,
    });
    return result;
  } catch (error) {
    console.error("Error classifying tender relevance:", error);
    // Return a structured error to the client
    return { isRelevant: null, reason: "Could not analyze tender due to an internal error." };
  }
}
