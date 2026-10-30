// Serviço de transcrição. O Vega só entrega o áudio gravado, sem
// reconhecimento de fala, então o texto vem de um servidor seu.
//
// `url` recebe um POST com o WAV no corpo (Content-Type: audio/wav) e deve
// responder JSON no formato { "text": "..." }. Deixe a chave da API de
// reconhecimento nesse servidor: este repositório é público e o app roda na
// TV, então nada secreto pode ficar aqui.
export const transcription = {
  url: '',
  language: 'pt-BR',
  timeoutMs: 20000,
};
