import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Code, Server, Cpu } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Code,
      skills: [
        "HTML5 & CSS3",
        "JavaScript (ES6+)",
        "TypeScript",
        "React",
        "React Router",
        "Redux / Context API",
        "Tailwind CSS",
        "ShadCN UI",
        "Responsive Design",
        "REST API Integration",
        "Axios",
        "Builder.io",
        "React Hook Form",
        "SEO Basics",
        "Performance Optimization",
      ],
    },
    {
      title: "Backend Development",
      icon: Server,
      skills: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
        "JWT Authentication",
        "bcrypt",
        "REST APIs",
        "RBAC (Role-Based Access Control)",
        "Razorpay / PhonePe Integration",
        "Multer (File Uploads)",
        "Error Handling",
        "Middleware Development",
        "API Security",
        "Database Schema Design",
        "MVC Architecture",
      ],
    },
    {
      title: "DevOps & Deployment",
      icon: Cpu,
      skills: [
        "Linux (Ubuntu)",
        "aaPanel",
        "Nginx (Reverse Proxy)",
        "SSL (Let's Encrypt)",
        "PM2",
        "Git & GitHub",
        "Environment Variables",
        "Netlify",
        "Vercel",
        "DNS & Domain Setup",
        "Basic CI/CD",
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
                <div className="p-3 rounded-lg bg-primary/10">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              {/* Skills List */}
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                    className="group"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all">
                      <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-lg border border-primary/20 bg-primary/5 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Always Learning</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technology evolves rapidly, and so do I. I'm constantly exploring new frameworks, 
            tools, and best practices to deliver cutting-edge solutions and stay ahead in the field.
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Skills;
