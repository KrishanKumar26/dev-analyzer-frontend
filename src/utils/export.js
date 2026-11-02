import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(profile) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Developer Profile Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Name: ${profile.name || 'N/A'}`, 20, 40);
  doc.text(`Email: ${profile.email || 'N/A'}`, 20, 50);
  doc.text(`Dev Score: ${profile.score || 0}`, 20, 60);
  doc.text(`Global Rank: #${profile.rank || 'N/A'}`, 20, 70);
  doc.text(`Problems Solved: ${profile.problems || 0}`, 20, 80);
  doc.text(`Current Streak: ${profile.streak || 0} days`, 20, 90);
  
  if (profile.githubUsername) {
    doc.text(`GitHub: ${profile.githubUsername}`, 20, 100);
  }
  if (profile.leetcodeUsername) {
    doc.text(`LeetCode: ${profile.leetcodeUsername}`, 20, 110);
  }
  
  doc.save(`${profile.name || 'profile'}-report.pdf`);
}

export function exportTextPDF(text, filename = 'report.pdf') {
  const doc = new jsPDF();
  
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(text, 170);
  doc.text(lines, 20, 20);
  
  doc.save(filename);
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
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
