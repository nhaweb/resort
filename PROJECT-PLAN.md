# Orilla — Project Plan

Plan cho dự án giới thiệu & booking resort (cập nhật từ codebase hiện tại).

> **MVP đã chốt:** **Đặt phòng + thanh toán online** (không phải enquiry-only).  
> Flow mục tiêu: chọn villa/ngày/guests → kiểm tra availability → tạo reservation (hold) → thanh toán server-side → webhook xác nhận → success/fail rõ ràng.

---

## MVP scope (locked)

| In scope | Out of scope (Later) |
| --- | --- |
| Landing ổn định + CTA vào booking | Guest portal / admin inventory UI đầy đủ |
| UI booking: dates, villa, guests, giá, loading/error/success | Multi-language (VI/EN) — *đã có i18n cơ bản* |
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

MVP booking + pay đã được scaffold trong repo (API, UI `/[locale]/book`, Postgres migrations, Stripe Checkout / mock mode). Cần `DATABASE_URL` + migrate/seed để chạy end-to-end.

| Lớp | Thực tế trong repo |
| --- | --- |
| Frontend | Next.js (App Router), React, JS, Tailwind, Biome; locales `vi`/`en` |
| Trang | Landing + **`/[locale]/book`** + success |
| Content | `lib/dictionaries/*` (brand, villas, FAQ, booking copy) |
| Motion | Lenis + GSAP trên landing; booking page tĩnh |
| Booking | Hold → checkout → paid; availability + exclusion constraint |
| CMS / BE | API routes + Postgres schema; chưa có Sanity |
| Deploy | `.env.example`, `docker-compose.yml`, `vercel.json`, `fly.toml` |
| Tooling agent | `.cursor/agents/*` |

---

## Backlog ưu tiên

### Must (MVP)

- [x] Chốt MVP: **booking + pay**
- [x] Ổn định landing (CTA → booking, contact không còn mailto booking)
- [x] Schema Postgres + migrations (villa, inventory/blocks, reservation, guest, payment)
- [x] API: availability + create/hold reservation + checkout + webhook
- [x] UI booking end-to-end (loading / error / success / expired hold)
- [x] Payment server-side only (`PAYMENT_MODE=stripe|mock`)
- [x] `.env.example` + README stack/deploy
- [ ] Preview (Vercel) + prod smoke (Fly.io) — *config sẵn; cần credentials khi deploy*

### Should

- [x] **Chọn loại phòng trước khi đặt** — resort có nhiều loại phòng/villa; flow: browse phòng → chọn loại → mới vào booking (dates/guests/pay). Không nhảy thẳng form đặt với dropdown phòng làm bước đầu duy nhất
- [x] Catalog loại phòng (tên, mô tả, ảnh, max guests, rate, amenities) đồng bộ content ↔ inventory
- [x] Trang danh sách + detail: `/rooms` (hoặc `/villas`) và `/rooms/[slug]` — CTA “Đặt phòng này” mang theo `roomId`/`villa` vào `/book`
- [x] Booking UI nhận phòng đã chọn (preselect + cho đổi loại nếu còn trống); availability theo từng loại phòng
- [x] Sanity cho marketing (villa/room, gallery, FAQ); Postgres giữ booking/rates transactional
- [x] Email confirmation sau `paid`
- [x] Admin tối thiểu: xem reservations / mark inventory block
- [x] Enquiry nhẹ chỉ như fallback khi loại phòng hết chỗ (optional)

### Later

- [ ] Guest portal / admin inventory đầy đủ
- [ ] Channel manager / OTA sync
- [ ] Loyalty, upsell, dynamic pricing
- [ ] Migrate sang TypeScript (nếu team muốn)
- [ ] Refund / cancel / partial payment flows phức tạp

---

## Các giai đoạn đề xuất

| Phase | Mục tiêu | Owner | Exit criteria |
| --- | --- | --- | --- |
| **0. Scope** | ~~Chốt MVP~~ | planner + stakeholder | **Done:** booking + pay |
| **1. Polish marketing** | Landing + CTA booking | ui-ux → FE | **Done:** CTA → `/rooms` → `/book` |
| **2. Booking core** | Availability + reservation hold | backend → FE | **Done (code):** migrations + APIs + UI |
| **3. Payments** | Thu tiền an toàn | backend (+ FE checkout) | **Done (code):** Checkout + webhook + mock mode |
| **4. CMS (optional)** | Content editable | backend + FE | **Done (code):** Studio + dict fallback |
| **5. QA + deploy** | Ship có kiểm soát | qa, DevOps | Vercel/Fly với secrets thật |

**Minimal ship slice:** code path 1–3 xong; còn gắn DB/Stripe secrets + deploy thật.

---

## Việc nên làm tiếp

1. `docker compose up -d` → `npm run db:migrate` → `npm run db:seed`
2. Chạy smoke local với `PAYMENT_MODE=mock`, rồi Stripe test keys
3. Deploy Vercel preview + Fly prod; webhook endpoint thật
4. ~~(Should) room picker trước booking~~ — `/rooms` + `/rooms/[slug]` → `/book?villa=…`
5. ~~(Should) email confirmation + Sanity + admin + enquiry~~ — đã scaffold; cần secrets + `db:migrate` (002) khi dùng Postgres

---

## Rủi ro / quyết định còn lại

| Quyết định | Hướng mặc định MVP |
| --- | --- |
| Payment provider & deposit vs full | Stripe Checkout; **full stay**; `PAYMENT_MODE=mock` cho local |
| Sanity vs hardcode | Dictionaries trước; Sanity Should |
| Hosting boundary | Next trên Vercel/Fly; Postgres ngoài (Fly Postgres / managed) |
| Hold TTL | 15 phút (`BOOKING_HOLD_TTL_MINUTES`) |

**Mitigation:** exclusion constraint chống double-book; `stripe_events` idempotent; expire holds trên read/write.

---

## Stack mục tiêu (theo conventions)

- Frontend: Next.js App Router, React, Tailwind, Lenis, GSAP (`@gsap/react`)
- CMS: Sanity (Should — không bắt buộc cho MVP)
- Backend: Node.js APIs, PostgreSQL
- Payments: server-side only
- Preview: Vercel · Production: Fly.io
