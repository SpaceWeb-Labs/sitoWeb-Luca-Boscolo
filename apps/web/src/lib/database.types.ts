// ⚠️  QUESTO FILE È AUTO-GENERATO — non modificare manualmente
// Per aggiornarlo: pnpm db:types
//
// Dopo aver avviato Supabase locale (pnpm dev),
// esegui: pnpm db:types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          slug: string
          locale: string
          title: string
          excerpt: string | null
          body: string
          cover_url: string | null
          published: boolean
          published_at: string | null
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          locale?: string
          title: string
          excerpt?: string | null
          body?: string
          cover_url?: string | null
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          locale?: string
          title?: string
          excerpt?: string | null
          body?: string
          cover_url?: string | null
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          read: boolean
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          read?: boolean
          ip_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          read?: boolean
          ip_hash?: string | null
          created_at?: string
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          id: string
          session_id: string
          necessary: boolean
          analytics: boolean
          marketing: boolean
          ip_hash: string | null
          user_agent: string | null
          version: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          necessary?: boolean
          analytics?: boolean
          marketing?: boolean
          ip_hash?: string | null
          user_agent?: string | null
          version?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          necessary?: boolean
          analytics?: boolean
          marketing?: boolean
          ip_hash?: string | null
          user_agent?: string | null
          version?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
