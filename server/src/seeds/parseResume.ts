import 'dotenv/config';
import { parseResumeFromURL, generateAboutSectionFromResume } from '../services/resumeParser';
import { ContentSection } from '../models/ContentSection';
import { connectDB, disconnectDB } from '../config/database';

const updateResumeContent = async (resumeURL?: string) => {
  try {
    await connectDB();
    console.log('Connected to database');

    if (!resumeURL) {
      console.log('No resume URL provided. Usage:');
      console.log('  npx ts-node --loader ts-node/esm src/seeds/parseResume.ts <url>');
      console.log('');
      console.log('Example:');
      console.log('  npx ts-node --loader ts-node/esm src/seeds/parseResume.ts https://example.com/resume.pdf');
      return;
    }

    console.log('Parsing resume from:', resumeURL);
    const parsedResume = await parseResumeFromURL(resumeURL);

    console.log('Parsed resume data:', JSON.stringify(parsedResume, null, 2));

    const aboutContent = generateAboutSectionFromResume(parsedResume);

    await ContentSection.findOneAndUpdate(
      { key: 'about' },
      {
        content: {
          summary: aboutContent,
          highlights: parsedResume.skills?.slice(0, 10) || [],
        },
      },
      { new: true, upsert: true }
    );

    if (parsedResume.skills && parsedResume.skills.length > 0) {
      const frontend = [
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Vue.js',
      ].filter((skill) =>
        parsedResume.skills?.some((s) =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
      );

      const backend = [
        'Node.js',
        'Express',
        'MongoDB',
        'PostgreSQL',
      ].filter((skill) =>
        parsedResume.skills?.some((s) =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
      );

      const devops = [
        'Docker',
        'AWS',
        'GitHub Actions',
        'Nginx',
      ].filter((skill) =>
        parsedResume.skills?.some((s) =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
      );

      const allOtherSkills = parsedResume.skills.filter(
        (s) => ![...frontend, ...backend, ...devops].includes(s)
      );

      await ContentSection.findOneAndUpdate(
        { key: 'skills' },
        {
          content: {
            frontend: [...frontend, ...allOtherSkills.slice(0, 3)],
            backend,
            devops,
          },
        },
        { new: true, upsert: true }
      );

      console.log('✓ Skills section updated');
    }

    console.log('✓ Resume data successfully imported to About section');
    console.log('✓ Skills have been categorized and saved');
  } catch (error) {
    console.error('Error updating resume content:', error);
  } finally {
    await disconnectDB();
  }
};

const resumeURL = process.argv[2];
updateResumeContent(resumeURL);
