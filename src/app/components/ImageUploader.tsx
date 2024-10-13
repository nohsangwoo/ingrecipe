import React, { useState, useCallback, Dispatch, SetStateAction, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import useLangStore, { LangEnum } from '../store/useLangStore';

const MAX_IMAGES = 3;
const MAX_DIMENSION = 1024;


interface ImageUploaderProps {
    setUploadedImages: Dispatch<SetStateAction<string[]>>
    isUploadComplete: boolean
    setIsUploadComplete: Dispatch<SetStateAction<boolean>>
    isAuto: boolean
    setIsAuto: Dispatch<SetStateAction<boolean>>
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setUploadedImages, isUploadComplete, setIsUploadComplete, isAuto, setIsAuto }) => {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const { lang } = useLangStore()

    const text = {
        uploadSuccess: {
            [LangEnum.ENGLISH]: "All images have been successfully uploaded.",
            [LangEnum.KOREAN]: "모든 이미지가 성공적으로 업로드되었습니다.",
            [LangEnum.RUSSIAN]: "Все изображения успешно загружены.",
            [LangEnum.JAPANESE]: "すべての画像が正常にアップロードされました。",
        },
        uploadFail: {
            [LangEnum.ENGLISH]: "An error occurred while uploading images.",
            [LangEnum.KOREAN]: "이미지 업로드 중 오류가 발생했습니다.",
            [LangEnum.RUSSIAN]: "Произошла ошибка при загрузке изображений.",
            [LangEnum.JAPANESE]: "画像のアップロード中にエラーが発生しました。",
        },
        pleaseDropHere: {
            [LangEnum.ENGLISH]: "Drop images here...",
            [LangEnum.KOREAN]: "이미지를 여기에 놓으세요...",
            [LangEnum.RUSSIAN]: "Перетащите изображения сюда...",
            [LangEnum.JAPANESE]: "ここに画像をドロップしてください...",
        },
        pleaseDropAndDropHere: {
            [LangEnum.ENGLISH]: "Drag and drop images or click to select ingredients.",
            [LangEnum.KOREAN]: "이미지를 드래그 앤 드롭하거나 클릭하여 재료를 선택하세요.",
            [LangEnum.RUSSIAN]: "Перетащите изображения или нажмите, чтобы выбрать ингредиенты.",
            [LangEnum.JAPANESE]: "画像をドラッグ＆ドロップするか、クリックして材料を選択してください。",
        },
        maxImagesDescription: {
            [LangEnum.ENGLISH]: `You can upload a maximum of ${MAX_IMAGES} images.`,
            [LangEnum.KOREAN]: `최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`,
            [LangEnum.RUSSIAN]: `Вы можете загрузить максимум ${MAX_IMAGES} изображений.`,
            [LangEnum.JAPANESE]: `最大${MAX_IMAGES}枚の画像をアップロードできます。`,
        },
        lengthCheck: {
            [LangEnum.ENGLISH]: "images selected:",
            [LangEnum.KOREAN]: "개의 이미지가 선택되었습니다:",
            [LangEnum.RUSSIAN]: "выбрано изображений:",
            [LangEnum.JAPANESE]: "枚の画像が選択されました：",
        },
        graspWithPhotos: {
            [LangEnum.ENGLISH]: "Identify ingredients from photos",
            [LangEnum.KOREAN]: "사진으로 재료 파악하기",
            [LangEnum.RUSSIAN]: "Определить ингредиенты по фотографиям",
            [LangEnum.JAPANESE]: "写真から材料を識別する",
        },
        enterManually: {
            [LangEnum.ENGLISH]: "Enter ingredients manually",
            [LangEnum.KOREAN]: "수동으로 재료 입력하기",
            [LangEnum.RUSSIAN]: "Ввести ингредиенты вручную",
            [LangEnum.JAPANESE]: "材料を手動で入力する",
        }
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > MAX_IMAGES) {
            alert(text.maxImagesDescription[lang]);
            return;
        }

        const processedImages = await Promise.all(
            acceptedFiles.map(async (file) => {
                const resizedImage = await resizeImage(file);
                const webpImage = await convertToWebP(resizedImage);
                return webpImage;
            })
        );

        setImages((prevImages) => [...prevImages, ...processedImages]);

        // 프리뷰 URL 생성
        const newPreviews = processedImages.map(file => URL.createObjectURL(file));
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }, [images]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: true
    });

    const uploadImages = async () => {
        setUploadedImages([])
        setIsUploadComplete(false);
        try {
            for (const image of images) {
                const response = await fetch('/api/presignedUrl?fileType=image/webp', {
                    mode: 'cors' // CORS 모드 명시
                });
                const { uploadUrl, key } = await response.json();

                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: image,
                    headers: {
                        'Content-Type': 'image/webp',
                    },
                    mode: 'cors' // CORS 모드 명시
                });

                setUploadedImages(prev => [...prev, key])
            }
            alert(text.uploadSuccess[lang]);
            setImages([]);
        } catch (error) {
            console.error('업로드 실패:', error);
            alert(text.uploadFail[lang]);
        } finally {
            setIsUploadComplete(true);
        }
    };



    useEffect(() => {
        return () => {
            previews.forEach(URL.revokeObjectURL);
        };
    }, [previews]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >

            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-600 p-8 mb-4 rounded-lg cursor-pointer hover:border-blue-500 hover:scale-105 transition-all duration-150 active:scale-100"
            >
                <input {...getInputProps()} />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-gray-300"
                >
                    {isDragActive ? text.pleaseDropHere[lang] : text.pleaseDropAndDropHere[lang]}
                </motion.p>
            </div>
            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                    >
                        <p className="text-gray-300 mb-2">{`${images.length}${text.lengthCheck[lang]}`}</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {images.map((image, index) => (
                                <div key={index} className="bg-gray-700 p-2 rounded">
                                    <img src={previews[index]} alt={image.name} className="w-full h-24 object-cover rounded mb-1" />
                                    <p className="text-xs text-gray-300 truncate">{image.name}</p>
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={uploadImages}
                            className="bg-blue-600 text-white p-2 rounded-md w-full transition-colors hover:bg-blue-700"
                        >
                            {text.graspWithPhotos[lang]}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
            {(images.length === 0 && isAuto && !isUploadComplete) && (
                <div
                    className="bg-yellow-600 text-white p-2 rounded-md w-full hover:bg-blue-700 mb-2 cursor-pointer flex justify-center items-center active:scale-95 transition-all duration-150 "
                    onClick={() => setIsAuto(false)}
                >
                    {text.enterManually[lang]}
                </div>
            )}
        </motion.div>
    );
};

async function resizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height && width > MAX_DIMENSION) {
                height *= MAX_DIMENSION / width;
                width = MAX_DIMENSION;
            } else if (height > MAX_DIMENSION) {
                width *= MAX_DIMENSION / height;
                height = MAX_DIMENSION;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], file.name, { type: 'image/webp' }));
                }
            }, 'image/webp');
        };
        img.src = URL.createObjectURL(file);
    });
}

async function convertToWebP(file: File): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' }));
                    }
                }, 'image/webp');
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export default ImageUploader;
