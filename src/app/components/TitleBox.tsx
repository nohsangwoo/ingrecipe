'use client'
import { motion } from "framer-motion";
import useLangStore, { LangEnum } from "../store/useLangStore";


export default function TitleBox() {
    const { lang } = useLangStore()
    const text = {
        title: {
            [LangEnum.ENGLISH]: "Recipe Wizard",
            [LangEnum.KOREAN]: "레시피 마법사",
            [LangEnum.RUSSIAN]: "Мастер рецептов",
            [LangEnum.JAPANESE]: "レシピウィザード",
        },
        subTitle: {
            [LangEnum.ENGLISH]: "Enter ingredients and we'll automatically recommend recipes for you!",
            [LangEnum.KOREAN]: "재료를 입력하면 레시피를 자동으로 추천해드립니다!",
            [LangEnum.RUSSIAN]: "Введите ингредиенты, и мы автоматически порекомендуем вам рецепты!",
            [LangEnum.JAPANESE]: "材料を入力すると、自動的にレシピをおすすめします！",
        }
    }

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mt-14"
        >
            <h1 className="text-4xl font-bold mb-4 text-blue-400">
                {text.title[lang]}
            </h1>
            <p className="text-xl text-gray-300">
                {text.subTitle[lang]}
            </p>
        </motion.div>
    )
}