
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.32.0'

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get CNPJ from URL search params
    const url = new URL(req.url)
    const cnpj = url.searchParams.get('cnpj')

    if (!cnpj) {
      return new Response(
        JSON.stringify({ error: 'CNPJ parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Clean up CNPJ (remove special characters)
    const cleanCnpj = cnpj.replace(/[^\d]/g, '')

    if (cleanCnpj.length !== 14) {
      return new Response(
        JSON.stringify({ error: 'CNPJ must have 14 digits' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Check if we have this CNPJ in cache
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from('cnpj_cache')
      .select('*')
      .eq('cnpj', cleanCnpj)
      .single()

    if (!cacheError && cachedData) {
      // We have cached data
      const cacheAge = (Date.now() - new Date(cachedData.created_at).getTime()) / 1000
      
      if (cacheAge < CACHE_DURATION) {
        // Cache is valid, return it
        console.log(`Returning cached data for CNPJ ${cleanCnpj}`)
        return new Response(
          JSON.stringify(cachedData.data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      // Cache is expired, will fetch new data
    }

    // Fetch data from CNPJ API
    console.log(`Fetching data from API for CNPJ ${cleanCnpj}`)
    const apiUrl = `https://receitaws.com.br/v1/cnpj/${cleanCnpj}`
    
    const apiResponse = await fetch(apiUrl)
    
    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch CNPJ data: ${apiResponse.statusText}`)
    }
    
    const data = await apiResponse.json()

    // Store in cache
    if (data.status !== 'ERROR') {
      await supabaseClient
        .from('cnpj_cache')
        .upsert(
          { 
            cnpj: cleanCnpj, 
            data 
          },
          { onConflict: 'cnpj' }
        )
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
