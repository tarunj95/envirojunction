'use server';
/**
 * @fileOverview A Genkit flow for generating motivational fitness tips or workout suggestions.
 *
 * - generateAIFitnessTip - A function that handles the generation of fitness tips.
 * - AIFitnessTipInput - The input type for the generateAIFitnessTip function.
 * - AIFitnessTipOutput - The return type for the generateAIFitnessTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIFitnessTipInputSchema = z.object({
  topic: z.string().optional().describe('An optional topic or area of focus for the fitness tip (e.g., "cardio", "strength", "mindfulness").'),
});
export type AIFitnessTipInput = z.infer<typeof AIFitnessTipInputSchema>;

const AIFitnessTipOutputSchema = z.object({
  tip: z.string().describe('A concise, motivational fitness tip or workout suggestion.'),
});
export type AIFitnessTipOutput = z.infer<typeof AIFitnessTipOutputSchema>;

export async function generateAIFitnessTip(input: AIFitnessTipInput): Promise<AIFitnessTipOutput> {
  return aiFitnessTipGeneratorFlow(input);
}

const aiFitnessTipPrompt = ai.definePrompt({
  name: 'aiFitnessTipPrompt',
  input: {schema: AIFitnessTipInputSchema},
  output: {schema: AIFitnessTipOutputSchema},
  prompt: `You are a highly motivating fitness coach.
Generate a concise, motivational fitness tip or a quick workout suggestion that is encouraging and actionable.

{{#if topic}}
Focus on the topic of: {{{topic}}}
{{/if}}
`,
});

const aiFitnessTipGeneratorFlow = ai.defineFlow(
  {
    name: 'aiFitnessTipGeneratorFlow',
    inputSchema: AIFitnessTipInputSchema,
    outputSchema: AIFitnessTipOutputSchema,
  },
  async (input) => {
    const {output} = await aiFitnessTipPrompt(input);
    return output!;
  }
);
