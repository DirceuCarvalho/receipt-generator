import { useFormContext } from 'react-hook-form';
import type { ReceiptFormData } from '../lib/receipt';

export function PrintActions() {
  const { getValues } = useFormContext<ReceiptFormData>();
  const values = getValues();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    try {
      printWindow.opener = null;
    } catch {
      // Alguns navegadores bloqueiam este acesso; ignorar sem quebrar o fluxo.
    }

    const receiptPreview = document.getElementById('receipt-preview');
    if (!receiptPreview) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="X-Content-Type-Options" content="nosniff">
        <meta http-equiv="X-Frame-Options" content="DENY">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; object-src 'none'">
        <title>Recibo de Pagamento</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #18181b;
          }
          .text-center { text-align: center; }
          .border-b { border-bottom: 1px solid #e4e4e7; }
          .pb-4 { padding-bottom: 1rem; }
          .mb-4 { margin-bottom: 1rem; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-start { align-items: flex-start; }
          .space-y-4 > * + * { margin-top: 1rem; }
          .text-xl { font-size: 1.25rem; }
          .text-2xl { font-size: 1.5rem; }
          .font-bold { font-weight: 700; }
          .font-medium { font-weight: 500; }
          .text-sm { font-size: 0.875rem; }
          .text-xs { font-size: 0.75rem; }
          .text-zinc-400 { color: #a1a1aa; }
          .text-zinc-500 { color: #71717a; }
          .text-zinc-900 { color: #18181b; }
          .max-w-\\[60\\%\\] { max-width: 60%; }
          .text-right { text-align: right; }
          .whitespace-pre-wrap { white-space: pre-wrap; }
          .mt-1 { margin-top: 0.25rem; }
          .mt-4 { margin-top: 1rem; }
          .mt-8 { margin-top: 2rem; }
          .pt-4 { padding-top: 1rem; }
          .border-t { border-top: 1px solid #e4e4e7; }
          .border-zinc-400 { border-bottom: 1px solid #a1a1aa; }
          .h-20 { height: 5rem; }
          .flex-1 { flex: 1; }
          .gap-8 { gap: 2rem; }
          .block { display: block; }
          @page { margin: 1cm; }
        </style>
      </head>
      <body>
        <div id="print-root"></div>
      </body>
      </html>
    `);

    const printRoot = printWindow.document.getElementById('print-root');
    if (!printRoot) {
      printWindow.close();
      return;
    }

    const clonedReceipt = printWindow.document.importNode(receiptPreview, true);
    printRoot.appendChild(clonedReceipt);
    printWindow.document.close();

    // Aguarda o parser finalizar para evitar chamadas de print antes do documento estar pronto.
    globalThis.setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 50);
  };

  const hasData = values.payerName && values.document && values.amount && values.date && values.paymentMethod;

  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={handlePrint}
        disabled={!hasData}
        className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Imprimir
      </button>
    </div>
  );
}