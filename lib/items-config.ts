export const ITEM_CATEGORIES = {
  sofa: {
    name: "沙發類",
    items: [
      { value: "single_sofa", label: "單座位沙發" },
      { value: "two_seat_sofa", label: "二座位沙發" },
      { value: "three_seat_sofa", label: "三座位沙發" },
      { value: "sectional_sofa", label: "組合沙發" },
      { value: "wooden_sofa", label: "木沙發" },
    ],
  },
  bed: {
    name: "床類",
    items: [
      { value: "single_bed", label: "單人床" },
      { value: "double_bed", label: "雙人床", needsSize: true },
      { value: "hydraulic_bed", label: "油壓床" },
      { value: "bunk_bed", label: "上下格床" },
      { value: "trundle_bed", label: "子母床" },
      { value: "baby_bed", label: "嬰兒床" },
      { value: "mattress", label: "床褥" },
    ],
  },
  table: {
    name: "桌椅類",
    items: [
      { value: "dining_table", label: "餐桌" },
      { value: "coffee_table_large", label: "大茶几" },
      { value: "coffee_table_small", label: "小茶几" },
      { value: "marble_table", label: "雲石茶几" },
      { value: "study_desk", label: "書桌" },
      { value: "computer_desk", label: "電腦桌" },
      { value: "dressing_table", label: "梳妝台" },
      { value: "children_table_chair", label: "兒童桌椅" },
      { value: "long_table", label: "長桌/板" },
    ],
  },
  cabinet: {
    name: "櫃類",
    items: [
      { value: "wardrobe_3ft", label: "3呎衣櫃" },
      { value: "wardrobe_4ft", label: "4呎衣櫃" },
      { value: "wardrobe_5ft", label: "5呎衣櫃" },
      { value: "wooden_cabinet", label: "木櫃", needsCapacity: true },
      { value: "glass_cabinet", label: "玻璃櫃", needsCapacity: true },
      { value: "bookshelf", label: "書櫃", needsCapacity: true },
      { value: "two_door_cabinet", label: "二門櫃" },
      { value: "appliance_cabinet", label: "組合電器櫃" },
      { value: "magazine_rack", label: "雜誌架" },
      { value: "av_cabinet", label: "影音櫃" },
      { value: "cd_rack", label: "CD架/櫃" },
      { value: "shelf", label: "層架" },
    ],
  },
  appliance_large: {
    name: "大型電器",
    items: [
      { value: "refrigerator", label: "雪櫃", needsSize: true },
      { value: "washing_machine", label: "洗衣機" },
      { value: "dryer", label: "乾衣機" },
      { value: "air_conditioner", label: "冷氣機" },
      { value: "dehumidifier", label: "抽濕機" },
    ],
  },
  appliance_small: {
    name: "小型電器",
    items: [
      { value: "microwave", label: "微波爐" },
      { value: "dvd_player", label: "DVD機" },
      { value: "rice_cooker", label: "電飯煲" },
      { value: "kettle", label: "水��" },
      { value: "fan", label: "風扇" },
      { value: "electric_fan", label: "電風扇" },
      { value: "heater", label: "暖爐" },
      { value: "iron_board", label: "熨斗/熨板" },
      { value: "hot_pot", label: "打邊爐" },
    ],
  },
  electronics: {
    name: "電子產品",
    items: [
      { value: "tv", label: "電視機", needsSize: true },
      { value: "computer", label: "電腦" },
      { value: "typewriter", label: "打字機" },
    ],
  },
  others: {
    name: "其他物品",
    items: [
      { value: "photo_frame", label: "相架/畫/鏡" },
      { value: "suitcase", label: "旅行箱" },
      { value: "plant", label: "盆栽" },
      { value: "daily_items", label: "日用品" },
      { value: "boxes", label: "封裝箱" },
    ],
  },
}

export const BUILDING_TYPES = [
  { value: "ground_floor", label: "一樓/沒有電梯" },
  { value: "second_floor_no_elevator", label: "二樓/大廈沒有升降機設備" },
  { value: "elevator_no_direct_access", label: "有升降機，但搬運時不能直接到達該層" },
  { value: "stairs_only", label: "只有樓梯" },
  { value: "elevator_size_limit", label: "升降機出口有尺寸限制" },
  { value: "narrow_entrance", label: "入口窄小" },
  { value: "village_house", label: "村屋" },
  { value: "other", label: "其他" },
]
