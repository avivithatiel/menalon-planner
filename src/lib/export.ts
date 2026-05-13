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
        Difficulty: '',
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
          Difficulty: sec.difficulty,
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
    Difficulty: '',
    Notes: `Pace: ${pace}${startDate ? ` | Start: ${startDate}` : ''}`,
  });

  return rows;
}

export function exportToExcel(data: ExportData) {
  const rows = buildRows(data);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Menalon Trail Plan');

  // Auto-size columns
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] || '').length)) + 2,
  }));
  ws['!cols'] = colWidths;

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'menalon-trail-plan.xlsx');
}

export function exportToDoc(data: ExportData) {
  const { days, sections, startDate, pace } = data;

  let totalDistance = 0;
  let totalDuration = 0;

  let html = `<html><head><meta charset="utf-8"><title>Menalon Trail Plan</title></head><body>`;
  html += `<h1>Menalon Trail — Hiking Plan</h1>`;
  html += `<p><strong>Pace:</strong> ${pace}${startDate ? ` | <strong>Start Date:</strong> ${startDate}` : ''}</p>`;
  html += `<hr>`;

  days.forEach((day) => {
    const daySections = day.sectionIds
      .map((id) => sections.find((s) => s.id === id))
      .filter(Boolean) as TrailSection[];
    const dayDistance = daySections.reduce((s, sec) => s + sec.distance, 0);
    const dayDuration = daySections.reduce((s, sec) => s + sec.duration, 0);
    totalDistance += dayDistance;
    totalDuration += dayDuration;

    html += `<h2>Day ${day.dayNumber}${day.date ? ` — ${day.date}` : ''}${day.isRestDay ? ' (Rest Day)' : ''}</h2>`;

    if (day.description) {
      html += `<p><em>${day.description}</em></p>`;
    }

    if (!day.isRestDay && daySections.length > 0) {
      html += `<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;">`;
      html += `<tr><th>Section</th><th>From</th><th>To</th><th>Distance</th><th>Duration</th><th>Difficulty</th></tr>`;
      daySections.forEach((sec) => {
        html += `<tr><td>Section ${sec.id}</td><td>${sec.from}</td><td>${sec.to}</td><td>${sec.distance} km</td><td>${sec.duration} hrs</td><td>${sec.difficulty}</td></tr>`;
      });
      html += `</table>`;
      html += `<p><strong>Day Total:</strong> ${dayDistance.toFixed(1)} km, ${dayDuration} hrs</p>`;
    } else if (!day.isRestDay) {
      html += `<p>No sections assigned.</p>`;
    }

    html += `<br>`;
  });

  html += `<hr><h2>Trip Summary</h2>`;
  html += `<ul>`;
  html += `<li><strong>Total Days:</strong> ${days.length}</li>`;
  html += `<li><strong>Total Distance:</strong> ${totalDistance.toFixed(1)} km</li>`;
  html += `<li><strong>Total Hiking Time:</strong> ${totalDuration.toFixed(1)} hrs</li>`;
  html += `</ul>`;
  html += `</body></html>`;

  const blob = new Blob([html], { type: 'application/msword' });
  saveAs(blob, 'menalon-trail-plan.doc');
}
