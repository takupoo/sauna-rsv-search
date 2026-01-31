// サウナ整作所 全プログラム空き枠チェック

const API_BASE = 'https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule';

const PROGRAM_IDS = [190, 191, 193, 194];
const STUDIO_ROOM_ID = 51;

async function getAvailableSlots(programId) {
  const query = JSON.stringify({
    page: 1,
    is_all: false,
    is_flat: false,
    is_fast: false,
    instructor_ids: null,
    date_from: null,
    date_to: null
  });

  const url = `${API_BASE}?studio_room_id=${STUDIO_ROOM_ID}&program_id=${programId}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function getTodaySlots(data) {
  const today = new Date().toISOString().split('T')[0];
  const schedule = data.data?.reserve_schedule;

  if (!schedule) return [];

  const todayData = schedule.dates?.find(d => d.date === today);
  if (!todayData) return [];

  return todayData.times
    .filter(t => t.is_reservable)
    .map(slot => {
      const time = new Date(slot.start_at);
      return time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    });
}

async function main() {
  console.log('🧖 サウナ整作所 - 今日の空き枠チェック\n');
  console.log(`日付: ${new Date().toLocaleDateString('ja-JP')}\n`);
  console.log('='.repeat(40));

  for (const programId of PROGRAM_IDS) {
    try {
      const data = await getAvailableSlots(programId);
      const slots = getTodaySlots(data);

      // プログラム名を取得（レスポンスに含まれていれば）
      const programName = `プログラムID: ${programId}`;

      console.log(`\n【${programName}】`);

      if (slots.length === 0) {
        console.log('  空き枠なし');
      } else {
        slots.forEach(time => console.log(`  ✅ ${time}`));
      }
    } catch (error) {
      console.log(`\n【プログラムID: ${programId}】`);
      console.log(`  エラー: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(40));
}

main();
