import type { PendingLaunch } from './pendingLaunch';

// Formato mínimo do `IContentSearch` do Content Launcher. Fica separado do
// pacote nativo para poder ser testado no Jest.
type SearchParameter = {
  getParamType(): number;
  getValue(): string;
  getExternalIdList(): { getName(): string; getValue(): string }[];
};
type ContentSearch = { getParameterList(): SearchParameter[] };

// ContentSearchParamType.VIDEO: a Alexa coloca aqui a frase com o título.
const VIDEO = 13;

export function parseContentSearch(
  contentSearch: ContentSearch,
  autoPlay: boolean,
): PendingLaunch {
  const values: { type: number; value: string }[] = [];
  let contentId: string | undefined;

  for (const parameter of contentSearch.getParameterList()) {
    const value = parameter.getValue()?.trim();
    if (value) {
      values.push({ type: parameter.getParamType(), value });
    }
    for (const externalId of parameter.getExternalIdList()) {
      if (externalId.getName() === 'amzn_id' && externalId.getValue()) {
        contentId = externalId.getValue();
      }
    }
  }

  const video = values.find(item => item.type === VIDEO);
  const query = video
    ? video.value
    : values.map(item => item.value).join(' ');
  return { query, contentId, autoPlay };
}
