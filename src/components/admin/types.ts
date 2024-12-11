export interface AIPersonality {
  id: string;
  name: string;
  description: string | null;
  provider: string;
  system_prompt: string;
}