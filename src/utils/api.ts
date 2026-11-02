/**
 * Client service to communicate with the server-side callLLM endpoint
 */
export async function callAgentLLM(prompt: string, data: any, agentName: string): Promise<any> {
  const response = await fetch('/api/call-llm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      data,
      agentName,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${response.status}: Failed to call ${agentName}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || `Generation failed for ${agentName}`);
  }

  return result.result;
}
