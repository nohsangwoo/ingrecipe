'use client'

import axios from "axios"
import { useEffect, useState } from "react";
import { IdentifyingTheIngredientsBodyType } from "../../../pages/api/IdentifyingTheIngredients";


interface CheckIngredientsProps {
    uploadedImages: string[]
}


const CheckIngredients = ({ uploadedImages }: CheckIngredientsProps) => {
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState("");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            <button
                onClick={handleSubmit}
            >
                check
            </button>
        </div>
    )
}

export default CheckIngredients