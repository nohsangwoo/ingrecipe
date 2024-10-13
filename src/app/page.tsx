'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react';
import { motion } from 'framer-motion';
import useCheckIngredients from '../../hooks/useCheckIngredients';
import CheckIngredients from './components/CheckIngredients';
import LanguageSelector from './components/LanguageSelector';
import TitleBox from './components/TitleBox';
const ImageUploader = dynamic(() => import('./components/ImageUploader'), { ssr: false })

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [isAuto, setIsAuto] = useState(true)
  const { isLoading, parsedData } = useCheckIngredients({ uploadedImages, isUploadComplete })



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
        className=' z-30'
      >
        <LanguageSelector />
      </motion.div>
      <TitleBox />
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
