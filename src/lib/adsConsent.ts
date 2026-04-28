const ADS_CONSENT_KEY = 'receipt_ads_consent';
const ADS_CONSENT_EVENT = 'receipt-ads-consent-changed';

type ConsentValue = 'granted' | 'denied';

const safeLocalStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const hasAdConsent = (): boolean => {
  const storage = safeLocalStorage();
  if (!storage) {
    return false;
  }
  return storage.getItem(ADS_CONSENT_KEY) === 'granted';
};

export const getAdConsentChoice = (): ConsentValue | null => {
  const storage = safeLocalStorage();
  if (!storage) {
    return null;
  }

  const value = storage.getItem(ADS_CONSENT_KEY);
  if (value === 'granted' || value === 'denied') {
    return value;
  }

  return null;
};

const setAdConsent = (value: ConsentValue) => {
  const storage = safeLocalStorage();
  if (!storage) {
    return;
  }
  storage.setItem(ADS_CONSENT_KEY, value);
  window.dispatchEvent(new Event(ADS_CONSENT_EVENT));
};

export const grantAdConsent = () => setAdConsent('granted');

export const denyAdConsent = () => setAdConsent('denied');

export const ADS_CONSENT_CHANGED_EVENT = ADS_CONSENT_EVENT;
