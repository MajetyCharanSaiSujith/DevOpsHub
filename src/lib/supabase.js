// Supabase Client & Cloud Auth / Database Layer

const SUPABASE_URL_DEFAULT = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY_DEFAULT = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const AUTH_STORAGE_KEY = 'devopshub_supabase_auth_session';

export function getSupabaseConfig() {
  if (typeof window !== 'undefined') {
    try {
      const storedUrl = window.localStorage.getItem('devopshub_custom_supabase_url');
      const storedKey = window.localStorage.getItem('devopshub_custom_supabase_key');
      if (storedUrl && storedKey) {
        return { url: storedUrl.trim().replace(/\/$/, ''), key: storedKey.trim(), isConfigured: true };
      }
    } catch {
      // ignore
    }
  }

  if (SUPABASE_URL_DEFAULT && SUPABASE_KEY_DEFAULT) {
    return {
      url: SUPABASE_URL_DEFAULT.trim().replace(/\/$/, ''),
      key: SUPABASE_KEY_DEFAULT.trim(),
      isConfigured: true,
    };
  }

  return { url: '', key: '', isConfigured: false };
}

export function saveCustomSupabaseConfig(url, key) {
  if (typeof window === 'undefined') return;
  if (!url || !key) {
    window.localStorage.removeItem('devopshub_custom_supabase_url');
    window.localStorage.removeItem('devopshub_custom_supabase_key');
  } else {
    window.localStorage.setItem('devopshub_custom_supabase_url', url.trim());
    window.localStorage.setItem('devopshub_custom_supabase_key', key.trim());
  }
}

// Low-level HTTP helper for Supabase REST endpoints
async function supabaseRequest(endpoint, options = {}) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    throw new Error('Supabase is not configured. Please supply your Supabase Project URL and Anon Key.');
  }

  let sessionToken = key;
  if (typeof window !== 'undefined') {
    try {
      const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed?.access_token) {
          sessionToken = parsed.access_token;
        }
      }
    } catch {
      // ignore
    }
  }

  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation',
    ...(options.headers || {}),
  };

  const response = await fetch(`${url}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!response.ok) {
    const errorMsg = json?.msg || json?.message || json?.error_description || response.statusText;
    throw new Error(errorMsg);
  }

  return json;
}

// Supabase client interface
export const supabase = {
  auth: {
    async signUp({ email, password, options = {} }) {
      const config = getSupabaseConfig();
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (!config.isConfigured) {
        // Fallback local authenticated user store
        let localUsers = {};
        if (typeof window !== 'undefined') {
          try {
            const raw = window.localStorage.getItem('devopshub_local_registered_users');
            if (raw) localUsers = JSON.parse(raw);
          } catch {
            localUsers = {};
          }
        }

        if (localUsers[normalizedEmail]) {
          return { data: null, error: new Error('User already exists with this email. Please sign in.') };
        }

        const newUser = {
          id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          email: normalizedEmail,
          password: password, // Stored locally for offline/sandbox auth
          user_metadata: options?.data || { name: normalizedEmail.split('@')[0], role: 'DevOps Engineer' },
          created_at: new Date().toISOString(),
        };

        localUsers[normalizedEmail] = newUser;
        const session = {
          access_token: `mock_jwt_${Date.now()}`,
          user: {
            id: newUser.id,
            email: newUser.email,
            user_metadata: newUser.user_metadata,
            created_at: newUser.created_at,
          },
        };

        if (typeof window !== 'undefined') {
          window.localStorage.setItem('devopshub_local_registered_users', JSON.stringify(localUsers));
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        }

        return { data: { user: session.user, session }, error: null };
      }

      try {
        const payload = {
          email: normalizedEmail,
          password,
          data: options?.data || {},
        };
        const res = await supabaseRequest('/auth/v1/signup', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res?.access_token && typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
        }
        return { data: { user: res.user || res, session: res }, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async signInWithPassword({ email, password }) {
      const config = getSupabaseConfig();
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (!config.isConfigured) {
        let localUsers = {};
        if (typeof window !== 'undefined') {
          try {
            const raw = window.localStorage.getItem('devopshub_local_registered_users');
            if (raw) localUsers = JSON.parse(raw);
          } catch {
            localUsers = {};
          }
        }

        let userRecord = localUsers[normalizedEmail];

        // If user hasn't registered yet in local mode, allow auto-creation if password provided or check password if exists
        if (userRecord) {
          if (userRecord.password && userRecord.password !== password) {
            return { data: null, error: new Error('Invalid password for this account. Please try again.') };
          }
        } else {
          // Create new local account on first sign in
          userRecord = {
            id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
            email: normalizedEmail,
            password: password,
            user_metadata: { name: normalizedEmail.split('@')[0], role: 'DevOps Engineer' },
            created_at: new Date().toISOString(),
          };
          localUsers[normalizedEmail] = userRecord;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('devopshub_local_registered_users', JSON.stringify(localUsers));
          }
        }

        const sessionUser = {
          id: userRecord.id,
          email: userRecord.email,
          user_metadata: userRecord.user_metadata || { name: normalizedEmail.split('@')[0], role: 'DevOps Engineer' },
          created_at: userRecord.created_at,
        };

        const session = { access_token: `mock_jwt_${Date.now()}`, user: sessionUser };
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        }
        return { data: { user: sessionUser, session }, error: null };
      }

      try {
        const payload = { email: normalizedEmail, password };
        const res = await supabaseRequest('/auth/v1/token?grant_type=password', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res?.access_token && typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
        }
        return { data: { user: res.user, session: res }, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async signOut() {
      const config = getSupabaseConfig();
      if (config.isConfigured) {
        try {
          await supabaseRequest('/auth/v1/logout', { method: 'POST' });
        } catch {
          // ignore logout network errors
        }
      }
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      return { error: null };
    },

    async getSession() {
      if (typeof window === 'undefined') return { data: { session: null }, error: null };
      try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return { data: { session: null }, error: null };
        const session = JSON.parse(raw);
        return { data: { session }, error: null };
      } catch (err) {
        return { data: { session: null }, error: err };
      }
    },

    async getUser() {
      const { data } = await this.getSession();
      return { data: { user: data?.session?.user || null }, error: null };
    },
  },

  // PostgREST Database interface
  from(tableName) {
    return {
      async select(columns = '*') {
        try {
          const config = getSupabaseConfig();
          if (!config.isConfigured) return { data: null, error: null };
          const data = await supabaseRequest(`/rest/v1/${tableName}?select=${encodeURIComponent(columns)}`);
          return { data, error: null };
        } catch (err) {
          return { data: null, error: err };
        }
      },

      async insert(rows) {
        try {
          const config = getSupabaseConfig();
          if (!config.isConfigured) return { data: rows, error: null };
          const data = await supabaseRequest(`/rest/v1/${tableName}`, {
            method: 'POST',
            body: JSON.stringify(rows),
          });
          return { data, error: null };
        } catch (err) {
          return { data: null, error: err };
        }
      },

      eq(column, value) {
        return {
          async delete() {
            try {
              const config = getSupabaseConfig();
              if (!config.isConfigured) return { error: null };
              await supabaseRequest(`/rest/v1/${tableName}?${column}=eq.${encodeURIComponent(value)}`, {
                method: 'DELETE',
              });
              return { error: null };
            } catch (err) {
              return { error: err };
            }
          },
          async update(values) {
            try {
              const config = getSupabaseConfig();
              if (!config.isConfigured) return { data: values, error: null };
              const data = await supabaseRequest(`/rest/v1/${tableName}?${column}=eq.${encodeURIComponent(value)}`, {
                method: 'PATCH',
                body: JSON.stringify(values),
              });
              return { data, error: null };
            } catch (err) {
              return { data: null, error: err };
            }
          },
        };
      },
    };
  },
};
