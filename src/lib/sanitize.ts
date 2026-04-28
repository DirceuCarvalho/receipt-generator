import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    RETURN_TRUSTED_TYPE: false
  });
  return typeof cleaned === 'string' ? cleaned : input;
};

export const sanitizeForHtml = (input: string): string => {
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'br'],
    ALLOWED_ATTR: [],
    RETURN_TRUSTED_TYPE: false
  });
  return typeof cleaned === 'string' ? cleaned : input;
};