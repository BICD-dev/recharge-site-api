import pool from "../utils/database/db";
import userTypes from "../types/user.type";
interface userDataTypes{
    id:number,
    first_name:string,
    last_name:string,
    password:string,
    email:string,
    phone:string,
    role:string,
    created_at:Date
}

export const createUserWithWallet = async (user: userTypes)=>{
    const client = pool.connect();
    try{
        (await client).query('BEGIN');
        // create user
        const userQuery = `INSERT INTO users (first_name, last_name, email, phone, password, role, is_active, verification_code, verification_code_expires) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, first_name, last_name, email, phone, is_active`;
        const userValues = [user.first_name, user.last_name, user.email, user.phone, user.password, user.role || 'user', user.is_active || false, user.verification_code || null, user.verification_code_expires || null];
        const userResults = (await client).query(userQuery, userValues);

        const userData =  (await userResults).rows[0];

        // creeate wallet attatched to user
        const WalletQuery = `INSERT INTO wallets (user_id, amount) 
        VALUES ($1, $2) RETURNING id, user_id, amount, currency, created_at`;
        const walletValues = [userData.id, 0];
        const walletResult = (await client).query(WalletQuery,walletValues)

        const walletData = (await walletResult).rows[0];

        (await client).query('COMMIT');

        return {userData, walletData}
        
    } catch(error){
        (await client).query('ROLLBACK');
        throw error;
    } finally{
        (await client).release();
    }
};

export const findUserByEmail = async (email:string)=>{
    try {
        const userQuery = `SELECT id, first_name, last_name, email, phone, password,role, created_at
            FROM users
            where email = $1
            LIMIT 1`;
        const values = [email];
        const user = await pool.query(userQuery, values);

        const userData:userDataTypes= user.rows[0]

        return userData || null
    } catch (error) {
        throw error
    }
}

export const update = async (
    data:{update:{}, conditions:{}}
)=>{
    const newData = data.update;
    const conditionData = data.conditions;
    const updateKeys = Object.keys(newData);
    const updateValues = Object.values(newData);
    const updateSet = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const ConditionKeys = Object.keys(conditionData);
    const values = Object.values(conditionData);
    const conditions = ConditionKeys.map((key, index) => `${key} = $${index + 1 + updateKeys.length}`).join(' AND ');

    const query = `UPDATE users SET ${updateSet}
     WHERE ${conditions}
     RETURNING id, email`;
     const updateQuery = await pool.query(query, [...updateValues, ...values])

     const updatedData = updateQuery.rows[0];

        return updatedData || null;
};

export const findUser = async (data:{})=>{
    const keys = Object.keys(data);
    const values = Object.values(data);
    const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');

    const query = `SELECT id, first_name, last_name, email, phone, role, is_active, verification_code, verification_code_expires, created_at
    FROM users
    WHERE ${conditions}
    LIMIT 1 
    const result = await pool.query(query, values);
    return result.rows[0] || null;`;
    const result = await pool.query(query, values)

    return result.rows[0] || null;
}