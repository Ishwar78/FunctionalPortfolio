import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/database';
import { AdminUser } from '../models/AdminUser';
import { Project } from '../models/Project';
import { ContentSection } from '../models/ContentSection';
import { Experience } from '../models/Experience';
import { Certification } from '../models/Certification';
import { Blog } from '../models/Blog';
import { hashPassword } from '../utils/password';

const seed = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    await AdminUser.deleteMany({});
    const adminPassword = await hashPassword(
      process.env.ADMIN_DEFAULT_PASSWORD || 'Sachin@123'
    );
    const admin = new AdminUser({
      email: process.env.ADMIN_DEFAULT_EMAIL || 'sachintakoria2204@gmail.com',
      passwordHash: adminPassword,
      role: 'owner',
    });
    await admin.save();
    console.log('Admin user created');

    await Project.deleteMany({});
    const projects = [
      {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        short_description: 'A full-featured e-commerce platform with payment integration',
        detailed_description:
          'Built with React, Node.js, and MongoDB. Features include product catalog, shopping cart, payment processing with Stripe, and admin dashboard.',
        tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        category: 'E-Commerce',
        cover_image_url: 'https://via.placeholder.com/400x300?text=E-Commerce',
        github_url: 'https://github.com/example/ecommerce',
        live_url: 'https://ecommerce.example.com',
        is_featured: true,
        display_order: 1,
        readme_content: `# E-Commerce Platform

## Features
- Product catalog with search and filtering
- Shopping cart management
- Payment integration with Stripe
- User authentication
- Admin dashboard

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Payment: Stripe

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
      },
      {
        title: 'Real Estate Management System',
        slug: 'real-estate-management',
        short_description: 'A property management and listing platform',
        detailed_description:
          'Complete solution for real estate agents and brokers with property listings, client management, and document handling.',
        tech_stack: ['React', 'TypeScript', 'Firebase', 'Google Maps API'],
        category: 'Real Estate',
        cover_image_url: 'https://via.placeholder.com/400x300?text=Real+Estate',
        github_url: 'https://github.com/example/realestate',
        live_url: 'https://realestate.example.com',
        is_featured: true,
        display_order: 2,
        readme_content: `# Real Estate Management System

## Features
- Property listings with detailed information
- Virtual tours integration
- Client management system
- Document upload and management
- Advanced search filters

## Technology
- React with TypeScript
- Firebase for authentication and database
- Google Maps API integration
- Tailwind CSS for styling
`,
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        short_description: 'A collaborative task and project management application',
        detailed_description:
          'Team collaboration tool for task tracking, project management, and team communication.',
        tech_stack: ['Vue.js', 'Node.js', 'PostgreSQL', 'WebSocket'],
        category: 'Web Apps',
        cover_image_url: 'https://via.placeholder.com/400x300?text=Task+Manager',
        github_url: 'https://github.com/example/taskmanager',
        is_featured: false,
        display_order: 3,
        readme_content: `# Task Management App

## Overview
A modern task management application for teams to collaborate effectively.

## Key Features
- Real-time task updates
- Team collaboration
- Sprint planning
- Progress tracking
- Notifications
`,
      },
    ];

    await Project.insertMany(projects);
    console.log('Projects seeded');

    await ContentSection.deleteMany({});
    const contentSections = [
      {
        key: 'hero',
        content: {
          title: 'Hi, I\'m Sachin Takoria',
          subtitle: 'Full Stack Developer | MERN Specialist',
          image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
          ctas: [
            { text: 'View My Work', href: '/projects' },
            { text: 'Get in Touch', href: '/contact' },
          ],
        },
      },
      {
        key: 'about',
        content: {
          summary:
            'I\'m a passionate full-stack developer with expertise in modern web technologies.',
          highlights: [
            'Built 20+ web applications',
            'Expert in MERN stack',
            'AWS certified',
            'Open source contributor',
          ],
        },
      },
      {
        key: 'skills',
        content: {
          frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          backend: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
          devops: ['Docker', 'AWS', 'GitHub Actions', 'Nginx'],
        },
      },
      {
        key: 'contact',
        content: {
          email: 'sachintakoria2204@gmail.com',
          phone: '+91 7015242844',
          address: 'India',
          whatsapp_number: '7015242844',
        },
      },
      {
        key: 'social',
        content: {
          github: 'https://github.com/sachintakoria',
          linkedin: 'https://linkedin.com/in/sachintakoria',
          twitter: 'https://twitter.com/sachintakoria',
          instagram: 'https://instagram.com/sachintakoria',
        },
      },
      {
        key: 'banners',
        content: {
          items: [
            {
              image_url: 'https://via.placeholder.com/1200x400?text=Banner+1',
              alt: 'Portfolio Banner 1',
              link_url: '/projects',
              order: 1,
            },
            {
              image_url: 'https://via.placeholder.com/1200x400?text=Banner+2',
              alt: 'Portfolio Banner 2',
              link_url: '/about',
              order: 2,
            },
          ],
        },
      },
    ];

    await ContentSection.insertMany(contentSections);
    console.log('Content sections seeded');

    await Experience.deleteMany({});
    const experiences = [
      {
        position: 'Full Stack Developer',
        company: 'Satya Web',
        startDate: '2023-06-01',
        endDate: '',
        isCurrent: true,
        location: 'India',
        description: [
          'Develop and maintain full-stack web applications using MERN stack',
          'Collaborate with cross-functional teams to deliver high-quality solutions',
          'Implement responsive designs and optimize application performance',
          'Write clean, maintainable code following best practices',
          'Participate in code reviews and contribute to team knowledge sharing',
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS', 'JavaScript'],
        companyLogo: 'https://via.placeholder.com/100x100?text=Satya+Web',
      },
      {
        position: 'Web Development Trainee',
        company: 'Code Plus',
        startDate: '2023-01-01',
        endDate: '2023-05-31',
        isCurrent: false,
        location: 'India',
        description: [
          'Completed comprehensive web development training program',
          'Learned MERN stack development fundamentals and advanced concepts',
          'Built multiple projects demonstrating full-stack capabilities',
          'Mastered responsive design and UI/UX best practices',
          'Gained hands-on experience with version control and deployment',
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'HTML/CSS', 'JavaScript', 'Git'],
        companyLogo: 'https://via.placeholder.com/100x100?text=Code+Plus',
      },
    ];

    await Experience.insertMany(experiences);
    console.log('Experiences seeded');

    await Certification.deleteMany({});
    const certifications = [
      {
        title: 'Full Stack Web Development',
        issuer: 'Code Plus',
        issueDate: '2023-05-31',
        expiryDate: '',
        credentialId: 'CODEPLUS-2023-001',
        credentialUrl: '',
        certificateImage: 'https://via.placeholder.com/400x300?text=Code+Plus+Certificate',
        description: 'Comprehensive training in MERN stack development covering frontend, backend, and database technologies.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs', 'Web Development'],
      },
      {
        title: 'JavaScript Fundamentals',
        issuer: 'Code Plus',
        issueDate: '2023-03-15',
        expiryDate: '',
        credentialId: 'CODEPLUS-JS-001',
        credentialUrl: '',
        certificateImage: 'https://via.placeholder.com/400x300?text=JavaScript+Certificate',
        description: 'Core JavaScript concepts including ES6+, async/await, and functional programming.',
        skills: ['JavaScript', 'ES6+', 'Async Programming', 'DOM Manipulation'],
      },
    ];

    await Certification.insertMany(certifications);
    console.log('Certifications seeded');

    await Blog.deleteMany({});
    const blogs = [
      {
        title: 'Getting Started with MERN Stack',
        slug: 'getting-started-with-mern-stack',
        excerpt: 'A comprehensive guide to setting up your first MERN stack project and understanding the basics of each technology.',
        content: '<h2>Introduction</h2><p>The MERN stack is a powerful combination of technologies for full-stack JavaScript development. In this guide, we\'ll explore what MERN is and how to get started.</p><h2>What is MERN?</h2><p>MERN stands for MongoDB, Express, React, and Node.js. These four technologies work together to provide a complete solution for building modern web applications.</p><h2>Getting Started</h2><p>To start with MERN, you\'ll need to have Node.js installed on your machine. Then, you can use Create React App to bootstrap your frontend, and set up Express for your backend.</p><h2>Key Advantages</h2><ul><li>Full JavaScript ecosystem - use the same language on frontend and backend</li><li>Scalable architecture</li><li>Large community and ecosystem</li><li>Great documentation and resources</li></ul><h2>Next Steps</h2><p>Start by building a simple project with CRUD operations. This will help you understand how the different technologies interact.</p>',
        featuredImage: 'https://via.placeholder.com/1200x600?text=MERN+Stack',
        author: 'Sachin Takoria',
        category: 'Web Development',
        tags: ['MERN', 'React', 'Node.js', 'MongoDB', 'JavaScript'],
        publishedAt: new Date('2024-01-15'),
        isPublished: true,
        viewCount: 0,
      },
      {
        title: 'React Hooks: The Complete Guide',
        slug: 'react-hooks-complete-guide',
        excerpt: 'Master React Hooks and learn how to use useState, useEffect, useContext and custom hooks in your applications.',
        content: '<h2>What are React Hooks?</h2><p>React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have become the standard way to write React components.</p><h2>Common Hooks</h2><h3>useState</h3><p>The useState hook allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.</p><h3>useEffect</h3><p>useEffect lets you perform side effects in functional components. It runs after every render by default, but you can control when it runs with the dependency array.</p><h3>useContext</h3><p>useContext allows you to consume context values without wrapping your component in a Consumer component. This makes the code cleaner and easier to read.</p><h2>Custom Hooks</h2><p>You can create your own hooks by combining existing hooks and logic. Custom hooks are JavaScript functions that can use other hooks.</p><h2>Best Practices</h2><ul><li>Only call hooks at the top level of your component</li><li>Use the ESLint plugin to help you follow the rules</li><li>Create custom hooks to share stateful logic</li><li>Keep hooks focused and single-purpose</li></ul>',
        featuredImage: 'https://via.placeholder.com/1200x600?text=React+Hooks',
        author: 'Sachin Takoria',
        category: 'React',
        tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
        publishedAt: new Date('2024-01-20'),
        isPublished: true,
        viewCount: 0,
      },
      {
        title: 'Understanding Async/Await in JavaScript',
        slug: 'async-await-javascript',
        excerpt: 'Learn how to write clean asynchronous code using async/await syntax and master error handling.',
        content: '<h2>What are Async/Await?</h2><p>Async/await is a modern way to handle asynchronous operations in JavaScript. It makes asynchronous code look and behave like synchronous code, making it easier to understand and maintain.</p><h2>Basic Syntax</h2><p>An async function returns a Promise. Inside an async function, you can use the await keyword to wait for a Promise to resolve.</p><h2>Error Handling</h2><p>You can use try/catch blocks with async/await to handle errors gracefully. This is much cleaner than chaining .catch() methods on Promises.</p><h2>Real-world Examples</h2><h3>Fetching Data from an API</h3><p>A common use case for async/await is fetching data from APIs. Instead of using .then(), you can use async/await to make the code more readable.</p><h3>Database Operations</h3><p>When working with databases, async/await helps you write cleaner code for multiple sequential operations.</p><h2>Performance Considerations</h2><ul><li>Avoid using await in loops when you can use Promise.all()</li><li>Be mindful of error handling to avoid unhandled promise rejections</li><li>Use async/await for better code readability, but understand it\'s just syntactic sugar over Promises</li></ul>',
        featuredImage: 'https://via.placeholder.com/1200x600?text=Async+Await',
        author: 'Sachin Takoria',
        category: 'JavaScript',
        tags: ['JavaScript', 'Async', 'Promises', 'Backend'],
        publishedAt: new Date('2024-01-25'),
        isPublished: true,
        viewCount: 0,
      },
      {
        title: 'Building RESTful APIs with Express',
        slug: 'building-restful-apis-express',
        excerpt: 'A step-by-step guide to creating robust RESTful APIs using Express.js and best practices for API design.',
        content: '<h2>Introduction to REST</h2><p>REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD operations on resources.</p><h2>Express Basics</h2><p>Express is a minimal and flexible Node.js framework that provides a robust set of features for building APIs. It handles routing, middleware, and HTTP utilities.</p><h2>Creating Endpoints</h2><h3>GET Requests</h3><p>GET requests are used to retrieve data. They are safe and idempotent, meaning multiple identical requests should produce the same result.</p><h3>POST Requests</h3><p>POST requests are used to create new resources. They send data to the server, typically in the request body.</p><h3>PUT and PATCH Requests</h3><p>PUT updates an entire resource, while PATCH updates only specific fields. Both are used for modifying existing data.</p><h3>DELETE Requests</h3><p>DELETE requests remove a resource from the server.</p><h2>Middleware</h2><p>Middleware functions are executed during the request-response cycle. They can perform tasks like authentication, validation, and logging.</p><h2>Best Practices</h2><ul><li>Use proper HTTP status codes</li><li>Implement proper error handling</li><li>Use middleware for cross-cutting concerns</li><li>Version your API for backward compatibility</li><li>Document your API thoroughly</li></ul>',
        featuredImage: 'https://via.placeholder.com/1200x600?text=Express+APIs',
        author: 'Sachin Takoria',
        category: 'Backend',
        tags: ['Express', 'REST API', 'Node.js', 'Backend'],
        publishedAt: new Date('2024-02-01'),
        isPublished: true,
        viewCount: 0,
      },
      {
        title: 'MongoDB Best Practices',
        slug: 'mongodb-best-practices',
        excerpt: 'Learn the best practices for designing MongoDB databases and optimizing queries for better performance.',
        content: '<h2>Schema Design</h2><p>Unlike traditional SQL databases, MongoDB is schema-less. However, good schema design is still important for application performance and maintainability.</p><h2>Document Structure</h2><p>Keep documents relatively flat. Avoid deeply nested structures that make queries complex and slow.</p><h2>Indexing</h2><p>Create indexes on fields that are frequently queried. Indexes speed up query performance but slow down write operations.</p><h2>Query Optimization</h2><h3>Use Projection</h3><p>Only retrieve the fields you need. This reduces the amount of data transferred and improves query speed.</p><h3>Use Aggregation</h3><p>The aggregation framework is powerful for complex data processing. Use it for filtering, grouping, and transforming data.</p><h2>Transactions</h2><p>MongoDB supports transactions starting from version 4.0. Use transactions to ensure data consistency across multiple documents.</p><h2>Performance Tips</h2><ul><li>Monitor your queries with explain() to understand execution plans</li><li>Avoid large documents and consider denormalizing when appropriate</li><li>Use connection pooling for better resource management</li><li>Regularly backup your data</li><li>Use monitoring tools to identify performance bottlenecks</li></ul>',
        featuredImage: 'https://via.placeholder.com/1200x600?text=MongoDB',
        author: 'Sachin Takoria',
        category: 'Database',
        tags: ['MongoDB', 'Database', 'NoSQL', 'Backend'],
        publishedAt: new Date('2024-02-05'),
        isPublished: true,
        viewCount: 0,
      },
    ];

    await Blog.insertMany(blogs);
    console.log('Blogs seeded');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await disconnectDB();
  }
};

seed();
