
'use server';

import { z } from 'zod';

const LeadSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  name: z.string().min(2, 'Name must be at least 2 characters.').optional(),
});

export async function saveLead(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  const result = LeadSchema.safeParse({ email, name });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  // Simulating Firestore storage delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`[Lead Captured] Name: ${name || 'N/A'}, Email: ${email}`);

  return { success: true };
}
