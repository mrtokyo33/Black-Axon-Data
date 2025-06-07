import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // First, get all users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      throw new Error('Failed to fetch users')
    }

    // Delete all user profiles first
    const { error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .neq('user_id', '') // Delete all profiles

    if (profilesError) {
      throw new Error('Failed to delete user profiles')
    }

    // Delete each user
    const deletionPromises = users.users.map(user => 
      supabaseAdmin.auth.admin.deleteUser(user.id)
    )

    await Promise.all(deletionPromises)

    return new Response(
      JSON.stringify({ 
        message: `Successfully deleted ${users.users.length} users and their profiles` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to delete users' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})