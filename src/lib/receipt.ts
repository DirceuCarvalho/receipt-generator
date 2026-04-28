import { z } from 'zod';

export const receiptSchema = z.object({
  payerName: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  document: z.string().min(1, 'CPF/CNPJ é obrigatório').refine((val) => {
    const cleaned = val.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 14;
  }, 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres'),
  paymentMethod: z.enum(['dinheiro', 'pix', 'transferencia', 'cheque', 'cartao', 'boleto'], {
    message: 'Forma de pagamento é obrigatória'
  }),
  receiverName: z.string().max(100, 'Nome do destinatário deve ter no máximo 100 caracteres').optional().or(z.literal('')),
  receiverDocument: z.string().optional().or(z.literal(''))
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;

export const paymentMethodLabels: Record<ReceiptFormData['paymentMethod'], string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  transferencia: 'Transferência Bancária',
  cheque: 'Cheque',
  cartao: 'Cartão',
  boleto: 'Boleto'
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const parseDateForDisplay = (value: string | Date): Date => {
  if (value instanceof Date) {
    return value;
  }

  // Treat yyyy-mm-dd as a local date to avoid timezone shifting to previous day.
  const localDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (localDateMatch) {
    const [, year, month, day] = localDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return new Date(value);
};

export const formatDocument = (doc: string): string => {
  const cleaned = doc.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc;
};

export const formatDate = (dateValue: string | Date): string => {
  const date = parseDateForDisplay(dateValue);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatDateFull = (dateValue: string | Date): string => {
  const date = parseDateForDisplay(dateValue);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const generateReceiptNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Exclui caracteres ambíguos (0, O, 1, I) para facilitar leitura por telefone/WhatsApp.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * alphabet.length);
    randomPart += alphabet[index];
  }

  return `REC-${datePart}-${randomPart}`;
};