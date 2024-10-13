'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react';
import useCheckIngredients from '../../hooks/useCheckIngredients';
import CheckIngredients from './components/CheckIngredients';
const ImageUploader = dynamic(() => import('./components/ImageUploader'), { ssr: false })

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);


  const { isLoading, parsedData } = useCheckIngredients({ uploadedImages, isUploadComplete })

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ImageUploader setUploadedImages={setUploadedImages} setIsUploadComplete={setIsUploadComplete} />
      <CheckIngredients isLoading={isLoading} parsedData={parsedData} />
    </div>
  )
}