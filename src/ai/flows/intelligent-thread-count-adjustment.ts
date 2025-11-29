'use server';

/**
 * @fileOverview Dynamically adjusts the number of threads based on system load and application needs.
 *
 * - intelligentThreadCountAdjustment - A function that handles the thread count adjustment process.
 * - IntelligentThreadCountAdjustmentInput - The input type for the intelligentThreadCountAdjustment function.
 * - IntelligentThreadCountAdjustmentOutput - The return type for the intelligentThreadCountAdjustment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentThreadCountAdjustmentInputSchema = z.object({
  historicalLoadData: z
    .string()
    .describe('Historical data of the system load over a period of time.'),
  currentUsageMetrics: z
    .string()
    .describe('Current system usage metrics such as CPU and memory utilization.'),
  applicationNeeds: z
    .string()
    .describe('Description of the application needs and priorities.'),
});
export type IntelligentThreadCountAdjustmentInput = z.infer<
  typeof IntelligentThreadCountAdjustmentInputSchema
>;

const IntelligentThreadCountAdjustmentOutputSchema = z.object({
  recommendedThreadCount: z
    .number()
    .describe(
      'The recommended number of threads to use based on the analysis of historical load data, current usage metrics, and application needs.'
    ),
  reasoning:
    z.string()
    .describe(
      'The reasoning behind the recommended thread count, explaining how the decision was made based on the input data.'
    ),
});
export type IntelligentThreadCountAdjustmentOutput = z.infer<
  typeof IntelligentThreadCountAdjustmentOutputSchema
>;

export async function intelligentThreadCountAdjustment(
  input: IntelligentThreadCountAdjustmentInput
): Promise<IntelligentThreadCountAdjustmentOutput> {
  return intelligentThreadCountAdjustmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentThreadCountAdjustmentPrompt',
  input: {schema: IntelligentThreadCountAdjustmentInputSchema},
  output: {schema: IntelligentThreadCountAdjustmentOutputSchema},
  prompt: `You are an AI expert in optimizing thread counts for high-performance computing applications.

You will receive historical system load data, current usage metrics, and a description of the application needs.
Based on this information, you will recommend an optimal number of threads to use to maximize efficiency.
Explain your reasoning for the thread count you suggest.

Historical Load Data: {{{historicalLoadData}}}
Current Usage Metrics: {{{currentUsageMetrics}}}
Application Needs: {{{applicationNeeds}}}`,
});

const intelligentThreadCountAdjustmentFlow = ai.defineFlow(
  {
    name: 'intelligentThreadCountAdjustmentFlow',
    inputSchema: IntelligentThreadCountAdjustmentInputSchema,
    outputSchema: IntelligentThreadCountAdjustmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
