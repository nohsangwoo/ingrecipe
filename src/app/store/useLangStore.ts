import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

const useLangStore = create(
  persist<useLangStoreState>(
    set => ({
      lang: LangEnum.ENGLISH,
      setLang: (lang: LangEnumTYPE) => set({ lang }),
    }),
    {
      name: 'lang-storage', // 로컬 스토리지에 저장될 키 이름
    },
  ),
)

export default useLangStore
