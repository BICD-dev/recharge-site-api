export function generateVerificationExpiry(minutes=15): Date{
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    return now
}

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
