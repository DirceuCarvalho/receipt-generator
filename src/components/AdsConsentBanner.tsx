import { useEffect, useState } from 'react';
import {
  ADS_CONSENT_CHANGED_EVENT,
  denyAdConsent,
  getAdConsentChoice,
  grantAdConsent
} from '../lib/adsConsent';

const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';

export function AdsConsentBanner() {
  const [consentChoice, setConsentChoice] = useState<'granted' | 'denied' | null>(null);

  useEffect(() => {
    if (!ADS_ENABLED) {
      return;
    }

    const refreshChoice = () => setConsentChoice(getAdConsentChoice());
    refreshChoice();

    window.addEventListener(ADS_CONSENT_CHANGED_EVENT, refreshChoice);
    window.addEventListener('storage', refreshChoice);

    return () => {
      window.removeEventListener(ADS_CONSENT_CHANGED_EVENT, refreshChoice);
      window.removeEventListener('storage', refreshChoice);
    };
  }, []);

  if (!ADS_ENABLED || consentChoice !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:max-w-md">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl p-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Consentimento para publicidade</h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          Este site pode exibir anuncios de terceiros para manter a ferramenta gratuita. Voce pode aceitar
          ou recusar agora e alterar sua escolha depois limpando os dados do navegador.
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Leia mais em <a href="/privacidade.html" className="underline">Politica de Privacidade</a>.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={denyAdConsent}
            className="flex-1 rounded-lg px-3 py-2 text-xs font-medium border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={grantAdConsent}
            className="flex-1 rounded-lg px-3 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
