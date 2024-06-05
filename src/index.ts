import { Hono } from "hono"

const app = new Hono()

app
	.use('/', async (c) => {
		return c.json({message: 'hello world!'})
	})


export default app
