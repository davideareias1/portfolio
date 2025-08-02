export type Project = {
  name: string;
  description: string;
  outcome?: string;
  testimonial?: string;
  testimonialName?: string;
  tech: string[];
  imageUrl: string;
  projectUrl?: string;
  codeUrl?: string;
};

export const projects: Project[] = [
  {
    name: "Heating Systems Simulator as SaaS",
    description:
      "Developed a comprehensive SaaS platform to help heating engineers digitalize their companies. The tool uses interactive 3D modeling and precise heat loss calculations to optimize home heating systems, empowering engineers to provide data-driven recommendations to their clients.",
    outcome:
      "Achieved 98% calculation accuracy against industry standards. This software became the foundation for launching JouleTech, a startup where I built the entire platform from the ground up, demonstrating significant impact in the heating engineering industry.",
    tech: [
      "Next.js",
      "FastAPI",
      "TypeScript",
      "PostgreSQL",
      "Three.js",
      "Docker",
    ],
    imageUrl: "/projects/jouletech.png",
    projectUrl: "",
    codeUrl: "",
  },
  {
    name: "AI-Powered WhatsApp Scheduling Assistant",
    description:
      "Built a custom, AI-powered WhatsApp assistant to solve a complex manual scheduling problem for an association. The bot automates the entire monthly shift schedule based on team preferences and allows members to manage swaps autonomously via chat.",
    testimonial:
      "Davide's solution gave me back 8 hours a week. The team embraced the new tool and scheduling runs itself.",
    testimonialName: "Ana Cristina",
    tech: ["Python", "FastAPI", "WhatsApp API", "Docker", "PostgreSQL"],
    imageUrl: "/projects/whatsapp-scheduler.jpeg",
    projectUrl: "",
    codeUrl: "",
  },
  {
    name: "DMTrigger - Instagram Automation SaaS",
    description:
      "Built a SaaS platform that automates Instagram engagement for content creators and businesses. The tool enables users to set up custom keyword triggers, automated comment replies, and personalized direct messages to enhance viewer experience and eliminate the need for 'link in bio' approaches.",
    outcome:
      "Delivers automated responses under 5 seconds with intelligent keyword detection. The client is already experiencing significant success with increased engagement and streamlined customer interactions.",
    tech: ["React", "TypeScript", "Instagram API", "Supabase", "Vercel"],
    imageUrl: "/projects/dmtrigger.png",
    projectUrl: "",
    codeUrl: "",
  },
];
