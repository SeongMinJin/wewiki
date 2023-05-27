import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";
import secret from "../../../../client_secret.json";

const handler = NextAuth({
	providers: [
		Google({
			clientId: secret.web.client_id,
			clientSecret: secret.web.client_secret,
		}),
	]
})

export { handler as GET, handler as POST }