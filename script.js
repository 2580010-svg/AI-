let currentSearchType = '病院';
let selectedDept = '病院';

function hideAllScreens() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.add('hidden');
  document.getElementById('search-modal-screen').classList.add('hidden');
  document.getElementById('first-aid-screen').classList.add('hidden');
  document.getElementById('consult-screen').classList.add('hidden');
  document.getElementById('service-screen').classList.add('hidden');
  document.getElementById('about-screen').classList.add('hidden');
  document.getElementById('dept-screen').classList.add('hidden');
  document.getElementById('reserve-screen').classList.add('hidden');
}

function goToHome() {
  hideAllScreens();
  document.getElementById('home-screen').classList.remove('hidden');
}

function goToAbout() {
  hideAllScreens();
  document.getElementById('about-screen').classList.remove('hidden');
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

// 診療科選択画面へ
function openDeptSelection(type) {
  currentSearchType = type;
  hideAllScreens();
  document.getElementById('dept-screen').classList.remove('hidden');
}

// 特定の科を選んで検索画面へ
function selectDepartment(dept) {
  selectedDept = dept;
  openSearchModal(dept);
}

// 予約画面を開く
function openReserveModal(dept) {
  selectedDept = dept;
  hideAllScreens();
  document.getElementById('reserve-title').textContent = `${dept} の診療予約`;
  document.getElementById('reserve-result').classList.add('hidden');
  document.getElementById('reserve-screen').classList.remove('hidden');
}

// 予約確定
function submitReservation() {
  const name = document.getElementById('res-name').value;
  const date = document.getElementById('res-date').value;
  const resultBox = document.getElementById('reserve-result');

  if (!name || !date) {
    alert('お名前と希望日時を入力してください。');
    return;
  }

  resultBox.innerHTML = `<strong>【仮予約が完了しました】</strong><br>
    診療科：${selectedDept}<br>
    お名前：${name} 様<br>
    日時：${date.replace('T', ' ')}<br><br>
    ※ クリニックからの確定連絡をお待ちください。`;
  
  resultBox.classList.remove('hidden');
}

// 言語切替機能
function changeLanguage() {
  const select = document.getElementById('language-select');
  const selectedLang = select.options[select.selectedIndex].text;
  document.getElementById('lang-msg').textContent = `表示言語を「${selectedLang}」に変更しました。`;
}

// -------------------------------------------------------------
// リアル検索機能（GPS＆エリア指定）
// -------------------------------------------------------------
function openSearchModal(type) {
  currentSearchType = type;
  hideAllScreens();

  const iconEl = document.getElementById('search-icon');
  const titleEl = document.getElementById('search-title');

  iconEl.textContent = '🏥';
  titleEl.textContent = `近くの${type}を探す`;

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
// 対処ガイド（多様な病気・応急処置）
// -------------------------------------------------------------
function showAidDetail(type) {
  const resultBox = document.getElementById('aid-result');
  let content = '';

  if (type === 'かぜ・熱') {
    content = '<strong>【発熱・かぜ症状の対応】</strong><br>1. 水分補給をこまめに行い、身体を暖かくして静養してください。<br>2. 高熱（38.5℃以上）や息苦しさがある場合は内科を受診してください。';
  } else if (type === '腹痛・吐き気') {
    content = '<strong>【お腹の痛み・吐き気の対応】</strong><br>1. 横になって膝を軽く曲げ、楽な姿勢でお腹を温めて休んでください。<br>2. 激しい痛みが続く場合や脱水症状がある場合は、早めに消化器内科を受診しましょう。';
  } else if (type === '頭痛・めまい') {
    content = '<strong>【頭痛・めまいの対応】</strong><br>1. 静かで暗い部屋で横になり、頭を休めてください。<br>2. 激しい痛みが突然起きた場合や、手足のしびれを伴う場合はすぐに救急外来を受診してください。';
  } else if (type === '熱中症') {
    content = '<strong>【熱中症の応急処置】</strong><br>1. 涼しい場所へ移動し、服を緩めて太い血管（首・脇の下・足の付け根）を冷やします。<br>2. 水分・塩分を補給してください。自力で飲めない場合は救急車を呼びましょう。';
  } else if (type === '眼・耳の異常') {
    content = '<strong>【目・耳・鼻の症状対応】</strong><br>1. 目のかゆみや痛みは擦らず綺麗な水で洗い流します。<br>2. 耳の痛みや詰まり、強い鼻水が続く場合は耳鼻咽喉科・眼科を受診しましょう。';
  } else if (type === '打撲・出血') {
    content = '<strong>【切り傷・出血・打撲の処置】</strong><br>1. 出血は清潔なガーゼで圧迫して止めます。<br>2. 打撲やねんざは氷で冷やし、患部を動かさないように固定します。';
  } else if (type === 'やけど') {
    content = '<strong>【やけどの処置】</strong><br>1. すぐに綺麗な流水で15分〜20分以上冷やします。<br>2. 水ぶくれは破らず、皮膚科・形成外科を受診してください。';
  }

  resultBox.innerHTML = content;
  resultBox.classList.remove('hidden');
}

// -------------------------------------------------------------
// AI症状相談（動的AI応答）
// -------------------------------------------------------------
function analyzeSymptom() {
  const input = document.getElementById('symptom-input').value.trim();
  const resultBox = document.getElementById('consult-result');

  if (!input) {
    alert('症状を入力してください');
    return;
  }

  let possibility = '';
  let advice = '';

  if (input.includes('やけど') || input.includes('火傷') || input.includes('熱湯')) {
    possibility = '熱傷（やけど）の可能性があります。';
    advice = '<strong>皮膚科</strong>または<strong>形成外科・外科</strong>を受診してください。<br>【処置】流水で15分以上冷やしてください。';
  } else if (input.includes('鼻水') || input.includes('鼻') || input.includes('くしゃみ')) {
    possibility = 'アレルギー性鼻炎、花粉症、または風邪の可能性があります。';
    advice = '<strong>耳鼻咽喉科</strong>または<strong>内科</strong>への受診をおすすめします。';
  } else if (input.includes('熱') || input.includes('のど') || input.includes('咳') || input.includes('風邪')) {
    possibility = '風邪症候群、インフルエンザなどの可能性があります。';
    advice = '<strong>内科</strong>（お子様は小児科）を受診し、暖かくして静養してください。';
  } else if (input.includes('頭痛') || input.includes('頭が痛')) {
    possibility = '偏頭痛、緊張型頭痛などの可能性があります。';
    advice = '<strong>内科</strong>または<strong>脳神経外科・頭痛外来</strong>へご相談ください。';
  } else if (input.includes('腹') || input.includes('お腹') || input.includes('吐') || input.includes('下痢')) {
    possibility = '急性胃腸炎や消化不良の可能性があります。';
    advice = '<strong>消化器内科</strong>を受診し、水分補給を行ってください。';
  } else if (input.includes('足') || input.includes('手') || input.includes('腫れ') || input.includes('骨折') || input.includes('痛')) {
    possibility = '捻挫、打撲、または骨折の可能性があります。';
    advice = '<strong>整形外科</strong>を受診し、患部を冷やして安静にしてください。';
  } else {
    possibility = '体調不良または局所的な炎症の可能性があります。';
    advice = 'まずは<strong>総合内科</strong>などの受診をご検討ください。';
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