/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADS_ENABLED?: string;
  readonly VITE_ADS_PROVIDER?: 'adsense' | 'propeller';
  readonly VITE_ADSENSE_CLIENT_ID?: string;
  readonly VITE_ADSENSE_SLOT_ID?: string;
  readonly VITE_ADSENSE_SLOT_ID_TOP?: string;
  readonly VITE_PROPELLER_ZONE_ID?: string;
  readonly VITE_ADS_IFRAME_SANDBOX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
