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

  let mena = [];
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
  
  if (data && data.apartm_num != null) {
    const person = data;

    const apartmNum =
      person.apartm_num;

    const {data: roommates} =
     await client
      .from("hostia")
      .select("guest_name")
      .eq(
        "apartm_num",
        apartmNum
      );

    mena = roommates.map(
        person =>
        person.guest_name
    );
  }

  console.log(data);
  console.log(error);

  if (error || !data) {
    document.getElementById("error")
      .innerText =
      "Nesprávny kód";
    return;
  }
  else {
    document.getElementById("error").style.display = "none";
    document.getElementById("invite-form").style.display = "none";
  }

  const meno = data.guest_name;

  if (meno.includes(" ")) {
    document.getElementById("welcome").innerText = `✨ Vitajte ${data.guest_name} ✨`;
    document.getElementById("privitanie").innerText = `Tešíme sa na vás ❤️ Hlavne doneste dobrú náladu a roztočíme to!`;
  } else {
    document.getElementById("welcome").innerText = `✨ Vitaj ${data.guest_name} ✨`;
    document.getElementById("privitanie").innerText = `Tešíme sa na teba ❤️ Hlavne dones dobrú náladu a roztočíme to!`;
  }

  document.getElementById("wedding-content").style.display = "block";

  document.getElementById("dateOfWedding").innerText = `Dátum: 29. august 2026`;

  if (data.apartm_num != null) {
    document.getElementById("ubytko").style.display = "block";
    if (data.seats === 1) {
      document.getElementById("MaUbytovanie").innerText = `Maš nachystané ubytovanie v Ranči Telč, apartmán číslo ${data.apartm_num}. Toto ubytovanie ubytováva: ${mena.join(", ")}`;
    }
  }

  await client
    .from("hostia")
    .update({
      opened: true,
      opened_at: new Date()
    })
    .eq("id", data.id);
}