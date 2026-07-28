
// ---------- Database (IndexedDB via Dexie) ----------
const db = new Dexie("HotelCleaningDB");
db.version(1).stores({
  rooms: "++id, date, roomNumber, status",
  logs: "++id, roomId, date, startTime, endTime"
});

// Room status config - EDIT HERE to add/remove/change statuses
const STATUS_CONFIG = {
  blue:   { label: "چک‌اوت + رزرو جدید (اولویت ۱)", cssClass: "status-blue",   badgeClass: "blue",   priority: 1 },
  red:    { label: "چک‌اوت بدون رزرو",              cssClass: "status-red",    badgeClass: "red",    priority: 2 },
  yellow: { label: "مقیم (می‌ماند)",                 cssClass: "status-yellow", badgeClass: "yellow", priority: 3 }
};

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

function nowTimeStr() {
  const d = new Date();
  return d.toTimeString().slice(0,8); // HH:MM:SS
}

function fmtDuration(mins) {
  if (mins == null) return "-";
  const h = Math.floor(mins/60);
  const m = Math.round(mins%60);
  return h > 0 ? `${h}س ${m}د` : `${m}د`;
}

// ---------- State ----------
let currentTab = "rooms";
let editingRoomId = null;

// ---------- Navigation ----------
const tabs = {
  rooms: document.getElementById("tab-rooms"),
  daily: document.getElementById("tab-daily"),
  monthly: document.getElementById("tab-monthly")
};
const views = {
  rooms: document.getElementById("view-rooms"),
  daily: document.getElementById("view-daily"),
  monthly: document.getElementById("view-monthly")
};

function switchTab(name) {
  currentTab = name;
  Object.keys(tabs).forEach(k => {
    tabs[k].classList.toggle("active", k === name);
    views[k].style.display = k === name ? "block" : "none";
  });
  if (name === "rooms") renderRooms();
  if (name === "daily") renderDaily();
  if (name === "monthly") renderMonthly();
}
tabs.rooms.onclick = () => switchTab("rooms");
tabs.daily.onclick = () => switchTab("daily");
tabs.monthly.onclick = () => switchTab("monthly");

// ---------- Rooms list rendering ----------
async function renderRooms() {
  const date = todayStr();
  const rooms = await db.rooms.where("date").equals(date).toArray();
  rooms.sort((a,b) => STATUS_CONFIG[a.status].priority - STATUS_CONFIG[b.status].priority);

  const container = document.getElementById("rooms-list");
  container.innerHTML = "";

  if (rooms.length === 0) {
    container.innerHTML = `<div class="empty-state">هنوز اتاقی برای امروز اضافه نشده است.<br>با دکمه + یک اتاق اضافه کنید.</div>`;
    return;
  }

  for (const room of rooms) {
    const logs = await db.logs.where("roomId").equals(room.id).toArray();
    const activeLog = logs.find(l => !l.endTime);
    const finishedLog = logs.find(l => l.endTime);

    const card = document.createElement("div");
    card.className = `room-card ${STATUS_CONFIG[room.status].cssClass}`;

    const badgesHtml = `
      <span class="badge ${STATUS_CONFIG[room.status].badgeClass}">${STATUS_CONFIG[room.status].label}</span>
      ${room.isWW ? '<span class="badge ww">WW</span>' : ''}
      ${room.suiteGroup ? `<span class="badge suite">سوییت ${room.suiteGroup}</span>` : ''}
    `;

    let statusText = "شروع نشده";
    let actionHtml = `<button class="btn btn-start" data-action="start" data-id="${room.id}">شروع نظافت</button>`;

    if (activeLog) {
      statusText = `در حال نظافت از ساعت ${activeLog.startTime}`;
      actionHtml = `<button class="btn btn-end" data-action="end" data-id="${room.id}" data-log="${activeLog.id}">پایان نظافت</button>`;
    } else if (finishedLog) {
      const mins = finishedLog.durationMinutes;
      statusText = `تکمیل شد | ${finishedLog.startTime} تا ${finishedLog.endTime} (${fmtDuration(mins)})`;
      actionHtml = `<button class="btn btn-disabled" disabled>نظافت انجام شد ✓</button>`;
    }

    card.innerHTML = `
      <div class="room-top">
        <div class="room-number">اتاق ${room.roomNumber}</div>
        <div class="badges">${badgesHtml}</div>
      </div>
      <div class="room-status-text">${statusText}</div>
      <div class="room-actions">
        ${actionHtml}
        <button class="btn btn-edit" data-action="edit" data-id="${room.id}">ویرایش</button>
      </div>
    `;
    container.appendChild(card);
  }
}

document.getElementById("rooms-list").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const roomId = Number(btn.dataset.id);

  if (action === "start") {
    await db.logs.add({
      roomId,
      date: todayStr(),
      startTime: nowTimeStr(),
      endTime: null,
      durationMinutes: null
    });
    renderRooms();
  } else if (action === "end") {
    const logId = Number(btn.dataset.log);
    const log = await db.logs.get(logId);
    const endTime = nowTimeStr();
    const [sh, sm, ss] = log.startTime.split(":").map(Number);
    const [eh, em, es] = endTime.split(":").map(Number);
    const durationMinutes = ((eh*3600+em*60+es) - (sh*3600+sm*60+ss)) / 60;
    await db.logs.update(logId, { endTime, durationMinutes });
    renderRooms();
  } else if (action === "edit") {
    openRoomModal(roomId);
  }
});

// ---------- Add / Edit Room Modal ----------
document.getElementById("add-room-btn").onclick = () => openRoomModal(null);

async function openRoomModal(roomId) {
  editingRoomId = roomId;
  let room = { roomNumber: "", status: "yellow", isWW: false, suiteGroup: "" };
  if (roomId) {
    room = await db.rooms.get(roomId);
  }

  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal">
        <h3>${roomId ? "ویرایش اتاق" : "افزودن اتاق جدید"}</h3>
        <label>شماره اتاق</label>
        <input type="text" id="input-room-number" value="${room.roomNumber}" placeholder="مثال: 214">

        <label>وضعیت اتاق</label>
        <select id="input-status">
          <option value="blue" ${room.status==="blue"?"selected":""}>آبی - چک‌اوت + رزرو جدید (اولویت ۱)</option>
          <option value="red" ${room.status==="red"?"selected":""}>قرمز - چک‌اوت بدون رزرو</option>
          <option value="yellow" ${room.status==="yellow"?"selected":""}>زرد - مقیم (می‌ماند)</option>
        </select>

        <div class="checkbox-row">
          <input type="checkbox" id="input-ww" ${room.isWW?"checked":""}>
          <label style="margin:0">WW (تعویض کامل ملحفه و حوله)</label>
        </div>

        <label>گروه سوییت (اختیاری - برای اتاق‌های دو‌اتاقه)</label>
        <input type="text" id="input-suite" value="${room.suiteGroup||""}" placeholder="مثال: A1 (خالی بگذارید اگر سوییت نیست)">

        <div class="modal-actions">
          <button class="btn btn-cancel" id="modal-cancel">انصراف</button>
          ${roomId ? '<button class="btn btn-delete" id="modal-delete">حذف</button>' : ''}
          <button class="btn btn-save" id="modal-save">ذخیره</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("modal-cancel").onclick = closeModal;
  document.getElementById("modal-overlay").onclick = (e) => {
    if (e.target.id === "modal-overlay") closeModal();
  };
  if (roomId) {
    document.getElementById("modal-delete").onclick = async () => {
      await db.rooms.delete(roomId);
      await db.logs.where("roomId").equals(roomId).delete();
      closeModal();
      renderRooms();
    };
  }
  document.getElementById("modal-save").onclick = async () => {
    const roomNumber = document.getElementById("input-room-number").value.trim();
    const status = document.getElementById("input-status").value;
    const isWW = document.getElementById("input-ww").checked;
    const suiteGroup = document.getElementById("input-suite").value.trim();
    if (!roomNumber) { alert("لطفا شماره اتاق را وارد کنید"); return; }

    const data = { roomNumber, status, isWW, suiteGroup, date: todayStr() };
    if (roomId) {
      await db.rooms.update(roomId, data);
    } else {
      await db.rooms.add(data);
    }
    closeModal();
    renderRooms();
  };
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
  editingRoomId = null;
}

// ---------- Daily report ----------
async function renderDaily() {
  const date = todayStr();
  const rooms = await db.rooms.where("date").equals(date).toArray();
  const logs = await db.logs.where("date").equals(date).toArray();

  const finished = logs.filter(l => l.endTime);
  const totalMinutes = finished.reduce((s,l) => s + l.durationMinutes, 0);
  const avgMinutes = finished.length ? totalMinutes / finished.length : 0;
  const wwCount = rooms.filter(r => r.isWW).length;

  document.getElementById("daily-summary").innerHTML = `
    <div class="summary-box"><div class="num">${finished.length}/${rooms.length}</div><div class="label">اتاق تمیز شده</div></div>
    <div class="summary-box"><div class="num">${fmtDuration(totalMinutes)}</div><div class="label">مجموع زمان</div></div>
    <div class="summary-box"><div class="num">${fmtDuration(avgMinutes)}</div><div class="label">میانگین هر اتاق</div></div>
    <div class="summary-box"><div class="num">${wwCount}</div><div class="label">اتاق WW</div></div>
  `;

  const tbody = document.querySelector("#daily-table tbody");
  tbody.innerHTML = "";
  for (const room of rooms) {
    const log = logs.find(l => l.roomId === room.id);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${room.roomNumber}${room.isWW ? " (WW)" : ""}</td>
      <td>${STATUS_CONFIG[room.status].label}</td>
      <td>${log ? log.startTime : "-"}</td>
      <td>${log && log.endTime ? log.endTime : "-"}</td>
      <td>${log && log.durationMinutes != null ? Math.round(log.durationMinutes) : "-"}</td>
    `;
    tbody.appendChild(row);
  }
}

// ---------- Monthly report ----------
async function renderMonthly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthPrefix = `${year}-${String(month+1).padStart(2,"0")}`;

  const allLogs = await db.logs.toArray();
  const monthLogs = allLogs.filter(l => l.date.startsWith(monthPrefix) && l.endTime);

  const totalRooms = monthLogs.length;
  const totalMinutes = monthLogs.reduce((s,l) => s + l.durationMinutes, 0);
  const avgMinutes = totalRooms ? totalMinutes / totalRooms : 0;

  const allRoomsThisMonth = (await db.rooms.toArray()).filter(r => r.date.startsWith(monthPrefix));
  const wwCount = allRoomsThisMonth.filter(r => r.isWW).length;

  document.getElementById("monthly-summary").innerHTML = `
    <div class="summary-box"><div class="num">${totalRooms}</div><div class="label">مجموع اتاق تمیزشده</div></div>
    <div class="summary-box"><div class="num">${fmtDuration(totalMinutes)}</div><div class="label">مجموع زمان</div></div>
    <div class="summary-box"><div class="num">${fmtDuration(avgMinutes)}</div><div class="label">میانگین هر اتاق</div></div>
    <div class="summary-box"><div class="num">${wwCount}</div><div class="label">مجموع اتاق WW</div></div>
  `;

  const byDate = {};
  for (const l of monthLogs) {
    if (!byDate[l.date]) byDate[l.date] = { count: 0, minutes: 0 };
    byDate[l.date].count += 1;
    byDate[l.date].minutes += l.durationMinutes;
  }

  const tbody = document.querySelector("#monthly-table tbody");
  tbody.innerHTML = "";
  Object.keys(byDate).sort().reverse().forEach(date => {
    const d = byDate[date];
    const avg = d.count ? d.minutes / d.count : 0;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${date}</td>
      <td>${d.count}</td>
      <td>${Math.round(d.minutes)}</td>
      <td>${Math.round(avg)}</td>
    `;
    tbody.appendChild(row);
  });
}

// ---------- Service worker registration ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.log("SW registration failed", err));
  });
}

// ---------- Initial render ----------
renderRooms();
