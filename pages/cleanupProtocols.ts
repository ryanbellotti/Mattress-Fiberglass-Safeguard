export const CLEANUP_PROTOCOLS = {
  mild: {
    color: '#10b981',
    label: 'Mild Contamination Cleanup',
    steps: [
      {
        title: "Visual Inspection with Flashlight",
        action: "Confirm presence and assess extent of fiberglass particles",
        desc: "Using a bright flashlight (preferably in a darkened room), carefully inspect the area around the mattress, nearby surfaces (especially dark ones), bedding, and the exposed inner layers of the mattress. Look for fine, shiny, glitter-like particles or fibers. Document what you see with photos if possible."
      },
      {
        title: "Immediate Actions – HVAC & Fans OFF",
        action: "Turn off HVAC system and all fans immediately to prevent spreading",
        desc: "Turn off your entire HVAC system (heating/cooling) at the thermostat and breaker if possible. Turn off all ceiling fans and portable fans. This prevents fibers from being circulated throughout your home via air currents."
      },
      {
        title: "Put On Protective Equipment",
        action: "Wear proper PPE before beginning cleanup",
        desc: "At minimum: N95 mask (ensure proper fit/seal), disposable gloves (nitrile or latex), eye protection (safety goggles), and clothes you can wash separately or dispose of. For better protection, use disposable coveralls."
      },
      {
        title: "Isolate the Mattress",
        action: "Carefully wrap and seal the mattress in heavy-duty plastic",
        desc: "Use at least 6 mil thick plastic sheeting or a zippered mattress encasement. Wrap the mattress completely without shaking or excessive movement. Tape all seams thoroughly with duct tape. No gaps! Do not move the mattress through other rooms if possible."
      },
      {
        title: "Remove Mattress from Home",
        action: "Carefully transport wrapped mattress outside for disposal",
        desc: "Clear a path to the outside. Slowly and carefully carry the wrapped mattress out. Avoid bumping walls or scraping floors. Place in designated disposal area away from traffic. Check local regulations for proper disposal."
      },
      {
        title: "Bag Exposed Bedding & Textiles",
        action: "Seal all bedding and nearby textiles in plastic bags",
        desc: "Place bedding, pillows, nearby curtains, and clothing directly into heavy-duty plastic bags without shaking. Seal bags tightly. Label bags. Many items may need to be discarded if heavily contaminated. Do not shake items before bagging."
      },
      {
        title: "HEPA Vacuum Immediate Area",
        action: "Clean the immediate bedroom area with HEPA vacuum only",
        desc: "Use ONLY a vacuum with true HEPA filter. Never use regular vacuum - it will spread fiberglass. Vacuum slowly and methodically - floors, walls, furniture surfaces. Empty vacuum canister/bag outside immediately into sealed plastic bag."
      },
      {
        title: "Wet Wipe All Surfaces",
        action: "Wipe down surfaces with damp microfiber cloths",
        desc: "Use damp (not soaking) disposable microfiber cloths with mild soapy water. Work from top to bottom - ceiling, walls, furniture, window frames, floors. Change cloths frequently. Dispose of cloths after use or wash separately multiple times."
      },
      {
        title: "Use Lint Rollers & Tack Cloths",
        action: "Detail clean with lint rollers and tack cloths for final pickup",
        desc: "Use sticky lint rollers and tack cloths on all surfaces, especially corners, edges, and textured surfaces. These are excellent for capturing remaining fibers that vacuuming might miss."
      },
      {
        title: "Run HEPA Air Purifiers",
        action: "Use HEPA air purifiers in the bedroom continuously",
        desc: "Place HEPA air purifiers in the cleaned bedroom. Run continuously for at least 2-3 weeks. Change filters according to manufacturer instructions. This helps capture airborne particles."
      },
      {
        title: "Wash Bagged Items or Dispose",
        action: "Evaluate bagged items - wash separately or discard",
        desc: "Inspect each bagged item with flashlight. Items showing visible fibers should be discarded. Washable items: wash separately from other laundry in hot water, dry on high heat, may need multiple cycles. When in doubt, throw it out."
      },
      {
        title: "Personal Decontamination",
        action: "Properly remove PPE and shower immediately",
        desc: "Remove PPE carefully - coveralls first (rolling inside out), then gloves, eye protection, mask last. Bag all disposable PPE. Take cool shower immediately - rinse first without scrubbing, then wash gently with soap. Wash hair thoroughly."
      }
    ]
  },
  moderate: {
    color: '#f59e0b',
    label: 'Moderate Contamination Cleanup',
    steps: [
      {
        title: "Visual Inspection & Assessment",
        action: "Use flashlight to inspect and assess contamination spread",
        desc: "Using bright flashlight in darkened room, inspect: mattress area, all bedroom surfaces, nearby rooms, hallways, and HVAC vents. Look for shiny, glitter-like fibers. Document spread with photos. If fibers are in multiple rooms or HVAC vents show contamination, you may have severe contamination."
      },
      {
        title: "IMMEDIATE: Stop All Air Movement",
        action: "Turn off HVAC, fans, and isolate contaminated areas",
        desc: "Turn off entire HVAC system at thermostat AND breaker. Turn off all fans. Close doors to contaminated rooms. Do not let anyone enter. This is critical to prevent further spread throughout your home."
      },
      {
        title: "Gather All Necessary Supplies",
        action: "Collect all cleaning supplies before starting",
        desc: "ESSENTIAL: HEPA vacuum (check filter is properly seated), HEPA vacuum bags, disposable microfiber cloths, damp mop system, tack cloths, lint rollers, heavy-duty 3-6 mil plastic bags, spray bottles, mild dish soap, plastic sheeting, duct tape, permanent marker.\nOPTIONAL: HEPA air scrubber (rent if possible), wet/dry vacuum with HEPA filter."
      },
      {
        title: "Full PPE – Non-Negotiable",
        action: "Put on complete protective equipment before proceeding",
        desc: "Required: Disposable Tyvek coveralls (tape at wrists/ankles), P100 respirator (N95 minimum - ensure proper fit/seal), tight-fitting safety goggles or face shield, durable nitrile gloves, duct tape for sealing gaps. Do NOT proceed without proper PPE."
      },
      {
        title: "Isolate & Seal Contaminated Areas",
        action: "Create containment to prevent cross-contamination",
        desc: "Close and seal doors to contaminated rooms with plastic sheeting and tape. Cover ALL air vents (supply and return) in contaminated areas with plastic and tape. Create a “clean” staging zone outside contaminated area. Minimize entry/exit."
      },
      {
        title: "Remove Mattress (Source Removal)",
        action: "Carefully wrap and remove the contaminated mattress",
        desc: "Best: Use zippered mattress encasement designed for disposal. Slide on carefully without excessive movement, zip completely.\nAlternative: Use 6 mil plastic sheeting - carefully roll mattress onto sheeting, wrap completely like a present, seal ALL seams with duct tape.\nLightly mist air with water before wrapping to weigh down airborne fibers. Carefully carry out, avoid bumping walls."
      },
      {
        title: "Remove & Bag ALL Items from Room",
        action: "Empty the room completely for thorough structural cleaning",
        desc: "Systematically place ALL items into heavy-duty plastic bags (clothing, bedding, books, decor, electronics, furniture if possible). Seal bags tightly. Label with contents and contamination level (“Heavy - DISPOSE” or “Moderate - Evaluate Later”). Remove bags to isolated area outside or garage. Most porous items should be discarded."
      },
      {
        title: "Wet Cleaning – Top to Bottom",
        action: "Wipe all surfaces with damp cloths and mild soapy water",
        desc: "Use damp microfiber cloths with mild soapy water. Clean ceiling FIRST, then walls (including light fixtures - power off), then hard surfaces (window frames, sills, doors, remaining furniture), then floors with damp mop. Change cloths/water frequently. This captures fibers rather than stirring them up."
      },
      {
        title: "HEPA Vacuum Thoroughly",
        action: "Vacuum all surfaces after wet cleaning",
        desc: "Use HEPA vacuum with appropriate attachments. Move slowly. Vacuum ceiling/walls/high areas first, then furniture crevices, then floors thoroughly paying attention to edges and corners. Empty canister/change bag frequently OUTSIDE into sealed bag. Clean vacuum exterior after use."
      },
      {
        title: "Detail Clean with Tack Cloths",
        action: "Final pickup with lint rollers and tack cloths for final pickup",
        desc: "Use tack cloths and lint rollers for final fiber pickup on all surfaces, especially corners, edges, textured items, and hard-to-reach areas. This step is critical for capturing remaining fibers."
      },
      {
        title: "Repeat Cleaning Cycle",
        action: "Multiple passes required - repeat wet wipe to vacuum to detail",
        desc: "Fiberglass requires MULTIPLE cleaning passes. Repeat the full cycle (wet wipe to HEPA vacuum to tack cloth detail) at least 2-3 times in each room. Inspect with flashlight between passes. Continue until visible fibers are substantially reduced."
      },
      {
        title: "Address Carpets",
        action: "Evaluate carpet removal or professional cleaning",
        desc: "WARNING: Carpets trap fiberglass and are extremely difficult to decontaminate.\nBEST OPTION: Remove and replace affected carpets.\nALTERNATIVE: Multiple HEPA vacuuming sessions + professional hot water extraction (steam cleaning) - discuss fiberglass specifically with company. Results vary and complete removal is unlikely."
      },
      {
        title: "Ventilate & Air Scrubbing",
        action: "Air out space with strategic ventilation",
        desc: "Open windows in cleaned areas. Place fans in windows blowing OUTWARD to exhaust air (not circulating within room). Run HEPA air scrubbers continuously for 24-72 hours in cleaned rooms (rent if needed). Maintain isolation to other areas during ventilation."
      },
      {
        title: "HVAC Professional Cleaning Required",
        action: "Have HVAC system professionally cleaned before reusing",
        desc: "CRITICAL: If HVAC ran during contamination, it’s contaminated. Simply changing filter is NOT enough. Contact HVAC cleaning specialists for contaminant removal - mention fiberglass specifically. They must clean entire system (ducts, coils, blower). Keep system OFF until professionally cleaned."
      },
      {
        title: "Process Bagged Items Outside",
        action: "Evaluate saved items in isolated area with full PPE",
        desc: "Wearing PPE, open bags one at a time outside or in garage. Inspect each item with flashlight.\nDISCARD: Items with visible fibers, complex items, porous materials.\nCLEAN: Hard non-porous items (wipe thoroughly, use tack cloths) and simple washables (wash separately multiple times).\nWhen in doubt, discard. Re-inspect before bringing into clean areas."
      },
      {
        title: "Proper Disposal of Contaminated Waste",
        action: "Seal and dispose of all contaminated materials properly",
        desc: "Ensure all waste (vacuum contents, cloths, tape, PPE, discarded items) is in sealed heavy-duty bags. Label clearly: “CONTAMINATED - FIBERGLASS - DO NOT INCINERATE”. Dispose per local regulations (check with municipal waste authority for fiberglass requirements)."
      },
      {
        title: "Personal Decontamination Protocol",
        action: "Carefully remove PPE and shower immediately",
        desc: "Perform outside or in designated dirty area. Remove coveralls rolling inside out, then gloves inside out, eye protection, respirator last. Avoid shaking. Bag all disposable PPE for disposal. If wearing clothes under coveralls, remove carefully and wash separately immediately (or discard if contaminated). Take cool shower - rinse first without scrubbing, then wash gently with soap. Wash hair thoroughly."
      }
    ]
  },
  severe: {
    color: '#ef4444',
    label: 'Severe Contamination Cleanup',
    showDIYDisclaimer: true,
    steps: [
      {
        title: "Flashlight Inspection - Assess Severity",
        action: "Thoroughly inspect to confirm severe widespread contamination",
        desc: "Using bright flashlight in darkened conditions, inspect: original mattress room, all adjacent rooms, hallways, multiple rooms, HVAC vents throughout house, living areas, bathroom, laundry room. Severe contamination shows shiny fibers in MULTIPLE rooms, hallways, or potentially throughout the house including in HVAC vent openings. Document extensively with photos and video."
      },
      {
        title: "IMMEDIATE: Stop Spread & Evacuate",
        action: "Immediately seal area, turn off HVAC, and evacuate if possible",
        desc: "CRITICAL FIRST STEPS: Turn off entire HVAC at thermostat AND circuit breaker immediately. Turn off all fans. Seal contaminated room doors with plastic and tape. DO NOT let anyone enter contaminated areas. DO NOT use HVAC. Consider temporary relocation for all occupants, especially children and pets, while addressing this."
      },
      {
        title: "Professional Remediation STRONGLY RECOMMENDED",
        action: "Contact certified fiberglass remediation specialists",
        desc: "Severe contamination typically requires professional remediation. This is the SAFEST and most EFFECTIVE option. Get quotes from multiple certified companies with specific fiberglass experience. Ask about their methods, equipment, and guarantee. Document everything for insurance claims. Professional help is strongly urged before attempting DIY."
      },
      {
        title: "Seek Medical Attention for Symptoms",
        action: "Consult healthcare provider for any health concerns",
        desc: "Document all symptoms with photos (rashes, lesions, eye irritation). Keep detailed symptom journal with dates. Seek medical attention for persistent or severe symptoms. Inform doctor about fiberglass exposure. Consider occupational health specialist. Keep all medical records for documentation."
      },
      {
        title: "Report the Incident",
        action: "File official reports with authorities",
        desc: "Report to SaferProducts.gov (https://www.saferproducts.gov/IncidentReporting), Consumer Product Safety Commission, and local health department. Include photos, documentation, mattress details. Keep copies of ALL reports. This helps track the issue and may support claims."
      },
      {
        title: "Contact Insurance Company",
        action: "Notify insurance immediately and document all damage",
        desc: "Contact homeowners/renters insurance immediately. Document ALL damage with extensive photos and videos. Keep receipts for everything (cleaning supplies, replacement items, temporary housing, medical costs). Some policies may cover remediation costs. File claim promptly with full documentation."
      },
      {
        title: "Consider Temporary Relocation",
        action: "Temporary housing may be necessary during remediation",
        desc: "For severe contamination, temporary relocation is strongly recommended for safety, especially with children or health-compromised individuals. Document all relocation costs (hotel, rental, meals, storage) for insurance/legal claims. Do NOT return until professional verification of safety."
      },
      {
        title: "IF DIY UNAVOIDABLE: Read Critical Disclaimer",
        action: "ONLY if professional help impossible - see full warning first",
        desc: "IF you have exhausted all options (financial assistance, insurance, professional services) and must attempt DIY cleanup, you MUST read and acknowledge the full DIY disclaimer. This carries SERIOUS RISKS including making contamination permanently worse, incomplete removal, and HVAC system damage. Click the disclaimer button to review before proceeding."
      },
      {
        title: "DIY: Full PPE - Absolute Requirement",
        action: "Complete protective equipment is NON-NEGOTIABLE",
        desc: "REQUIRED BEFORE PROCEEDING: Disposable Tyvek coveralls (tape wrists/ankles with duct tape), P100 NIOSH-approved respirator (N95 absolute minimum - ensure proper fit/seal test), tight-fitting safety goggles OR full face shield, durable nitrile gloves (double layer recommended), duct tape for sealing gaps. Do NOT proceed without complete PPE."
      },
      {
        title: "DIY: Gather Specialized Equipment",
        action: "Acquire all necessary supplies - do not skimp",
        desc: "ESSENTIAL: HEPA or ULPA vacuum (verify filter properly seated), multiple HEPA bags, wet/dry vacuum with HEPA filter (optional), extensive disposable microfiber cloths, microfiber flat mop system, multiple tack cloths and lint rollers, heavy-duty 3-6 mil plastic bags (many), spray bottles, mild dish soap, 6 mil plastic sheeting (rolls), strong duct tape, permanent markers. HIGHLY RECOMMENDED: HEPA air scrubber rental, negative air machine rental. Running out mid-cleanup is dangerous."
      },
      {
        title: "DIY: Maximum Isolation & Containment",
        action: "Create strict containment zones",
        desc: "Wearing full PPE: Firmly close and seal ALL doors to contaminated areas with plastic sheeting and tape. Cover EVERY air supply and return vent in contaminated areas with plastic and tape. Establish clean staging zone outside contaminated boundary. Use plastic sheeting to create barriers. Plan work to minimize traffic. Consider negative air pressure with exhaust fans if possible."
      },
      {
        title: "DIY: Remove Mattress with Extreme Care",
        action: "Contain and remove source with minimal fiber release",
        desc: "Lightly mist air with water from spray bottle to weigh down airborne fibers. Use zippered mattress encasement OR multiple layers of 6 mil plastic sheeting. Wrap meticulously - EVERY seam sealed with duct tape. Move extremely slowly and carefully on cleared path. Two people recommended. Remove from home immediately. Do not let wrapped mattress touch walls or floors."
      },
      {
        title: "DIY: Empty ALL Rooms Completely",
        action: "Remove every item from contaminated areas for structural cleaning",
        desc: "Systematically bag EVERYTHING from contaminated rooms into labeled, sealed heavy-duty bags. Clothing, bedding, books, decor, electronics, small furniture - everything. Label bags with contents and contamination level. Remove bags to isolated area far from living spaces. RECOMMENDATION: Discard most porous items (clothing, bedding, soft furnishings, complex textiles, upholstered items). Replacement is safer than cleaning for severe cases."
      },
      {
        title: "DIY: Intensive Wet Cleaning - Multiple Rooms",
        action: "Systematic wet cleaning of all structural surfaces",
        desc: "One room at a time. Damp microfiber cloths with mild soapy water. CEILING first, then WALLS (including fixtures - power off lights), then all HARD SURFACES (frames, sills, doors, shelves), then FLOORS with damp flat mop. Change cloths and water very frequently. This is tedious but critical. Capture fibers, don't stir them up. Repeat in each contaminated room."
      },
      {
        title: "DIY: Comprehensive HEPA Vacuuming",
        action: "Thorough HEPA vacuum after wet cleaning in all areas",
        desc: "Move SLOWLY with HEPA vacuum. Ceiling and walls first, then all remaining surfaces, furniture (if any left), then floors with extreme attention to edges, corners, under baseboards. Use attachments. Empty canister/change bag OUTSIDE frequently into sealed bags. Clean vacuum exterior. Repeat process in all contaminated rooms."
      },
      {
        title: "DIY: Detail Clean Everything",
        action: "Meticulous final pickup with tack cloths and lint rollers",
        desc: "Use tack cloths and lint rollers on EVERY surface - corners, edges, crevices, textured areas, baseboards, window tracks, door frames. This step is labor-intensive but essential. Re-inspect with flashlight after detail cleaning."
      },
      {
        title: "DIY: Multiple Complete Cleaning Cycles",
        action: "Repeat full cleaning cycle 3-5+ times minimum",
        desc: "Severe cases require MANY passes. Complete cycle: wet wipe to HEPA vacuum to detail clean. Repeat at least 3-5 times in EACH room. Wait 1-2 days between cycles. Inspect with flashlight between passes under bright light. Continue until visible fibers are dramatically reduced. Expect this to take weeks."
      },
      {
        title: "DIY: Carpet Removal Strongly Recommended",
        action: "Remove and replace all contaminated carpeting",
        desc: "For severe cases, carpet removal and replacement is STRONGLY recommended. Carpets cannot be effectively DIY cleaned of fiberglass. If you must attempt: multiple HEPA vacuuming sessions daily + professional steam cleaning (explicitly mentioning fiberglass) + more HEPA vacuuming. Still unlikely to remove embedded fibers. Removal is safer."
      },
      {
        title: "DIY: Professional HVAC Cleaning Essential",
        action: "HVAC must be professionally cleaned - DIY is insufficient",
        desc: "If HVAC ran during contamination, system is contaminated and has spread fibers everywhere. Professional HVAC cleaning is ESSENTIAL - entire system (all ducts, coils, blower, return vents). Changing filters alone does NOT work. May require duct replacement in severe cases. Keep system OFF until professionally cleaned. Change filters daily once restarted."
      },
      {
        title: "DIY: Extended Air Scrubbing",
        action: "Run HEPA air scrubbers for extended period",
        desc: "After bulk cleaning, place rented HEPA air scrubbers in cleaned rooms. Run continuously for 3-7+ days (severe cases need longer). Change filters per instructions. Open windows with fans exhausting outward when weather permits. Monitor air quality. This helps remove remaining airborne particles but cannot replace professional air quality testing."
      },
      {
        title: "DIY: Careful Evaluation of Bagged Items",
        action: "Process saved items with extreme caution outside",
        desc: "Wearing full PPE, process bagged items outside or isolated garage. Open bags one at a time. Inspect each item meticulously with flashlight in bright light. DISCARD (most recommended): All items with any visible fibers, porous items, complex items, most clothing/bedding. ATTEMPT TO CLEAN (risky): Only hard, non-porous items with no visible fibers - wipe thoroughly multiple times, tack cloth all crevices. Washables - wash separately 3+ times, hot water, inspect after EACH wash. When ANY doubt - DISCARD. Most items should be discarded in severe cases."
      },
      {
        title: "DIY: Seal & Dispose All Contaminated Waste",
        action: "Proper disposal of extensive contaminated materials",
        desc: "All waste (vacuum contents, countless cloths, tack cloths, tape, PPE, discarded items, bags) must be in sealed heavy-duty bags. Label clearly and prominently: 'CONTAMINATED - FIBERGLASS - DO NOT INCINERATE' or similar warning. Check local regulations for hazardous waste disposal. May need special arrangements for volume. Document disposal for records."
      },
      {
        title: "DIY: Rigorous Personal Decontamination",
        action: "Meticulous PPE removal and personal cleaning after EACH session",
        desc: "After EACH work session, decontaminate outside or designated area before entering clean zones. Remove PPE carefully in sequence: coveralls (roll inside out), gloves (inside out), eye protection, respirator last. Avoid all shaking. Bag ALL disposable items immediately. Remove contaminated clothing underneath (if worn) - wash separately multiple times or discard. Take cool shower immediately - rinse without scrubbing first, then wash gently, thorough hair wash. This is required after EVERY cleanup session."
      },
      {
        title: "DIY: Ongoing Monitoring & Re-cleaning",
        action: "Continue monitoring and be prepared for repeated efforts",
        desc: "After initial intensive cleaning: Monitor constantly with flashlight inspections. Continue regular HEPA vacuuming (daily initially, then weekly). Damp dust surfaces frequently. Re-clean areas showing any fiber reappearance. Change HVAC filters very frequently (weekly initially). Keep detailed notes. Expect to find recurring fibers - severe contamination is extremely difficult to fully resolve DIY."
      },
      {
        title: "Professional Air Quality Testing Required",
        action: "Have area professionally tested before considering it safe",
        desc: "DO NOT assume area is safe based on DIY efforts alone. Professional air quality testing is ESSENTIAL before returning to full occupancy, especially with severe contamination. Testing can confirm (or disprove) successful remediation. If fibers remain at unsafe levels, further professional remediation will be necessary. Do not skip this critical verification step."
      }
    ]
  }
};
