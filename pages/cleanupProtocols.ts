export interface ProtocolStep {
  title: string;
  action: string;
  desc: string;
}

export interface LevelProtocol {
  title: string;
  label: string;
  color: string;
  showDIYDisclaimer: boolean;
  steps: ProtocolStep[];
}

export const CLEANUP_PROTOCOLS: Record<string, LevelProtocol> = {
  mild: {
    title: "Mild Contamination Cleanup",
    label: "Mild Protocol",
    color: "#10b981",
    showDIYDisclaimer: false,
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
    title: "Moderate Contamination Cleanup",
    label: "Moderate Protocol",
    color: "#f59e0b",
    showDIYDisclaimer: false,
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
    title: "Severe Contamination Cleanup",
    label: "Severe Protocol",
    color: "#ef4444",
    showDIYDisclaimer: true,
    steps: [
      {
        title: "Professional remediation STRONGLY RECOMMENDED",
        action: "Severe Contamination Assessment",
        desc: "Severe contamination indicates widespread fiberglass dispersal throughout the living environment, including airborne fibers, embedded fibers in porous materials, and cross-contamination across multiple rooms or levels of the home. This level of contamination presents serious health risks and cannot be safely addressed through standard household cleaning methods.\n\nIndicators of severe contamination include, but are not limited to:\n\n* Visible fiberglass particles on multiple surfaces\n* Persistent skin, eye, or respiratory irritation\n* Fibers embedded in carpets, furniture, clothing, and bedding\n* HVAC system contamination\n* Recontamination occurring after cleaning attempts\n\nOnce contamination reaches this stage, continued occupancy of the space without remediation may worsen exposure and health outcomes."
      },
      {
        title: "⚠️ DIY DISCLAIMER – READ CAREFULLY",
        action: "Emergency Reference Only",
        desc: "The following information is provided for educational and emergency reference purposes only.\n\n**DIY cleanup is NOT recommended for severe fiberglass contamination.**\nImproper handling can significantly increase airborne fiber release, resulting in further contamination and increased health risks.\n\nAttempting DIY remediation at this stage may:\n\n* Permanently embed fibers deeper into materials\n* Spread contamination to previously unaffected areas\n* Increase inhalation and dermal exposure\n* Compromise long-term habitability of the home\n\nIf professional remediation is unavailable or delayed, the steps below should be considered **temporary harm-reduction measures only**, not full remediation."
      },
      {
        title: "⚠️ MINIMUM SAFETY REQUIREMENTS (IF DIY IS ATTEMPTED)",
        action: "Mandatory PPE",
        desc: "If a homeowner proceeds despite warnings, the minimum protective measures include:\n\n* Full-face or half-face respirator with **P100 filters**\n* Disposable Tyvek-style protective suit\n* Nitrile gloves (double-layered)\n* Eye protection if not using full-face respirator\n* Shoe covers or disposable footwear\n\nAll protective gear must be **discarded after use** and should never be reused indoors."
      },
      {
        title: "⚠️ PROHIBITED ACTIONS",
        action: "Prohibited Actions List",
        desc: "Under no circumstances should the following be performed in a severely contaminated environment:\n\n* Vacuuming with standard or non-sealed vacuums\n* Dry sweeping, dusting, or shaking fabrics\n* Using box fans, air movers, or HVAC systems\n* Washing contaminated items in household machines\n* Removing mattress covers or cutting fabric\n\nThese actions dramatically increase airborne fiber spread."
      },
      {
        title: "⚠️ TEMPORARY CONTAINMENT MEASURES ONLY",
        action: "Containment Steps",
        desc: "If immediate containment is necessary:\n\n* Seal off affected rooms with plastic sheeting\n* Shut down HVAC systems servicing contaminated areas\n* Use HEPA-rated air scrubbers **only if professionally designed for fiberglass**\n* Isolate and bag visibly contaminated porous items\n\nBagged items should be sealed, labeled, and stored away from living areas until professional guidance is obtained."
      },
      {
        title: "⚠️ DISPOSAL WARNING",
        action: "Disposal Requirements",
        desc: "Many contaminated items cannot be safely salvaged. Disposal requirements may vary by jurisdiction and may require:\n\n* Specialized waste handling\n* Sealed transport\n* Notification to waste facilities\n\nImproper disposal may expose sanitation workers and others to fiberglass hazards."
      },
      {
        title: "⚠️ HEALTH MONITORING ADVISED",
        action: "Health Symptoms",
        desc: "Anyone exposed during severe contamination cleanup should monitor for:\n\n* Persistent skin irritation\n* Respiratory symptoms\n* Eye inflammation\n* Worsening allergic or asthma-like reactions\n\nMedical or veterinary evaluation should be sought if symptoms persist or escalate."
      },
      {
        title: "⚠️ FINAL WARNING",
        action: "Structural Hazard Notice",
        desc: "Severe fiberglass contamination is a structural environmental hazard, not a routine cleaning issue.\n\nProfessional remediation is the **only reliable method** to ensure safety, prevent recontamination, and protect long-term health."
      }
    ]
  }
};
