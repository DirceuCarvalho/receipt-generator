import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReceiptFormData } from './lib/receipt';
import { receiptSchema } from './lib/receipt';
import { ReceiptForm } from './components/ReceiptForm';
import { ReceiptPreview } from './components/ReceiptPreview';
import { PrintActions } from './components/PrintActions';
import { AdsSecurityWrapper } from './components/AdsSecurityWrapper';

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const methods = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      payerName: '',
      document: '',
      date: '',
      description: '',
      receiverName: '',
      receiverDocument: ''
    },
    mode: 'onChange'
  });

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors">
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
                <img
                  src="/receipt-icon.svg"
                  alt="Ícone do Gerador de Recibos"
                  className="w-8 h-8 rounded-lg"
                />
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Gerador de Recibos
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label={isDark ? 'Modo claro' : 'Modo escuro'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormProvider {...methods}>
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ReceiptForm />
              <PrintActions />
            </div>
            <div>
              <div className="sticky top-8">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualização
                </h2>
                <ReceiptPreview />
              </div>
            </div>
          </form>
        </FormProvider>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Gerador de Recibos &copy; {new Date().getFullYear()}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <a href="/sobre.html" className="hover:underline">Sobre</a>
            <span aria-hidden="true">|</span>
            <a href="/privacidade.html" className="hover:underline">Privacidade</a>
            <span aria-hidden="true">|</span>
            <a href="/termos.html" className="hover:underline">Termos</a>
            <span aria-hidden="true">|</span>
            <a href="/contato.html" className="hover:underline">Contato</a>
          </div>
        </div>
      </footer>

      <AdsSecurityWrapper />
    </div>
  );
}

export default App;