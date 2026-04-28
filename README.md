# Receipt Generator

Aplicacao SPA para geracao de recibos com React + TypeScript + Vite.

## Anuncios com seguranca (sem alterar layout base)

O projeto inclui um wrapper de anuncios isolado em iframe sandboxado:

- Componente: `src/components/AdsSecurityWrapper.tsx`
- Frame isolado: `public/ads/frame.html`
- Consentimento: `src/lib/adsConsent.ts`

### Como habilitar

Defina variaveis de ambiente no build/deploy:

```env
VITE_ADS_ENABLED=true
VITE_ADS_PROVIDER=adsense
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_ID=1234567890
```

Para Propeller:

```env
VITE_ADS_ENABLED=true
VITE_ADS_PROVIDER=propeller
VITE_PROPELLER_ZONE_ID=YOUR_ZONE_ID
```

### Consentimento LGPD

Os anuncios so carregam apos consentimento explicito. Para conceder/retirar consentimento:

```ts
import { grantAdConsent, denyAdConsent } from './src/lib/adsConsent';

grantAdConsent();
denyAdConsent();
```

### Garantias de seguranca aplicadas

- Scripts de terceiros nao rodam no contexto principal da SPA.
- Ads sao carregados dentro de iframe com `sandbox`, reduzindo acesso ao estado interno do app.
- Carregamento lazy + idle para minimizar impacto de performance.
- Fallback quando bloqueado por AdBlock ou falha de rede.
- Politica CSP estrita no documento principal (`index.html`).
- Politica de `referrer` restritiva para evitar envio acidental de dados via cabecalho.

### Boas praticas para evitar vazamento de dados de recibo

- Nao passe dados de formulario em query string de scripts, iframes ou analytics.
- Nao serialize estado do formulario em `window`/globais.
- Evite enviar eventos com payload contendo nome, documento, valor ou descricao do recibo.
- Revise requisicoes de rede no DevTools apos habilitar anuncios.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Producao

```bash
npm run build
npm run preview
```

## Checklist de prontidao para AdSense

- Publicar em dominio HTTPS (ex.: Vercel com dominio proprio).
- Ajustar `public/ads.txt` com o Publisher ID real (`pub-...`).
- Manter paginas publicas acessiveis:
	- `/sobre.html`
	- `/privacidade.html`
	- `/termos.html`
	- `/contato.html`
- Garantir consentimento para anuncios quando exigido por legislacao local.
- Revisar periodicamente politicas do Google AdSense.
