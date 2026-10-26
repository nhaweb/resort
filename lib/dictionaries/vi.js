/** @type {import('./types').Dictionary} */
const vi = {
  meta: {
    title: "Orilla · Chín biệt thự trong một vịnh đá riêng",
    description:
      "Chín biệt thự đá vôi bên vịnh kín. Ở đây ngày dài theo thủy triều, không theo đồng hồ.",
  },
  ui: {
    skipToContent: "Chuyển tới nội dung chính",
    loadingOrilla: "Đang tải Orilla",
    loadingPlace: "Costa Blanca",
    enquire: "Đặt phòng",
    menu: "Mở menu",
    close: "Đóng",
    primaryNav: "Menu chính",
    language: "Chọn ngôn ngữ",
    heroAlt: "Vịnh đá nhạt, nước phẳng và ánh chiều vàng giữa hai vách đá",
    introClipCaption: "Ngoài vịnh là biển mở — cùng một thứ ánh sáng ấy.",
    seaClipAlt: "Sóng vỗ nhẹ trên bãi cát",
    showcaseTitle: "Chín biệt thự",
    showcaseIntro: "Mỗi căn quay mặt về một khoảng khác của vịnh.",
    tideTitle: "Theo ánh sáng mà ở",
    tideLead:
      "Vịnh đổi sắc theo giờ. Chọn khung giờ để biết lúc nào lối đá mở, và căn nào đang ngập nắng.",
    tideLegend: "Khung giờ trong ngày",
    galleryOpen: "Xem ảnh {id} — {caption}",
    galleryClose: "Đóng ảnh",
    previous: "Ảnh trước",
    next: "Ảnh sau",
    footerVisit: "Địa chỉ",
    footerExplore: "Trên trang",
    footerContact: "Liên hệ",
    footerHours: "Giờ giấc",
    footerLegal: "© 2026 Orilla · Concept khu nghỉ · Nội dung minh họa",
    footerImagery: "Ảnh",
    footerFootage: "Phim",
    footerFootageCredit:
      "“Ocean waves at Lækjavik beach, Iceland” của Alexander Grebenkov",
    footerStillsNote: "Ảnh tĩnh được tạo riêng cho concept này.",
    footerPolicies: "Quy định",
    footerPrivacy: "Quyền riêng tư",
  },
  site: {
    name: "Orilla",
    tagline: "Chín biệt thự trong một vịnh đá riêng",
    email: "stay@orilla.com",
    phone: "+34 612 00 00 00",
    address: ["Cala Orilla", "Costa Blanca, Tây Ban Nha"],
    hours: [
      { days: "Nhận phòng", time: "15:00–19:00" },
      { days: "Trả phòng", time: "trước 11:00" },
      { days: "Nhà bếp", time: "07:30–22:00" },
    ],
    boat: "Từ cảng ra vịnh khoảng mười tám phút thuyền",
  },
  nav: [
    { href: "/rooms", label: "Biệt thự" },
    { href: "/gallery", label: "Hình ảnh" },
    { href: "/book", label: "Đặt phòng" },
  ],
  hero: {
    title: "Chín căn trong đá",
    under: "Một vịnh kín trên Costa Blanca — chỉ dành cho người ở lại.",
    support:
      "Ngày ở đây trôi theo thủy triều. Không lịch trình. Không đông đúc.",
    cta: "Chọn biệt thự",
    ctaHref: "/rooms",
  },
  intro: {
    title: "Vịnh nằm trong lòng đá",
    body: "Vịnh quay mặt đông. Sáng sớm, nắng chạm nước trước rồi leo dần lên vách đá; đến khi mọi sân thượng nhuộm một màu đá vôi ấm. Người ta đến vì nhịp ánh sáng chậm ấy — và vì con đường đá chỉ lộ ra khi nước rút.",
    image: {
      src: "/images/orilla-shore.jpg",
      alt: "Bờ cát sáng giữa hai vách đá vôi trên mặt vịnh lặng",
    },
  },
  villas: [
    {
      id: "east-cut",
      name: "East Cut",
      line: "Mặt trời mọc ngay trước cửa biển.",
      materials: "Đá vôi · vải lanh · đồng",
      aspect: "east",
      image: "/images/orilla-villa-interior.jpg",
      alt: "Phòng ngủ với ga trải vải lanh và cửa sổ mở ra biển",
      description:
        "East Cut quay mặt ra biển mở, nên tia nắng đầu tiên chạm vào giường trước khi tới vịnh. Một bức tường đá vôi thấp bao lấy sân thượng, và cánh cửa đồng gập lại để căn phòng mở ra không khí buổi sớm. Đây là căn yên nhất lúc bình minh và cũng ấm lên đầu tiên.",
      amenities: [
        "Giường king",
        "Sân thượng nhìn biển",
        "Vòi sen mưa",
        "Ga giường vải lanh",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-shore.jpg",
          alt: "Bờ cát sáng bên dưới biệt thự lúc bình minh",
        },
      ],
    },
    {
      id: "shelf",
      name: "The Shelf",
      line: "Sân nằm ngang mực nước.",
      materials: "Travertine · gỗ óc chó · vải lanh",
      aspect: "south",
      image: "/images/orilla-pool.jpg",
      alt: "Hồ nhỏ ven vách đá nhìn xuống vịnh xanh lúc chiều tối",
      description:
        "The Shelf nằm cao hơn mặt nước vài bậc, với hồ nhỏ khoét ngay trong sân đá. Khi nước lên, biển gần như chạm tới mép hồ. Đồ gỗ óc chó và sàn travertine giữ cho phòng mát suốt buổi chiều.",
      amenities: [
        "Hồ bơi nhỏ riêng",
        "Sân thượng nhìn biển",
        "Giường king",
        "Vòi sen ngoài trời",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-tide-steps.jpg",
          alt: "Bậc đá vôi dẫn từ sân xuống vùng nước nông",
        },
      ],
    },
    {
      id: "high-ledge",
      name: "High Ledge",
      line: "Có gió, có bóng mát, và chân trời dài.",
      materials: "Đá · gỗ teak · đồng",
      aspect: "west",
      image: "/images/orilla-cliff-portrait.jpg",
      alt: "Vách đá vôi với những khoảng mở nhìn ra biển",
      description:
        "High Ledge được khoét vào phần cao của vách đá, với những ô mở sâu che nắng cho phòng và đón gió biển. Chân trời trải dài suốt chiều ngang sân thượng. Cuối chiều, đá chuyển màu vàng và mặt trời lặn ngay phía trước giường.",
      amenities: [
        "Sân thượng trên vách",
        "Giường king",
        "Sạp nằm gỗ teak",
        "Ngắm hoàng hôn",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-aerial.jpg",
          alt: "Nhìn từ trên cao: vịnh và các biệt thự dọc vách đá",
        },
      ],
    },
    {
      id: "low-path",
      name: "Low Path",
      line: "Bậc đá dẫn xuống vịnh khi nước cạn.",
      materials: "Đá vôi · dây thừng · gỗ teak",
      aspect: "east",
      image: "/images/orilla-tide-steps.jpg",
      alt: "Bậc đá vôi bước xuống vùng nước nông trong",
      description:
        "Low Path mở thẳng ra bậc đá khi nước rút. Khi nước xuống, bậc thang hiện ra và bạn có thể đi chân trần xuống vùng nước nông mà không phải rời biệt thự. Phòng giản dị và mát, dành cho đôi chân đầy cát và khăn ướt.",
      amenities: [
        "Bậc đá xuống biển riêng",
        "Giường queen",
        "Sân thượng nhìn biển",
        "Vòi sen ngoài trời",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-shore.jpg",
          alt: "Vùng nước nông phẳng lặng dọc bờ vịnh",
        },
      ],
    },
    {
      id: "dining-house",
      name: "Dining House",
      line: "Một bàn dài cho cả vịnh.",
      materials: "Đá · vải lanh · ánh nến",
      aspect: "south",
      image: "/images/orilla-dining.jpg",
      alt: "Sân ăn ngoài trời nhìn biển lúc trời vừa tối",
      description:
        "Dining House là căn lớn nhất, xây quanh chiếc bàn dài nơi cả vịnh quây quần mỗi tối. Khách ở đây là chủ của bữa tối: nhà bếp bày bàn ngoài sân và nến được thắp lúc chạng vạng. Hai phòng ngủ cùng mở ra một sân thượng.",
      amenities: [
        "Hai phòng ngủ",
        "Sân ăn riêng",
        "Bữa tối từ nhà bếp",
        "Sân thượng nhìn biển",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-villa-interior.jpg",
          alt: "Phòng ngủ với ga vải lanh và cửa sổ nhìn ra biển",
        },
      ],
    },
    {
      id: "bath-house",
      name: "Bath House",
      line: "Hơi nóng, mặt đá, và một khung cửa biển.",
      materials: "Travertine · đồng · vải lanh",
      aspect: "west",
      image: "/images/orilla-bath.jpg",
      alt: "Phòng tắm đá travertine với đồ đồng và cửa sổ biển",
      description:
        "Bath House đặt phòng tắm vào trung tâm kỳ nghỉ. Một bồn tắm đá sâu nằm dưới ô cửa rộng nhìn ra biển, cạnh phòng xông hơi khoét vào vách. Phòng ngủ nhỏ và yên, đón ánh sáng phía tây đẹp nhất mỗi chiều.",
      amenities: [
        "Bồn tắm đá",
        "Phòng xông hơi",
        "Giường king",
        "Cửa sổ nhìn biển",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-shore.jpg",
          alt: "Bờ vịnh yên tĩnh giữa những vách đá vôi sáng",
        },
      ],
    },
    {
      id: "north-cut",
      name: "North Cut",
      line: "Chiều thì mát bóng; đêm thì đầy sao.",
      materials: "Đá vôi · vải lanh · gỗ teak",
      aspect: "north",
      image: "/images/orilla-shore.jpg",
      alt: "Bờ vịnh phẳng giữa những vách đá vôi",
      description:
        "North Cut nằm trong bóng vách đá nên mát suốt buổi chiều. Phía sau là mũi đất không đèn, nên từ sân thượng bầu trời đêm rất trong. Căn phù hợp với ai thích bóng mát và sự yên tĩnh hơn là nắng.",
      amenities: [
        "Sân thượng có bóng mát",
        "Giường king",
        "Sàn ngắm sao",
        "Vòi sen mưa",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-cliff-portrait.jpg",
          alt: "Những ô mở khắc trên đá vôi phía trên mặt nước",
        },
      ],
    },
    {
      id: "mid-terrace",
      name: "Mid Terrace",
      line: "Giữa vách đá — gió và nước cùng lúc.",
      materials: "Đá · đồng · vải lanh",
      aspect: "south",
      image: "/images/orilla-aerial.jpg",
      alt: "Nhìn từ trên cao: vịnh đá vôi và những biệt thự ven vách",
      description:
        "Mid Terrace nằm lưng chừng vách đá, nhìn thấy cả vịnh lẫn biển mở. Gió lùa qua phòng hầu như mỗi ngày, và sân thượng giữ nắng chiều. Một lối bậc đá nối căn này xuống mặt nước bên dưới.",
      amenities: [
        "Sân thượng toàn cảnh",
        "Giường king",
        "Hồ bơi nhỏ riêng",
        "Lối đá xuống vịnh",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-pool.jpg",
          alt: "Hồ nhỏ phía trên vịnh lúc chiều tối",
        },
      ],
    },
    {
      id: "last-light",
      name: "Last Light",
      line: "Căn cuối cùng trước mũi đất.",
      materials: "Gỗ óc chó · travertine · đồng",
      aspect: "west",
      image: "/images/orilla-hero.jpg",
      alt: "Ánh chiều vàng phủ lên vịnh đá vôi",
      description:
        "Last Light là căn cuối cùng trước mũi đất, tách riêng khỏi những căn còn lại. Căn này giữ nắng lâu nhất, và sân thượng kín ba phía. Gỗ óc chó và travertine cho phòng một cảm giác ấm và yên khi trời tối.",
      amenities: [
        "Sân thượng riêng",
        "Giường king",
        "Hồ bơi nhỏ riêng",
        "Ngắm hoàng hôn",
        "Bữa sáng mỗi ngày",
      ],
      images: [
        {
          src: "/images/orilla-dining.jpg",
          alt: "Sân ăn nhìn xuống vịnh lúc trời vừa tối",
        },
      ],
    },
  ],
  rhythm: {
    title: "Ngày trôi theo nước",
    lead: "Ở Orilla không có khung giờ spa. Chính vịnh quyết định nhịp sống.",
    steps: [
      {
        verb: "Tới",
        text: "Thuyền cắt ngang vịnh trong mười tám phút. Hành lý đi trước; nếu triều cho phép, đoạn đá cuối bạn đi chân không.",
      },
      {
        verb: "Chờ",
        text: "Nước dâng thì lối đóng. Đọc sách, bơi từ thềm đá, ngồi nhìn màu vách đổi dần.",
      },
      {
        verb: "Xuống nước",
        text: "Khi nước rút, bậc đá hiện ra. Mọi người lần lượt xuống vùng nông — như một nghi thức nhỏ của vịnh.",
      },
      {
        verb: "Ở lại",
        text: "Chiều tối, mặt nước chuyển sang màu đồng. Bữa tối chung một bàn. Chín căn, không chen chúc.",
      },
    ],
  },
  gallery: {
    metaTitle: "Hình ảnh · Orilla",
    metaDescription:
      "Đá vôi, mặt nước, và những khoảng bóng mát — hình ảnh vịnh Orilla.",
    eyebrow: "Trong vịnh",
    title: "Đá. Nước. Im lặng.",
    description:
      "Sáu khung hình cùng một cảm giác: đá vôi, mặt nước phẳng, và những khoảng bóng mát được cắt vừa đủ.",
    images: [
      {
        id: "01",
        src: "/images/orilla-aerial.jpg",
        alt: "Nhìn từ trên: vịnh đá vôi với biệt thự nằm dọc vách đá",
        caption: "Ven vách đá",
        aspect: "landscape",
        span: { cols: 8, rows: 2 },
      },
      {
        id: "02",
        src: "/images/orilla-bath.jpg",
        alt: "Bồn tắm đá mở ra khung cửa biển",
        caption: "Phòng tắm đá",
        aspect: "landscape",
        span: { cols: 4, rows: 1 },
      },
      {
        id: "03",
        src: "/images/orilla-tide-steps.jpg",
        alt: "Bậc đá bước xuống nước trong",
        caption: "Bậc khi nước rút",
        aspect: "landscape",
        span: { cols: 4, rows: 1 },
      },
      {
        id: "04",
        src: "/images/orilla-villa-interior.jpg",
        alt: "Phòng trong biệt thự với ánh sáng biển dịu",
        caption: "Trong nhà",
        aspect: "portrait",
        span: { cols: 4, rows: 1 },
      },
      {
        id: "05",
        src: "/images/orilla-pool.jpg",
        alt: "Hồ nhỏ trên vách đá lúc trời vừa tối",
        caption: "Hồ trên vách",
        aspect: "landscape",
        span: { cols: 5, rows: 1 },
      },
      {
        id: "06",
        src: "/images/orilla-dining.jpg",
        alt: "Sân ăn chiều nhìn xuống vịnh",
        caption: "Bàn chiều",
        aspect: "portrait",
        span: { cols: 3, rows: 1 },
      },
    ],
  },
  about: {
    title: "Chín căn. Một vịnh.",
    lead: "Orilla không phải một cánh khách sạn. Không nhận khách trong ngày. Nhà bếp, thuyền và lối xuống vịnh chỉ dành cho những ai ngủ lại trong đá.",
    facts: [
      { label: "Biệt thự", value: "9" },
      { label: "Thuyền", value: "18 phút" },
      { label: "Mùa mở", value: "T4–T10" },
      { label: "Giá từ", value: "€680 / đêm" },
    ],
    image: {
      src: "/images/orilla-aerial.jpg",
      alt: "Toàn cảnh vịnh đá vôi và biệt thự ven vách",
    },
    tile: {
      src: "/images/orilla-cliff-portrait.jpg",
      alt: "Cận cảnh những khoảng mở khắc trên đá vôi phía trên mặt nước",
    },
  },
  tides: [
    {
      id: "morning",
      label: "Sáng sớm",
      hours: "06:00–10:00",
      path: "Lối thấp đang mở. Bậc đá trống — lúc đẹp để xuống nước yên.",
      light: "Các căn hướng đông nhận nắng đầu tiên trên mặt nước.",
      recommend: ["East Cut", "Low Path"],
      image: "/images/orilla-shore.jpg",
    },
    {
      id: "noon",
      label: "Giữa ngày",
      hours: "11:00–15:00",
      path: "Nước cao, lối đóng. Bơi từ thềm đá thay vì đi bộ xuống vịnh.",
      light: "Sân hướng nam nằm trong bóng mát dưới mép vách.",
      recommend: ["The Shelf", "Dining House"],
      image: "/images/orilla-pool.jpg",
    },
    {
      id: "dusk",
      label: "Chiều muộn",
      hours: "17:30–20:00",
      path: "Nước rút dần. Lối mở lại — lúc đẹp để bơi khi mặt nước chuyển màu đồng.",
      light: "Các căn hướng tây ấm lên; nước nhuốm sắc đồng.",
      recommend: ["High Ledge", "Bath House"],
      image: "/images/orilla-dining.jpg",
    },
    {
      id: "night",
      label: "Đêm",
      hours: "21:00–00:00",
      path: "Lối được thắp bằng những điểm đèn đồng thấp dọc đá.",
      light: "Chỉ còn đèn trong nhà. Ngoài vịnh tối và rất yên.",
      recommend: ["Bath House", "Dining House"],
      image: "/images/orilla-villa-interior.jpg",
    },
  ],
  faq: {
    title: "Trước khi bạn tới",
    facts: [
      "Cala Orilla, Costa Blanca",
      "Thuyền từ cảng — khoảng 18 phút",
      "Ưu tiên người lớn · trẻ em theo thỏa thuận trước",
    ],
    items: [
      {
        q: "Mình đến Orilla bằng cách nào?",
        a: "Chúng tôi đón bạn ở cảng. Thuyền chạy theo thời tiết và thủy triều. Xe để lại đất liền.",
      },
      {
        q: "Có thể chỉ ghé ăn một bữa được không?",
        a: "Không. Orilla chỉ dành cho khách ở lại qua đêm — để vịnh được giữ yên.",
      },
      {
        q: "Giá phòng gồm những gì?",
        a: "Biệt thự, dọn phòng mỗi ngày, bữa sáng, thuyền đưa đón, và lối đá xuống vịnh khi nước cho phép.",
      },
      {
        q: "Lối đá mở lúc nào?",
        a: "Thường quanh lúc nước rút, khoảng hai lần mỗi ngày. Giờ cụ thể được ghi mỗi sáng tại thềm đá.",
      },
      {
        q: "Ở tối thiểu bao nhiêu đêm?",
        a: "Form đặt phòng yêu cầu tối thiểu hai đêm. Mùa cao điểm (khoảng tháng 7–8) chúng tôi ưu tiên ba đêm — hãy email nếu bạn cần ít hơn, chúng tôi sẽ trả lời vịnh có nhận được không.",
      },
      {
        q: "Đây có phải khu nghỉ thật không?",
        a: "Orilla là concept thiết kế cho trang này. Ảnh được tạo cho brief; thanh toán chạy ở chế độ test/demo cho đến khi gắn inventory thật.",
      },
    ],
    imageTall: {
      src: "/images/orilla-cliff-portrait.jpg",
      alt: "Kiến trúc đá vôi cao trên nền biển",
    },
    imageSquare: {
      src: "/images/orilla-tide-steps.jpg",
      alt: "Bậc đá xuống vùng nước nông khi triều thấp",
    },
  },
  cta: {
    title: "Giữ vài đêm trong vịnh",
    body: "Chọn biệt thự, rồi chọn ngày ở, và thanh toán toàn bộ để xác nhận. Giữ chỗ trong mười lăm phút.",
    button: "Chọn biệt thự",
    href: "/rooms",
    image: {
      src: "/images/orilla-hero.jpg",
      alt: "Vịnh đá vôi lúc chiều vàng, nước êm giữa hai vách đá",
    },
  },
  contact: {
    title: "Sắp một kỳ ở lại",
    image: {
      src: "/images/orilla-pool.jpg",
      alt: "Hồ trên vách đá nhìn xuống vịnh",
    },
  },
  rooms: {
    metaTitle: "Biệt thự · Orilla",
    metaDescription:
      "Chín biệt thự đá vôi bên vịnh riêng. Xem từng căn, rồi kiểm tra ngày trống và đặt phòng.",
    title: "Chín biệt thự",
    lead: "Mỗi căn quay mặt về một khoảng khác của vịnh. Chọn một căn, rồi chọn ngày ở.",
    viewVilla: "Xem biệt thự",
    bookThis: "Đặt phòng này",
    changeVilla: "Đổi biệt thự",
    chooseVillaFirst:
      "Hãy bắt đầu bằng việc chọn một biệt thự. Bạn cũng có thể chọn trong danh sách bên dưới.",
    browseRooms: "Xem các biệt thự",
    backToRooms: "Tất cả biệt thự",
    fromRate: "Từ",
    perNight: "đêm",
    rateOnRequest: "Giá hiển thị khi đặt phòng",
    maxGuests: "Tối đa {max} khách",
    guestsLabel: "Số khách",
    amenitiesTitle: "Trong biệt thự",
    materialsTitle: "Chất liệu",
    stayTitle: "Kỳ nghỉ",
    aspectFacing: "Hướng {aspect}",
    aspectEast: "sáng đông",
    aspectWest: "sáng tây",
    aspectSouth: "sáng nam",
    aspectNorth: "bóng mát bắc",
    coveTitle: "Dưới sân thượng",
    coveLead:
      "Cùng một mặt nước mọi biệt thự chia sẻ — êm buổi sáng, đồng thau lúc chạng vạng.",
    coveClipAlt: "Sóng biển trên bờ Costa Blanca",
    relatedTitle: "Cùng hướng sáng",
    relatedLead: "Những biệt thự khác bắt cùng hướng ánh sáng của vịnh.",
    closeTitle: "Giữ những đêm này",
    closeBody:
      "Kiểm tra ngày trống cho {name}. Một biệt thự, đêm rõ ràng, thanh toán đủ.",
    soldOutTitle: "Các ngày này đã kín",
    soldOutBody:
      "Hãy để lại lời nhắn, chúng tôi sẽ gửi email về những đêm gần nhất còn trống của căn này, hoặc một căn khác phù hợp.",
    enquiryName: "Họ tên",
    enquiryEmail: "Email",
    enquiryMessage: "Lời nhắn (tuỳ chọn)",
    enquirySubmit: "Gửi yêu cầu",
    enquirySending: "Đang gửi…",
    enquirySuccess: "Cảm ơn bạn. Chúng tôi sẽ trả lời qua email sớm.",
    enquiryError:
      "Không gửi được yêu cầu. Hãy thử lại hoặc gửi email cho chúng tôi.",
  },
  booking: {
    metaTitle: "Đặt phòng · Orilla",
    metaDescription:
      "Kiểm tra còn phòng, giữ ngày, và thanh toán an toàn cho kỳ nghỉ tại Orilla.",
    title: "Đặt vài đêm",
    lead: "Một biệt thự, ngày rõ ràng, thanh toán đủ. Vịnh yên vì chúng tôi không overbook.",
    fields: {
      villa: "Biệt thự",
      checkIn: "Nhận phòng",
      checkOut: "Trả phòng",
      guests: "Số khách",
      name: "Họ tên",
      email: "Email",
      phone: "Điện thoại (tuỳ chọn)",
    },
    night: "đêm",
    maxGuests: "Tối đa {max} khách",
    summaryTitle: "Tổng kỳ ở",
    summaryHint: "Chọn ngày để xem giá toàn bộ kỳ nghỉ.",
    nightsLabel: "{n} đêm · thanh toán đủ",
    fullStayNote:
      "Thanh toán cover toàn bộ kỳ ở. MVP không hỗ trợ chỉ đặt cọc.",
    holdNote:
      "Giữ chỗ thành công sẽ khóa biệt thự trong {minutes} phút để bạn thanh toán.",
    minStayNote:
      "Tối thiểu hai đêm. Mùa cao điểm chúng tôi ưu tiên ba đêm — quy định lưu trú nói rõ cách hỏi.",
    termsLead: "Tôi đã đọc và đồng ý với",
    termsLink: "quy định lưu trú",
    checking: "Đang kiểm tra phòng trống…",
    loadingVillas: "Đang tải biệt thự…",
    selectedVilla: "Biệt thự của bạn",
    selectPlaceholder: "Chọn biệt thự",
    payCta: "Giữ chỗ & thanh toán",
    holding: "Đang tạo giữ chỗ…",
    redirecting: "Đang chuyển tới thanh toán…",
    backHome: "Về Orilla",
    tryAgain: "Thử đặt lại",
    cancelledNotice:
      "Bạn đã hủy thanh toán. Giữ chỗ có thể vẫn còn — hãy thử lại.",
    errors: {
      loadVillas: "Không tải được danh sách biệt thự.",
      dbHint:
        "Kiểm tra BOOKING_STORE / DATABASE_URL. Với Postgres: docker compose up -d, rồi npm run db:migrate && npm run db:seed.",
      availability: "Không kiểm tra được lịch trống.",
      pickVilla: "Hãy chọn biệt thự.",
      unavailable: "Các ngày này không còn trống.",
      tooManyGuests: "Biệt thự này tối đa {max} khách.",
      create: "Không tạo được đặt phòng.",
      pay: "Không bắt đầu được thanh toán.",
      missingReservation: "Thiếu mã đặt phòng.",
      loadReservation: "Không tải được đặt phòng.",
      invalidDates: "Ngày nhận phòng hoặc trả phòng không hợp lệ.",
      pastCheckIn: "Ngày nhận phòng phải là hôm nay hoặc muộn hơn.",
      minStay: "Ở tối thiểu {n} đêm.",
      acceptTerms: "Hãy đồng ý với quy định lưu trú trước khi thanh toán.",
    },
    success: {
      metaTitle: "Xác nhận đặt phòng · Orilla",
      loading: "Đang xác nhận kỳ ở…",
      paidEyebrow: "Đã xác nhận",
      paidTitle: "Bạn đã đặt phòng",
      paidBody:
        "Đã nhận thanh toán. Giữ mã này cho lúc nhận phòng và thuyền từ cảng.",
      pendingEyebrow: "Đang chờ",
      pendingTitle: "Chưa xác nhận thanh toán",
      pendingBody:
        "Nếu vừa thanh toán, hãy đợi rồi tải lại. Nếu không, hãy đặt lại.",
      mockNote: "Chế độ thanh toán demo — không trừ tiền thật.",
      reference: "Mã đặt phòng",
    },
  },
  policies: {
    metaTitle: "Quy định lưu trú · Orilla",
    metaDescription:
      "Số đêm tối thiểu, thanh toán đủ, giữ chỗ, đổi ngày và giờ đến của Orilla.",
    title: "Quy định lưu trú",
    lead: "Những gì form đặt phòng thực sự chặn, và cách đổi kỳ ở sau khi đã thanh toán.",
    sections: [
      {
        title: "Số đêm tối thiểu",
        body: "Form nhận từ hai đêm trở lên. Mùa cao điểm, khoảng tháng 7 và tháng 8, chúng tôi ưu tiên ba đêm. Nếu những tháng đó bạn cần ít hơn ba đêm, hãy email {email} — chúng tôi sẽ trả lời vịnh có nhận được không. Dưới hai đêm không đặt trực tuyến được.",
      },
      {
        title: "Thanh toán",
        body: "Bạn thanh toán toàn bộ kỳ ở để xác nhận. Không có lựa chọn chỉ đặt cọc. Sau khi gửi, chúng tôi giữ biệt thự trong mười lăm phút để bạn hoàn tất thanh toán. Nếu rời trang thanh toán, giữ chỗ có thể vẫn còn đến khi hết hạn.",
      },
      {
        title: "Hủy và đổi ngày",
        body: "Không có nút tự hủy. Muốn đổi ngày hoặc hỏi hoàn tiền sau khi đã thanh toán, hãy email {email}. Chúng tôi trả lời trực tiếp; trang không tự hoàn tiền. Rời trang thanh toán trước khi trả tiền thì kỳ ở chưa được xác nhận.",
      },
      {
        title: "Đến và đi",
        body: "Nhận phòng từ 15:00 đến 19:00. Trả phòng trước 11:00. Chúng tôi đón bạn ở cảng; thuyền đi khoảng mười tám phút, theo thời tiết và thủy triều. Xe để lại đất liền.",
      },
    ],
  },
  privacy: {
    metaTitle: "Quyền riêng tư · Orilla",
    metaDescription:
      "Orilla thu thập những gì khi bạn hỏi phòng hoặc đặt phòng, và ai được xem.",
    title: "Quyền riêng tư",
    lead: "Chúng tôi chỉ giữ những gì cần để giữ biệt thự và đón bạn ở cảng.",
    sections: [
      {
        title: "Chúng tôi thu thập gì",
        body: "Khi bạn đặt phòng hoặc gửi câu hỏi, chúng tôi lưu tên, email, số điện thoại nếu bạn cho, biệt thự, ngày ở và số khách. Thanh toán do đơn vị thanh toán xử lý. Trang này không lưu số thẻ.",
      },
      {
        title: "Để làm gì",
        body: "Để kiểm tra phòng trống, xác nhận kỳ ở, canh giờ thuyền, và trả lời khi ngày đã kín. Tin nhắn hỏi phòng được bàn đặt phòng đọc.",
      },
      {
        title: "Ai được xem",
        body: "Nhân sự Orilla phụ trách đặt phòng, và đơn vị thanh toán xử lý khoản tiền. Chúng tôi không bán thông tin khách.",
      },
      {
        title: "Giữ bao lâu, và hỏi ở đâu",
        body: "Hồ sơ đặt phòng được giữ cho kỳ ở và cho sổ sách. Muốn biết chúng tôi đang giữ gì về bạn, hoặc sửa lại, hãy email {email}.",
      },
    ],
  },
  credits: [
    {
      title: "Ảnh mở đầu vịnh Orilla",
      note: "Tạo cho concept này",
    },
    {
      title: "Biệt thự, hồ, bàn ăn, phòng tắm, góc cao, bờ biển, bậc đá",
      note: "Ảnh minh họa cho brief Orilla",
    },
  ],
};

export default vi;
