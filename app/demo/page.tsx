"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { VisualIcon } from "../components/VisualIcon";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;
const route = (path: string) => `${basePath}${path}`;

type Language = "EN" | "TC" | "SC";
type DeviceMode = "web" | "mobile";
type AiConversationMessage = { id: number; role: "user" | "ai"; text: string; applied?: string };

const aiBankingActions = [
  ["Start with AI", "Call me Jenny"],
  ["Suggest my sector", "I run a trading business"],
  ["Connect verified profile", "Connect my personal profile"],
  ["Classify evidence", "Load the sample document pack and explain any gaps"],
  ["Route this case", "Show the low-risk route and explain when a specialist is needed"],
  ["Prepare activation", "Show what is ready to use and what unlocks next"],
  ["Recommend solutions", "Recommend banking solutions for cash flow, FX and growth"],
];

const businessTypes = [
  { id: "trade", icon: "trade", featured: true, EN: ["Trading", "Import & export"], TC: ["貿易", "進出口業務"], SC: ["贸易", "进出口业务"] },
  { id: "digital", icon: "digital", featured: true, EN: ["Digital commerce", "Online sales"], TC: ["數碼商貿", "網上銷售"], SC: ["数字商贸", "网上销售"] },
  { id: "services", icon: "services", featured: true, EN: ["Professional services", "Client-led work"], TC: ["專業服務", "客戶導向業務"], SC: ["专业服务", "客户导向业务"] },
  { id: "tech", icon: "tech", featured: true, EN: ["Technology", "Software & platforms"], TC: ["科技", "軟件及平台"], SC: ["科技", "软件及平台"] },
  { id: "food", icon: "food", featured: false, EN: ["Food & beverage", "Hospitality & dining"], TC: ["餐飲", "酒店及食肆"], SC: ["餐饮", "酒店及餐厅"] },
  { id: "manufacturing", icon: "manufacturing", featured: false, EN: ["Manufacturing", "Production & supply"], TC: ["製造業", "生產及供應"], SC: ["制造业", "生产及供应"] },
  { id: "health", icon: "health", featured: false, EN: ["Healthcare", "Health & wellness"], TC: ["醫療健康", "健康及保健"], SC: ["医疗健康", "健康及保健"] },
  { id: "property", icon: "property", featured: false, EN: ["Property", "Real estate services"], TC: ["地產", "房地產服務"], SC: ["地产", "房地产服务"] },
  { id: "retail", icon: "payments", featured: false, EN: ["Retail", "Stores & consumer goods"], TC: ["零售", "店舖及消費品"], SC: ["零售", "门店及消费品"] },
  { id: "construction", icon: "property", featured: false, EN: ["Construction", "Projects & contracting"], TC: ["建造", "工程及承包"], SC: ["建造", "工程及承包"] },
  { id: "logistics", icon: "global", featured: false, EN: ["Transport & logistics", "Movement & fulfilment"], TC: ["運輸及物流", "配送及履約"], SC: ["运输及物流", "配送及履约"] },
  { id: "investment", icon: "wealth", featured: false, EN: ["Investment holding", "Assets & investments"], TC: ["投資控股", "資產及投資"], SC: ["投资控股", "资产及投资"] },
  { id: "education", icon: "people", featured: false, EN: ["Education", "Learning & training"], TC: ["教育", "學習及培訓"], SC: ["教育", "学习及培训"] },
  { id: "creative", icon: "sparkle", featured: false, EN: ["Media & creative", "Content & production"], TC: ["媒體及創意", "內容及製作"], SC: ["媒体及创意", "内容及制作"] },
  { id: "other", icon: "insight", featured: false, EN: ["Other sector", "Tell AI what you do"], TC: ["其他行業", "告訴 AI 你的業務"], SC: ["其他行业", "告诉 AI 你的业务"] },
];

const solutions = [
  { key: "Preferential Deposit Rate", icon: "wealth", EN: ["Lock preferential rate for deposits", "Secure value early"], TC: ["鎖定存款優惠利率", "提早鎖定價值"], SC: ["锁定存款优惠利率", "提前锁定价值"] },
  { key: "Business Debit Cards", icon: "banking", EN: ["Business Debit Cards", "Everyday spending"], TC: ["商業扣賬卡", "日常開支"], SC: ["商业借记卡", "日常开支"] },
  { key: "Credit Cards", icon: "finance", EN: ["Credit Cards", "Flexible team spend"], TC: ["信用卡", "靈活團隊開支"], SC: ["信用卡", "灵活团队开支"] },
  { key: "Payments", icon: "payments", EN: ["Payments", "Move money simply"], TC: ["支付", "輕鬆調動資金"], SC: ["支付", "轻松调动资金"] },
  { key: "FX", icon: "global", EN: ["FX", "Manage currencies"], TC: ["外匯", "管理多種貨幣"], SC: ["外汇", "管理多种货币"] },
  { key: "Trade", icon: "trade", EN: ["Trade", "Grow across borders"], TC: ["貿易", "拓展跨境業務"], SC: ["贸易", "拓展跨境业务"] },
  { key: "Financing", icon: "finance", EN: ["Financing", "Fuel the next move"], TC: ["融資", "推動下一步"], SC: ["融资", "推动下一步"] },
  { key: "Commercial Wealth", icon: "wealth", EN: ["Commercial Wealth", "Build resilience"], TC: ["商業財富管理", "增強韌性"], SC: ["商业财富管理", "增强韧性"] },
  { key: "GBA", icon: "global", EN: ["GBA", "Connect opportunities"], TC: ["大灣區", "連接發展機遇"], SC: ["大湾区", "连接发展机遇"] },
];

const sampleDocuments = ["Certificate-of-Incorporation.pdf", "Business-Registration.pdf", "Ownership-Structure.pdf", "Owner-ID-and-Selfie.jpg", "Business-Address-Proof.pdf"];
const journeys = {
  EN: ["Welcome", "Business", "Profile", "Documents", "Verification", "Account", "Grow"],
  TC: ["歡迎", "業務", "資料", "文件", "驗證", "賬戶", "成長"],
  SC: ["欢迎", "业务", "资料", "文件", "验证", "账户", "成长"],
};

const journeyPhases = {
  EN: [
    { title: "One Tap", detail: "SPARK · Scan & start", end: 2 },
    { title: "One Profile", detail: "TRUST · Connect & verify", end: 4 },
    { title: "One HSBC", detail: "GROW · Activate & deepen", end: 6 },
  ],
  TC: [
    { title: "One Tap", detail: "SPARK · 掃描及開始", end: 2 },
    { title: "One Profile", detail: "TRUST · 連接及驗證", end: 4 },
    { title: "One HSBC", detail: "GROW · 啟用及深化", end: 6 },
  ],
  SC: [
    { title: "One Tap", detail: "SPARK · 扫描及开始", end: 2 },
    { title: "One Profile", detail: "TRUST · 连接及验证", end: 4 },
    { title: "One HSBC", detail: "GROW · 启用及深化", end: 6 },
  ],
};

function getAiGuidance(name: string, language: Language) {
  const guidance = {
    EN: [
      { eyebrow: "FIRST TOUCH", message: `Hello ${name}. Speak, type or tap—I’ll guide the rest.`, prompts: [["How does AI help?", "I prepare the next step and keep every decision reviewable."], ["Can I pause?", "Yes. Continue later without restarting."]] },
      { eyebrow: "YOUR BUSINESS", message: `Thanks, ${name}. What does your business do?`, prompts: [["Why business type?", "To show only relevant questions."], ["Can I change it?", "Yes, before the account is created."]] },
      { eyebrow: "ONE PROFILE", message: "Tap an ID, connect verified data or enter it yourself.", prompts: [["Do I need a personal account?", "No. Every route stays optional."], ["How is the company matched?", "Choose a trusted source and review the match."]] },
      { eyebrow: "DOCUMENTS", message: "Drop the pack. I’ll sort it and flag only gaps.", prompts: [["Which documents?", "Company, ownership, identity and address evidence."], ["Are files stored?", "No. This demo reads filenames only."]] },
      { eyebrow: "ASSURANCE", message: "Digital when clear. A specialist when needed.", prompts: [["Is video mandatory?", "Only for added assurance."], ["Will I repeat details?", "No. Context follows the case."]] },
      { eyebrow: "ACCOUNT READY", message: "Your account number is ready. Let’s activate what matters.", prompts: [["What can I use now?", "Business Internet Banking starts first."], ["Is the number secure?", "Yes. It is masked and fictional."]] },
      { eyebrow: "GROW", message: "Next GEM AI Fit has prepared relevant solutions and people journeys.", prompts: [["Why these solutions?", "They match your sector and operating signals."], ["Who can continue?", "Owners, directors and employees can opt in separately."]] },
    ],
    TC: [
      { eyebrow: "首次接觸", message: `你好，${name}。我會由第一個問題開始，引導你完成商業賬戶開立。你可以說話、輸入或點選。`, prompts: [["你會怎樣協助？", "我會按你的情況調整問題、協調檢查，並解釋每個下一步。"], ["可以暫停嗎？", "可以。進度會清楚保留，回來時毋須重新開始。"]] },
      { eyebrow: "你的業務", message: `謝謝你，${name}。告訴我你的業務性質，我會按真正需要設計旅程。`, prompts: [["為何要選業務類型？", "這有助只顯示相關問題，避免不必要的資料要求。"], ["之後可以更改嗎？", "可以，在建立賬戶前都可更新。"]] },
      { eyebrow: "自選資料方式", message: "你可連接合資格的已驗證個人資料，或自行輸入東主資料；之後我會協助配對公司及董事。", prompts: [["需要個人賬戶嗎？", "不需要。連接現有資料屬自願選項，亦可全程自行輸入。"], ["如何配對公司？", "輸入公司編號，或讓此模擬示範準備官方紀錄配對樣本。"]] },
      { eyebrow: "智能文件處理", message: "拖入文件套裝後，我會分類文件、擷取重點，並只標示真正需要注意的項目。", prompts: [["需要哪些文件？", "此示範包括公司註冊、商業登記及擁有權資料。"], ["文件會被儲存嗎？", "不會。此原型只讀取檔案名稱，不會上載或儲存內容。"]] },
      { eyebrow: "按需加強驗證", message: "大部分合資格個案可全程數碼完成；如仍有風險問題，我可即時連接驗證專員。", prompts: [["視像驗證是必須嗎？", "不是。只會在需要額外確認或你選擇預覽時出現。"], ["需要重複資料嗎？", "不需要。專員會收到已準備的背景，只集中處理例外問題。"]] },
      { eyebrow: "賬戶已準備", message: "你的示範賬戶號碼已準備好，我可立即協助啟用最需要的服務。", prompts: [["現在可以使用甚麼？", "商務網上理財會先啟用，其他服務會按需要及檢查進度解鎖。"], ["賬戶號碼安全嗎？", "是。這是已遮蔽的虛構號碼，示範不會收集個人資料。"]] },
      { eyebrow: "度身成長", message: "賬戶已啟用。我把業務訊號轉化為卡及服務建議；企業背後的每位成員亦可各自選擇授權旅程。", prompts: [["為何建議這些卡？", "扣賬卡支援日常及多種貨幣開支；信用卡可提供還款彈性及團隊開支管理。"], ["哪些成員可以繼續？", "東主、董事、獲授權簽署人或主要員工均可各自選擇參與，毋須重新開始。"]] },
    ],
    SC: [
      { eyebrow: "首次接触", message: `你好，${name}。我会从第一个问题开始，引导你完成商业账户开立。你可以说话、输入或点选。`, prompts: [["你会怎样协助？", "我会按你的情况调整问题、协调检查，并解释每个下一步。"], ["可以暂停吗？", "可以。进度会清楚保留，回来时无需重新开始。"]] },
      { eyebrow: "你的业务", message: `谢谢你，${name}。告诉我你的业务性质，我会按真正需要设计旅程。`, prompts: [["为何要选业务类型？", "这有助只显示相关问题，避免不必要的资料要求。"], ["之后可以更改吗？", "可以，在建立账户前都可更新。"]] },
      { eyebrow: "自选资料方式", message: "你可连接合资格的已验证个人资料，或自行输入业主资料；之后我会协助匹配公司及董事。", prompts: [["需要个人账户吗？", "不需要。连接现有资料属自愿选项，也可全程自行输入。"], ["如何匹配公司？", "输入公司编号，或让此模拟演示准备官方记录匹配样本。"]] },
      { eyebrow: "智能文件处理", message: "拖入文件包后，我会分类文件、提取重点，并只标示真正需要注意的项目。", prompts: [["需要哪些文件？", "此演示包括公司注册、商业登记及所有权资料。"], ["文件会被储存吗？", "不会。此原型只读取文件名，不会上载或储存内容。"]] },
      { eyebrow: "按需加强验证", message: "大部分合资格个案可全程数字化完成；如仍有风险问题，我可即时连接验证专员。", prompts: [["视频验证是必须吗？", "不是。只会在需要额外确认或你选择预览时出现。"], ["需要重复资料吗？", "不需要。专员会收到已准备的背景，只集中处理例外问题。"]] },
      { eyebrow: "账户已准备", message: "你的演示账户号码已准备好，我可立即协助启用最需要的服务。", prompts: [["现在可以使用什么？", "商务网上理财会先启用，其他服务会按需要及检查进度解锁。"], ["账户号码安全吗？", "是。这是已遮蔽的虚构号码，演示不会收集个人资料。"]] },
      { eyebrow: "量身成长", message: "账户已启用。我把业务信号转化为卡片及服务建议；企业背后的每位成员也可各自选择授权旅程。", prompts: [["为何建议这些卡？", "借记卡支持日常及多种货币开支；信用卡可提供还款灵活性及团队开支管理。"], ["哪些成员可以继续？", "业主、董事、获授权签署人或主要员工均可各自选择参与，无需重新开始。"]] },
    ],
  };
  return guidance[language];
}

export default function DemoPage() {
  const [language, setLanguage] = useState<Language>("EN");
  const [brightMode, setBrightMode] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("web");
  const [step, setStep] = useState(0);
  const [preferredName, setPreferredName] = useState("");
  const [business, setBusiness] = useState("digital");
  const [consent, setConsent] = useState(false);
  const [profileLinked, setProfileLinked] = useState(false);
  const [profileMode, setProfileMode] = useState<"nfc" | "connect" | "manual" | "">("");
  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcScanned, setNfcScanned] = useState(false);
  const [manualOwnerName, setManualOwnerName] = useState("");
  const [manualOwnerRole, setManualOwnerRole] = useState("Director");
  const [manualIdType, setManualIdType] = useState("Hong Kong Identity Card");
  const [manualIdNumber, setManualIdNumber] = useState("");
  const [manualNationality, setManualNationality] = useState("");
  const [manualContact, setManualContact] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualDob, setManualDob] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companySources, setCompanySources] = useState<string[]>(["Company Registry"]);
  const [directorName, setDirectorName] = useState("");
  const [directorRole, setDirectorRole] = useState("Director");
  const [kycNarrative, setKycNarrative] = useState("");
  const [voiceListening, setVoiceListening] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoConnected, setVideoConnected] = useState(false);
  const [riskMode, setRiskMode] = useState<"low" | "high">("low");
  const [cameraMode, setCameraMode] = useState<"web" | "mobile" | "">("");
  const [checking, setChecking] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>(["Preferential Deposit Rate", "Credit Cards"]);
  const [personalPerson, setPersonalPerson] = useState("Business owner");
  const [personalProduct, setPersonalProduct] = useState("Premier");
  const [personalJourneyPrepared, setPersonalJourneyPrepared] = useState(false);
  const [companyApiConnected, setCompanyApiConnected] = useState(false);
  const [employeeApplicationsPrepared, setEmployeeApplicationsPrepared] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiConversationMessage[]>([]);
  const [aiExpanded, setAiExpanded] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const t = (en: string, tc: string, sc: string) => language === "TC" ? tc : language === "SC" ? sc : en;

  useEffect(() => {
    if (!checking) return;
    const timer = window.setTimeout(() => { setChecking(false); setStep(5); }, 1200);
    return () => window.clearTimeout(timer);
  }, [checking]);
  useEffect(() => {
    if (!videoOpen) { setVideoConnected(false); return; }
    const timer = window.setTimeout(() => setVideoConnected(true), 900);
    return () => window.clearTimeout(timer);
  }, [videoOpen]);
  useEffect(() => {
    setAiExpanded(window.matchMedia("(min-width: 1321px)").matches);
  }, []);
  useEffect(() => { setAiReply(""); window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const displayName = preferredName.trim() || t("there", "你", "你");
  const journey = journeys[language];
  const phases = journeyPhases[language];
  const activePhase = step <= 2 ? 0 : step <= 4 ? 1 : 2;
  const guide = getAiGuidance(displayName, language)[step];
  const aiAction = aiBankingActions[step];
  const selectedBusiness = businessTypes.find((item) => item.id === business) ?? businessTypes[1];
  const personalPeople = [{ key: "Business owner", label: t("Business owner", "企業東主", "企业业主") }, { key: "Director", label: t("Director", "董事", "董事") }, { key: "Authorised signatory", label: t("Authorised signatory", "獲授權簽署人", "获授权签署人") }, { key: "Employee network", label: t("Employees via company API", "透過公司 API 的員工", "通过公司 API 的员工") }];
  const personalPersonLabel = personalPeople.find((item) => item.key === personalPerson)?.label ?? personalPeople[0].label;
  const next = () => setStep((current) => Math.min(6, current + 1));
  const back = () => setStep((current) => Math.max(0, current - 1));
  const jumpToStep = (target: number) => {
    if (target >= 1 && !preferredName.trim()) setPreferredName("Jenny");
    if (target >= 2) setBusiness("trade");
    if (target >= 3) {
      setProfileMode("nfc");
      setNfcScanned(true);
      setConsent(true);
      if (!companyId.trim()) setCompanyId("C-88888888");
      if (!directorName.trim()) setDirectorName(preferredName.trim() || "Jenny");
      if (!kycNarrative.trim()) setKycNarrative(t("Shareholder savings and trading revenue. Purpose: receipts, supplier payments and FX.", "資金來自股東儲蓄及貿易收入。用途：收款、供應商付款及外匯。", "资金来自股东储蓄及贸易收入。用途：收款、供应商付款及外汇。"));
    }
    if (target >= 4 && documents.length === 0) setDocuments(sampleDocuments);
    if (target >= 5) { setRiskMode("low"); setChecking(false); }
    setStep(Math.max(0, Math.min(6, target)));
  };
  const reset = () => { setStep(0); setPreferredName(""); setBusiness("digital"); setConsent(false); setProfileLinked(false); setProfileMode(""); setNfcScanning(false); setNfcScanned(false); setManualOwnerName(""); setManualOwnerRole("Director"); setManualIdType("Hong Kong Identity Card"); setManualIdNumber(""); setManualNationality(""); setManualContact(""); setManualEmail(""); setManualDob(""); setCompanyId(""); setCompanySources(["Company Registry"]); setDirectorName(""); setDirectorRole("Director"); setKycNarrative(""); setVoiceListening(false); setDocuments([]); setVideoOpen(false); setRiskMode("low"); setCameraMode(""); setChecking(false); setAiReply(""); setAiInput(""); setAiMessages([]); setAiThinking(false); setUnlocked(["Preferential Deposit Rate", "Credit Cards"]); setPersonalPerson("Business owner"); setPersonalProduct("Premier"); setPersonalJourneyPrepared(false); setCompanyApiConnected(false); setEmployeeApplicationsPrepared(false); };
  const toggleService = (service: string) => setUnlocked((items) => items.includes(service) ? items : [...items, service]);
  const toggleCompanySource = (source: string) => setCompanySources((items) => items.includes(source) ? items.filter((item) => item !== source) : [...items, source]);
  const receiveDocuments = (names: string[]) => setDocuments(Array.from(new Set(names)).slice(0, 5));
  const personalProfileReady = profileMode === "nfc" ? nfcScanned : profileMode === "connect" ? profileLinked : profileMode === "manual" ? Boolean(manualOwnerName.trim() && manualIdNumber.trim() && manualNationality.trim() && manualContact.trim() && manualEmail.trim() && manualDob) : false;
  const companyProfileReady = Boolean(companySources.length && companyId.trim() && directorName.trim() && kycNarrative.trim());
  const prepareFictionalCompanyRecord = () => { setCompanyId("C-88888888"); setDirectorName(displayName); setDirectorRole("Director"); setKycNarrative(t("Shareholder savings and trading revenue. Expected annual turnover: HKD 8 million. Purpose: customer receipts, supplier payments, FX and trade finance.", "資金來自股東儲蓄及貿易收入。預計年營業額：港幣 800 萬元。用途：收取客戶款項、支付供應商、外匯及貿易融資。", "资金来自股东储蓄及贸易收入。预计年营业额：港币 800 万元。用途：收取客户款项、支付供应商、外汇及贸易融资。")); };
  const captureVoiceSample = () => { setVoiceListening(true); window.setTimeout(() => { setKycNarrative(t("Source of funds: shareholder savings and business revenue. Expected annual turnover: HKD 8 million. Purpose: trading receipts, supplier payments and working capital.", "資金來源：股東儲蓄及業務收入。預計年營業額：港幣 800 萬元。用途：貿易收款、支付供應商及營運資金。", "资金来源：股东储蓄及业务收入。预计年营业额：港币 800 万元。用途：贸易收款、支付供应商及营运资金。")); setVoiceListening(false); }, 850); };
  const scanNfcIdentity = () => { setNfcScanning(true); setNfcScanned(false); window.setTimeout(() => { setNfcScanning(false); setNfcScanned(true); }, 1100); };
  const selectDocuments = (event: ChangeEvent<HTMLInputElement>) => receiveDocuments(Array.from(event.target.files ?? []).map((file) => file.name));
  const dropDocuments = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragActive(false); receiveDocuments(Array.from(event.dataTransfer.files).map((file) => file.name)); };

  const answerPrompt = (label: string, answer: string) => {
    setAiReply(answer);
    const stamp = Date.now();
    setAiMessages((items) => [...items, { id: stamp, role: "user", text: label } as AiConversationMessage, { id: stamp + 1, role: "ai", text: answer } as AiConversationMessage].slice(-8));
  };

  const interpretAiInput = (raw: string) => {
    const query = raw.trim();
    const lower = query.toLowerCase();
    let response = "";
    let applied = "";

    if (/privacy|safe|secure|store|save|私隱|隐私|安全|儲存|储存/.test(lower)) {
      response = t("This capability demo keeps inputs only in this browser session. A production bank model would operate within approved data, security and human-review controls.", "此能力示範只在本次瀏覽器體驗中保留輸入。正式銀行模型會在核准的資料、安全及人工覆核管控下運作。", "此能力演示只在本次浏览器体验中保留输入。正式银行模型会在获批的数据、安全及人工复核管控下运行。");
    } else if (step === 0) {
      const businessMatch = [
        { id: "trade", pattern: /trade|trading|import|export|貿易|贸易|進出口|进出口/ },
        { id: "digital", pattern: /online|e-?commerce|digital|網店|网店|電商|电商/ },
        { id: "food", pattern: /food|restaurant|cafe|retail|餐飲|餐饮|零售/ },
        { id: "services", pattern: /consult|professional|agency|service|專業|专业|顧問|顾问/ },
        { id: "tech", pattern: /tech|software|platform|app|科技|軟件|软件|平台/ },
      ].find((item) => item.pattern.test(lower));
      const nameMatch = query.match(/(?:call me|my name is|叫我|我叫|稱呼我|称呼我)\s*[:：]?\s*([^,，。!?！？\d]{1,30})/i);
      const plainName = /^[a-z][a-z .'-]{0,29}$/i.test(query)
        && query.split(/\s+/).length <= 3
        && !/(run|business|company|trade|trading|online|shop|sell|work|need|want|open|account)/i.test(query);
      const candidate = (nameMatch?.[1] || (plainName ? query : "")).trim();
      if (businessMatch) {
        setBusiness(businessMatch.id);
        const selected = businessTypes.find((item) => item.id === businessMatch.id)!;
        response = t(`I’ve recognised ${selected.EN[0]} as your business context and carried it into the next step. First, what would you like me to call you?`, `我已識別「${selected.TC[0]}」為你的業務背景，並會帶到下一步。首先，我應該怎樣稱呼你？`, `我已识别“${selected.SC[0]}”为你的业务背景，并会带到下一步。首先，我应该怎样称呼你？`);
        applied = t(`${selected.EN[0]} noted for the business step`, `已記下${selected.TC[0]}作下一步使用`, `已记下${selected.SC[0]}作下一步使用`);
      } else if (candidate) {
        const safeName = candidate.replace(/\s+/g, " ").slice(0, 30);
        setPreferredName(safeName);
        response = t(`Nice to meet you, ${safeName}. I’ve filled your preferred name. You can edit it before continuing.`, `你好，${safeName}。我已填入你的慣用稱呼，你可在繼續前修改。`, `你好，${safeName}。我已填入你的惯用称呼，你可在继续前修改。`);
        applied = t("Preferred name filled", "已填入慣用稱呼", "已填入惯用称呼");
      } else {
        response = t("Tell me what you prefer to be called—for example, “Call me Jamie”—and I can fill it for you.", "告訴我你希望怎樣稱呼，例如「叫我 Jamie」，我便可代你填入。", "告诉我你希望怎样称呼，例如“叫我 Jamie”，我便可代你填入。");
      }
    } else if (step === 1) {
      const matches = [
        { id: "trade", pattern: /trade|trading|import|export|貿易|贸易|進出口|进出口/ },
        { id: "digital", pattern: /online|e-?commerce|digital|網店|网店|電商|电商|網上銷售|网上销售/ },
        { id: "food", pattern: /food|restaurant|cafe|retail|餐飲|餐饮|食肆|零售/ },
        { id: "services", pattern: /consult|professional|agency|service|專業|专业|顧問|顾问/ },
        { id: "tech", pattern: /tech|software|platform|app|科技|軟件|软件|平台/ },
        { id: "manufacturing", pattern: /manufactur|factory|production|製造|制造|工廠|工厂/ },
        { id: "health", pattern: /health|medical|wellness|clinic|醫療|医疗|健康/ },
        { id: "property", pattern: /property|real estate|地產|地产|房地產|房地产/ },
        { id: "retail", pattern: /retail|store|consumer goods|零售|店舖|门店/ },
        { id: "construction", pattern: /construction|contractor|engineering|建造|工程|承包/ },
        { id: "logistics", pattern: /logistics|transport|delivery|fulfilment|物流|運輸|运输|配送/ },
        { id: "investment", pattern: /investment holding|asset holding|投資控股|投资控股/ },
        { id: "education", pattern: /education|training|school|教育|培訓|培训/ },
        { id: "creative", pattern: /media|creative|content|production studio|媒體|媒体|創意|创意|內容|内容/ },
      ].find((item) => item.pattern.test(lower));
      if (matches) {
        setBusiness(matches.id);
        const selected = businessTypes.find((item) => item.id === matches.id)!;
        response = t(`I recognised this as ${selected.EN[0]}. I’ve selected it and will tailor the journey around that business model.`, `我識別為「${selected.TC[0]}」，並已代你選擇；之後會按這個業務模式調整旅程。`, `我识别为“${selected.SC[0]}”，并已代你选择；之后会按这个业务模式调整旅程。`);
        applied = t(`${selected.EN[0]} selected`, `已選擇${selected.TC[0]}`, `已选择${selected.SC[0]}`);
      } else {
        response = t("Describe what the company sells, who it serves and where it operates. I can recognise the closest sector and prepare the relevant path.", "請描述公司售賣甚麼、服務哪些客戶及營運地區，我可識別最接近的行業並準備相關路徑。", "请描述公司销售什么、服务哪些客户及运营地区，我可识别最接近的行业并准备相关路径。");
      }
    } else if (step === 2) {
      const companyMatch = query.match(/(?:company|corp|corpid|corp id|公司)(?:\s+id|\s+number|編號|编号)?\s*[:#-]?\s*([a-z0-9-]{5,})/i);
      const directorMatch = query.match(/(?:director|ceo|董事|行政總裁|行政总裁)\s*(?:is|:|是)?\s*([a-z][a-z .'-]{1,40})/i);
      const kycMatch = /source of funds|funds|turnover|wealth|purpose|capital|revenue|資金|资金|營業額|营业额|用途|財富|财富/.test(lower);
      if (/nfc|tap|scan id|identity card|拍卡|掃描證件|扫描证件|身份證|身份证/.test(lower)) {
        setProfileMode("nfc");
        response = t("I’ve opened the mobile NFC route. Tap the fictional ID to preview secure identity reading and automatic field preparation.", "我已開啟手機 NFC 路徑。拍一拍虛構身份證，即可預覽安全讀取身份及自動準備欄位。", "我已开启手机 NFC 路径。轻触虚构身份证，即可预览安全读取身份及自动准备字段。");
        applied = t("Mobile NFC route selected", "已選擇手機 NFC 路徑", "已选择手机 NFC 路径");
      } else if (/connect|existing|personal profile|連接|连接|現有個人|现有个人/.test(lower)) {
        setProfileMode("connect");
        response = t("I’ve selected the connected-profile route. You remain in control: review the eligible fields, then give permission before anything is reused.", "我已選擇連接個人資料路徑。你仍掌握決定權：先查看合資格欄位，再決定是否授權重用。", "我已选择连接个人资料路径。你仍掌握决定权：先查看合资格字段，再决定是否授权复用。");
        applied = t("Connected-profile route selected", "已選擇連接資料路徑", "已选择连接资料路径");
      } else if (/manual|myself|自行|手動|手动/.test(lower)) {
        setProfileMode("manual");
        response = t("I’ve opened the manual route. You can type each owner field yourself, and I’ll help explain what is needed.", "我已開啟自行輸入路徑。你可逐項填寫東主資料，我會解釋所需內容。", "我已开启自行输入路径。你可逐项填写业主资料，我会解释所需内容。");
        applied = t("Manual route selected", "已選擇自行輸入", "已选择自行输入");
      } else if (companyMatch || directorMatch || kycMatch) {
        if (companyMatch) setCompanyId(companyMatch[1].toUpperCase());
        if (directorMatch) setDirectorName(directorMatch[1].trim());
        if (kycMatch) setKycNarrative(query);
        response = t("I found company and KYC details in your message and prepared the matching fields. Please review them before authorising any record match.", "我在訊息中找到公司及 KYC 資料，並準備相應欄位。請在授權紀錄配對前先覆核。", "我在消息中找到公司及 KYC 资料，并准备相应字段。请在授权记录匹配前先复核。");
        applied = t("Company and KYC fields prepared", "公司及 KYC 欄位已準備", "公司及 KYC 字段已准备");
      } else {
        response = t("You can say “connect my personal profile”, “enter manually”, or provide a fictional Company ID and director name. I’ll prepare the right fields without bypassing consent.", "你可說「連接個人資料」、「自行輸入」，或提供虛構公司編號及董事姓名；我會準備相關欄位，但不會跳過授權。", "你可说“连接个人资料”、“自行输入”，或提供虚构公司编号及董事姓名；我会准备相关字段，但不会跳过授权。");
      }
    } else if (step === 3) {
      if (/sample|demo pack|load|示範|演示|樣本|样本/.test(lower)) {
        receiveDocuments(sampleDocuments);
        response = t("I’ve loaded a fictional KYC pack and classified company records, ownership, ID and selfie, and business-address evidence.", "我已載入虛構 KYC 文件套裝，並分類公司紀錄、擁有權、身份證及自拍照，以及營業地址證明。", "我已载入虚构 KYC 文件包，并分类公司记录、所有权、身份证及自拍照，以及营业地址证明。");
        applied = t("Fictional document pack loaded", "虛構文件套裝已載入", "虚构文件包已载入");
      } else {
        response = t("For this journey, prepare company registration, ownership, owner ID and selfie, and business-address evidence. You can drag the fictional pack here; this prototype reads filenames only.", "此旅程需準備公司註冊、擁有權、東主身份證及自拍照，以及營業地址證明。你可拖入虛構文件套裝；本原型只讀取檔案名稱。", "此旅程需准备公司注册、所有权、业主身份证及自拍照，以及营业地址证明。你可拖入虚构文件包；本原型只读取文件名。");
      }
    } else if (step === 4) {
      if (/low risk|green light|低風險|低风险/.test(lower)) {
        setRiskMode("low");
        setVideoOpen(false);
        setCameraMode("");
        response = t("I’ve selected the green-light digital path. No video is needed for this sample.", "我已選擇綠燈數碼流程；此樣本毋須視像驗證。", "我已选择绿灯数字流程；此样本无需视频验证。");
        applied = t("Low-risk digital path selected", "已選擇低風險數碼流程", "已选择低风险数字流程");
      } else if (/video|human|specialist|high risk|enhanced|edd|視像|视频|真人|專員|专员|較高風險|较高风险/.test(lower)) {
        setRiskMode("high");
        setVideoOpen(true);
        response = t("I’ve opened the selective video-verification preview. In a bank journey, the prepared context would follow so the specialist focuses only on the risk question.", "我已開啟按需視像驗證預覽。正式銀行旅程會附上已準備背景，讓專員只集中處理風險問題。", "我已开启按需视频验证预览。正式银行旅程会附上已准备背景，让专员只集中处理风险问题。");
        applied = t("Video-verification preview opened", "視像驗證預覽已開啟", "视频验证预览已开启");
      } else {
        response = t("The sample is eligible for the digital path. Video is optional here and would appear only when an additional assurance question needs human judgement.", "此樣本符合數碼流程；視像驗證在此屬可選，只會在額外確認問題需要真人判斷時出現。", "此样本符合数字流程；视频验证在此为可选，只会在额外确认问题需要人工判断时出现。");
      }
    } else if (step === 5) {
      response = t("The fictional account number is ready and masked as ***-******-838. The next step is to choose which services to activate first—without restarting the application.", "虛構賬戶號碼已準備，並遮蔽顯示為 ***-******-838。下一步可選擇先啟用哪些服務，毋須重新申請。", "虚构账户号码已准备，并遮蔽显示为 ***-******-838。下一步可选择先启用哪些服务，无需重新申请。");
    } else {
      if (/recommend|solutions|growth plan|建議|建议|方案/.test(lower)) {
        setUnlocked(["Preferential Deposit Rate", "Credit Cards", "FX", "Trade"]);
        response = t("AI Fit compared nine banking paths and prepared four for review: preferential deposits, Credit Cards, FX and Trade. Eligibility and activation stay with the customer.", "AI Fit 比較九個銀行服務方向，並準備四項供覆核：存款優惠、信用卡、外匯及貿易。資格及啟用決定仍由客戶掌握。", "AI Fit 比较九个银行服务方向，并准备四项供复核：存款优惠、信用卡、外汇及贸易。资格及启用决定仍由客户掌握。");
        applied = t("Four relevant solutions prepared", "已準備四項相關方案", "已准备四项相关方案");
      } else if (/debit|daily spend|multicurrency|扣賬|扣账|日常開支|日常开支/.test(lower)) {
        toggleService("Business Debit Cards");
        response = t("AI Fit has highlighted Business Debit Cards for daily and multicurrency spending.", "AI Fit 已就日常及多種貨幣開支標示商業扣賬卡。", "AI Fit 已就日常及多种货币开支标示商业借记卡。");
        applied = t("Business Debit Cards highlighted", "商業扣賬卡已標示", "商业借记卡已标示");
      } else if (/credit|team spend|mastercard|信用卡|團隊開支|团队开支/.test(lower)) {
        toggleService("Credit Cards");
        response = t("AI Fit has highlighted Credit Cards for purchase flexibility and team expense control.", "AI Fit 已就採購周轉及團隊開支管理標示信用卡。", "AI Fit 已就采购周转及团队开支管理标示信用卡。");
        applied = t("Credit Cards highlighted", "信用卡已標示", "信用卡已标示");
      } else if (/payment|liquidity|cash flow|支付|流動資金|流动资金|現金流|现金流/.test(lower)) {
        toggleService("Payments");
        response = t("I’ve prioritised Payments and Liquidity to support everyday cash flow. You can still review every recommendation before activation.", "我已優先加入支付及流動資金管理以支援日常現金流；啟用前你仍可覆核每項建議。", "我已优先加入支付及流动资金管理以支持日常现金流；启用前你仍可复核每项建议。");
        applied = t("Payments and Liquidity prioritised", "支付及流動資金管理已優先加入", "支付及流动资金管理已优先加入");
      } else if (/trade|cross-border|import|export|貿易|贸易|跨境|進出口|进出口/.test(lower)) {
        toggleService("Trade");
        response = t("I’ve highlighted Global Trade Solutions for cross-border activity and kept it visible in your growth plan.", "我已就跨境業務標示環球貿易方案，並保留於成長計劃中。", "我已就跨境业务标示环球贸易方案，并保留在成长计划中。");
        applied = t("Trade solution highlighted", "環球貿易方案已標示", "环球贸易方案已标示");
      } else {
        response = t("Tell me the business goal—daily spending, cash flow, financing, wealth or cross-border trade—and I’ll explain and prepare the most relevant fictional next step.", "告訴我業務目標，例如日常開支、現金流、融資、財富管理或跨境貿易，我會解釋並準備最相關的虛構下一步。", "告诉我业务目标，例如日常开支、现金流、融资、财富管理或跨境贸易，我会解释并准备最相关的虚构下一步。");
      }
    }

    return { response, applied };
  };

  const sendAiMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = aiInput.trim();
    if (!query || aiThinking) return;
    const stamp = Date.now();
    setAiMessages((items) => [...items, { id: stamp, role: "user", text: query } as AiConversationMessage].slice(-8));
    setAiInput("");
    setAiReply("");
    setAiThinking(true);
    window.setTimeout(() => {
      const result = interpretAiInput(query);
      setAiMessages((items) => [...items, { id: stamp + 1, role: "ai", text: result.response, applied: result.applied } as AiConversationMessage].slice(-8));
      setAiThinking(false);
    }, 420);
  };

  const runAiBankingAction = (query: string) => {
    if (aiThinking) return;
    const stamp = Date.now();
    setAiMessages((items) => [...items, { id: stamp, role: "user", text: query } as AiConversationMessage].slice(-8));
    setAiThinking(true);
    window.setTimeout(() => {
      const result = interpretAiInput(query);
      setAiMessages((items) => [...items, { id: stamp + 1, role: "ai", text: result.response, applied: result.applied } as AiConversationMessage].slice(-8));
      setAiThinking(false);
    }, 360);
  };

  return (
    <main className={`demoPage ${brightMode ? "brightMode" : ""}`}>
      <header className="demoHeader">
        <a className="brand nextGemWordmark" href={route("/")} aria-label="Back to Next GEM pitch"><img className="nextGemIcon" src={asset("/next-gem-icon.png")} alt="" /><span className="nextGemText"><b><span className="nextWord">Next</span><em>GEM</em></b><small>GREATER · EASIER · MORE</small></span></a>
        <div className="demoHeaderActions"><span>{t("AI demo · No data saved", "AI 示範 · 不儲存資料", "AI 演示 · 不储存资料")}</span><button className="modeToggle demoModeToggle" onClick={() => setBrightMode((value) => !value)} aria-label={`Switch to ${brightMode ? "dark" : "bright"} presentation mode`}><i>{brightMode ? "☾" : "☀"}</i><b>{brightMode ? "Dark" : "Bright"}</b></button><div className="languageSwitch" role="group" aria-label="Demo language">{(["EN", "TC", "SC"] as Language[]).map((item) => <button key={item} className={language === item ? "active" : ""} onClick={() => setLanguage(item)} aria-pressed={language === item}>{item}</button>)}</div><a href={route("/")}>{t("Pitch", "簡介", "简介")}</a></div>
      </header>

      <div className="demoShell">
        <aside className="demoRail">
          <div><p className="demoRailKicker">{t("WELCOME · THE 3-MINUTE JOURNEY", "歡迎 · 3 分鐘旅程", "欢迎 · 3 分钟旅程")}</p><h1>One Tap.<br />One Profile.<br /><em>One HSBC.</em></h1><p className="demoRelationshipLine">Spark <i>→</i> Trust <i>→</i> Grow</p></div>
          <ol className="phaseTimeline">{phases.map((phase, index) => <li key={phase.title} className={index === activePhase ? "current" : index < activePhase ? "complete" : ""}><i>{index < activePhase ? "✓" : index + 1}</i><span><b>{phase.title}</b><small>{phase.detail}</small></span></li>)}</ol>
          <div className="demoTrust"><span>♡</span><p><b>{t("You stay in control", "你一直掌握決定權", "你一直掌握决定权")}</b></p></div>
        </aside>

        <section className="demoStage" aria-live="polite">
          <div className="demoTopline"><span>{phases[activePhase].title.toUpperCase()} · {journey[step]}</span><div className="demoViewSwitch" role="group" aria-label={t("Demo channel", "示範渠道", "演示渠道")}><small>{t("Same progress", "同步進度", "同步进度")}</small><button className={deviceMode === "web" ? "active" : ""} onClick={() => setDeviceMode("web")} aria-pressed={deviceMode === "web"}>▣ {t("Web", "網頁", "网页")}</button><button className={deviceMode === "mobile" ? "active" : ""} onClick={() => setDeviceMode("mobile")} aria-pressed={deviceMode === "mobile"}>▯ {t("App", "手機 App", "手机 App")}</button></div><p>{t("3-minute journey", "3 分鐘旅程", "3 分钟旅程")}</p></div>
          <nav className="demoJumpBar" aria-label={t("Showcase scene selector", "示範場景選擇", "演示场景选择")}>
            <p><b>{t("SHOWCASE", "快速示範", "快速演示")}</b><span>{t("Jump to any scene", "直接切換任何環節", "直接切换任何环节")}</span></p>
            <div>{journey.map((label, index) => <button key={label} className={step === index ? "active" : ""} onClick={() => jumpToStep(index)} aria-current={step === index ? "step" : undefined}><i>{index + 1}</i>{label}</button>)}</div>
          </nav>
          <div className={`demoWorkspace ${deviceMode === "mobile" ? "mobileExperience" : ""}`}>
            <div className={`demoContent ${deviceMode === "mobile" ? "mobileAppCanvas" : "webCanvas"}`}>
              {deviceMode === "mobile" && <div className="mobileAppBar"><span>9:41</span><b>Next GEM</b><i>● ● ●</i></div>}

              {step === 0 && <div className="demoPanel welcomePanel">
                <div className="aiWelcomeHero"><span><VisualIcon name="sparkle" /></span><div><p>NEXT GEM AI</p><h3>{t("Start your business account journey.", "開始你的商業賬戶旅程。", "开始你的商业账户旅程。")}</h3></div></div>
                <p className="demoEyebrow">{t("YOUR JOURNEY", "你的旅程", "你的旅程")}</p><h2>{t("What should", "我們應該", "我们应该")}<br />{t("I call you?", "怎樣稱呼你？", "怎样称呼你？")}</h2><p className="demoIntro">{t("Preferred name for this demo only.", "只供本次示範使用的稱呼。", "仅供本次演示使用的称呼。")}</p>
                <label className="nameInput"><span>{t("PREFERRED NAME", "慣用稱呼", "惯用称呼")}</span><div><VisualIcon name="profile" /><input value={preferredName} onChange={(event) => setPreferredName(event.target.value.slice(0, 30))} placeholder={t("e.g. Jamie", "例如 Jamie", "例如 Jamie")} autoComplete="off" autoFocus /><i>{preferredName.length}/30</i></div></label>
                <div className="namePromise"><VisualIcon name="privacy" /><p><b>{t("Your choice, your control", "由你選擇，由你掌控", "由你选择，由你掌控")}</b>{t("Fictional demo. Nothing is saved.", "虛構示範，不會儲存資料。", "虚构演示，不会储存资料。")}</p></div>
                <div className="demoActions"><span /><button className="demoPrimary" onClick={next} disabled={!preferredName.trim()}>{t("Start with AI", "開始 AI 旅程", "开始 AI 旅程")} <b>→</b></button></div>
              </div>}

              {step === 1 && <div className="demoPanel businessSectorPanel">
                <p className="demoEyebrow">{t("HELLO", "你好", "你好")}，{displayName.toUpperCase()}</p><h2>{t("What kind of business", "你的公司屬於", "你的公司属于")}<br />{t("are you building?", "哪一種業務？", "哪一种业务？")}</h2><p className="demoIntro">{t("Tell me once. I’ll tailor the journey.", "只需告訴我一次，我會調整旅程。", "只需告诉我一次，我会调整旅程。")}</p>
                <section className="sectorSelector" aria-label={t("Choose a business sector", "選擇業務行業", "选择业务行业")}>
                  <div className="sectorSectionHead"><div><p>{t("HOT SECTORS", "熱門行業", "热门行业")}</p><h3>{t("Frequently showcased", "常用示範行業", "常用演示行业")}</h3></div><small>{t("Illustrative demo ranking", "示意排名，只供示範", "示意排名，仅供演示")}</small></div>
                  <div className="hotSectorGrid">{businessTypes.filter((item) => item.featured).map((item, index) => <button key={item.id} className={business === item.id ? "selected" : ""} onClick={() => setBusiness(item.id)} aria-pressed={business === item.id}><em>0{index + 1}</em><span><VisualIcon name={item.icon} /></span><b>{item[language][0]}</b><small>{item[language][1]}</small><i>✓</i></button>)}</div>
                  <div className="allSectorHead"><b>{t("MORE SECTORS", "更多行業", "更多行业")}</b><span>{t("Choose one—or describe it to AI", "選擇一項，或直接向 AI 描述", "选择一项，或直接向 AI 描述")}</span></div>
                  <div className="sectorCloud">{businessTypes.filter((item) => !item.featured).map((item) => <button key={item.id} className={business === item.id ? "selected" : ""} onClick={() => setBusiness(item.id)} aria-pressed={business === item.id}><VisualIcon name={item.icon} /><span>{item[language][0]}</span>{business === item.id && <i>✓</i>}</button>)}</div>
                </section>
                <div className="demoActions"><button className="demoBack" onClick={back}>← {t("Back", "返回", "返回")}</button><button className="demoPrimary" onClick={next}>{t("Continue", "繼續", "继续")} <b>→</b></button></div>
              </div>}

              {step === 2 && <div className="demoPanel">
                <p className="demoEyebrow">{t("ONE PROFILE", "ONE PROFILE", "ONE PROFILE")}</p><h2>{t("Your profile.", "你的資料。", "你的资料。")}<br /><em>{t("Your choice.", "由你選擇。", "由你选择。")}</em></h2><p className="demoIntro">{t("Tap, connect or enter.", "拍卡、連接或輸入。", "轻触、连接或输入。")}</p>

                <div className="profileChoices">
                  <button className={profileMode === "nfc" ? "selected nfcChoice" : "nfcChoice"} onClick={() => setProfileMode("nfc")}><i><VisualIcon name="profile" /></i><span><b>{t("Tap ID with mobile NFC", "使用手機 NFC 拍卡", "使用手机 NFC 轻触证件")}</b><small>{t("Scan and prefill personal information", "掃描並預填個人資料", "扫描并预填个人资料")}</small></span><em>{profileMode === "nfc" ? t("Selected ✓", "已選擇 ✓", "已选择 ✓") : t("Tap →", "拍卡 →", "轻触 →")}</em></button>
                  <button className={profileMode === "connect" ? "selected" : ""} onClick={() => setProfileMode("connect")}><i><VisualIcon name="link" /></i><span><b>{t("Connect personal information", "連接個人資料", "连接个人资料")}</b><small>{t("Reuse eligible verified details", "重用合資格已驗證資料", "复用合资格已验证资料")}</small></span><em>{profileMode === "connect" ? t("Selected ✓", "已選擇 ✓", "已选择 ✓") : t("Choose →", "選擇 →", "选择 →")}</em></button>
                  <button className={profileMode === "manual" ? "selected" : ""} onClick={() => setProfileMode("manual")}><i><VisualIcon name="document" /></i><span><b>{t("Enter information myself", "自行輸入資料", "自行输入资料")}</b><small>{t("No personal account required", "毋須個人賬戶", "无需个人账户")}</small></span><em>{profileMode === "manual" ? t("Selected ✓", "已選擇 ✓", "已选择 ✓") : t("Choose →", "選擇 →", "选择 →")}</em></button>
                </div>

                {profileMode === "nfc" && <div className={`nfcProfileRoute ${nfcScanning ? "scanning" : ""} ${nfcScanned ? "scanned" : ""}`}>
                  <div className="nfcPhone"><div className="nfcPhoneTop">9:41 <span>▮▮▮</span></div><div className="nfcReader"><i>)))</i><VisualIcon name="profile" /><b>{nfcScanning ? t("Reading ID securely…", "正在安全讀取身份證…", "正在安全读取身份证…") : nfcScanned ? t("Identity verified", "身份已驗證", "身份已验证") : t("Hold ID near the phone", "將身份證靠近手機", "将身份证靠近手机")}</b><small>{nfcScanned ? t("Personal details prepared", "個人資料已準備", "个人资料已准备") : t("NFC capability preview", "NFC 能力預覽", "NFC 能力预览")}</small></div></div>
                  <div className="nfcProfileCopy"><p>{t("ONE TAP · MOBILE NFC", "ONE TAP · 手機 NFC", "ONE TAP · 手机 NFC")}</p><h3>{t("Tap once. Type less.", "拍一下，少輸入。", "轻触一下，少输入。")}</h3><span>{t("The phone reads the ID chip, verifies authenticity and prepares eligible fields for your review.", "手機讀取證件晶片、驗證真偽，並準備合資格欄位供你覆核。", "手机读取证件芯片、验证真伪，并准备合资格字段供你复核。")}</span><button onClick={scanNfcIdentity} disabled={nfcScanning}>{nfcScanning ? t("Scanning…", "掃描中…", "扫描中…") : nfcScanned ? t("Scan complete ✓", "掃描完成 ✓", "扫描完成 ✓") : t("Start NFC scan", "開始 NFC 掃描", "开始 NFC 扫描")}</button></div>
                  {nfcScanned && <div className="nfcAutofill"><div><span>{t("Full name", "全名", "全名")}</span><b>{displayName}</b></div><div><span>{t("ID type & number", "證件類型及號碼", "证件类型及号码")}</span><b>{t("HKID", "香港身份證", "香港身份证")} · •••• 888</b></div><div><span>{t("Nationality", "國籍", "国籍")}</span><b>{t("Verified", "已驗證", "已验证")}</b></div><div><span>{t("Date of birth", "出生日期", "出生日期")}</span><b>•• / •• / 1990</b></div><strong>✓ {t("Autofilled for review", "已自動填寫，等候覆核", "已自动填写，等待复核")}</strong></div>}
                </div>}

                {profileMode === "connect" && <div className="profileRoute">
                  <div className={`profileBridge ${profileLinked ? "linked" : ""}`}><div className="bridgeProfile"><i><VisualIcon name="profile" /></i><span>{t("PERSONAL PROFILE", "個人資料", "个人资料")}<b>{displayName} · ***-******-888</b><small>{t("Existing verified relationship", "現有已驗證關係", "现有已验证关系")}</small></span></div><div className="bridgeAction"><span><VisualIcon name="link" /></span><b>{profileLinked ? t("Connected", "已連接", "已连接") : t("Your choice", "由你選擇", "由你选择")}</b></div><div className="bridgeProfile business"><i><VisualIcon name="banking" /></i><span>{t("BUSINESS APPLICATION", "商業申請", "商业申请")}<b>Next GEM Company Limited</b><small>{profileLinked ? t("Eligible details prepared", "合資格資料已準備", "合资格资料已准备") : t("Waiting for permission", "等待授權", "等待授权")}</small></span></div></div>
                  <div className="transferScope"><span>{t("Eligible to reuse", "可重用資料", "可复用资料")}</span>{[t("Full name", "全名", "全名"), t("ID type & number", "證件類型及號碼", "证件类型及号码"), t("Nationality", "國籍", "国籍"), t("Contact number", "聯絡電話", "联系电话"), t("Email", "電郵", "电邮"), t("Date of birth", "出生日期", "出生日期")].map((item) => <b key={item}>✓ {item}</b>)}<small>{t("No balances or transaction history", "不包括結餘或交易紀錄", "不包括余额或交易记录")}</small></div>
                  <div className="connectedProfileSummary"><p><span>{t("Full name", "全名", "全名")}</span><b>{displayName}</b></p><p><span>{t("ID type", "證件類型", "证件类型")}</span><b>{t("Hong Kong Identity Card", "香港身份證", "香港身份证")}</b></p><p><span>{t("ID number", "證件號碼", "证件号码")}</span><b>•••• 888</b></p><p><span>{t("Nationality", "國籍", "国籍")}</span><b>{t("Verified", "已驗證", "已验证")}</b></p><p><span>{t("Contact number", "聯絡電話", "联系电话")}</span><b>+852 •••• 8888</b></p><p><span>{t("Email address", "電郵地址", "电邮地址")}</span><b>a•••@example.com</b></p><p><span>{t("Date of birth", "出生日期", "出生日期")}</span><b>•• / •• / 1990</b></p></div>
                  <button className={`profileLinkButton confirmProfile ${profileLinked ? "connected confirmed" : ""}`} onClick={() => setProfileLinked((value) => !value)}><VisualIcon name={profileLinked ? "permission" : "link"} /><span><b>{profileLinked ? t("Confirmed", "已確認", "已确认") : t("Confirm verified personal profile", "確認已驗證個人資料", "确认已验证个人资料")}</b><small>{profileLinked ? t("Permission active · You can reverse it before continuing", "授權已生效 · 繼續前仍可撤回", "授权已生效 · 继续前仍可撤回") : t("Review the eligible fields, then confirm permission", "覆核合資格欄位，然後確認授權", "复核合资格字段，然后确认授权")}</small></span><em>{profileLinked ? t("CONFIRMED ✓", "已確認 ✓", "已确认 ✓") : t("Confirm →", "確認 →", "确认 →")}</em></button>
                </div>}

                {profileMode === "manual" && <div className="manualProfile profileRoute">
                  <div className="profileSectionHead"><span><VisualIcon name="profile" /></span><div><p>{t("OWNER INFORMATION", "東主資料", "业主资料")}</p><h3>{t("Enter the authorised person’s details", "輸入獲授權人士資料", "输入获授权人士资料")}</h3></div><b>{t("Manual route", "自行輸入", "自行输入")}</b></div>
                  <div className="profileFields personalDetailFields">
                    <label><span>{t("FULL NAME", "全名", "全名")}</span><input value={manualOwnerName} onChange={(event) => setManualOwnerName(event.target.value.slice(0, 50))} placeholder={t("Enter fictional name", "輸入虛構名稱", "输入虚构名称")} autoComplete="off" /></label>
                    <label><span>{t("RELATIONSHIP TO COMPANY", "與公司關係", "与公司关系")}</span><select value={manualOwnerRole} onChange={(event) => setManualOwnerRole(event.target.value)}><option>CEO</option><option>Director</option><option>Authorised signatory</option><option>Beneficial owner</option></select></label>
                    <label><span>{t("ID TYPE", "證件類型", "证件类型")}</span><select value={manualIdType} onChange={(event) => setManualIdType(event.target.value)}><option>Hong Kong Identity Card</option><option>Passport</option><option>Mainland Identity Card</option><option>Other government ID</option></select></label>
                    <label><span>{t("ID NUMBER", "證件號碼", "证件号码")}</span><input value={manualIdNumber} onChange={(event) => setManualIdNumber(event.target.value.slice(0, 24))} placeholder={t("Enter fictional ID number", "輸入虛構證件號碼", "输入虚构证件号码")} autoComplete="off" /></label>
                    <label><span>{t("NATIONALITY", "國籍", "国籍")}</span><input value={manualNationality} onChange={(event) => setManualNationality(event.target.value.slice(0, 40))} placeholder={t("Enter nationality", "輸入國籍", "输入国籍")} autoComplete="off" /></label>
                    <label><span>{t("CONTACT NUMBER", "聯絡電話", "联系电话")}</span><input type="tel" value={manualContact} onChange={(event) => setManualContact(event.target.value.slice(0, 24))} placeholder={t("Enter fictional number", "輸入虛構電話", "输入虚构电话")} autoComplete="off" /></label>
                    <label><span>{t("EMAIL ADDRESS", "電郵地址", "电邮地址")}</span><input type="email" value={manualEmail} onChange={(event) => setManualEmail(event.target.value.slice(0, 80))} placeholder="name@example.com" autoComplete="off" /></label>
                    <label><span>{t("DATE OF BIRTH", "出生日期", "出生日期")}</span><input type="date" value={manualDob} onChange={(event) => setManualDob(event.target.value)} autoComplete="off" /></label>
                  </div>
                  <div className="manualNotice"><VisualIcon name="privacy" /><p><b>{t("No personal account needed", "毋須個人賬戶", "无需个人账户")}</b>{t("The manually entered details follow the same verification and consent journey.", "自行輸入的資料會經過相同驗證及同意流程。", "自行输入的资料会经过相同验证及同意流程。")}</p></div>
                </div>}

                {profileMode && <div className="companyIdentity">
                  <div className="profileSectionHead"><span><VisualIcon name="banking" /></span><div><p>{t("BUSINESS PROFILE", "企業資料", "企业资料")}</p><h3>{t("Connect verified business data", "連接已驗證企業資料", "连接已验证企业资料")}</h3></div><b>{t("With permission", "經你授權", "经你授权")}</b></div>
                  <div className="officialSources selectableSources"><span>{t("CHOOSE SOURCE", "選擇資料來源", "选择数据来源")}</span>{["Company Registry", "iAM Smart", "CorpID"].map((source) => <button key={source} type="button" className={companySources.includes(source) ? "selected" : ""} onClick={() => toggleCompanySource(source)} aria-pressed={companySources.includes(source)}>{companySources.includes(source) ? "✓ " : "+ "}{source}</button>)}<small>{t("Customer authorised", "由客戶授權", "由客户授权")}</small></div>
                  <div className="profileFields companyFields"><label><span>{t("COMPANY ID", "公司編號", "公司编号")}</span><input value={companyId} onChange={(event) => setCompanyId(event.target.value.slice(0, 30))} placeholder={t("Enter Company ID", "輸入公司編號", "输入公司编号")} /></label><label><span>{t("CEO / DIRECTOR NAME", "行政總裁／董事姓名", "首席执行官／董事姓名")}</span><input value={directorName} onChange={(event) => setDirectorName(event.target.value.slice(0, 50))} placeholder={t("Enter fictional name", "輸入虛構名稱", "输入虚构名称")} /></label><label><span>{t("ROLE", "職位", "职位")}</span><select value={directorRole} onChange={(event) => setDirectorRole(event.target.value)}><option>CEO</option><option>Director</option><option>CEO & Director</option><option>Authorised signatory</option></select></label></div>
                  <div className="kycConversation"><div className="kycConversationHead"><span><VisualIcon name="sparkle" /></span><div><p>{t("BANKING INTELLIGENCE · KYC", "銀行智能 · KYC", "银行智能 · KYC")}</p><h3>{t("Tell us the business story", "說明你的業務背景", "说明你的业务背景")}</h3></div><button className={voiceListening ? "listening" : ""} onClick={captureVoiceSample} disabled={voiceListening} type="button">🎙 {voiceListening ? t("Listening…", "正在聆聽…", "正在聆听…") : t("Voice", "語音", "语音")}</button></div><textarea value={kycNarrative} onChange={(event) => setKycNarrative(event.target.value.slice(0, 500))} placeholder={t("Describe source of funds, expected wealth or turnover, and account purpose…", "說明資金來源、預期財富或營業額及開戶目的…", "说明资金来源、预期财富或营业额及开户目的…")} rows={4} /><div className="kycSignalChips"><span>{t("Source of funds", "資金來源", "资金来源")}</span><span>{t("Wealth / turnover", "財富／營業額", "财富／营业额")}</span><span>{t("Account purpose", "賬戶用途", "账户用途")}</span>{kycNarrative.trim() && <b>✓ {t("AI summary ready", "AI 摘要已準備", "AI 摘要已准备")}</b>}</div></div>
                  <button className="aiPrepareRecord" onClick={prepareFictionalCompanyRecord}><VisualIcon name="sparkle" /><span><b>{t("Ask AI to prepare a fictional company record", "請 AI 準備虛構公司紀錄", "请 AI 准备虚构公司记录")}</b><small>{t("Prefills a sample Company ID and director for this demo", "預填示範公司編號及董事", "预填演示公司编号及董事")}</small></span><em>{t("Prepare →", "準備 →", "准备 →")}</em></button>
                  {companyProfileReady && <div className="officialMatch"><VisualIcon name="permission" /><p><b>{t("Company identity ready to match", "公司身份已準備配對", "公司身份已准备匹配")}</b>{companyId} · {directorName} · {directorRole}</p><em>{t("Prepared ✓", "已準備 ✓", "已准备 ✓")}</em></div>}
                  <small className="governmentNote">{t("Demo only: no live connection to CorpID, iAM Smart or government systems.", "只供示範：並未連接 CorpID、iAM Smart 或政府系統。", "仅供演示：并未连接 CorpID、iAM Smart 或政府系统。")}</small>
                </div>}

                {personalProfileReady && companyProfileReady && <div className="consentCard profileConsent"><div className="consentIcon"><VisualIcon name="permission" /></div><div><h3>{t("Verify the prepared owner and company profile", "驗證已準備的東主及公司資料", "验证已准备的业主及公司资料")}</h3><p>{t("Allow this fictional journey to match the entered information with trusted official records.", "允許此虛構旅程把已輸入資料與可信官方紀錄配對。", "允许此虚构旅程把已输入资料与可信官方记录匹配。")}</p><button className={`consentToggle ${consent ? "on" : ""}`} onClick={() => setConsent((value) => !value)} role="switch" aria-checked={consent}><i /><span>{consent ? t("Permission given", "已授權", "已授权") : t("Give permission", "授權", "授权")}</span></button></div></div>}
                <div className="dataPreview"><span>{t("Application summary", "申請摘要", "申请摘要")}</span><div><p>{t("Business type", "業務類型", "业务类型")}<b>{selectedBusiness[language][0]}</b></p><p>{t("Company name", "公司名稱", "公司名称")}<b>Next GEM Company Limited</b></p><p>{t("Owner route", "東主資料方式", "业主资料方式")}<b>{profileMode === "nfc" ? t("Mobile NFC scan", "手機 NFC 掃描", "手机 NFC 扫描") : profileMode === "connect" ? t("Connected profile", "已連接資料", "已连接资料") : profileMode === "manual" ? t("Manual entry", "自行輸入", "自行输入") : t("Choose a route", "選擇方式", "选择方式")}</b></p></div><small>{t("Fictional information for demonstration only", "虛構資料，只供示範", "虚构资料，仅供演示")}</small></div>
                <div className="demoActions"><button className="demoBack" onClick={back}>← {t("Back", "返回", "返回")}</button><button className="demoPrimary" onClick={next} disabled={!consent || !personalProfileReady || !companyProfileReady}>{t("Continue with verified profile", "以已驗證資料繼續", "以已验证资料继续")} <b>→</b></button></div>
              </div>}

              {step === 3 && <div className="demoPanel documentPanel">
                <p className="demoEyebrow">{t("KYC DOCUMENT INTELLIGENCE", "KYC 智能文件處理", "KYC 智能文件处理")}</p><h2>{t("Bring the pack.", "上載文件。", "上载文件。")}<br /><em>{t("We’ll find the facts.", "由我們找出重點。", "由我们找出重点。")}</em></h2><p className="demoIntro">{t("Upload once. AI organises the documents, matches key fields and highlights only genuine gaps for review.", "只需上載一次；AI 會整理文件、配對重點，只標示真正需要覆核的缺口。", "只需上载一次；AI 会整理文件、匹配重点，只标示真正需要复核的缺口。")}</p>
                <div className="documentRequirementGrid" aria-label={t("Verification evidence", "驗證所需資料", "验证所需资料")}><span><VisualIcon name="banking" /><b>{t("Company records", "公司紀錄", "公司记录")}</b><small>{t("Registration & ownership", "登記及擁有權", "登记及所有权")}</small></span><span><VisualIcon name="identity" /><b>{t("ID & selfie", "證件及自拍照", "证件及自拍照")}</b><small>{t("Person and document match", "核對人士及證件", "核对人员及证件")}</small></span><span><VisualIcon name="document" /><b>{t("Business address", "營業地址", "营业地址")}</b><small>{t("Address evidence", "地址證明", "地址证明")}</small></span></div>
                <input ref={fileInput} className="fileInput" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={selectDocuments} />
                <div className={`documentDrop ${dragActive ? "dragging" : ""} ${documents.length ? "received" : ""}`} role="button" tabIndex={0} onClick={() => fileInput.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInput.current?.click(); }} onDragOver={(event) => { event.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={dropDocuments}><span><VisualIcon name="document" /></span><h3>{documents.length ? t("Document pack received", "已收到文件套裝", "已收到文件包") : t("Drag your document pack here", "把文件套裝拖到這裡", "把文件包拖到这里")}</h3><p>{t("PDF, JPG or PNG · Up to 5 files · Prototype reads filenames only", "PDF、JPG 或 PNG · 最多 5 個檔案 · 原型只讀取檔案名稱", "PDF、JPG 或 PNG · 最多 5 个文件 · 原型只读取文件名")}</p><button type="button">{t("Choose demo files", "選擇示範檔案", "选择演示文件")}</button></div>
                {!documents.length && <button className="samplePack" onClick={() => receiveDocuments(sampleDocuments)}><VisualIcon name="sparkle" /><span><b>{t("Use fictional sample document pack", "使用虛構文件套裝", "使用虚构文件包")}</b><small>{t("Best option for presenting this demo", "最適合現場示範", "最适合现场演示")}</small></span><em>{t("Load sample →", "載入樣本 →", "载入样本 →")}</em></button>}
                {documents.length > 0 && <div className="documentResults"><div className="docResultHead"><span>{t("AI VERIFICATION SUMMARY", "AI 驗證摘要", "AI 验证摘要")}</span><b>{documents.length} {t("files · Key fields matched", "個檔案 · 重點已配對", "个文件 · 重点已匹配")}</b></div>{documents.map((name) => <div className="docRow" key={name}><i><VisualIcon name={name.includes("Selfie") ? "identity" : "document"} /></i><span><b>{name}</b><small>{name.includes("Selfie") ? t("ID document and selfie matched", "證件與自拍照已配對", "证件与自拍照已匹配") : name.includes("Address") ? t("Business address evidence matched", "營業地址證明已配對", "营业地址证明已匹配") : name.includes("Ownership") ? t("Ownership details extracted", "已擷取擁有權資料", "已提取所有权资料") : t("Business details matched", "業務資料已配對", "业务资料已匹配")}</small></span><em>{t("Verified ✓", "已驗證 ✓", "已验证 ✓")}</em></div>)}<div className="docInsight"><VisualIcon name="insight" /><p><b>{t("Identity and business facts prepared", "身份及業務資料已準備", "身份及业务资料已准备")}</b>{t("Registration, ownership, ID and selfie match, and business address are ready for the next check.", "公司登記、擁有權、證件與自拍照配對及營業地址均已準備進入下一項檢查。", "公司登记、所有权、证件与自拍照匹配及营业地址均已准备进入下一项检查。")}</p></div></div>}
                <div className="safeUpload"><VisualIcon name="privacy" /><p><b>{t("Demonstration only", "只供示範", "仅供演示")}</b>{t("Do not upload real documents. File contents are not read, transmitted or stored by this prototype.", "請勿上載真實文件；原型不會讀取、傳送或儲存內容。", "请勿上载真实文件；原型不会读取、传送或储存内容。")}</p></div>
                <div className="demoActions"><button className="demoBack" onClick={back}>← {t("Back", "返回", "返回")}</button><button className="demoPrimary" onClick={next} disabled={documents.length < 2}>{t("Continue to verification", "繼續驗證", "继续验证")} <b>→</b></button></div>
              </div>}

              {step === 4 && <div className="demoPanel readinessPanel">
                <p className="demoEyebrow">{t("SELECTIVE ASSURANCE", "按需加強驗證", "按需加强验证")}</p><h2>{t("Digital by default.", "數碼流程優先。", "数字流程优先。")}<br /><em>{t("Human when it matters.", "需要時，由真人協助。", "需要时，由真人协助。")}</em></h2><p className="demoIntro">{t("AI checks evidence and routes exceptions.", "AI 檢查證據並分流例外情況。", "AI 检查证据并分流例外情况。")}</p>
                <div className="checkList"><div><i><VisualIcon name="identity" /></i><span><b>{t("Identity and selfie matched", "身份及自拍照已配對", "身份及自拍照已匹配")}</b><small>{profileMode === "connect" ? t("Verified profile and new selfie aligned", "已驗證資料與新自拍照一致", "已验证资料与新自拍照一致") : t("ID document and selfie evidence aligned", "證件與自拍照資料一致", "证件与自拍照资料一致")}</small></span><em>{t("Ready", "已準備", "已准备")}</em></div><div><i><VisualIcon name="document" /></i><span><b>{t("Business and address evidence matched", "業務及地址證明已配對", "业务及地址证明已匹配")}</b><small>{documents.length} {t("fictional files verified", "個虛構檔案已驗證", "个虚构文件已验证")}</small></span><em>{t("Ready", "已準備", "已准备")}</em></div><div><i><VisualIcon name="insight" /></i><span><b>{t("Initial risk indicators", "初步風險指標", "初步风险指标")}</b><small>{t("Relevant checks coordinated by AI", "AI 協調所需檢查", "AI 协调所需检查")}</small></span><em>{t("Ready", "已準備", "已准备")}</em></div></div>
                <div className="riskScenarioSwitch" role="group" aria-label={t("Risk scenario", "風險情境", "风险情景")}><button className={riskMode === "low" ? "active low" : ""} onClick={() => { setRiskMode("low"); setVideoOpen(false); setCameraMode(""); }}><i>✓</i><span><b>{t("Low-risk profile", "低風險資料", "低风险资料")}</b><small>{t("Green-light digital path", "綠燈數碼流程", "绿灯数字流程")}</small></span></button><button className={riskMode === "high" ? "active high" : ""} onClick={() => setRiskMode("high")}><i>!</i><span><b>{t("Higher-risk scenario", "較高風險情境", "较高风险情景")}</b><small>{t("Specialist assurance", "專員加強驗證", "专员加强验证")}</small></span></button></div>
                {riskMode === "low" && <div className="selectiveDecision"><span><VisualIcon name="permission" /></span><div><p>{t("GREEN LIGHT", "綠燈", "绿灯")}</p><h3>{t("Continue digitally—no video needed", "繼續數碼流程，毋須視像驗證", "继续数字流程，无需视频验证")}</h3><small>{t("Essential checks are complete for this sample profile.", "此示範資料已完成必要檢查。", "此演示资料已完成必要检查。")}</small></div><b>{t("Ready ✓", "已準備 ✓", "已准备 ✓")}</b></div>}
                {riskMode === "high" && !videoOpen && <button className="videoPreviewButton highRiskConnect" onClick={() => setVideoOpen(true)}><VisualIcon name="chat" /><span><b>{t("Connect a verification specialist", "連接驗證專員", "连接验证专员")}</b><small>{t("Prepared context follows—no repeated questions", "已準備背景會同步傳送，毋須重複回答", "已准备背景会同步传送，无需重复回答")}</small></span><em>{t("Connect now →", "立即連接 →", "立即连接 →")}</em></button>}
                {riskMode === "high" && videoOpen && <div className={`videoVerify ${videoConnected ? "connected" : ""}`}><div className="videoTop"><span><i /> {videoConnected ? t("SPECIALIST CONNECTED", "專員已連接", "专员已连接") : t("CONNECTING SECURELY…", "正在安全連接…", "正在安全连接…")}</span><b>{t("Additional assurance", "加強驗證", "加强验证")}</b></div><div className="cameraChoice"><b>{t("Choose your camera", "選擇鏡頭", "选择摄像头")}</b><button className={cameraMode === "web" ? "active" : ""} onClick={() => setCameraMode("web")}>▣ {t("Open web camera", "開啟網頁鏡頭", "开启网页摄像头")}</button><button className={cameraMode === "mobile" ? "active" : ""} onClick={() => { setCameraMode("mobile"); setDeviceMode("mobile"); }}>▯ {t("Use mobile app camera", "使用手機 App 鏡頭", "使用手机 App 摄像头")}</button></div><div className="videoGrid"><div className={`customerTile customerCamera ${cameraMode ? "cameraReady" : ""}`}><i>{cameraMode ? "●" : displayName.charAt(0).toUpperCase()}</i><span>{displayName}<small>{cameraMode === "mobile" ? t("Mobile camera connected", "手機鏡頭已連接", "手机摄像头已连接") : cameraMode === "web" ? t("Web camera ready", "網頁鏡頭已準備", "网页摄像头已准备") : t("Choose a camera above", "請在上方選擇鏡頭", "请在上方选择摄像头")}</small></span></div><div className="specialistTile specialistPhoto"><img src="/verification-specialist.png" alt={t("Customer service verification specialist", "客戶服務驗證專員", "客户服务验证专员")} /><p><b>{videoConnected ? t("Customer service specialist", "客戶服務專員", "客户服务专员") : t("Finding the right specialist", "正在尋找合適專員", "正在寻找合适专员")}</b>{videoConnected ? t("Context received · Ready to verify", "已收到背景 · 準備驗證", "已收到背景 · 准备验证") : t("Sharing prepared context…", "正在分享已準備背景…", "正在分享已准备背景…")}</p></div></div><div className="videoControls"><span>🎙 {t("Audio ready", "音訊已準備", "音频已准备")}</span><span>▣ {t("Secure video", "安全視像", "安全视频")}</span><button onClick={() => { setVideoOpen(false); setCameraMode(""); }}>{t("End demo call", "結束示範通話", "结束演示通话")}</button></div><small>{t("Capability simulation only. Camera access is not activated in this demo.", "只屬能力模擬；本示範不會啟動鏡頭。", "仅属能力模拟；本演示不会启动摄像头。")}</small></div>}
                <div className="demoActions"><button className="demoBack" onClick={back}>← {t("Back", "返回", "返回")}</button><button className="demoPrimary" onClick={() => setChecking(true)} disabled={checking}>{checking ? t("Completing secure checks…", "正在完成安全檢查…", "正在完成安全检查…") : t("Create demo account", "建立示範賬戶", "建立演示账户")} <b>{checking ? "···" : "→"}</b></button></div>
              </div>}

              {step === 5 && <div className="demoPanel accountPanel celebrationPanel"><div className="celebrationBurst" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="successPulse">✓</div><p className="demoEyebrow">{t("WELCOME TO NEXT GEM", "歡迎加入 NEXT GEM", "欢迎加入 NEXT GEM")}</p><h2>{t("Congratulations", "恭喜你", "恭喜你")}，{displayName}！<br /><em>{t("We’re ready to grow with you.", "我們已準備與你一起成長。", "我们已准备与你一起成长。")}</em></h2><p className="demoIntro relationshipWelcome">{t("Your account is ready. Our relationship starts here.", "你的賬戶已準備好，合作關係由此開始。", "你的账户已准备好，合作关系由此开始。")}</p><div className="accountCard"><div><span>NEXT GEM · {t("WELCOME", "歡迎", "欢迎")}</span><b>Next GEM Company Limited</b></div><p>{t("YOUR SECURED ACCOUNT", "你的安全賬戶", "你的安全账户")}</p><strong>***-******-838</strong><small>{t("Masked fictional account for demonstration", "已遮蔽虛構賬戶，只供示範", "已遮蔽虚构账户，仅供演示")}</small></div><section className="demoEvidence" aria-label={t("Prototype optimization evidence", "原型優化證據", "原型优化证据")}><div><p>{t("PROTOTYPE EVIDENCE", "原型證據", "原型证据")}</p><small>{t("Measured from this demo—not production results", "根據本示範計算，並非正式結果", "根据本演示计算，并非正式结果")}</small></div><article><b>7 → 3</b><span>{t("Scenes grouped into chapters", "場景整合為章節", "场景整合为章节")}</span></article><article><b>3</b><span>{t("Trusted business sources", "可信商業資料來源", "可信商业数据来源")}</span></article><article><b>5</b><span>{t("Evidence items classified", "已分類證據項目", "已分类证据项目")}</span></article><article><b>9</b><span>{t("Solutions scanned by AI Fit", "AI Fit 掃描方案", "AI Fit 扫描方案")}</span></article></section><div className="timeSaved relationshipMoment"><strong>♡</strong><span><b>{t("A new relationship begins", "一段新關係正式開始", "一段新关系正式开始")}</b>{t("Essentials ready. More support grows with you.", "基本服務就緒，更多支援與你共同成長。", "基本服务就绪，更多支持与你共同成长。")}</span><i>{t("Next: tailored solutions →", "下一步：度身方案 →", "下一步：量身方案 →")}</i></div><div className="demoActions"><button className="demoBack" onClick={back}>← {t("Review", "覆核", "复核")}</button><button className="demoPrimary celebrationCta" onClick={next}>{t("Explore my relationship", "探索我的合作旅程", "探索我的合作旅程")} <b>→</b></button></div></div>}

              {step === 6 && <div className="demoPanel dashboardPanel">
                <div className="dashboardHello"><div><p className="demoEyebrow">{t("GOOD MORNING", "早晨", "早上好")}，{displayName.toUpperCase()}</p><h2>{t("Your business,", "你的業務，", "你的业务，")}<br /><em>{t("ready to grow.", "準備成長。", "准备成长。")}</em></h2></div><button onClick={reset}>{t("Restart demo", "重新開始示範", "重新开始演示")} ↻</button></div>
                <div className="accountStatus"><div><span>{t("ACCOUNT STATUS", "賬戶狀態", "账户状态")}</span><b><i /> {t("Active · Essentials ready", "已啟用 · 基本功能就緒", "已启用 · 基本功能就绪")}</b></div><p>Next GEM Company Limited<small>***-******-838 · {t("Secured display", "安全顯示", "安全显示")}</small></p></div>
                <section className="aiRecommendations" aria-labelledby="ai-recommendations-title">
                  <div className="recommendationHead"><span><VisualIcon name="sparkle" /></span><div><p>{t("NEXT GEM AI FIT", "NEXT GEM AI FIT", "NEXT GEM AI FIT")}</p><h3 id="ai-recommendations-title">{t("Find the right solution for your next move", "為下一步找出合適方案", "为下一步找出合适方案")}</h3><small>{t("AI scans sector and operating signals. You choose what to activate.", "AI 分析行業及營運訊號，由你選擇啟用方案。", "AI 分析行业及运营信号，由你选择启用方案。")}</small></div></div>
                  <div className="recommendationSignals"><b>{t("AI SIGNALS", "AI 訊號", "AI 信号")}</b><span>{selectedBusiness[language][0]}</span><span>{t("Cash flow", "現金流", "现金流")}</span><span>{t("Multicurrency", "多種貨幣", "多种货币")}</span><span>{t("Growth potential", "增長潛力", "增长潜力")}</span></div>
                  <div className="demoAiFitUniverse">
                    <div className="demoAiFitLens"><img src={asset("/next-gem-icon.png")} alt="Next GEM AI Fit" /><small>AI FIT</small></div>
                    {solutions.map((item) => { const active = unlocked.includes(item.key); return <button key={item.key} className={active ? "active" : ""} onClick={() => toggleService(item.key)} aria-pressed={active}><i>{active ? "✓" : <VisualIcon name={item.icon} />}</i><b>{item[language][0]}</b><span>{active ? t("AI match", "AI 配對", "AI 匹配") : item[language][1]}</span></button>; })}
                  </div>
                  <div className="demoAiFitResult"><i><VisualIcon name="sparkle" /></i><p><span>{t("BEST MATCH", "最佳配對", "最佳匹配")}</span><b>{t("Credit Cards + preferential deposit rate", "信用卡＋存款優惠利率", "信用卡＋存款优惠利率")}</b></p><strong>{t("Ready to activate", "可隨時啟用", "可随时启用")} →</strong></div>
                  <p className="recommendationNote">{t("Illustrative AI Fit only. All products remain subject to eligibility and approval.", "AI Fit 只供示範，所有產品均須符合資格及批核。", "AI Fit 仅供演示，所有产品均须符合资格及审批。")}</p>
                </section>

                <section className="personalJourneyBridge" aria-labelledby="personal-journey-title">
                  <div className="personalBridgeHead"><span><VisualIcon name="people" /></span><div><p>{t("PEOPLE BEHIND THE BUSINESS", "企業背後的每一位", "企业背后的每一位")}</p><h3 id="personal-journey-title">{t("One company. A connected opportunity for everyone.", "一間企業，連接每位成員的新機會。", "一家企业，连接每位成员的新机会。")}</h3><small>{t("Invite individuals or connect the company’s people system by API. Every employee chooses whether to continue.", "可邀請個別成員，或透過 API 連接公司人事系統；每位員工均可自行決定是否繼續。", "可邀请个别成员，或通过 API 连接公司人事系统；每位员工均可自行决定是否继续。")}</small></div></div>
                  <div className={`companyApiCollaboration ${companyApiConnected ? "connected" : ""}`}><div className="apiSystem"><span><VisualIcon name="tech" /></span><p><b>{t("Company people API", "公司人事 API", "公司人事 API")}</b><small>{t("HR / payroll / employee portal", "人事／薪酬／員工平台", "人事／薪酬／员工平台")}</small></p></div><i>⇄</i><div className="apiSystem nextGem"><span><VisualIcon name="sparkle" /></span><p><b>Next GEM AI</b><small>{companyApiConnected ? t("128 eligible employee journeys found", "已找到 128 個合資格員工旅程", "已找到 128 个合资格员工旅程") : t("Permissioned prefill and invitations", "授權預填及邀請", "授权预填及邀请")}</small></p></div><button onClick={() => { const nextConnected = !companyApiConnected; setCompanyApiConnected(nextConnected); setEmployeeApplicationsPrepared(false); if (nextConnected) setPersonalPerson("Employee network"); }}>{companyApiConnected ? t("API connected ✓", "API 已連接 ✓", "API 已连接 ✓") : t("Connect API →", "連接 API →", "连接 API →")}</button></div>
                  <div className="personalJourneyFlow"><span><b>01</b>{t("Connect people", "連接成員", "连接成员")}</span><i>→</i><span><b>02</b>{t("AI prefill", "AI 預填", "AI 预填")}</span><i>→</i><span><b>03</b>{t("Invite & opt in", "邀請及自選參與", "邀请及自选参与")}</span></div>
                  <p className="personalChoiceLabel">{t("Who is continuing?", "哪位成員繼續？", "哪位成员继续？")}</p>
                  <div className="personalPeopleChoices" role="group" aria-label={t("People linked to the business", "與企業相關的成員", "与企业相关的成员")}>{personalPeople.map((item) => <button key={item.key} className={personalPerson === item.key ? "selected" : ""} onClick={() => { setPersonalPerson(item.key); setPersonalJourneyPrepared(false); }}>{item.label}<span>{personalPerson === item.key ? "✓" : "+"}</span></button>)}</div>
                  <p className="personalChoiceLabel interestLabel">{t("Choose an interest for this fictional journey", "選擇此虛構旅程的個人理財需要", "选择此虚构旅程的个人银行需求")}</p>
                  <div className="personalProductChoices four" role="group" aria-label={t("Personal banking interests", "個人理財選項", "个人银行选项")}>{["Premier", "Premier Elite", "Credit Cards", "MPF"].map((item) => <button key={item} className={personalProduct === item ? "selected" : ""} onClick={() => { setPersonalProduct(item); setPersonalJourneyPrepared(false); }}>{item}<span>{personalProduct === item ? "✓" : "+"}</span></button>)}</div>
                  <button className="preparePersonalJourney collaborativePrepare" onClick={() => { setPersonalJourneyPrepared(true); if (companyApiConnected && personalPerson === "Employee network") setEmployeeApplicationsPrepared(true); }}><VisualIcon name="sparkle" /><span><b>{personalJourneyPrepared ? t(`${personalPersonLabel} · ${personalProduct} prefill ready`, `${personalPersonLabel} · ${personalProduct} 預填已準備`, `${personalPersonLabel} · ${personalProduct} 预填已准备`) : t("Ask AI to prefill the straight-through journey", "請 AI 預填直通旅程", "请 AI 预填直通旅程")}</b><small>{employeeApplicationsPrepared ? t("128 private invitations prepared—each employee controls their own application.", "已準備 128 份私人邀請，每位員工自行掌握申請。", "已准备 128 份私人邀请，每位员工自行掌握申请。") : t("Eligible fields are prepared; the individual confirms before anything moves.", "合資格欄位已準備，資料移動前由個人確認。", "合资格字段已准备，资料移动前由个人确认。")}</small></span><em>{personalJourneyPrepared ? t("PREFILLED ✓", "已預填 ✓", "已预填 ✓") : t("Prepare →", "準備 →", "准备 →")}</em></button>
                </section>

                <div className="demoFinish"><span>♡</span><p><b>{t("One relationship. No restart.", "一段關係，毋須重來。", "一段关系，无需重来。")}</b>{t("Your profile, progress and permissions move with you—across business and personal needs.", "你的資料、進度及權限會一直跟隨你，連接企業及個人需要。", "你的资料、进度及权限会一直跟随你，连接企业及个人需求。")}</p><a href={route("/")}>{t("Return to pitch →", "返回簡介 →", "返回简介 →")}</a></div>
              </div>}
            </div>

            <aside className={`aiCompanion intelligentCompanion ${aiExpanded ? "open" : ""}`} aria-label="Next GEM AI conversation">
              <button className="aiCompanionHeader" onClick={() => setAiExpanded((value) => !value)} aria-expanded={aiExpanded}><span><VisualIcon name="sparkle" /></span><p><b>Next GEM AI</b><small>{t("Intelligent journey assistant · Online", "智能旅程助手 · 在線", "智能旅程助手 · 在线")}</small></p><em>{aiExpanded ? "−" : "+"}</em></button>
              <div className="aiCompanionBody">
                <div className="aiModelStatus"><i /><span><b>{t("BANKING AI", "銀行 AI", "银行 AI")}</b>{t("Explain · Check · Prepare", "解釋 · 檢查 · 準備", "解释 · 检查 · 准备")}</span></div>
                <p className="aiStageLabel">{guide.eyebrow}</p>
                <div className="aiConversationWindow" aria-live="polite">
                  <div className="aiBubble"><i>AI</i><p>{guide.message}</p></div>
                  {aiReply && !aiMessages.length && <div className="aiBubble followup"><i>AI</i><p>{aiReply}</p></div>}
                  {aiMessages.map((message) => <div key={message.id} className={`aiChatMessage ${message.role}`}><i>{message.role === "ai" ? "AI" : displayName.charAt(0).toUpperCase()}</i><p>{message.text}{message.applied && <small>✓ {message.applied}</small>}</p></div>)}
                  {aiThinking && <div className="aiChatMessage ai thinking"><i>AI</i><p><span /><span /><span /></p></div>}
                </div>
                <div className="aiBankingActions"><span>{t("SUGGESTED ACTION", "建議操作", "建议操作")}</span><button onClick={() => runAiBankingAction(aiAction[1])}><VisualIcon name="sparkle" />{t(aiAction[0], aiAction[0], aiAction[0])}<b>→</b></button></div>
                <form className="aiComposer" onSubmit={sendAiMessage}>
                  <label htmlFor="next-gem-ai-input">{t("Ask Next GEM AI", "向 Next GEM AI 提問", "向 Next GEM AI 提问")}</label>
                  <div><input id="next-gem-ai-input" value={aiInput} onChange={(event) => setAiInput(event.target.value.slice(0, 240))} placeholder={t("Type a banking goal…", "輸入銀行服務目標…", "输入银行服务目标…")} autoComplete="off" /><button type="submit" disabled={!aiInput.trim() || aiThinking} aria-label={t("Send to Next GEM AI", "傳送給 Next GEM AI", "发送给 Next GEM AI")}><VisualIcon name="sparkle" /><span>→</span></button></div>
                  <small>{t("Fictional demo · No live bank model", "虛構示範 · 未連接正式銀行模型", "虚构演示 · 未连接正式银行模型")}</small>
                </form>
                <div className="aiPrompts">{guide.prompts.slice(0, 1).map(([label, answer]) => <button key={label} onClick={() => answerPrompt(label, answer)}>{label} <span>→</span></button>)}</div>
                <div className="aiGuardrail"><VisualIcon name="privacy" /><span><b>{t("You decide. AI prepares.", "由你決定，AI 準備。", "由你决定，AI 准备。")}</b></span></div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
