# Como enviar o app para o seu Fire TV Stick (Live App Testing)

O Live App Testing (LAT) instala o app no seu aparelho pela Appstore, antes de publicar. Nada aqui publica o app para o público.

Os nomes de menus abaixo vêm da documentação da Amazon (2026). Se algum botão estiver com outro nome no console, procure pelo equivalente.

## O que você vai usar

| Arquivo | Para quê |
|---|---|
| `HelloWorldTV.vpkg` | O app para Vega OS (arquitetura armv7, a do Fire TV Stick) |
| `assets/icon-512x512.png` | Ícone grande (obrigatório no LAT) |
| `assets/firetv-icon-1280x720.png` | Ícone do Fire TV (obrigatório no LAT) |
| `TEXTOS-DA-LOJA.md` | Título, categoria e demais textos |
| `HelloWorldTV.apk` | Opcional: a versão Fire OS / Android TV do mesmo app |

## 1. Cadastrar você como testador (faça antes de criar o teste)

1. No Developer Console, abra **Tools & Services > Tester Management**.
2. Crie um grupo de testadores, por exemplo "Eu".
3. Adicione um testador com **o e-mail da conta Amazon que está logada no seu Fire TV Stick**. Se o e-mail for diferente, o app não aparece no aparelho.
4. Coloque esse testador no grupo "Eu".

📄 https://developer.amazon.com/docs/vega/0.22/manage-testers.html

## 2. Criar o app no console

1. Abra https://developer.amazon.com/apps-and-games/console/app/new.html (**My Apps > Add new app**).
2. Nome: **Hello World TV**. Salve.

## 3. Criar o teste e enviar o VPKG

1. No menu do app, abra **Live App Testing** e clique em **Create new test**. Dê um nome, por exemplo "Teste 1".
2. Envie o arquivo **`HelloWorldTV.vpkg`**. Ao enviar um VPKG, o console já seleciona os aparelhos **Vega OS** (aba Amazon Fire TV, seção "Amazon Vega TV"). Deixe o seu modelo de Fire TV Stick marcado.
3. Preencha os campos obrigatórios:
   - **Título:** Hello World TV
   - **Categoria:** Educação
   - **Ícones:** `icon-512x512.png` e `firetv-icon-1280x720.png`
   - **Idioma:** Português (Brasil)
   - **Classificação de conteúdo:** responda "Nenhum" em tudo (ver `TEXTOS-DA-LOJA.md`)
   - **Export compliance:** o app não usa criptografia
   - **Grupos de testadores:** selecione "Eu"
4. Clique em **Submit Test**.

📄 https://developer.amazon.com/docs/vega/0.22/live-app-testing.html

Regra da Amazon: não escreva "Vega" em nenhum campo de texto da listagem.

## 4. Instalar no Fire TV Stick

1. Você recebe um e-mail de convite. Em "How to Participate", abra o link e clique em **Get App**.
2. O aparelho ligado à mesma conta Amazon também recebe uma notificação para instalar.
3. A entrega pode demorar; a Amazon cita até 3 dias úteis em alguns casos.
4. Com o app instalado, siga `ROTEIRO-DE-TESTE.md`.

📄 https://developer.amazon.com/docs/vega/0.22/prepare-app-testers.html

## Antes de enviar, confira

- [ ] O Fire TV Stick está com Vega OS **1.2 ou superior** (Configurações > Minha Fire TV > Sobre). O `manifest.toml` do app exige 1.2.
- [ ] O e-mail do testador é o da conta Amazon do aparelho.

## Opcional: enviar também o APK

Um mesmo app pode ter o VPKG (Vega OS) e o APK (Fire OS) com o mesmo package name (`com.helloworldtv.app`). No LAT com os dois binários, um aparelho não pode receber os dois, e a Amazon recomenda testadores diferentes para cada binário.

📄 https://community.amazondeveloper.com/t/test-your-fire-os-and-vega-apps-concurrently-with-live-app-testing/9810

## Política de privacidade

https://amarildo-correa.github.io/test-environment/privacidade.html
