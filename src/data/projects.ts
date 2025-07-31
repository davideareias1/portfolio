export type Project = {
  name: string;
  description: string;
  outcome?: string;
  testimonial?: string;
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
      "Achieved 98% calculation accuracy against industry standards, reducing client quoting time by an average of 30%.",
    tech: [
      "Next.js",
      "FastAPI",
      "TypeScript",
      "PostgreSQL",
      "Three.js",
      "Docker",
    ],
    imageUrl: "/placeholder.png",
    projectUrl: "",
    codeUrl: "",
  },
  {
    name: "AI-Powered WhatsApp Scheduling Assistant",
    description:
      "Built a custom, AI-powered WhatsApp assistant to solve a complex manual scheduling problem for an association. The bot automates the entire monthly shift schedule based on team preferences and allows members to manage swaps autonomously via chat.",
    testimonial:
      "Davide's solution gave me back 10 hours a week. The team is happier and scheduling runs itself.",
    tech: ["Python", "AI/ML Libraries", "WhatsApp API"],
    imageUrl: "/placeholder.png",
    projectUrl: "",
    codeUrl: "",
  },
  {
    name: "Instagram Automation Desktop App",
    description:
      "Created a desktop application that automates social media interactions on Instagram. The tool allows influencers and businesses to set up custom auto-responses, manage engagement through a dedicated dashboard, and increase their interaction rates.",
    outcome:
      "Successfully processed over 50,000 automated responses with 99.6% uptime, leading to a 40% engagement increase for initial users.",
    tech: ["Rust", "Tauri", "React", "TypeScript"],
    imageUrl: "/placeholder.png",
    projectUrl: "",
    codeUrl: "",
  },
];
