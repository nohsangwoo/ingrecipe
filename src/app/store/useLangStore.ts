import { create } from 'zustand'

export const LangEnum = {
  ENGLISH: 'ENGLISH',
  KOREAN: 'KOREAN',
  RUSSIAN: 'RUSSIAN',
  JAPANESE: 'JAPANESE',
} as const
export type LangEnumTYPE = (typeof LangEnum)[keyof typeof LangEnum]

interface useLangStoreState {
  lang: LangEnumTYPE
  setLang: (lang: LangEnumTYPE) => void
}

const useLangStore = create<useLangStoreState>(set => ({
  lang: LangEnum.ENGLISH,
  setLang: (lang: LangEnumTYPE) => set(state => ({ lang: lang })),
}))

export default useLangStore
