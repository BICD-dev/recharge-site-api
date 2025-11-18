import pool from "../utils/database/db";

const createWalletTable = async ()=>{
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wallets(
            id SERIAL PRIMARY KEY,
            user_id UNIQUE NOT NULL REFERENCES user(id) ON DELETE CASCADE,
            amount NUMERIC(12,2) DEFAULT 0 CHECK (amount>=0),
            currency VARCHAR(6) DEFAULT 'NGN',
            created_at TIMESTAMP DEFAULT NOT NULL CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NOT NULL CURRENT_TIMESTAMP
            )
            `)
    console.log("Wallet table created successfully!");
  } catch (error) {
    console.error("Error creating Wallet table:", error);
  } finally {
    await pool.end();
  }
}

createWalletTable();
