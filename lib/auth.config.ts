import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    authorized({ auth }: { auth?: { user?: unknown } | null }) {
      return !!auth?.user;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow callback URLs on same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
