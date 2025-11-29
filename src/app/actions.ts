'use server';

import { intelligentThreadCountAdjustment } from '@/ai/flows/intelligent-thread-count-adjustment';
import { z } from 'zod';

const formSchema = z.object({
  historicalLoadData: z.string().min(1, 'Please provide more detailed historical data.'),
  currentUsageMetrics: z.string().min(1, 'Please provide more detailed current metrics.'),
  applicationNeeds: z.string().min(10, 'Please describe application needs in more detail.'),
});

interface FormState {
  message: string;
  errors: Record<string, string[]> | null;
  data: {
    recommendedThreadCount: number;
    reasoning: string;
  } | null;
}

export async function getRecommendedThreads(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const input = {
      historicalLoadData: formData.get('historicalLoadData'),
      currentUsageMetrics: formData.get('currentUsageMetrics'),
      applicationNeeds: formData.get('applicationNeeds'),
    };

    const validatedFields = formSchema.safeParse(input);

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data. Please check the fields below.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    const result = await intelligentThreadCountAdjustment(validatedFields.data);
    
    return {
      message: 'Success',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
      data: null,
    };
  }
}
