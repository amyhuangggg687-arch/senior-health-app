import { VideoContent } from '../types';

export const MOCK_VIDEOS: VideoContent[] = [
  {
    id: 'v1',
    title: '家常红烧肉：软糯入味，入口即化',
    thumbnail: 'https://images.pexels.com/photos/262973/pexels-photo-262973.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'https://player.vimeo.com/external/494191319.sd.mp4?s=14a84e604f86d634d284a7374b786c6739668d27&profile_id=165&oauth2_token_id=57447761',
    author: '美食达人小张',
    likes: 1240,
    description: '经典的红烧肉做法，肥而不腻。',
    ingredients: ['五花肉', '冰糖', '生抽', '老抽', '八角', '桂皮']
  },
  {
    id: 'v2',
    title: '清蒸鲈鱼：鲜美嫩滑，营养丰富',
    thumbnail: 'https://images.pexels.com/photos/229789/pexels-photo-229789.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'https://player.vimeo.com/external/449176378.sd.mp4?s=d009b0b4a441e8c8577e3f89a918a24ed4b6f007&profile_id=165&oauth2_token_id=57447761',
    author: '健康大厨',
    likes: 850,
    description: '最适合老年人的清淡做法。',
    ingredients: ['鲈鱼', '葱姜', '蒸鱼豉油', '食用油']
  },
  {
    id: 'v3',
    title: '香菇炖鸡汤：滋补养生首选',
    thumbnail: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'https://player.vimeo.com/external/371434639.sd.mp4?s=1f1e944f21464c0dc54ec6576628db94f6c4fffd&profile_id=165&oauth2_token_id=57447761',
    author: '养生堂',
    likes: 2100,
    description: '慢火细炖，汤鲜味美。',
    ingredients: ['三黄鸡', '干香菇', '红枣', '枸杞', '姜片']
  }
];
