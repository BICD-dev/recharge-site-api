import bcrypt from 'bcrypt'
export const hashPassword = (password:string, saltrounds=12)=>{
    const hashedPassword = bcrypt.hash(password,saltrounds);
    return hashedPassword;
}