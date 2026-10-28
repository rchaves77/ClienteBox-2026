# Plano de Ajustes Visuais: Motor 3D Desobstruído, Remoção de Telemetria de Frames e Foto Oficial do Especialista

## 1. Ocultar Contadores Técnicos de Frames (`FRAME XXX / 180`)
- **Remoção Completa de Vazamento Técnico**: Remover o indicador `ENGINE: FRAME 071 / 180` do HUD superior e remover os prefixos `Frames 001–060`, `Frames 061–122` e `Frames 123–180` dos selos de estágio e do botão de chamada para rolagem.
- **Substituição por Selos Executivos**: Exibir apenas os títulos comerciais de cada etapa da simulação (`Diagnóstico em Tempo Real`, `Auditoria EXIF GPS & 3 Gargalos Ocultos` e `Dominância Territorial Top #1 Google Maps`).

## 2. Desobstrução Total da Animação 3D no Canvas (`#scrolly-engine`)
- **Elevação do Eixo Central 3D (`isoProject`)**: Ajustar o ponto focal vertical do Canvas 3D (`ch * 0.38` no lugar de `ch * 0.50`) e calibrar o zoom para que a malha urbana, o pino central (`SUA EMPRESA`), os 3 concorrentes, as ondas de choque EXIF e as partículas fiquem posicionados na área nobre central-superior da tela.
- **Compactação e Ancoragem dos Cards em Primeiro Plano**:
  - Reduzir a altura e o espaçamento interno (`p-3.5 sm:p-4`) dos cards inferiores nos 3 estágios e ancorá-los rente à borda inferior (`bottom-3 sm:bottom-5`), garantindo uma janela livre e desobstruída para visualizar toda a transformação 3D sem sobreposição de textos ou caixas sobre os pinos do mapa.
  - Compactar a barra superior de estimativa de perdas para ocupar o mínimo de espaço vertical.

## 3. Foto Oficial do Especialista no Card Executivo Verificado (`Rômulo Chaves da Silva`)
- **Substituição do Monograma `RC` pela Foto Real**: Inserir a foto oficial do especialista Rômulo Chaves da Silva (`romulo.jpg`) no quadro principal do Card Executivo Verificado (selecionado no Focus Mode), com enquadramento executivo (`object-cover object-top`), borda iluminada em verde-esmeralda e selo `Verificado`, mantendo o design limpo sem botão de alterar foto.
