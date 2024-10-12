import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

type ResponseData = {
  message: string
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  async function main() {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What are in these images? Is there any difference between them?',
            },
            {
              type: 'image_url',
              image_url: {
                url: 'https://d1dtqoe0skbq6e.cloudfront.net/19233bd3-6e30-4624-a20b-679ea88c9a98.png',
              },
            },
            {
              type: 'image_url',
              image_url: {
                url: 'https://d1dtqoe0skbq6e.cloudfront.net/62ba67f2-746d-42d0-b6fb-7ad7513a16ea.png',
              },
            },
          ],
        },
      ],
    })
    console.log(response.choices[0])
    console.log(response.choices[0].message.content)
  }
  const response = await main()
  res.status(200).json({ message: 'Hello from Next.js!', data: response })
}
