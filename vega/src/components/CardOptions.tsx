import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import {
  TVFocusGuideView,
  useTVEventHandler,
} from '@amazon-devices/react-native-kepler';
import type { HWEvent } from '@amazon-devices/react-native-kepler';
import { Button } from './Button';
import { getArticle } from '../content/articles';
import { toggleSaved, useMyList } from '../content/myList';
import { colors, px, safeArea, text, typography } from '../theme';

type Options = {
  // A tela está visível? O botão Menu só vale para a tela da frente.
  isScreenFocused: () => boolean;
  // Card com o foco agora (para o botão Menu) e como devolver o foco a ele.
  lastKey: () => string;
  focusLast: () => void;
  onOpenArticle: (id: string) => void;
};

// Painel de opções de um card, aberto ao segurar OK (long press) ou ao
// apertar o botão Menu (☰), que as diretrizes do Fire TV reservam para menus
// de contexto. Voltar fecha o painel e devolve o foco ao card.
export function useCardOptions({
  isScreenFocused,
  lastKey,
  focusLast,
  onOpenArticle,
}: Options) {
  const [openId, setOpenId] = useState<string | undefined>();
  const wasOpen = useRef(false);
  // Aberto por long press, o OK ainda está apertado: o soltar (e as
  // repetições da tecla) cairia no botão "Abrir", que recebe o foco. Os
  // botões só aceitam OK depois que o sistema avisa que a tecla foi solta.
  const ready = useRef(true);
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelArm = useCallback(() => {
    if (readyTimer.current !== null) {
      clearTimeout(readyTimer.current);
      readyTimer.current = null;
    }
  }, []);

  const arm = useCallback((delayMs: number) => {
    cancelArm();
    readyTimer.current = setTimeout(() => {
      ready.current = true;
    }, delayMs);
  }, [cancelArm]);

  const open = useCallback(
    (id: string) => {
      ready.current = false;
      // Rede de segurança caso o aviso de tecla solta não chegue.
      arm(2000);
      setOpenId(id);
    },
    [arm],
  );
  const close = useCallback(() => setOpenId(undefined), []);
  const canAct = useCallback(() => ready.current, []);

  useEffect(() => cancelArm, [cancelArm]);

  useTVEventHandler((event: HWEvent) => {
    // OK solto depois do long press: libera os botões logo em seguida (o
    // próprio soltar ainda chega ao botão e precisa ser ignorado).
    if (
      event.eventType === 'select' &&
      event.eventKeyAction === 1 &&
      !ready.current
    ) {
      arm(200);
      return;
    }
    // Botão Menu: abre ao soltar a tecla (eventKeyAction 1), uma vez só.
    if (
      event.eventType === 'menu' &&
      event.eventKeyAction === 1 &&
      openId === undefined &&
      isScreenFocused()
    ) {
      cancelArm();
      ready.current = true;
      setOpenId(lastKey());
    }
  });

  // Com o painel aberto, Voltar só fecha o painel.
  useEffect(() => {
    if (openId === undefined) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        close();
        return true;
      },
    );
    return () => subscription.remove();
  }, [openId, close]);

  // Ao fechar, o foco volta ao card de onde o painel foi aberto.
  useEffect(() => {
    if (openId === undefined && wasOpen.current) {
      focusLast();
    }
    wasOpen.current = openId !== undefined;
  }, [openId, focusLast]);

  const handleOpen = useCallback(() => {
    if (openId && canAct()) {
      close();
      onOpenArticle(openId);
    }
  }, [openId, canAct, close, onOpenArticle]);

  const panel =
    openId === undefined ? null : (
      <CardOptionsPanel
        id={openId}
        canAct={canAct}
        onOpen={handleOpen}
        onClose={close}
      />
    );

  return { open, panel };
}

type PanelProps = {
  id: string;
  canAct: () => boolean;
  onOpen: () => void;
  onClose: () => void;
};

function CardOptionsPanel({ id, canAct, onOpen, onClose }: PanelProps) {
  const article = getArticle(id);
  const { isSaved } = useMyList();
  const saved = isSaved(id);
  const handleToggle = useCallback(() => {
    if (!canAct()) {
      return;
    }
    toggleSaved(id);
    onClose();
  }, [id, canAct, onClose]);

  return (
    <View style={styles.overlay}>
      <View style={styles.dim} />
      {/* O foco fica preso no painel enquanto ele está aberto. */}
      <TVFocusGuideView
        style={styles.panel}
        trapFocusUp
        trapFocusDown
        trapFocusLeft
        trapFocusRight
      >
        <Text style={styles.heading}>Opções</Text>
        <Text style={styles.title} numberOfLines={3}>
          {article ? `${article.titleStart} ${article.titleEnd}` : ''}
        </Text>
        <View style={styles.actions}>
          <Button label="Abrir" onPress={onOpen} hasTVPreferredFocus fullWidth />
          <Button
            label={saved ? 'Remover da lista' : 'Salvar na lista'}
            variant="secondary"
            onPress={handleToggle}
            fullWidth
          />
        </View>
        <Text style={styles.hint}>Voltar fecha este painel</Text>
      </TVFocusGuideView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  dim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  panel: {
    width: px(620),
    backgroundColor: colors.overlay,
    paddingHorizontal: px(56),
    paddingVertical: safeArea.vertical + px(40),
  },
  heading: text(typography.titleMd, colors.primary, '700'),
  title: {
    ...text(typography.headlineSm, colors.textHigh, '700'),
    marginTop: px(16),
  },
  actions: {
    marginTop: px(48),
    rowGap: px(24),
  },
  hint: {
    ...text(typography.labelMd, colors.textMedium),
    marginTop: px(40),
  },
});
