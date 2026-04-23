const QUESTIONS = [
  { id: 1, text: "你会下意识用可爱的语气词吗？", weights: { soft: 15, shy: 5, feminine: 10 } },
  { id: 2, text: "拍照时喜欢比耶或者托脸吗？", weights: { soft: 10, feminine: 15 } },
  { id: 3, text: "害怕一个人走夜路吗？", weights: { shy: 10, feminine: 5 } },
  { id: 4, text: "声音比较轻柔或者偏高吗？", weights: { voice: 20 } },
  { id: 5, text: "有时候会觉得当女生更好吗？", weights: { identity: 20 } },
  { id: 6, text: "买衣服会优先看好看而不是实用吗？", weights: { feminine: 15, soft: 5 } },
  { id: 7, text: "容易害羞脸红吗？", weights: { shy: 20 } },
  { id: 8, text: "曾经尝试过女装或者想尝试吗？", weights: { action: 20, feminine: 5 } },
  { id: 9, text: "喜欢可爱的小动物吗？", weights: { soft: 15 } },
  { id: 10, text: "被夸奖的时候会不好意思吗？", weights: { shy: 10, identity: 5 } },
  { id: 11, text: "对化妆、护肤有了解或者感兴趣吗？", weights: { feminine: 15, action: 10 } },
  { id: 12, text: "有人说过你说话很软萌吗？", weights: { voice: 15, soft: 10 } },
  { id: 13, text: "玩游戏会选女性角色吗？", weights: { identity: 15, feminine: 5 } },
  { id: 14, text: "不喜欢和人起冲突吗？", weights: { shy: 10, soft: 5 } },
  { id: 15, text: "会模仿动漫里女孩子的说话方式吗？", weights: { voice: 15, soft: 5 } },
  { id: 16, text: "曾经戴过假发或者头饰吗？", weights: { action: 18, feminine: 7 } },
  { id: 17, text: "吃甜食会开心吗？", weights: { soft: 12 } },
  { id: 18, text: "觉得自己内心更偏向女性吗？", weights: { identity: 20 } },
  { id: 19, text: "走路姿势比较轻盈吗？", weights: { feminine: 10, action: 5 } },
  { id: 20, text: "如果可以的话想变成女孩子吗？", weights: { identity: 15, action: 15, feminine: 10 } }
];

const DIMENSIONS = ['soft', 'shy', 'feminine', 'voice', 'identity', 'action'];
const DIMENSION_NAMES = {
  soft: '软萌度',
  shy: '娇羞度',
  feminine: '女性化',
  voice: '声线天赋',
  identity: '心理认同',
  action: '行动力'
};
