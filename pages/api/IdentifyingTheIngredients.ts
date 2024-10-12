import type { NextApiRequest, NextApiResponse } from 'next'

export type IdentifyingTheIngredientsBodyType = {
  firstKey: string
  secondKey: string
  thirdKey: string
}

type ResponseData = {
  message: string
  data?: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'GET') {
    // GET 요청 처리
    const { query } = req
    res.status(200).json({
      message: 'GET 요청 처리됨',
      data: query,
    })
  } else if (req.method === 'POST') {
    // POST 요청 처리
    const body = req.body as IdentifyingTheIngredientsBodyType

    console.log('body: ', body)

    res.status(200).json({
      message: 'POST 요청 처리됨',
      data: body,
    })
  } else {
    // 다른 HTTP 메소드에 대한 처리
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }
}
