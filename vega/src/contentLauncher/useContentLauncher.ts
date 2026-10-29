import { useEffect } from 'react';
import { useComponentInstance } from '@amazon-devices/react-native-kepler';
import {
  ContentLauncherServerComponent,
  ContentLauncherStatusType,
  IContentLauncherHandler,
  IContentSearch,
  ILaunchContentOptionalFields,
  ILauncherResponse,
} from '@amazon-devices/kepler-media-content-launcher';
import { parseContentSearch } from './parseContentSearch';
import { setPendingLaunch } from './pendingLaunch';

// Recebe os pedidos de abrir conteúdo da Alexa ("Alexa, procure ... no Hello
// World") e do Fire TV. Fica num módulo próprio para os testes poderem
// substituí-lo: o servidor do Content Launcher só existe no aparelho.
export function useContentLauncher() {
  const componentInstance = useComponentInstance();

  useEffect(() => {
    const factory = new ContentLauncherServerComponent();
    const handler: IContentLauncherHandler = {
      async handleLaunchContent(
        contentSearch: IContentSearch,
        autoPlay: boolean,
        _optionalFields: ILaunchContentOptionalFields,
      ): Promise<ILauncherResponse> {
        const launch = parseContentSearch(contentSearch, autoPlay);
        console.log('[ContentLauncher] pedido recebido:', JSON.stringify(launch));
        setPendingLaunch(launch);
        return factory
          .makeLauncherResponseBuilder()
          .contentLauncherStatus(ContentLauncherStatusType.SUCCESS)
          .build();
      },
    };

    try {
      factory.getOrMakeServer().setHandlerForComponent(handler, componentInstance);
      console.log('[ContentLauncher] Handler registered successfully');
    } catch (error) {
      console.error('[ContentLauncher] falha ao registrar o handler:', error);
    }
  }, [componentInstance]);
}
