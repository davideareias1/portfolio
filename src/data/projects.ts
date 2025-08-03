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
      "Created an intuitive SaaS platform that empowers homeowners to take control of their home's energy efficiency. With interactive 3D modeling, users can easily replicate their own house, experiment with upgrades like new windows or insulation, and run scenario analyses to see how different improvements impact heat loss and system costs. This tool enables homeowners to make data-driven decisions—often discovering that a modest investment (e.g., €5k in upgrades) can lead to much greater savings (e.g., €15k) on their heating system.",
    outcome:
      "Enabled homeowners to achieve up to 98% accuracy in heat loss calculations compared to industry standards, making professional-level scenario analysis accessible to everyone. This platform became the foundation for launching JouleTech, a startup I built from the ground up to transform how people approach home heating upgrades.",
    tech: [
      "Next.js",
      "FastAPI",
      "TypeScript",
      "PostgreSQL",
      "Three.js",
      "Docker",
    ],
    imageUrl: "/projects/jouletech.webp",
    projectUrl: "",
    codeUrl: "",
  },
  {
    name: "AI-Powered WhatsApp Scheduling Assistant",
    description:
      "Developed an AI-powered WhatsApp assistant to tackle the association’s complex and time-consuming shift scheduling. The association’s flexible approach allowed workers to set preferences and swap shifts, but this created a heavy coordination burden to handle the constant calls and changes. My solution uses WhatsApp, their main communication channel, to register each member’s preferences, intelligently match and generate the optimal monthly shift schedule, and then enable seamless shift swaps: when someone requests a swap, the bot notifies the other party directly via WhatsApp. This distributed the workload among members, automated the process, and provided a creative, user-friendly fit for their real-world needs.",
    testimonial:
      "Davide's solution gave me back 8 hours a week. The team embraced the new tool and scheduling runs itself.",
    testimonialName: "Ana Cristina",
    tech: ["Python", "FastAPI", "WhatsApp API", "Docker", "PostgreSQL"],
    imageUrl: "/projects/whatsapp-scheduler.webp",
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
    imageUrl: "/projects/dmtrigger.webp",
    projectUrl: "",
    codeUrl: "",
  },
];
