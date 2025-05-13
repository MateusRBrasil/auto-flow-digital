
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = "https://slozxjwnrmiyqiqugcjp.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cnpj } = await req.json();
    
    if (!cnpj) {
      return new Response(
        JSON.stringify({ error: "CNPJ é obrigatório" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const formattedCnpj = cnpj.replace(/[^0-9]/g, '');
    
    if (formattedCnpj.length !== 14) {
      return new Response(
        JSON.stringify({ error: "CNPJ deve conter 14 dígitos" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Criar cliente Supabase para verificar se já temos o CNPJ em cache
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verificar no cache
    const { data: cachedData } = await supabase
      .from('cnpj_cache')
      .select('data')
      .eq('cnpj', formattedCnpj)
      .single();

    if (cachedData) {
      console.log("CNPJ encontrado no cache", formattedCnpj);
      return new Response(
        JSON.stringify({ ...cachedData.data, from_cache: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Se não estiver em cache, consultar a API ReceitaWS
    console.log("Consultando CNPJ na API ReceitaWS:", formattedCnpj);
    const apiUrl = `https://www.receitaws.com.br/v1/cnpj/${formattedCnpj}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Erro ao consultar CNPJ: ${response.statusText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const cnpjData = await response.json();
    
    // Verificar se o resultado é válido
    if (cnpjData.status === "ERROR") {
      return new Response(
        JSON.stringify({ error: cnpjData.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Salvar no cache
    await supabase.from('cnpj_cache').insert({
      cnpj: formattedCnpj,
      data: cnpjData
    });

    return new Response(
      JSON.stringify(cnpjData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro na função consulta-cnpj:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
