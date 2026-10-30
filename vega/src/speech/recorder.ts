import {
  AudioChannelMask,
  AudioRecordStreamBuilder,
  AudioSampleFormat,
  AudioSampleRate,
  AudioSource,
} from '@amazon-devices/keplerscript-audio-lib';
import {
  PrivilegeState,
  SecurityManager,
} from '@amazon-devices/security-manager-lib';
import { encodeWav, pcm16Level } from './wav';

// O microfone é um privilégio de execução: declarado no manifest.toml e
// autorizado pelo usuário na primeira gravação.
const MICROPHONE_PRIVILEGE = 'com.amazon.audio.privilege.microphone.access';

// Teto de uma gravação, para não encher a memória do app (420 MB no Vega).
export const MAX_RECORDING_MS = 30000;

export type Recording = {
  wav: ArrayBuffer;
  durationMs: number;
  // Volume médio e pico, de 0 a 1. Pico ~0 significa que só chegou silêncio.
  averageLevel: number;
  peakLevel: number;
};

export type RecorderSession = {
  // Pede para parar; `finished` resolve quando o último bloco foi lido.
  stop: () => void;
  finished: Promise<Recording>;
};

export class MicrophoneDeniedError extends Error {
  constructor() {
    super('Microfone não autorizado');
    this.name = 'MicrophoneDeniedError';
  }
}

async function ensureMicrophone(): Promise<boolean> {
  const current = await SecurityManager.getPrivilegeState(MICROPHONE_PRIVILEGE);
  if (current === PrivilegeState.ALLOW) {
    return true;
  }
  const requested = await SecurityManager.requestPrivilege(
    MICROPHONE_PRIVILEGE,
  );
  return requested === PrivilegeState.ALLOW;
}

function countChannels(mask: number): number {
  let count = 0;
  for (let bits = mask; bits > 0; bits = Math.floor(bits / 2)) {
    count += bits % 2;
  }
  return Math.max(count, 1);
}

const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Abre o microfone (mono, 16 kHz, 16 bits, fonte de reconhecimento de voz) e
// lê blocos de áudio até `stop()` ou até MAX_RECORDING_MS.
export async function startRecording(
  onLevel: (level: number) => void,
): Promise<RecorderSession> {
  if (!(await ensureMicrophone())) {
    throw new MicrophoneDeniedError();
  }

  const builder = new AudioRecordStreamBuilder();
  builder.setAudioConfig({
    sampleRate: AudioSampleRate.SAMPLE_RATE_16_KHZ,
    channelMask: AudioChannelMask.CHANNEL_MONO,
    format: AudioSampleFormat.FORMAT_PCM_16_BIT,
  });
  builder.setAudioSource(AudioSource.VOICE_RECOGNITION);
  const stream = await builder.buildAsync();

  let running = true;
  const finished = (async (): Promise<Recording> => {
    try {
      const config = await stream.getAudioConfigAsync();
      if (config.format !== AudioSampleFormat.FORMAT_PCM_16_BIT) {
        throw new Error('Formato de áudio inesperado');
      }
      const blockBytes = await stream.getMinBufferSizeInBytesAsync();

      const chunks: Uint8Array[] = [];
      let levelSum = 0;
      let peak = 0;
      const startedAt = Date.now();
      while (running && Date.now() - startedAt < MAX_RECORDING_MS) {
        const chunk = new Uint8Array(await stream.readAsync(blockBytes));
        if (chunk.byteLength === 0) {
          await pause(20);
          continue;
        }
        const { rms, peak: chunkPeak } = pcm16Level(chunk);
        chunks.push(chunk);
        levelSum += rms;
        peak = Math.max(peak, chunkPeak);
        onLevel(rms);
      }

      return {
        wav: encodeWav(
          chunks,
          config.sampleRate,
          countChannels(config.channelMask),
        ),
        durationMs: Date.now() - startedAt,
        averageLevel: chunks.length > 0 ? levelSum / chunks.length : 0,
        peakLevel: peak,
      };
    } finally {
      await AudioRecordStreamBuilder.destroyAsync(stream).catch(() => {});
    }
  })();

  return {
    stop: () => {
      running = false;
    },
    finished,
  };
}
