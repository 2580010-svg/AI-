let currentSearchType = '病院';

function hideAllScreens() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.add('hidden');
  document.getElementById('search-modal-screen').classList.add('hidden');
  document.getElementById('first-aid-screen').classList.add('hidden');
  document.getElementById('consult-screen').classList.add('hidden');
  document.getElementById('service-screen').classList.add('hidden');
}

function goToHome() {
  hideAllScreens();
  document.getElementById('home-screen').classList.remove('hidden');
}

function goToService() {
  hideAllScreens();
  document.getElementById('service-screen').classList.remove('hidden');
}

function goToChat() {
  hideAllScreens();
  document.getElementById('chat-screen').classList.remove('hidden');
}

function goToFirstAid() {
  hideAllScreens();
  document.getElementById('aid-result').classList.add('hidden');
  document.getElementById('first-aid-screen').classList.remove('hidden');
}

function goToConsult() {
  hideAllScreens();
  document.getElementById('consult-result').classList.add('hidden');
  document.getElementById('consult-screen').classList.remove('hidden');
}

// 言語切替機能
function changeLanguage() {
  const select = document.getElementById('language-select');
  const selectedLang = select.options[select.selectedIndex].text;
  const msgEl = document.getElementById('lang-msg');
  
  msgEl.textContent = `表示言語を「${selectedLang}」に変更しました。`;
}

// -------------------------------------------------------------
// リアル検索機能（GPS＆エリア指定）
// -------------------------------------------------------------
function openSearchModal(type) {
  currentSearchType = type;
  hideAllScreens();

  const iconEl = document.getElementById('search-icon');
  const titleEl = document.getElementById('search-title');

  if (type === '病院') {
    iconEl.textContent = '🏥';
    titleEl.textContent = '近くの病院を探す';
  } else {
    iconEl.textContent = '💊';
    titleEl.textContent = '近くの薬局を探す';
  }

  document.getElementById('search-modal-screen').classList.remove('hidden');
}

function searchByCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = `https://www.google.com/maps/search/近くの${currentSearchType}/@${lat},${lng},15z`;
        window.open(url, '_blank');
      },
      () => {
        const url = `https://www.google.com/maps/search/?api=1&query=近くの${currentSearchType}`;
        window.open(url, '_blank');
      }
    );
  } else {
    const url = `https://www.google.com/maps/search/?api=1&query=近くの${currentSearchType}`;
    window.open(url, '_blank');
  }
}

function searchByArea(areaName) {
  const keyword = encodeURIComponent(`${areaName} ${currentSearchType}`);
  const url = `https://www.google.com/maps/search/?api=1&query=${keyword}`;
  window.open(url, '_blank');
}

function searchByCustomInput() {
  const inputVal = document.getElementById('area-input').value.trim();
  if (!inputVal) {
    alert('地域名を入力してください（例：生野区）');
    return;
  }
  searchByArea(inputVal);
}

// -------------------------------------------------------------
// 対処ガイド（かぜ・病気・けが）
// -------------------------------------------------------------
function showAidDetail(type) {
  const resultBox = document.getElementById('aid-result');
  let content = '';

  if (type === 'かぜ・熱') {
    content = '<strong>【発熱・かぜ症状の初期対応】</strong><br>1. しっかり水分補給をして体を暖かくし、静養してください。<br>2. 高熱（38.5℃以上）や息苦しさ、強い倦怠感がある場合は内科を受診しましょう。';
  } else if (type === '腹痛・吐き気') {
    content = '<strong>【お腹の痛み・吐き気の対応】</strong><br>1. 楽な姿勢（横になって膝を軽く曲げる）になり、お腹を温めて休んでください。<br>2. 激痛が続く場合や何度も吐いて水も飲めない場合は、早めに医療機関を受診してください。';
  } else if (type === '打撲・出血') {
    content = '<strong>【切り傷・出血・打撲の応急処置】</strong><br>1. 出血している場合は清潔なガーゼで強く圧迫して止血します。<br>2. 打撲や捻挫は氷で冷やし、動かさないように固定します。';
  } else if (type === 'やけど') {
    content = '<strong>【やけどの応急処置】</strong><br>1. すぐに綺麗な流水で15分〜20分冷やします。<br>2. 水ぶくれは破らず、清潔なラップなどで保護して皮膚科・外科を受診しましょう。';
  }

  resultBox.innerHTML = content;
  resultBox.classList.remove('hidden');
}

// -------------------------------------------------------------
// AI症状相談（症状キーワードに応じて答え・診療科・アドバイスが切り替わる）
// -------------------------------------------------------------
function analyzeSymptom() {
  const input = document.getElementById('symptom-input').value.trim();
  const resultBox = document.getElementById('consult-result');

  if (!input) {
    alert('症状を入力してください');
    return;
  }

  let possibility = ''; // 考えられる可能性
  let advice = '';      // アドバイス・推奨する診療科

  // 1. やけど
  if (input.includes('やけど') || input.includes('火傷') || input.includes('熱湯') || input.includes('火')) {
    possibility = '熱傷（やけど）の可能性があります。';
    advice = '<strong>皮膚科</strong>または<strong>形成外科・外科</strong>を受診してください。<br>【応急処置】すぐに綺麗な流水で15〜20分以上冷やし、水ぶくれは破らないようにしましょう。';
  }
  // 2. 鼻水・鼻づまり
  else if (input.includes('鼻水') || input.includes('鼻づまり') || input.includes('くしゃみ') || input.includes('鼻')) {
    possibility = 'アレルギー性鼻炎、花粉症、または風邪（急性鼻炎）の可能性があります。';
    advice = '<strong>耳鼻咽喉科</strong>または<strong>内科</strong>の受診をおすすめします。市販のアレルギー薬や点鼻薬も効果的です。';
  }
  // 3. 発熱・風邪
  else if (input.includes('熱') || input.includes('発熱') || input.includes('のど') || input.includes('喉') || input.includes('咳') || input.includes('風邪') || input.includes('かぜ')) {
    possibility = '風邪症候群、インフルエンザ、または感染症の可能性があります。';
    advice = '<strong>内科</strong>（お子様の場合は小児科）を受診してください。<br>【対応】水分をこまめに補給し、暖かくして静養しましょう。';
  }
  // 4. 頭痛
  else if (input.includes('頭痛') || input.includes('頭が痛')) {
    possibility = '緊張型頭痛、偏頭痛、または風邪に伴う頭痛の可能性があります。';
    advice = '<strong>内科</strong>または<strong>脳神経外科・頭痛外来</strong>へのご相談をおすすめします。静かな部屋で休んでください。';
  }
  // 5. お腹の痛み・吐き気
  else if (input.includes('腹') || input.includes('お腹') || input.includes('胃') || input.includes('吐') || input.includes('下痢') || input.includes('気持ち悪い')) {
    possibility = '急性胃腸炎、食中毒、または消化不良の可能性があります。';
    advice = '<strong>消化器内科</strong>または<strong>内科</strong>を受診してください。<br>【対応】脱水予防のため、スポーツドリンクや経口補水液を少しずつ摂取してください。';
  }
  // 6. ケガ・捻挫・骨折
  else if (input.includes('足') || input.includes('手') || input.includes('ひねっ') || input.includes('腫れ') || input.includes('打撲') || input.includes('骨折') || input.includes('怪我') || input.includes('けが') || input.includes('痛')) {
    possibility = '捻挫（ねんざ）、打撲、または骨折・靭帯損傷の可能性があります。';
    advice = '<strong>整形外科</strong>の受診をおすすめします。<br>【対応】患部を冷やし、無理に動かさず安静に保ってください。';
  }
  // 7. その他
  else {
    possibility = '体調不良または局所的な症状の可能性があります。';
    advice = 'まずは<strong>総合内科</strong>などの医療機関へのご相談をご検討ください。症状が続く場合は医師にお話しください。';
  }

  resultBox.innerHTML = `
    <strong>【AIの分析結果】</strong><br>
    ご相談内容：「${input}」<br><br>
    💡 <strong>考えられる可能性：</strong> ${possibility}<br>
    🏥 <strong>アドバイス：</strong> ${advice}<br><br>
    <span style="font-size:0.85rem; color:#666;">※ 意識が薄い・息苦しい・激しい痛みの場合は、すぐに救急外来を受診するか119番をおかけください。</span>
  `;
  
  resultBox.classList.remove('hidden');
}