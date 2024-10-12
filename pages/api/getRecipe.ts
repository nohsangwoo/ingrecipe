import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

export type GetRecipeBodyType = {
  ingredients: string[]
  genre?: string
  lang?: string
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

    const { ingredients, genre, lang } = body as GetRecipeBodyType

    const prompt = `Create 5 recipe suggestions using the following ingredients: ${ingredients.join(
      ', ',
    )}. 
    If a genre (${genre}) is specified, focus on recipes from that cuisine. 
    For each recipe, provide a detailed, step-by-step guide including relative proportions and weights of ingredients. 
    Also, suggest a relevant search term for each recipe.
    Format the response as follows:
    1. Recipe Name
    - Main Ingredient: [Name]
    - Ingredients:
      * [Ingredient 1]: [Amount]
      * [Ingredient 2]: [Amount]
      ...
    - Steps:
      1. [Step 1]
      2. [Step 2]
      ...
    - Cuisine: [Cuisine type]
    - Search Term: [A relevant search term for this recipe]

    Repeat this format for all 5 recipes. Please respond in ${
      lang || 'English'
    }.`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              "You are a professional chef with expertise in various international cuisines. Your task is to create detailed, easy-to-follow recipes based on given ingredients and preferences. Provide accurate measurements, cooking times, and clear instructions. If specified, tailor your response language to the user's preference.",
          },
          { role: 'user', content: prompt },
        ],
      })

      console.log('result: ', completion.choices[0].message.content)
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
