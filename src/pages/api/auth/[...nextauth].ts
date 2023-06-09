import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import { prisma } from "@/lib/db";

type ServerSidePropsReq = IncomingMessage & {
  cookies: Partial<{ [key: string]: string }>;
};

export const authOptions = (
  req: NextApiRequest | ServerSidePropsReq
): AuthOptions => {
  return {
    providers: [
      CredentialsProvider({
        // @ts-ignore
        async authorize(credentials) {
          if (!credentials) {
            throw new Error("user can not be authenticated");
          }

          const nonce = req.cookies["auth-nonce"];

          const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
          const messageBytes = new TextEncoder().encode(message);

          const publicKeyBytes = bs58.decode(credentials.publicKey);
          const signatureBytes = bs58.decode(credentials.signature);

          const result = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
          );

          if (!result) {
            throw new Error("user can not be authenticated");
          }

          const user = { name: credentials.publicKey };

          const profile = await prisma.user.findUnique({
            where: {
              address: credentials.publicKey,
            },
          });

          if (!profile) {
            await prisma.user.create({
              data: {
                address: credentials.publicKey,
              },
            });
          }

          return user;
        },
      }),
    ],
    pages: {
      signIn: "/auth",
    },
  };
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions(req));
};

export default handler;
