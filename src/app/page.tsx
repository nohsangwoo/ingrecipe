'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react';
import { motion } from 'framer-motion';
import useCheckIngredients from '../../hooks/useCheckIngredients';
import CheckIngredients from './components/CheckIngredients';
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
      className="grid grid-cols-1 gap-8 items-center justify-items-center min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-blue-400">레시피 마법사</h1>
        <p className="text-xl text-gray-300">
          재료를 입력하면 레시피를 자동으로 추천해드립니다!
        </p>
      </motion.div>
      <motion.div
        // whileHover={{ scale: 1.05 }}
        // whileTap={{ scale: 0.95 }}
        className="w-full max-w-md"
      >
        <ImageUploader setUploadedImages={setUploadedImages} setIsUploadComplete={setIsUploadComplete} isAuto={isAuto} setIsAuto={setIsAuto} />
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
