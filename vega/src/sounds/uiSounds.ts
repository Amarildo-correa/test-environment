import { AppState } from 'react-native';
import {
  AudioChannelMask,
  AudioContentType,
  AudioFlags,
  AudioManager,
  AudioPlaybackStream,
  AudioPlaybackStreamBuilder,
  AudioSampleFormat,
  AudioSampleRate,
  AudioUsageType,
} from '@amazon-devices/keplerscript-audio-lib';

// Sons de interface sintetizados no próprio código, como na Web Audio API:
// tons senoidais curtos com ataque rápido e decaimento exponencial, gerados
// uma vez em PCM 16 bits e tocados por um único AudioPlaybackStream da
// Amazon. Não há arquivos de áudio no pacote.

export type UiSound = 'move' | 'select' | 'back';

const SAMPLE_RATE = 48000;

type Note = { frequency: number; durationMs: number };

function synthesize(notes: Note[], gain: number): ArrayBuffer {
  const total = notes.reduce(
    (sum, note) => sum + Math.round((note.durationMs / 1000) * SAMPLE_RATE),
    0,
  );
  const samples = new Int16Array(total);
  let offset = 0;
  for (const note of notes) {
    const length = Math.round((note.durationMs / 1000) * SAMPLE_RATE);
    const attack = Math.round(0.002 * SAMPLE_RATE);
    for (let i = 0; i < length; i++) {
      const t = i / SAMPLE_RATE;
      // Envelope: sobe em 2 ms e cai exponencialmente até o fim da nota.
      const envelope =
        i < attack ? i / attack : Math.exp((-5 * (i - attack)) / length);
      const value = Math.sin(2 * Math.PI * note.frequency * t) * envelope * gain;
      samples[offset + i] = Math.round(value * 32767);
    }
    offset += length;
  }
  return samples.buffer;
}

const sounds: Record<UiSound, ArrayBuffer> = {
  // Tique curto e suave a cada movimento do direcional.
  move: synthesize([{ frequency: 1600, durationMs: 35 }], 0.15),
  // OK: duas notas subindo (Lá 5 → Mi 6).
  select: synthesize(
    [
      { frequency: 880, durationMs: 45 },
      { frequency: 1320, durationMs: 70 },
    ],
    0.2,
  ),
  // Voltar: as mesmas notas descendo.
  back: synthesize(
    [
      { frequency: 1320, durationMs: 45 },
      { frequency: 880, durationMs: 70 },
    ],
    0.2,
  ),
};

let stream: AudioPlaybackStream | null = null;
let opening: Promise<AudioPlaybackStream | null> | null = null;
let enabled = true;
let lastPlayAt = 0;

async function openStream(): Promise<AudioPlaybackStream | null> {
  try {
    // Respeita a opção do Fire TV de desligar os sons do sistema.
    enabled = await AudioManager.areSystemSoundsEnabledAsync().catch(
      () => true,
    );
    const builder = new AudioPlaybackStreamBuilder();
    builder.setAudioConfig({
      sampleRate: AudioSampleRate.SAMPLE_RATE_48_KHZ,
      channelMask: AudioChannelMask.CHANNEL_MONO,
      format: AudioSampleFormat.FORMAT_PCM_16_BIT,
    });
    builder.setAudioAttributes({
      contentType: AudioContentType.CONTENT_TYPE_SONIFICATION,
      usage: AudioUsageType.USAGE_SYSTEM,
      flags: AudioFlags.FLAG_NONE,
      tag: 'hellotv-ui-sounds',
    });
    // Buffers pequenos para o som sair logo depois da tecla.
    builder.setFramesPerBuffer(512);
    const created = await builder.buildAsync();
    await created.startAsync();
    stream = created;
    return created;
  } catch (error) {
    console.error('[Sons] não foi possível abrir o áudio:', error);
    return null;
  } finally {
    opening = null;
  }
}

async function closeStream() {
  const current = stream;
  stream = null;
  if (current) {
    await AudioPlaybackStreamBuilder.destroyAsync(current).catch(() => {});
  }
}

// O stream é fechado quando o app vai para segundo plano e reaberto no
// primeiro som depois de voltar.
AppState.addEventListener('change', state => {
  if (state !== 'active') {
    closeStream();
  }
});

export async function playUiSound(sound: UiSound) {
  // Repetições muito rápidas (direcional segurado) viram um tique só a cada
  // 60 ms, para os sons não se acumularem no buffer.
  const now = Date.now();
  if (now - lastPlayAt < 60) {
    return;
  }
  lastPlayAt = now;

  const current = stream ?? (await (opening ??= openStream()));
  if (!current || !enabled) {
    return;
  }
  current.writeAsync(sounds[sound]).catch(error => {
    console.error('[Sons] falha ao tocar:', error);
  });
}
