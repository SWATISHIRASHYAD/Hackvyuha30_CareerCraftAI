import React from 'react';
import { formatDate } from './utils';
import { FileText, Briefcase, GraduationCap, Star, Code } from 'lucide-react';

export type ResumeTemplateProps = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    portfolio: string;
  };
  summary: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  experience: {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  skills: {
    name: string;
    level: string;
  }[];
};

export type ResumeTemplate = {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.FC<ResumeTemplateProps>;
  description: string;
};

// Classic Template
const ClassicTemplate: React.FC<ResumeTemplateProps> = ({
  personalInfo,
  summary,
  education,
  experience,
  skills
}) => {
  return (
    <div className="p-8 bg-white text-black">
      {/* Header / Personal Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-careercraft-blue mb-3">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 w-full">
            {personalInfo.email && <span className="flex items-center">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center">{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center">{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 w-full">
            {personalInfo.linkedIn && <span className="flex items-center">{personalInfo.linkedIn}</span>}
            {personalInfo.portfolio && <span className="flex items-center">{personalInfo.portfolio}</span>}
          </div>
        </div>
      </div>
      
      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-careercraft-purple mb-3 pb-1">Professional Summary</h2>
          <p className="text-gray-800 leading-relaxed">{summary}</p>
        </div>
      )}
      
      {/* Experience */}
      {experience.length > 0 && experience[0].company && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-careercraft-purple mb-3 pb-1">Work Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className={`mb-5 ${index !== experience.length - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-careercraft-blue">{exp.title}</h3>
                <span className="text-sm text-gray-600 font-medium">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <h4 className="font-semibold">{exp.company}</h4>
                <span className="text-sm text-gray-600">{exp.location}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {education.length > 0 && education[0].institution && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-careercraft-purple mb-3 pb-1">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className={`mb-4 ${index !== education.length - 1 ? 'pb-3 border-b border-gray-200' : ''}`}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-careercraft-blue">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </h3>
                <span className="text-sm text-gray-600 font-medium">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <h4 className="font-semibold">{edu.institution}</h4>
                {edu.gpa && <span className="text-sm text-gray-600">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Skills */}
      {skills.length > 0 && skills[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-careercraft-purple mb-3 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-careercraft-blue bg-opacity-10 text-careercraft-blue px-3 py-1 rounded-full text-sm font-medium">
                {skill.name} {skill.level && `(${skill.level})`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Template
const ModernTemplate: React.FC<ResumeTemplateProps> = ({
  personalInfo,
  summary,
  education,
  experience,
  skills
}) => {
  return (
    <div className="p-8 bg-white text-black">
      {/* Header with colored top bar */}
      <div className="border-t-8 border-careercraft-teal pt-6 mb-8">
        <h1 className="text-3xl font-bold mb-3">{personalInfo.fullName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
          </div>
          <div className="space-y-1 md:text-right">
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedIn && <p>{personalInfo.linkedIn}</p>}
            {personalInfo.portfolio && <p>{personalInfo.portfolio}</p>}
          </div>
        </div>
      </div>
      
      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Skills and Education */}
        <div className="md:col-span-1">
          {/* Skills */}
          {skills.length > 0 && skills[0].name && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-careercraft-teal" />
                SKILLS
              </h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="relative">
                    <div className="text-sm font-medium">{skill.name}</div>
                    {skill.level && (
                      <div className="w-full bg-gray-200 h-1.5 mt-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-careercraft-teal h-full rounded-full"
                          style={{
                            width: skill.level === "Beginner" ? "25%" : 
                                  skill.level === "Intermediate" ? "50%" : 
                                  skill.level === "Advanced" ? "75%" : "100%"
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {education.length > 0 && education[0].institution && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-careercraft-teal" />
                EDUCATION
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-sm">{edu.institution}</h3>
                  <p className="text-sm">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.gpa && <p className="text-xs mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - Summary and Experience */}
        <div className="md:col-span-2">
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-careercraft-teal" />
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-sm leading-relaxed">{summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {experience.length > 0 && experience[0].company && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-careercraft-teal" />
                WORK EXPERIENCE
              </h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{exp.title}</h3>
                      <p className="text-sm">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">{exp.location}</p>
                      <p className="text-xs text-gray-600">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Minimalist Template
const MinimalistTemplate: React.FC<ResumeTemplateProps> = ({
  personalInfo,
  summary,
  education,
  experience,
  skills
}) => {
  return (
    <div className="p-8 bg-white text-black font-['Inter',sans-serif]">
      {/* Header / Personal Info */}
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight mb-2">{personalInfo.fullName}</h1>
        <div className="border-t border-black pt-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
          </div>
        </div>
      </div>
      
      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-3">About</h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}
      
      {/* Experience */}
      {experience.length > 0 && experience[0].company && (
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-3">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-sm">{exp.title}</h3>
                <span className="text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-xs mb-2">{exp.company} • {exp.location}</p>
              <p className="text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {education.length > 0 && education[0].institution && (
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-3">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-sm">{edu.institution}</h3>
                <span className="text-xs">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-xs">
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Skills */}
      {skills.length > 0 && skills[0].name && (
        <div>
          <h2 className="text-sm uppercase tracking-widest mb-3">Skills</h2>
          <p className="text-xs">
            {skills.map((skill, index) => (
              <span key={index}>
                {skill.name}{index < skills.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

// New LaTeX-inspired Template
const LatexTemplate: React.FC<ResumeTemplateProps> = ({
  personalInfo,
  summary,
  education,
  experience,
  skills
}) => {
  // LaTeX-inspired styling constants
  const fontFamily = "font-serif";
  const headingStyle = "text-lg font-bold uppercase text-gray-800 border-b border-gray-300 pb-1 mb-3";
  const sectionStyle = "mb-6";
  
  return (
    <div className={`p-8 bg-white text-black ${fontFamily}`}>
      {/* Header / Personal Info - LaTeX style */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">{personalInfo.fullName}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-x-6 gap-y-1 italic">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>
      
      {/* Summary */}
      {summary && (
        <div className={sectionStyle}>
          <h2 className={headingStyle}>Summary</h2>
          <p className="text-justify text-sm leading-relaxed">{summary}</p>
        </div>
      )}
      
      {/* Experience */}
      {experience.length > 0 && experience[0].company && (
        <div className={sectionStyle}>
          <h2 className={headingStyle}>Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{exp.title}</h3>
                <span className="text-sm">
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <h4 className="italic">{exp.company}</h4>
                <span className="text-sm">{exp.location}</span>
              </div>
              <p className="text-justify text-sm mt-2 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {education.length > 0 && education[0].institution && (
        <div className={sectionStyle}>
          <h2 className={headingStyle}>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </h3>
                <span className="text-sm">
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <h4 className="italic">{edu.institution}</h4>
                {edu.gpa && <span className="text-sm">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Skills */}
      {skills.length > 0 && skills[0].name && (
        <div>
          <h2 className={headingStyle}>Skills</h2>
          <div className="flex flex-wrap gap-x-1">
            {skills.map((skill, index) => (
              <span key={index} className="text-sm">
                {skill.name}{index < skills.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* LaTeX Footer */}
      <div className="mt-8 pt-2 border-t border-gray-300 text-xs text-center text-gray-500">
        Generated with LaTeX-inspired template • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'latex',
    name: 'LaTeX Academic',
    icon: <Code className="h-4 w-4" />,
    component: LatexTemplate,
    description: 'Clean academic style inspired by LaTeX documents'
  },
  {
    id: 'classic',
    name: 'Classic',
    icon: <FileText className="h-4 w-4" />,
    component: ClassicTemplate,
    description: 'Traditional resume layout with a professional look'
  },
  {
    id: 'modern',
    name: 'Modern',
    icon: <Briefcase className="h-4 w-4" />,
    component: ModernTemplate,
    description: 'Contemporary two-column design with visual elements'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    icon: <FileText className="h-4 w-4" />,
    component: MinimalistTemplate,
    description: 'Clean, simple design focused on content'
  }
];

export default resumeTemplates;
