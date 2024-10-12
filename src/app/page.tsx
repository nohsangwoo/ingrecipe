'use client'

import dynamic from 'next/dynamic'

const ImageUploader = dynamic(() => import('./components/ImageUploader'), { ssr: false })

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">이미지 업로더</h1>
      <ImageUploader />
    </div>
  )
}