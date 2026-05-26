const supabaseUrl =
  "https://cccwlfkhvkjupbztklvx.supabase.co";

const supabaseKey =
  "sb_publishable_XQh_yAiZ6mesJKhjNSVqqQ_zUdegZTw";

const supabase =
  window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

async function unlockInvite() {

  const code =
    document.getElementById("code").value.trim();

  const { data, error } =
    await supabase
      .from("Hostia")
      .select("*")
      .eq("invite_code", code)
      .single();

  if (error || !data) {

    document.getElementById("error")
      .innerText =
      "Nesprávny kód";

    return;
  }

  document.getElementById("welcome")
    .innerText =
    `Vitaj ${data.guest_name} ❤️`;

  document.getElementById(
    "wedding-content"
  ).style.display = "block";

  await supabase
    .from("Hostia")
    .update({
      opened: true,
      opened_at: new Date()
    })
    .eq("id", data.id);
}