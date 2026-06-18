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
let masCiMate = [];

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

  
  if (data.seats === 1) {masCiMate[0] = "Máš"; masCiMate[1] = "Teba"; masCiMate[2] = "si"; masCiMate[3] = "neváhaj"; masCiMate[4] = "vyplň"; masCiMate[5] = "máš"; masCiMate[6] = "chceš"; masCiMate[7] = "napíš"; masCiMate[8] = "zaplať"; masCiMate[9] = "prines"; masCiMate[10] = "daj"; }
  else {masCiMate[0] = "Máte"; masCiMate[1] = "Vás"; masCiMate[2] = "ste"; masCiMate[3] = "neváhejte"; masCiMate[4] = "vyplňte"; masCiMate[5] = "máte"; masCiMate[6] = "chcete"; masCiMate[7] = "napíšte"; masCiMate[8] = "zaplaťte"; masCiMate[9] = "prineste"; masCiMate[10] = "dajte"; }

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
    Snažili sme sa vybrať ubytovanie pre ${masCiMate[1]} čo najpohodlnejšie podľa dostupnej kapacity Ranča, ale ak by boli nejaké otázky, ${masCiMate[3]} sa na nás obrátiť!`;
    document.getElementById("raňajkyInfo").innerHTML = `pokiaľ ${masCiMate[5]} záujem, ${masCiMate[4]} políčka nižšie najneskôr do <strong>31. 7. 2026</strong>! A klik na <strong>ULOŽ</strong>. Po tomto termíne sa už nebude ukladať objednávka.`;
    document.getElementById("VzhladUbytovania").innerHTML = `Ubytovanie je zaplatené a dá sa pozrieť tu: <a href="https://www.ranctelc.cz/${ubytovanieType}/" target="_blank">ranctelc</a>`;
    document.getElementById("OcekavanyPrichod").innerHTML = `Prosím ${masCiMate[4]} očakávaný deň príchodu. Pre hladký check-in ${masCiMate[7]} približný <strong>čas</strong> príchodu Saške (+421 902 539 905) alebo Ondrovi (+420 606 355 038) do správy v deň príchodu.`;
    document.getElementById("zaplatenieRanajok").innerHTML = `Ak ${masCiMate[5]} objednané raňajky, ${masCiMate[8]} prosím pomocou QR alebo odkazu nižšie a ${masCiMate[10]} do poznámky <strong>svoje meno</strong>. Ak sa nedá využiť tento spôsob platby, prosím ${masCiMate[9]} peniaze v deň príchodu.<br><br>Pre automatické vypočítanie celkovej sumy nezabudni ULOŽIŤ objednávku. Suma za raňajky by mala byť <strong> ${data.breakfast_sat_count * 6.2 + data.breakfast_sun_count * 6.2} € </strong> (6.2€ za každý kus) respektíve <strong> ${data.breakfast_sat_count * 150 + data.breakfast_sun_count * 150} Kč </strong>.`;

    if (data.arrival_day) {
      document.getElementById("maPrichod").style.display = "block";
      document.getElementById("ZaznamenanyPrichod").innerHTML = `Zaznamenaný deň príchodu 🚗: <strong>${data.arrival_day}</strong> <br> Pre hladký check-in ${masCiMate[7]} približný <strong>čas</strong> príchodu Saške (+421 902 539 905) alebo Ondrovi (+420 606 355 038) do správy v deň príchodu. <br><br> Ak ${masCiMate[6]} zmeniť deň príchodu, klik na tlačítko nižšie.`;
      document.getElementById("arrivalDayForm").style.display = "none";
      document.getElementById("OcekavanyPrichod").style.display = "none";
    }
  }


  await client
    .from("hostia")
    .update({
      opened: true,
      opened_at: new Date()
    })
    .eq("id", data.id);
    currentGuestId = data.id;

    if ((data.breakfast_sat_count + data.breakfast_sun_count) > 0) {
      document.getElementById("maRanajky").style.display = "block";
      document.getElementById("objednaneRanajky").innerHTML = `Raňajky sú objednané: ${data.breakfast_sat_count} ks sobota a ${data.breakfast_sun_count} ks nedeľa. Ak ${masCiMate[6]} zmeniť voľbu, klik na tlačítko nižšie. Zmeniť sa dá do <strong>31. 7. 2026</strong>. Po tomto termíne sa už zmena neuloží.`;
      document.getElementById("ranajkyForm").style.display = "none";
    }
}

function updateBreakfast() {
  if (new Date() > new Date("2026-07-31")) {
    alert("Už není možné meniť objednávku raňajok.");
  }
  else {
    document.getElementById("ranajkyForm").style.display = "block";
  }
}

function updateArrivalDay() {
    document.getElementById("arrivalDayForm").style.display = "block";
    document.getElementById("maPrichod").style.display = "none";
}


async function saveBreakfast() {
  if (new Date() > new Date("2026-07-31")) {
    alert("Už není možné objednať raňajky.");
    return;
  }
  const satCount = parseInt(document.getElementById("satCount").value);
  const sunCount = parseInt(document.getElementById("sunCount").value);
  
  const { error } =
    await client
      .from("hostia")
      .update({breakfast_sat_count: satCount, breakfast_sun_count: sunCount})
      .eq("id",currentGuestId);

  if (!error) {
    alert("🥐 Raňajky uložené");
    document.getElementById("zaplatenieRanajok").innerHTML = `Ak ${masCiMate[5]} objednané raňajky, ${masCiMate[8]} prosím pomocou QR alebo odkazu nižšie a ${masCiMate[10]} do poznámky <strong>svoje meno</strong>. Ak sa nedá využiť tento spôsob platby, prosím ${masCiMate[9]} peniaze v deň príchodu.<br><br> Pre automatické vypočítanie celkovej sumy <strong> nezabudni ULOŽIŤ objednávku</strong>. Suma za raňajky by mala byť ${satCount * 6.2 + sunCount * 6.2} € (6.2€ za každý kus) respektíve ${satCount * 150 + sunCount * 150} Kč.`;
  }

}

async function saveArrivalDay() {
  const arrivalDay = document.getElementById("arrivalDay").value;
  if (!arrivalDay) {
    alert("Prosím vyber deň príchodu.");
    return;
  }

  const {error} =
    await client
      .from("hostia")
      .update({arrival_day:arrivalDay})
      .eq("id",currentGuestId);
  if (!error) {
    alert("🚗 Deň príchodu uložený");
  }
}

async function saveSong() {

  const song = document.getElementById("pesnickaNaPrianie").value.trim();
  if (!song) {
    alert("Názov pesničky?? 🙂");
    return;
  }

  const { error } =
    await client
      .from("hostia")
      .update({song_request:song })
      .eq(
        "id",
        currentGuestId
      );

  if (!error) {
    alert(
      "🎶 Pesnička uložená!"
    );
  }
}