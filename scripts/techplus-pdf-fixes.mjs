/**
 * Shared PDF/OCR cleanup for Tech+ study-guide Markdown and HTML.
 */

/**
 * @param {string} text
 * @param {{ html?: boolean }} [opts]
 * @returns {string}
 */
export function applyTechPlusReadabilityFixes(text, opts = {}) {
  /** Curly apostrophe → ASCII (consistent copy; simplifies contraction fixes below) */
  let t = String(text).replace(/\u2019/g, "'");

  /** Split words / OCR (run early) */
  t = t.replace(/\bT\s*\r?\n\s*oday\b/g, "Today");
  t = t.replace(/\bsuc\s*\r?\n\s*h as\b/gi, "such as");
  t = t.replace(/\bmore than 100\s*\r?\n\s*years\b/gi, "more than 100 years");
  t = t.replace(/\bport number s\b/gi, "port numbers");
  t = t.replace(/\bconsumerlevel\b/gi, "consumer-level");
  t = t.replace(/peripheralconnection/gi, "peripheral connection");
  t = t.replace(/\bWindows\s+1\s+1\b/g, "Windows 11");
  t = t.replace(/\bc\s+hoose\b/gi, "choose");
  t = t.replace(/\bL ock\b/g, "Lock");
  t = t.replace(/7\.1-\s*c\s*\r?\n\s*hannel/gi, "7.1-channel");
  t = t.replace(/5\.1-\s*c\s*\r?\n\s*hannel/gi, "5.1-channel");
  t = t.replace(/\brightclicking\b/gi, "right-clicking");
  t = t.replace(/\brightclicked\b/gi, "right-clicked");
  t = t.replace(/\brightclick\b/gi, "right-click");
  t = t.replace(/\bdoubleclicking\b/gi, "double-clicking");
  t = t.replace(/\bdoubleclick\b/gi, "double-click");
  t = t.replace(/\bleftclicking\b/gi, "left-clicking");
  t = t.replace(/\bleftclick\b/gi, "left-click");
  t = t.replace(/\bControlclick\b/g, "Control-click");
  t = t.replace(/\bc\s+hoosing\b/gi, "choosing");
  t = t.replace(/\bleftand\b/gi, "left and");
  t = t.replace(/\bleftor\b/gi, "left or");
  t = t.replace(/\bNon-\s+expandable\b/gi, "Non-expandable");
  t = t.replace(/USB-\s+A\b/gi, "USB-A");
  t = t.replace(/\bnon-\s+volatile\b/gi, "non-volatile");
  t = t.replace(/\bNon-\s+volatile\b/g, "Non-volatile");
  t = t.replace(/\bReadonly memory \(R\s*\r?\n\s*OM\)/gi, "Read-only memory (ROM)");
  t = t.replace(/\bReadonly memory\b/gi, "Read-only memory");
  t = t.replace(/\bSolidstate\b/gi, "Solid-state");

  const html = !!opts.html;

  /** CompTIA exam code: stray space in FC0-U71 */
  t = t.replace(/\bFC0-\s+U71\b/g, "FC0-U71");

  /** PDF split chapter number in cross-references */
  t = t.replace(/\bChapter\s+1\s+1\b/g, "Chapter 11");

  /** “base- 2”, “base- 10” (PDF space after hyphen) */
  t = t.replace(/\bbase-\s+(\d+)\b/gi, "base-$1");

  /** Contractions split across lines */
  t = t.replace(/([A-Za-z]+)'\s*\r?\n\s*(t|s|re|ve|ll|d)\b/g, "$1'$2");
  t = t.replace(
    /\b(isn|doesn|won|don|can|couldn|wouldn|shouldn|wasn|weren|haven|hasn|hadn|aren|didn)\s*'\s*\r?\n\s*t\b/gi,
    "$1't"
  );

  /** Multiline word splits (PDF columns / bad reflow) */
  t = t.replace(/\binf\s*\r?\n\s*ormation\b/gi, "information");
  t = t.replace(/\bfr\s*\r?\n\s*ameworks\b/gi, "frameworks");
  t = t.replace(/\bmoti\s*\r?\n\s*vated\b/gi, "motivated");
  t = t.replace(/\bg\s*\r?\n\s*ain the\b/gi, "gain the");
  t = t.replace(/\bmak\s*\r?\n\s*e their\b/gi, "make their");
  t = t.replace(/\bY\s*\r?\n\s*ou know\b/g, "You know");
  t = t.replace(/\bco-\s*workers\b/gi, "co-workers");
  t = t.replace(/\buser-\s*\r?\n\s*name\?/gi, "username?");
  t = t.replace(/\bWi-Fi\s+s\s*\r?\n\s*tandards\b/gi, "Wi-Fi standards");
  t = t.replace(/\bvirtual\s+pri\s*\r?\n\s*vate\b/gi, "virtual private");
  t = t.replace(/\bInter-\s*\r?\n\s*net\b/gi, "Internet");
  t = t.replace(/\bswitc\s*\r?\n\s*h cost\b/gi, "switch cost");
  t = t.replace(/\bT\s*\r?\n\s*ransmission rate\b/gi, "Transmission rate");
  t = t.replace(/\ban inherent flaw\s*\r?\n\s*,/g, "an inherent flaw,");
  t = t.replace(/\bIn this chapter\s*\r?\n\s*,/g, "In this chapter,");

  /** Space before apostrophe */
  t = t.replace(/\b(isn|doesn|won|don|can|couldn|wouldn|shouldn|wasn|weren|haven|hasn|hadn|aren|didn)\s+'\s*t\b/gi, "$1't");
  t = t.replace(/\b(it|that|there|here|what|let)\s+'\s*s\b/gi, "$1's");
  t = t.replace(/\b(they|you|we|who)\s+'\s*re\b/gi, "$1're");

  /** Space inside contraction */
  t = t.replace(/\bit'\s+s\b/gi, "it's");
  t = t.replace(/\bdon'\s+t\b/gi, "don't");
  t = t.replace(/\bdoesn'\s+t\b/gi, "doesn't");
  t = t.replace(/\bisn'\s+t\b/gi, "isn't");
  t = t.replace(/\bwasn'\s+t\b/gi, "wasn't");
  t = t.replace(/\bweren'\s+t\b/gi, "weren't");
  t = t.replace(/\bhaven'\s+t\b/gi, "haven't");
  t = t.replace(/\bhasn'\s+t\b/gi, "hasn't");
  t = t.replace(/\bhadn'\s+t\b/gi, "hadn't");
  t = t.replace(/\bwon'\s+t\b/gi, "won't");
  t = t.replace(/\bwouldn'\s+t\b/gi, "wouldn't");
  t = t.replace(/\bcouldn'\s+t\b/gi, "couldn't");
  t = t.replace(/\bshouldn'\s+t\b/gi, "shouldn't");
  t = t.replace(/\bcan'\s+t\b/gi, "can't");
  t = t.replace(/\bdidn'\s+t\b/gi, "didn't");
  t = t.replace(/\baren'\s+t\b/gi, "aren't");
  t = t.replace(/\bisn '\s*t\b/gi, "isn't");
  t = t.replace(/\bthere'\s+s\b/gi, "there's");
  t = t.replace(/\bthat'\s+s\b/gi, "that's");
  t = t.replace(/\bhere'\s+s\b/gi, "here's");
  t = t.replace(/\bIt'\s+s\b/g, "It's");
  t = t.replace(/\bThat'\s+s\b/g, "That's");
  t = t.replace(/\bWhat'\s+s\b/g, "What's");
  t = t.replace(/\bHere'\s+s\b/g, "Here's");
  t = t.replace(/\bThere'\s+s\b/g, "There's");
  t = t.replace(/\bLet'\s+s\b/g, "Let's");
  t = t.replace(/\bDon'\s+t\b/g, "Don't");
  /** Possessive / “it’s” style: word + apostrophe + space + s */
  t = t.replace(/\b([A-Za-z]{4,})'\s+s\b/g, "$1's");
  t = t.replace(/\b(it|she|he|who)'\s+s\b/gi, "$1's");

  /** Explicit hyphen / OCR splits (run before generic fixes) */
  const pairs = [
    [/impor\s*-\s*tant/gi, "important"],
    [/processorto-\s*memory/gi, "processor-to-memory"],
    [/Net\s+-\s*working/gi, "Networking"],
    [/touc hpad/gi, "touchpad"],
    [/rac k-mounted/gi, "rack-mounted"],
    [/e-\s*re\s*aders/gi, "e-readers"],
    [/alw ays/gi, "always"],
    [/singlepurpose/gi, "single-purpose"],
    [/standardlooking/gi, "standard-looking"],
    [/Bluetoothenabled/gi, "Bluetooth-enabled"],
    [/Pla y Store/gi, "Play Store"],
    [/do cumentation/gi, "documentation"],
    [/as sembly/gi, "assembly"],
    [/Set tings/gi, "Settings"],
    [/fieldreplaceable/gi, "field-replaceable"],
    [/Computing Devicesand/gi, "Computing Devices and"],
    [/pur\s+poses/gi, "purposes"],
    [/non-\s*vo\s+latile/gi, "non-volatile"],
    [/long-\s*te\s+rm/gi, "long-term"],
    [/short-\s*te\s+rm/gi, "short-term"],
    [/solid-\s*st\s+ate/gi, "solid-state"],
    [/heatmitigation/gi, "heat mitigation"],
    [/powerand/gi, "power and"],
    [/MotherboardsThe/gi, "Motherboards. The"],
    [/Motherboardsare/gi, "Motherboards are"],
    [/MemoryThese/gi, "Memory. These"],
    [/beginyour/gi, "begin your"],
    [/inyour/gi, "in your"],
    [/all theother/gi, "all the other"],
    [/thispiece/gi, "this piece"],
    [/ofthese/gi, "of these"],
    [/smallform/gi, "small form"],
    [/most commonform/gi, "most common form"],
    [/knowwhat/gi, "know what"],
    [/casesoften/gi, "cases often"],
    [/industry-\s*st\s+andard/gi, "industry-standard"],
    [/Baby-\s*A\s*T\b/gi, "Baby-AT"],
    [/Mini-\s*ITX\s+2\s+001/gi, "Mini-ITX 2001"],
    [/intothe/gi, "into the"],
    [/Ifyou\b/gi, "If you"],
    [/itcan\b/gi, "it can"],
    [/withone\b/gi, "with one"],
    [/wheelisused/gi, "wheel is used"],
    [/carduse\b/gi, "card use"],
    [/subobjec\s*-\s*tive/gi, "subobjective"],
    [/third-\s*party/gi, "third-party"],
    [/byIBM/gi, "by IBM"],
    [/it\s+can make your/gi, "it can make your"],
    [/USB-\s*C\b/gi, "USB-C"],
    [/Wi-\s*Fi\b/gi, "Wi-Fi"],
    [/A\s+C\s+power/gi, "AC power"],
    [/inser\s+tion/gi, "insertion"],
    [/Point\s+stic\s+k/gi, "Point stick"],
    [/stic\s+k\b/gi, "stick"],
    [/Por\s+trait/gi, "Portrait"],
    [/P\s+asscode/gi, "Passcode"],
    [/loc\s+k\b/gi, "lock"],
    [/set\s+tings/gi, "settings"],
    [/Self-\s*Service\b/g, "Self-Service"],
    [/dotted-\s*decimal/gi, "dotted-decimal"],
    [/antispam/gi, "anti-spam"],
    [/Bluetoothen\s*abled/gi, "Bluetooth-enabled"],
    [/longand\b/gi, "long and"],
    [/poweredoff\b/gi, "powered off"],
    [/\bandARM\b/g, "and ARM"],
    [/\bcanmake\b/gi, "can make"],
    [/\bconnectsall\b/gi, "connects all"],
    [/\bhowto\b/gi, "how to"],
    [/\bPCIeEach\b/g, "PCIe. Each"],
    [/Wi-Fi\s*7\s*What/gi, "Wi-Fi 7. What"],
    [/Other Connectors Trying\b/g, "Other Connectors. Trying"],
    [/lineof\s*-\s*s\s*ight/gi, "line-of-sight"],
    [/binaryto\s*-\s*de\s*cimal/gi, "binary-to-decimal"],
    [/Conver ting/gi, "Converting"],
    [/non-\s+critical\b/gi, "non-critical"],
    [/Datadriven/gi, "Data-driven"],
    [/non-\s+repudiation/gi, "non-repudiation"],
    [/\bSingle signon\b/gi, "Single sign-on"],
    [/T wisted-?pair/gi, "Twisted-pair"],
    [/Fiber\s+-\s*optic/gi, "Fiber-optic"],
    [/Encrypting Data in T ransit/gi, "Encrypting Data in Transit"],
    [/\bup-\s+andup\b/gi, "up-and-up"],
    [/self-\s+reported/gi, "self-reported"],
    [/Cat 8:\s*\$\s*1\s*\r?\n\s*0–/g, "Cat 8: $10–"],
    [/10 Gbps:\s*\$\s*200–\s*\$\s*80\s*\r?\n\s*0\s*\r?\n/g, "10 Gbps: $200–$800\n"],
    [/pointtomultipoint/gi, "point-to-multipoint"],
    [/thirdgeneration/gi, "third-generation"],
    [/cellularenabled/gi, "cellular-enabled"],
    [/softwarebased/gi, "software-based"],
    [/Realworld/gi, "Real-world"],
    [/doublecheck/gi, "double-check"],
    [/devicelevel/gi, "device-level"],
    [/filelevel/gi, "file-level"],
    [/fall bac\s*\r?\n\s*k\b/gi, "fall back"],
    [/\b5 meter\s*\r?\n\s*s\b/gi, "5 meters"],
    [/\babout 1\s*\r?\n\s*5 meters\b/gi, "about 15 meters"],
    [/\b802\.1\s+1\b/gi, "802.11"],
    [/\b1\s+1 Mbps\b/g, "11 Mbps"],
    [/\bY ear\b/g, "Year"],
    [/up-\s+to-\s*date/gi, "up-to-date"],
    [/\bzeroday\b/gi, "zero-day"],
    [/\bonetoone\b/gi, "one-to-one"],
    [/\bWebbrowsing\b/gi, "Web browsing"],
    [/\bA SCII\b/g, "ASCII"],
    [/UTF-\s+(\d+)\b/gi, "UTF-$1"],
    [/\bsemi-\s*\r?\n\s*colon\b/gi, "semicolon"],
    [/\bvul-\s*\r?\n\s*nerability\b/gi, "vulnerability"],
    [/\bo\s*\r?\n\s*ther words\b/gi, "other words"],
    [/\bla\s*\r?\n\s*nguages\b/gi, "languages"],
    [/\bdo\s*\r?\n\s*cumentation\b/gi, "documentation"],
    [/\bth\s*\r?\n\s*at is\b/gi, "that is"],
    [/\bweb browser\s*\r?\n\s*features\b/gi, "web browser features"],
    [/\bhigh-\s*\r?\n\s*speed\b/gi, "high-speed"],
    [/\bsp\s*\r?\n\s*eed\b/gi, "speed"],
    [/&#1\s+10;/g, "&#110;"],
    /** Mid-line hyphen breaks (PDF columns) — merge to one line */
    [/inter-\s*\r?\n\s*changeable/gi, "interchangeable"],
    [/high-\s*\r?\n\s*voltage/gi, "high-voltage"],
    [/micro-\s*\r?\n\s*phone/gi, "microphone"],
    [/inter-\s*\r?\n\s*fere/gi, "interfere"],
    [/high-\s*\r?\n\s*definition/gi, "high-definition"],
    [/IP-\s*\r?\n\s*based/gi, "IP-based"],
    [/single-\s*\r?\n\s*purpose/gi, "single-purpose"],
    [/under-\s*\r?\n\s*stand/gi, "understand"],
    [/Non-\s*\r?\n\s*players/gi, "Non-players"],
    [/short-\s*\r?\n\s*ened/gi, "shortened"],
    [/inter-\s*\r?\n\s*face/gi, "interface"],
    [/\(W\s*\r?\n\s*in-\s*\r?\n\s*dows\)/gi, "(Windows)"],
    [/high-\s*\r?\n\s*lighting/gi, "highlighting"],
    [/Micro-\s*\r?\n\s*soft/gi, "Microsoft"],
    [/pre-\s*\r?\n\s*sented/gi, "presented"],
    [/post-\s*\r?\n\s*pone/gi, "postpone"],
    [/vid-\s*\r?\n\s*eoconferencing/gi, "videoconferencing"],
    [/Anti-\s*\r?\n\s*malware/gi, "Anti-malware"],
    [/anti-\s*\r?\n\s*malware/gi, "anti-malware"],
    [/high-\s*\r?\n\s*contrast/gi, "high-contrast"],
    [/inter-\s*\r?\n\s*preted/gi, "interpreted"],
    [/inter-\s*\r?\n\s*preter/gi, "interpreter"],
    [/pre-\s*\r?\n\s*defined/gi, "predefined"],
    [/high-\s*\r?\n\s*level/gi, "high-level"],
    [/non-\s*\r?\n\s*structured/gi, "non-structured"],
    [/sub-\s*\r?\n\s*net/gi, "subnet"],
    [/inter-\s*\r?\n\s*esting/gi, "interesting"],
    [/AI-\s*\r?\n\s*generated/gi, "AI-generated"],
    [/on-\s*\r?\n\s*path/gi, "on-path"],
    [/short-\s*\r?\n\s*age/gi, "shortage"],
    [/multi-\s*\r?\n\s*factor/gi, "multi-factor"],
    [/inter-\s*\r?\n\s*vals/gi, "intervals"],
    [/pre-\s*\r?\n\s*ventive/gi, "preventive"],
    [/pre-\s*\r?\n\s*viously/gi, "previously"],
    [/full-\s*\r?\n\s*time/gi, "full-time"],
    [/Adw\s*\r?\n\s*are/gi, "Adware"],
    [/Spyw\s*\r?\n\s*are/gi, "Spyware"],
    [/\bdri\s+ve\b/gi, "drive"],
    [/\bdri\s+ver/gi, "driver"],
    [/\bdri\s+ves/gi, "drives"],
    [/\bY\s*\r?\n\s*ou\b/g, "You"],
  ];
  for (const [re, to] of pairs) t = t.replace(re, to);

  /** Common "word- rest" line breaks in PDF (safe merges) */
  t = t.replace(/\b([a-z]{3,})-\s+\n\s*([a-z]{2,12})\b/gim, "$1$2");
  t = t.replace(/\b([a-z]{3,})-\s+([a-z]{2,12})\b/gi, (full, a, b) => {
    const keep = /^(end|multi|single|dual|non|pre|re|co|sub|inter|intra|pseudo|semi|anti|counter|post|mini|micro|macro|full|half|long|short|high|low|cross|well|over|under|self|user|cross)$/i;
    if (keep.test(a)) return full;
    return a + b;
  });

  /** Space before punctuation */
  t = t.replace(/ +([,.;:!?])/g, "$1");

  if (html) {
    t = t.replace(/don&#39;\s+t/gi, "don&#39;t");
    t = t.replace(/it&#39;\s+s/gi, "it&#39;s");
    t = t.replace(/\b(isn|doesn|won|don|can|couldn|wouldn|shouldn|wasn|weren|haven|hasn|hadn|aren|didn)&#39;\s+t/gi, "$1&#39;t");
    t = t.replace(/\b(it|that|there|here|what)&#39;\s+s/gi, "$1&#39;s");
    t = t.replace(/\b([A-Za-z]{4,})&#39;\s+s\b/g, "$1&#39;s");
  }

  return t;
}

/**
 * PDF intro: split chapter title + "THE FOLLOWING…CHAPTER:" banner → real Markdown headings.
 */
export function promoteTechplusChapterIntroBanner(md) {
  /** `---` is never at file start (comes after `# Lesson` + `Source:`). */
  return md.replace(
    /(^Source:[^\n]+\n\n)---\s*\n([\s\S]*?)(?=\n\s*[✓✔]\s*[\d.]+)/m,
    (full, pre, block) => {
      const trimmed = block.trim();
      if (!/\bTHE FOLLOWING COMPTIA\b[\s\S]*\bCHAPTER:\s*$/i.test(trimmed)) return full;
      const m2 = block.match(/^([\s\S]*?)\n(THE FOLLOWING COMPTIA[\s\S]*CHAPTER:)\s*$/i);
      if (!m2) return full;
      const titleJoined = m2[1].replace(/\s+/g, " ").trim();
      const bannerJoined = m2[2].replace(/\s+/g, " ").trim();
      return `${pre}---\n\n## ${titleJoined}\n\n**${bannerJoined}**`;
    }
  );
}

/**
 * After objectives lists, PDF often has "Chapter" + page/chapter number on its own lines (noise).
 */
export function stripOrphanChapterNumberAfterObjectives(md) {
  return md.replace(/\nChapter\s*\n\s*\d{1,2}\s*\n+/g, "\n\n");
}
