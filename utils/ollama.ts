/**
 * Utility functions for interacting with the Ollama API
 */

// Base URL for Ollama API
const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Generate text using the Ollama API
 * @param model The model to use (e.g., 'llama3')
 * @param prompt The prompt to send to the model
 * @param systemPrompt The optional system prompt to guide the model's behavior
 * @returns The generated text
 */
export async function generateText(
  model: string = 'llama3',
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    const requestBody: any = {
      model: model,
      prompt: prompt,
      stream: false,
    };

    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}

/**
 * Generate text and parse it as JSON
 * @param model The model to use (e.g., 'llama3')
 * @param prompt The prompt to send to the model
 * @param systemPrompt The optional system prompt to guide the model's behavior
 * @returns The parsed JSON object
 */
export async function generateJSON<T>(
  model: string = 'llama3',
  prompt: string,
  systemPrompt?: string
): Promise<T> {
  try {
    const content = await generateText(model, prompt, systemPrompt);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(content) as T;
    } catch (parseError) {
      console.error('Error parsing Ollama response as JSON:', parseError);
      
      // Attempt to extract JSON from the response text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as T;
        } catch (e) {
          console.error('Error parsing extracted JSON:', e);
        }
      }
      
      throw new Error('Failed to parse response as JSON');
    }
  } catch (error) {
    console.error('Error generating JSON with Ollama:', error);
    throw error;
  }
}

/**
 * Get a list of available models from the Ollama API
 * @returns Array of model names
 */
export async function listModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.models?.map((model: any) => model.name) || [];
  } catch (error) {
    console.error('Error listing Ollama models:', error);
    throw error;
  }
} 