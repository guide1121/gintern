import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const oldName = "ผู้รีวิวยุกบุกเบิก";
  const newName = "ผู้รีวิวยุคบุกเบิก";
  
  console.log("-----------------------------------------");
  console.log("เริ่มกระบวนการปรับปรุงและอัปเดตตราสัญลักษณ์...");

  // 1. ตรวจสอบว่ามี Badge ชื่อสะกดผิดอยู่หรือไม่
  const existingOldBadge = await prisma.badge.findUnique({
    where: { name: oldName }
  });

  let badge;

  if (existingOldBadge) {
    console.log(`พบตราสัญลักษณ์สะกดผิด "${oldName}" (ID: ${existingOldBadge.id}) กำลังทำการเปลี่ยนชื่อ...`);
    badge = await prisma.badge.update({
      where: { id: existingOldBadge.id },
      data: {
        name: newName,
        description: "ผู้ใช้งานและผู้รีวิวยุคแรกเริ่มที่ร่วมบุกเบิกชุมชน GIntern",
      }
    });
    console.log(`เปลี่ยนชื่อเป็น "${newName}" สำเร็จ!`);
  } else {
    // 2. ถ้าไม่มีชื่อเก่า ให้สร้างหรือตรวจสอบชื่อใหม่
    badge = await prisma.badge.upsert({
      where: { name: newName },
      update: {},
      create: {
        name: newName,
        description: "ผู้ใช้งานและผู้รีวิวยุคแรกเริ่มที่ร่วมบุกเบิกชุมชน GIntern",
        icon: "Sparkles",
      }
    });
    console.log(`พบหรือสร้างตราสัญลักษณ์ "${newName}" สำเร็จ (ID: ${badge.id})`);
  }

  // 3. ตรวจสอบว่าผู้ใช้ทุกคนได้รับ Badge นี้แล้วหรือยัง
  const users = await prisma.user.findMany({
    include: {
      badges: true
    }
  });

  console.log(`พบผู้ใช้งานในระบบจำนวนทั้งสิ้น: ${users.length} คน`);

  let assignedCount = 0;
  for (const user of users) {
    const hasBadge = user.badges.some(b => b.id === badge.id);
    if (!hasBadge) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            badges: {
              connect: { id: badge.id }
            }
          }
        });
        console.log(`- มอบตราสัญลักษณ์ให้เพิ่มเติม: ${user.name} (${user.email})`);
        assignedCount++;
      } catch (error) {
        console.error(`X เกิดข้อผิดพลาดในการมอบตราสัญลักษณ์ให้คุณ ${user.name}:`, error);
      }
    } else {
      console.log(`- ${user.name} มีตราสัญลักษณ์นี้อยู่แล้ว`);
    }
  }

  console.log("-----------------------------------------");
  console.log(`เสร็จสิ้นกระบวนการ! มอบตราสัญลักษณ์เพิ่มเติมสำเร็จ ${assignedCount} คน`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("เกิดข้อผิดพลาดในการรันสคริปต์:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
