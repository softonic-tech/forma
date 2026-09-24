import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

function client() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!region || !bucket || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('Set AWS_REGION, AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY');
  }
  return {
    bucket,
    region,
    s3: new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })
  };
}

export async function uploadImage({ key, body, contentType }) {
  const { s3, bucket, region } = client();
  const input = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000'
  };
  try {
    await s3.send(new PutObjectCommand({ ...input, ACL: 'public-read' }));
  } catch {
    await s3.send(new PutObjectCommand(input));
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
