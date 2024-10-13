import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckIngredientsProps {
    isLoading: boolean;
    parsedData: string[];
    isAuto: boolean;
}

interface IngredientSectionProps {
    title: string;
    ingredients: string[];
    bgColor: string;
    textColor: string;
}

interface ConditionalButtonProps {
    condition: boolean;
    onClick: () => void;
    text: string;
}

interface ErrorMessageProps {
    error: string;
}

interface RecipeDisplayProps {
    recipeData: string;
}

const CheckIngredients: React.FC<CheckIngredientsProps> = ({ isLoading, parsedData, isAuto }) => {
    const [ingredients, setIngredients] = useState<string[]>(parsedData);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [askSalt, setAskSalt] = useState<boolean>(false);
    const [askPepper, setAskPepper] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIngredients([...parsedData]);
    }, [parsedData]);

    useEffect(() => {
        checkSaltAndPepper();
    }, [ingredients]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewIngredient(e.target.value);
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
                className="flex flex-col items-center justify-center h-64 text-center text-gray-400"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="mb-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5M9 14c-.2-1-.7-1.7-1.5-2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path d="M9 17c.85.63 1.885 1 3 1s2.15-.37 3-1" />
                    </svg>
                </motion.div>
                <motion.p
                    animate={{
                        opacity: [1, 0.5, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    재료입력 대기중
                </motion.p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 p-6 rounded-xl shadow-2xl"
        >
            <motion.h2
                className="text-3xl font-bold mb-6 text-blue-400 text-center"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                재료 목록
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <IngredientSection title="기존 재료" ingredients={parsedData} bgColor="bg-blue-900" textColor="text-blue-200" />
                <IngredientSection title="추가된 재료" ingredients={ingredients.slice(parsedData.length)} bgColor="bg-green-900" textColor="text-green-200" />
            </div>

            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <form onSubmit={(e) => { e.preventDefault(); addIngredient(); }} className="flex">
                    <input
                        type="text"
                        value={newIngredient}
                        onChange={handleInputChange}
                        placeholder="추가 재료를 입력하세요"
                        className="flex-grow border-2 border-gray-700 bg-gray-800 text-gray-100 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-r-lg transition-colors duration-300 hover:bg-blue-700"
                    >
                        추가
                    </motion.button>
                </form>
            </motion.div>

            <div className="flex justify-center space-x-4 mb-6">
                <ConditionalButton condition={askSalt} onClick={addSalt} text="소금 추가" />
                <ConditionalButton condition={askPepper} onClick={addPepper} text="후추 추가" />
            </div>

            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fetchRecipe()}
                className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:from-green-600 hover:to-blue-600 w-full text-lg font-semibold ${isPending ? 'relative overflow-hidden' : ''}`}
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <span className="opacity-0">레시피 생성 중...</span>
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="w-6 h-6 border-t-2 border-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.span
                                className="ml-2"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                레시피 생성 중...
                            </motion.span>
                        </motion.div>
                    </>
                ) : (
                    '요리 가능한 레시피 얻기'
                )}
            </motion.button>

            <AnimatePresence>
                {fetchError && <ErrorMessage error={(fetchError as Error).message} />}
            </AnimatePresence>

            <AnimatePresence>
                {recipeData && <RecipeDisplay recipeData={recipeData} />}
            </AnimatePresence>
        </motion.div>
    );
};

const IngredientSection: React.FC<IngredientSectionProps> = ({ title, ingredients, bgColor, textColor }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`${bgColor} p-4 rounded-lg shadow-md`}
    >
        <h3 className={`text-xl font-semibold mb-3 ${textColor}`}>{title}</h3>
        <div className="flex flex-wrap gap-2">
            <AnimatePresence>
                {ingredients.map((ingredient, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className={`px-3 py-1 ${textColor} rounded-full text-sm border border-opacity-50`}
                    >
                        {ingredient}
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    </motion.div>
);

const ConditionalButton: React.FC<ConditionalButtonProps> = ({ condition, onClick, text }) => (
    <AnimatePresence>
        {condition && (
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-yellow-700"
            >
                {text}
            </motion.button>
        )}
    </AnimatePresence>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-6 p-4 bg-red-900 text-red-100 rounded-lg"
    >
        <h3 className="font-bold text-lg mb-2">오류 발생:</h3>
        <p>{error}</p>
    </motion.div>
);

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipeData }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-6 p-6 bg-gray-800 rounded-lg shadow-inner"
    >
        <h3 className="font-bold text-2xl mb-4 text-green-400">레시피 제안:</h3>
        <pre className="whitespace-pre-wrap text-gray-300 text-lg">{recipeData}</pre>
    </motion.div>
);

export default CheckIngredients;
