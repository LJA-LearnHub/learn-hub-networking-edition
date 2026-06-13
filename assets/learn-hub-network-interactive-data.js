/**
 * Interactive activities keyed by lesson id (Network+ edition).
 * Types: match | order | categorize | pick | fill
 */
window.LEARN_HUB_NETWORK_INTERACTIVE = {
  /** Applied when no explicit lesson entry exists */
  defaults: {
    minActivities: 1,
  },

  /** lessonId -> activity[] */
  byLesson: {
    "network-w01-d02": [
      {
        id: "osi-layer-match",
        type: "match",
        title: "Match layer to function",
        prompt: "Select a layer number, then its primary responsibility.",
        pairs: [
          ["Layer 1", "Physical signaling and media"],
          ["Layer 2", "MAC addresses and frames"],
          ["Layer 3", "IP addressing and routing"],
          ["Layer 4", "TCP/UDP ports and segments"],
        ],
      },
      {
        id: "osi-pdu-order",
        type: "order",
        title: "Encapsulation order (top to bottom)",
        prompt: "Order PDUs from application data down to the wire.",
        items: ["Data", "Segment", "Packet", "Frame", "Bits"],
      },
    ],
    "network-w01-d03": [
      {
        id: "port-match",
        type: "match",
        title: "Match port to service",
        prompt: "Pair each port with the correct service.",
        pairs: [
          ["22", "SSH"],
          ["53", "DNS"],
          ["80", "HTTP"],
          ["443", "HTTPS"],
          ["3389", "RDP"],
        ],
      },
      {
        id: "tcp-udp-pick",
        type: "pick",
        title: "TCP or UDP?",
        prompt: "Which transport protocol fits VoIP prioritizing low latency over guaranteed delivery?",
        options: ["TCP", "UDP", "ICMP", "ARP"],
        correct: 1,
      },
    ],
    "network-w01-d04": [
      {
        id: "topology-pick",
        type: "pick",
        title: "Topology tradeoff",
        prompt: "Which topology has a single point of failure at the center device?",
        options: ["Star", "Mesh", "Ring with dual links", "Full mesh"],
        correct: 0,
      },
      {
        id: "lan-wan-match",
        type: "match",
        title: "Network type examples",
        prompt: "Match each network type to the best example.",
        pairs: [
          ["LAN", "Office switch closet"],
          ["WAN", "ISP link between cities"],
          ["PAN", "Bluetooth earbuds"],
          ["MAN", "City campus fiber ring"],
        ],
      },
    ],
    "network-w02-d02": [
      {
        id: "subnet-pick",
        type: "pick",
        title: "Subnetting quick check",
        prompt: "How many usable host addresses in a /26 network?",
        options: ["30", "62", "64", "126"],
        correct: 1,
      },
      {
        id: "private-range",
        type: "pick",
        title: "Private IPv4 range",
        prompt: "Which block is private RFC 1918 space?",
        options: ["10.0.0.0/8", "8.8.8.0/24", "172.32.0.0/8", "203.0.113.0/24"],
        correct: 0,
      },
    ],
    "network-w02-d04": [
      {
        id: "mask-fill",
        type: "fill",
        title: "Subnet mask drill",
        prompt: "Choose the dotted-decimal mask for a /24 network.",
        fields: [{ label: "/24 mask", options: ["255.255.255.0", "255.255.0.0", "255.255.255.128", "255.0.0.0"], correct: 0 }],
      },
    ],
    "network-w03-d01": [
      {
        id: "device-cat",
        type: "categorize",
        title: "Device vs layer",
        prompt: "Click a device, then the layer bucket where it primarily operates.",
        buckets: ["Layer 1", "Layer 2", "Layer 3"],
        items: [
          { label: "Hub", bucket: "Layer 1" },
          { label: "Switch", bucket: "Layer 2" },
          { label: "Router", bucket: "Layer 3" },
          { label: "Repeater", bucket: "Layer 1" },
        ],
      },
    ],
    "network-w03-d02": [
      {
        id: "mac-ip-pick",
        type: "pick",
        title: "Address type",
        prompt: "Which address changes when a host moves to a new subnet?",
        options: ["MAC", "IP", "Both always change", "Neither changes"],
        correct: 1,
      },
    ],
    "network-w04-d01": [
      {
        id: "vlan-pick",
        type: "pick",
        title: "VLAN purpose",
        prompt: "VLANs primarily segment which type of domain?",
        options: ["Broadcast", "Collision on every port", "DNS zones", "DHCP scopes only"],
        correct: 0,
      },
    ],
    "network-w04-d03": [
      {
        id: "trunk-pick",
        type: "pick",
        title: "Trunking",
        prompt: "Which tag carries multiple VLANs on one link?",
        options: ["802.1Q", "802.11", "LLC only", "ARP"],
        correct: 0,
      },
    ],
    "network-w05-d02": [
      {
        id: "rip-pick",
        type: "pick",
        title: "RIP limit",
        prompt: "RIP considers how many hops as unreachable?",
        options: ["15", "16", "255", "4"],
        correct: 1,
      },
    ],
    "network-w06-d01": [
      {
        id: "dns-record-match",
        type: "match",
        title: "DNS record types",
        prompt: "Match record type to purpose.",
        pairs: [
          ["A", "IPv4 hostname"],
          ["AAAA", "IPv6 hostname"],
          ["MX", "Mail server"],
          ["CNAME", "Alias name"],
        ],
      },
    ],
    "network-w06-d02": [
      {
        id: "dhcp-order",
        type: "order",
        title: "DHCP DORA order",
        prompt: "Order the DHCP message exchange.",
        items: ["Discover", "Offer", "Request", "Acknowledge"],
      },
    ],
    "network-w06-d03": [
      {
        id: "nat-pick",
        type: "pick",
        title: "NAT overload",
        prompt: "Many internal hosts sharing one public IP uses:",
        options: ["PAT (NAT overload)", "Static NAT only", "RARP", "DNS round robin"],
        correct: 0,
      },
    ],
    "network-w07-d02": [
      {
        id: "cia-order",
        type: "order",
        title: "AAA components",
        prompt: "Order: Authentication → ? → Accounting (pick the middle step name).",
        items: ["Authentication", "Authorization", "Accounting"],
      },
    ],
    "network-w08-d02": [
      {
        id: "wpa-pick",
        type: "pick",
        title: "Wireless security",
        prompt: "Which is strongest for home/small office today?",
        options: ["WPA3", "WEP", "Open", "WPA-TKIP only"],
        correct: 0,
      },
    ],
    "network-w09-d01": [
      {
        id: "trouble-order",
        type: "order",
        title: "Troubleshooting methodology",
        prompt: "Order the first four CompTIA troubleshooting steps.",
        items: [
          "Identify the problem",
          "Establish a theory",
          "Test the theory",
          "Establish a plan of action",
        ],
      },
    ],
    "network-d1-t01": [
      {
        id: "osi-tcp-match",
        type: "match",
        title: "OSI vs TCP/IP",
        prompt: "Match TCP/IP layer to closest OSI layer group.",
        pairs: [
          ["Network Access", "OSI Layers 1–2"],
          ["Internet", "OSI Layer 3"],
          ["Transport", "OSI Layer 4"],
          ["Application", "OSI Layers 5–7"],
        ],
      },
    ],
    "network-d1-t05": [
      {
        id: "port-match-d1",
        type: "match",
        title: "Well-known ports",
        prompt: "Match port to service (exam high-yield).",
        pairs: [
          ["21", "FTP"],
          ["25", "SMTP"],
          ["161", "SNMP"],
          ["443", "HTTPS"],
        ],
      },
    ],
    "network-d2-t02": [
      {
        id: "stp-pick",
        type: "pick",
        title: "Spanning Tree",
        prompt: "STP prevents:",
        options: ["Switching loops", "DNS failures", "DHCP exhaustion", "NAT overload"],
        correct: 0,
      },
    ],
    "network-d4-t02": [
      {
        id: "acl-pick",
        type: "pick",
        title: "ACL processing",
        prompt: "When an ACL is evaluated, traffic is matched:",
        options: [
          "Top to bottom; first match wins",
          "Bottom to top",
          "Random rule",
          "Longest IP match only",
        ],
        correct: 0,
      },
    ],
    "network-exam-04": [
      {
        id: "port-sprint",
        type: "match",
        title: "Port sprint",
        prompt: "Quick match — common exam ports.",
        pairs: [
          ["67/68", "DHCP"],
          ["123", "NTP"],
          ["389", "LDAP"],
          ["514", "Syslog"],
        ],
      },
    ],
    "network-pbq-02": [
      {
        id: "dhcp-triage-order",
        type: "order",
        title: "DHCP triage",
        prompt: "Order checks when a host has APIPA (169.254.x.x).",
        items: [
          "Confirm scope has available leases",
          "Verify VLAN and relay (ip helper)",
          "Check link and switch port",
          "Release/renew on client",
        ],
      },
    ],
  },

  /** Prefix patterns: regex string -> activity templates (cloned per lesson) */
  patterns: [
    {
      re: /^network-w01-d/,
      activities: [
        {
          id: "w1-review-pick",
          type: "pick",
          title: "Week 1 checkpoint",
          prompt: "Which device operates primarily at Layer 2?",
          options: ["Router", "Switch", "Firewall doing NAT", "DNS server"],
          correct: 1,
        },
      ],
    },
    {
      re: /^network-d[1-5]-t/,
      activities: [
        {
          id: "domain-reflect",
          type: "pick",
          title: "Exam judgment",
          prompt: "Before changing config, what should you capture first?",
          options: ["Baseline evidence", "New ACL", "Reboot core switch", "Disable STP"],
          correct: 0,
        },
      ],
    },
    {
      re: /^network-exam-/,
      activities: [
        {
          id: "cram-pick",
          type: "pick",
          title: "Cram discipline",
          prompt: "Best approach when two answers seem correct?",
          options: [
            "Pick the more specific evidence-based option",
            "Pick the longer answer",
            "Pick the first option",
            "Skip without marking",
          ],
          correct: 0,
        },
      ],
    },
    {
      re: /^network-pbq-/,
      activities: [
        {
          id: "pbq-first-step",
          type: "pick",
          title: "PBQ first move",
          prompt: "First action on a PBQ connectivity failure?",
          options: [
            "Verify scope and gather baseline output",
            "Replace the core router",
            "Disable all ACLs",
            "Reset all switches",
          ],
          correct: 0,
        },
      ],
    },
    {
      re: /^network-ws-sub-/,
      activities: [
        {
          id: "subnet-pick-ws",
          type: "pick",
          title: "Subnetting sanity check",
          prompt: "/27 provides how many usable hosts?",
          options: ["30", "32", "62", "126"],
          correct: 0,
        },
      ],
    },
    {
      re: /^network-w0[2-9]-d/,
      activities: [
        {
          id: "week-tools-pick",
          type: "pick",
          title: "Tool selection",
          prompt: "Which command shows the ARP table on Windows?",
          options: ["arp -a", "ipconfig", "tracert", "netstat -r"],
          correct: 0,
        },
      ],
    },
    {
      re: /^network-w10-d/,
      activities: [
        {
          id: "review-match",
          type: "match",
          title: "Exam review match",
          prompt: "Match domain focus to weight (approximate).",
          pairs: [
            ["Domain 1", "~23%"],
            ["Domain 2", "~20%"],
            ["Domain 5", "~24%"],
            ["Domain 4", "~14%"],
          ],
        },
      ],
    },
    {
      re: /^network-ws-(pt|sc|cmd|sw|rt|wi|op|sec|acl|tsh|vlan|osi)-/,
      activities: [
        {
          id: "lab-verify-pick",
          type: "pick",
          title: "Lab verification",
          prompt: "After a config change, what proves success?",
          options: [
            "Command output matching success criteria",
            "Closing the terminal",
            "Deleting the VLAN",
            "Disabling logging",
          ],
          correct: 0,
        },
      ],
    },
  ],
};
