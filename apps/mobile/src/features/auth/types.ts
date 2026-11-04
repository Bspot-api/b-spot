export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AdminProfile {
  adminId: string;
  userId: string;
  email: string;
  name: string;
  promotedAt: string;
}
