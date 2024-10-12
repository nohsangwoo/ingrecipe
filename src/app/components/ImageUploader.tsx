import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_IMAGES = 3;
const MAX_DIMENSION = 1080;


interface ImageUploaderProps {
    setUploadedImages: Dispatch<SetStateAction<string[]>>
    setIsUploadComplete: Dispatch<SetStateAction<boolean>>
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setUploadedImages, setIsUploadComplete }) => {
    const [images, setImages] = useState<File[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > MAX_IMAGES) {
            alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`);
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
                const response = await fetch('/api/presignedUrl?fileType=image/webp');
                const { uploadUrl, key } = await response.json();

                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: image,
                    headers: {
                        'Content-Type': 'image/webp',
                    },
                });

                console.log('업로드 성공:', key);
                setUploadedImages(prev => [...prev, key])
            }
            alert('모든 이미지가 성공적으로 업로드되었습니다.');
            setImages([]);
        } catch (error) {
            console.error('업로드 실패:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploadComplete(true);
        }
    };

    return (
        <div>
            <div {...getRootProps()} className="border-2 border-dashed p-4 mb-4">
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>이미지를 여기에 놓으세요...</p>
                ) : (
                    <p>이미지를 드래그 앤 드롭하거나 클릭하여 선택하세요</p>
                )}
            </div>
            {images.length > 0 && (
                <div>
                    <p>{images.length}개의 이미지가 선택되었습니다.</p>
                    <button onClick={uploadImages} className="bg-blue-500 text-white p-2 rounded">
                        업로드
                    </button>
                </div>
            )}
        </div>
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
