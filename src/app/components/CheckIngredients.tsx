import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CheckIngredientsProps {
    isLoading: boolean
    parsedData: string[]
}

const CheckIngredients = ({ isLoading, parsedData }: CheckIngredientsProps) => {
    const [ingredients, setIngredients] = useState<string[]>(parsedData);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [askSalt, setAskSalt] = useState<boolean>(false);
    const [askPepper, setAskPepper] = useState<boolean>(false);

    useEffect(() => {
        checkSaltAndPepper();
    }, [ingredients]);

    if (isLoading) {
        <div>
            로딩중
        </div>
    }



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewIngredient(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',') {
            e.preventDefault();
            addIngredient();
        }
    };

    const addIngredient = () => {
        if (newIngredient.trim()) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const checkSaltAndPepper = () => {
        const saltTerms = ['salt', '소금', 'соль', '塩'];
        const pepperTerms = ['pepper', '후추', 'перец', 'こしょう'];

        const hasSalt = ingredients.some(ingredient =>
            saltTerms.some(term => ingredient.toLowerCase().includes(term))
        );
        const hasPepper = ingredients.some(ingredient =>
            pepperTerms.some(term => ingredient.toLowerCase().includes(term))
        );

        setAskSalt(!hasSalt);
        setAskPepper(!hasPepper);
    };

    const addSalt = () => {
        setIngredients([...ingredients, '소금']);
        setAskSalt(false);
    };

    const addPepper = () => {
        setIngredients([...ingredients, '후추']);
        setAskPepper(false);
    };

    const getRecipe = async () => {
        try {
            const response = await axios.post('/api/getRecipe', { ingredients });

            console.log("response: ", response.data)
            // 응답 처리
        } catch (error) {
            console.error('레시피 가져오기 오류:', error);
        }
    };


    if (!parsedData || parsedData?.length === 0) {
        return (
            <div>
                데이터 없음
            </div>
        )

    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">기존 재료</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {parsedData.map((ingredient, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded border border-blue-300">
                        {ingredient}
                    </span>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-4">추가된 재료</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.slice(parsedData.length).map((ingredient, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded border border-green-300">
                        {ingredient}
                    </span>
                ))}
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    value={newIngredient}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="추가 재료를 입력하세요 (콤마로 구분)"
                    className="border border-gray-300 rounded px-2 py-1 mr-2"
                />
                <button onClick={addIngredient} className="bg-blue-500 text-white px-4 py-1 rounded">
                    추가
                </button>
            </div>

            {askSalt && (
                <div className="mb-2">
                    <p>소금이 필요한가요?</p>
                    <button onClick={addSalt} className="bg-yellow-500 text-white px-4 py-1 rounded">
                        소금 추가
                    </button>
                </div>
            )}

            {askPepper && (
                <div className="mb-2">
                    <p>후추가 필요한가요?</p>
                    <button onClick={addPepper} className="bg-yellow-500 text-white px-4 py-1 rounded">
                        후추 추가
                    </button>
                </div>
            )}

            <button onClick={getRecipe} className="bg-green-500 text-white px-4 py-2 rounded">
                요리 가능한 레시피 얻기
            </button>
        </div>
    )
}

export default CheckIngredients
