export interface Speaker {
    id: string;
    name: string;
    role?: string;
    company?: string;
    bio?: string;
    avatarUrl?: string;
    email?: string;
    phone?: string;
    twitter?: string;
    linkedin?: string;
}

export interface CreateSpeakerDTO {
    name: string;
    role?: string;
    company?: string;
    email?: string;
}
