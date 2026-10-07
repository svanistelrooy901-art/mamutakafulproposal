# AIA panel hospitals (source for the webapp's hospital dropdown)

Source: "Individual AIA Panel Hospital Listing", effective 9 Feb 2026 (PDF from Mamu, 7 Oct 2026). Covers 122 hospitals in 13 groups. The data lives in `DATA.hospitals` in `src/app.js`.
- `s:1` = SMART panel; `s:0` = General panel. With General panel, cashless GL is limited to specific departments/specialists.
- Groups: Klang Valley (split by postcode into KL 50000–60000 / Selangor), Johor, N. Sembilan, Melaka, Pahang, Terengganu, Kelantan, Perlis, Kedah, Perak, Pulau Pinang (island 10000–11999 / Seberang Perai), Sabah, Sarawak. Labuan has no listing.
- There is no Platinum marker in this listing, so the Platinum badges from the Apr 2025 listing were dropped.
- **Penang changes vs the Apr 2025 SMART list:**
  - Penang Adventist, Pantai Penang, Loh Guan Lye and KPJ Penang are now **General panel, not SMART**.
  - SMART in Penang: Island, Gleneagles, Lam Wah Ee, Kek Lok Si, Mount Miriam, Sunway Penang, Bagan Specialist.
- Pages 7–8 of the PDF list SMART Ambulatory Care Centres (ACCs). These are not yet in the app.
