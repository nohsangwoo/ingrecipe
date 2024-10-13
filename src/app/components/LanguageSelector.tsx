'use client'
import React from 'react'
import useLangStore, { LangEnum, LangEnumTYPE } from '../store/useLangStore'

const LanguageSelector: React.FC = () => {
    const { lang, setLang } = useLangStore()

    return (
        <select
            value={lang}
            onChange={(e) => setLang(e.target.value as LangEnumTYPE)}
            className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded "
        >
            <option value={LangEnum.ENGLISH}>English</option>
            <option value={LangEnum.KOREAN}>한국어</option>
            <option value={LangEnum.JAPANESE}>日本語</option>
            <option value={LangEnum.RUSSIAN}>Русский</option>
        </select>
    )
}

export default LanguageSelector