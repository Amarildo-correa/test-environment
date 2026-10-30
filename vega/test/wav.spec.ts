import { encodeWav, pcm16Level } from '../src/speech/wav';

function pcm(...samples: number[]): Uint8Array {
  const bytes = new Uint8Array(samples.length * 2);
  const view = new DataView(bytes.buffer);
  samples.forEach((sample, i) => view.setInt16(i * 2, sample, true));
  return bytes;
}

describe('encodeWav', () => {
  it('monta o cabeçalho WAV de 44 bytes e junta os blocos', () => {
    const wav = encodeWav([pcm(1, 2), pcm(3)], 16000, 1);
    const view = new DataView(wav);
    const tag = (offset: number) =>
      String.fromCharCode(...new Uint8Array(wav, offset, 4));

    expect(wav.byteLength).toBe(44 + 6);
    expect(tag(0)).toBe('RIFF');
    expect(view.getUint32(4, true)).toBe(36 + 6);
    expect(tag(8)).toBe('WAVE');
    expect(tag(12)).toBe('fmt ');
    expect(view.getUint16(20, true)).toBe(1); // PCM
    expect(view.getUint16(22, true)).toBe(1); // canais
    expect(view.getUint32(24, true)).toBe(16000);
    expect(view.getUint32(28, true)).toBe(32000); // bytes por segundo
    expect(view.getUint16(34, true)).toBe(16);
    expect(tag(36)).toBe('data');
    expect(view.getUint32(40, true)).toBe(6);
    expect([44, 46, 48].map(o => view.getInt16(o, true))).toEqual([1, 2, 3]);
  });
});

describe('pcm16Level', () => {
  it('silêncio dá volume zero', () => {
    expect(pcm16Level(pcm(0, 0, 0, 0))).toEqual({ rms: 0, peak: 0 });
  });

  it('onda cheia dá volume e pico máximos', () => {
    const { rms, peak } = pcm16Level(pcm(-32768, -32768));
    expect(rms).toBeCloseTo(1);
    expect(peak).toBeCloseTo(1);
  });

  it('bloco vazio dá zero', () => {
    expect(pcm16Level(new Uint8Array(0))).toEqual({ rms: 0, peak: 0 });
  });
});
