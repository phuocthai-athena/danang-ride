export interface Destination {
  id: string;
  image: string;
  // name/description come from translations
}

export const destinations: Destination[] = [
  { id: "con-market", image: "/images/1_con_market.png" },
  { id: "han-market", image: "/images/2_han_market.png" },
  { id: "linh-ung", image: "/images/3_linh_ung_pagoda.png" },
  { id: "non-nuoc-village", image: "/images/4_non_nuoc_stone_village.png" },
  { id: "marble-mountains", image: "/images/5_marble_mountains.png" },
  { id: "bana-hills", image: "/images/6_ba_na_hills.png" },
  { id: "nui-than-tai", image: "/images/7_nui_than_tai.png" },
  { id: "silk-village", image: "/images/8_silk_village.png" },
  { id: "bay-mau-coconut", image: "/images/9_bay_mau_coconut_forest.png" },
  { id: "hoi-an", image: "/images/10_hoi_an_ancient_town.png" },
  { id: "cham-islands", image: "/images/11_cham_islands.png" },
  { id: "vinwonder", image: "/images/12_vinwonder_nam_hoi_an.png" },
  { id: "my-son", image: "/images/13_my_son_sanctuary.png" },
  { id: "hue-imperial", image: "/images/14_hue_imperial_city.png" },
  { id: "minh-mang-tomb", image: "/images/15_minh_mang_tomb.png" },
  { id: "tu-duc-tomb", image: "/images/16_tu_duc_tomb.png" },
  { id: "thien-mu-pagoda", image: "/images/17_thien_mu_pagoda.png" },
  { id: "dong-ba-market", image: "/images/18_dong_ba_market.png" },
  { id: "hue-cuisine", image: "/images/19_hue_cuisine.png" },
];

// Social links mapped to QR codes on each poster image
// Bottom row order (left to right): WeChat, LINE, WhatsApp, KakaoTalk
export const socialLinks = {
  wechat: { id: "wxid_kdx5d9í9xgc12", type: "copy" as const },
  line: { url: "https://line.me/ti/p/VQZdLvK_Ve", type: "link" as const },
  whatsapp: { url: "https://wa.me/84788030997", type: "link" as const },
  kakaotalk: { url: "kakaoplus://plusfriend/friend/@Jimmy2903", type: "link" as const },
};
