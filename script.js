const supabaseUrl =
  "https://cccwlfkhvkjupbztklvx.supabase.co";

const supabaseKey =
  "sb_publishable_XQh_yAiZ6mesJKhjNSVqqQ_zUdegZTw";

const client = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

console.log("script loaded");
let currentGuestId = null;

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

  let chatkaCiApt = "";
  if (data.apartm_num > 9) {chatkaCiApt = "Chatka"; }
  else {chatkaCiApt = "Apartmán"; }

  let ubytovanieType = "";
  switch (true) {
    case data.apartm_num < 5:
      ubytovanieType = "apartman";
      break;
    case data.apartm_num < 10:
      ubytovanieType = "bezbarierove-ubytovani";
      break;
    default:
      ubytovanieType = "chatky";
  }

  let masCiMate = [];
  if (data.seats === 1) {masCiMate[0] = "Máš"; masCiMate[1] = "Teba"; masCiMate[2] = "si"; masCiMate[3] = "neváhaj"; masCiMate[4] = "vyplň"; masCiMate[5] = "máš"; }
  else {masCiMate[0] = "Máte"; masCiMate[1] = "Vás"; masCiMate[2] = "ste"; masCiMate[3] = "neváhejte"; masCiMate[4] = "vyplňte"; masCiMate[5] = "máte"; }

  if (data.apartm_num != null) {
    document.getElementById("ubytko").style.display = "block";
    document.getElementById("MaUbytovanie").innerHTML =
    `🐎 <strong>
      ${masCiMate[0]} nachystané ubytovanie v Ranči Telč
    </strong>
    <br><br>
    🏡 ${chatkaCiApt} číslo:
    <strong>
      ${data.apartm_num}
    </strong>
    <br><br>
    👥 ${chatkaCiApt} ubytováva:
    <strong>
      ${mena.join(", ")}
    </strong>
    <br><br>
    Snažili sme sa vybrať ubytovanie pre ${masCiMate[1]} čo najpohodlnejšie, ale ak by boli nejaké otázky, ${masCiMate[3]} sa na nás obrátiť!`;
    document.getElementById("raňajkyInfo").innerHTML = `pokiaľ ${masCiMate[5]} záujem, ${masCiMate[4]} políčka nižšie najneskôr do <strong>30. 7. 2026</strong>! A klik na <strong>ULOŽ</strong>`;
    document.getElementById("VzhladUbytovania").innerHTML = `Ubytovanie je zaplatené a dá sa pozrieť tu: <a href="https://www.ranctelc.cz/${ubytovanieType}/" target="_blank">ranctelc</a>`;
  }

  await client
    .from("hostia")
    .update({
      opened: true,
      opened_at: new Date()
    })
    .eq("id", data.id);
    currentGuestId = data.id;
}

async function saveBreakfast() {
  const satCount =parseInt(document.getElementById("satCount").value);
  const sunCount = parseInt(document.getElementById("sunCount").value);
  
  const { error } =
    await client
      .from("hostia")
      .update({breakfast_sat_count: satCount, breakfast_sun_count: sunCount})
      .eq("id",currentGuestId);

  if (!error) {
    alert("🥐 Raňajky uložené");
  }
}