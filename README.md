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
