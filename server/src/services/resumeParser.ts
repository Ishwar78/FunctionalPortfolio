import axios from 'axios';

export interface ParsedResume {
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year?: string;
  }>;
  skills?: string[];
}

export const parseResumeFromURL = async (url: string): Promise<ParsedResume> => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    return extractResumeData(Buffer.from(response.data));
  } catch (error) {
    console.error('Error fetching resume from URL:', error);
    throw new Error('Failed to fetch resume from URL');
  }
};

const extractResumeData = (buffer: Buffer): ParsedResume => {
  const extractedText = extractTextFromPDF(buffer);
  return parseTextResume(extractedText);
};

const extractTextFromPDF = (buffer: Buffer): string => {
  try {
    const PDFParser = require('pdf-parse');
    return PDFParser(buffer).then((data: any) => data.text);
  } catch (error) {
    console.error('PDF parsing error:', error);
    return '';
  }
};

const parseTextResume = (text: string): ParsedResume => {
  const result: ParsedResume = {
    summary: '',
    experience: [],
    education: [],
    skills: [],
  };

  const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

  let currentSection = '';

  for (const line of lines) {
    const upperLine = line.toUpperCase();

    if (upperLine.includes('EXPERIENCE') || upperLine.includes('WORK')) {
      currentSection = 'experience';
      continue;
    }
    if (upperLine.includes('EDUCATION')) {
      currentSection = 'education';
      continue;
    }
    if (upperLine.includes('SKILL')) {
      currentSection = 'skills';
      continue;
    }
    if (
      upperLine.includes('ABOUT') ||
      upperLine.includes('SUMMARY') ||
      upperLine.includes('OBJECTIVE')
    ) {
      currentSection = 'summary';
      continue;
    }

    if (currentSection === 'skills') {
      const skillsMatch = line.match(/^[^:]+:\s*(.+)$/);
      if (skillsMatch) {
        const skills = skillsMatch[1].split(/[,;]/).map((s) => s.trim());
        result.skills = [...(result.skills || []), ...skills];
      } else if (line.length > 0 && !line.match(/^[A-Z\s]+$/)) {
        const skills = line.split(/[,;]/).map((s) => s.trim());
        result.skills = [...(result.skills || []), ...skills];
      }
    } else if (currentSection === 'summary') {
      if (result.summary && result.summary.length < 500) {
        result.summary += ' ' + line;
      } else if (!result.summary) {
        result.summary = line;
      }
    } else if (currentSection === 'experience') {
      if (line.match(/\d{4}-\d{4}|\d{4}-present/i)) {
        result.experience?.push({
          title: '',
          company: '',
          duration: line,
        });
      } else if (line.length > 0 && result.experience && result.experience.length > 0) {
        const lastExp = result.experience[result.experience.length - 1];
        if (!lastExp.company) {
          lastExp.company = line;
        } else if (!lastExp.title) {
          lastExp.title = line;
        } else {
          lastExp.description = (lastExp.description || '') + ' ' + line;
        }
      }
    } else if (currentSection === 'education') {
      result.education?.push({
        degree: line,
        school: '',
      });
    }
  }

  result.skills = [...new Set(result.skills)].filter((s) => s.length > 0).slice(0, 20);
  result.experience = result.experience?.filter((e) => e.company || e.title);
  result.education = result.education?.filter((e) => e.degree);

  return result;
};

export const generateAboutSectionFromResume = (parsed: ParsedResume): string => {
  const parts: string[] = [];

  if (parsed.summary) {
    parts.push(parsed.summary);
  }

  if (parsed.experience && parsed.experience.length > 0) {
    parts.push('\n## Professional Experience\n');
    parsed.experience.slice(0, 3).forEach((exp) => {
      parts.push(`- **${exp.title}** at ${exp.company}${exp.duration ? ` (${exp.duration})` : ''}`);
      if (exp.description) {
        parts.push(`  ${exp.description.substring(0, 100)}...`);
      }
    });
  }

  if (parsed.education && parsed.education.length > 0) {
    parts.push('\n## Education\n');
    parsed.education.forEach((edu) => {
      parts.push(`- **${edu.degree}**${edu.school ? ` from ${edu.school}` : ''}${edu.year ? ` (${edu.year})` : ''}`);
    });
  }

  return parts.join('\n');
};
