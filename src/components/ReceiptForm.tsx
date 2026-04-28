import { useFormContext, Controller } from 'react-hook-form';
import type { ReceiptFormData } from '../lib/receipt';
import { paymentMethodLabels } from '../lib/receipt';

type PaymentMethod = ReceiptFormData['paymentMethod'];

const paymentMethods: PaymentMethod[] = ['dinheiro', 'pix', 'transferencia', 'cheque', 'cartao', 'boleto'];

export function ReceiptForm() {
  const { control, formState: { errors } } = useFormContext<ReceiptFormData>();
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 space-y-5">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-3">
        Dados do Recebimento
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nome do Pagador *
          </label>
          <Controller
            name="payerName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.payerName ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="Nome completo"
              />
            )}
          />
          {errors.payerName && (
            <p className="mt-1 text-sm text-red-500">{errors.payerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            CPF/CNPJ *
          </label>
          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.document ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
                maxLength={18}
              />
            )}
          />
          {errors.document && (
            <p className="mt-1 text-sm text-red-500">{errors.document.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Valor (R$) *
            </label>
            <Controller
              name="amount"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  value={value ?? ''}
                  onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.amount ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                  placeholder="0,00"
                />
              )}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Data *
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className={`date-input w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.date ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                />
              )}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Forma de Pagamento *
          </label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.paymentMethod ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                }`}
              >
                <option value="">Selecione...</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {paymentMethodLabels[method]}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-500">{errors.paymentMethod.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Descrição
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="Descrição do pagamento (opcional)"
                maxLength={500}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
            Dados do Destinatário (opcional)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nome do Destinatário
              </label>
              <Controller
                name="receiverName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Nome ou razão social"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                CPF/CNPJ do Destinatário
              </label>
              <Controller
                name="receiverDocument"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="CPF ou CNPJ"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}