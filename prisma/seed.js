import { prisma } from "../db.js";

/*
PROJECT STATUS IDS
*/
const PROJECT_STATUS = {
  DRAFT: "042a3856-3d8b-4488-91e7-080fb8da0c68",
  PLANNED: "203cc75b-09f9-4b44-bd83-c0e25e273530",
  ACTIVE: "d291e4a0-d478-4439-91dc-dc7e4c4f5314",
  ON_HOLD: "38d8e602-d1f2-474f-8ebe-d207f748282a",
  AT_RISK: "e7100b5d-96dc-4604-b4f7-2804402cd0f4",
  COMPLETED: "9ac7ff76-0942-4e17-9894-d6d9978d58c8",
};

/*
DELIVERABLE STATUS IDS
*/
const DELIVERABLE_STATUS = {
  BACKLOG: "13097822-60ae-4dd1-b6be-4b5f5fc9e553",
  IN_PROGRESS: "e5779863-b26e-40bc-ac50-b439f15c1ecb",
  BLOCKED: "05ead689-c00f-47c1-9e9c-313c6d015203",
  IN_REVIEW: "fc4edb30-a6fb-47f5-82d5-5d92f4c11fb2",
  CHANGES_REQUESTED: "b7c189f6-ea6d-4a81-a00c-48ec4cdbc5cb",
  APPROVED: "ebeed215-56aa-49ec-878c-82cf7d2890a2",
  READY: "2b1bf03c-a1f0-4d15-b429-1aff81e3e9c3",
  DELIVERED: "c61d7238-a662-4a6a-8168-3654bf327f0d",
};

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function createStatuses() {
  const projectStatuses = [
    {
      id: PROJECT_STATUS.DRAFT,
      status: "Draft",
      statusType: "PROJECT",
    },
    {
      id: PROJECT_STATUS.PLANNED,
      status: "Planned",
      statusType: "PROJECT",
    },
    {
      id: PROJECT_STATUS.ACTIVE,
      status: "Active",
      statusType: "PROJECT",
    },
    {
      id: PROJECT_STATUS.ON_HOLD,
      status: "On Hold",
      statusType: "PROJECT",
    },
    {
      id: PROJECT_STATUS.AT_RISK,
      status: "At Risk",
      statusType: "PROJECT",
    },
    {
      id: PROJECT_STATUS.COMPLETED,
      status: "Completed",
      statusType: "PROJECT",
    },
  ];

  const deliverableStatuses = [
    {
      id: DELIVERABLE_STATUS.BACKLOG,
      status: "Backlog",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.IN_PROGRESS,
      status: "In Progress",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.BLOCKED,
      status: "Blocked",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.IN_REVIEW,
      status: "In Review",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.CHANGES_REQUESTED,
      status: "Changes Requested",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.APPROVED,
      status: "Approved",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.READY,
      status: "Ready",
      statusType: "DELIVERABLE",
    },
    {
      id: DELIVERABLE_STATUS.DELIVERED,
      status: "Delivered",
      statusType: "DELIVERABLE",
    },
  ];

  for (const s of [...projectStatuses, ...deliverableStatuses]) {
    await prisma.status.upsert({
      where: { id: s.id },
      update: {
        status: s.status,
        statusType: s.statusType,
      },
      create: s,
    });
  }

  console.log("Statuses created");
}

async function clearDatabase() {
  await prisma.$transaction([
    prisma.deliverable.deleteMany(),
    prisma.project.deleteMany(),
    prisma.client.deleteMany(),
  ]);

  console.log("Database cleared (Status preserved)");
}

async function main() {
  await clearDatabase();
  await createStatuses();

  const clients = [
    { name: "BrightPath Marketing", email: "contact@brightpath.io" },
    { name: "Northstar Logistics", email: "ops@northstarlogistics.com" },
    { name: "BluePeak Software", email: "team@bluepeak.dev" },
    { name: "UrbanHive Studios", email: "hello@urbanhive.co" },
    { name: "GreenLeaf Organics", email: "info@greenleaforganics.com" },
    { name: "Velocity Fitness", email: "admin@velocityfitness.io" },
    { name: "Nimbus Cloud Solutions", email: "contact@nimbuscloud.tech" },
    { name: "Atlas Financial Group", email: "support@atlasfinancial.com" },
  ];

  for (const clientData of clients) {
    const client = await prisma.client.create({
      data: clientData,
    });

    /*
    ACTIVE PROJECT
    */
    const activeProject = await prisma.project.create({
      data: {
        name: "Client Platform Development",
        clientId: client.id,
        statusId: PROJECT_STATUS.ACTIVE,
        status_Detail: "Development progressing on schedule",
        due_Date: daysFromNow(40),
      },
    });

    await prisma.deliverable.createMany({
      data: [
        {
          name: "Requirements Specification",
          projectId: activeProject.id,
          statusId: DELIVERABLE_STATUS.DELIVERED,
          due_Date: daysFromNow(-20),
          note: "Approved by client",
        },
        {
          name: "UI Design",
          projectId: activeProject.id,
          statusId: DELIVERABLE_STATUS.IN_REVIEW,
          due_Date: daysFromNow(-2),
          note: "Awaiting client approval",
        },
        {
          name: "Backend API",
          projectId: activeProject.id,
          statusId: DELIVERABLE_STATUS.IN_PROGRESS,
          due_Date: daysFromNow(10),
          note: "Core endpoints implemented",
        },
        {
          name: "Frontend Implementation",
          projectId: activeProject.id,
          statusId: DELIVERABLE_STATUS.BACKLOG,
          due_Date: daysFromNow(25),
          note: "Scheduled after API completion",
        },
        {
          name: "Deployment Setup",
          projectId: activeProject.id,
          statusId: DELIVERABLE_STATUS.BLOCKED,
          due_Date: daysFromNow(5),
          note: "Waiting for infrastructure access",
        },
      ],
    });

    /*
    AT RISK PROJECT
    */
    const riskProject = await prisma.project.create({
      data: {
        name: "Analytics Dashboard",
        clientId: client.id,
        statusId: PROJECT_STATUS.AT_RISK,
        status_Detail: "Delayed due to external API instability",
        due_Date: daysFromNow(15),
      },
    });

    await prisma.deliverable.createMany({
      data: [
        {
          name: "Data Pipeline Setup",
          projectId: riskProject.id,
          statusId: DELIVERABLE_STATUS.BLOCKED,
          due_Date: daysFromNow(-5),
          note: "External API instability",
        },
        {
          name: "Metrics Dashboard",
          projectId: riskProject.id,
          statusId: DELIVERABLE_STATUS.CHANGES_REQUESTED,
          due_Date: daysFromNow(-1),
          note: "Client requested layout revision",
        },
        {
          name: "User Permissions Module",
          projectId: riskProject.id,
          statusId: DELIVERABLE_STATUS.IN_PROGRESS,
          due_Date: daysFromNow(7),
          note: "Backend partially implemented",
        },
      ],
    });

    /*
    COMPLETED PROJECT
    */
    const completedProject = await prisma.project.create({
      data: {
        name: "Marketing Website",
        clientId: client.id,
        statusId: PROJECT_STATUS.COMPLETED,
        status_Detail: "Project completed and delivered successfully",
        due_Date: daysFromNow(-30),
      },
    });

    await prisma.deliverable.createMany({
      data: [
        {
          name: "Landing Page",
          projectId: completedProject.id,
          statusId: DELIVERABLE_STATUS.DELIVERED,
          due_Date: daysFromNow(-60),
          note: "Delivered and approved by client",
        },
        {
          name: "Contact Form",
          projectId: completedProject.id,
          statusId: DELIVERABLE_STATUS.DELIVERED,
          due_Date: daysFromNow(-55),
          note: "Integrated with email notifications",
        },
        {
          name: "SEO Optimization",
          projectId: completedProject.id,
          statusId: DELIVERABLE_STATUS.DELIVERED,
          due_Date: daysFromNow(-50),
          note: "Search indexing and metadata finalized",
        },
      ],
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
