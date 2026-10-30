import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MicButton } from '../components/MicButton';
import {
  MicrophoneDeniedError,
  startRecording,
} from '../speech/recorder';
import type { RecorderSession, Recording } from '../speech/recorder';
import {
  transcribe,
  TranscriptionNotConfiguredError,
} from '../speech/transcribe';
import { colors, px, safeArea, text, typography } from '../theme';

type Phase = 'idle' | 'starting' | 'recording' | 'transcribing';
type Message = { kind: 'hint' | 'text' | 'error'; body: string };

// Pico abaixo disso é silêncio: o microfone abriu, mas não chegou som.
const SILENCE_PEAK = 0.004;

const HINT: Message = {
  kind: 'hint',
  body: 'Aperte o microfone, fale e aperte de novo para parar.',
};

function describe(recording: Recording): string {
  const seconds = (recording.durationMs / 1000).toFixed(1).replace('.', ',');
  const level = Math.round(recording.averageLevel * 100);
  return `Áudio de ${seconds} s · volume médio ${level}%`;
}

function errorMessage(error: unknown): Message {
  if (error instanceof MicrophoneDeniedError) {
    return {
      kind: 'error',
      body: 'Sem permissão para o microfone. Autorize para gravar.',
    };
  }
  if (error instanceof TranscriptionNotConfiguredError) {
    return {
      kind: 'error',
      body: 'O áudio foi gravado, mas ainda não há um servidor de transcrição configurado (src/speech/config.ts).',
    };
  }
  const detail = error instanceof Error ? ` (${error.message})` : '';
  return { kind: 'error', body: `Não foi possível concluir a gravação${detail}.` };
}

// Tela aberta pelo botão Gravar da Home: o botão de microfone no rodapé abre
// o microfone, e o texto falado aparece no meio da tela.
export function RecordScreen() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [level, setLevel] = useState(0);
  const [message, setMessage] = useState<Message>(HINT);
  const [stats, setStats] = useState('');
  const session = useRef<RecorderSession | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      session.current?.stop();
    };
  }, []);

  const handleLevel = useCallback((value: number) => {
    if (mounted.current) {
      setLevel(value);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (phase === 'recording') {
      session.current?.stop();
      return;
    }
    if (phase !== 'idle') {
      return;
    }

    setPhase('starting');
    setMessage(HINT);
    setStats('');
    try {
      const current = await startRecording(handleLevel);
      session.current = current;
      if (!mounted.current) {
        current.stop();
        return;
      }
      setPhase('recording');

      const recording = await current.finished;
      session.current = null;
      if (!mounted.current) {
        return;
      }
      setLevel(0);
      setStats(describe(recording));
      if (recording.peakLevel < SILENCE_PEAK) {
        setMessage({
          kind: 'error',
          body: 'O microfone abriu, mas não captou som. Confira se o controle de voz está ativo.',
        });
        return;
      }

      setPhase('transcribing');
      const spoken = await transcribe(recording.wav);
      setMessage(
        spoken === ''
          ? { kind: 'error', body: 'Não entendi. Tente falar de novo.' }
          : { kind: 'text', body: spoken },
      );
    } catch (error) {
      session.current = null;
      if (mounted.current) {
        setMessage(errorMessage(error));
      }
    } finally {
      if (mounted.current) {
        setPhase('idle');
        setLevel(0);
      }
    }
  }, [phase, handleLevel]);

  const recording = phase === 'recording';
  const busy = phase === 'starting' || phase === 'transcribing';
  const meterFill = useMemo(
    () => [styles.meterFill, { width: `${Math.min(level * 400, 100)}%` as const }],
    [level],
  );

  let status = '';
  if (phase === 'starting') {
    status = 'Abrindo o microfone…';
  } else if (recording) {
    status = 'Ouvindo…';
  } else if (phase === 'transcribing') {
    status = 'Transcrevendo…';
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Gravar</Text>

      <View style={styles.center}>
        {status !== '' ? (
          <Text style={styles.status}>{status}</Text>
        ) : (
          <Text
            style={
              message.kind === 'text'
                ? styles.transcript
                : message.kind === 'error'
                  ? styles.error
                  : styles.hint
            }
          >
            {message.body}
          </Text>
        )}
        {recording && (
          <View style={styles.meter}>
            <View style={meterFill} />
          </View>
        )}
        {stats !== '' && !recording && <Text style={styles.stats}>{stats}</Text>}
      </View>

      <View style={styles.footer}>
        <MicButton
          onPress={toggle}
          recording={recording}
          disabled={busy}
          hasTVPreferredFocus
        />
        <Text style={styles.caption}>
          {recording ? 'Aperte OK para parar' : 'Aperte OK para gravar'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: safeArea.horizontal,
    paddingVertical: safeArea.vertical,
  },
  title: text(typography.displaySm, colors.primary, '700'),
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    ...text(typography.bodyLg, colors.textMedium),
    textAlign: 'center',
    maxWidth: px(1300),
  },
  status: text(typography.displaySm, colors.textHigh, '700'),
  transcript: {
    ...text(typography.displaySm, colors.textHigh, '700'),
    textAlign: 'center',
    maxWidth: px(1500),
  },
  error: {
    ...text(typography.bodyLg, colors.recording),
    textAlign: 'center',
    maxWidth: px(1300),
  },
  stats: {
    ...text(typography.bodyMd, colors.textMedium),
    marginTop: px(32),
  },
  meter: {
    width: px(700),
    height: px(14),
    borderRadius: px(7),
    backgroundColor: colors.surface,
    marginTop: px(40),
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  footer: {
    alignItems: 'center',
  },
  caption: {
    ...text(typography.labelMd, colors.textMedium),
    marginTop: px(16),
  },
});
