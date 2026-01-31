const fs = require('fs');
const path = require('path');

const API_BASE = 'https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule';
const STUDIO_ROOM_ID = 51;

const PROGRAMS = [
  { id: 190, name: 'ととのいルーム 70分' },
  { id: 191, name: 'ととのいルーム 90分' },
  { id: 193, name: 'アドバンスルーム 70分' },
  { id: 194, name: 'アドバンスルーム 90分' }
];

async function fetchSlots(programId) {
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
  return response.json();
}

function extractAllSlots(data) {
  const schedule = data.data?.reserve_schedule;
  if (!schedule) return {};

  const result = {};
  for (const dayData of schedule.dates || []) {
    const slots = dayData.times
      .filter(t => t.is_reservable)
      .map(slot => {
        const time = new Date(slot.start_at);
        return {
          time: time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' }),
          start_at: slot.start_at
        };
      });
    result[dayData.date] = slots;
  }
  return result;
}

async function main() {
  const now = new Date();

  const result = {
    updated_at: now.toISOString(),
    dates: [],
    programs: []
  };

  for (const program of PROGRAMS) {
    try {
      const data = await fetchSlots(program.id);
      const slotsByDate = extractAllSlots(data);

      // 日付一覧を取得（最初のプログラムから）
      if (result.dates.length === 0) {
        result.dates = Object.keys(slotsByDate).sort();
      }

      const totalSlots = Object.values(slotsByDate).flat().length;
      result.programs.push({
        id: program.id,
        name: program.name,
        slotsByDate: slotsByDate
      });

      console.log(`${program.name}: ${totalSlots} slots available`);
    } catch (error) {
      console.error(`Error fetching ${program.name}:`, error.message);
      result.programs.push({
        id: program.id,
        name: program.name,
        slotsByDate: {},
        error: error.message
      });
    }
  }

  // データを保存
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'slots.json'),
    JSON.stringify(result, null, 2)
  );

  console.log('\nData saved to data/slots.json');
}

main();
