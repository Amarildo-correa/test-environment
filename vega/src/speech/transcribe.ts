import { transcription } from './config';

export class TranscriptionNotConfiguredError extends Error {
  constructor() {
    super('Transcrição não configurada');
    this.name = 'TranscriptionNotConfiguredError';
  }
}

// Envia o WAV ao servidor configurado em config.ts e devolve o texto.
export async function transcribe(wav: ArrayBuffer): Promise<string> {
  const { url, language, timeoutMs } = transcription;
  if (url === '') {
    throw new TranscriptionNotConfiguredError();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'audio/wav', 'Accept-Language': language },
      body: wav,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Servidor respondeu ${response.status}`);
    }
    const data: { text?: unknown } = await response.json();
    return typeof data.text === 'string' ? data.text.trim() : '';
  } finally {
    clearTimeout(timer);
  }
}
