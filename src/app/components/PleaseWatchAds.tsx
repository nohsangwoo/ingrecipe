import { motion } from "framer-motion";
import useLangStore, { LangEnum } from "../store/useLangStore";

export default function PleaseWatchAds() {
    const { lang } = useLangStore()

    const text = {
        title: {
            [LangEnum.ENGLISH]: "Support Us!",
            [LangEnum.KOREAN]: "저희를 지원해주세요!",
            [LangEnum.RUSSIAN]: "Поддержите нас!",
            [LangEnum.JAPANESE]: "私たちを支援してください！",
        },
        description: {
            [LangEnum.ENGLISH]: "Click on ads to help us improve our service.",
            [LangEnum.KOREAN]: "광고 클릭으로 서비스 개선에 도움을 주세요.",
            [LangEnum.RUSSIAN]: "Кликните на рекламу, чтобы помочь нам улучшить сервис.",
            [LangEnum.JAPANESE]: "広告をクリックして、サービス向上にご協力ください。",
        },
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-gray-600 rounded-lg text-center"
        >
            <p className="text-yellow-300 text-lg font-medium">
                {text.title[lang]}
            </p>
            <p className="text-gray-300 mt-2">
                {text.description[lang]}
            </p>
        </motion.div>
    )
}
