import {
  GenerateContentRequest,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
  ModelParams,
  Tool,
} from '@google/generative-ai';
import { getEnv } from './environment';

export interface AiManager {
  generate(input: any): Promise<any>;
}

export class GeminiManager implements AiManager {
  private model: GenerativeModel | null = null;

  public async generate(input: GenerateContentRequest): Promise<GenerateContentResult> {
    if (!this.model) {
      throw new Error('Gemini AI model is not initialized');
    }
    return await this.model.generateContent(input);
  }

  public init(
    { withGoogleSearch }: { withGoogleSearch: boolean } = { withGoogleSearch: false }
  ): GeminiManager {
    const [GEMINI_API_KEY] = getEnv('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Missing Gemini API Key');
    }
    const modelSetup: ModelParams = { model: 'gemini-2.0-flash' };

    if (withGoogleSearch) {
      modelSetup.tools = [{ googleSearch: {} } as unknown as Tool];
    }

    const genAi = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = genAi.getGenerativeModel(modelSetup);

    return this;
  }
}
