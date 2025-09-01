// cardl.io User Types
export interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name?: string
  avatar_url?: string
  provider?: 'google' | 'apple' | 'email'
  beta_access: boolean
  beta_access_granted_at?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface CreateUserProfileData {
  user_id: string
  email: string
  full_name?: string
  avatar_url?: string
  provider?: 'google' | 'apple' | 'email'
}

export interface UpdateUserProfileData {
  full_name?: string
  avatar_url?: string
  status?: 'active' | 'inactive' | 'suspended'
}

// Auth Session mit User Profile
export interface AuthSession {
  user: {
    id: string
    email: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
    app_metadata?: {
      provider?: string
    }
  }
  profile?: UserProfile
}

// Beta Access Status
export interface BetaAccessStatus {
  hasAccess: boolean
  grantedAt?: string
  email?: string
}
