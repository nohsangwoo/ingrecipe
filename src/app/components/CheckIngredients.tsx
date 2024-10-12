'use client'

import axios from "axios"
import { useEffect, useState } from "react";
import { IdentifyingTheIngredientsBodyType, IdentifyingTheIngredientsResponseData } from "../../../pages/api/IdentifyingTheIngredients";


interface CheckIngredientsProps {
    uploadedImages: string[]
    isUploadComplete: boolean
}


const CheckIngredients = ({ uploadedImages, isUploadComplete }: CheckIngredientsProps) => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState<IdentifyingTheIngredientsResponseData>();


    const checking = async () => {
        console.log("uploadedImages check in useEffect: ", uploadedImages)
        if (uploadedImages.length === 0 || !uploadedImages || !isUploadComplete) {
            return
        }
        setLoading(true);
        try {

            const makeArgs = {
                firstKey: uploadedImages?.[0],
                secondKey: uploadedImages?.[1],
                thirdKey: uploadedImages?.[2]
            }

            const response = await axios.post(`/api/IdentifyingTheIngredients`, {
                ...makeArgs
            } as IdentifyingTheIngredientsBodyType, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setResData(response.data);
        } catch (error) {
            console.error(' 가져오기 오류:', error);
            if (axios.isAxiosError(error)) {
                alert(`가져오기 실패: ${error.response?.data?.message || error.message}`);
            } else {
                alert('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        checking()
    }, [uploadedImages])

    const parsedData = resData?.data ? JSON.parse(resData.data) : [];

    return (
        <div className="flex flex-col gap-3">
            <h1>
                CheckIngredients
            </h1>
            <div className="flex flex-col p-1 border">
                {
                    uploadedImages.map((uploadedImage, index) => {
                        return (
                            <div
                                key={index}
                                className="border border-bllue-400"
                            >
                                {uploadedImage}
                            </div>
                        )
                    })
                }
            </div>
            <div>
                {
                    Array.isArray(parsedData) && parsedData.map((item, index) => (
                        <div key={index}>{item}</div>
                    ))
                }
            </div>

        </div>
    )
}

export default CheckIngredients
