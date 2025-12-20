// Load allowed emails from environment variable
// In test environments, this can be mocked or the env var can be set
export const getAllowedEmails = () => {
    return (import.meta.env.VITE_ALLOWED_EMAILS || '').split(',').filter(Boolean);
};

export function isEmailAllowed(email?: string): boolean {
    if (!email) return false;

    const allowedList = getAllowedEmails();

    // If list is empty in dev, maybe we fail open or closed? 
    // Secure by default: fail closed if no list is provided.
    if (allowedList.length === 0) {
        console.warn('VITE_ALLOWED_EMAILS is empty. All access will be denied.');
        return false;
    }

    return allowedList.includes(email);
}
