import { AiManager, GeminiManager } from '../../utils/ai-manager';
import {
  AIGenerationFailedErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { generateCardsSchema } from '../../../common/validators/ai';
import {
  GenerateCardsRequest,
  GenerateCardsResponse,
  GeneratedCard,
} from '../../../common/types/ai';
import { getPromptForCards } from '../../utils/ai-prompts';

export async function generateCards(req: Request, ai: AiManager): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const requestBody = await req.json();

    try {
      await generateCardsSchema.validate(requestBody);
    } catch (e: any) {
      console.log(e);
      return new ValidationErrorResponse(e);
    }

    const prompt = getPromptForCards(requestBody as GenerateCardsRequest);
    const aiResponse = await (ai as GeminiManager).generate({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        candidateCount: 1,
        maxOutputTokens: 8192,
        temperature: 1,
        topP: 0.95,
        topK: 40,
      },
    });
    const candidates = aiResponse?.response?.candidates;
    if (!candidates?.length || !candidates[0].content.parts?.[0]?.text?.length)
      return new AIGenerationFailedErrorResponse({});

    const cards = JSON.parse(candidates[0].content.parts[0].text).map(
      (card: Partial<GeneratedCard>) => ({
        ...card,
        targetAlt: card.targetAlt ?? null,
      })
    );

    const response = {
      cards,
    };

    return new OkResponse<GenerateCardsResponse>(response);
  } catch (e) {
    return new AIGenerationFailedErrorResponse(e);
  }
}
