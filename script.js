const supabaseUrl =
  "https://cccwlfkhvkjupbztklvx.supabase.co";

const supabaseKey =
  "sb_publishable_XQh_yAiZ6mesJKhjNSVqqQ_zUdegZTw";

const client = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

console.log("script loaded");

async function unlockInvite() {

  console.log("button clicked");

  const code =
    document.getElementById("code")
    .value
    .trim();

  const { data, error } =
    await client
      .from("hostia")
      .select("*")
      .eq("invite_code", code)
      .single();

  console.log(data);
  console.log(error);

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

  await client
    .from("hostia")
    .update({
      opened: true,
      opened_at: new Date()
    })
    .eq("id", data.id);
}