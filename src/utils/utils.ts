export interface ParsedAgentResponse {
  jsonData?: Record<string, any>;
  textResponse: string;
}

export function parseAgentResponse(response: string): ParsedAgentResponse {
  const jsonRegex = /```json([\s\S]*?)```/;
  const jsonMatch = response.match(jsonRegex);

  let jsonData: Record<string, any> | undefined;
  let textResponse = response;

  if (jsonMatch && jsonMatch[1]) {
    try {
      jsonData = JSON.parse(jsonMatch[1].trim());
      // Eliminar la parte del JSON del texto de respuesta
      textResponse = response.replace(jsonRegex, '').trim();
    } catch (error) {
      console.error('Error parsing JSON from agent response:', error);
    }
  }

  return {
    jsonData,
    textResponse,
  };
}
