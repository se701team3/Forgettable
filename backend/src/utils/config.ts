import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || "port not found"
const MONGODB_URI = process.env.MONGODB_URI || "url not found"

const config = {
	PORT,
	MONGODB_URI
}

export default config