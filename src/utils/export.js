import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(profile) {
  const doc = new jsPDF();
  
  doc.setFillColor(24, 20, 18);
  doc.rect(0, 0, 210, 36, 'F');
  
  doc.setTextColor(212, 163, 115);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('VORTEX DEVELOPER TELEMETRY REPORT', 20, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(`${profile.name || 'Developer'} — Profile Report`, 20, 26);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  
  let y = 50;
  doc.text(`Name: ${profile.name || 'Krishan Kumar'}`, 20, y); y += 8;
  doc.text(`Email: ${profile.email || 'krishan@vortex.dev'}`, 20, y); y += 8;
  doc.text(`Dev Score: ${profile.score || 1840}`, 20, y); y += 8;
  doc.text(`Global Rank: #${profile.rank || 4}`, 20, y); y += 8;
  doc.text(`Problems Solved: ${profile.problems || 248}`, 20, y); y += 8;
  doc.text(`Active Streak: ${profile.streak || 14} days`, 20, y); y += 8;
  
  if (profile.githubUsername) {
    doc.text(`GitHub: @${profile.githubUsername}`, 20, y); y += 8;
  }
  if (profile.leetcodeUsername) {
    doc.text(`LeetCode: @${profile.leetcodeUsername}`, 20, y); y += 8;
  }
  
  doc.save(`${(profile.name || 'developer').toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
}

export function exportTextPDF(optionsOrText, fallbackFilename = 'developer-report.pdf') {
  const doc = new jsPDF();
  
  // If simple string was passed
  if (typeof optionsOrText === 'string') {
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(optionsOrText, 170);
    doc.text(lines, 20, 20);
    const fname = fallbackFilename.endsWith('.pdf') ? fallbackFilename : `${fallbackFilename}.pdf`;
    doc.save(fname);
    return;
  }

  // Structured Object { title, paragraphs, filename }
  const { title = 'Developer Resume & Telemetry', paragraphs = [], filename = 'developer-resume' } = optionsOrText || {};
  
  // Executive Mocha Header Bar
  doc.setFillColor(24, 20, 18);
  doc.rect(0, 0, 210, 36, 'F');
  
  doc.setTextColor(212, 163, 115);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('VORTEX VERIFIED DEVELOPER TELEMETRY & PORTFOLIO', 20, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 26);

  // Content body
  let y = 48;
  
  paragraphs.forEach((p) => {
    if (!p) return;
    
    // Check if line is a section header or bullet point
    if (p.startsWith('###') || p.startsWith('##') || p.endsWith(':')) {
      const cleanHeader = p.replace(/^#+\s*/, '').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(104, 83, 75); // Mocha brown
      doc.text(cleanHeader, 20, y);
      y += 8;
    } else if (p.includes(':') && p.length < 80) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(p, 20, y);
      y += 7;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(p, 170);
      doc.text(lines, 20, y);
      y += (lines.length * 5.5) + 6;
    }

    if (y > 270) {
      doc.addPage();
      y = 25;
    }
  });

  // Footer Rule & Seal
  doc.setDrawColor(200, 155, 123);
  doc.line(20, 280, 190, 280);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  doc.text('Certified by VORTEX Developer Intelligence Platform · Real-Time Platform Synchronization', 20, 286);
  
  const finalName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(finalName);
}

export function exportToCSV(data, filename = 'data.csv') {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
