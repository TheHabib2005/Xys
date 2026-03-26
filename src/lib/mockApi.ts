import type { ResumeData, StyleSettings } from '@/interfaces/custom-resume-builder';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const defaultData: ResumeData = {
  id: 'resume-1',
  name: 'Enzo Fernanda',
  title: 'Jr. Product Designer',
  contacts: {
    email: 'enzofernanda@email.com',
    phone: '+61 412 345 678',
    location: 'enzo.design',
  },
  sections: [
    {
      id: 'sec-1',
      type: 'summary',
      title: 'Professional Summary',
      position: 0,
      content:
        '<p>Enthusiastic product designer with a keen eye for detail. Proficient in user interface design and eager to apply skills in a dynamic environment. Dedicated to creating intuitive and engaging digital experiences.</p>',
    },
    {
      id: 'sec-2',
      type: 'experience',
      title: 'Work Experience',
      position: 1,
      content:
        '<p><strong>Design Assistant @ Innovate Solutions</strong></p><p>FEB 2023 – PRESENT</p><ul><li>Assisted in the creation of user-centered designs for web and mobile applications</li><li>Participated in brainstorming sessions and contributed ideas to improve user experience</li><li>Supported senior designers in conducting user research and usability testing</li></ul><p><strong>Volunteer Designer @ EcoAction Project</strong></p><p>JAN 2022 – JUN 2022</p><ul><li>Developed visual designs for social media campaigns and website updates</li><li>Created wireframes and prototypes for new website features</li></ul>',
    },
    {
      id: 'sec-3',
      type: 'education',
      title: 'Education',
      position: 2,
      content:
        '<p><strong>BA in Design @ Global Design Institute</strong></p><p>SEPT 2019 – MAY 2022</p><p><strong>UX Course @ Online Design Academy</strong></p><p>FEB 2023 – MAY 2023</p>',
    },
    {
      id: 'sec-4',
      type: 'skills',
      title: 'Skills',
      position: 3,
      content:
        '<p><strong>Design</strong>: UI Design, Prototyping, User Research, Wireframing, Visual Communication</p><p><strong>Tools</strong>: Figma, Adobe XD, Sketch, InVision, Miro, Zeplin</p>',
    },
  ],
};

const defaultStyles: StyleSettings = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 13,
  lineHeight: 1.6,
  color: '#1E293B',
  letterSpacing: -0.2,
  headingColor: '#0F172A',
  accentColor: '#3B82F6',
};

export async function fetchResume(): Promise<{ data: ResumeData; styles: StyleSettings }> {
  await delay(600);
  const saved = localStorage.getItem('resume-autosave');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fall through
    }
  }
  return { data: defaultData, styles: defaultStyles };
}

export async function saveResume(data: ResumeData, styles: StyleSettings): Promise<{ ok: boolean; savedAt: string }> {
  await delay(300);
  localStorage.setItem('resume-autosave', JSON.stringify({ data, styles }));
  return { ok: true, savedAt: new Date().toISOString() };
}
