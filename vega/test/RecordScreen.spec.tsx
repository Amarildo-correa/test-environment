import 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { RecordScreen } from '../src/screens/RecordScreen';
import {
  MicrophoneDeniedError,
  startRecording,
} from '../src/speech/recorder';
import {
  transcribe,
  TranscriptionNotConfiguredError,
} from '../src/speech/transcribe';

// O microfone e o servidor de transcrição só existem no aparelho.
jest.mock('../src/speech/recorder', () => ({
  startRecording: jest.fn(),
  MicrophoneDeniedError: class MicrophoneDeniedError extends Error {},
}));
jest.mock('../src/speech/transcribe', () => ({
  transcribe: jest.fn(),
  TranscriptionNotConfiguredError: class TranscriptionNotConfiguredError extends Error {},
}));

const mockStart = startRecording as jest.Mock;
const mockTranscribe = transcribe as jest.Mock;

// Gravação falsa: `finished` só resolve quando a tela chama stop().
function fakeRecording(peakLevel: number) {
  let finish: (recording: unknown) => void = () => {};
  const finished = new Promise(resolve => {
    finish = resolve;
  });
  const stop = jest.fn(() =>
    finish({
      wav: new ArrayBuffer(44),
      durationMs: 2500,
      averageLevel: 0.12,
      peakLevel,
    }),
  );
  return { stop, finished };
}

async function recordOnce(screen: ReturnType<typeof render>) {
  fireEvent.press(screen.getByLabelText('Gravar'));
  await act(async () => {});
  fireEvent.press(screen.getByLabelText('Parar gravação'));
  await act(async () => {});
}

beforeEach(() => {
  mockStart.mockReset();
  mockTranscribe.mockReset();
});

describe('RecordScreen', () => {
  it('mostra a dica e o botão de microfone no rodapé', () => {
    const screen = render(<RecordScreen />);
    expect(screen.getByText('Gravar')).toBeTruthy();
    expect(screen.getByText(/Aperte o microfone/)).toBeTruthy();
    expect(screen.getByText('Aperte OK para gravar')).toBeTruthy();
    screen.unmount();
  });

  it('grava, transcreve e mostra o texto falado no meio da tela', async () => {
    const recording = fakeRecording(0.4);
    mockStart.mockResolvedValue(recording);
    mockTranscribe.mockResolvedValue('olá, Fire Stick');
    const screen = render(<RecordScreen />);

    fireEvent.press(screen.getByLabelText('Gravar'));
    await act(async () => {});
    expect(screen.getByText('Ouvindo…')).toBeTruthy();
    expect(screen.getByText('Aperte OK para parar')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Parar gravação'));
    await act(async () => {});
    expect(recording.stop).toHaveBeenCalled();
    expect(mockTranscribe).toHaveBeenCalledTimes(1);
    expect(screen.getByText('olá, Fire Stick')).toBeTruthy();
    expect(screen.getByText('Áudio de 2,5 s · volume médio 12%')).toBeTruthy();
    screen.unmount();
  });

  it('avisa quando o microfone só captou silêncio, sem transcrever', async () => {
    mockStart.mockResolvedValue(fakeRecording(0));
    const screen = render(<RecordScreen />);
    await recordOnce(screen);

    expect(screen.getByText(/não captou som/)).toBeTruthy();
    expect(mockTranscribe).not.toHaveBeenCalled();
    screen.unmount();
  });

  it('avisa quando o usuário nega o microfone', async () => {
    mockStart.mockRejectedValue(new MicrophoneDeniedError());
    const screen = render(<RecordScreen />);

    fireEvent.press(screen.getByLabelText('Gravar'));
    await act(async () => {});
    expect(screen.getByText(/Sem permissão para o microfone/)).toBeTruthy();
    screen.unmount();
  });

  it('avisa quando falta o servidor de transcrição', async () => {
    mockStart.mockResolvedValue(fakeRecording(0.4));
    mockTranscribe.mockRejectedValue(new TranscriptionNotConfiguredError());
    const screen = render(<RecordScreen />);
    await recordOnce(screen);

    expect(screen.getByText(/ainda não há um servidor de transcrição/)).toBeTruthy();
    expect(screen.getByText('Áudio de 2,5 s · volume médio 12%')).toBeTruthy();
    screen.unmount();
  });
});
