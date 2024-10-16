import type { NextApiRequest, NextApiResponse } from 'next'
import S3 from 'aws-sdk/clients/s3'
import { randomUUID } from 'crypto'

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // CORS 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const ex = (req.query.fileType as string).split('/')[1] // 예를들면 "image/png" 에서 "png"만 추출
  const { fileType } = req.query

  const key = `ingrecipe/${randomUUID()}.${ex}` // 여기를 수정했습니다

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60,
    ContentType: fileType,
  }

  const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params)

  res.status(200).json({
    uploadUrl,
    key,
  })
}
