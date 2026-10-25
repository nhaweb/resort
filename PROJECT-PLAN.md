# Orilla — Project Plan

Plan cho dự án giới thiệu & booking resort (cập nhật từ codebase hiện tại).

> **MVP đã chốt:** **Đặt phòng + thanh toán online** (không phải enquiry-only).  
> Flow mục tiêu: chọn villa/ngày/guests → kiểm tra availability → tạo reservation (hold) → thanh toán server-side → webhook xác nhận → success/fail rõ ràng.

---

## MVP scope (locked)

| In scope | Out of scope (Later) |
| --- | --- |
| Landing ổn định + CTA vào booking | Guest portal / admin inventory UI đầy đủ |
| UI booking: dates, villa, guests, giá, loading/error/success | Multi-language (VI/EN) |
| Postgres: villa, inventory/availability, reservation, guest, payment refs | Channel manager / OTA |
| API: availability, create reservation, payment intent, webhook | Loyalty, upsell, dynamic pricing |
| Payment provider (Stripe hoặc tương đương): server intents + webhook idempotent | TypeScript migration |
| Deposit **hoặc** full stay (chốt 1 rule trước code) — mặc định đề xuất: **full stay** cho MVP | Complex refund/partial cancel flows |
| `.env.example`, README, Vercel preview + Fly.io prod smoke | Sanity bắt buộc trước ship (CMS = Should) |
| Nội dung liên hệ thật (thay `.example`) | |

**State machine tối thiểu:** `draft` → `held` → `paid` / `expired` / `failed` (webhook là nguồn truth cho `paid`).

**Inventory MVP:** số villa cố định từ content hiện tại; rule no-overbook + min stay đơn giản (configurable trong DB/env).

---

## Hiện trạng

Project đang ở giai đoạn **marketing one-pager / concept site**, chưa phải hệ thống booking thật.

| Lớp | Thực tế trong repo |
| --- | --- |
| Frontend | Next.js (App Router), React, JS (không TypeScript), Tailwind, Biome |
| Trang | Chỉ landing: Hero → Intro → Showcase → Rhythm → Gallery → About → TidePicker → FAQ → CTA → Contact |
| Content | Tĩnh trong `lib/content.js` (brand, villas, tides, FAQ, mailto mẫu) |
| Motion | Lenis + GSAP/ScrollTrigger; pin hero/showcase; `prefers-reduced-motion` |
| Media | Ảnh/video trong `public/images`, `public/video` |
| Booking | **Chưa có** form đặt phòng / availability. TidePicker chỉ chọn khung giờ; CTA/Contact = `mailto` |
| CMS / BE | **Chưa có** Sanity, API routes, PostgreSQL, payment |
| Deploy | **Chưa có** `fly.toml` / `vercel.json` / `.env.example` |
| Tooling agent | `.cursor/agents/*` mô tả full stack — **mục tiêu kiến trúc**, chưa implement |

---

## Còn thiếu / chưa xong (theo MVP)

1. **UI booking** — chọn ngày, villa, guests, giá, loading/error/success
2. **Booking transactional** — Postgres (villa, inventory, reservation, guest), API, validation, concurrency
3. **Payments** — provider, server intents, webhooks, idempotency, env secrets
4. **Landing + CTA** — copy thật, CTA dẫn vào booking, a11y/mobile
5. **Deploy** — Vercel preview + Fly.io prod, health, migrations, checklist env
6. **Docs** — README project, `.env.example`
7. **QA / a11y / perf** — test plan booking/pay; smoke mobile với motion-heavy
8. **Sanity** (Should) — schema villa/gallery/FAQ/rates khi content ổn

---

## Backlog ưu tiên

### Must (MVP)

- [x] Chốt MVP: **booking + pay**
- [ ] Ổn định landing (copy thật, CTA → booking, a11y cơ bản, mobile)
- [ ] Schema Postgres + migrations (villa, availability/blocks, reservation, guest, payment)
- [ ] API: availability + create/hold reservation + payment intent + webhook
- [ ] UI booking end-to-end (states rõ: loading / error / success / expired hold)
- [ ] Payment server-side only; không lộ secret/card data trên client
- [ ] `.env.example` + README stack/deploy
- [ ] Preview (Vercel) + prod smoke (Fly.io)

### Should

- [ ] Sanity cho marketing (villa, gallery, FAQ); Postgres giữ booking/rates transactional
- [ ] Trang villa detail `/villas/[slug]`
- [ ] Email confirmation sau `paid`
- [ ] Admin tối thiểu: xem reservations / mark inventory block
- [ ] Enquiry nhẹ chỉ như fallback khi villa hết chỗ (optional)

### Later

- [ ] Guest portal / admin inventory đầy đủ
- [ ] Multi-language (VI/EN)
- [ ] Channel manager / OTA sync
- [ ] Loyalty, upsell, dynamic pricing
- [ ] Migrate sang TypeScript (nếu team muốn)
- [ ] Refund / cancel / partial payment flows phức tạp

---

## Các giai đoạn đề xuất

| Phase | Mục tiêu | Owner | Exit criteria |
| --- | --- | --- | --- |
| **0. Scope** | ~~Chốt MVP~~ | planner + stakeholder | **Done:** booking + pay |
| **1. Polish marketing** | Landing shippable + CTA booking | ui-ux → animation → frontend | Hero brand-first; CTA vào flow đặt phòng; reduced-motion OK |
| **2. Booking core** | Availability + reservation hold | backend → FE | Check dates → hold → confirm path; Postgres migrations; no overbook |
| **3. Payments** | Thu tiền an toàn | backend (+ FE checkout) | Intent server-side, webhook idempotent, state → `paid`/`failed` |
| **4. CMS (optional song song)** | Content editable | backend + FE | Sanity schemas + page đọc từ CMS; không block pay |
| **5. QA + deploy** | Ship có kiểm soát | qa, performance, DevOps | Vercel preview green; Fly.io smoke; checklist env; payment test mode |

**Thứ tự ship:** UI/UX booking + landing CTA → BE schema/API → FE booking UI → payments/webhook → QA → deploy.  
Sanity không chặn MVP nếu `lib/content.js` đủ dùng tạm.

**Minimal ship slice (đã chốt):** Phase 1 + 2 + 3 + 5 — landing ổn + đặt phòng + thanh toán + deploy có kiểm soát.

---

## Việc nên làm ngay

1. **ui-ux-designer:** spec flow booking 1 màn hình chính (dates, villa, guests, giá, CTA Pay) + success/fail
2. **backend-developer:** scaffold Postgres schema + `availability` / `reservations` APIs + `.env.example`
3. **frontend-developer:** thay mailto/CTA bằng entry booking; wire states; giữ `lib/content.js` tạm cho villa list
4. **backend-developer (+ FE):** Stripe (hoặc tương đương) PaymentIntent + webhook → cập nhật reservation
5. **qa-tester** + deploy: checklist booking/pay (test mode) + Vercel preview + Fly.io health

---

## Rủi ro / quyết định còn lại

| Quyết định | Vì sao quan trọng | Hướng mặc định MVP |
| --- | --- | --- |
| ~~Enquiry vs full booking + pay~~ | ~~Đổi schema/UI~~ | **Đã chốt: booking + pay** |
| Payment provider & deposit vs full | Webhook, refund, env | Stripe; **full stay** trừ khi stakeholder đổi |
| Sanity cho ảnh/rates vs hardcode | Effort CMS vs tốc độ | Hardcode/`content.js` trước; Sanity Should |
| Brand thật vs concept Orilla | Legal copy, imagery, email | Giữ Orilla concept; thay contact placeholder sớm |
| Hosting: Next all-on-Vercel vs API trên Fly | Boundary preview vs prod | Next trên Vercel; API/DB/payment webhook trên Fly (hoặc Next Route Handlers + DB ngoài nếu đơn giản hơn — chốt khi scaffold) |
| Inventory reality | Overbooking / min stay | Hard rule no-overbook; min stay = 1 đêm cho đến khi có rates thật |
| Hold TTL | Guest bỏ giữa chừng | Hold ngắn (vd. 15 phút) rồi `expired` |

**Rủi ro kỹ thuật:** GSAP pin + Lenis dễ regress trên mobile; race availability nếu thiếu transaction/lock; webhook duplicate nếu thiếu idempotency.

**Mitigation:** reservation state machine trước khi gắn pay; DB constraint chống double-book; webhook idempotent theo `payment_intent` / event id; test mode Stripe trước prod keys.

---

## Stack mục tiêu (theo conventions)

- Frontend: Next.js App Router, React, Tailwind, Lenis, GSAP (`@gsap/react`)
- CMS: Sanity (Should — không bắt buộc cho MVP)
- Backend: Node.js APIs, PostgreSQL
- Payments: server-side only
- Preview: Vercel · Production: Fly.io
