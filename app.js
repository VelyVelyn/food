/**
 * 식품의약품안전처(MFDS) 국민 안내 포털 자바스크립트
 * Framework-free, Vanilla JS, Zero CORS issues (double-click friendly)
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileDrawer();
  initDutiesTabs();
  initBenefitsFinder();
  initCustomGuide();
  initNewsSection();
  initQuiz();
  initFaqAccordion();
});

/* ========================================================
   1. 다크 모드 / 라이트 모드 제어
   ======================================================== */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  // 로컬 스토리지 또는 시스템 설정 확인
  const savedTheme = localStorage.getItem("mfds-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("mfds-theme", nextTheme);
  });
}

/* ========================================================
   2. 모바일 네비게이션 드로어
   ======================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const closeBtn = document.getElementById("close-drawer-btn");
  const drawer = document.getElementById("mobile-drawer");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  if (!menuBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  menuBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener("click", closeDrawer);
  });
}

/* ========================================================
   3. 5대 주요업무 탭 전환
   ======================================================== */
function initDutiesTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = `tab-${btn.dataset.tab}`;

      // 버튼 상태 업데이트
      tabBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // 패널 전환
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });
}

/* ========================================================
   [신규 기능] 나는 식약처로부터 어떤 도움을 받을 수 있을까?
   맞춤형 혜택·지원 자가진단 체크리스트
   ======================================================== */
const BENEFITS_DATA = [
  {
    id: "med-harm",
    category: "med",
    badge: "의약품 안전망",
    icon: "💊",
    title: "의약품 부작용 피해구제 제도",
    situation: "처방약 또는 일반의약품을 정상 복용했으나 입원, 장애, 사망 등 중대한 이상반응이 발생한 경우",
    benefitHighlight: "국가에서 진료비(최대 5,000만 원), 사망일시보상금(약 1억 3천만 원), 장애보상금 전액 지원",
    details: [
      "복잡한 민사소송 없이 의학적 인과관계 조사(식약처·한국의약품안전관리원)를 거쳐 신속 지급",
      "제약회사 기본 분담금으로 조성된 국가 공익 기금으로 환자와 유가족의 경제적 부담 완화",
      "의사 처방약뿐만 아니라 약국에서 구매한 일반 감기약, 진통제 복용에 따른 부작용도 심의 대상"
    ],
    contactName: "한국의약품안전관리원",
    contactTel: "1644-6223",
    applyUrl: "https://nedrug.mfds.go.kr",
    applyText: "피해구제 신청창구 바로가기"
  },
  {
    id: "food-defect",
    category: "food",
    badge: "공익신고 & 포상금",
    icon: "🥗",
    title: "부정·불량식품 1399 신고 및 포상금 제도",
    situation: "식당 음식이나 마트 식품에서 유리·금속·벌레 등 이물 발견, 부패·변질 또는 유통·소비기한 위변조를 목격한 경우",
    benefitHighlight: "신속한 현장 단속 및 원인 조사, 규정 위반 적발 시 최대 1,000만 원 신고 포상금 지급",
    details: [
      "전국 어디서나 국번없이 1399로 전화하거나 '내손안 식품안전정보' 앱으로 실시간 사진 첨부 신고",
      "지자체 및 식약처 합동 조사팀이 해당 업소를 불시 방문하여 위생 점검 및 시료 채취 정밀 검사",
      "중대한 유해 식품으로 확인 시 전국 대형마트 및 편의점 POS 계산대 결제 자동 차단 및 전량 회수·폐기"
    ],
    contactName: "부정·불량식품 통합신고센터",
    contactTel: "1399",
    applyUrl: "https://www.foodsafetykorea.go.kr",
    applyText: "식품안전나라 온라인 신고창구"
  },
  {
    id: "narcotics-help",
    category: "safe",
    badge: "24시간 무료 상담",
    icon: "🚫",
    title: "24시간 마약류 익명상담 '1342' & 중독재활센터(함께한걸음)",
    situation: "본인 또는 가족이 식욕억제제(디에타민 등), 수면제(졸피뎀), 마약류 오남용으로 고통받고 있거나 의존에서 벗어나고 싶을 때",
    benefitHighlight: "100% 비밀 보장 24시간 전문 심리상담, 치료보호비 지원 및 전국 중독재활센터 무료 프로그램 연계",
    details: [
      "'24시간 나를(13) 사(4)랑하고 이(2)해하는 곳' 1342 전문 상담원과의 1:1 비밀 보장 무료 통화",
      "처벌이 목적이 아닌 일상 복귀를 위한 맞춤형 사회재활 프로그램(함께한걸음센터) 전국 운영",
      "가족들을 위한 중독 이해 교육 및 심리치유 자조모임 무료 참여 기회 제공"
    ],
    contactName: "마약류 중독재활 상담콜",
    contactTel: "1342",
    applyUrl: "https://www.kpanet.or.kr",
    applyText: "한국마약퇴치운동본부 바로가기"
  },
  {
    id: "rare-cure",
    category: "med",
    badge: "희귀질환 지원",
    icon: "🧬",
    title: "희귀·필수의약품 및 긴급도입 필요 의료기기 국가 공급망",
    situation: "국내에 대체 치료제가 없거나 채산성 문제로 수입·생산이 중단된 희귀질환 치료제, 소아용 특수의료기기가 필요한 경우",
    benefitHighlight: "식약처가 해외 제약사로부터 직접 긴급 수입하여 국내 환자에게 신속 공급 (수입절차 대행)",
    details: [
      "소아 심장수술용 인공혈관, 희귀 간질환 치료제 등 생명과 직결된 품목 우선 수입 공급",
      "자가치료용 의약품 신속 통관 지원 및 수입 추천서 원스톱 발급",
      "국가필수의약품 수급 상황 상시 모니터링을 통한 품귀 현상 사전 예방 체계 가동"
    ],
    contactName: "한국희귀·필수의약품센터",
    contactTel: "02-508-7336",
    applyUrl: "https://www.kodc.or.kr",
    applyText: "희귀·필수의약품센터 공급신청"
  },
  {
    id: "cross-border",
    category: "food",
    badge: "소비자 안전망",
    icon: "📦",
    title: "'해외직구식품 올바로' 실시간 유해물질 무료 검색 서비스",
    situation: "해외 온라인 쇼핑몰에서 비타민, 헬스 보충제, 다이어트 식품을 구매하기 전 안전성을 확인하고 싶을 때",
    benefitHighlight: "마약성분·부정물질 함유로 국내 통관 차단 및 위해 판정된 3,000여 개 제품명 무료 즉시 조회",
    details: [
      "식약처와 관세청이 기획 검사를 통해 적발한 해외 직구 위해식품 블랙리스트 실시간 열람",
      "국내 반입 금지 성분(에페드린, 멜라토닌, 센나 등) 검색 및 제품명 키워드 조회 지원",
      "위해 제품으로 확인될 경우 결제 전 사전 차단으로 폐기 수수료 및 과태료 피해 예방"
    ],
    contactName: "식약처 종합상담센터",
    contactTel: "1577-1255",
    applyUrl: "https://www.foodsafetykorea.go.kr",
    applyText: "해외직구식품 올바로 바로가기"
  },
  {
    id: "school-meal",
    category: "welfare",
    badge: "취약계층 복지",
    icon: "🏫",
    title: "어린이·사회복지 급식관리지원센터 위생·영양 케어",
    situation: "자녀가 다니는 100인 미만 어린이집·유치원이나 노부모님이 계신 요양원의 식단과 조리장 위생이 걱정될 때",
    benefitHighlight: "식약처 전문 영양사가 직접 급식소를 방문하여 균형 식단 감수 및 조리장 위생 전액 무료 지원",
    details: [
      "영양사 고용 의무가 없는 소규모 어린이집·노인·장애인 복지시설의 식생활 안전망 구축",
      "연령별·질환별(당뇨, 연하곤란 등) 맞춤형 건강 식단 및 알레르기 유발 물질 사전 관리",
      "조리실 위생 상태, 식재료 유통기한, 칼·도마 소독 상태 정기 과학적 점검"
    ],
    contactName: "중앙급식관리지원센터",
    contactTel: "02-6959-1999",
    applyUrl: "https://ccfsm.foodsafetykorea.go.kr",
    applyText: "급식관리지원센터 포털 바로가기"
  },
  {
    id: "pregnant-dur",
    category: "med",
    badge: "적정사용(DUR)",
    icon: "🤰",
    title: "DUR(의약품안전사용서비스) 병용금기 조회 & 'e약은요'",
    situation: "임신·수유 중이라 약 복용이 꺼려지거나, 여러 병원에서 처방받은 약을 동시에 복용해도 안전한지 궁금할 때",
    benefitHighlight: "함께 먹으면 안 되는 약물 실시간 자동 점검 경고 및 알기 쉬운 우리말 복약정보 무료 제공",
    details: [
      "의사 처방 및 약사 조제 시 컴퓨터 화면에 임부 금기·연령 금기·병용 금기 약물 실시간 경고",
      "의약품안전나라 'e약은요' 코너에서 제품명 입력 시 전문 용어 대신 쉬운 글과 그림으로 효능·주의점 설명",
      "스마트폰 카메라로 약 봉투나 알약을 찍으면 해당 약의 모양과 효능 즉시 확인"
    ],
    contactName: "한국의약품안전관리원(DUR)",
    contactTel: "1644-6223",
    applyUrl: "https://nedrug.mfds.go.kr",
    applyText: "e약은요 복약정보 조회하기"
  },
  {
    id: "biz-support",
    category: "biz",
    badge: "소상공인 지원",
    icon: "🏪",
    title: "소상공인 맞춤형 스마트 HACCP 무상 기술지원 & 규제 상담",
    situation: "소규모 가공식품, 밀키트, 음식점 창업을 준비 중이거나 HACCP 인증, 푸드QR 표기 지원을 받고 싶을 때",
    benefitHighlight: "영세 소상공인 대상 맞춤형 위생 관리 컨설팅 전액 무상 제공 및 신기술 규제 신속 해소",
    details: [
      "한국식품안전관리인증원 전문 심사관의 1:1 현장 방문 위생 진단 및 기준서 작성 지원",
      "식품 제조 공장의 온도·습도·금속검출 데이터를 자동으로 기록하는 스마트 해썹 표준모듈 보급",
      "새로운 아이디어 제품의 신속한 시장 출시를 위한 '규제정합성 검토' 제도 무료 신청 가능"
    ],
    contactName: "한국식품안전관리인증원",
    contactTel: "1599-1107",
    applyUrl: "https://www.haccp.or.kr",
    applyText: "HACCP 기술지원 신청 바로가기"
  }
];

function initBenefitsFinder() {
  const checkCards = document.querySelectorAll(".check-card");
  const checkInputs = document.querySelectorAll(".check-input");
  const selectedCountEl = document.getElementById("selected-count");
  const resultsContainer = document.getElementById("results-cards-grid");
  const resultsCountEl = document.getElementById("results-count-num");
  const resultsSubtextEl = document.getElementById("results-subtext");
  const btnSelectAll = document.getElementById("btn-select-all");
  const btnClearAll = document.getElementById("btn-clear-all");
  const btnPrint = document.getElementById("btn-print-benefits");
  const catPills = document.querySelectorAll(".cat-pill");

  if (!resultsContainer) return;

  // 결과 카드 렌더링 함수
  const renderResults = () => {
    const checkedValues = Array.from(checkInputs)
      .filter(input => input.checked)
      .map(input => input.value);

    // 선택 카운트 표시 갱신
    if (selectedCountEl) {
      selectedCountEl.textContent = checkedValues.length;
    }

    // 체크 상태 클래스 동기화
    checkCards.forEach(card => {
      const input = card.querySelector(".check-input");
      if (input && input.checked) {
        card.classList.add("checked");
      } else {
        card.classList.remove("checked");
      }
    });

    let displayList = [];
    if (checkedValues.length === 0) {
      // 아무것도 선택하지 않았을 땐 전체 8대 제도 미리보기 표시
      displayList = BENEFITS_DATA;
      if (resultsCountEl) resultsCountEl.textContent = `${displayList.length} (전체)`;
      if (resultsSubtextEl) {
        resultsSubtextEl.innerHTML = `위 상황 카드를 클릭하시면 맞춤형 혜택이 나타납니다! ✨ <span style="color: var(--primary); font-weight: 800;">(현재 전체 8대 지원 제도를 미리 표시 중입니다 💖)</span>`;
      }
    } else {
      // 선택한 항목들만 필터링
      displayList = BENEFITS_DATA.filter(item => checkedValues.includes(item.id));
      if (resultsCountEl) resultsCountEl.textContent = displayList.length;
      if (resultsSubtextEl) {
        resultsSubtextEl.innerHTML = `선택하신 <strong>${checkedValues.length}개의 상황</strong>에 꼭 맞는 식약처의 든든한 혜택 모음이에요! 🎀`;
      }
    }

    // HTML 생성
    let html = "";
    displayList.forEach(benefit => {
      let detailsHtml = "";
      benefit.details.forEach(dt => {
        detailsHtml += `<li class="b-detail-item">${dt}</li>`;
      });

      html += `
        <article class="benefit-card">
          <div class="b-header">
            <span class="b-badge">${benefit.badge}</span>
            <span class="b-icon">${benefit.icon}</span>
          </div>
          <h4 class="b-title">${benefit.title}</h4>
          <div class="b-situation">
            <strong>이럴 때 도움을 드립니다:</strong> ${benefit.situation}
          </div>
          <div class="b-highlight-box">
            <span class="b-highlight-label">💡 국민이 받는 핵심 혜택</span>
            <p class="b-highlight-text">${benefit.benefitHighlight}</p>
          </div>
          <ul class="b-details-list">
            ${detailsHtml}
          </ul>
          <div class="b-footer">
            <a href="tel:${benefit.contactTel}" class="b-contact-btn" title="전화 상담 연결">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
              </svg>
              <span>${benefit.contactName} (${benefit.contactTel})</span>
            </a>
            <a href="${benefit.applyUrl}" target="_blank" rel="noopener noreferrer" class="b-apply-link">
              ${benefit.applyText} &rarr;
            </a>
          </div>
        </article>
      `;
    });

    resultsContainer.innerHTML = html;
  };

  // 체크박스 변경 이벤트 리스너 등록
  checkInputs.forEach(input => {
    input.addEventListener("change", () => {
      renderResults();
    });
  });

  // 카테고리 필터 클릭
  catPills.forEach(pill => {
    pill.addEventListener("click", () => {
      catPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const cat = pill.dataset.cat;
      checkCards.forEach(card => {
        if (cat === "all" || card.dataset.category === cat) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 전체 선택 버튼
  if (btnSelectAll) {
    btnSelectAll.addEventListener("click", () => {
      checkInputs.forEach(input => {
        input.checked = true;
      });
      renderResults();
    });
  }

  // 선택 해제 버튼
  if (btnClearAll) {
    btnClearAll.addEventListener("click", () => {
      checkInputs.forEach(input => {
        input.checked = false;
      });
      renderResults();
    });
  }

  // 결과 인쇄 / PDF 저장 버튼
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // 초기 렌더링
  renderResults();
}

/* ========================================================
   4. 나에게 꼭 맞는 맞춤형 식의약 생활 가이드
   ======================================================== */
const GUIDE_DATA = {
  "guide-parent": [
    {
      icon: "🍼",
      title: "영유아 이유식 소비기한 & 보관",
      desc: "개봉한 조제유나 이유식은 침이나 스푼의 침투로 세균 번식이 빠르므로 개봉 즉시 밀봉 냉장보관하고 권장 기간 내 소비하세요."
    },
    {
      icon: "🏫",
      title: "학교·어린이 급식관리지원센터",
      desc: "식약처가 전국 지자체와 운영하는 어린이급식관리지원센터를 통해 100인 미만 소규모 어린이집·유치원의 영양과 위생을 철저히 검증합니다."
    },
    {
      icon: "🧴",
      title: "영유아 화장품 전성분 확인",
      desc: "어린이용 로션, 바디워시 구매 시 알레르기 유발 향료 성분 표시 및 보존제 함유 기준 준수 여부를 라벨에서 꼭 확인하세요."
    }
  ],
  "guide-elder": [
    {
      icon: "💊",
      title: "만성질환 다제약물 복용 주의 (DUR)",
      desc: "혈압약, 당뇨약 등 여러 약을 함께 드실 땐 병의원이나 약국에 복용 중인 모든 약을 알려 DUR(의약품안전사용서비스) 중복 점검을 받으세요."
    },
    {
      icon: "🩺",
      title: "가정용 혈압계·혈당계 허가번호 확인",
      desc: "공산품이 아닌 식약처 의료기기 인허가 마크가 있는 제품인지 확인하고, 정기적으로 영점 교정 및 올바른 측정 자세를 유지하세요."
    },
    {
      icon: "👵",
      title: "사회복지시설 급식위생 지원",
      desc: "노인·장애인 복지시설의 식단표 및 조리장 위생 관리를 전담 영양사가 과학적으로 지원하는 '사회복지급식관리지원센터' 혜택을 확인하세요."
    }
  ],
  "guide-diet": [
    {
      icon: "⚖️",
      title: "비만치료제(위고비 등) 불법 직구 금지",
      desc: "GLP-1 비만치료제는 전문의약품으로 온라인 거래가 법으로 금지되어 있습니다. 의사의 진단 없이 복용 시 구토, 췌장염, 시력 이상 위험이 있습니다."
    },
    {
      icon: "💪",
      title: "단백질 보충제 스테로이드 부정물질",
      desc: "해외 직구 헬스 보충제 일부에서 불법 단백동화 스테로이드가 검출될 수 있습니다. 식약처 '식품안전나라'에서 적발 이력을 조회하세요."
    },
    {
      icon: "🥗",
      title: "식품 '단백질·당류' 영양성분표 읽기",
      desc: "무가당, 제로 슈가 제품이라도 인공감미료 종류와 총 칼로리를 꼼꼼히 확인하고 균형 잡힌 자연 식단과 병행해야 합니다."
    }
  ],
  "guide-direct": [
    {
      icon: "🔍",
      title: "'해외직구식품 올바로' 검색 필수",
      desc: "외국 쇼핑몰에서 직접 구매하기 전, 식품안전나라의 '해외직구식품 올바로' 코너에서 국내 반입 금지 원료가 든 제품인지 검색하세요."
    },
    {
      icon: "🚫",
      title: "수면유도·집중력 향상 보조제 주의",
      desc: "멜라토닌, 에페드린, 요힘빈 등 국내에서 의약품 또는 유해물질로 지정된 성분은 통관 시 전량 폐기되며 과태료 처분을 받을 수 있습니다."
    },
    {
      icon: "📦",
      title: "한글 표시사항 확인",
      desc: "국내에 정식 수입 통관된 제품은 포장지에 한글 스티커(원재료, 수입원, 보관법)가 부착되어 있어 부작용 발생 시 보호를 받을 수 있습니다."
    }
  ]
};

function initCustomGuide() {
  const chips = document.querySelectorAll(".guide-chip");
  const displayContainer = document.getElementById("guide-display");
  if (!displayContainer) return;

  const renderGuide = (targetKey) => {
    const list = GUIDE_DATA[targetKey] || GUIDE_DATA["guide-parent"];
    let html = `<div class="guide-grid">`;
    list.forEach(item => {
      html += `
        <div class="guide-rule-card">
          <div class="rule-icon">${item.icon}</div>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      `;
    });
    html += `</div>`;
    displayContainer.innerHTML = html;
  };

  // 초기 렌더링
  renderGuide("guide-parent");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderGuide(chip.dataset.target);
    });
  });
}

/* ========================================================
   5. 최신 뉴스 및 보도자료 데이터 & 필터 검색
   (실제 기사 및 정책브리핑 공식 URL 수록)
   ======================================================== */
const NEWS_ARTICLES = [
  {
    id: 1,
    title: "의사 '셀프 투약' 금지 대폭 확대…마약류 1종에서 22종으로",
    category: "narcotics",
    source: "연합뉴스",
    date: "2026.10.21",
    url: "https://www.yna.co.kr/view/AKR20261021035600530",
    snippet: "식품의약품안전처는 의사가 자신에게 직접 처방·투약할 수 없는 마약류를 기존 프로포폴 1종에서 모르핀, 펜타닐 등 주사제 총 22종으로 대폭 확대하는 마약류 관리에 관한 법률 시행규칙 개정안을 입법예고했습니다.",
    tag: "마약류 안전"
  },
  {
    id: 2,
    title: "[바이오스냅] 식약처, 천연물 기반 제품 개발 동향 심포지엄 개최",
    category: "medicine",
    source: "연합뉴스",
    date: "2026.10.21",
    url: "https://www.yna.co.kr/view/AKR20261021028700530",
    snippet: "식품의약품안전평가원이 충북 청주 오스코에서 한약, 화장품, 건강기능식품 분야의 천연물 최신 연구 동향 및 제품화 규제 지원 방안을 논의하는 공동 심포지엄을 개최합니다.",
    tag: "천연물·바이오"
  },
  {
    id: 3,
    title: "수능 앞두고 ADHD 치료제·수면제 온라인 불법 유통·알선 집중 점검",
    category: "narcotics",
    source: "대한민국 정책브리핑",
    date: "2026.10.15",
    url: "https://www.korea.kr/briefing/pressReleaseList.do?branchCd=sh_m_coef&srchDeptTp=1&srchDeptCode=1471000",
    snippet: "수험생을 겨냥해 '공부 잘하는 약'이나 '집중력 강화제'로 둔갑해 SNS 등에서 불법 유통되는 메틸페니데이트 성분 의약품에 대한 사이버 집중 감시와 기획 수사를 강화합니다.",
    tag: "청소년 보호"
  },
  {
    id: 4,
    title: "신생아 호흡곤란·소아 환자 치료제 등 국가필수의약품 8종 신규 지정",
    category: "medicine",
    source: "식품의약품안전처",
    date: "2026.10.20",
    url: "https://www.mfds.go.kr/brd/m_99/list.do",
    snippet: "소아 아미노산 수액주사제, 미숙아 폐추출물 주사제, 백혈병 치료제 등 공급 중단 시 환자 생명에 치명적인 필수 의약품 8개 품목을 국가필수의약품으로 지정하여 안정적 공급망을 확보했습니다.",
    tag: "필수의약품"
  },
  {
    id: 5,
    title: "시각·청각장애인을 위한 화장품 점자 및 음성·수어 변환코드 가이드라인 제정",
    category: "policy",
    source: "대한민국 정책브리핑",
    date: "2026.10.20",
    url: "https://www.korea.kr",
    snippet: "장애인의 일상 속 화장품 사용 정보 접근성을 보장하기 위해 포장 용기 표면의 점자 규격과 음성·수어 영상으로 연결되는 디지털 바코드 표기 표준 지침을 발표했습니다.",
    tag: "배리어프리"
  },
  {
    id: 6,
    title: "국제식품규격위원회(CODEX) 수출입인증분과 참여…식품사기 방지 기준 주도",
    category: "food",
    source: "대한민국 정책브리핑",
    date: "2026.10.20",
    url: "https://www.korea.kr/briefing/pressReleaseList.do?branchCd=sh_m_coef&srchDeptTp=1&srchDeptCode=1471000",
    snippet: "호주에서 개최된 제28차 CODEX 회의에 한국 대표단으로 참석하여 K-푸드 수출 애로 해소 및 글로벌 위조·부정 식품 유통을 방지하기 위한 가이드라인 제정을 이끌었습니다.",
    tag: "글로벌 규제"
  },
  {
    id: 7,
    title: "GLP-1 비만치료제(위고비 등) 허가 규정 준수 및 이상사례 집중 모니터링",
    category: "medicine",
    source: "식품안전나라 뉴스",
    date: "2026.10.13",
    url: "https://www.foodsafetykorea.go.kr",
    snippet: "체질량지수(BMI) 기준 미달자의 무분별한 투약과 비대면 진료를 통한 편법 처방을 단속하고, 시신경 병증 등 부작용 보고 현황을 철저히 추적·조사 중입니다.",
    tag: "의약품 안전"
  },
  {
    id: 8,
    title: "스마트폰 카메라로 찍으면 끝! '푸드QR' 국내 제조 및 수입식품 확대",
    category: "food",
    source: "식품의약품안전처",
    date: "2026.09.28",
    url: "https://www.mfds.go.kr",
    snippet: "작은 포장지 글씨의 불편함을 해소하는 '푸드QR'이 대형 유통 매장과 수입 식품으로 대폭 확대되어 원재료 알레르기 및 회수 제품 여부를 즉석에서 확인할 수 있습니다.",
    tag: "디지털 식품"
  },
  {
    id: 9,
    title: "의약품 부작용 피해구제 진료비 상한액 5,000만 원 지원 정책 본격 가동",
    category: "policy",
    source: "대한민국 정책브리핑",
    date: "2026.01.10",
    url: "https://www.korea.kr",
    snippet: "정상 복용 중 발생한 중증 약물 이상반응 환자에게 입원 진료비와 간병 부담을 실질적으로 덜어주기 위해 보상 범위를 대폭 확대한 피해구제 제도가 호평을 받고 있습니다.",
    tag: "국민 보상망"
  }
];

function initNewsSection() {
  const container = document.getElementById("news-container");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("news-search-input");
  if (!container) return;

  let currentCategory = "all";
  let currentKeyword = "";

  const renderArticles = () => {
    const filtered = NEWS_ARTICLES.filter(item => {
      const matchCat = currentCategory === "all" || item.category === currentCategory;
      const matchKw = currentKeyword === "" || 
        item.title.toLowerCase().includes(currentKeyword.toLowerCase()) ||
        item.snippet.toLowerCase().includes(currentKeyword.toLowerCase()) ||
        item.tag.toLowerCase().includes(currentKeyword.toLowerCase());
      return matchCat && matchKw;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <p style="font-size: 1.1rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">검색 결과가 없습니다.</p>
          <p style="font-size: 0.9rem; color: var(--text-subtle);">다른 키워드로 검색하거나 필터를 '전체보기'로 변경해 보세요.</p>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(article => {
      html += `
        <article class="news-card">
          <div class="news-meta">
            <span class="news-source">${article.source}</span>
            <span class="news-date">${article.date}</span>
          </div>
          <h3 class="news-title">
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" title="새 창에서 기사 원문 보기">
              ${article.title}
            </a>
          </h3>
          <p class="news-snippet">${article.snippet}</p>
          <div class="news-footer">
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-link-btn">
              기사 원문 보기 &rarr;
            </a>
            <span class="news-tag">#${article.tag}</span>
          </div>
        </article>
      `;
    });
    container.innerHTML = html;
  };

  // 초기 렌더링
  renderArticles();

  // 필터 버튼 클릭
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderArticles();
    });
  });

  // 검색 인풋 입력
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentKeyword = e.target.value.trim();
      renderArticles();
    });
  }
}

/* ========================================================
   6. 대국민 식의약 상식 OX 퀴즈
   ======================================================== */
const QUIZ_QUESTIONS = [
  {
    q: "소비기한(Use-by date)이 하루라도 지난 식품은 건강과 안전을 위해 섭취하지 않고 버리는 것이 원칙이다?",
    a: "O",
    explanation: "맞습니다! '소비기한'은 표시된 보관 조건을 지켰을 때 식품을 안전하게 섭취할 수 있는 최종 기한입니다. 기존 유통기한과 달리 소비기한이 지난 식품은 변질 위험이 있으므로 절대 드시면 안 됩니다."
  },
  {
    q: "비만치료제(위고비 등)는 병원 처방 없이 해외 직구나 인터넷 중고거래로 구입해도 안전하다?",
    a: "X",
    explanation: "틀렸습니다! GLP-1 비만치료제는 의사의 정확한 진단과 처방이 필요한 전문의약품입니다. 온라인 거래나 해외직구는 약사법 위반이며, 가짜 약이거나 보관 온도 위반으로 인한 심각한 부작용 위험이 있습니다."
  },
  {
    q: "의사·약사 지도에 따라 정상적으로 약을 복용했음에도 심각한 부작용이 생기면 국가에서 치료비 등을 보상해 준다?",
    a: "O",
    explanation: "맞습니다! 식약처가 운영하는 '의약품 부작용 피해구제 제도'에 따라, 정상적으로 투약했음에도 사망·장애·입원치료 등 중대한 피해를 입은 경우 최대 5,000만 원의 진료비와 보상금을 지급합니다."
  },
  {
    q: "시중에서 판매하는 모든 안마의자나 마사지건은 식품의약품안전처가 공인한 '의료기기'이다?",
    a: "X",
    explanation: "틀렸습니다! 대부분의 일반 안마의자나 마사지기는 공산품입니다. 질병 치료나 예방 목적으로 식약처 허가를 받은 제품만 포장지에 '의료기기' 표기 및 '제인(허) 00-00호' 허가번호가 있습니다."
  },
  {
    q: "화장품 용기에 표시된 '12M' 심볼은 '제조일로부터 12개월 동안 보관 가능'하다는 뜻이다?",
    a: "X",
    explanation: "틀렸습니다! 뚜껑이 열린 크림 단지 모양의 '12M' 기호는 '제품을 개봉한 날로부터 12개월(Month) 안에 사용'해야 함을 의미하는 개봉 후 사용기한 표시입니다."
  }
];

function initQuiz() {
  let currentIndex = 0;
  let score = 0;

  const progressEl = document.getElementById("quiz-progress");
  const scoreBadgeEl = document.getElementById("quiz-score-badge");
  const questionTextEl = document.getElementById("quiz-question-text");
  const choiceGroupEl = document.getElementById("quiz-choice-group");
  const feedbackEl = document.getElementById("quiz-feedback");
  const feedbackTitleEl = document.getElementById("feedback-title");
  const feedbackDescEl = document.getElementById("feedback-desc");
  const nextBtn = document.getElementById("btn-next-quiz");
  const finalEl = document.getElementById("quiz-final");
  const finalTitleEl = document.getElementById("final-title");
  const finalDescEl = document.getElementById("final-desc");
  const restartBtn = document.getElementById("btn-restart-quiz");

  if (!questionTextEl) return;

  const loadQuestion = () => {
    const qData = QUIZ_QUESTIONS[currentIndex];
    progressEl.textContent = `문제 ${currentIndex + 1} / ${QUIZ_QUESTIONS.length}`;
    scoreBadgeEl.textContent = `현재 점수: ${score * 20}점`;
    questionTextEl.textContent = `"${qData.q}"`;

    choiceGroupEl.style.display = "flex";
    feedbackEl.style.display = "none";
    finalEl.style.display = "none";

    const quizBtns = choiceGroupEl.querySelectorAll(".btn-quiz");
    quizBtns.forEach(btn => btn.disabled = false);
  };

  const handleAnswer = (userChoice) => {
    const qData = QUIZ_QUESTIONS[currentIndex];
    const isCorrect = userChoice === qData.a;

    const quizBtns = choiceGroupEl.querySelectorAll(".btn-quiz");
    quizBtns.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      score += 1;
      feedbackTitleEl.className = "feedback-result correct";
      feedbackTitleEl.innerHTML = "💖 딩동댕! 완전 정답이에요! ✨";
    } else {
      feedbackTitleEl.className = "feedback-result incorrect";
      feedbackTitleEl.innerHTML = `💔 아쉬워요! 정답은 [ ${qData.a} ] 랍니다!`;
    }

    feedbackDescEl.textContent = qData.explanation;
    feedbackEl.style.display = "block";
    scoreBadgeEl.textContent = `현재 점수: ${score * 20}점`;
  };

  const choiceBtns = choiceGroupEl.querySelectorAll(".btn-quiz");
  choiceBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      handleAnswer(btn.dataset.answer);
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex += 1;
      if (currentIndex < QUIZ_QUESTIONS.length) {
        loadQuestion();
      } else {
        // 결과 화면 표시
        choiceGroupEl.style.display = "none";
        feedbackEl.style.display = "none";
        questionTextEl.parentElement.style.display = "none";
        finalEl.style.display = "block";
        progressEl.textContent = "퀴즈 완료 ✨";

        const totalScore = score * 20;
        scoreBadgeEl.textContent = `최종 점수: ${totalScore}점`;

        if (totalScore === 100) {
          finalTitleEl.textContent = "💯 백점만점! 완벽한 식의약 핑크 척척박사! 💖";
          finalDescEl.textContent = "5문제를 모두 맞히셨습니다! 올바른 상식으로 나와 가족의 건강을 든든하게 지켜내실 수 있습니다. ✨";
        } else if (totalScore >= 60) {
          finalTitleEl.textContent = "👏 훌륭해요! 러블리 식의약 상식 마스터! 🎀";
          finalDescEl.textContent = `${totalScore}점을 획득하셨습니다. 이번 기회에 헷갈렸던 식약처 기준들을 꼭 기억해 두세요! 💖`;
        } else {
          finalTitleEl.textContent = "🌱 관심 충전 완료! 안전 지식 레벨업! 🍓";
          finalDescEl.textContent = `${totalScore}점을 받으셨습니다. 이번 퀴즈 해설을 통해 알게 된 식약처 상식들을 생활 속에서 실천해 보세요! ✨`;
        }
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      currentIndex = 0;
      score = 0;
      questionTextEl.parentElement.style.display = "flex";
      loadQuestion();
    });
  }

  // 초기 문제 로드
  loadQuestion();
}

/* ========================================================
   7. 자주 묻는 질문(FAQ) 아코디언
   ======================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // 다른 아이템 닫기 (아코디언 동작)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherBtn = otherItem.querySelector(".faq-question");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // 현재 아이템 토글
      if (isOpen) {
        item.classList.remove("active");
        questionBtn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("active");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}
