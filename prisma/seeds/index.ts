import { prisma } from "@/lib/prismaClient";
import bcrypt from 'bcrypt';
async function main() {
  const password =  await bcrypt.hash('password', 10);

    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
      },
    });
  
    const userRole = await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: {
        name: 'USER',
      },
    });
  
    console.log({ adminRole, userRole });
  
    const alice = await prisma.user.upsert({
      where: { username: 'alice' },
      update: {},
      create: {
        username: 'alice',
        password,
        roleId: adminRole.id,
      },
    });
  
    const bob = await prisma.user.upsert({
      where: { username: 'bob' },
      update: {},
      create: {
        username: 'bob',
        password,
        roleId: userRole.id,
      },
    });
  
    console.log({ alice, bob });
  
    const workLabel = await prisma.label.upsert({
      where: { title: 'Work' },
      update: {},
      create: {
        title: 'Work',
      },
    });
  
    const personalLabel = await prisma.label.upsert({
      where: { title: 'Personal' },
      update: {},
      create: {
        title: 'Personal',
      },
    });
  
    console.log({ workLabel, personalLabel });
  
    
    await prisma.todoList.upsert({
      where: { id: 'some-uuid-for-alice-todo-1' }, 
      update: {},
      create: {
        title: 'Build Prisma Seed Script',
        description: 'Create a comprehensive seed script for the current Prisma schema.',
        priority: 'HIGH',
        dueDate: new Date('2025-07-20T23:59:59Z'),
        labelId: workLabel.id,
        userId: alice.id,
      },
    });
  
    await prisma.todoList.upsert({
      where: { id: 'some-uuid-for-alice-todo-2' },
      update: {},
      create: {
        title: 'Buy Groceries',
        description: 'Milk, Eggs, Bread, Fruits',
        priority: 'MEDIUM',
        dueDate: new Date('2025-07-18T18:00:00Z'),
        labelId: personalLabel.id,
        userId: alice.id,
      },
    });
  
    
    await prisma.todoList.upsert({
      where: { id: 'some-uuid-for-bob-todo-1' }, 
      update: {},
      create: {
        title: 'Prepare Presentation',
        description: 'Finish slides for the quarterly review meeting.',
        priority: 'HIGH',
        dueDate: new Date('2025-07-25T10:00:00Z'),
        labelId: workLabel.id,
        userId: bob.id,
      },
    });
  
    await prisma.todoList.upsert({
      where: { id: 'some-uuid-for-bob-todo-2' }, 
      update: {},
      create: {
        title: 'Call Mom',
        description: 'Check in with Mom and plan weekend visit.',
        priority: 'LOW',
        isDone: true,
        dueDate: new Date('2025-07-19T12:00:00Z'),
        labelId: personalLabel.id,
        userId: bob.id,
      },
    });
  
    console.log('Seed data created successfully!');
  }
  
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });