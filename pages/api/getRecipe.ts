import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

export type GetRecipeBodyType = {
  firstKey: string
  secondKey: string
  thirdKey: string
}
type GetRecipeResponseData = {
  ok: boolean
  error?: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetRecipeResponseData>,
) {
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, data: 'Hello from Next.js!' })
  } else if (req.method === 'POST') {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // POST 요청 처리
    const body = req.body as GetRecipeBodyType

    console.log('body: ', body)

    const prompt = `test prompt`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "You are a professional fortune teller specializing in Korean traditional astrology. Provide detailed and personalized fortune-telling based on the user's information. Your responses should always be in Korean and follow the specified format.",
          },
          { role: 'user', content: prompt },
        ],
      })

      const result = completion.choices[0].message.content
      if (!result) {
        res.status(200).json({ ok: false, error: 'some error' })
      }
      res.status(200).json({ ok: true, data: 'hello recipe' })
    } catch (error) {
      console.error('Error:', error)
      res.status(200).json({ ok: false, error: error as string })
    }
  } else {
    // 다른 HTTP 메소드에 대한 처리
    res.setHeader('Allow', ['GET', 'POST'])
    res
      .status(405)
      .json({ ok: false, error: `Method ${req.method} Not Allowed` })
  }
}
