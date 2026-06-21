@AGENTS.md

# GIntern — Project Context

## ภาพรวมโปรเจกต์

GIntern คือเว็บแพลตฟอร์มรีวิวที่ฝึกงานจากรุ่นพี่สู่รุ่นน้อง (แนวทาง Glassdoor แต่โฟกัสเฉพาะ internship ในไทย)
กลุ่มเป้าหมายคือนักศึกษาไทยที่กำลังหาที่ฝึกงาน ต้องการข้อมูลจริงจากคนที่เคยฝึกงานมาก่อน

**Core value proposition:** พื้นที่ปลอดภัยให้นักศึกษาแชร์ประสบการณ์ฝึกงานจริง ไม่ fake ไม่ผ่านการคัดกรองจากบริษัท

**สถานะ:** ลุยจริงจัง ไม่ใช่แค่ side project — แต่ต่อยอดแบบค่อยเป็นค่อยไป (เริ่ม MVP เล็กก่อน)

---

## Brand identity

### ชื่อ
**GIntern** (อ่านว่า จี-อิน-เทิร์น) — ผ่านการเช็คแล้วว่าไม่ชนกับ business/platform ในวงการ internship ใดๆ
(ต่างจาก InternInsight, InternXP, InternView, Intearn, Internext ที่เช็คแล้วมีคนใช้ชื่อใกล้เคียงในวงการเดียวกัน)

ความหมายของ "G": เปิดกว้างตีความได้ (Good / Genuine / Go) — ต้องมี tagline ช่วยสื่อความหมายเสมอ
เนื่องจากตัวชื่อเองไม่ได้บอกความหมายตรงไปตรงมาแบบ "InternInsight"

**Tagline แนวทาง:** สื่อถึง "รีวิวฝึกงานจริงจากรุ่นพี่" — ตัวอย่าง "GIntern — รีวิวฝึกงานจากรุ่นพี่ตัวจริง"

### โดเมน
- **ช่วง MVP/testing:** ใช้ `gintern.vercel.app` (ฟรี ไม่มีค่าใช้จ่าย)
- **ช่วง launch จริง (พร้อมให้คนนอกทีมใช้):** ซื้อโดเมน `.com` ที่ Porkbun (ราคาคงที่ ~$11/ปี ทั้งปีแรกและปีต่ออายุ ไม่มี renewal shock)
- หลีกเลี่ยง TLD แปลกที่ดูเหมือนถูกปีแรกแต่ renew แพง (เช่น .online ที่ renew ~$28.84/ปี, .space ที่แพงกว่า .com ระยะยาว)

### Design direction
**Playful, pastel, เป็นกันเอง, อ่านง่าย, สบายตา** — อ้างอิงแนวทางเดียวกับ Fastwork ที่มี unique visual identity จดจำได้ทันที

**สื่อถึง:** internship + การเริ่มต้นเส้นทางอาชีพที่ดี (ไม่ใช่แค่สวย ต้องสื่อความหมายด้วย)

---

## Color palette — โทนฟ้า + มินต์ (เวอร์ชัน B)

แนวคิด: ฟ้าและมินต์อยู่ใกล้กันในวงล้อสี (analogous) ให้ความรู้สึกกลมกลืน เย็นสบาย เป็นมิตร
ปุ่ม CTA ใช้ฟ้าพาสเทลเข้มขึ้นเล็กน้อย (ไม่ใช่ accent ตัดกันจัด) เพื่อให้ภาพรวมดู monochromatic ไม่ฉูดฉาด

### สีหลัก (Primary — ฟ้า)
- **Background:** `#F1FAFA` — พื้นหลังหลักของเว็บ ใกล้ขาว อ่านง่าย
- **Primary light:** `#BFE2F5` — ใช้กับ surface รอง, icon background, avatar placeholder
- **Primary mid (ปุ่ม/CTA):** `#7FC1E8` — ใช้เป็นปุ่มหลัก, ลิงก์ที่ต้องการความสนใจ
- **Text บนปุ่ม:** `#1E4E68` (ฟ้าเข้มเข้ม ไม่ใช่ขาว) — ให้ภาพรวมดูกลมกลืนเป็นโทนฟ้าทั้งหมด

### สีเสริม (Accent — มินต์)
ใช้เป็น **สีเสริมเท่านั้น** ไม่ใช่ปุ่มหลัก — สำหรับ badge, ไอคอนเล็ก, success state, การันตี/verified mark
- **Mint accent:** `#7DD0B8`
- **Mint text (บน mint background):** `#1B4B3D`

### ตัวอักษร (Text)
- **Heading/Primary text:** `#223A35` (เขียวเข้มอมเทา อ่านง่ายบนพื้นฟ้าอ่อน)
- **Secondary/Body text:** `#3A5C5C`

### Border / Divider
- **Card border:** `#D6F0E8`

### กฎการใช้สี (Accessibility safe zone)
- ห้ามใช้ pastel-on-pastel สำหรับข้อความสำคัญ — ข้อความต้องเป็นสีเข้ม (shade เข้มของสีตระกูลเดียวกัน) บนพื้น pastel เสมอ
- พื้นหลังหลักต้องใกล้ขาว ไม่ใช่ pastel เข้ม เพื่อให้ contrast กับข้อความสีเข้มชัดเจน
- ปุ่ม CTA ต้องสังเกตเห็นง่ายแม้จะกลมกลืนกับ palette — ถ้าทดสอบแล้วปุ่มจมเกินไป ให้ปรับเข้มขึ้นอีกหนึ่ง shade

---

## Logo

ใช้ `logo-draft2.png` ที่อยู่ใน project root (copy ไปเป็น `public/logo.png` แล้ว)

แนวทางที่ตกลงกันไว้ตอน brainstorm (ใช้เป็น reference หากต้องปรับ/สร้างใหม่):
- ต้องสื่อถึงตัว **G** ชัดเจน (เชื่อมกับชื่อแบรนด์)
- สื่อถึง "การเริ่มต้น/เติบโต" — ไอเดียที่เคยลองมา: sprout (ใบงอกจาก G), เส้นทางจุดเริ่มต้นพุ่งขึ้น
- Style: filled shape + pastel colors, ไม่ใช่ outline เส้นเดียวสีเข้มแบบ corporate/fintech
- ต้องอ่านออกง่ายเมื่อย่อเป็น favicon ขนาดเล็ก (16x16, 32x32px) — ไม่ใช้เส้นโค้งซับซ้อนหลายชั้น

---

## Tech stack

- **Frontend:** Next.js (App Router)
- **Backend/DB:** Supabase (Auth + Postgres + Storage)
- **Hosting:** Vercel
- **Deploy domain ปัจจุบัน:** gintern.vercel.app

### Data model หลัก (Phase 1 MVP)

```sql
companies (
  id, name, industry, logo_url
)

reviews (
  id, company_id, user_id, role,
  experience_type,  -- 'intern' | 'employee'
  rating_overall,   -- 1-5 ดาว
  rating_mentor, rating_learning, rating_workload, rating_culture,  -- 1-5
  pay_amount, pay_type,  -- optional
  content,          -- body text
  images,           -- optional, array of image URLs
  created_at, updated_at
)

review_likes (
  id, review_id, user_id, created_at
)

review_comments (
  id, review_id, user_id, content, created_at
)

users (
  id, email, display_name, avatar_url, review_count
)
```

**สำคัญ:** ต้องเปิดใช้ Supabase Row Level Security (RLS) เพราะมี sensitive data (เงินเดือน/ค่าฝึกงาน, ความเห็นเกี่ยวกับบริษัท)

---

## ✅ สิ่งที่ตัดสินใจแล้ว

### Business logic
- **Cold-start strategy:**
  1. Seed content จากทีม+เพื่อน — เขียนรีวิวจริงจากประสบการณ์จริง ตั้งเป้า 20-30 รีวิวก่อน launch
  2. เปิดรับรีวิวจากพี่ๆ พนักงานจริง (ไม่จำกัดแค่ intern) — ขยาย content pool + เด็กฝึกงานได้มุมมองคนทำงานจริง
  3. Social sharing ง่าย — OG card สวยๆ แชร์ลง Facebook/LINE/TikTok ได้เลย
  4. โพสต์ใน FB groups ที่มี traffic อยู่แล้ว ให้ value ก่อน ไม่ spam
- **Verification:** ไม่บังคับ verify ตัวตน — login ธรรมดา (email/password หรือ social login) อาจมียืนยันตัวตนเบาๆ
- **โครงสร้างคะแนน:** 4 มิติ (mentor, learning, workload, culture) + คะแนนรวม (ดาว 5 ดาว)
- **เงินเดือน/เบี้ยเลี้ยง:** optional
- **Moderation:** ยังไม่ต้องมีตอน MVP
- **แก้ไข/ลบรีวิว:** ผู้โพสต์สามารถแก้ไขและลบรีวิวของตัวเองได้

### รูปแบบรีวิว (Post-style)
รีวิวแต่ละอันเป็นเหมือน "โพสต์" ประกอบด้วย:
- ข้อมูลผู้รีวิว (ชื่อ/avatar)
- ชื่อบริษัท + ตำแหน่ง
- ประเภทประสบการณ์: **intern** หรือ **พนักงานจริง**
- คะแนนรวม (5 ดาว)
- เนื้อหารีวิว (body text)
- รูปภาพประกอบ (optional)
- คะแนน 4 มิติ (mentor, learning, workload, culture)
- เบี้ยเลี้ยง/เงินเดือน (optional)
- **Like** และ **Comment** ได้เหมือน Facebook/LinkedIn

### Landing page
- ค้นหาและกรองได้ตาม: บริษัท, สายงาน, เบี้ยเลี้ยง
- Sort ได้ตาม: จำนวนรีวิว, จำนวนเบี้ยเลี้ยง

### UI direction
- **Playful, ขี้เล่น, ดึงดูด, เป็นกันเอง, safezone, สบายตา**
- **Card design — no border, no shadow** (clean flat cards)
- Mobile-first (กลุ่มเป้าหมายนักศึกษาส่วนใหญ่ใช้มือถือ)

### UI
- [x] **Font:** Mitr (Google Fonts) — heading, ปุ่ม, UI หลัก / Noto Sans Thai Looped — body text, ข้อความย่อย
- [x] **Spacing:** Tailwind default (4px base) — ใช้ตาม context ให้เหมาะสม
- [x] **Border-radius:** 16px (cards/containers), 12px (buttons/inputs) — มนนุ่มสบายตา เข้ากับ playful + safezone vibe
- [x] **Logo:** ใช้ `public/logo.png`

---

## ⚠️ สิ่งที่ต้องคิดต่อ (ยังไม่ตัดสินใจ)

### Legal
- [x] ร่าง Terms of Service — `legal/terms-of-service.md`
- [x] ร่าง Content Guideline — `legal/content-guideline.md`
- [x] ร่าง Privacy Notice (PDPA) — `legal/privacy-notice.md`
- [ ] ออกแบบ Flag/Dispute mechanism — ทำเมื่อมีบริษัทมาร้องเรียนจริง
- [ ] จดทะเบียนนิติบุคคล — ทำเมื่อมีรายได้

---

## Monetization roadmap (อ้างอิงเท่านั้น ไม่ใช่ priority ตอนนี้)

| ช่วง | เป้าหมาย | รายได้ |
|---|---|---|
| 0-500 รีวิว | สร้าง content/trust | ไม่มี (ห้ามเก็บเงินจากนักศึกษา) |
| 500-2,000 รีวิว | มี traffic สม่ำเสมอ | Affiliate (resume builder, mock interview platform) |
| 2,000+ รีวิว | บริษัทสนใจ | Employer branding package (verified badge, sponsored listing, insight) |
| ใหญ่ระดับประเทศ | มี data มูลค่า | Insight report ขายให้มหาลัย/หน่วยงาน |

**กฎเหล็ก:** ไม่เก็บเงินจากนักศึกษาเด็ดขาด ไม่ว่าจะ subscription หรือ pay-to-unlock

---

## Competitor landscape (สำหรับ reference)

ตลาด "หาที่ฝึกงาน" (job listing) อิ่มตัวแล้ว — เด็กฝึกงาน.com, internth.com, JobThai, WorkVenture, JobsDB
**GIntern ไม่แข่งในตลาดนี้** — โฟกัสเฉพาะ "รีวิวที่ฝึกงาน" ซึ่งปัจจุบันกระจัดกระจายอยู่ใน Facebook group, TikTok, Lemon8
ไม่มีใครรวบรวมเป็นแพลตฟอร์ม structured ที่ search/filter/compare ได้ — นี่คือ gap ที่ GIntern จะเข้าไปเติม

---

## Distribution strategy (เมื่อพร้อม launch)

- โพสต์ใน Facebook group ที่มีอยู่แล้ว (กลุ่มเด็กฝึกงาน รีวิวที่ฝึกงาน) แบบให้ value ก่อน ไม่ spam
- TikTok/Lemon8 content สั้นๆ เช่น "5 สัญญาณที่ฝึกงานดี/แย่" ลิงก์เข้าเว็บ
- ติดต่อ partner กับเพจที่มี traffic อยู่แล้ว (เด็กฝึกงาน.com) เพื่อ cross-link
