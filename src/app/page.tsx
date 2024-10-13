'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react';
import { motion } from 'framer-motion';
import useCheckIngredients from '../../hooks/useCheckIngredients';
import CheckIngredients from './components/CheckIngredients';
import LanguageSelector from './components/LanguageSelector';
import useLangStore, { LangEnum } from './store/useLangStore';
const ImageUploader = dynamic(() => import('./components/ImageUploader'), { ssr: false })

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [isAuto, setIsAuto] = useState(true)
  const { isLoading, parsedData } = useCheckIngredients({ uploadedImages, isUploadComplete })

  const { lang } = useLangStore()

  const text = {
    title: {
      [LangEnum.ENGLISH]: "Recipe Wizard",
      [LangEnum.KOREAN]: "레시피 마법사",
      [LangEnum.RUSSIAN]: "Мастер рецептов",
      [LangEnum.JAPANESE]: "レシピウィザード",
    },
    subTitle: {
      [LangEnum.ENGLISH]: "Enter ingredients and we'll automatically recommend recipes for you!",
      [LangEnum.KOREAN]: "재료를 입력하면 레시피를 자동으로 추천해드립니다!",
      [LangEnum.RUSSIAN]: "Введите ингредиенты, и мы автоматически порекомендуем вам рецепты!",
      [LangEnum.JAPANESE]: "材料を入力すると、自動的にレシピをおすすめします！",
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-3 items-center justify-items-center min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100 relative"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <LanguageSelector />
      </motion.div>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          {text.title[lang]}
        </h1>
        <p className="text-xl text-gray-300">
          {text.subTitle[lang]}
        </p>
      </motion.div>
      <motion.div
        className="w-full max-w-md"
      >
        <ImageUploader setUploadedImages={setUploadedImages} isUploadComplete={isUploadComplete} setIsUploadComplete={setIsUploadComplete} isAuto={isAuto} setIsAuto={setIsAuto} />
      </motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <CheckIngredients isLoading={isLoading} parsedData={parsedData} isAuto={isAuto} />
      </motion.div>
    </motion.div>
  )
}
