import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import type { ReceiptFormData } from '../lib/receipt';
import { formatCurrency, formatDocument, formatDateFull, generateReceiptNumber } from '../lib/receipt';
import { sanitizeInput } from '../lib/sanitize';

const getPaymentMethodLabel = (method: string | undefined): string => {
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    transferencia: 'Transferência Bancária',
    cheque: 'Cheque',
    cartao: 'Cartão',
    boleto: 'Boleto'
  };
  return method ? labels[method] ?? method : '-';
};

export function ReceiptPreview() {
  const { watch } = useFormContext<ReceiptFormData>();
  const formValues = watch();

  const receiverName = formValues.receiverName?.trim() ?? '';
  const receiverDocument = formValues.receiverDocument?.trim() ?? '';
  const showReceiverSection = receiverName.length > 0 || receiverDocument.length > 0;
  
  const receiptNumber = useMemo(() => generateReceiptNumber(), []);
  const today = new Date();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
      <div 
        id="receipt-preview"
        className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 min-h-[400px]"
      >
        <div className="text-center border-b border-zinc-200 dark:border-zinc-700 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            RECIBO
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Código: {receiptNumber}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Pagador:</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium text-right max-w-[60%]">
              {formValues.payerName ? sanitizeInput(formValues.payerName) : <span className="text-zinc-400">-</span>}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">CPF/CNPJ:</span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {formValues.document ? formatDocument(formValues.document) : <span className="text-zinc-400">-</span>}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Data:</span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {formValues.date ? formatDateFull(formValues.date) : <span className="text-zinc-400">-</span>}
            </span>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Valor:</span>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {formValues.amount ? formatCurrency(formValues.amount) : <span className="text-zinc-400">R$ 0,00</span>}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Forma de Pagamento:</span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {formValues.paymentMethod ? getPaymentMethodLabel(formValues.paymentMethod) : <span className="text-zinc-400">-</span>}
            </span>
          </div>

          {formValues.description && (
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mt-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-1">Descrição:</span>
              <p className="text-zinc-900 dark:text-zinc-100 text-sm whitespace-pre-wrap">
                {sanitizeInput(formValues.description)}
              </p>
            </div>
          )}

          {showReceiverSection && (
            <>
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mt-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">Destinatário:</span>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Nome:</span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {receiverName ? sanitizeInput(receiverName) : <span className="text-zinc-400">-</span>}
                  </span>
                </div>
                {receiverDocument && (
                  <div className="flex justify-between items-start mt-1">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">CPF/CNPJ:</span>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {formatDocument(receiverDocument)}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <span>Data de emissão:</span>
            <span>{formatDateFull(today)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-8">
          <div className="flex-1">
            <div className="border-b border-zinc-400 dark:border-zinc-500 h-20"></div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1">Assinatura do Pagador</p>
          </div>
          <div className="flex-1">
            <div className="border-b border-zinc-400 dark:border-zinc-500 h-20"></div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1">Assinatura do Destinatário</p>
          </div>
        </div>
      </div>
    </div>
  );
}