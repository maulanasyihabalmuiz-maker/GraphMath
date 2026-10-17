/* GraphMath Tahap 3 revisi: identitas, informasi akademik, audio, dan tes akhir. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const storage = (() => { try { return window.localStorage; } catch (_) { const mem = new Map(); return {getItem:k => mem.has(k) ? mem.get(k) : null, setItem:(k,v) => mem.set(k,String(v)), removeItem:k => mem.delete(k)}; } })();
  const BGM_KEY = 'graphmath-v6-bgm';
  const VOL_KEY = 'graphmath-v6-bgm-volume';
  const TEST_SCORE_KEY = 'graphmath-v4-test-score';
  const audio = $('gameBgm');
  let bgmEnabled = storage.getItem(BGM_KEY) !== 'false';
  let bgmVolume = Number(storage.getItem(VOL_KEY) ?? '0.15');
  if (!Number.isFinite(bgmVolume)) bgmVolume = 0.15;
  bgmVolume = Math.max(0, Math.min(0.5, bgmVolume));

  const QUESTIONS = [
    {topic:'Koordinat',q:'Titik P berada pada koordinat (−3, 4). Berapa nilai x dan y secara berurutan?',options:['x = 4 dan y = −3','x = −3 dan y = 4','x = 3 dan y = −4','x = −3 dan y = −4'],answer:1,explain:'Pasangan koordinat ditulis (x, y), sehingga x = −3 dan y = 4.'},
    {topic:'Koordinat',q:'Titik manakah yang berada di Kuadran IV?',options:['(−2, 5)','(2, 5)','(−2, −5)','(2, −5)'],answer:3,explain:'Kuadran IV memiliki x positif dan y negatif.'},
    {topic:'Fungsi',q:'Diketahui f(x) = 2x + 1. Nilai f(3) adalah ...',options:['5','6','7','8'],answer:2,explain:'f(3) = 2(3) + 1 = 7.'},
    {topic:'Fungsi',q:'Sebuah aturan disebut fungsi jika ...',options:['Setiap input mempunyai tepat satu output','Satu input harus memiliki dua output','Tidak ada input yang menghasilkan output','Output harus selalu lebih besar dari input'],answer:0,explain:'Syarat fungsi: setiap anggota domain dipasangkan dengan tepat satu nilai output.'},
    {topic:'Gradien',q:'Titik A(2, 3) dan B(6, 11) terletak pada sebuah garis. Gradiennya adalah ...',options:['−2','1/2','2','4'],answer:2,explain:'m = (11 − 3) / (6 − 2) = 8 / 4 = 2.'},
    {topic:'Gradien',q:'Rumus gradien dari dua titik A(x₁, y₁) dan B(x₂, y₂) adalah ...',options:['m = (x₂ − x₁) / (y₂ − y₁)','m = (y₂ − y₁) / (x₂ − x₁)','m = y₂ − x₂','m = x₁ + x₂'],answer:1,explain:'Gradien adalah perubahan nilai y dibagi perubahan nilai x, dengan x₂ ≠ x₁.'},
    {topic:'Persamaan garis',q:'Persamaan garis melalui A(2, 3) dan B(6, 11) adalah ...',options:['y = x + 1','y = 2x − 1','y = 2x + 1','y = −2x + 7'],answer:1,explain:'Gradiennya 2. Dengan titik (2,3): 3 = 2(2) + b sehingga b = −1.'},
    {topic:'Nilai fungsi',q:'Jika y = −x + 5 dan x = 2, nilai y adalah ...',options:['−3','2','3','7'],answer:2,explain:'y = −2 + 5 = 3.'},
    {topic:'Grafik',q:'Apa arti gradien negatif pada sebuah garis lurus?',options:['Garis naik dari kiri ke kanan','Garis turun dari kiri ke kanan','Garis selalu mendatar','Garis selalu tegak'],answer:1,explain:'Gradien negatif berarti garis menurun ketika dibaca dari kiri ke kanan.'},
    {topic:'Kontekstual',q:'Sebuah jalur landai pada peta melewati A(0, 5) dan B(5, 0). Persamaan garis yang sesuai adalah ...',options:['y = x + 5','y = −x + 5','y = 5x','y = −5x − 1'],answer:1,explain:'m = (0 − 5)/(5 − 0) = −1. Titik A(0,5) menunjukkan b = 5, sehingga y = −x + 5.'}
  ];

  function syncBgm(pageId) {
    audio.volume = bgmVolume;
    if (!bgmEnabled || bgmVolume === 0 || ['introPage','materialPage','tutorialPage','testPage'].includes(pageId)) {
      audio.pause();
      return;
    }
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }
  window.GraphMathAudioSync = syncBgm;
  function saveAudioSettings() {
    storage.setItem(BGM_KEY, String(bgmEnabled));
    storage.setItem(VOL_KEY, String(bgmVolume));
    audio.volume = bgmVolume;
    if (bgmEnabled && bgmVolume > 0) syncBgm(document.querySelector('.page.active')?.id || 'homePage');
    else audio.pause();
  }

  $('enterGame').addEventListener('click', () => {
    window.GraphMathGo('homePage');
    syncBgm('homePage');
  });
  $('homeAbout').addEventListener('click', () => window.GraphMathGo('infoPage'));
  $('infoStart').addEventListener('click', () => $('homeStart').click());
  $('homeTest').addEventListener('click', () => window.GraphMathGo('testPage'));

  // Settings controls are opt-in controls: the music starts only after a user action.
  const bgmToggle = $('bgmToggle');
  const bgmVolumeControl = $('bgmVolume');
  bgmToggle.checked = bgmEnabled;
  bgmVolumeControl.value = String(bgmVolume);
  bgmToggle.addEventListener('change', () => {
    bgmEnabled = bgmToggle.checked;
    saveAudioSettings();
  });
  bgmVolumeControl.addEventListener('input', () => {
    bgmVolume = Math.max(0, Math.min(0.5, Number(bgmVolumeControl.value)));
    saveAudioSettings();
  });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function renderTest() {
    const container = $('testQuestions');
    container.innerHTML = '';
    $('testResult').classList.add('hidden');
    $('testNotice').textContent = '';
    $('submitFinalTest').disabled = false;
    QUESTIONS.forEach((item, index) => {
      const card = document.createElement('fieldset');
      card.className = 'test-question panel';
      card.innerHTML = `<legend><span class="question-number">${index + 1}</span><span class="question-topic">${escapeHTML(item.topic)}</span></legend><p class="question-text">${escapeHTML(item.q)}</p><div class="test-options">${item.options.map((opt, oi) => `<label class="test-option"><input type="radio" name="q${index}" value="${oi}"><span>${String.fromCharCode(65 + oi)}. ${escapeHTML(opt)}</span></label>`).join('')}</div><div class="question-feedback hidden" id="explain-${index}"></div>`;
      container.appendChild(card);
    });
  }
  window.GraphMathRenderTest = renderTest;
  $('finalTestForm').addEventListener('submit', event => {
    event.preventDefault();
    let answered = 0;
    QUESTIONS.forEach((_, i) => { if (document.querySelector(`input[name="q${i}"]:checked`)) answered++; });
    if (answered < QUESTIONS.length) {
      $('testNotice').textContent = `Kamu baru menjawab ${answered} dari ${QUESTIONS.length} soal. Lengkapi semua soal sebelum memeriksa hasil.`;
      $('testNotice').classList.add('show');
      return;
    }
    let correctCount = 0;
    const review = [];
    QUESTIONS.forEach((item, index) => {
      const card = $('testQuestions').children[index];
      const choice = Number(document.querySelector(`input[name="q${index}"]:checked`).value);
      const correct = choice === item.answer;
      if (correct) correctCount++;
      card.classList.add(correct ? 'answer-correct' : 'answer-wrong');
      card.querySelectorAll('input').forEach(input => { input.disabled = true; });
      const feedback = $(`explain-${index}`);
      feedback.classList.remove('hidden');
      feedback.innerHTML = `<strong>${correct ? 'Benar' : 'Belum tepat'}.</strong> ${escapeHTML(item.explain)}${correct ? '' : `<br><b>Jawaban benar: ${String.fromCharCode(65 + item.answer)}. ${escapeHTML(item.options[item.answer])}</b>`}`;
      review.push({nomor:index + 1, benar:correct});
    });
    const score = correctCount * 10;
    storage.setItem(TEST_SCORE_KEY, String(score));
    $('testScoreNumber').textContent = score;
    $('testResultTitle').textContent = score >= 80 ? 'Bagus sekali!' : score >= 60 ? 'Terus berlatih!' : 'Ayo pelajari kembali materinya!';
    $('testResultMessage').textContent = `Jawaban benar ${correctCount} dari ${QUESTIONS.length} soal. ${score >= 80 ? 'Kamu menunjukkan pemahaman yang baik terhadap konsep GraphMath.' : 'Baca pembahasan setiap soal, lalu ulangi tes setelah mempelajari kembali materi.'}`;
    $('testResult').classList.remove('hidden');
    $('testNotice').textContent = '';
    $('testNotice').classList.remove('show');
    $('submitFinalTest').disabled = true;
    $('testResult').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('retryTest').addEventListener('click', renderTest);
  $('testHome').addEventListener('click', () => window.GraphMathGo('homePage'));
  // Initial controls are set but playback waits for a click on the identity screen.
  audio.volume = bgmVolume;
})();
