// Utilitários de áudio PCM de 16 bits: empacotar em WAV para enviar à
// transcrição e medir o volume para o indicador da tela Gravar.

const HEADER_BYTES = 44;
const BITS_PER_SAMPLE = 16;

function writeAscii(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

// Cabeçalho RIFF/WAVE de 44 bytes seguido dos blocos PCM, na ordem.
export function encodeWav(
  chunks: Uint8Array[],
  sampleRate: number,
  channels: number,
): ArrayBuffer {
  const dataBytes = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const blockAlign = (channels * BITS_PER_SAMPLE) / 8;
  const buffer = new ArrayBuffer(HEADER_BYTES + dataBytes);
  const view = new DataView(buffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // tamanho do bloco fmt
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, BITS_PER_SAMPLE, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataBytes, true);

  const bytes = new Uint8Array(buffer);
  let offset = HEADER_BYTES;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}

// Volume (RMS) e pico de um bloco PCM 16 bits little-endian, de 0 a 1.
export function pcm16Level(chunk: Uint8Array): { rms: number; peak: number } {
  const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  const samples = Math.floor(chunk.byteLength / 2);
  if (samples === 0) {
    return { rms: 0, peak: 0 };
  }
  let sumSquares = 0;
  let peak = 0;
  for (let i = 0; i < samples; i++) {
    const sample = Math.abs(view.getInt16(i * 2, true)) / 32768;
    sumSquares += sample * sample;
    if (sample > peak) {
      peak = sample;
    }
  }
  return { rms: Math.sqrt(sumSquares / samples), peak };
}
