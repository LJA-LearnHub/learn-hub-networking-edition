/**
 * Post-pass for Tech+ segment HTML: PDF/OCR spacing, truncated figure refs, and a few
 * structural fixes so content reads cleanly and does not inject raw tags into the host page.
 */
export function polishTechplusHtml(html) {
  let h = String(html);

  // UTF-8 text sometimes saved as Latin-1 → mojibake in HTML output
  h = h.replace(/ΓÇö/g, "\u2014");
  h = h.replace(/Γ₧ó/g, "\u27a2");

  const subs = [
    // Exercise 6.2: duplicate run-in title (persists after first polish when ex62 no longer matches raw &lt;body&gt;)
    ["<p>Exercise 6.2.</p>\n<p>EXERCISE 6.2</p>", "<p>EXERCISE 6.2</p>"],
    // Large structural fixes first (patterns also targeted by later global OCR subs)
    // Exercise 2.3: merged list + PDF footer + accidental “Mouse” chapter text
    [
      `<p>EXERCISE 2.3</p>\n<p>Changing Your Keyboard Layout in Windows 11</p>\n<ol>\n<li>Open the Language &amp; Region settings app by typing language into the Windows</li>\n</ol>\n<p>search box. Click Language Settings. You will get a screen similar to the one shown in</p>\n<p>Understanding Input, Output, and Power Devices 105</p>\n<ol start="2">\n<li>This computer has English installed. Click the more options button (it&#39;s the three dots in a</li>\n</ol>\n<p>horizontal line) to the right of English (United States) and then click Language Options. Ifyou scroll down, you will see the Keyboards section, 3. Click Add A Keyboard, and from the list choose United States- Dvorak. That will add Dvorak to your list of keyboards</p>\n<ol start="4">\n<li>In the system tray (just to the left of the clock in your taskbar, by default in the lowerright corner of your screen) you should now see an option that says ENG US. Click it.</li>\n<li>In the window that appears, choose the option that says United States- Dvorak. Now</li>\n</ol>\n<p>your k eyboard is set to use the Dvorak layout. Good luck!</p>\n<ol start="6">\n<li>To change it back, click ENG DV in the system tray and then choose ENG US. You can</li>\n</ol>\n<p>also change input options by pressing the Windows key and the spacebar. Pointing Devices Pointing devices are so named because they allow you to move your cursor around the screenand point at what you want; they&#39;re a convenient handheld tool that lets you easily navigate on- screen. Pointing devices have been in use since the beginning of humankind, if you include the index finger.</p>\n<p>They&#39;ve pretty much been available for computers as long as computers have</p>\n<p>existed. For example, the trackball was developed in 1946 to replace the joystick as aninput device for an early electronic radar- plotting system. The mouse came along in the 1960s, but it didn&#39;t gain much popularity until Apple came out with the Macintosh 128K in</p>\n<ol start="1984">\n<li>You might think that a mouse or another pointing device is basically required for</li>\n</ol>\n<p>today&#39;s PCs, but it&#39;s not.</p>\n<p>When</p>\n<p>I teach classes for computer technicians, one of the activities I like to have them do is disconnect their mouse and then navigate through Windows with just their keyboard. It can be difficult to get used to, but it&#39;s a helpful skill if you find yourself stuck with a broken mouse at some point. Mice are the most popular pointing device you&#39;ll see today, although touchpads are a close second.</p>\n<p>I&#39;ll cover them both next.</p></div>`,
      `<p>EXERCISE 2.3</p>\n<p>Changing Your Keyboard Layout in Windows 11</p>\n<ol>\n<li>Open the Language &amp; Region settings app by typing language into the Windows search box. Click Language Settings. You will get a screen similar to the one shown in the figure.</li>\n<li>This computer has English installed. Click the more options button (it&#39;s the three dots in a horizontal line) to the right of English (United States) and then click Language Options. If you scroll down, you will see the Keyboards section.</li>\n<li>Click Add A Keyboard, and from the list choose United States- Dvorak. That will add Dvorak to your list of keyboards.</li>\n<li>In the system tray (just to the left of the clock in your taskbar, by default in the lower-right corner of your screen) you should now see an option that says ENG US. Click it.</li>\n<li>In the window that appears, choose the option that says United States- Dvorak. Now your keyboard is set to use the Dvorak layout. Good luck!</li>\n<li>To change it back, click ENG DV in the system tray and then choose ENG US. You can also change input options by pressing the Windows key and the spacebar.</li>\n</ol></div>`,
    ],
    // Exercise 7.1: broken ordered list splits
    [
      `<p>EXERCISE 7.1</p>\n<p>Creating a Database and Tables in Microsoft Access</p>\n<ol>\n<li>Open Microsoft Access. In the Windows search box, type Access and press Enter. You</li>\n</ol>\n<ol start="2">\n<li>Click Blank Database. In the Blank Database pop- up window, specify the filename, suc h</li>\n</ol>\n<p>as MyDatabase, and then click Create. A new database will appear, like the one shown in</p>\n\n<ol start="3">\n<li>The first column in the database is labeled ID. Right- click the field cell, and choose</li>\n</ol>\n<p>Rename Field. Name it Student_ID. You can also rename the field by double- clicking it and entering a new name.</p></div>`,
      `<p>EXERCISE 7.1</p>\n<p>Creating a Database and Tables in Microsoft Access</p>\n<ol>\n<li>Open Microsoft Access. In the Windows search box, type Access and press Enter.</li>\n<li>Click Blank Database. In the Blank Database pop-up window, specify the filename, such as MyDatabase, and then click Create. A new database will appear, like the one shown in the figure.</li>\n<li>The first column in the database is labeled ID. Right-click the field cell, and choose Rename Field. Name it Student_ID. You can also rename the field by double-clicking it and entering a new name.</li>\n</ol></div>`,
    ],
    // Exercise 7.1 (continued): broken list, empty &lt;p&gt;, PDF footer; keep following “Importing” prose (legacy chunk)
    [
      `<p>EXERCISE 7.1 (continued)</p>\n\n<p>Understanding Databases 405</p>\n<ol start="4">\n<li>Add a new field by clicking the Click To Add field to the right of Student_ID. A popup menu will ask you to choose the data type, suc h as short text, number, or yes/no. Click</li>\n</ol>\n<p>Short Text. Access automatically names the field Field1. Change the name to Last_Name.</p>\n<ol start="5">\n<li>Create a new table by choosing Create ➢ Table. You will now see two tables in the leftside navigation and two tabs for tables, lik</li>\n</ol>\n<p </p>\n<ol start="6">\n<li>To navigate between tables, click the tab for the table that you want to see. Otherwise,</li>\n</ol>\n<p>double- click the table name in the lef t pane. Right- click Table1 in the left pane and click Rename. What happens?</p>\n<ol start="7">\n<li>In the top navigation, right- click Table1 and choose Close.</li>\n<li>In the left navigation, right- click Table1 and choose Rename. Rename the table to</li>\n</ol>\n<p>Students. Importing and Inputting Data A blank database isn&#39;t the most useful creation. Once you&#39;ve created a database, the next step is to either import or input data. Inputting data manually isn&#39;t difficult— it&#39;s basically done the same way as entering data into a spreadsheet. Click the cell, enter the value, and move on. One difference is that some fields may be constrained to certain types.</p>\n<p>For example, if you set a field type as a numberand then try to enter letters into a record for that field, the DBMS won&#39;t accept it.</p>\n\n<p>Importing data from an existing source can save a lot of time compared to manually entering it. Many DBMSs let you import data from a command line using the LOAD DATA INFILE command.</p>\n<p>Here&#39;s an example: LOAD DATA INFILE &#39;sample.csv&#39; INTO TABLE Students FIELDS TERMINATED BY &#39;,&#39;; This command loads data from the sample.csv file into the Students table, and it lets the DBMS know that fields in the file are separated by commas. Importing data using a DBMSs GUI is much easier, though. Exercise 7.2 shows you how to import data from Excel into Access.</p></div>`,
      `<p>EXERCISE 7.1 (continued)</p>\n<ol start="4">\n<li>Add a new field by clicking the Click To Add field to the right of Student_ID. A pop-up menu will ask you to choose the data type, such as short text, number, or yes/no. Click Short Text. Access automatically names the field Field1. Change the name to Last_Name.</li>\n<li>Create a new table by choosing Create ➢ Table. You will now see two tables in the left-side navigation and two tabs for tables, like those shown in the figure.</li>\n<li>To navigate between tables, click the tab for the table that you want to see. Otherwise, double-click the table name in the left pane. Right-click Table1 in the left pane and click Rename. What happens?</li>\n<li>In the top navigation, right-click Table1 and choose Close.</li>\n<li>In the left navigation, right-click Table1 and choose Rename. Rename the table to Students.</li>\n</ol>\n<h3>Importing and Inputting Data</h3>\n<p>A blank database isn&#39;t the most useful creation. Once you&#39;ve created a database, the next step is to either import or input data. Inputting data manually isn&#39;t difficult—it&#39;s basically done the same way as entering data into a spreadsheet. Click the cell, enter the value, and move on. One difference is that some fields may be constrained to certain types.</p>\n<p>For example, if you set a field type as a number and then try to enter letters into a record for that field, the DBMS won&#39;t accept it.</p>\n<p>Importing data from an existing source can save a lot of time compared to manually entering it. Many DBMSs let you import data from a command line using the LOAD DATA INFILE command.</p>\n<p>Here&#39;s an example: LOAD DATA INFILE &#39;sample.csv&#39; INTO TABLE Students FIELDS TERMINATED BY &#39;,&#39;; This command loads data from the sample.csv file into the Students table, and it lets the DBMS know that fields in the file are separated by commas. Importing data using a DBMS GUI is much easier, though. Exercise 7.2 shows you how to import data from Excel into Access.</p></div>`,
    ],
    // Exercise 7.1 (continued): Markdown chunk with “pop-” line break + &lt;p &gt;&lt;/p&gt; (tech-sg-07-08)
    [
      `<p>EXERCISE 7.1 (continued)</p>\n\n<ol start="4">\n<li>Add a new field by clicking the Click To Add field to the right of Student_ID. A pop-</li>\n</ol>\n<p>up menu will ask you to choose the data type, such as short text, number, or yes/no. Click Short Text. Access automatically names the field Field1. Change the name to Last_Name.</p>\n<ol start="5">\n<li>Create a new table by choosing Create ➢ Table. You will now see two tables in the left-side navigation and two tabs for tables, lik</li>\n</ol>\n<p </p>\n<ol start="6">\n<li>To navigate between tables, click the tab for the table that you want to see. Otherwise,</li>\n</ol>\n<p>double- click the table name in the left pane. Right- click Table1 in the left pane and click Rename. What happens?</p>\n<ol start="7">\n<li>In the top navigation, right- click Table1 and choose Close.</li>\n<li>In the left navigation, right- click Table1 and choose Rename. Rename the table to</li>\n</ol>\n<p>Students. Importing and Inputting Data A blank database isn&#39;t the most useful creation. Once you&#39;ve created a database, the next step is to either import or input data. Inputting data manually isn&#39;t difficult— it&#39;s basically done the same way as entering data into a spreadsheet. Click the cell, enter the value, and move on. One difference is that some fields may be constrained to certain types.</p>\n<p>For example, if you set a field type as a number and then try to enter letters into a record for that field, the DBMS won&#39;t accept it.</p>\n\n<p>Importing data from an existing source can save a lot of time compared to manually entering it. Many DBMSs let you import data from a command line using the LOAD DATA INFILE command.</p>\n<p>Here&#39;s an example: LOAD DATA INFILE &#39;sample.csv&#39; INTO TABLE Students FIELDS TERMINATED BY &#39;,&#39;; This command loads data from the sample.csv file into the Students table, and it lets the DBMS know that fields in the file are separated by commas. Importing data using a DBMSs GUI is much easier, though. Exercise 7.2 shows you how to import data from Excel into Access.</p></div>`,
      `<p>EXERCISE 7.1 (continued)</p>\n<ol start="4">\n<li>Add a new field by clicking the Click To Add field to the right of Student_ID. A pop-up menu will ask you to choose the data type, such as short text, number, or yes/no. Click Short Text. Access automatically names the field Field1. Change the name to Last_Name.</li>\n<li>Create a new table by choosing Create ➢ Table. You will now see two tables in the left-side navigation and two tabs for tables, like those shown in the figure.</li>\n<li>To navigate between tables, click the tab for the table that you want to see. Otherwise, double-click the table name in the left pane. Right-click Table1 in the left pane and click Rename. What happens?</li>\n<li>In the top navigation, right-click Table1 and choose Close.</li>\n<li>In the left navigation, right-click Table1 and choose Rename. Rename the table to Students.</li>\n</ol>\n<h3>Importing and Inputting Data</h3>\n<p>A blank database isn&#39;t the most useful creation. Once you&#39;ve created a database, the next step is to either import or input data. Inputting data manually isn&#39;t difficult—it&#39;s basically done the same way as entering data into a spreadsheet. Click the cell, enter the value, and move on. One difference is that some fields may be constrained to certain types.</p>\n<p>For example, if you set a field type as a number and then try to enter letters into a record for that field, the DBMS won&#39;t accept it.</p>\n<p>Importing data from an existing source can save a lot of time compared to manually entering it. Many DBMSs let you import data from a command line using the LOAD DATA INFILE command.</p>\n<p>Here&#39;s an example: LOAD DATA INFILE &#39;sample.csv&#39; INTO TABLE Students FIELDS TERMINATED BY &#39;,&#39;; This command loads data from the sample.csv file into the Students table, and it lets the DBMS know that fields in the file are separated by commas. Importing data using a DBMS GUI is much easier, though. Exercise 7.2 shows you how to import data from Excel into Access.</p></div>`,
    ],
    // Word breaks / OCR (high confidence)
    ["tr oubleshooting", "troubleshooting"],
    ["oncea month", "once a month"],
    ["even oncea week", "even once a week"],
    ["oneor more", "one or more"],
    ["takesup more", "takes up more"],
    ["takesup ", "takes up "],
    ["par titions", "partitions"],
    ["par tition", "partition"],
    ["inf ormation", "information"],
    ["notational syst ems", "notational systems"],
    ["syst ems", "systems"],
    ["syst em ", "system "],
    ["syst em.", "system."],
    ["each otherand", "each other and"],
    ["Conceptsand", "Concepts and"],
    ["withone another", "with one another"],
    ["Control P anel", "Control Panel"],
    ["heatmitigation", "heat mitigation"],
    ["inhouse", "in-house"],
    ["Blu- ra y", "Blu-ray"],
    ["int he ", "in the "],
    [" inthe ", " in the "],
    ["inthe upper", "in the upper"],
    ["corner,then", "corner, then"],
    ["Common fi lesystem", "Common filesystem"],
    [" fi le system", " file system"],
    [" fi les", " files"],
    ["Operating Syst ems", "Operating Systems"],
    ["DDr4", "DDR4"],
    // Table year column spacing (Mini- ITX 2 001 → 2001)
    ["Mini- ITX 2 001", "Mini-ITX, 2001,"],
    ["Nano- ITX 20 03", "Nano-ITX, 2003,"],
    ["Pico- ITX 20 07", "Pico-ITX, 2007,"],
    ["Mobile- ITX 20 07", "Mobile-ITX, 2007,"],
    ["Neo- ITX 2 012", "Neo-ITX, 2012,"],
    ["Baby- A T ", "Baby-AT "],
    // Truncated “see figure” phrasing after figure stripping
    ["similar to the one.</p>", "similar to the one shown in the figure.</p>"],
    ["like the one.</p>", "like the one shown in the figure.</p>"],
    ["get a screen like the one.</p>", "get a screen like the one shown in the figure.</p>"],
    ["similar to the one shown in</p>\n<p>remove external peripherals.", "similar to the one shown in the figure.</p>\n<p>From that screen you can also remove external peripherals."],
    ["Device Manager, shown in</p>\n<p>properly.", "Device Manager, shown in the figure.</p>\n<p>If a device does not work properly,"],
    ["free. an example.</p>", "free. See the example in your book or on screen.</p>"],
    ["will appear similar to the one.</p>", "will appear similar to the one shown in the figure.</p>"],
    // Split C: drive Properties sentence
    [
      "similar to</li>\n</ol>\n<p>the one.</p>",
      "similar to the one shown in the figure.</li>\n</ol>",
    ],
    // Ch 12 objectives banner: title run into “THE FOLLOWING…”
    [
      "<p>Data Continuity and Computer Support THE FOLLOWING COMPTIA TECH+ FC0-U71 EXAM OBJECTIVES ARE COVERED IN THIS CHAPTER:</p>",
      "<p>Data Continuity and Computer Support</p><p>THE FOLLOWING COMPTIA TECH+ FC0-U71 EXAM OBJECTIVES ARE COVERED IN THIS CHAPTER:</p>",
    ],
    // Exercise 4.1: broken ordered list + orphaned paragraph
    [
      "Scroll down and click Other Users. You will see a screen similar to the one shown in</li>\n<li>Click the Add Account button. A window will pop up asking how this person will sign</li>\n</ol>\n<p>in, and wants you to enter",
      "Scroll down and click Other Users. You will see a screen similar to the one shown in the figure.</li>\n<li>Click the Add Account button. A window will pop up asking how this person will sign in, and wants you to enter",
    ],
    // Exercise 6.2: raw HTML must not live in the page DOM
    [
      '</ol>\n<html> <header><title>Tab title</title></header> <body> Hello, world! </body> </html>\n\n<ol start="3">',
      '</ol>\n<pre><code class="language-html">&lt;html&gt;\n&lt;head&gt;\n  &lt;title&gt;Tab title&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  Hello, world!\n&lt;/body&gt;\n&lt;/html&gt;</code></pre>\n\n<ol start="3">',
    ],
    ["inthem upper", "in the upper"],
    ["View By: Large icons (or Small icons) inthe upper right corner", "View By: Large icons (or Small icons) in the upper-right corner"],
    ["Ifyou ", "If you "],
    ["maybe it&#39; s", "maybe it&#39;s"],
    ["wheel isused", "wheel is used"],
    ["like the one. Review", "like the one shown in the figure. Review"],
    ["similar to the one will appear", "similar to the one shown in the figure will appear"],
    ["k eyboard", "keyboard"],
    ["lowerright", "lower-right"],
    ["screenand point", "screen and point"],
    ["suc h", "such"],
    ["numberand", "number and"],
    ["lef t ", "left "],
    ["leftside", "left-side"],
    [" asaninput", " as an input"],
    ["Wi- Fi ", "Wi-Fi "],
    ["touc hpad", "touchpad"],
    ["augmented realityand", "augmented reality and"],
    ["settingand", "setting and"],
    ["blockoutall", "block out all"],
    ["programssuch", "programs such"],
    ["UNIXbased", "UNIX-based"],
    [" c hoosing", " choosing"],
    ["like what&#39;s. Notice", "like what&#39;s shown in the figure. Notice"],
    ["longand ", "long and "],
    ["longand,", "long and,"],
    ["longand.", "long and."],
    ["poweredoff", "powered off"],
    ["andARM", "and ARM"],
    ["P eripheral", "Peripheral"],
    ["Other Connectors Trying", "Other Connectors. Trying"],
    ["PCIeEach", "PCIe. Each"],
    ["Wi-Fi 7What", "Wi-Fi 7. What"],
    ["Wi- Fi 7", "Wi-Fi 7"],
    ["connectsall", "connects all"],
    ["connectorsIn", "connectors In"],
    ["components ofa", "components of a"],
    ["that youcan", "that you can"],
    ["dozensof", "dozens of"],
    ["it's importantto", "it's important to"],
    ["importantto", "important to"],
    ["so that youcan", "so that you can"],
    ["Wi-Fi 7isout", "Wi-Fi 7 is out"],
    ["networkand", "network and"],
    ["formaybe", "for maybe"],
    ["Howmuch", "How much"],
    ["useif", "use if"],
    ["technologyto", "technology to"],
    ["built- in", "built-in"],
    ["Bluetooth Bluetooth", "Bluetooth"],
    ["W i- Fi", "Wi-Fi"],
    ["T ech+", "Tech+"],
    // Exercise 2.3 / keyboard layout: merged words from PDF line breaks
    ["United StatesDvorak", "United States Dvorak"],
    ["United States- Dvorak", "United States Dvorak"],
    ["Language & Region S ettings", "Language & Region Settings"],
    ["Compar e ", "Compare "],
    ["T erminology", "Terminology"],
    ["contr ast", "contrast"],
    ["networ king", "networking"],
    ["Networkattac hed", "Network-attached"],
    ["Peertopeer", "Peer-to-peer"],
    ["pr oper", "proper"],
    ["secur e", "secure"],
  ];

  for (const [from, to] of subs) {
    if (h.includes(from)) h = h.split(from).join(to);
  }

  // Broken empty paragraph from PDF/chunk splits (e.g. tech-sg-07-08, tech-sg-07-07)
  h = h.replace(/<p\s+><\/p>/gi, "");
  h = h.replace(/<p\s+<\/p>/gi, "");

  // Ch 6: sample HTML/JS must not appear as raw tags in prose (tech-sg-06-06)
  h = h.replace(
    /<p>Here&#39;s an example, with some code you have seen before: <html> <header><title>Tab title<\/title><\/header> <body> <script> alert\('Hello, world!'\); <\/script> <\/body> <\/html> When you execute this web page, you will see something Notice that an alert box pops up, because the alert method was used\.<\/p>/,
    `<p>Here&#39;s an example, with some code you have seen before:</p><pre><code class="language-html">&lt;html&gt;
&lt;head&gt;&lt;title&gt;Tab title&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;script&gt;
  alert(&#39;Hello, world!&#39;);
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre><p>When you execute this web page, you will see something like the result in your book. Notice that an alert box pops up, because the <code>alert</code> method was used.</p>`
  );
  h = h.replace(
    /The <script> tag tells HTML that a script is coming; by default, HTML assumes that it(?:&#39;|')s JavaScript\./g,
    "The <code>&lt;script&gt;</code> tag tells HTML that a script is coming; by default, HTML assumes that it&#39;s JavaScript."
  );

  // Multi-display exercise: sentence split across </li></ol><p>
  h = h.replace(
    /you will<\/li>\s*<\/ol>\n<p>see a screen\. Note/g,
    "you will see a screen. Note"
  );

  // File extensions paragraph (run-on list from PDF)
  h = h.replace(
    /<p>\.rar Compression format introduced by WinRAR program\.\.tar Short for tape archive, it&#39;s a format used in the UNIX and Linux environments\. It&#39;s not compressed; a compressed TAR file would have the extension\.tar\.gz\.\.zip The most common compression format, supported by most compression software\.<\/p>/,
    "<p><strong>.rar</strong> — Compression format introduced by WinRAR.</p><p><strong>.tar</strong> — Short for tape archive; it&#39;s a format used in the UNIX and Linux environments. It&#39;s not compressed; a compressed TAR file often uses the extension <strong>.tar.gz</strong>.</p><p><strong>.zip</strong> — The most common compression format, supported by most compression software.</p>"
  );
  h = h.replace(
    /<p>Originally created by PKWARE, which makes the PKZIP program\.\.dmg macOS disk image files\.\.iso Disk image archive files for optical media, such as CD- ROMs\. \.7z Compression files generated by the 7- Zip program\.\.gz Compression files generated by the gzip program, which is mostly found on UNIX and Linux systems\. gzip is the replacement for the compress utility\.\.jar Short for Java archive; similar in format to\.zip files\.<\/p>/,
    "<p>Originally created by PKWARE, which makes the PKZIP program.</p><p><strong>.dmg</strong> — macOS disk image files.</p><p><strong>.iso</strong> — Disk image archive files for optical media, such as CD-ROMs.</p><p><strong>.7z</strong> — Compression files generated by the 7-Zip program.</p><p><strong>.gz</strong> — Compression files generated by the gzip program, which is mostly found on UNIX and Linux systems. gzip is the replacement for the <em>compress</em> utility.</p><p><strong>.jar</strong> — Short for Java archive; similar in format to .zip files.</p>"
  );

  // Wi-Fi generation summary (was one unreadable paragraph)
  h = h.replace(
    /<p>Generation name Year Frequency Maximum data rate Indoor range Outdoor range a 1999 5 GHz 54 Mbps 35 m 120 m b 1999 2\.4 GHz 11 Mbps 40 m 140 m g 2003 2\.4 GHz 54 Mbps 40 m 140 m n 2008 2\.4\/5 GHz 600 Mbps 70 m 250 m ac Wi-Fi 5 2014 5 GHz 3500 Mbps 35 m 120 m ax Wi-Fi 6 2019 2\.4\/5 GHz 9600 Mbps 70 m 250 m ax Wi-Fi 6E 2021 6 GHz 9600 Mbps 15 m 15 m be Wi-Fi 7 2024 2\.4\/5\/6 GHz 46 Gbps 30 m 100 m<\/p>/,
    "<p><strong>802.11 / Wi-Fi generations</strong> (summary)</p><pre><code>Generation  Year  Frequency    Maximum data rate  Indoor range  Outdoor range\na           1999  5 GHz        54 Mbps            35 m          120 m\nb           1999  2.4 GHz      11 Mbps            40 m          140 m\ng           2003  2.4 GHz      54 Mbps            40 m          140 m\nn           2008  2.4/5 GHz    600 Mbps           70 m          250 m\nac (Wi-Fi 5) 2014  5 GHz        3500 Mbps          35 m          120 m\nax (Wi-Fi 6) 2019  2.4/5 GHz    9600 Mbps          70 m          250 m\nax (Wi-Fi 6E) 2021  6 GHz        9600 Mbps          15 m          15 m\nbe (Wi-Fi 7) 2024  2.4/5/6 GHz  46 Gbps            30 m          100 m</code></pre>"
  );

  // PDF page footers (chapter title + page number), including before closing </div>
  h = h.replace(/\n<p>(?:Understanding|Exploring) [^<]{5,100} \d{2,4}<\/p>\n/g, "\n");
  h = h.replace(/\n<p>(?:Understanding|Exploring) [^<]{5,100} \d{2,4}<\/p>(?=\s*<\/div>)/g, "\n");
  h = h.replace(/<p>(?:Understanding|Exploring) [^<]{5,100} \d{2,4}<\/p>(?=\s*<\/div>)/g, "");

  // PDF footers / run-ins: “Managing an Operating System NNN”
  h = h.replace(/\n<p>Managing an Operating System \d{1,4}<\/p>\n/g, "\n");
  h = h.replace(/<p>Managing an Operating System \d{1,4} (?=[A-Z])/g, "<p>");

  // PDF run-in: section title + page number spliced onto the start of a real paragraph
  h = h.replace(
    /<p>Exploring (?:[A-Z][a-z]+(?: [A-Z][a-z]+){1,6}) \d{1,4} /g,
    "<p>"
  );

  // Exercise 2.2: invalid HTML (&lt;/p&gt; inside &lt;li&gt;) + wrong chapter text merged in
  if (h.includes("Installing and Configuring Audio and Video Devices 87")) {
    const ex22 = `<p>EXERCISE 2.2</p>
<p>Changing the Settings for Multiple Monitors</p>
<ol>
<li>Right- click a blank portion of the desktop.</li>
<li>Click Display Settings. If you have multiple displays, you will see a screen like the one in the figure. Note that if you have a single display, you won&#39;t see the same screen as in the book—but you can still make display settings changes, just not configure multiple displays.</li>
<li>Click and drag the second monitor to the desired virtual position around the primary monitor. This affects the direction in which you drag objects from one display to the other and how your mouse will move between the two screens.</li>
<li>Click the down arrow next to Extend These Displays. You will get a screen similar to the one shown in the figure.</li>
<li>Scroll down in Display settings until you see the Scale &amp; Layout section, like what&#39;s shown in the figure. Notice that here you can change the size of the text, resolution, and orientation. On some displays, you may also have an option to set the refresh rate. As an optional step, change the display resolution to something besides the recommended setting and see what happens to the images on the screen. Don&#39;t worry—you will be able to change it back if you don&#39;t like it!</li>
<li>Click the X in the upper- right corner to save your changes and exit.</li>
</ol>`;
    h = h.replace(/<div class="(lh-tg-root[^"]*)">[\s\S]*<\/div>/, `<div class="$1">${ex22}</div>`);
  }

  // Exercise 4.1: &lt;/p&gt; inside &lt;li&gt;, PDF footers, and post-exercise chapter text merged in
  if (h.includes("</ol>\n<p>privileges.</p>\n<ol start=\"2\">")) {
    const ex41 = `<p>EXERCISE 4.1</p>
<p>Creating a User Account in Windows 11</p>
<ol>
<li>In Windows 11, make sure you&#39;re logged in using an account with administrator privileges.</li>
<li>Click Start ➢ Settings (it looks like a gear).</li>
<li>Click Accounts.</li>
<li>Scroll down and click Other Users. You will see a screen similar to the one shown in the figure.</li>
<li>Click the Add Account button. A window will pop up asking how this person will sign in and may ask for an email or phone. You can enter a live email address or phone number, but for this exercise click <strong>I Don&#39;t Have This Person&#39;s Sign-In Information</strong>. Microsoft may prompt for an email address to link the user to cloud-based services. If you enter an email and click Next, it creates the account; the first time that person signs in, they verify via email.</li>
<li>A Microsoft account page may appear. For this exercise, click <strong>Add A User Without A Microsoft Account</strong>.</li>
<li>On the Create A User For This PC page, enter a username and password, answer the three security questions, and click Next. The new account appears under Accounts ➢ Other Users.</li>
</ol>
<p>Although the specific steps differ by OS, the overall process is similar. (You will create a user account in Lubuntu in this chapter&#39;s lab.) Once you know how tasks work in one OS, you can usually find the equivalent in another—or look it up.</p>`;
    h = h.replace(/<div class="(lh-tg-root[^"]*)">[\s\S]*<\/div>/, `<div class="$1">${ex41}</div>`);
  }

  // Exercise 6.2: raw &lt;body&gt;, broken &lt;b&gt;&lt;i&gt;, and an entire chapter wrongly appended
  if (h.includes('<body bgcolor="#DDEA11">')) {
    const ex62 = `<p>EXERCISE 6.2</p>
<p>Creating &quot;Hello, World!&quot; in HTML</p>
<ol>
<li>Open Notepad (or another text editor). You can open Notepad by typing the word <em>note</em> into the Windows search bar and clicking Notepad when it appears.</li>
<li>Type the following code in the text editor:</li>
</ol>
<pre><code class="language-html">&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Tab title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  Hello, world!
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<ol start="3">
<li>Save the file to your desktop as hello.html.</li>
<li>Double- click the hello.html file. It should open in your browser and look something like the figure.</li>
<li>Go back to your hello.html file in the text editor. (If you closed it, right- click, select Open With ➢ Choose Another App and select Notepad.)</li>
<li>Change the line that says Hello, world! to the following:</li>
</ol>
<pre><code class="language-html">&lt;b&gt;&lt;i&gt;Hello, world!&lt;/i&gt;&lt;/b&gt;</code></pre>
<ol start="7">
<li>Save the file.</li>
<li>Open hello.html again in a web browser. Notice the change in the text.</li>
<li>Open the file in the text editor again, and change the <code>&lt;body&gt;</code> line to the following:</li>
</ol>
<pre><code class="language-html">&lt;body bgcolor=&quot;#DDEA11&quot;&gt;</code></pre>
<ol start="10">
<li>Save the file.</li>
<li>Open hello.html again in a web browser. What change do you see? (The words should be bold and italic, and the background color of the page should be green.)</li>
</ol>
<p>In step 9, the code <code>DDEA11</code> is a hexadecimal color value. The first two characters are red, the next two are green, and the last two are blue. For example, <code>00FF00</code> is pure green and <code>0000FF</code> is pure blue.</p>
<p>You can experiment with hex colors on sites such as <a href="https://www.color-hex.com/">color-hex.com</a>.</p>`;
    h = h.replace(/<div class="(lh-tg-root[^"]*)">[\s\S]*<\/div>/, `<div class="$1">${ex62}</div>`);
  }

  // Catch any mojibake reintroduced by replacement blocks or untouched segments
  h = h.replace(/ΓÇö/g, "\u2014");
  h = h.replace(/Γ₧ó/g, "\u27a2");

  return h;
}
