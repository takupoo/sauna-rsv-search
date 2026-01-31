// サウナ整作所 空き枠チェックスクリプト
// iOSショートカット用のロジック確認用

const API_BASE = 'https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule';

// プログラムID一覧（スクリーンショットより）
const PROGRAMS = {
  45: { id: 194, name: '45分【★男性・プラン予約】ととのいルーム45分' },
  70: { id: null, name: '70分【★男性・プラン予約】ととのいルーム70分' }, // IDは要確認
  90: { id: null, name: '90分【★男性・プラン予約】ととのいルーム90分' }, // IDは要確認
};

async function getAvailableSlots(programId = 194, studioRoomId = 51) {
  const query = JSON.stringify({
    page: 1,
    is_all: false,
    is_flat: false,
    is_fast: false,
    instructor_ids: null,
    date_from: null,
    date_to: null
  });

  const url = `${API_BASE}?studio_room_id=${studioRoomId}&program_id=${programId}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

function formatTodaySlots(data) {
  const today = new Date().toISOString().split('T')[0];
  const schedule = data.data.reserve_schedule;

  const todayData = schedule.dates.find(d => d.date === today);

  if (!todayData) {
    return '今日の予約枠はありません';
  }

  const availableSlots = todayData.times.filter(t => t.is_reservable);

  if (availableSlots.length === 0) {
    return '今日の空き枠はありません 😢';
  }

  const times = availableSlots.map(slot => {
    const time = new Date(slot.start_at);
    return time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  });

  return `🧖 今日の空き枠:\n${times.join('\n')}`;
}

// テスト実行
async function main() {
  try {
    const data = await getAvailableSlots();
    console.log(formatTodaySlots(data));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
