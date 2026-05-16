#property strict

input string SupabaseUrl = "https://YOUR_SUPABASE_PROJECT.supabase.co";
input string SupabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

void OnTick()
{
  // This Expert Advisor stub can read a remote command file or connect to a local bridge.
  // For a production system, use a secure Python adapter or HTTP webhook instead of raw HTTP.
}

string BuildCommandJson(string command, double risk, int slPadding, int tpTarget)
{
  return StringFormat(
    "{\"command\":\"%s\",\"risk_percent\":%.2f,\"sl_padding\":%d,\"tp_target\":%d}",
    command, risk, slPadding, tpTarget);
}
