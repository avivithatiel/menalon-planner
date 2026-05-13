import { ItineraryDay, TrailSection } from '@/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportData {
  startDate: string | null;
  pace: string;
  days: ItineraryDay[];
  sections: TrailSection[];
}

function buildRows(data: ExportData) {
  const { days, sections, startDate, pace } = data;
  const rows: Record<string, string | number>[] = [];

  let totalDistance = 0;
  let totalDuration = 0;

  days.forEach((day) => {
    const daySections = day.sectionIds
      .map((id) => sections.find((s) => s.id === id))
      .filter(Boolean) as TrailSection[];
    daySections.sort((a, b) => a.id - b.id);
    const dayDistance = daySections.reduce((s, sec) => s + sec.distance, 0);
    const dayDuration = daySections.reduce((s, sec) => s + sec.duration, 0);
    totalDistance += dayDistance;
    totalDuration += dayDuration;

    if (daySections.length === 0) {
      rows.push({
        Day: day.dayNumber,
        Date: day.date || '',
        Type: day.isRestDay ? 'Rest Day' : 'Hiking',
        Section: '',
        From: '',
        To: '',
        'Distance (km)': 0,
        'Duration (hrs)': 0,
        'Elevation Gain (m)': 0,
        'Elevation Loss (m)': 0,
        Difficulty: '',
        Highlights: '',
        Notes: day.description || '',
      });
    } else {
      daySections.forEach((sec, i) => {
        rows.push({
          Day: day.dayNumber,
          Date: day.date || '',
          Type: day.isRestDay ? 'Rest Day' : 'Hiking',
          Section: `Section ${sec.id}`,
          From: sec.from,
          To: sec.to,
          'Distance (km)': sec.distance,
          'Duration (hrs)': sec.duration,
          'Elevation Gain (m)': sec.elevationGain,
          'Elevation Loss (m)': sec.elevationLoss,
          Difficulty: sec.difficulty,
          Highlights: sec.highlights.join(', '),
          Notes: i === 0 ? (day.description || '') : '',
        });
      });
    }
  });

  // Summary row
  rows.push({
    Day: '',
    Date: '',
    Type: '',
    Section: 'TOTAL',
    From: '',
    To: '',
    'Distance (km)': Math.round(totalDistance * 10) / 10,
    'Duration (hrs)': Math.round(totalDuration * 10) / 10,
    'Elevation Gain (m)': '',
    'Elevation Loss (m)': '',
    Difficulty: '',
    Highlights: '',
    Notes: `Pace: ${pace}${startDate ? ` | Start: ${startDate}` : ''}`,
  });

  return rows;
}

export function exportToExcel(data: ExportData) {
  const rows = buildRows(data);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Osi&Avivit's Menalon Trail");

  // Auto-size columns
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] || '').length)) + 2,
  }));
  ws['!cols'] = colWidths;

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'osi-avivit-menalon-trail.xlsx');
}

export function exportToDoc(data: ExportData) {
  const { days, sections, startDate, pace } = data;

  let totalDistance = 0;
  let totalDuration = 0;
  let totalElevGain = 0;
  let totalElevLoss = 0;

  const difficultyColor = (d: number) => {
    if (d <= 2) return '#16a34a';
    if (d === 3) return '#d97706';
    return '#dc2626';
  };

  const difficultyLabel = (d: number) => {
    if (d <= 2) return 'Easy';
    if (d === 3) return 'Moderate';
    if (d === 4) return 'Hard';
    return 'Very Hard';
  };

  let html = `<html><head><meta charset="utf-8"><title>Osi&Avivit's Menalon Trail</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { background: #2D5016; color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
  .header h1 { margin: 0 0 8px 0; font-size: 28px; }
  .header .subtitle { color: #a7d68c; font-size: 14px; }
  .trip-info { display: flex; gap: 20px; justify-content: center; margin-top: 15px; }
  .trip-info span { background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px; font-size: 13px; }
  .day-card { border: 1px solid #e5e5e5; border-radius: 10px; margin-bottom: 20px; overflow: hidden; }
  .day-header { background: #f8f5f0; padding: 14px 20px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; }
  .day-header h2 { margin: 0; font-size: 18px; color: #2D5016; }
  .day-header .date { color: #6b7280; font-size: 13px; }
  .day-body { padding: 16px 20px; }
  .day-notes { color: #6b7280; font-style: italic; margin-bottom: 12px; padding: 8px 12px; background: #fefcf6; border-left: 3px solid #d97706; border-radius: 4px; }
  .rest-day { background: #eff6ff; }
  .rest-day .day-header { background: #dbeafe; border-color: #bfdbfe; }
  .rest-day .day-header h2 { color: #1d4ed8; }
  .section-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
  .section-row:last-of-type { border-bottom: none; }
  .section-route { flex: 1; }
  .section-route .from-to { font-weight: 600; font-size: 14px; }
  .section-route .section-num { color: #6b7280; font-size: 12px; }
  .section-stats { display: flex; gap: 12px; align-items: center; }
  .stat { text-align: center; padding: 2px 8px; }
  .stat .value { font-weight: 600; font-size: 13px; }
  .stat .label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
  .difficulty-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; color: white; font-size: 11px; font-weight: 600; }
  .highlights { margin-top: 8px; padding: 10px 14px; background: #f0fdf4; border-radius: 6px; }
  .highlights .title { font-size: 11px; text-transform: uppercase; color: #5b7c3d; font-weight: 600; margin-bottom: 4px; }
  .highlights ul { margin: 0; padding-left: 16px; font-size: 13px; color: #374151; }
  .day-summary { margin-top: 12px; padding: 10px 14px; background: #f9fafb; border-radius: 6px; display: flex; gap: 16px; font-size: 13px; font-weight: 500; }
  .summary-box { background: #2D5016; color: white; border-radius: 10px; padding: 24px; margin-top: 30px; }
  .summary-box h2 { margin: 0 0 16px 0; font-size: 20px; }
  .summary-grid { display: flex; gap: 24px; flex-wrap: wrap; }
  .summary-stat { text-align: center; }
  .summary-stat .val { font-size: 24px; font-weight: 700; }
  .summary-stat .lbl { font-size: 12px; color: #a7d68c; }
</style>
</head><body>`;

  // Header
  html += `<div class="header">`;
  html += `<h1>🥾 Osi &amp; Avivit's Menalon Trail</h1>`;
  html += `<div class="subtitle">75 km across the heart of Arcadia — Greece's first certified hiking trail</div>`;
  html += `<div class="trip-info">`;
  html += `<span>📅 ${startDate || 'Date TBD'}</span>`;
  html += `<span>🏃 ${pace.charAt(0).toUpperCase() + pace.slice(1)} pace</span>`;
  html += `<span>📆 ${days.length} days</span>`;
  html += `</div></div>`;

  // Day cards
  days.forEach((day) => {
    const daySections = day.sectionIds
      .map((id) => sections.find((s) => s.id === id))
      .filter(Boolean) as TrailSection[];
    daySections.sort((a, b) => a.id - b.id);
    const dayDistance = daySections.reduce((s, sec) => s + sec.distance, 0);
    const dayDuration = daySections.reduce((s, sec) => s + sec.duration, 0);
    const dayElevGain = daySections.reduce((s, sec) => s + sec.elevationGain, 0);
    const dayElevLoss = daySections.reduce((s, sec) => s + sec.elevationLoss, 0);
    totalDistance += dayDistance;
    totalDuration += dayDuration;
    totalElevGain += dayElevGain;
    totalElevLoss += dayElevLoss;

    html += `<div class="day-card${day.isRestDay ? ' rest-day' : ''}">`;
    html += `<div class="day-header">`;
    html += `<h2>${day.isRestDay ? '😴 ' : ''}Day ${day.dayNumber}</h2>`;
    html += `<span class="date">${day.date || ''}</span>`;
    html += `</div>`;
    html += `<div class="day-body">`;

    if (day.description) {
      html += `<div class="day-notes">${day.description}</div>`;
    }

    if (day.isRestDay) {
      html += `<p style="color:#1d4ed8;font-size:14px;">Rest & recovery day</p>`;
    } else if (daySections.length > 0) {
      daySections.forEach((sec) => {
        html += `<div class="section-row">`;
        html += `<div class="section-route">`;
        html += `<div class="from-to">${sec.from} → ${sec.to}</div>`;
        html += `<div class="section-num">Section ${sec.id}</div>`;
        html += `</div>`;
        html += `<div class="section-stats">`;
        html += `<div class="stat"><div class="value">${sec.distance}km</div><div class="label">dist</div></div>`;
        html += `<div class="stat"><div class="value">${sec.duration}h</div><div class="label">time</div></div>`;
        html += `<div class="stat"><div class="value">↑${sec.elevationGain}m</div><div class="label">gain</div></div>`;
        html += `<div class="stat"><div class="value">↓${sec.elevationLoss}m</div><div class="label">loss</div></div>`;
        html += `<div class="stat"><span class="difficulty-badge" style="background:${difficultyColor(sec.difficulty)}">${difficultyLabel(sec.difficulty)}</span></div>`;
        html += `</div></div>`;
      });

      // Highlights
      const allHighlights = daySections.flatMap((sec) => sec.highlights);
      if (allHighlights.length > 0) {
        html += `<div class="highlights"><div class="title">✨ Highlights</div><ul>`;
        allHighlights.forEach((h) => { html += `<li>${h}</li>`; });
        html += `</ul></div>`;
      }

      // Day summary bar
      html += `<div class="day-summary">`;
      html += `<span>📏 ${dayDistance.toFixed(1)} km</span>`;
      html += `<span>⏱ ${dayDuration} hrs</span>`;
      html += `<span>⬆ ${dayElevGain}m</span>`;
      html += `<span>⬇ ${dayElevLoss}m</span>`;
      html += `</div>`;
    } else {
      html += `<p style="color:#6b7280;font-size:14px;font-style:italic;">No sections assigned</p>`;
    }

    html += `</div></div>`;
  });

  // Trip summary
  html += `<div class="summary-box">`;
  html += `<h2>Trip Summary</h2>`;
  html += `<div class="summary-grid">`;
  html += `<div class="summary-stat"><div class="val">${days.length}</div><div class="lbl">Days</div></div>`;
  html += `<div class="summary-stat"><div class="val">${totalDistance.toFixed(1)} km</div><div class="lbl">Total Distance</div></div>`;
  html += `<div class="summary-stat"><div class="val">${totalDuration.toFixed(1)} hrs</div><div class="lbl">Hiking Time</div></div>`;
  html += `<div class="summary-stat"><div class="val">↑${totalElevGain}m</div><div class="lbl">Total Ascent</div></div>`;
  html += `<div class="summary-stat"><div class="val">↓${totalElevLoss}m</div><div class="lbl">Total Descent</div></div>`;
  html += `</div></div>`;

  html += `</body></html>`;

  const blob = new Blob([html], { type: 'application/msword' });
  saveAs(blob, 'osi-avivit-menalon-trail.doc');
}
