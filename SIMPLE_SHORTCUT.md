# シンプル版 iOSショートカット

## 作成手順（5ステップ）

### ステップ1: 新規ショートカット作成
「ショートカット」アプリ → 「+」 → 「アクションを追加」

### ステップ2: URL（検索して追加）
以下をコピペ:
```
https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule?studio_room_id=51&program_id=193&query=%7B%22page%22:1,%22is_all%22:false,%22is_flat%22:false,%22is_fast%22:false,%22instructor_ids%22:null,%22date_from%22:null,%22date_to%22:null%7D
```

### ステップ3: URLの内容を取得（検索して追加）
設定はそのまま

### ステップ4: 辞書から値を取得（検索して追加）
キーに入力: `data`

### ステップ5: クイックルック（検索して追加）
または「結果を表示」

---

## これで動作確認
- 右下の ▶ ボタンで実行
- JSONデータが表示されれば成功
- `is_reservable: true` の時間枠が空き

---

## ホーム画面に追加
1. ショートカット名を「サウナ空き」などに変更
2. 上部の「v」→ 「ホーム画面に追加」
3. アイコンをカスタマイズ（任意）

---

## 見やすく加工するには

### JSONからテキスト抽出版

ステップ4の後に以下を追加:

1. **テキストを一致**（検索して追加）
   - パターン: `"is_reservable":true`
   - 「入力」は前のステップの結果

2. **カウント**
   - 一致した数をカウント

3. **if文**
   - カウントが0より大きい場合 → 「空きあり！」
   - それ以外 → 「空きなし」

4. **結果を表示**

---

## 複数プログラム対応版

90分の結果を取得した後、同じ手順を追加:

**45分用URL:**
```
https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule?studio_room_id=51&program_id=190&query=%7B%22page%22:1,%22is_all%22:false,%22is_flat%22:false,%22is_fast%22:false,%22instructor_ids%22:null,%22date_from%22:null,%22date_to%22:null%7D
```

**70分用URL:**
```
https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule?studio_room_id=51&program_id=191&query=%7B%22page%22:1,%22is_all%22:false,%22is_flat%22:false,%22is_fast%22:false,%22instructor_ids%22:null,%22date_from%22:null,%22date_to%22:null%7D
```

**45分朝ウナ用URL:**
```
https://sauna-seisakusyo.hacomono.jp/api/reservation/reservations/choice/reserve-schedule?studio_room_id=51&program_id=194&query=%7B%22page%22:1,%22is_all%22:false,%22is_flat%22:false,%22is_fast%22:false,%22instructor_ids%22:null,%22date_from%22:null,%22date_to%22:null%7D
```
