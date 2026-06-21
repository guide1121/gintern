---
target: GIntern overall
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-06-21T13-05-44Z
slug: gintern-overall
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Like/comment มี optimistic update ดี แต่ alert() ใช้แทน inline feedback (แก้แล้ว) |
| 2 | Match System / Real World | 4 | ภาษาไทยชัดเจน สื่อความหมายถูก |
| 3 | User Control and Freedom | 3 | มี ESC ปิด sidebar/modal |
| 4 | Consistency and Standards | 2 | Admin UI ใช้ slate-* แทน design tokens |
| 5 | Error Prevention | 3 | มี confirmation ก่อนลบ |
| 6 | Recognition Rather Than Recall | 3 | Filter bar ชัดเจน sticky ดี |
| 7 | Flexibility and Efficiency | 2 | ไม่มี keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 2 | About section มี ghost-card (แก้แล้ว) |
| 9 | Error Recovery | 2 | alert() → inline toast (แก้แล้ว) |
| 10 | Help and Documentation | 2 | ไม่มี tooltip/contextual help |
| **Total** | | **26/40** | **Acceptable** |

## Anti-Patterns Verdict

**Deterministic scan:** พบ 2 gray-on-color issues (แก้แล้วทั้งหมด)
- ReviewTable.tsx:143 — text-slate-400 on bg-rose-50
- UserTable.tsx:153 — text-slate-400 on bg-rose-50

**Ghost-card pattern:** About section cards ใช้ border + shadow-sm พร้อมกัน (แก้แล้ว)

## Priority Issues

**[P1] Ghost-card on About section cards** — ใช้ border + shadow ซ้อนกัน ขัด design system (แก้แล้ว)
**[P1] alert() แทน inline feedback** — UX ต่ำ ขัด brand personality (แก้แล้ว)
**[P1] Gray-on-color ใน Admin tables** — text-slate-400 บน rose-50 อ่านยาก (แก้แล้ว)
**[P2] Hero heading tracking-tight** — ตาม impeccable floor ต้องไม่ต่ำกว่า -0.04em (แก้แล้ว)
**[P2] Decorative blobs ที่ไม่มีวัตถุประสงค์** — ลบออกเพื่อความสะอาด (แก้แล้ว)
