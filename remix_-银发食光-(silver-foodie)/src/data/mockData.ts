import { VideoContent } from '../types';

export const MOCK_VIDEOS: VideoContent[] = [
  {
    id: 'v1',
    title: '家常红烧肉：软糯入味，入口即化',
    thumbnail: 'https://picsum.photos/seed/pork/400/600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: '美食达人小张',
    likes: 1240,
    description: '经典的红烧肉做法，肥而不腻。',
    ingredients: ['五花肉', '冰糖', '生抽', '老抽', '八角', '桂皮']
  },
  {
    id: 'v2',
    title: '清蒸鲈鱼：鲜美嫩滑，营养丰富',
    thumbnail: 'https://picsum.photos/seed/fish/400/600',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    author: '健康大厨',
    likes: 850,
    description: '最适合老年人的清淡做法。',
    ingredients: ['鲈鱼', '葱姜', '蒸鱼豉油', '食用油']
  },
  {
    id: 'v3',
    title: '香菇炖鸡汤：滋补养生首选',
    thumbnail: 'https://picsum.photos/seed/soup/400/600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: '养生堂',
    likes: 2100,
    description: '慢火细炖，汤鲜味美。',
    ingredients: ['三黄鸡', '干香菇', '红枣', '枸杞', '姜片']
  }
];
