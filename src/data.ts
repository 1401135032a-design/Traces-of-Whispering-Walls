import { MuralHotspot, ArtifactHotspot, RestorationStep } from './types';

export const TOMB_OWNER_INFO = {
  title: "晚唐幽州卢龙节度使刘济大墓纪事",
  era: "晚唐（公元757年 - 公元810年）",
  biography: "刘济（757—810），晚唐幽州卢龙节度使，镇守幽燕边防数十年，是朝廷倚重的核心藩镇重臣，封彭城郡王，治军忠正、镇守北疆，悲惨谢幕。逝后获朝廷以极高规格厚葬。",
  structure: "房山长沟唐大墓依山凿穴，全长 34 米。整座墓葬对称排布，由最南端的墓道开始，向北依次连通墓门、前甬道、东西耳室、前封门、东西壁龛、后封门、主室（两侧对称分布东西侧室）、后甬道与后室。地表上的覆斗形夯土作为地表封土建筑。该大墓壁画满绘，是晚唐顶级藩镇节度使墓葬规制的最高代表。"
};

export const MURAL_HOTSPOTS: MuralHotspot[] = [
  {
    id: "mural_dance",
    title: "Feast, Music & Dance",
    titleZh: "西壁 · 乐舞屏风图",
    wall: "west",
    x: 75,
    y: 45,
    image: "/src/assets/images/乐舞图.png",
    description: "描绘了刘济生前宴飨宾客时，西域胡腾舞与盛大乐伎合奏的欢腾场景。两旁持琵琶、羌笛、筚篥的乐工围坐，中间舞伎在圆毡上腾跃旋转，场面宏大奢华。",
    descriptionEn: "Depicts a lavish feast hosted by Liu Ji, featuring dancers performing the Huteng dance accompanied by an orchestra playing pipas, flutes, and reeds on round felt rugs.",
    historicalContext: "唐代幽燕边塞是多民族交融的前沿，‘胡同乐舞’、‘胡风胡乐’在节度使幕府盛行不衰，是唐代胡汉文化深度交融的艺术结晶。",
    historicalContextEn: "Youzhou was a frontier hub of multicultural integration. Central Asian music and dance thrived in the Jiedushi mansion, reflecting deep Sino-Sogdian cultural synthesis.",
    details: [
      "西域胡腾舞：中间舞者单足腾跃，展现出胡腾舞‘急急旋风、腾空起舞’的典型特征，动感十足。",
      "乐器大合奏：周围配有弹琵琶、吹箫、击鼓的乐工，乐器品类繁杂，真实再现了晚唐燕乐大合奏的宏大规模。",
      "屏风画中画：乐舞场景以六扇屏风的形式展现，具有典型的唐代‘屏风画’布局，极具空间层次感。"
    ],
    detailsEn: [
      "Central Asian Huteng Dance: The solo dancer leaps on one foot on a felt rug, capturing the whirlwind spinning style of the Huteng dance.",
      "Orchestral Ensemble: Surrounded by musicians playing pipas, end-blown flutes, and drums, illustrating a grand Late Tang court orchestra.",
      "Six-Panel Screen Frame: The scene is presented within a six-panel folding screen, displaying classic Tang spatial composition."
    ]
  },
  {
    id: "mural_maidens",
    title: "Noble Ladies and Maidens",
    titleZh: "北壁 · 执扇捧物侍女",
    wall: "north",
    x: 35,
    y: 45,
    image: "/src/assets/images/宫女图.jpg",
    description: "北壁绘制的执扇捧物侍女。侍女体态丰盈慵懒，头挽堕马髻，身着红底高腰襦裙，肩配缠枝绿纱帛，脸点朱砂妆靥，是唐代上流宫廷仕女生活写照。",
    descriptionEn: "Features elegant court maidens holding ceremonial fans and luxury vessels. Plump posture, high waist skirts, and floral makeup depict aristocratic Tang court life.",
    historicalContext: "大气的仕女图折射出当时封建重臣对中央礼制与宫廷风尚的追慕，具有突出的艺术考古价值。",
    historicalContextEn: "Reflects the regional governor's emulation of imperial court fashion and ritual decorum, providing key archaeological insight into High Tang aesthetics.",
    details: [
      "精细妆容：额点淡金花钿，斜画斜红，面施薄粉，保留了盛晚唐过渡时期的典型妆面特征。",
      "线条流畅：以柔细圆转的‘铁线描’勾勒衣裙，帛带随身姿飘舞，动静皆宜。",
      "随身器物：侍女所持银盒、漆器上刻有精致的缠枝莲与瑞草纹，尽显奢华气息。"
    ],
    detailsEn: [
      "Refined Facial Makeup: Floral forehead ornaments (huadian) and blush makeup showcase High-to-Late Tang court fashion.",
      "Iron-Wire Line Brushwork: Flowing drapery executed with delicate iron-wire brush strokes captures graceful motion.",
      "Ritual Vessels: Intricately carved silver boxes and lacquerware carried by maidens display exquisite lotus and floral scrolls."
    ]
  },
  {
    id: "mural_officials",
    title: "Mural of Officials Riding Horses",
    titleZh: "东耳室 · 骑马官员图",
    wall: "east",
    x: 50,
    y: 45,
    image: "/src/assets/images/骑马官员.jpg",
    description: "东耳室中央绘制的唐代骑马官员图。图中官员头戴折上巾，身着绯色圆领长袍，气宇轩昂。身后侍从执伞随行，山水背景依稀可见，完美再现了唐代地方藩镇高级官员巡行守疆、威仪赫赫的真实场景与服饰礼制。",
    descriptionEn: "Features a Tang official on horseback wearing a scarlet round-collar robe and folded cap, accompanied by attendants holding parasols against a landscape backdrop.",
    historicalContext: "该图是晚唐幽州卢龙节度使幕府政治秩序与地方官员威仪的真实反映，具有重大的历史、礼仪及服饰制度考证价值。",
    historicalContextEn: "A vivid representation of the political order and military majesty of the Lulong Jiedushi governor's retinue in Late Tang.",
    details: [
      "官员服饰：官员着标准的唐代绯色官服，反映了唐代朝廷品级制度在幽州藩镇的延传。",
      "构图章法：官员居中且体态高大，侍从比例偏小，沿袭了唐代‘主大仆小’的经典人机构图特征。",
      "线条用笔：勾线行云流水，运笔稳健，衣褶转折处极显‘曹衣出水’之刚劲洒脱。"
    ],
    detailsEn: [
      "Official Attire: Scarlet official robe and headwear reflect Tang imperial rank regulations preserved in frontier garrisons.",
      "Hierarchical Composition: The main official is rendered larger than attendants, adhering to classic Tang social hierarchy rules.",
      "Dynamic Lineage: Smooth, resilient brushlines capture the flowing folds of robes with vigorous elegance."
    ]
  },
  {
    id: "mural_horses_ear",
    title: "Mural of Majestic Horses",
    titleZh: "西耳室 · 骏马图",
    wall: "west",
    x: 50,
    y: 45,
    image: "/src/assets/images/骏马.png",
    description: "西耳室中央珍藏的骏马图壁画。画面中的神驹体态丰盈、鬃毛修长飞舞，马蹄微抬。作为大唐名骑的艺术化再现，生动展现了晚唐工笔重彩的卓越笔意与幽燕铁骑威镇边疆的英武雄姿。",
    descriptionEn: "A magnificent steed mural in the West Ear Chamber depicting a powerful warhorse with flying mane, symbol of the elite Lulong cavalry.",
    historicalContext: "大墓耳室出土战马壁画，不仅象征着墓主生前的显赫戎马生涯与崇高声势，亦是唐代战马文化与北方游牧交融的最高实物凭证。",
    historicalContextEn: "Symbolizes Liu Ji's distinguished military career and serves as primary evidence of cavalry culture and Nomadic-Sino synthesis in Tang frontier garrisons.",
    details: [
      "写实渲染：马匹的肌肉线条轮廓富有饱满的体积感，透露出晚唐画师精细的骨法写实功底。",
      "奢华马具：马鞍及配饰繁复华丽，阴刻彩绘，极尽彰显藩镇重臣坐骑的顶配规制。",
      "灵动神情：骏马双耳敏锐耸立，目光如炬，充满了骁勇善战的精气神。"
    ],
    detailsEn: [
      "Anatomical Precision: Volumetric muscle rendering demonstrates the master draughtsmanship of Late Tang court painters.",
      "Elaborate Harnessing: Ornate saddles and reins reflect the top-grade equestrian accoutrements of regional military governors.",
      "Vivid Expression: Alert ears and fiery gaze embody the noble spirit of frontier battle steeds."
    ]
  }
];

export const ARTIFACT_HOTSPOTS: ArtifactHotspot[] = [
  {
    id: "artifact_liuji_epitaph",
    title: "Epitaph of Military Governor Liu Ji",
    titleZh: "刘济墓志",
    x: 35,
    y: 70,
    location: "前甬道北侧",
    locationEn: "North Side of Front Passage",
    description: "志盖呈盝顶式，正中阴刻篆书6行24字：“唐故幽州卢龙节度观察御使中书令赠太师刘公墓志之铭”。四刹阴刻文吏怀抱十二生肖形象，交角阴刻牡丹花图案。",
    descriptionEn: "Truncated pyramid cover with 24 carved seal script characters. The sides feature carved civil officials holding zodiac figures, with peony motifs at the corners.",
    excavationInfo: "墓志上下叠合面南平放，位于前甬道北侧，隔墙与主室门之间。字体采用的是正面楷书，共47行，1543字，其中正文1392字。",
    excavationInfoEn: "Unearthed in the north front passage. Contains 1,543 regular script characters across 47 lines detailing Liu Ji's military achievements.",
    craftsmanship: "石质。志盖阴刻篆书6行24字:“唐故幽州卢龙节度观察御使中书令赠太师刘公墓志之铭”。志石边长 1.42 × 1.51 米，厚 0.22 米。雕刻精细，四刹阴刻文吏抱十二生肖，牡丹花交角雕刻极其华丽。",
    craftsmanshipEn: "White marble stone measuring 1.42 x 1.51 meters and 0.22 meters thick. Exquisitely carved with seal script, zodiac guardians, and ornate peony scrollwork.",
    motifs: ["篆书6行24字", "文吏抱十二生肖", "交角阴刻牡丹花"],
    motifsEn: ["Seal Script Inscription", "Official Zodiac Bearers", "Carved Peony Corner Scrolls"],
    icon: "Scroll",
    images: [
      "/src/assets/images/墓志.png",
      "/src/assets/images/志石头.png"
    ]
  },
  {
    id: "artifact_wife_epitaph",
    title: "Epitaph of Liu Ji's Wife (Lady Zhang)",
    titleZh: "刘济夫人墓志及十二生肖彩刻",
    x: 45,
    y: 70,
    location: "前甬道南侧",
    locationEn: "South Side of Front Passage",
    description: "志盖呈盝顶式，阴刻描金篆书5行21字：“唐故蓟国太夫人赠燕国太夫人清河张夫人祔志铭”。正面楷书46行，共1438字，其中正文1315字。",
    descriptionEn: "Gilded seal script on a truncated pyramid marble cover. Regular script text in 46 lines detailing Lady Zhang's noble lineage and honors.",
    excavationInfo: "墓志上下叠合面南平放，位于墓葬前甬道南侧，东西耳室之间。作为唐代一品诰命夫人的高规格墓志，与刘济墓志一南一北对称分布。",
    excavationInfoEn: "Placed symmetrically opposite Liu Ji's epitaph. Represents top-grade funerary honors for a first-rank Tang noblewoman.",
    craftsmanship: "石质。志盖尺寸为边长 1.63 米，边厚 0.085 米，顶厚约 0.15 米。阴刻描金工艺精湛，彰显出晚唐一品诰命夫人极高贵的社会地位。",
    craftsmanshipEn: "White marble cover measuring 1.63m square. Gilded incision carvings demonstrate supreme Tang royal craftsmanship.",
    motifs: ["描金篆书5行21字", "唐代正楷46行", "一品夫人祔志铭"],
    motifsEn: ["Gilded Seal Inscription", "Standard Tang Calligraphy", "First-Rank Noble Epitaph"],
    icon: "Scroll",
    images: [
      "/src/assets/images/夫人墓志.jpg",
      "/src/assets/images/夫人墓志2.jpg",
      "/src/assets/images/夫人墓志3.jpg"
    ]
  },
  {
    id: "artifact_coffin_bed",
    title: "Painted Sumeru Throne Coffin Bed",
    titleZh: "彩绘须弥座棺床与棺椁",
    x: 50,
    y: 50,
    location: "主室中部",
    locationEn: "Center of Main Chamber",
    description: "汉白玉大棺床，南宽北窄，由六层石板逐层垒砌，呈梯形。棺床之上放置有棺椁，包含朱雀挡板、门形椁板以及多块长方形石板。",
    descriptionEn: "Six-tiered white marble Sumeru throne coffin bed carved with relief musicians, guardians, lions, and Vermilion Bird motifs.",
    excavationInfo: "出土于主室中部。棺床南北长 3.7 米，东西宽 1.9—2.5 米，石条长 0.8—2 米，宽 0.6—0.8 米。整体规模宏大。",
    excavationInfoEn: "Discovered in main hall center, measuring 3.7m long and up to 2.5m wide, built with massive carved marble slabs.",
    craftsmanship: "石质。采用六层石板逐层垒砌，呈精美的梯形。浮雕朱雀、乐伎、狮子与缠枝纹饰，并施以浓丽彩绘，是晚唐雕刻艺术的巅峰极品。",
    craftsmanshipEn: "Layered white marble with rich polychrome painting and gilt reliefs representing imperial-grade Tang stone carving.",
    motifs: ["朱雀挡板", "门形椁板", "六层梯形须弥座"],
    motifsEn: ["Vermilion Bird Screen", "Portal Coffin Slab", "6-Tier Sumeru Throne Base"],
    icon: "Grid",
    images: [
      "/src/assets/images/棺床北.png",
      "/src/assets/images/彩绘祥云.png",
      "/src/assets/images/金刚力士像.png"
    ]
  },
  {
    id: "artifact_lamp",
    title: "Everlasting Stone Lamp",
    titleZh: "长明灯",
    x: 75,
    y: 85,
    location: "主室东南部",
    locationEn: "Southeast Corner of Main Chamber",
    description: "大墓主室东南部出土的石质长明灯，由石柱与须弥式莲座巧妙组合而成，代表墓室中的长明不熄与光明护持。",
    descriptionEn: "White marble everlasting lamp consisting of a lotus pedestal and column, providing eternal light for the tomb.",
    excavationInfo: "出土于主室东南方位，其石柱矗立，基座稳固，是唐代高级贵族墓葬中不可或缺的礼仪性祭祀器物。",
    excavationInfoEn: "Excavated in the southeast area of the main chamber, an essential ritual sacrifice artifact in Tang noble burials.",
    craftsmanship: "石质。通体以优质汉白玉雕凿，底部为多层覆莲须弥莲座，石柱打磨圆润，雕花古朴典雅。",
    craftsmanshipEn: "Carved from high-grade white marble with multi-layered upside-down lotus petals on a Sumeru throne base.",
    motifs: ["石柱灯身", "须弥式莲座", "覆莲瓣雕刻"],
    motifsEn: ["Marble Lamp Column", "Sumeru Lotus Base", "Carved Lotus Petals"],
    icon: "Flame",
    images: ["/src/assets/images/长明灯.png"]
  },
  {
    id: "artifact_civil_official",
    title: "Painted White Marble Civil Official",
    titleZh: "彩绘汉白玉文官俑",
    x: 30,
    y: 40,
    location: "主室",
    locationEn: "Main Chamber",
    description: "主室随葬的高规格汉白玉文官立俑。文官神态谦恭、双手执笏、身着宽袍，展现晚唐高级将领内廷幕府文官僚属的庄重仪态。",
    descriptionEn: "Standing civil official figurine carved from white marble, holding a ritual tablet in court robes, reflecting governor's retinue.",
    excavationInfo: "出土于主室左侧地上。作为成组的汉白玉俑类，极其罕见地采用了贵重汉白玉原料雕刻，体现了该大墓的顶格规格。",
    excavationInfoEn: "Unearthed on the left side of the main hall floor. Extremely rare usage of solid white marble for tomb figurines.",
    craftsmanship: "汉白玉石质。通体以汉白玉雕刻，施以彩绘描金，线条行云流水，充分体现了唐代写实雕塑的高超技艺。",
    craftsmanshipEn: "Polychrome and gilt painted white marble sculpture showcasing realistic Tang portraiture and drapery.",
    motifs: ["双手执笏", "折上巾冠", "宽袍大袖彩绘"],
    motifsEn: ["Holding Ritual Tablet", "Folded Official Cap", "Painted Flowing Robes"],
    icon: "User",
    images: ["/src/assets/images/文官.jpg"]
  },
  {
    id: "artifact_military_official",
    title: "Painted White Marble Military Official",
    titleZh: "彩绘汉白玉武官俑",
    x: 70,
    y: 40,
    location: "主室",
    locationEn: "Main Chamber",
    description: "主室随葬的高规格汉白玉武官立俑。武官按剑而立、双目圆睁、甲胄重重，展现守护地宫、护卫长眠的威武仪规。",
    descriptionEn: "Armor-clad military warrior figurine in white marble resting hands on a sword, guarding the tomb owner.",
    excavationInfo: "出土于主室左侧地上，与文官俑一并陈列。汉白玉雕件保存状态极好，表面依然残留少量矿物彩绘痕迹。",
    excavationInfoEn: "Found beside the civil official figurine, exceptionally well preserved with traces of mineral pigment.",
    craftsmanship: "汉白玉石质。盔甲鳞片雕刻得精细入微，按剑的手势苍劲有力，彰显盛晚唐交替时期的军人雄风。",
    craftsmanshipEn: "Exquisitely carved armor scales and authoritative stance demonstrating Tang military prowess.",
    motifs: ["明光铠甲", "按剑抱拳", "怒目威仪"],
    motifsEn: ["Mingguang Armor", "Hand Resting on Sword", "Majestic Guard Stance"],
    icon: "Shield",
    images: ["/src/assets/images/武官.jpg"]
  },
  {
    id: "artifact_camel",
    title: "Sancai Glazed Camel",
    titleZh: "唐三彩双峰驼",
    x: 20,
    y: 80,
    location: "东便房",
    locationEn: "East Side Room",
    description: "高约75厘米，昂首张口，作嘶鸣状。全身施黄、绿、白三彩釉。驼背上驮着丝绸卷、水壶及带有西域胡人面相的行囊，驼身肌肉线条饱满，蹄骨健壮，工艺极高。",
    descriptionEn: "75cm tri-color Sancai camel carrying silk rolls, water flasks, and Central Asian monster-mask bags, symbolizing Silk Road trade.",
    excavationInfo: "出土于东便房陪葬品堆中。作为丝绸之路的象征，三彩骆驼是唐代高等级墓葬的标志性随葬品，展现了大唐与西域诸国的密切商贸往来。",
    excavationInfoEn: "Unearthed in the east side room. A iconic symbol of Silk Road commerce and high-rank Tang burial status.",
    craftsmanship: "采用二次烧成工艺，先素烧，再施釉，在800度低温中烧制。釉色在烧制中自然流淌交融，形成丰富璀璨的层次。",
    craftsmanshipEn: "Double-fired lead-glazed earthenware with flowing yellow, green, and white lead glazes.",
    motifs: ["胡人兽面纹驮囊", "丝路绸缎卷包", "流淌三彩铅釉"],
    motifsEn: ["Monster Mask Saddlebag", "Silk Road Fabric Rolls", "Splashed Sancai Glazes"],
    icon: "Compass"
  },
  {
    id: "artifact_beast",
    title: "Tomb Guardian Beast",
    titleZh: "唐三彩兽面镇墓兽",
    x: 80,
    y: 80,
    location: "西便房",
    locationEn: "West Side Room",
    description: "人面兽身，头戴双角，生有双翅，蹲坐在高台上。面目狰狞，瞋目张口，身躯上涂有鲜艳的斑斓釉色，威严而恐怖，意在驱辟邪魔、护卫墓主亡魂安宁。",
    descriptionEn: "Sancai glazed guardian creature with horns and wings sitting on a pedestal to ward off evil spirits from the tomb.",
    excavationInfo: "与人面镇墓兽对称放置于西侧便房门口。其体型高大，胎质洁白坚硬，釉彩保存完好，釉色流淌匀称，是盛唐三彩造像的代表作。",
    excavationInfoEn: "Placed symmetrically at the west side room entrance. Well-preserved white clay body with vibrant flowing glazes.",
    craftsmanship: "雕塑成型与注浆成型结合，翅膀与角单独捏塑拼接。面部施以彩绘以保留威严神态，身上则流挂厚釉，威风凛凛。",
    craftsmanshipEn: "Hand-molded and glazed earthenware with separate wings and horns attached before firing.",
    motifs: ["怒目金刚面相", "火焰状双翼纹", "祥云形高坐台面"],
    motifsEn: ["Ferocious Guardian Face", "Flame-Shaped Wings", "Auspicious Cloud Pedestal"],
    icon: "ShieldAlert"
  }
];

export const RESTORATION_STEPS: RestorationStep[] = [
  {
    stepIndex: 1,
    name: "Cleaning",
    nameZh: "除尘清理 · 毛刷拂垢",
    tool: "brush",
    instruction: "请选择【软毛古风刷】，在壁画表面污垢处轻柔拂拭。去除千年来堆积的泥沙与浮尘，使掩盖的底色和壁画轮廓重新显现。",
    instructionEn: "Select the [Soft Goat Hair Brush] and stroke gently along the dirty areas. Remove centuries of sand and dust to reveal underlying colors and outlines.",
    completedText: "除尘完成！千年污垢尽去，沉睡的唐代色彩和初稿线条开始显露生机。",
    completedTextEn: "Dusting complete! Millennial dirt cleared, awakening the sleeping Tang Dynasty colors and initial draft lines."
  },
  {
    stepIndex: 2,
    name: "Consolidation",
    nameZh: "灌浆加固 · 粘合碎片",
    tool: "glue",
    instruction: "请选择【骨胶粘合剂】，小心滴入壁画开裂、剥落的缝隙边缘。按压翘角，让剥离的泥灰岩体与墓室砖墙重新牢固粘结。",
    instructionEn: "Select [Bone Glue Syringe], target fissure gaps and hollow voids. Press gently to bond peeling plaster back to brick walls.",
    completedText: "加固完成！空鼓与裂隙已被天然骨胶彻底渗透，壁画基底重回稳固状态。",
    completedTextEn: "Consolidation complete! Hollow voids and fissures fully penetrated by natural bone glue, restoring structural stability."
  },
  {
    stepIndex: 3,
    name: "Coloration",
    nameZh: "矿物补色 · 重现华彩",
    tool: "paint",
    instruction: "请选择【天青与朱砂颜料】，对斑驳褪色的衣褶、马身区域进行色敷过渡。遵循‘修旧如旧’原则，用古法矿物颜料复原其浓郁色泽。",
    instructionEn: "Select [Cinnabar & Malachite Pigments], inpainting faded garments and horses following minimal intervention principles.",
    completedText: "补色完成！朱砂之烈、石绿之幽重回墙面，画中人物与神驹瞬间焕发出盛唐的秾丽气度。",
    completedTextEn: "Inpainting complete! Fiery cinnabar and deep malachite return to walls, re-awakening grand Tang magnificence."
  },
  {
    stepIndex: 4,
    name: "Redrawing",
    nameZh: "断线勾勒 · 补纹描线",
    tool: "pen",
    instruction: "请选择【古法毫笔】，蘸取黑墨。沿残留的淡弱线条，对宫女的五官轮廓、马匹鬃毛进行细致的描黑勾线，令其神采重现。",
    instructionEn: "Select [Fine Ink Brush] with Huizhou ink. Carefully trace faint line remnants on lady facial features and horse manes.",
    completedText: "勾线描纹完成！铁画银钩的‘曹衣出水，吴带当风’笔意再度复苏，线条挺拔神采奕奕。",
    completedTextEn: "Tracing complete! Iron-line brushwork restored to life with supple elegance and posture."
  },
  {
    stepIndex: 5,
    name: "Fixation",
    nameZh: "喷涂封护 · 整体固色",
    tool: "varnish",
    instruction: "请选择【天然固色封剂】，在整幅壁画表面进行均匀喷涂封护。隔离空气，确保历经千辛万苦修复的色彩不再褪色与剥落。",
    instructionEn: "Select [Natural Sealant Spray] to evenly coat the mural surface. Isolating air and locking in restored colors permanently.",
    completedText: "封护固色圆满成功！整幅大唐壁画绽放出夺目而温润的华彩，完成了跨越千年的数字新生！",
    completedTextEn: "Fixation successful! The Tang mural radiates glowing luster, achieving digital rebirth across millennia!"
  }
];
