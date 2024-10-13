import { LangEnumTYPE } from '@/app/store/useLangStore'
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

export type IdentifyingTheIngredientsBodyType = {
  firstKey: string
  secondKey: string
  thirdKey: string
  lang: LangEnumTYPE
}

export type IdentifyingTheIngredientsResponseData = {
  ok: boolean
  error?: string
  data?: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IdentifyingTheIngredientsResponseData>,
) {
  if (req.method === 'GET') {
    // GET 요청 처리
    const { query } = req
    res.status(200).json({
      ok: true,
      // data: query,
    })
  } else if (req.method === 'POST') {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const baseUrl = process.env.NEXT_PUBLIC_CLOUD_FRONT_DOMAIN

    // POST 요청 처리
    const body = req.body as IdentifyingTheIngredientsBodyType
    const lang = body.lang

    const mergeKeys = [body?.firstKey, body?.secondKey, body?.thirdKey].filter(
      key => key !== undefined && key !== null && key !== '',
    )

    const imageTypeMessages = mergeKeys.map(key => ({
      type: 'image_url',
      image_url: {
        url: `https://${baseUrl}/${key}`,
        detail: 'low',
      },
    })) as any

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI trained to identify ingredients in images. Analyze the provided image(s) and list the ingredients you see. Respond only with an array of ingredient names in ${lang}. If ${lang} is not a valid language, default to English.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Identify the ingredients in the following image(s). Provide your answer as a single-line array of ingredient names in ${lang}, without any line breaks or extra spaces. For example: ["pork","soy sauce","garlic"]`,
            },
            ...imageTypeMessages,
          ],
        },
      ],
      max_tokens: 300,
    })

    const contentResult = response.choices[0].message.content
    res.status(200).json({
      ok: true,
      data: contentResult,
    })
  } else {
    // 다른 HTTP 메소드에 대한 처리
    res.setHeader('Allow', ['GET', 'POST'])
    res
      .status(405)
      .json({ ok: false, error: `Method ${req.method} Not Allowed` })
  }
}
