import fs from 'node:fs'
import {
  GetPublicKeyOrSecret,
  JwtHeader,
  JwtPayload,
  sign,
  SigningKeyCallback,
  verify,
} from 'jsonwebtoken'
import jwksClient from 'jwks-client'
import moodleUris from './links'

type JWTMessage = string | Buffer | object

export async function signMessage(message: JWTMessage): Promise<string> {
  const privateKey = await fs.promises.readFile('private_key.pem', 'utf8')
  return sign(message, privateKey, {
    algorithm: 'RS256',
    expiresIn: '5m',
  })
}

type JWTVerifyResult = string | JwtPayload | undefined

export async function verifyMessage(
  message: string,
): Promise<JWTVerifyResult> {
  try {
    const decodedMsg = await new Promise<JWTVerifyResult>((resolve, reject) => {
      verify(
        message,
        getISSJWKSKey('a'),
        { algorithms: ['RS256'] },
        (err, decoded) => {
          if (err) reject(err)
          resolve(decoded)
        },
      )
    })
    return decodedMsg
  } catch (error) {
    throw error
  }
}

export function getISSJWKSKey(iss: string): GetPublicKeyOrSecret {
  const client = jwksClient({
    jwksUri: moodleUris(iss).certs,
  })
  return (header: JwtHeader, callback: SigningKeyCallback) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err)
      } else {
        const signingKey = key.rsaPublicKey || key.publicKey
        callback(null, signingKey)
      }
    })
  }
}
