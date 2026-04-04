# GuideWireDevTrails2026-GigSheild
<div align="center">

# 🛡️ GigShield by team Tech Seguro
### AI-Powered Parametric Income Protection for Food Delivery Partners

*Built exclusively for Zomato & Swiggy delivery partners*

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0-FF6600?style=flat-square)](https://xgboost.readthedocs.io)
[![Razorpay](https://img.shields.io/badge/Razorpay-Sandbox-0C2451?style=flat-square)](https://razorpay.com)
[![IRDAI](https://img.shields.io/badge/IRDAI-2023%20Sandbox-DC143C?style=flat-square)](https://irdai.gov.in)

---

**[Problem](#1-the-problem) · [Solution](#2-our-solution) · [How It Works](#5-how-it-works) · [Features](#6-feature-set) · [Architecture](#7-system-architecture) · [ML Models](#8-ai--ml-models) · [Setup](#13-getting-started) · [Demo](#16-demo-flow)**

</div>

---

## 📋 Table of Contents

1. [Cover & Project Info](#0-cover--project-info)
2. [The Problem](#1-the-problem)
3. [Our Solution](#2-our-solution)
4. [Scope & Boundaries](#3-scope--boundaries)
5. [Persona — Who We Build For](#4-persona--who-we-build-for)
6. [How It Works](#5-how-it-works)
7. [Feature Set](#6-feature-set)
8. [System Architecture](#7-system-architecture)
9. [AI / ML Models](#8-ai--ml-models)
10. [Database Design](#9-database-design)
11. [Integration Layer](#10-integration-layer)
12. [Business Model](#11-business-model)
13. [API Reference](#12-api-reference)
14. [Build Timeline](#13-build-timeline)
15. [Demo Flow](#14-demo-flow)
16. [Why GigShield Wins](#15-why-gigshield-wins)


---

## 0. Cover & Project Info

| 📌 Field | 📝 Detail |
|---|---|
| **Project Name** | GigShield |
| **Subtitle** | AI-Powered Parametric Income Protection for Food Delivery Partners |
| **Target Users** | Zomato & Swiggy 2-wheeler delivery partners only |
| **Insurance Type** | Parametric — performance-linked payout based on previous week earnings |
| **Pricing Model** | Weekly (auto-renews every Monday) |
| **Payout Basis** | Previous week's actual earnings vs trigger week earnings |
| **Regulatory Basis** | IRDAI 2023 Sandbox — parametric index-based payouts |
| **Version** | v1.0 — 2026 |

### 🗓️ Revision History

| Version | Date | Change |
|---|---|---|
| v0.1 | Week 1 | Initial concept, persona selection, problem statement |
| v0.3 | Week 2 | Architecture, ML model plan, API spec |
| v0.6 | Week 4 | Core features: onboarding, risk engine, policy creation |
| v0.8 | Week 5 | Fraud detection, payout engine, integrations |
| v1.0 | Week 6 | Analytics, demo, full documentation |

---

## 1. 🚨 The Problem

> **We are building GigShield exclusively for Zomato and Swiggy food delivery partners — 2-wheeler riders who earn their living delivering food orders across Indian cities.**

India has **12 million gig workers today**, projected to reach **23.5 million by 2030**. The majority are food delivery partners on Zomato and Swiggy, earning ₹600–₹900 per day.

### 😔 The Daily Reality of a Delivery Partner

A Zomato or Swiggy delivery partner in Delhi earns by completing food orders. He rides a **2-wheeler motorbike**, fully exposed to whatever the weather throws at him. When the weather is bad, orders drop sharply. When AQI is hazardous, platforms see up to 60% fewer orders placed. When roads flood, delivery is simply impossible.

**On a bad weather day, a delivery partner earns ₹0 — but his fixed costs don't stop:**

| 💸 Fixed Daily Cost | Amount |
|---|---|
| Fuel for 2-wheeler | ₹150–₹200 |
| Bike EMI | ₹200–₹250 |
| Phone recharge | ₹30 |
| Food for family | ₹200–₹300 |
| **Total unavoidable daily cost** | **₹580–₹780** |

> 🔴 **The net damage on one bad weather day = ₹600–₹900 lost income + ₹580–₹780 in unavoidable costs = ₹1,180–₹1,680 per day.** Over a month, 8–10 such days means ₹9,000–₹17,000 lost. There is currently zero financial protection for this.

### ❌ Why Existing Solutions Don't Work

| Problem | Why It Fails for Delivery Partners |
|---|---|
| Annual insurance premiums | ₹5,000–₹8,000 upfront is impossible for a daily wage earner |
| Traditional claim process | File a form → adjuster visits → weeks of delay → worker has no money meanwhile |
| Proof of income loss | How does a delivery partner prove he couldn't work because AQI was too high? |
| Fixed payout for everyone | A full-time rider who lost ₹2,500 gets the same as a part-timer who lost ₹400 — unfair |
| Platform responsibility | Zomato and Swiggy classify workers as independent contractors — no employer liability |

---

## 2. ✅ Our Solution

**GigShield is a parametric income protection platform built exclusively for Zomato and Swiggy delivery partners.**

It works like this:
- 🌐 GigShield monitors government data (CPCB for AQI, IMD for weather) every 15 minutes
- ⚡ When conditions become extreme enough to disrupt deliveries, a trigger activates automatically
- 📊 The system looks at what the worker earned in the **previous weeks** vs what they earned during the trigger week — and calculates the actual income they lost
- 💰 A personalised payout is sent to their UPI within 4 hours — zero paperwork, zero claim form

### 🌟 The Big Innovation — Previous Week Performance Drives the Payout

> **This is the most important feature of GigShield. The payout is NOT a flat fixed amount. It is calculated based on what the delivery partner specifically earned in the previous 4 weeks compared to what they earned during the disruption week.**

Most insurance says: *"AQI triggered → everyone gets ₹1,200."*

GigShield says: *"Ravi earned ₹5,100 last 4 weeks on average. This trigger week he only earned ₹2,600. He lost ₹2,500. His payout is 75% of that loss = ₹1,875 — plus zone and consistency adjustments."*

This means:
- 🎯 A full-time Zomato rider in Delhi who lost ₹2,500 gets a bigger payout than
- 🎯 A part-time Swiggy rider in Chennai who only lost ₹400
- ✅ Every payout is unique, fair, and based on that worker's actual income history

---

## 3. 📋 Scope & Boundaries

### ✅ What GigShield Covers

- 🛵 Zomato and Swiggy food delivery partners on 2-wheelers — **this is the only persona**
- 📆 Weekly policy creation and automatic Monday renewal
- 🤖 AI-based risk profiling and dynamic premium calculation per worker
- 🌧️ Parametric trigger detection: AQI, rainfall, wind speed, temperature, fog
- 📊 Performance-linked personalised payout — based on previous 4-week earnings baseline vs trigger week
- 💸 Two-phase payout: advance within 4 hours + final settlement on Day 7
- 🛡️ Fraud detection across 5 layers
- 📱 Worker portal and platform admin dashboard
- 📈 Analytics with 5 panels including retention proof for platforms

### ❌ What GigShield Does NOT Cover

- 🚫 Health insurance, life insurance, or accident coverage
- 🚫 Vehicle repair or damage to the bike
- 🚫 Any payout for loss not caused by weather or environmental disruption
- 🚫 Delivery partners on other platforms (Blinkit, Dunzo, etc.) — Zomato and Swiggy only
- 🚫 Real money in demo — Razorpay sandbox used throughout

### 🧩 Key Assumptions

- 📡 CPCB and IMD free APIs are sufficient for all 6 demo cities
- 📱 Zomato and Swiggy platform APIs are simulated (mock JSON — acceptable per guidelines)
- 💳 Razorpay sandbox for all payment flows — no real money
- 📊 Worker earnings data comes from the platform API (Zomato/Swiggy provide weekly settlement data)
- 📍 Workers consent to GPS location verification as a condition of fraud prevention

---

## 4. 👤 Persona — Who We Build For

> **GigShield is built for exactly two types of users. No one else.**

### 🛵 Primary Persona: The Food Delivery Partner

> **"Ravi Kumar, 28 years old. Delhi. Zomato delivery partner for 14 months. Rides a Honda Activa 2-wheeler. Works 6 days a week. Completes 38 food deliveries per day on average. Earns ₹850 on a good day. Lives in Rohini — one of the most AQI-affected zones in NCR."**

**Ravi's month in numbers:**
- 🟢 Normal days: ₹850/day × 24 days = ₹20,400
- 🔴 Bad AQI/rain days: ₹0/day × 8 days = ₹0 lost
- 💰 Monthly income gap from disruptions: ₹6,800 with zero protection

**What Ravi needs from GigShield:**
- ⏱️ Enroll in under 2 minutes on his basic Android phone
- 📲 Never file a claim — money arrives automatically
- 💵 Get a payout that reflects what HE specifically lost, not a flat generic number
- 🔍 See his payout calculation — know exactly why he got that amount

### 🧑‍💼 Secondary Persona: The Platform Admin (Zomato Operations)

> **"Meghna, 31. Zomato City Operations Manager, Hyderabad. Responsible for fleet health and delivery partner retention."**

**What Meghna needs:**
- 📋 See which riders were covered on a trigger day and how much each received
- 🧾 Verify weekly invoice — base coverage fee + event surcharges
- 🛡️ Review flagged fraud cases with one-click approve or block
- ⚠️ Get 48-hour advance warning before predicted trigger events
- 📊 Show leadership that covering riders reduces expensive partner churn

---

## 5. ⚙️ How It Works

### 🛵 The Delivery Partner's Journey

**📝 Step 1 — One-time enrollment (under 2 minutes)**

The rider opens GigShield on their phone, logs in with their phone number and OTP, completes Aadhaar verification, confirms their city via GPS, links their UPI account, and enters their Zomato or Swiggy Worker ID. Policy is created instantly. SMS arrives: *"You're covered. Policy GS-ZMT-2026-00291 active."*

---

**📦 Step 2 — Normal working weeks**

The rider delivers food as usual. GigShield silently builds a rolling 4-week earnings baseline from Zomato or Swiggy's weekly settlement data. This baseline is the foundation of every future payout calculation. The rider does nothing.

---

**⚡ Step 3 — Trigger event fires (automatic)**

At 8:15 AM on a Wednesday, CPCB reports AQI 318 in Hyderabad. GigShield's monitoring system detects this automatically. The system immediately finds all active Zomato and Swiggy riders in Hyderabad with Shield or Pro plans. The rider receives an SMS: *"AQI alert — your advance payout is being processed."*

---

**💰 Step 4 — Phase 1 advance payout (within 4 hours)**

40% of the estimated income gap is sent to the rider's UPI immediately. This gives the rider money today — not next week. No form. No call. No waiting.

---

**🧮 Step 5 — Phase 2 final settlement (Day 7)**

At the end of the trigger week, GigShield pulls the rider's actual earnings for that week from the Zomato or Swiggy platform API. It compares this to the 4-week average baseline. It calculates the exact income gap and applies the payout formula. The balance is credited to UPI. SMS arrives: *"Your income protection payout: ₹2,437. Credited to your UPI."*

---

**🔄 Step 6 — Automatic Monday renewal**

Every Monday, the policy renews automatically. The premium is recalculated based on the updated risk profile. Zomato or Swiggy is billed via auto-invoice. The rider does nothing.

---

### 🔁 The Trigger Pipeline (What Happens Behind the Scenes)

Every 15 minutes, GigShield's background system polls the CPCB API for AQI readings and the IMD API for weather across all active cities.

If any reading crosses a threshold, the system creates a trigger event and immediately runs an eligibility query to find all Zomato and Swiggy riders in that city with an active policy covering that trigger type, who have at least 4 weeks of earnings history, and who have made at least one delivery in the past 7 days.

Each eligible rider's claim is then scored by the fraud detection model. Riders with a clean score (0–40) proceed directly to the payout queue. Riders with a suspicious score (41–70) are held for 24 hours and placed in the manual review queue. Riders with a high-risk score (71–100) are auto-blocked and notified with the reason.

After fraud screening, the payout batch runs via Razorpay sandbox, sending Phase 1 advances to all cleared riders. The platform (Zomato or Swiggy) is notified, and a surcharge line item is added to their Monday invoice.

---

## 6. 🌟 Feature Set

---

### 🚀 Feature 1 — Optimised Delivery Partner Onboarding

> **Why this matters:** A Zomato or Swiggy delivery partner works 12 hours a day in traffic. He cannot spend 20 minutes filling forms on a desktop. Every extra second of friction = one fewer protected rider. Designed for a basic Android phone, works on 2G, done in under 2 minutes.

**The 5-step enrollment flow:**

**📱 Step 1 — Phone OTP Login**
The rider enters their phone number and receives an OTP via SMS. Verified instantly. No username. No password. No email needed.
*Why: Phone number is the identity for this population. They have phones but not always email accounts.*

---

**🪪 Step 2 — Aadhaar e-KYC**
The rider enters their Aadhaar number. GigShield verifies it against the UIDAI API (mocked in demo). PAN is cross-checked. The name is fuzzy-matched with over 85% similarity. Age must be 18–65 years.
*Why: IRDAI legally requires KYC before insurance can be issued. Aadhaar is universal for gig workers. It is stored only as a secure one-way hash — never in readable form.*

---

**📍 Step 3 — GPS City Detection**
GPS automatically detects the rider's city. The rider confirms on screen. A 30km geo-zone is locked to the registered city.
*Why: The city determines which trigger rules apply. The zone lock prevents fraud — a rider in Chennai cannot claim a Delhi AQI payout.*

---

**💳 Step 4 — UPI Account Linking**
The rider enters their UPI ID. GigShield sends ₹1 to that account via Razorpay penny drop. The rider confirms receipt. The account is validated and locked as the payout destination.
*Why: One wrong UPI address on payout day destroys a rider's trust permanently. Validation at enrollment eliminates this risk.*

---

**🔗 Step 5 — Platform Linking (Zomato or Swiggy)**
The rider enters their Zomato or Swiggy Worker ID. GigShield calls the platform's mock API to verify the rider is active and their city matches.
*Why: This links the earnings baseline data pipeline. Without this link, performance-linked payouts cannot be calculated.*

**✅ Output:** Policy created. GIC Re mock countersignature applied. SMS and PDF policy schedule sent to the rider immediately.

---

### 🤖 Feature 2 — AI-Powered Risk Profiling

> **Why this matters:** Two Zomato riders — one in Delhi in October, one in Chennai in March — have completely different chances of receiving a payout this week. Without profiling each worker individually, GigShield would overcharge one and undercharge the other, making the platform financially unsustainable.

**Risk profiling measures three things about every rider:**

**🌆 Dimension 1 — Environmental Risk (biggest factor)**

How dangerous is this rider's city and current season?

| 🏙️ City | ⚡ Avg trigger days/year | 🎯 Risk tier | 💰 Premium multiplier |
|---|---|---|---|
| Delhi | 32 days | 🔴 High | 1.3× |
| Hyderabad | 28 days | 🔴 High | 1.3× |
| Mumbai | 16 days | 🟡 Medium | 1.0× |
| Kolkata | 14 days | 🟡 Medium | 1.0× |
| Chennai | 7 days | 🟢 Low | 0.75× |
| Bengaluru | 6 days | 🟢 Low | 0.75× |

On top of the city tier, the month of the year also matters:

| 📅 City + Season | ➕ Weekly loading | 📌 Reason |
|---|---|---|
| Delhi (October–February) | +₹8/week | Peak AQI pollution season |
| Mumbai (June–September) | +₹6/week | Monsoon — extreme rainfall |
| Hyderabad (March–May) | +₹5/week | Heat wave season |
| Chennai (October–November) | +₹4/week | Northeast monsoon |

*Why seasonal loading separately: A Delhi rider in October is far riskier than the same rider in April. Without seasonal adjustment, the pool would be underfunded exactly when it needs to pay the most.*

---

**🛵 Dimension 2 — Exposure Risk**

How exposed is this specific rider when a trigger fires?

| ⚖️ Factor | 🟢 Low exposure | 🔴 High exposure |
|---|---|---|
| Weekly deliveries | 10/week (part-time) | 38/week (full-time) |
| Vehicle type | 4-wheeler (partial shelter) | 2-wheeler (fully exposed) |
| Shift timing | Night shift only | Day shift in peak AQI/heat hours |

*Note: GigShield is built only for Zomato and Swiggy food delivery — both platforms primarily use 2-wheelers, so this dimension mostly reflects delivery volume and shift patterns.*

---

**📈 Dimension 3 — Behavioral Risk**

How reliable and consistent is this rider's history?

- Platform tenure in months — brand-new accounts are flagged as higher risk
- Delivery count consistency over 4 weeks — very erratic patterns increase fraud risk
- *This dimension primarily feeds the fraud model, not the premium price*

**🎯 Output — XGBoost Risk Score (0–100):**

A score of 0–30 means low risk — a Chennai part-time rider in a calm season.
A score of 31–60 means medium risk — a Mumbai rider during moderate conditions.
A score of 61–100 means high risk — a Delhi full-time rider in October on a 2-wheeler in an industrial zone.

---

### 💰 Feature 3 — Dynamic Weekly Premium

> **Why weekly pricing?** Zomato and Swiggy pay their riders on weekly settlement cycles. Premium timing must match income timing. ₹40 per week feels manageable. ₹2,080 per year upfront is impossible for this population. The premium also recalculates every Monday — if a rider's city risk changes with the season, their premium adjusts automatically.

**🧮 The Premium Formula:**

> **Weekly Premium = Base ₹30 + City Multiplier + Risk Score Adjustment + Seasonal Loading − Platform Subsidy**

**📊 Real example — three Zomato riders, same Shield plan, same week in October:**

| 👤 Rider | 🏙️ City | 📅 Month | 🎯 Risk Score | 💰 B2C Premium |
|---|---|---|---|---|
| Ravi Kumar | Delhi | October | 78 | ₹58.70/week |
| Priya Sharma | Mumbai | October | 54 | ₹38.10/week |
| Anjali Nair | Chennai | October | 19 | ₹29.35/week |

**Ravi's calculation step by step:**
- Base: ₹30
- City multiplier (Delhi = 1.3×): ₹30 × 1.3 = ₹39, so +₹9
- Risk score adjustment: (78 ÷ 100) × ₹15 = +₹11.70
- Seasonal loading (Delhi October): +₹8
- **Total B2C: ₹58.70/week**
- B2B (Zomato pays on his behalf): ₹40 flat cap

**Anjali's calculation step by step:**
- Base: ₹30
- City multiplier (Chennai = 0.75×): ₹30 × 0.75 = ₹22.50
- Risk score adjustment: (19 ÷ 100) × ₹15 = +₹2.85
- Seasonal loading (Chennai October northeast monsoon): +₹4
- Total: ₹29.35 — floor applies at ₹28/week minimum

> 📌 **B2B vs B2C note:** In the B2B model, Zomato pays ₹40/week flat for all their riders regardless of city. In the B2C model, the rider pays their personalised premium — Delhi riders genuinely pay more because they genuinely receive more payouts.

---

### 📊 Feature 4 — Performance-Linked Payout (Based on Previous Week's Work)

> **This is the heart of GigShield. The payout is not a flat fixed amount. It is calculated from how much the rider earned in the previous 4 weeks compared to how much they earned during the trigger week. The difference is the income they lost. GigShield covers a percentage of that loss.**

**Why previous week performance?**
- ✅ It reflects what the rider actually lost — not an assumed generic amount
- ✅ It rewards consistent, hard-working riders with higher baselines
- ✅ It makes fraud extremely hard — you cannot fake 4 weeks of verified delivery history
- ✅ It means two riders in the same city on the same trigger day get different payouts if their incomes are different — which is fair

---

**📈 Step 1 — Baseline Earnings (built from previous 4 weeks)**

Every Monday, GigShield pulls the rider's weekly settlement data from Zomato or Swiggy's API and computes a rolling 4-week average:

For example, Ravi's last 4 weeks on Zomato:
- Week 1: ₹4,900
- Week 2: ₹5,200
- Week 3: ₹5,100
- Week 4: ₹5,200
- **4-week rolling average: ₹5,100/week — this is his baseline**

*Why 4 weeks minimum: A rider who just enrolled cannot claim a high payout immediately. Four weeks of real delivery history is required. This cannot be faked retroactively.*

---

**📉 Step 2 — Income Gap Calculation**

After the trigger week ends, the system pulls the rider's actual earnings for that week:

- Ravi's baseline: ₹5,100
- Ravi's trigger week actual: ₹2,600
- **Income gap = ₹5,100 − ₹2,600 = ₹2,500 lost**

---

**📋 Step 3 — Coverage Ratio by Plan**

| 📦 Plan | 💳 B2C Weekly Premium | 🎯 Coverage | 📈 Max Payout/Day |
|---|---|---|---|
| Basic | ₹28–₹55 | 60% of income gap | ₹800 |
| Shield | ₹65–₹99 | 75% of income gap | ₹1,500 |
| Pro | ₹120–₹179 | 90% of income gap | ₹2,500 |

Ravi is on the Shield plan:
- Base payout = ₹2,500 × 0.75 = **₹1,875**

---

**⚙️ Step 4 — Three Adjusting Modifiers**

**🗺️ Zone AQI Modifier**
Even within Hyderabad, a rider delivering in the industrial HITEC City belt faces worse AQI than a rider delivering in the green residential Jubilee Hills area. The modifier adjusts for this:

- Ravi's zone AQI: 380 vs city average: 318 → zone modifier = 380 ÷ 318 = **1.20** (capped at 1.20)
- A rider in a cleaner suburb: zone AQI 305 vs city average 318 → modifier = **0.97**

---

**📊 Consistency Multiplier**
A rider who delivers consistently every week (low week-to-week variance) gets the full multiplier. An irregular rider gets a slight reduction:

- Low variance (consistent Zomato partner): **1.0×** — full payout
- High variance (very irregular delivery pattern): **0.85×** — reduced payout

*Why: Rewards riders with proven reliable income history. Discourages gaming the system.*

---

**🏆 Loyalty Bonus**
If the rider still logged on and attempted deliveries on the trigger day despite the bad conditions — they earn a 10% bonus on their base payout:

- Worked on trigger day: **+10% bonus**
- Did not log on: **+0%**

*Why: Incentivises riders to stay available during disruptions. Zomato and Swiggy benefit from maintained supply on high-demand bad weather days.*

---

**🎯 The Complete Payout Formula with Example:**

> **Final Payout = (Income Gap × Coverage Ratio × Zone Modifier × Consistency Multiplier) + Loyalty Bonus**

**Ravi Kumar's full calculation — AQI event Hyderabad, Shield plan:**

| 🧮 Factor | 📊 Value | 💡 Explanation |
|---|---|---|
| Income gap | ₹2,500 | Baseline ₹5,100 − actual trigger week ₹2,600 |
| Coverage ratio | × 0.75 | Shield plan covers 75% of the gap |
| Zone modifier | × 1.20 | His zone AQI 380 vs city avg 318 |
| Consistency | × 1.0 | 4 consecutive high-delivery weeks |
| Subtotal | = ₹2,250 | ₹2,500 × 0.75 × 1.20 × 1.0 |
| Loyalty bonus | + ₹225 | He worked on trigger day (+10% of ₹2,250) |
| **Final payout** | **= ₹2,475** | |

**Anjali Nair (Chennai, part-time, same trigger week) for comparison:**

| 🧮 Factor | 📊 Value | 💡 Explanation |
|---|---|---|
| Income gap | ₹400 | Baseline ₹2,100 − actual trigger week ₹1,700 |
| Coverage ratio | × 0.75 | Shield plan |
| Zone modifier | × 0.97 | Her zone AQI slightly below city average |
| Consistency | × 0.85 | Variable delivery pattern |
| Subtotal | = ₹247.35 | ₹400 × 0.75 × 0.97 × 0.85 |
| Loyalty bonus | + ₹0 | She did not log on trigger day |
| **Final payout** | **= ₹247** | |

> ✅ **Ravi gets ₹2,475. Anjali gets ₹247. Same trigger. Same plan. Different payouts — because their previous week work history and actual loss are different. This is fair.**

---

**⏱️ Two-Phase Disbursement**

*Why two phases?* The accurate final payout requires end-of-week earnings data from Zomato or Swiggy. But riders need money today, not in 7 days. Two phases solve both problems.

**💸 Phase 1 — Within 4 hours of trigger**
40% of the estimated income gap is sent to the rider's UPI immediately. For Ravi, this is approximately ₹1,000 advance payment. The rider has liquidity today.

**💰 Phase 2 — Day 7 (end of trigger week)**
Actual earnings data arrives from Zomato or Swiggy API. The final payout is calculated precisely. The balance (final total minus Phase 1 advance) is credited. Ravi gets the remaining ₹1,475.

---

### 🛡️ Feature 5 — Intelligent Fraud Detection

> **Why this matters:** Without fraud prevention, bad actors would enroll, fake their location, and collect payouts. GigShield has 5 layers of protection — starting with the most powerful one, which requires no technology at all.

---

**🏗️ Layer 1 — Structural Protection (Parametric Design)**

Since GigShield's triggers are based on external government data from CPCB and IMD — not on what the rider reports — **90% of traditional insurance fraud is impossible by design.**

A Zomato or Swiggy rider cannot:
- 📡 Fake that AQI was above 300 — CPCB is the source, not the rider
- 🌧️ Claim a rain event that did not happen — IMD is the source, not the rider
- 💰 Inflate their income baseline — earnings data comes from Zomato or Swiggy's own API

---

**📍 Layer 2 — Location Validation**

On the trigger day, the rider's last GPS ping from the Zomato or Swiggy app must be within 30km of their registered city. The system uses the Haversine formula — which calculates the straight-line distance between two GPS coordinates on the surface of the Earth — to verify this.

If the straight-line distance between the rider's GPS location and the centre of their registered city is greater than 30km, they are excluded from that trigger's payout.

*Example: A rider registered in Delhi whose GPS shows them in Gurgaon (24km) — still eligible. A rider registered in Delhi whose GPS shows them in Lucknow (500km) — excluded.*

*Why 30km radius: Covers riders delivering in outer zones of large metro cities without being so large that someone in a completely different city could claim.*

---

**🚴 Layer 3 — Activity Validation**

The rider must have completed at least 1 delivery on the Zomato or Swiggy platform in the past 7 days to be eligible for any payout.

*Why: This prevents policy farming — where someone enrolls, never actually delivers food, and just waits for a trigger event to collect money.*

---

**🔍 Layer 4 — Duplicate Prevention**

One Aadhaar number can have only one active policy across all platforms at any time. If the same Aadhaar appears linked to both a Zomato account and a Swiggy account, it is flagged immediately.

The rider's device is also fingerprinted at enrollment — the combination of their phone's operating system version, screen resolution, and timezone creates a unique hash. If the same device appears linked to two different worker accounts, both are flagged.

*Why: Prevents one person from registering on both Zomato and Swiggy and double-collecting on the same trigger event.*

---

**🤖 Layer 5 — ML Anomaly Detection**

GigShield uses an Isolation Forest machine learning model to score every claim from 0 to 100. This model was trained on historical claim patterns and looks for statistical outliers — things that are unusual when compared to the rest of the population.

The model considers the following signals: how many claims the rider has made in the past 7 days, the GPS distance from their registered city on trigger day, whether the device matches the enrollment device, how old the account was when the first claim was made, whether the payout amount is unusually high compared to peers in the same city, and whether the rider appears on multiple platforms with the same Aadhaar.

**Decision thresholds:**

| 🎯 Score Range | ✅ Decision | ⚡ Action |
|---|---|---|
| 0 – 40 | Clean — auto-approved | Payout released immediately to UPI |
| 41 – 70 | Suspicious — soft flag | Payout held 24 hours, placed in manual review queue |
| 71 – 100 | High risk — auto-blocked | Payout rejected, reason logged, rider notified with explanation |

*Why Isolation Forest specifically: At launch, we have no labeled historical fraud examples to train a supervised model. Isolation Forest is unsupervised — it finds outliers without needing to know what fraud looked like in the past. It also scores 3,000+ riders in under 2 seconds, which is critical on trigger days.*

**🛡️ Advanced Strategy: GPS Spoofing Prevention**

To maintain parametric integrity, GigShield implements a **Tactical GPS Dovetail** mechanism:

-   **Multi-Point Verification**: The platform cross-references the rider's reported GPS with the Zomato/Swiggy delivery pings and the local sensor network.
-   **Velocity Analysis**: If a rider jumps 20km in under 2 minutes (a common spoofing behavior), the payout is instantly locked for manual audit.
-   **Hardware Fingerprinting**: We detect and block "Mock Location" flags in the Android Manifest, preventing "Teleportation" apps like FakeGPS.
-   **Sensor Dovetailing**: If a rider claims to be in a "Rainfall Payout Zone" but their phone's humidity/pressure sensors report dry conditions, the AI flags a **Sensor-Conflict Dispute**.

---

### ⚡ Feature 6 — Parametric Automation Engine

> **Why fully automated?** A Zomato or Swiggy rider working 12 hours a day in traffic cannot be expected to open an app and file a claim the moment AQI crosses 300. If the rider has to do anything to receive their payout, the product has already failed.

**⏱️ Real-Time Trigger Monitoring**

Every 15 minutes, a background scheduler polls the CPCB API for AQI readings and the IMD API for weather readings across all 6 active cities. Each reading is checked against the trigger thresholds.

**The five trigger types and why each threshold was chosen:**

| 🌡️ Trigger | 📡 Data Source | ⚡ Threshold | 📌 Why This Number |
|---|---|---|---|
| Hazardous AQI | CPCB API (free) | AQI ≥ 300 | CPCB classifies 300+ as "Hazardous" — outdoor work strongly inadvisable |
| Extreme rainfall | IMD API (free) | ≥ 115mm in 24h | IMD "Very Heavy Rainfall" classification — roads flood, orders stop |
| Cyclone / high wind | IMD API (free) | ≥ 60 km/h | A 2-wheeler motorbike cannot be safely ridden above this wind speed |
| Heat wave | IMD API (free) | ≥ 45°C | IMD's official heat wave definition for plains states |
| Dense fog | IMD API (free) | Visibility ≤ 50m | IMD "Very Dense Fog" — delivery is physically impossible |

**🔁 Automatic Claim Initiation**

When a trigger fires, the system runs an eligibility query instantly: it finds every active Zomato or Swiggy rider in that city whose plan covers that trigger type, who has at least 4 weeks of earnings baseline, and who has made at least 1 delivery in the past 7 days.

For each eligible rider, the fraud model scores them. Clean riders go directly to the payout queue. Flagged riders go to review. Blocked riders are notified with a reason.

The Razorpay batch UPI payout runs for all approved riders. The platform (Zomato or Swiggy) is automatically billed via event surcharge on their Monday invoice. Every rider gets an SMS when their UPI is credited.

---

### 📊 Feature 7 — Analytics Dashboard

> **Why analytics?** Riders need to trust that the system is transparent. Zomato and Swiggy need to justify the weekly cost to their finance teams. The dashboard is where trust is built and value is proved.

**5 Dashboard Panels:**

**📈 Panel 1 — Risk Pool Health**
Weekly chart showing premiums collected vs payouts disbursed vs fraud blocked. Loss ratio trend line with a target below 65%. Reinsurance exposure meter showing how close the pool is to the GIC Re backup threshold.

**🗺️ Panel 2 — City Risk Heatmap + 7-Day Forecast**
Live AQI and weather per city from CPCB and IMD. 7-day trigger probability per city using the IMD forecast model. Platforms receive a 48-hour advance warning email and webhook notification before any predicted surcharge event.

**🔍 Panel 3 — Fraud Metrics**
Claims blocked this week with total rupee value saved. Fraud score distribution showing what proportion of claims fell in each band. Top flag reasons. Weekly fraud rate percentage with target below 1%.

**👥 Panel 4 — Worker Retention Analytics**
This is the most important panel for Zomato and Swiggy. It shows a retention curve comparing covered riders vs uncovered riders over 20 weeks. Covered: 90% still active at 20 weeks. Uncovered: 65% still active. Estimated churn cost saved per month per platform. This is the ROI proof that keeps Zomato paying ₹40/week.

**🔮 Panel 5 — Predictive Alerts**
"Delhi: 68% chance of AQI trigger on Thursday and Friday. Estimated surcharge for your Zomato fleet: ₹18.4L." This allows platforms to budget for upcoming surcharges and allows GigShield to pre-fund the payout pool before the event hits.

---

## 7. 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│           React + Vite Frontend          │
│  Worker Portal | Admin Dashboard         │
│  Analytics | Fraud Queue                 │
└──────────────┬──────────────────────────┘
               │  HTTPS REST
┌──────────────▼──────────────────────────┐
│           FastAPI Backend (Python)       │
│  Auth | Onboarding | Policies | Payouts │
│  Triggers | Admin | Analytics           │
└────┬─────────────┬──────────┬───────────┘
     │             │          │
┌────▼───┐   ┌─────▼──┐  ┌───▼──────────┐
│Postgres│   │ Redis  │  │Celery Workers│
│Primary │   │Cache + │  │15-min trigger│
│  DB    │   │Broker  │  │Monday billing│
└────────┘   └────────┘  └──────┬───────┘
                                 │
         ┌───────────────────────┘
         │
┌────────▼──────────────────────────────────┐
│            Integration Layer               │
│  CPCB AQI API     IMD Weather API          │
│  OpenWeatherMap   Traffic Mock JSON        │
│  Zomato Mock API  Swiggy Mock API          │
│  Razorpay Sandbox Twilio SMS + WhatsApp   │
└────────┬──────────────────────────────────┘
         │
┌────────▼──────────────────────────────────┐
│               ML Engine                    │
│  XGBoost — Risk Score + Dynamic Premium   │
│  Isolation Forest — Fraud Score 0–100     │
│  IMD Trend Model — 7-day Forecast         │
└────────────────────────────────────────────┘
```

**🛠️ Technical Stack (GuideWire-Elite Performance)**

| Layer | Choice | Rationale |
|---|---|---|
| **Core Backend** | **FastAPI (Python 3.11)** | High-concurrency async support for multi-city trigger monitoring. |
| **Task Engine** | **Celery + Redis** | Decoupled 15-minute polling for 12-week seasonal baseline updates. |
| **Frontend** | **React + Vite** | Ultra-responsive UI with <100ms render for the Rider Matrix. |
| **Styling** | **Tailwind CSS** | Premium "Mission Control" aesthetic with mobile-first responsiveness. |
| **ORM / DB** | **SQLAlchemy** | Strict financial ACID compliance for immutable payout records. |
| **Logic Kernel** | **Python Parametric Engine** | Proprietary 12-week rolling shift-loss calibration logic. |

---

## 8. 🤖 AI / ML Models

### 📊 Model 1 — XGBoost Risk Scorer

**What it does:** Scores each Zomato or Swiggy rider from 0 to 100 based on their environmental exposure, delivery pattern, and city risk. This score drives the dynamic weekly premium calculation.

**Why XGBoost:** Best performance on structured tabular data with mixed types — numerical city statistics, categorical vehicle type, temporal seasonal factors. The SHAP library integrates directly with XGBoost to produce plain-language explanations of why a premium changed week to week.

**Input features — all specific to food delivery partners:**

| 🔢 Feature | 📌 What it captures |
|---|---|
| City trigger days per year | How many days historically cross AQI or weather thresholds in this city |
| Month of year (1–12) | Seasonal risk — October Delhi vs April Delhi are completely different |
| City risk tier | Low, Medium, or High encoded numerically |
| Delivery zone AQI ratio | Worker's zone AQI vs city average — industrial vs residential area |
| Vehicle type | 2-wheeler (fully exposed) vs 4-wheeler (partial shelter) |
| Average weekly deliveries | Proxy for income volume at risk per trigger day |
| Platform tenure in weeks | Stability indicator — newer accounts carry higher uncertainty |
| Shift type | Night only, mixed, or day — different AQI and heat exposure profiles |

**SHAP explainability output example:**
The system can tell a rider: *"Your premium increased ₹4 this week because Delhi's AQI season started in October (+₹8 seasonal loading) and your delivery zone has above-average pollution readings (+₹2 zone factor). Your tenure bonus reduced it by ₹6."*

---

### 🔍 Model 2 — Isolation Forest Fraud Detector

**What it does:** Scores each claim from 0 to 100 for anomaly risk. Identifies statistical outliers in claim patterns without needing labeled examples.

**Why Isolation Forest:** At launch there are no labeled historical fraud records to train a supervised classifier. Isolation Forest is an unsupervised anomaly detection algorithm — it learns what "normal" looks like and flags anything that deviates significantly. It isolates anomalies by randomly partitioning the feature space. Outliers (fraudulent claims) need far fewer partitions to isolate than normal claims. It scores 3,000 riders in under 2 seconds.

**Anomaly signals monitored:**

| 🔍 Signal | ⚡ Why it matters |
|---|---|
| Claims per 7 days (velocity) | More than 3 claims in a week is statistically unusual |
| GPS distance from registered city | Large distance on trigger day = likely not working in registered zone |
| Device match score | 1.0 = same phone as enrollment, 0.0 = completely different device |
| Account age at first claim | Brand-new Zomato/Swiggy account + immediate claim = suspicious pattern |
| Payout vs city peer average | Claiming 3× the average of all other riders in same city/event = outlier |
| Cross-platform enrollment flag | Same Aadhaar on both Zomato and Swiggy accounts at same time |

---

### 🔮 Model 3 — Trigger Probability Forecaster

**What it does:** Predicts the probability of a trigger event firing in each city over the next 7 days. Used to pre-fund the payout pool and send advance warnings to Zomato and Swiggy.

**How it works:** The model takes the IMD 7-day weather forecast (via OpenWeatherMap free API) and combines it with a 14-day AQI trend from CPCB to produce a daily trigger probability for each city. It uses a sigmoid function — a smooth curve that transitions from 0% probability far below the threshold to near 100% probability well above it — to estimate how likely each parameter is to cross its threshold on each day.

**Example output:**
- Delhi Monday: AQI forecast 280, 14-day trend rising → trigger probability 38%
- Delhi Thursday: AQI forecast 315, continuing trend → trigger probability 71%
- Estimated payout liability Thursday: 4,800 riders × 71% × ₹1,200 average = ₹40.8L

Zomato receives this alert on Tuesday: *"Delhi: 71% AQI trigger probability Thursday. Estimated surcharge for your fleet: ₹19.4L."*

---

## 9. 🗄️ Database Design

> **Why PostgreSQL and not a document database?** Every payout is a financial transaction. Race conditions — two payouts going to the same rider for the same event — must be structurally impossible. PostgreSQL's ACID transactions guarantee this. The trigger events table and audit log are append-only — nothing is ever deleted or modified, creating an immutable financial trail.

**Core tables and their purpose:**

| 📋 Table | 📌 Purpose | 🔒 Key constraint |
|---|---|---|
| workers | Rider identity, KYC status, city, UPI | Aadhaar stored as SHA-256 hash only — never plaintext |
| baselines | Rolling 4-week earnings average per rider | Minimum 4 weeks required for payout eligibility |
| policies | One row per active weekly policy | Indexed on city + trigger type for fast lookup on trigger day |
| events | Every trigger event ever fired | Append-only — no updates or deletes ever |
| payouts | Full record of every disbursement including all formula factors | Links to event + policy + worker |
| fraud_scores | Every fraud scoring decision | All changes logged with reviewer name |
| billing | Weekly invoices per platform | Generated every Monday automatically |
| audit_log | Every state change across all tables | Immutable — append-only, required for IRDAI compliance |

**Key design decisions explained:**

🔐 **Aadhaar hashing:** The rider's Aadhaar number is converted to a one-way SHA-256 hash immediately on receipt. The original number is never written to the database. This means even if the database were compromised, no Aadhaar number could be recovered.

📝 **Append-only events table:** Trigger events can never be modified or deleted. This means no one — not even a system administrator — can retroactively change the record of when and where a trigger fired. This protects both riders and GigShield from disputes.

🔗 **Payout table stores all formula factors:** Every multiplier, bonus, and ratio that went into a payout calculation is stored alongside the final amount. This means any rider can request a full explanation of how their payout was calculated.

---

## 10. 🔌 Integration Layer

> **All platform APIs (Zomato, Swiggy) are simulated with mock JSON — this is explicitly acceptable per the hackathon guidelines. Real free-tier APIs are used for weather and AQI data.**

| 🔗 Integration | 🛠️ Service | 📊 Mode | 🎯 Purpose |
|---|---|---|---|
| 🌫️ AQI monitoring | CPCB API | Free tier — real | Primary AQI trigger source for all 6 cities |
| 🌧️ Weather monitoring | IMD API | Free tier — real | Rainfall, wind, temperature, visibility triggers |
| ☁️ Forecast + backup | OpenWeatherMap | Free 1,000 calls/day — real | 7-day forecast for predictive model. Backup if IMD is down |
| 🚦 Traffic congestion | Mock JSON file | Simulated | Congestion index (0–10) as payout severity modifier |
| 🛵 Zomato worker data | Zomato Mock API | Simulated JSON | Active status, GPS location, weekly earnings, delivery count |
| 🛵 Swiggy worker data | Swiggy Mock API | Simulated JSON | Same fields — Swiggy delivery partners |
| 💳 UPI batch payouts | Razorpay Payout API | Sandbox | Phase 1 and Phase 2 UPI disbursement to riders |
| ✅ UPI validation | Razorpay Penny Drop | Sandbox | ₹1 account validation at onboarding |
| 🧾 Platform billing | Razorpay Billing | Sandbox | Monday auto-invoice to Zomato and Swiggy |
| 🪪 Aadhaar KYC | UIDAI API | Mock response | Identity verification at enrollment |
| 📱 SMS notifications | Twilio SMS | Trial account | Trigger alerts, payout confirmations, renewal reminders |
| 💬 WhatsApp | Twilio WhatsApp | Trial account | Policy schedule delivery, richer notifications |

**🚦 How traffic data modifies payouts:**

The traffic congestion index (0–10 scale) from the mock data is used as a modifier for payout severity — not as a trigger by itself. The reasoning: a Zomato rider in gridlock traffic during an AQI event loses more income than a rider in a clear-road suburb in the same city, even if they experience the same AQI. Their ability to complete deliveries is doubly impaired.

A congestion index of 7 or above adds 10% to the payout. A congestion index of 4–6 adds 5%. Below 4, no adjustment. In production, this would be replaced with HERE Traffic API or Google Maps Traffic API.

---

## 11. 💼 Business Model

### 🏢 Primary: B2B Platform-Funded

Zomato and Swiggy pay GigShield **₹40 per rider per week** as a worker welfare benefit. The delivery partner pays ₹0.

**Why would Zomato pay ₹40/week per rider?**

| 📊 ROI Driver | 📈 Evidence |
|---|---|
| 🔄 Worker retention | Covered riders: 90% active at 20 weeks vs 65% uncovered. Replacing a trained food delivery partner costs ₹3,000–₹5,000. |
| 🌧️ Supply during disruptions | Covered riders are 2.4× more likely to stay online on bad weather days — protecting platform GMV on high-demand surge days |
| 💰 Annual cost per rider | ₹2,080/year — cheaper than losing 42 riders per 1,000 to churn annually |
| 🏛️ Regulatory positioning | Proactive welfare positioning ahead of India's Gig Worker Welfare Code discussions |

### 👤 Secondary: B2C Worker-Pays

Zomato or Swiggy riders who want more coverage than their platform provides, or riders whose platform does not participate in B2B, can enroll directly:
- Basic: ₹28–₹55/week (60% of income gap covered)
- Shield: ₹65–₹99/week (75% of income gap covered)
- Pro: ₹120–₹179/week (90% of income gap covered)

### 📊 Unit Economics — per 1,000 riders per week

| 💰 Line Item | 📊 B2B Model |
|---|---|
| Gross revenue | ₹40,000 |
| Expected payouts | ₹16,800 (42% average payout rate) |
| Reinsurance cost | ₹3,200 (8% of premiums) |
| Ops + tech + fraud | ₹3,200 |
| **GigShield net margin** | **₹16,800 (42%)** |

### 🏛️ Regulatory Structure

GigShield operates as an IRDAI-licensed Insurance Broker and Aggregator. It builds the technology, acquires riders, manages triggers, and handles fraud. The actual insurance policy is underwritten by GIC Re or Digit Insurance — an IRDAI-licensed insurer who holds the statutory reserves and signs every policy. Munich Re or Swiss Re reinsures catastrophic losses above the pool's weekly threshold. This three-layer structure is fully compliant with IRDAI's 2023 Sandbox framework, which explicitly permits parametric index-based payouts without traditional loss assessment.

---

---

## 14. 📡 API Reference

### 🔐 Authentication

**POST /api/auth/otp/send**
Sends a 6-digit OTP to the rider's phone via Twilio SMS. The OTP expires in 5 minutes.
Request body: phone number as a string.
*Why phone OTP: Delivery partners do not reliably have email accounts. Phone number is their identity.*

**POST /api/auth/otp/verify**
Verifies the OTP and returns a JWT token. The token is valid for 24 hours.
Request body: phone number + OTP code.
Response: JWT token + worker ID + flag indicating if this is a new enrollment.

---

### 🪪 Onboarding

**POST /api/onboarding/kyc**
Submits Aadhaar and PAN for verification. Aadhaar is hashed before any database write.
*Why: IRDAI mandates KYC before insurance can be issued.*

**POST /api/onboarding/upi**
Submits UPI ID for penny-drop validation. ₹1 is sent to the account via Razorpay sandbox.
*Why: Validates the payout destination before any policy is created. Prevents failed payouts on trigger day.*

**POST /api/onboarding/platform-link**
Links the rider to their Zomato or Swiggy account using their platform Worker ID. Verifies active status and city match via mock API.
*Why: Required for earnings baseline data pipeline and performance-linked payout calculation.*

---

### 📋 Policies

**GET /api/policy/me**
Returns the rider's active policy: plan, weekly premium, coverage ratio, max payout per day, city, triggers covered, status, and next renewal date.

**GET /api/policy/me/risk-score**
Returns the rider's current risk score (0–100), this week's premium, and a SHAP explanation of what factors contributed to the premium. Example explanation: "Delhi AQI season adds ₹8. Your 2-wheeler exposure adds ₹4. Your 14 months of tenure gives a ₹2 stability discount."

---

### 💰 Payouts

**GET /api/payouts/me**
Returns the rider's full payout history with event details, both phase amounts, and status.

**GET /api/payouts/{payout_id}/breakdown**
Returns the complete calculation breakdown for a specific payout showing: baseline earnings, trigger week actual earnings, income gap, coverage ratio applied, zone multiplier, consistency multiplier, loyalty bonus, Phase 1 amount, Phase 2 amount, total, and the formula in plain text.
*Why: Riders should be able to verify every payout calculation. Transparency builds trust.*

---

### ⚡ Live Triggers

**GET /api/triggers/live**
Returns the current AQI and weather status for all 6 cities, showing whether each is clear, near the threshold, or actively triggered. Also shows how many Zomato and Swiggy riders are currently affected in each triggered city.
*Why: Riders can check if their city is close to a trigger. Knowing this helps them plan their day.*

---

### 🧑‍💼 Admin Endpoints

**POST /api/admin/roster**
Zomato or Swiggy submits their updated active rider roster every Monday. GigShield validates, profiles, and creates or renews policies for all active riders.

**GET /api/admin/invoice/{week_start_date}**
Returns the full invoice for the platform for that week: base premium per rider, event surcharges from any trigger events, GST, GigShield platform fee, and total due.

**GET /api/admin/fraud/queue**
Returns all claims currently in the manual review queue with fraud score, flag details, rider ID, event, and amount.

**POST /api/admin/fraud/decision**
Submits an approve or block decision on a queued claim. Requires a reason for audit logging.

---

### 📊 Analytics

**GET /api/analytics/pool-health** — Risk pool weekly data for Panel 1

**GET /api/analytics/city-heatmap** — City risk + trigger forecast for Panel 2

**GET /api/analytics/fraud-metrics** — Fraud summary data for Panel 3

**GET /api/analytics/retention** — Covered vs uncovered retention curve for Panel 4

**GET /api/analytics/forecast** — 7-day trigger probability per city for Panel 5

---

## 15. 📅 Build Timeline

| 🗓️ Week | 🎯 Focus | ✅ Key Deliverables |
|---|---|---|
| **Week 1** | Foundation | Rider onboarding UI, phone OTP, KYC mock, UPI penny drop, PostgreSQL schema, basic FastAPI routes |
| **Week 2** | Trigger Engine | CPCB API, IMD API, OpenWeatherMap backup, threshold engine, Celery 15-min cron, trigger event logging |
| **Week 3** | AI + Pricing | XGBoost risk model, dynamic premium formula, rolling baseline engine, policy creation service, Monday billing |
| **Week 4** | Fraud Detection | Isolation Forest model, haversine location check, device fingerprinting, duplicate dedup, review queue UI |
| **Week 5** | Payouts + Integrations | Razorpay sandbox UPI batch payouts, two-phase payout logic, Zomato + Swiggy mock APIs, Twilio SMS |
| **Week 6** | Analytics + Demo | 5-panel analytics dashboard, 7-day forecast, platform admin view, end-to-end demo polish, documentation |

---

## 16. 🎬 Demo Flow

### 👤 Step 1 — Enroll a Zomato rider (60 seconds)

Open GigShield on a phone browser. Enter phone 9876543210. OTP 482910 auto-fills in demo mode. Aadhaar is verified. City is detected as Hyderabad by GPS. UPI ravi.kumar@upi is validated via penny drop. Zomato Worker ID ZMT-00291 is linked — active and city-confirmed.

Policy created immediately:
- 🎯 Risk Score: 78 (High — Hyderabad March heat season, 2-wheeler)
- 💰 B2C Premium: ₹58.70/week   |   B2B (Zomato pays): ₹40/week
- 📋 Plan: Shield (75% coverage, ₹1,500/day max)
- 📱 SMS arrives: *"Covered. Policy GS-ZMT-2026-00291. ₹1,500/day protection active."*

---

### ⚡ Step 2 — Fire a trigger event (30 seconds)

In the admin panel, simulate a trigger: City = Hyderabad, Type = AQI, Value = 318.

System responds automatically in under 2 seconds:
- ⏰ Trigger event created at 08:15 AM
- 👥 Eligibility query: 3,241 active Zomato + Swiggy Shield/Pro riders in Hyderabad
- 📊 4-week baselines fetched for all 3,241 riders
- 🔍 Isolation Forest fraud scoring: running on all riders...
- ✅ Result: 23 flagged, 3,218 cleared for Phase 1 payout

---

### 🔍 Step 3 — Review fraud detection (45 seconds)

Fraud queue shows three entries:

🔴 **WK-05534 — Score: 91 — AUTO-BLOCKED**
Flags: duplicate device + 3rd claim in 7 days.
System message: *"Same device fingerprint as WK-03271. Velocity: 3 claims this week."* ₹1,500 payout prevented.

🟡 **WK-02891 — Score: 62 — MANUAL REVIEW**
Flag: GPS location 45km outside registered Hyderabad zone.
Admin clicks BLOCK and enters reason: *"Worker GPS in Secunderabad — outside 30km eligible zone."*

🟢 **WK-00291 (Ravi) — Score: 9 — AUTO-APPROVED**
No flags. Proceeds directly to Phase 1 payout queue.

---

### 💸 Step 4 — Phase 1 advance payout (30 seconds)

Razorpay sandbox shows:
- 📦 Batch UPI payout initiated for 3,216 cleared Zomato + Swiggy riders
- 💰 Ravi's advance: ₹1,000 (40% of estimated ₹2,500 gap based on baseline)
- ✅ UPI credit confirmed by Razorpay webhook
- 📱 SMS to Ravi: *"₹1,000 advance credited to ravi.kumar@upi. Final payout on Day 7 after earnings are verified."*

---

### 🧮 Step 5 — Phase 2 final settlement (45 seconds)

Skip forward to Day 7 in the demo. Actual earnings arrive from Zomato mock API.

Ravi's previous 4-week baseline: ₹5,100/week average.
Ravi's trigger week actual earnings: ₹2,600.
Income gap: ₹2,500.

Payout calculation:

| 🧮 Factor | 📊 Value |
|---|---|
| Income gap | ₹2,500 |
| × Coverage ratio (Shield 75%) | × 0.75 |
| × Zone modifier (zone AQI 380 vs city avg 318) | × 1.20 |
| × Consistency (4 consistent weeks) | × 1.0 |
| + Loyalty bonus (worked on trigger day) | + ₹225 |
| **Final payout** | **= ₹2,475** |

Balance = ₹2,475 − ₹1,000 advance = **₹1,475 credited to UPI**

📱 SMS to Ravi: *"Your income protection payout this week: ₹2,475. ₹1,000 was paid earlier. ₹1,475 now credited to ravi.kumar@upi."*

---

### 📊 Step 6 — Platform dashboard (60 seconds)

Zomato admin logs in and sees:

🧾 **Monday Invoice:**
- 12,840 riders × ₹40 base = ₹5,13,600
- AQI event surcharge (3,216 riders): ₹43,800
- GST 18%: ₹1,00,692
- GigShield platform fee 3%: ₹17,049
- **Total due: ₹6,75,141**

📈 **Analytics — Retention proof:**
- Covered Zomato riders: 90% still active at 20 weeks
- Uncovered riders: 65% still active at 20 weeks
- Estimated churn cost saved this month: ₹4.2L

🛡️ **Fraud saved this event:** ₹34,500 (23 blocked claims)

🔮 **Predictive alert:** *"Delhi: 68% AQI trigger probability Thursday. Estimated surcharge ₹18.4L for your fleet."*

---

## 17. 🏆 Why GigShield Wins

| 🔍 Dimension | 📋 Traditional Insurance | 📊 Flat Parametric | 🛡️ GigShield |
|---|---|---|---|
| Payout type | Manual loss assessment | Fixed flat for everyone | **Based on each rider's actual previous week earnings** |
| Claim process | File a form → weeks of delay | Automatic | **Automatic, two-phase, zero rider action** |
| Weekly pricing | ❌ No | ❌ No | ✅ **Yes — recalculates every Monday per rider** |
| Fraud exposure | 🔴 High — self-reported | 🟡 Medium | 🟢 **Very low — external data + ML + 4-week history** |
| Fairness | Accurate but very slow | Fast but same for all | **Fast AND fair — unique payout per rider** |
| Worker incentive | Stop working → claim more | Stop working → same payout | **Keep working → loyalty bonus +10%** |
| Income accuracy | Exact but 6-week delay | Approximate estimate | **Exact — real gap from actual Zomato/Swiggy earnings** |
| Platform ROI proof | ❌ None | 🟡 Basic | ✅ **Full retention analytics + churn cost calculator** |

---

## 📊 Key Targets

| 🎯 Metric | ✅ Target |
|---|---|
| ⏱️ Onboarding completion | Under 2 minutes |
| 📡 Trigger detection latency | Under 15 minutes |
| 💸 Phase 1 payout SLA | Under 4 hours from trigger |
| 🛡️ Fraud block precision | Under 1% of total claims |
| 📈 Risk pool loss ratio | Under 65% |
| 🔮 7-day forecast accuracy | Above 80% |
| 👥 Rider retention (covered vs uncovered at 20 weeks) | 90% vs 65% |

---

## 🌍 Market Size

| 📅 Year | 👥 Gig Workers in India | 💰 TAM at ₹40/worker/week |
|---|---|---|
| FY25 today | 12 million | ₹2,496 Cr/year |
| 2029–30 | 23.5 million | ₹4,888 Cr/year |
| 2047 | 62 million | ₹12,896 Cr/year |

> 🎯 5% market capture today = 600,000 riders = **₹124 Cr/year in platform fees alone**

---

---

<div align="center">

**🛡️ GigShield — Because Zomato and Swiggy delivery partners deserve a safety net**

*Built specifically for food delivery workers.*
*Triggered by government data. Paid based on your actual previous week's work.*

---

*Every feature in this platform was designed around one question:*

**"What does Ravi Kumar in Delhi actually need when AQI hits 318?"**

</div>
