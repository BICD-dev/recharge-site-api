interface userType {
    id?: number; // sometimes the id is not sent, like when we are creating a new user, we arent th eone generating the id
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    is_active: boolean;
    verification_code: string,
    verification_code_expires: Date;
    created_at?: Date;
    updated_at?: Date;
}

export default userType;