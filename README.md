# OS Fácil

Aplicativo web instalável para registrar ordens de serviço, separar urbano/rural e calcular resultados diários e mensais.

[Abrir o aplicativo](https://os-facil-teste-nov17.caiovix2.chatgpt.site)

## Usar no PC
Abra o endereço no Chrome ou Edge. O site atual exige a conta autorizada do ChatGPT.

## Instalar no Android
Abra o endereço no Chrome e toque em **Instalar app**. Caso a opção nativa não apareça, use o menu do navegador > Instalar aplicativo / Adicionar à tela inicial. É um PWA, sem APK. Os dados ficam no navegador/aparelho e não são sincronizados entre dispositivos.

## Rodar localmente
Requer Python 3:
```sh
python -m http.server 8000 --directory dist
```
Abra http://localhost:8000. Para instalação fora de localhost, use hospedagem HTTPS na raiz do domínio.

## Testar
Requer Node.js 22 ou superior:
```sh
npm install
npm test
```

Os testes de DOM cobrem apresentação inicial, nome salvo, segurança do nome, contagens rápidas, foco, tarifas históricas, totais, histórico mensal, falha de armazenamento, compartilhamento por cópia, instruções/prompt de instalação e movimento reduzido. Não substituem testes de instalação em aparelho real.

## Dados
Tarifas iniciais conforme tabela: OS 3 (Religação), 5 (Corte simbólico), 383 (Corte no ramal), 236 (Negociação). Valores em centavos inteiros. Alterar uma tarifa afeta apenas novos lançamentos.

Dados locais em localStorage. Limpar dados do navegador ou desinstalar pode apagar os registros. Compartilhe os fechamentos para guardar cópias em texto. Offline depende da instalação bem-sucedida do service worker no primeiro acesso online.

## Interface
Botões com vidro, feedback ao toque, contadores animados sem reconstruir a tela, carregamento com recuperação, logo vetorial e ícones instaláveis. Animações respeitam a preferência de movimento reduzido.

## Demonstração em iPhone
No PC, pressione **Ctrl + 8** com a página em foco para ativar a moldura de iPhone. Repita o atalho para sair, inclusive com o foco dentro da tela do aparelho. O aplicativo continua funcionando e as alterações ficam salvas no mesmo navegador. O modo inicia desligado e não altera os dados existentes.

## Publicar na Vercel

O arquivo `vercel.json` configura o projeto como site estático, servindo a pasta `dist`. Os arquivos já estão prontos; não é necessário executar build, instalar dependências na hospedagem ou configurar variáveis de ambiente.

1. Na Vercel, use **Add New → Project** e importe **CaioRods/OS--Facil**.
2. Mantenha **Root Directory** na raiz do repositório (`./`).
3. Se aparecer uma escolha de framework, selecione **Other**. A saída é `dist`; os comandos de build e instalação ficam vazios conforme o arquivo de configuração. Remova eventuais overrides antigos no painel.
4. Clique em **Deploy**. Se o projeto já estava conectado, este commit pode disparar um novo deploy automaticamente; confira a aba Deployments.

O service worker é servido na raiz, com cache HTTP desativado para receber atualizações. Os demais arquivos exigem revalidação. O modo iPhone continua usando um iframe da mesma origem. Não há regra genérica que transforme arquivos ausentes em HTML.

### Depois do deploy

Abra o endereço HTTPS definitivo, aguarde o carregamento e instale o app no Chrome. Depois do primeiro acesso online e da ativação do service worker, teste fechar/reabrir com o modo avião para confirmar o uso offline no seu aparelho. Se você ativar proteção de acesso na Vercel, o primeiro login exige internet.

Os dados são locais e separados por domínio: os registros feitos no endereço anterior do ChatGPT Sites não aparecem automaticamente no novo endereço da Vercel. Compartilhe os fechamentos antigos para guardar uma cópia antes de mudar de endereço.

## Tarifas personalizadas
Em **Tarifas → Nova tarifa**, informe código, nome e valores urbano/rural. Você pode remover uma tarifa sem apagar suas OS antigas. Se adicionar novamente um código removido, a tarifa é reativada com os novos valores; os lançamentos anteriores conservam seus nomes e valores.

## Diária em imagem
Selecione a data na tela Dia e toque em **Compartilhar diária em imagem**. O app gera uma imagem PNG quadrada (proporção 4×4 / 1:1) com nome, foto, data, quantidades e serviços agrupados por código, nome e área. A resolução parte de 2000×2000 pixels e aumenta, até 4096×4096, para relatórios maiores. Nenhuma linha é omitida.

Em **Tarifas → Valores no relatório**, escolha se a imagem inclui preços e total em reais. Desligar a opção oculta todos os valores financeiros da imagem e do texto de compartilhamento; os cálculos internos continuam preservados.

Depois da prévia, o botão de compartilhar aparece quando o navegador aceita arquivos PNG pela Web Share API. Caso contrário, use **Baixar imagem PNG** e envie o arquivo pelo aplicativo que preferir. A geração usa Canvas local e não depende de serviços externos.

## Foto do perfil
Toque no avatar no cabeçalho. Escolha uma foto, arraste com um dedo e use dois dedos para ampliar ou reduzir. O controle de zoom e os botões de posição também podem ser usados no PC. Confirme o recorte e depois salve o perfil. A foto é reduzida para 320×320 em JPEG e salva somente no aparelho. Cancelar o recorte mantém a foto anterior.
