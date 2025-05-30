This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

 Admin Role
Admins are the supervisors or managers of the platform. Their responsibilities typically include:

🔧 Functional Abilities:
Create, assign, and edit projects or tasks

Add, remove, or manage team members (staff)

View and track all project progress and timelines

Set permissions for staff

Access detailed reports or analytics

Manage deadlines and task priority

Communicate with team members (chat/notes)

🔐 Access Control:
Full access to the entire dashboard.

Can view both their own and staff sections.

Example Use Case:
Ethan Walker logs in as admin → opens the dashboard → assigns a task to Sophia Taylor → monitors its progress.

✅ Staff Role
Staff are the team members or employees who work on the tasks assigned by the admin.

👷 Functional Abilities:
View only their assigned projects or tasks

Update task status (in progress, done, etc.)

Comment or ask questions via chat

View deadlines, task details, and notes

Collaborate with other staff on assigned tasks

🔐 Access Control:
Limited access: can only see what's assigned to them.

Cannot create or assign new projects.

No access to admin-level analytics or team management features.