'use client'

import axios from "axios"
import { useEffect, useState } from "react";
import { IdentifyingTheIngredientsBodyType, IdentifyingTheIngredientsResponseData } from "../pages/api/IdentifyingTheIngredients";


interface CheckIngredientsProps {
    uploadedImages: string[]
    isUploadComplete: boolean
}


const useCheckIngredients = ({ uploadedImages, isUploadComplete }: CheckIngredientsProps) => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState<IdentifyingTheIngredientsResponseData>();


    const checking = async () => {
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

    return { parsedData, isLoading: loading };

}

export default useCheckIngredients
