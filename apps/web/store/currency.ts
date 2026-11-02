import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'JPY'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  name: string
  rate: number // Multiplier from USD
  decimals: number
  prefix: boolean
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, decimals: 2, prefix: true },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, decimals: 2, prefix: false },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, decimals: 2, prefix: true },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 121.5, decimals: 0, prefix: true },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 154.0, decimals: 0, prefix: true },
}

interface CurrencyState {
  current: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  formatPrice: (usdAmount: number | string) => string
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      current: 'USD',

      setCurrency: (code) => set({ current: code }),

      formatPrice: (usdAmount) => {
        const val = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount
        if (isNaN(val)) return '$0.00'

        const cfg = CURRENCIES[get().current] ?? CURRENCIES.USD
        const converted = val * cfg.rate
        const formattedNum = cfg.decimals === 0
          ? Math.round(converted).toLocaleString()
          : converted.toLocaleString(undefined, {
              minimumFractionDigits: cfg.decimals,
              maximumFractionDigits: cfg.decimals,
            })

        return cfg.prefix ? `${cfg.symbol}${formattedNum}` : `${formattedNum} ${cfg.symbol}`
      },
    }),
    {
      name: 'shoppingmall_currency_storage_v1',
    },
  ),
)
