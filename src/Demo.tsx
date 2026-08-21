import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { VisualIcon } from "./components/VisualIcon";

type Language = "EN" | "TC" | "SC";
type AiConversationMessage = { id: number; role: "user" | "ai"; text: string; applied?: string };

const businessTypes = [
  { id: "trade", icon: "trade", EN: ["Trading", "Import & export"], TC: ["貿易", "進出口業務"], SC: ["贸易", "进出口业务"] },
  { id: "digital", icon: "digital", EN: ["Digital commerce", "Online sales"], TC: ["數碼商貿", "網上銷售"], SC: ["数字商贸", "网上销售"] },
  { id: "food", icon: "food", EN: ["Food & beverage", "Restaurants & retail"], TC: ["餐飲", "食肆及零售"], SC: ["餐饮", "餐厅及零售"] },
  { id: "services", icon: "services", EN: ["Professional services", "Client-led work"], TC: ["專業服務", "客戶導向業務"], SC: ["专业服务", "客户导向业务"] },
  { id: "tech", icon: "tech", EN: ["Technology", "Software & platforms"], TC: ["科技", "軟件及平台"], SC: ["科技", "软件及平台"] },
  { id: "manufacturing", icon: "manufacturing", EN: ["Manufacturing", "Production & supply"], TC: ["製造業", "生產及供應"], SC: ["制造业", "生产及供应"] },
  { id: "health", icon: "health", EN: ["Healthcare", "Health & wellness"], TC: ["醫療健康", "健康及保健"], SC: ["医疗健康", "健康及保健"] },
  { id: "property", icon: "property", EN: ["Property", "Real estate services"], TC: ["地產", "房地產服務"], SC: ["地产", "房地产服务"] },
];

const solutions = [
  { key: "Business Internet Banking", icon: "banking", EN: ["Business Internet Banking", "Always connected"], TC: ["商務網上理財", "隨時連接"], SC: ["商务网上理财", "随时连接"] },
  { key: "Payments and Liquidity", icon: "payments", EN: ["Payments and Liquidity", "Recommended"], TC: ["支付及流動資金管理", "建議優先"], SC: ["支付及流动资金管理", "建议优先"] },
  { key: "Commercial Wealth", icon: "wealth", EN: ["Commercial Wealth", "Build resilience"], TC: ["商業財富管理", "增強韌性"], SC: ["商业财富管理", "增强韧性"] },
  { key: "Financing & Credit Cards", icon: "finance", EN: ["Financing & Credit Cards", "Fuel the next move"], TC: ["融資及信用卡", "推動下一步"], SC: ["融资及信用卡", "推动下一步"] },
  { key: "Global Trade Solutions", icon: "global", EN: ["Global Trade Solutions", "Grow across borders"], TC: ["環球貿易方案", "拓展跨境業務"], SC: ["环球贸易方案", "拓展跨境业务"] },
];

const sampleDocuments = ["Certificate-of-Incorporation.pdf", "Business-Registration.pdf", "Ownership-Structure.pdf", "Owner-ID-and-Selfie.jpg", "Business-Address-Proof.pdf"];
const journeys = {
  EN: ["Welcome", "Business", "Profile", "Documents", "Verification", "Account", "Grow"],
  TC: ["歡迎", "業務", "資料", "文件", "驗證", "賬戶", "成長"],
  SC: ["欢迎", "业务", "资料", "文件", "验证", "账户", "成长"],
};

function getAiGuidance(name: string, language: Language) {
  const guidance = {
    EN: [
      { eyebrow: "FIRST TOUCH", message: `Hello ${name}. I’ll guide you from first question to an active business account. You can speak, type or tap.`, prompts: [["What will you do?", "I’ll personalise the questions, coordinate checks and explain every next step."], ["Can I pause?", "Yes. Your progress stays visible so you can continue without starting again."]] },
      { eyebrow: "YOUR BUSINESS", message: `Thanks, ${name}. Tell me what your business does and I’ll shape the journey around what matters to you.`, prompts: [["Why business type?", "It helps tailor the information requested and avoids irrelevant questions."], ["Can I change it?", "Yes. You can update your selection before the account is created."]] },
      { eyebrow: "PROFILE YOUR WAY", message: "Connect eligible verified personal details, or enter the owner information yourself. Then I’ll help map the company and directors.", prompts: [["Do I need a personal account?", "No. Connecting an existing profile is optional; manual entry is always available."], ["How is the company matched?", "Enter a Company ID, or let this fictional demo prepare a sample official record match."]] },
      { eyebrow: "DOCUMENT INTELLIGENCE", message: "Drop in a document pack and I’ll classify the files, extract key fields and highlight only what needs attention.", prompts: [["Which documents?", "For this sample: incorporation, business registration and ownership information."], ["Are files stored?", "No. This prototype reads filenames only and does not upload or store file contents."]] },
      { eyebrow: "SELECTIVE ASSURANCE", message: "Most eligible cases move forward digitally. If a risk question remains, I can connect you instantly with a verification specialist.", prompts: [["Is video mandatory?", "No. It appears only when additional assurance is needed or when you choose to preview it."], ["Will I repeat details?", "No. The specialist receives the prepared context so the conversation can focus on the exception."]] },
      { eyebrow: "ACCOUNT READY", message: "Your demo account number is ready. I can now help activate the services you need first.", prompts: [["What can I use now?", "Business Internet Banking is ready first. Other services unlock as needs and checks progress."], ["Is the number secure?", "Yes. This is a masked, fictional number and the demo does not collect personal data."]] },
      { eyebrow: "TAILORED GROWTH", message: "Your account is active. I’ve turned the business signals you shared into card and service suggestions—and each person behind the business can choose their own permissioned journey.", prompts: [["Why these cards?", "The debit card supports daily and multicurrency spending; the credit card can add repayment flexibility and team expense control."], ["Who can continue personally?", "An owner, director, authorised signatory or key employee can each opt in separately without restarting their story."]] },
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
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
  const [language, setLanguage] = useState<Language>("EN");
  const [step, setStep] = useState(0);
  const [preferredName, setPreferredName] = useState("");
  const [business, setBusiness] = useState("digital");
  const [consent, setConsent] = useState(false);
  const [profileLinked, setProfileLinked] = useState(false);
  const [profileMode, setProfileMode] = useState<"connect" | "manual" | "">("");
  const [manualOwnerName, setManualOwnerName] = useState("");
  const [manualOwnerRole, setManualOwnerRole] = useState("Director");
  const [manualIdType, setManualIdType] = useState("Hong Kong Identity Card");
  const [manualIdNumber, setManualIdNumber] = useState("");
  const [manualNationality, setManualNationality] = useState("");
  const [manualContact, setManualContact] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualDob, setManualDob] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [directorRole, setDirectorRole] = useState("Director");
  const [documents, setDocuments] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoConnected, setVideoConnected] = useState(false);
  const [checking, setChecking] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>(["Business Internet Banking"]);
  const [selectedBusinessCards, setSelectedBusinessCards] = useState<string[]>([]);
  const [personalPerson, setPersonalPerson] = useState("Business owner");
  const [personalProduct, setPersonalProduct] = useState("Premier");
  const [personalJourneyPrepared, setPersonalJourneyPrepared] = useState(false);
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
  const guide = getAiGuidance(displayName, language)[step];
  const selectedBusiness = businessTypes.find((item) => item.id === business) ?? businessTypes[1];
  const personalPeople = [{ key: "Business owner", label: t("Business owner", "企業東主", "企业业主") }, { key: "Director", label: t("Director", "董事", "董事") }, { key: "Authorised signatory", label: t("Authorised signatory", "獲授權簽署人", "获授权签署人") }, { key: "Key employee", label: t("Key employee", "主要員工", "主要员工") }];
  const personalPersonLabel = personalPeople.find((item) => item.key === personalPerson)?.label ?? personalPeople[0].label;
  const next = () => setStep((current) => Math.min(6, current + 1));
  const back = () => setStep((current) => Math.max(0, current - 1));
  const reset = () => { setStep(0); setPreferredName(""); setBusiness("digital"); setConsent(false); setProfileLinked(false); setProfileMode(""); setManualOwnerName(""); setManualOwnerRole("Director"); setManualIdType("Hong Kong Identity Card"); setManualIdNumber(""); setManualNationality(""); setManualContact(""); setManualEmail(""); setManualDob(""); setCompanyId(""); setDirectorName(""); setDirectorRole("Director"); setDocuments([]); setVideoOpen(false); setChecking(false); setAiReply(""); setAiInput(""); setAiMessages([]); setAiThinking(false); setUnlocked(["Business Internet Banking"]); setSelectedBusinessCards([]); setPersonalPerson("Business owner"); setPersonalProduct("Premier"); setPersonalJourneyPrepared(false); };
  const toggleService = (service: string) => setUnlocked((items) => items.includes(service) ? items : [...items, service]);
  const toggleBusinessCard = (card: string) => setSelectedBusinessCards((items) => items.includes(card) ? items.filter((item) => item !== card) : [...items, card]);
  const receiveDocuments = (names: string[]) => setDocuments(Array.from(new Set(names)).slice(0, 5));
  const personalProfileReady = profileMode === "connect" ? profileLinked : profileMode === "manual" ? Boolean(manualOwnerName.trim() && manualIdNumber.trim() && manualNationality.trim() && manualContact.trim() && manualEmail.trim() && manualDob) : false;
  const companyProfileReady = Boolean(companyId.trim() && directorName.trim());
  const prepareFictionalCompanyRecord = () => { setCompanyId("C-88888888"); setDirectorName(displayName); setDirectorRole("Director"); };
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
      if (/connect|existing|personal profile|連接|连接|現有個人|现有个人/.test(lower)) {
        setProfileMode("connect");
        response = t("I’ve selected the connected-profile route. You remain in control: review the eligible fields, then give permission before anything is reused.", "我已選擇連接個人資料路徑。你仍掌握決定權：先查看合資格欄位，再決定是否授權重用。", "我已选择连接个人资料路径。你仍掌握决定权：先查看合资格字段，再决定是否授权复用。");
        applied = t("Connected-profile route selected", "已選擇連接資料路徑", "已选择连接资料路径");
      } else if (/manual|myself|自行|手動|手动/.test(lower)) {
        setProfileMode("manual");
        response = t("I’ve opened the manual route. You can type each owner field yourself, and I’ll help explain what is needed.", "我已開啟自行輸入路徑。你可逐項填寫東主資料，我會解釋所需內容。", "我已开启自行输入路径。你可逐项填写业主资料，我会解释所需内容。");
        applied = t("Manual route selected", "已選擇自行輸入", "已选择自行输入");
      } else if (companyMatch || directorMatch) {
        if (companyMatch) setCompanyId(companyMatch[1].toUpperCase());
        if (directorMatch) setDirectorName(directorMatch[1].trim());
        response = t("I found company-profile details in your message and filled the matching fields. Please review them before authorising any record match.", "我在訊息中找到公司資料並填入相應欄位。請在授權紀錄配對前先覆核。", "我在消息中找到公司资料并填入相应字段。请在授权记录匹配前先复核。");
        applied = t("Company fields prepared", "公司欄位已準備", "公司字段已准备");
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
      if (/video|human|specialist|視像|视频|真人|專員|专员/.test(lower)) {
        setVideoOpen(true);
        response = t("I’ve opened the selective video-verification preview. In a bank journey, the prepared context would follow so the specialist focuses only on the risk question.", "我已開啟按需視像驗證預覽。正式銀行旅程會附上已準備背景，讓專員只集中處理風險問題。", "我已开启按需视频验证预览。正式银行旅程会附上已准备背景，让专员只集中处理风险问题。");
        applied = t("Video-verification preview opened", "視像驗證預覽已開啟", "视频验证预览已开启");
      } else {
        response = t("The sample is eligible for the digital path. Video is optional here and would appear only when an additional assurance question needs human judgement.", "此樣本符合數碼流程；視像驗證在此屬可選，只會在額外確認問題需要真人判斷時出現。", "此样本符合数字流程；视频验证在此为可选，只会在额外确认问题需要人工判断时出现。");
      }
    } else if (step === 5) {
      response = t("The fictional account number is ready and masked as ***-******-838. The next step is to choose which services to activate first—without restarting the application.", "虛構賬戶號碼已準備，並遮蔽顯示為 ***-******-838。下一步可選擇先啟用哪些服務，毋須重新申請。", "虚构账户号码已准备，并遮蔽显示为 ***-******-838。下一步可选择先启用哪些服务，无需重新申请。");
    } else {
      if (/debit|daily spend|multicurrency|扣賬|扣账|日常開支|日常开支/.test(lower)) {
        setSelectedBusinessCards((items) => items.includes("Business Debit Mastercard") ? items : [...items, "Business Debit Mastercard"]);
        response = t("Business Debit Mastercard fits daily and multicurrency spending. I’ve added it to the fictional plan for review.", "Business Debit Mastercard 適合日常及多種貨幣開支，我已加入虛構方案供你覆核。", "Business Debit Mastercard 适合日常及多种货币开支，我已加入虚构方案供你复核。");
        applied = t("Debit card added to plan", "扣賬卡已加入方案", "借记卡已加入方案");
      } else if (/credit|team spend|mastercard|信用卡|團隊開支|团队开支/.test(lower)) {
        setSelectedBusinessCards((items) => items.includes("Business Mastercard") ? items : [...items, "Business Mastercard"]);
        response = t("Business Mastercard can support purchase flexibility and team expense control. I’ve added it to the fictional plan for review.", "Business Mastercard 可支援採購周轉及團隊開支管理，我已加入虛構方案供你覆核。", "Business Mastercard 可支持采购周转及团队开支管理，我已加入虚构方案供你复核。");
        applied = t("Credit card added to plan", "信用卡已加入方案", "信用卡已加入方案");
      } else if (/payment|liquidity|cash flow|支付|流動資金|流动资金|現金流|现金流/.test(lower)) {
        toggleService("Payments and Liquidity");
        response = t("I’ve prioritised Payments and Liquidity to support everyday cash flow. You can still review every recommendation before activation.", "我已優先加入支付及流動資金管理以支援日常現金流；啟用前你仍可覆核每項建議。", "我已优先加入支付及流动资金管理以支持日常现金流；启用前你仍可复核每项建议。");
        applied = t("Payments and Liquidity prioritised", "支付及流動資金管理已優先加入", "支付及流动资金管理已优先加入");
      } else if (/trade|cross-border|import|export|貿易|贸易|跨境|進出口|进出口/.test(lower)) {
        toggleService("Global Trade Solutions");
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

  return (
    <main className="demoPage">
      <header className="demoHeader">
        <a className="brand nextGemWordmark" href="#/" aria-label="Back to Next GEM pitch"><img className="nextGemIcon" src={asset("next-gem-icon.png")} alt="" /><span className="nextGemText"><b><span className="nextWord">Next</span><em>GEM</em></b><small>GREATER · EASIER · MORE</small></span></a>
        <div className="demoHeaderActions"><span>{t("AI-guided fictional scenario · No data collected", "AI 引導虛構示範 · 不收集資料", "AI 引导虚构演示 · 不收集资料")}</span><div className="languageSwitch" role="group" aria-label="Demo language">{(["EN", "TC", "SC"] as Language[]).map((item) => <button key={item} className={language === item ? "active" : ""} onClick={() => setLanguage(item)} aria-pressed={language === item}>{item}</button>)}</div><a href="#/">{t("Back to pitch", "返回簡介", "返回简介")}</a></div>
      </header>

      <div className="demoShell">
        <aside className="demoRail">
          <div><p className="demoRailKicker">{t("ONE GUIDED JOURNEY", "一段引導旅程", "一段引导旅程")}</p><h1>{t("One conversation.", "一次對話。", "一次对话。")}<br /><em>{t("Built around you.", "一切以你為中心。", "一切以你为中心。")}</em></h1><p>{t("Experience future account opening where intelligence coordinates every next step.", "體驗由智能協調每個下一步的未來商業開戶旅程。", "体验由智能协调每个下一步的未来商业开户旅程。")}</p></div>
          <ol>{journey.map((label, index) => <li key={label} className={index === step ? "current" : index < step ? "complete" : ""}><i>{index < step ? "✓" : index + 1}</i><span>{label}</span></li>)}</ol>
          <div className="demoTrust"><span>♡</span><p><b>{t("You stay in control", "你一直掌握決定權", "你一直掌握决定权")}</b>{t("Every request explains what it enables.", "每項要求都會說明可啟用甚麼。", "每项要求都会说明可启用什么。")}</p></div>
        </aside>

        <section className="demoStage" aria-live="polite">
          <div className="demoTopline"><span>NEXT GEM AI · {t("DEMO MODE", "示範模式", "演示模式")}</span><p>{t("Step", "步驟", "步骤")} {step + 1} / {journey.length}</p></div>
          <div className="demoWorkspace">
            <div className="demoContent">

              {step === 0 && <div className="demoPanel welcomePanel">
                <div className="aiWelcomeHero"><span><VisualIcon name="sparkle" /></span><div><p>NEXT GEM AI</p><h3>{t("Welcome. Let’s open your business account—together.", "歡迎。讓我們一起開立你的商業賬戶。", "欢迎。让我们一起开立你的商业账户。")}</h3><div className="welcomeDialogue"><i>AI</i><b>{t("I’ll guide the questions, coordinate the checks and explain every next step.", "我會引導問題、協調檢查，並解釋每個下一步。", "我会引导问题、协调检查，并解释每个下一步。")}</b></div></div></div>
                <p className="demoEyebrow">{t("MAKE IT YOUR JOURNEY", "建立你的旅程", "建立你的旅程")}</p><h2>{t("How would you like", "你希望我們", "你希望我们")}<br />{t("me to address you?", "怎樣稱呼你？", "怎样称呼你？")}</h2><p className="demoIntro">{t("Enter a preferred name for this fictional experience. It stays only in this demo session.", "請輸入示範用稱呼；資料只保留於本次體驗。", "请输入演示用称呼；资料只保留于本次体验。")}</p>
                <label className="nameInput"><span>{t("PREFERRED NAME", "慣用稱呼", "惯用称呼")}</span><div><VisualIcon name="profile" /><input value={preferredName} onChange={(event) => setPreferredName(event.target.value.slice(0, 30))} placeholder={t("e.g. Jamie", "例如 Jamie", "例如 Jamie")} autoComplete="off" autoFocus /><i>{preferredName.length}/30</i></div></label>
                <div className="namePromise"><VisualIcon name="privacy" /><p><b>{t("Your choice, your control", "由你選擇，由你掌控", "由你选择，由你掌控")}</b>{t("No default name. No account lookup. No information is saved.", "不預設名稱、不查詢賬戶、不儲存資料。", "不预设名称、不查询账户、不储存资料。")}</p></div>
                <div className="demoActions"><span /><button className="demoPrimary" onClick={next} disabled={!preferredName.trim()}>{t("Start with AI", "開始 AI 旅程", "开始 AI 旅程")} <b>→</b></button></div>
              </div>}

              {step === 1 && <div className="demoPanel">
                <p className="demoEyebrow">{t("HELLO", "你好", "你好")}，{displayName.toUpperCase()}</p><h2>{t("What kind of business", "你的公司屬於", "你的公司属于")}<br />{t("are you building?", "哪一種業務？", "哪一种业务？")}</h2><p className="demoIntro">{t("Tell me once. I’ll personalise the journey and show only the actions that matter.", "只需告訴我一次；我會個人化旅程，只顯示真正相關的行動。", "只需告诉我一次；我会个性化旅程，只显示真正相关的行动。")}</p>
                <div className="businessGrid expanded">{businessTypes.map((item) => <button key={item.id} className={business === item.id ? "selected" : ""} onClick={() => setBusiness(item.id)} aria-pressed={business === item.id}><span><VisualIcon name={item.icon} /></span><b>{item[language][0]}</b><small>{item[language][1]}</small><i>✓</i></button>)}</div>
                <div className="demoActions"><button className="demoBack" onClick={back}>← {t("Back", "返回", "返回")}</button><button className="demoPrimary" onClick={next}>{t("Continue", "繼續", "继续")} <b>→</b></button></div>
              </div>}

              {step === 2 && <div className="demoPanel">
                <p className="demoEyebrow">{t("PROFILE YOUR WAY", "自選資料方式", "自选资料方式")}</p><h2>{t("Connect trusted information.", "連接已驗證資料。", "连接已验证资料。")}<br /><em>{t("Or enter it yourself.", "或自行輸入。", "或自行输入。")}</em></h2><p className="demoIntro">{t("An existing personal relationship can save time, but it is never required. Choose the route that works for you.", "現有個人資料可節省時間，但並非必要；請選擇最適合你的方式。", "现有个人资料可节省时间，但并非必要；请选择最适合你的方式。")}</p>

                <div className="profileChoices">
                  <button className={profileMode === "connect" ? "selected" : ""} onClick={() => setProfileMode("connect")}><i><VisualIcon name="link" /></i><span><b>{t("Connect personal information", "連接個人資料", "连接个人资料")}</b><small>{t("Reuse eligible verified details", "重用合資格已驗證資料", "复用合资格已验证资料")}</small></span><em>{profileMode === "connect" ? t("Selected ✓", "已選擇 ✓", "已选择 ✓") : t("Choose →", "選擇 →", "选择 →")}</em></button>
                  <button className={profileMode === "manual" ? "selected" : ""} onClick={() => setProfileMode("manual")}><i><VisualIcon name="document" /></i><span><b>{t("Enter information myself", "自行輸入資料", "自行输入资料")}</b><small>{t("No personal account required", "毋須個人賬戶", "无需个人账户")}</small></span><em>{profileMode === "manual" ? t("Selected ✓", "已選擇 ✓", "已选择 ✓") : t("Choose →", "選擇 →", "选择 →")}</em></button>
                </div>

                {profileMode === "connect" && <div className="profileRoute">
                  <div className={`profileBridge ${profileLinked ? "linked" : ""}`}><div className="bridgeProfile"><i><VisualIcon name="profile" /></i><span>{t("PERSONAL PROFILE", "個人資料", "个人资料")}<b>{displayName} · ***-******-888</b><small>{t("Existing verified relationship", "現有已驗證關係", "现有已验证关系")}</small></span></div><div className="bridgeAction"><span><VisualIcon name="link" /></span><b>{profileLinked ? t("Connected", "已連接", "已连接") : t("Your choice", "由你選擇", "由你选择")}</b></div><div className="bridgeProfile business"><i><VisualIcon name="banking" /></i><span>{t("BUSINESS APPLICATION", "商業申請", "商业申请")}<b>Next GEM Company Limited</b><small>{profileLinked ? t("Eligible details prepared", "合資格資料已準備", "合资格资料已准备") : t("Waiting for permission", "等待授權", "等待授权")}</small></span></div></div>
                  <div className="transferScope"><span>{t("Eligible to reuse", "可重用資料", "可复用资料")}</span>{[t("Full name", "全名", "全名"), t("ID type & number", "證件類型及號碼", "证件类型及号码"), t("Nationality", "國籍", "国籍"), t("Contact number", "聯絡電話", "联系电话"), t("Email", "電郵", "电邮"), t("Date of birth", "出生日期", "出生日期")].map((item) => <b key={item}>✓ {item}</b>)}<small>{t("No balances or transaction history", "不包括結餘或交易紀錄", "不包括余额或交易记录")}</small></div>
                  <div className="connectedProfileSummary"><p><span>{t("Full name", "全名", "全名")}</span><b>{displayName}</b></p><p><span>{t("ID type", "證件類型", "证件类型")}</span><b>{t("Hong Kong Identity Card", "香港身份證", "香港身份证")}</b></p><p><span>{t("ID number", "證件號碼", "证件号码")}</span><b>•••• 888</b></p><p><span>{t("Nationality", "國籍", "国籍")}</span><b>{t("Verified", "已驗證", "已验证")}</b></p><p><span>{t("Contact number", "聯絡電話", "联系电话")}</span><b>+852 •••• 8888</b></p><p><span>{t("Email address", "電郵地址", "电邮地址")}</span><b>a•••@example.com</b></p><p><span>{t("Date of birth", "出生日期", "出生日期")}</span><b>•• / •• / 1990</b></p></div>
                  <button className={`profileLinkButton ${profileLinked ? "connected" : ""}`} onClick={() => setProfileLinked((value) => !value)}><VisualIcon name={profileLinked ? "permission" : "link"} /><span><b>{profileLinked ? t("Personal profile connected", "個人資料已連接", "个人资料已连接") : t("Connect verified personal profile", "連接已驗證個人資料", "连接已验证个人资料")}</b><small>{profileLinked ? t("You can disconnect before continuing", "繼續前仍可取消連接", "继续前仍可取消连接") : t("Owner permission required", "需要東主授權", "需要业主授权")}</small></span><em>{profileLinked ? t("Connected ✓", "已連接 ✓", "已连接 ✓") : t("Connect →", "連接 →", "连接 →")}</em></button>
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
                  <div className="profileSectionHead"><span><VisualIcon name="banking" /></span><div><p>{t("COMPANY IDENTITY", "公司身份", "公司身份")}</p><h3>{t("Map the company and its key people", "配對公司及主要人士", "匹配公司及主要人士")}</h3></div><b>{t("Future-state simulation", "未來模式模擬", "未来模式模拟")}</b></div>
                  <div className="officialSources"><span>{t("OFFICIAL VERIFIED RECORDS", "官方驗證紀錄", "官方验证记录")}</span><b>CorpID</b><b>iAM Smart</b><small>{t("Customer-authorised matching", "客戶授權配對", "客户授权匹配")}</small></div>
                  <div className="profileFields companyFields"><label><span>{t("COMPANY ID", "公司編號", "公司编号")}</span><input value={companyId} onChange={(event) => setCompanyId(event.target.value.slice(0, 30))} placeholder={t("Enter Company ID", "輸入公司編號", "输入公司编号")} /></label><label><span>{t("CEO / DIRECTOR NAME", "行政總裁／董事姓名", "首席执行官／董事姓名")}</span><input value={directorName} onChange={(event) => setDirectorName(event.target.value.slice(0, 50))} placeholder={t("Enter fictional name", "輸入虛構名稱", "输入虚构名称")} /></label><label><span>{t("ROLE", "職位", "职位")}</span><select value={directorRole} onChange={(event) => setDirectorRole(event.target.value)}><option>CEO</option><option>Director</option><option>CEO & Director</option><option>Authorised signatory</option></select></label></div>
                  <button className="aiPrepareRecord" onClick={prepareFictionalCompanyRecord}><VisualIcon name="sparkle" /><span><b>{t("Ask AI to prepare a fictional company record", "請 AI 準備虛構公司紀錄", "请 AI 准备虚构公司记录")}</b><small>{t("Prefills a sample Company ID and director for this demo", "預填示範公司編號及董事", "预填演示公司编号及董事")}</small></span><em>{t("Prepare →", "準備 →", "准备 →")}</em></button>
                  {companyProfileReady && <div className="officialMatch"><VisualIcon name="permission" /><p><b>{t("Company identity ready to match", "公司身份已準備配對", "公司身份已准备匹配")}</b>{companyId} · {directorName} · {directorRole}</p><em>{t("Prepared ✓", "已準備 ✓", "已准备 ✓")}</em></div>}
                  <small className="governmentNote">{t("Demo only: no live connection to CorpID, iAM Smart or government systems.", "只供示範：並未連接 CorpID、iAM Smart 或政府系統。", "仅供演示：并未连接 CorpID、iAM Smart 或政府系统。")}</small>
                </div>}

                {personalProfileReady && companyProfileReady && <div className="consentCard profileConsent"><div className="consentIcon"><VisualIcon name="permission" /></div><div><h3>{t("Verify the prepared owner and company profile", "驗證已準備的東主及公司資料", "验证已准备的业主及公司资料")}</h3><p>{t("Allow this fictional journey to match the entered information with trusted official records.", "允許此虛構旅程把已輸入資料與可信官方紀錄配對。", "允许此虚构旅程把已输入资料与可信官方记录匹配。")}</p><button className={`consentToggle ${consent ? "on" : ""}`} onClick={() => setConsent((value) => !value)} role="switch" aria-checked={consent}><i /><span>{consent ? t("Permission given", "已授權", "已授权") : t("Give permission", "授權", "授权")}</span></button></div></div>}
                <div className="dataPreview"><span>{t("Application summary", "申請摘要", "申请摘要")}</span><div><p>{t("Business type", "業務類型", "业务类型")}<b>{selectedBusiness[language][0]}</b></p><p>{t("Company name", "公司名稱", "公司名称")}<b>Next GEM Company Limited</b></p><p>{t("Owner route", "東主資料方式", "业主资料方式")}<b>{profileMode === "connect" ? t("Connected profile", "已連接資料", "已连接资料") : profileMode === "manual" ? t("Manual entry", "自行輸入", "自行输入") : t("Choose a route", "選擇方式", "选择方式")}</b></p></div><small>{t("Fictional information for demonstration only", "虛構資料，只供示範", "虚构资料，仅供演示")}</small></div>
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
                <p className="demoEyebrow">{t("SELECTIVE ASSURANCE", "按需加強驗證", "按需加强验证")}</p><h2>{t("Digital by default.", "數碼流程優先。", "数字流程优先。")}<br /><em>{t("Human when it matters.", "需要時，由真人協助。", "需要时，由真人协助。")}</em></h2><p className="demoIntro">{t("AI coordinates the essential checks. Video verification appears only when an additional risk question needs a specialist.", "AI 協調必要檢查；只有額外風險問題需要專員時，才會啟動視像驗證。", "AI 协调必要检查；只有额外风险问题需要专员时，才会启动视频验证。")}</p>
                <div className="checkList"><div><i><VisualIcon name="identity" /></i><span><b>{t("Identity and selfie matched", "身份及自拍照已配對", "身份及自拍照已匹配")}</b><small>{profileMode === "connect" ? t("Verified profile and new selfie aligned", "已驗證資料與新自拍照一致", "已验证资料与新自拍照一致") : t("ID document and selfie evidence aligned", "證件與自拍照資料一致", "证件与自拍照资料一致")}</small></span><em>{t("Ready", "已準備", "已准备")}</em></div><div><i><VisualIcon name="document" /></i><span><b>{t("Business and address evidence matched", "業務及地址證明已配對", "业务及地址证明已匹配")}</b><small>{documents.length} {t("fictional files verified", "個虛構檔案已驗證", "个虚构文件已验证")}</small></span><em>{t("Ready", "已準備", "已准备")}</em></div><div><i><VisualIcon name="insight" /></i><span><b>{t("Initial risk indicators", "初步風險指標", "初步风险指标")}</b><small>{t("Relevant checks coordinated by AI", "AI 協調所需檢查", "AI 协调所需检查")}</small></span><em>{t("Ready", "已準備", "已准备")}</em></div></div>
                <div className="selectiveDecision"><span><VisualIcon name="permission" /></span><div><p>{t("SELECTIVE STEP", "按需步驟", "按需步骤")}</p><h3>{t("No video required for this sample profile", "此示範資料毋須視像驗證", "此演示资料无需视频验证")}</h3><small>{t("Eligible customers continue digitally. A specialist joins only when extra assurance is needed.", "合資格客戶可繼續數碼流程；只有需要額外確認時才接通專員。", "合资格客户可继续数字流程；只有需要额外确认时才接通专员。")}</small></div><b>{t("Digital path ✓", "數碼流程 ✓", "数字流程 ✓")}</b></div>
                {!videoOpen && <button className="videoPreviewButton" onClick={() => setVideoOpen(true)}><VisualIcon name="chat" /><span><b>{t("Preview instant video verification", "預覽即時視像驗證", "预览即时视频验证")}</b><small>{t("Simulate a selected risk case for the pitch", "模擬需要額外風險確認的個案", "模拟需要额外风险确认的个案")}</small></span><em>{t("Connect →", "連接 →", "连接 →")}</em></button>}
                {videoOpen && <div className={`videoVerify ${videoConnected ? "connected" : ""}`}><div className="videoTop"><span><i /> {videoConnected ? t("SPECIALIST CONNECTED", "專員已連接", "专员已连接") : t("CONNECTING SECURELY…", "正在安全連接…", "正在安全连接…")}</span><b>{t("Selective verification · Demo", "按需驗證 · 示範", "按需验证 · 演示")}</b></div><div className="videoGrid"><div className="customerTile"><i>{displayName.charAt(0).toUpperCase()}</i><span>{displayName}<small>{t("Business owner", "企業東主", "企业业主")}</small></span></div><div className="specialistTile"><span><VisualIcon name="people" /></span><p><b>{videoConnected ? t("Customer service specialist", "客戶服務專員", "客户服务专员") : t("Finding the right specialist", "正在尋找合適專員", "正在寻找合适专员")}</b>{videoConnected ? t("Context received · Ready to verify", "已收到背景 · 準備驗證", "已收到背景 · 准备验证") : t("Sharing prepared context…", "正在分享已準備背景…", "正在分享已准备背景…")}</p></div></div><div className="videoControls"><span>🎙 {t("Demo audio", "示範音訊", "演示音频")}</span><span>▣ {t("Demo video", "示範視像", "演示视频")}</span><button onClick={() => setVideoOpen(false)}>{t("End demo call", "結束示範通話", "结束演示通话")}</button></div><small>{t("No camera or microphone is activated in this simulation.", "此模擬不會啟動鏡頭或麥克風。", "此模拟不会启动摄像头或麦克风。")}</small></div>}
                <div className="plainPromise"><span>{t("Why is this selective?", "為何按需啟動？", "为何按需启动？")}</span><p>{t("It preserves a fast journey for most customers while adding human judgement exactly where a risk question needs it.", "大部分客戶可保持快速流程，只有風險問題需要時才加入真人判斷。", "大部分客户可保持快速流程，只有风险问题需要时才加入真人判断。")}</p></div>
                <div className="demoActions"><button className="demoBack" onClick={back}>← {t("Back", "返回", "返回")}</button><button className="demoPrimary" onClick={() => setChecking(true)} disabled={checking}>{checking ? t("Completing secure checks…", "正在完成安全檢查…", "正在完成安全检查…") : t("Create demo account", "建立示範賬戶", "建立演示账户")} <b>{checking ? "···" : "→"}</b></button></div>
              </div>}

              {step === 5 && <div className="demoPanel accountPanel"><div className="successPulse">✓</div><p className="demoEyebrow">{t("ACCOUNT READY", "賬戶已準備", "账户已准备")}</p><h2>{displayName}，{t("your business can", "你的業務可以", "你的业务可以")}<br /><em>{t("start moving.", "開始前進。", "开始前进。")}</em></h2><p className="demoIntro">{t("Your demo account number is ready. Start with the essentials now, then activate more services as the business needs them.", "你的示範賬戶號碼已準備；可先使用基本功能，再按業務需要啟用更多服務。", "你的演示账户号码已准备；可先使用基本功能，再按业务需要启用更多服务。")}</p><div className="accountCard"><div><span>NEXT GEM · {t("DEMO", "示範", "演示")}</span><b>Next GEM Company Limited</b></div><p>{t("MASKED DEMO ACCOUNT", "已遮蔽示範賬戶", "已遮蔽演示账户")}</p><strong>***-******-838</strong><small>{t("Secured display · Fictional demonstration only", "安全顯示 · 只供虛構示範", "安全显示 · 仅供虚构演示")}</small></div><div className="timeSaved"><strong>02:41</strong><span><b>{t("Account number ready", "賬戶號碼已準備", "账户号码已准备")}</b>{t("Completed within the 3-minute ambition", "在三分鐘目標內完成", "在三分钟目标内完成")}</span><i>{t("Next: choose and activate services →", "下一步：選擇及啟用服務 →", "下一步：选择及启用服务 →")}</i></div><div className="demoActions"><button className="demoBack" onClick={back}>← {t("Review", "覆核", "复核")}</button><button className="demoPrimary" onClick={next}>{t("Enter my account", "進入我的賬戶", "进入我的账户")} <b>→</b></button></div></div>}

              {step === 6 && <div className="demoPanel dashboardPanel">
                <div className="dashboardHello"><div><p className="demoEyebrow">{t("GOOD MORNING", "早晨", "早上好")}，{displayName.toUpperCase()}</p><h2>{t("Your business,", "你的業務，", "你的业务，")}<br /><em>{t("ready to grow.", "準備成長。", "准备成长。")}</em></h2></div><button onClick={reset}>{t("Restart demo", "重新開始示範", "重新开始演示")} ↻</button></div>
                <div className="accountStatus"><div><span>{t("ACCOUNT STATUS", "賬戶狀態", "账户状态")}</span><b><i /> {t("Active · Essentials ready", "已啟用 · 基本功能就緒", "已启用 · 基本功能就绪")}</b></div><p>Next GEM Company Limited<small>***-******-838 · {t("Secured display", "安全顯示", "安全显示")}</small></p></div>
                <div className="nextAction"><span>{t("YOUR NEXT BEST STEP", "你的最佳下一步", "你的最佳下一步")}</span><div><i><VisualIcon name="payments" /></i><p><b>{t("Move money with confidence", "自信管理資金", "自信管理资金")}</b>{t("Payments and liquidity tools are ready to support everyday cash flow as your business grows.", "支付及流動資金工具已準備好，隨業務成長支援日常現金流。", "支付及流动资金工具已准备好，随业务成长支持日常现金流。")}</p><button onClick={() => toggleService("Payments and Liquidity")}>{unlocked.includes("Payments and Liquidity") ? t("Added ✓", "已加入 ✓", "已加入 ✓") : t("Explore →", "了解 →", "了解 →")}</button></div></div>

                <section className="aiRecommendations" aria-labelledby="ai-recommendations-title">
                  <div className="recommendationHead"><span><VisualIcon name="sparkle" /></span><div><p>{t("AI-TAILORED FOR YOUR BUSINESS", "AI 為你的業務度身建議", "AI 为你的业务量身建议")}</p><h3 id="ai-recommendations-title">{t("The right cards for how you operate", "配合營運方式的合適卡選", "匹配运营方式的合适卡片")}</h3><small>{t("Based on your selected sector and onboarding signals—not a final eligibility decision.", "根據已選行業及開戶訊號提供，並非最終批核決定。", "根据已选行业及开户信号提供，并非最终审批决定。")}</small></div></div>
                  <div className="recommendationSignals"><b>{t("AI SIGNALS", "AI 訊號", "AI 信号")}</b><span>{selectedBusiness[language][0]}</span><span>{t("Everyday spending", "日常開支", "日常开支")}</span><span>{t("Multicurrency", "多種貨幣", "多种货币")}</span><span>{t("Expense control", "開支管理", "开支管理")}</span></div>
                  <div className="cardRecommendationGrid">
                    <article className="productRecommendation recommended">
                      <div className="productCardVisual"><img src={asset("products/business-debit-mastercard.png")} alt="Business Debit Mastercard product card" /></div>
                      <div className="productCardCopy"><p>{t("BEST MATCH · DAILY OPERATIONS", "最佳配對 · 日常營運", "最佳匹配 · 日常运营")}</p><h3>Business Debit Mastercard</h3><span>{t("Spend directly from the business account with practical multicurrency control.", "直接從商業賬戶支付，並靈活管理多種貨幣。", "直接从商业账户支付，并灵活管理多种货币。")}</span><ul><li>{t("Direct debit in 12 major currencies", "支援 12 種主要貨幣直接扣賬", "支持 12 种主要货币直接扣账")}</li><li>{t("No annual fee or foreign-currency handling fee", "免年費及外幣交易手續費", "免年费及外币交易手续费")}</li><li>{t("0.5% instant cash rebate on eligible spending", "合資格簽賬享 0.5% 即時現金回贈", "合资格消费享 0.5% 即时现金回赠")}</li></ul><div className="productActions"><button onClick={() => toggleBusinessCard("Business Debit Mastercard")}>{selectedBusinessCards.includes("Business Debit Mastercard") ? t("Added to plan ✓", "已加入計劃 ✓", "已加入计划 ✓") : t("Add to plan +", "加入計劃 +", "加入计划 +")}</button><a href="https://www.business.hsbc.com.hk/en-gb/products/business-debit-card" target="_blank" rel="noreferrer">{t("Product details ↗", "產品詳情 ↗", "产品详情 ↗")}</a></div></div>
                    </article>
                    <article className="productRecommendation">
                      <div className="productCardVisual dark"><img src={asset("products/business-mastercard.png")} alt="Business Mastercard product card" /></div>
                      <div className="productCardCopy"><p>{t("FLEXIBILITY · TEAM SPEND", "靈活周轉 · 團隊開支", "灵活周转 · 团队开支")}</p><h3>Business Mastercard</h3><span>{t("Create breathing room for purchases while keeping company expenses visible.", "為業務採購保留周轉空間，同時清晰掌握公司開支。", "为业务采购保留周转空间，同时清晰掌握公司开支。")}</span><ul><li>{t("Up to 56 days interest-free repayment period", "最長 56 日免息還款期", "最长 56 天免息还款期")}</li><li>{t("RewardCash on eligible card spending", "合資格簽賬賺取獎賞錢", "合资格消费赚取奖赏钱")}</li><li>{t("Individual limits and expense reporting", "獨立信用限額及開支報告", "独立信用额度及开支报告")}</li></ul><div className="productActions"><button onClick={() => toggleBusinessCard("Business Mastercard")}>{selectedBusinessCards.includes("Business Mastercard") ? t("Added to plan ✓", "已加入計劃 ✓", "已加入计划 ✓") : t("Add to plan +", "加入計劃 +", "加入计划 +")}</button><a href="https://www.business.hsbc.com.hk/en-gb/products/business-master-card" target="_blank" rel="noreferrer">{t("Product details ↗", "產品詳情 ↗", "产品详情 ↗")}</a></div></div>
                    </article>
                  </div>
                  <p className="recommendationNote">{t("Illustrative recommendation only. Eligibility, fees, rewards and terms are subject to the official product information and approval.", "只屬示範建議；資格、費用、獎賞及條款以官方產品資料及批核為準。", "仅属演示建议；资格、费用、奖赏及条款以官方产品资料及审批为准。")}</p>
                </section>

                <section className="personalJourneyBridge" aria-labelledby="personal-journey-title">
                  <div className="personalBridgeHead"><span><VisualIcon name="people" /></span><div><p>{t("PEOPLE BEHIND THE BUSINESS", "企業背後的每一位", "企业背后的每一位")}</p><h3 id="personal-journey-title">{t("One business. Many people. A personal journey for each.", "一間企業，多位重要成員；每人都有自己的個人理財旅程。", "一家企业，多位重要成员；每人都有自己的个人银行旅程。")}</h3><small>{t("Owners, directors and authorised users can each opt in separately. Only their eligible verified identity details—not business balances or transactions—prepare personal account opening and activation.", "東主、董事及獲授權使用者可各自選擇參與。只會重用其合資格的已驗證身份資料，不會共享企業結餘或交易，以準備個人賬戶開立及啟用。", "业主、董事及获授权用户可各自选择参与。只会复用其合资格的已验证身份资料，不会共享企业余额或交易，以准备个人账户开立及启用。")}</small></div></div>
                  <div className="personalJourneyFlow"><span><b>01</b>{t("Choose a person", "選擇成員", "选择成员")}</span><i>→</i><span><b>02</b>{t("Permissioned profile", "授權個人資料", "授权个人资料")}</span><i>→</i><span><b>03</b>{t("Open & activate", "開立及啟用", "开立及启用")}</span></div>
                  <p className="personalChoiceLabel">{t("Who is continuing?", "哪位成員繼續？", "哪位成员继续？")}</p>
                  <div className="personalPeopleChoices" role="group" aria-label={t("People linked to the business", "與企業相關的成員", "与企业相关的成员")}>{personalPeople.map((item) => <button key={item.key} className={personalPerson === item.key ? "selected" : ""} onClick={() => { setPersonalPerson(item.key); setPersonalJourneyPrepared(false); }}>{item.label}<span>{personalPerson === item.key ? "✓" : "+"}</span></button>)}</div>
                  <p className="personalChoiceLabel interestLabel">{t("Choose an interest for this fictional journey", "選擇此虛構旅程的個人理財需要", "选择此虚构旅程的个人银行需求")}</p>
                  <div className="personalProductChoices" role="group" aria-label={t("Personal banking interests", "個人理財選項", "个人银行选项")}>{["One", "Premier", "Premier Elite", "Private Banking", "Credit Cards"].map((item) => <button key={item} className={personalProduct === item ? "selected" : ""} onClick={() => { setPersonalProduct(item); setPersonalJourneyPrepared(false); }}>{item}<span>{personalProduct === item ? "✓" : "+"}</span></button>)}</div>
                  <button className="preparePersonalJourney" onClick={() => setPersonalJourneyPrepared(true)}><VisualIcon name="sparkle" /><span><b>{personalJourneyPrepared ? t(`${personalPersonLabel} · ${personalProduct} journey prepared`, `${personalPersonLabel} · ${personalProduct} 旅程已準備`, `${personalPersonLabel} · ${personalProduct} 旅程已准备`) : t("Ask AI to prepare this personal journey", "請 AI 準備這個個人理財旅程", "请 AI 准备这个个人银行旅程")}</b><small>{personalJourneyPrepared ? t("Consent and eligible profile fields are ready for the next step—no restart.", "同意及合資格資料已準備進入下一步，毋須重新開始。", "同意及合资格资料已准备进入下一步，无需重新开始。") : t("Each person decides separately; only their permitted context moves forward.", "每位成員各自決定，只有其授權資料會進入下一步。", "每位成员各自决定，只有其授权资料会进入下一步。")}</small></span><em>{personalJourneyPrepared ? t("Ready ✓", "已就緒 ✓", "已就绪 ✓") : t("Prepare →", "準備 →", "准备 →")}</em></button>
                </section>

                <p className="serviceTitle">{t("More products and solutions that grow with you", "更多與你共同成長的產品及方案", "更多与你共同成长的产品及方案")}</p><div className="serviceGrid expandedServices">{solutions.map((item) => { const active = unlocked.includes(item.key); return <button key={item.key} className={active ? "service active" : "service"} onClick={() => toggleService(item.key)}><i>{active ? "✓" : <VisualIcon name={item.icon} />}</i><b>{item[language][0]}</b><span>{active ? t("Unlocked", "已解鎖", "已解锁") : item[language][1]}</span></button>; })}</div>
                <div className="demoFinish"><span>♡</span><p><b>{t("One relationship. No restart.", "一段關係，毋須重來。", "一段关系，无需重来。")}</b>{t("Your profile, progress and permissions move with you—across business and personal needs.", "你的資料、進度及權限會一直跟隨你，連接企業及個人需要。", "你的资料、进度及权限会一直跟随你，连接企业及个人需求。")}</p><a href="#/">{t("Return to pitch →", "返回簡介 →", "返回简介 →")}</a></div>
              </div>}
            </div>

            <aside className={`aiCompanion intelligentCompanion ${aiExpanded ? "open" : ""}`} aria-label="Next GEM AI conversation">
              <button className="aiCompanionHeader" onClick={() => setAiExpanded((value) => !value)} aria-expanded={aiExpanded}><span><VisualIcon name="sparkle" /></span><p><b>Next GEM AI</b><small>{t("Intelligent journey assistant · Online", "智能旅程助手 · 在線", "智能旅程助手 · 在线")}</small></p><em>{aiExpanded ? "−" : "+"}</em></button>
              <div className="aiCompanionBody">
                <div className="aiModelStatus"><i /><span><b>{t("BANK-MODEL CAPABILITY PREVIEW", "銀行模型能力預覽", "银行模型能力预览")}</b>{t("Understands journey context · Can prepare fictional fields", "理解旅程背景 · 可準備虛構欄位", "理解旅程背景 · 可准备虚构字段")}</span></div>
                <p className="aiStageLabel">{guide.eyebrow}</p>
                <div className="aiConversationWindow" aria-live="polite">
                  <div className="aiBubble"><i>AI</i><p>{guide.message}</p></div>
                  {aiReply && !aiMessages.length && <div className="aiBubble followup"><i>AI</i><p>{aiReply}</p></div>}
                  {aiMessages.map((message) => <div key={message.id} className={`aiChatMessage ${message.role}`}><i>{message.role === "ai" ? "AI" : displayName.charAt(0).toUpperCase()}</i><p>{message.text}{message.applied && <small>✓ {message.applied}</small>}</p></div>)}
                  {aiThinking && <div className="aiChatMessage ai thinking"><i>AI</i><p><span /><span /><span /></p></div>}
                </div>
                <form className="aiComposer" onSubmit={sendAiMessage}>
                  <label htmlFor="next-gem-ai-input">{t("Tell Next GEM AI anything", "向 Next GEM AI 輸入任何內容", "向 Next GEM AI 输入任何内容")}</label>
                  <div><input id="next-gem-ai-input" value={aiInput} onChange={(event) => setAiInput(event.target.value.slice(0, 240))} placeholder={t("Try: I run an online trading company", "試試：我經營網上貿易公司", "试试：我经营网上贸易公司")} autoComplete="off" /><button type="submit" disabled={!aiInput.trim() || aiThinking} aria-label={t("Send to Next GEM AI", "傳送給 Next GEM AI", "发送给 Next GEM AI")}><VisualIcon name="sparkle" /><span>→</span></button></div>
                  <small>{t("Fictional capability demo · Not connected to a live bank LLM", "虛構能力示範 · 並未連接正式銀行大型語言模型", "虚构能力演示 · 未连接正式银行大语言模型")}</small>
                </form>
                <div className="aiPrompts">{guide.prompts.map(([label, answer]) => <button key={label} onClick={() => answerPrompt(label, answer)}>{label} <span>→</span></button>)}</div>
                <div className="aiGuardrail"><VisualIcon name="privacy" /><span><b>{t("You decide. AI prepares.", "由你決定，AI 準備。", "由你决定，AI 准备。")}</b>{t("Every autofill stays visible, reviewable and reversible.", "每次自動填寫均清晰可見、可覆核及可撤回。", "每次自动填写均清晰可见、可复核及可撤回。")}</span></div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
