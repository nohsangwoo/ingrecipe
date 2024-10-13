import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckIngredientsProps {
    isLoading: boolean
    parsedData: string[]
    isAuto: boolean
}

const CheckIngredients = ({ isLoading, parsedData, isAuto }: CheckIngredientsProps) => {
    const [ingredients, setIngredients] = useState<string[]>(parsedData);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [askSalt, setAskSalt] = useState<boolean>(false);
    const [askPepper, setAskPepper] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIngredients([...parsedData])

    }, [parsedData])

    useEffect(() => {
        checkSaltAndPepper();
    }, [ingredients]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewIngredient(e.target.value);
    };

    // const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === ',') {
    //         e.preventDefault();
    //         addIngredient();
    //     }
    // };

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

    const getRecipe = async ({ ingredients, lang }: { ingredients: string[], lang: string }) => {
        const response = await axios.post('/api/getRecipe', { ingredients, lang });
        if (!response.data.ok) {
            throw new Error(response.data.error || '알 수 없는 오류가 발생했습니다.');
        }
        return response.data.data;
    };

    const { mutate: fetchRecipe, data: recipeData, error: fetchError, isPending } = useMutation({
        mutationFn: () => getRecipe({ ingredients, lang: "korean" }),
        onSuccess: (data) => {
            setError(null);
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });



    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-64"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"
                />
            </motion.div>
        );
    }

    if (isAuto && (!parsedData || parsedData?.length === 0)) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400"
            >
                데이터 없음
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-4 text-blue-400">기존 재료</h2>
            <motion.div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence>
                    {parsedData.map((ingredient, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
                        >
                            {ingredient}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </motion.div>

            <h2 className="text-2xl font-bold mb-4 text-green-400">추가된 재료</h2>
            <motion.div className="flex flex-wrap gap-2 mb-4">
                <AnimatePresence>
                    {ingredients.slice(parsedData.length).map((ingredient, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-sm"
                        >
                            {ingredient}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </motion.div>

            <motion.div className="mb-4 flex">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    addIngredient()
                }}>
                    <input
                        type="text"
                        value={newIngredient}
                        onChange={handleInputChange}
                        // onKeyDown={handleInputKeyDown}
                        placeholder="추가 재료를 입력하세요"
                        className="flex-grow border border-gray-700 bg-gray-900 text-gray-100 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        // onClick={addIngredient}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r transition-colors hover:bg-blue-700"
                    >
                        추가
                    </motion.button>
                </form>
            </motion.div>

            <AnimatePresence>
                {askSalt && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addSalt}
                            className="bg-yellow-600 text-white px-4 py-1 rounded transition-colors hover:bg-yellow-700"
                        >
                            소금 추가
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {askPepper && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addPepper}
                            className="bg-yellow-600 text-white px-4 py-1 rounded transition-colors hover:bg-yellow-700"
                        >
                            후추 추가
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchRecipe()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-colors hover:bg-green-700 w-full mt-4"
                disabled={isPending}
            >
                {isPending ? '로딩 중...' : '요리 가능한 레시피 얻기'}
            </motion.button>

            <AnimatePresence>
                {fetchError && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 p-4 bg-red-900 text-red-100 rounded-lg"
                    >
                        <h3 className="font-bold">오류:</h3>
                        <p>{(fetchError as Error).message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {recipeData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 p-4 bg-gray-700 rounded-lg"
                    >
                        <h3 className="font-bold text-xl mb-2 text-green-400">레시피 제안:</h3>
                        <pre className="whitespace-pre-wrap text-gray-300">{recipeData}</pre>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default CheckIngredients