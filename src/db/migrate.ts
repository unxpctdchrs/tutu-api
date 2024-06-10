import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { config } from "dotenv"

config({
    path: '.dev.vars'
})

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql)

const main = async () => {
    try {
        await migrate(db, {
            migrationsFolder: 'drizzle',
        })
        console.log('Migration successful')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

main()