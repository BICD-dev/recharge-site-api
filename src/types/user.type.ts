interface userType {
    id: number;
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