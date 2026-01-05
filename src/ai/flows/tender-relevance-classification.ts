'use server';

/**
 * @fileOverview Classifies tenders based on their relevance to user interests.
 *
 * - classifyTenderRelevance - A function that classifies tender relevance.
 * - ClassifyTenderRelevanceInput - The input type for the classifyTenderRelevance function.
 * - ClassifyTenderRelevanceOutput - The return type for the classifyTenderRelevance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyTenderRelevanceInputSchema = z.object({
  tenderDetails: z
    .string()
    .describe('Details of the tender including title and description.'),
  userInterests: z.string().describe('The user interests to match against.'),
});
export type ClassifyTenderRelevanceInput =
  z.infer<typeof ClassifyTenderRelevanceInputSchema>;

const ClassifyTenderRelevanceOutputSchema = z.object({
  isRelevant: z
    .boolean()
    .describe(
      'Whether the tender is relevant to the user interests or not.'
    ),
  reason: z
    .string()
    .describe('The reason for the tender being relevant or irrelevant.'),
});
export type ClassifyTenderRelevanceOutput =
  z.infer<typeof ClassifyTenderRelevanceOutputSchema>;

export async function classifyTenderRelevance(
  input: ClassifyTenderRelevanceInput
): Promise<ClassifyTenderRelevanceOutput> {
  return classifyTenderRelevanceFlow(input);
}

const classifyTenderRelevancePrompt = ai.definePrompt({
  name: 'classifyTenderRelevancePrompt',
  input: {schema: ClassifyTenderRelevanceInputSchema},
  output: {schema: ClassifyTenderRelevanceOutputSchema},
  prompt: `You are an AI assistant helping users to classify tenders based on
  their relevance to the user interests.

  Given the following tender details:
  {{tenderDetails}}

  And the following user interests:
  {{userInterests}}

  Determine if the tender is relevant to the user interests. Return a
  boolean value for isRelevant field, and provide a brief explanation for the
  reason field.
  `,
});

const classifyTenderRelevanceFlow = ai.defineFlow(
  {
    name: 'classifyTenderRelevanceFlow',
    inputSchema: ClassifyTenderRelevanceInputSchema,
    outputSchema: ClassifyTenderRelevanceOutputSchema,
  },
  async input => {
    const {output} = await classifyTenderRelevancePrompt(input);
    return output!;
  }
);
