

export const accessTokenHeader = (token: string): { headers: { Authorization: string } } => (
    {
        headers: { Authorization: `Bearer ${token}` },
    }
);