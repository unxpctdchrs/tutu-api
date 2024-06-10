import { Hono } from "hono"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { bearerAuth } from "hono/bearer-auth"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import { compare, hash } from "bcrypt-ts"

export type Env = {
	DATABASE_URL: string
	TOKEN: string
}

const app = new Hono<{Bindings: Env}>()

app
	.use('/*', async (c, next) => {
		const auth = bearerAuth({
			token: c.env.TOKEN,
		})
		return await auth(c, next)
	})

	.get('users', async (c) => {
		try {
			const sql = neon(c.env.DATABASE_URL)
			const db = drizzle(sql)
	
			const getAllUsers = await db.select({ username: users.username, address: users.address, balance: users.balance, isAdmin: users.isMentor }).from(users)
	
			return c.json(getAllUsers)
		} catch (error) {
			console.log(error)
		}
	})

	.post('register', async (c) => {
		try {
			const sql = neon(c.env.DATABASE_URL)
			const db = drizzle(sql)
			const body = await c.req.parseBody()
			const { username, password, birthDatePlace, email, phoneNumber, jenjangPendidikan } = body

			// check first if the username already exists
			const usernametocheck: string = username.toString()
			const existingUsername = await db.select({ username: users.username }).from(users).where(eq(users.username, usernametocheck))
			if (existingUsername.length > 0) {
				return c.json({message: 'username sudah diambil orang'})
			}

			const hashedPassword = await hash(password.toString(), 10)

			const insertedUser = await db.insert<PgTable>(users).values({ username, password: hashedPassword, birthDatePlace, email, phoneNumber, jenjangPendidikan }).returning()

			if (insertedUser.length > 0) {
				return c.json({ error: false, message: "User created successfully" })
			} else {
				return c.json({ error: true, message: "Failed to create user" }, 500)
			}

		} catch (error) {
			console.log(error)
		}
	})

	.post('login', async (c) => {
		try {
			const sql = neon(c.env.DATABASE_URL)
			const db = drizzle(sql)
			const body = await c.req.parseBody()
			const { username, password } = body

			// find the user by username
			const user = await db.select().from(users).where(eq(users.username, username.toString()))

			if (!user) {
				return c.json({ error: false, message: "Invalid username or password" }, 401)
			}

			//compare the provided password with the stored password
			const isPasswordValid = await compare(password.toString(), user[0].password)

			if (!isPasswordValid) {
				return c.json({ error: true, message: 'Invalid username or password' }, 401)
			}
	
			// Password is valid, return user data or generate a token
			return c.json({ error: false, message: 'Login successful', loginResult: user })


		} catch (error) {
			console.log(error)
		}
	})


export default app
