import { supabase } from './supabaseClient'
import { UserProfile, CreateUserProfileData, UpdateUserProfileData, BetaAccessStatus } from '../types/user'

// User Service für cardl.io
export class UserService {
  // Benutzerprofil erstellen
  static async createUserProfile(data: CreateUserProfileData): Promise<UserProfile | null> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return null
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          provider: data.provider,
          beta_access: true, // Beta-Zugang automatisch gewähren
          beta_access_granted_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Error in createUserProfile:', error)
      return null
    }
  }

  // Benutzerprofil abrufen
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return null
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  // Benutzerprofil aktualisieren
  static async updateUserProfile(userId: string, data: UpdateUserProfileData): Promise<UserProfile | null> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return null
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Error in updateUserProfile:', error)
      return null
    }
  }

  // Beta-Zugang prüfen
  static async checkBetaAccess(email: string): Promise<BetaAccessStatus> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return { hasAccess: false }
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('beta_access, beta_access_granted_at, email')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error checking beta access:', error)
        return { hasAccess: false }
      }

      return {
        hasAccess: profile?.beta_access || false,
        grantedAt: profile?.beta_access_granted_at,
        email: profile?.email
      }
    } catch (error) {
      console.error('Error in checkBetaAccess:', error)
      return { hasAccess: false }
    }
  }

  // Beta-Zugang gewähren
  static async grantBetaAccess(email: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return false
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          beta_access: true,
          beta_access_granted_at: new Date().toISOString()
        })
        .eq('email', email)

      if (error) {
        console.error('Error granting beta access:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in grantBetaAccess:', error)
      return false
    }
  }

  // Alle Beta-Benutzer abrufen (für Dashboard)
  static async getAllBetaUsers(): Promise<UserProfile[]> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return []
      }

      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('beta_access', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching beta users:', error)
        return []
      }

      return profiles || []
    } catch (error) {
      console.error('Error in getAllBetaUsers:', error)
      return []
    }
  }

  // Benutzerstatistiken abrufen
  static async getUserStats(): Promise<{
    totalUsers: number
    betaUsers: number
    activeUsers: number
    recentUsers: number
  }> {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return { totalUsers: 0, betaUsers: 0, activeUsers: 0, recentUsers: 0 }
      }

      // Gesamte Benutzer
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Beta-Benutzer
      const { count: betaUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('beta_access', true)

      // Aktive Benutzer (letzte 30 Tage)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { count: activeUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', thirtyDaysAgo.toISOString())

      // Neue Benutzer (letzte 7 Tage)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: recentUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      return {
        totalUsers: totalUsers || 0,
        betaUsers: betaUsers || 0,
        activeUsers: activeUsers || 0,
        recentUsers: recentUsers || 0
      }
    } catch (error) {
      console.error('Error in getUserStats:', error)
      return { totalUsers: 0, betaUsers: 0, activeUsers: 0, recentUsers: 0 }
    }
  }
}
