/**
 * Del Norte High School Navigation PWA Spatial Database
 * Establishes absolute architectural separation between public markers and routing nodes.
 */

// === 🏛️ ARRAY 1: PUBLIC LANDMARKS & ENTRYWAY GATEWAYS ===
// Renders natively as visual blue pin markers with interactive popups on the screen
export const dnhsLandmarks = {
  "A Building (Administration & Counseling)": [33.01493, -117.12160],
  "Performing Arts Center": [33.01516, -117.12067],
  "L1/L2 Buildings (Classrooms)": [33.01473, -117.12066], 
  "S Building (Classrooms)": [33.01466, -117.12003],
  "K Building (Classrooms)": [33.01447, -117.12061],
  "J1/J2 Buildings (Classrooms)": [33.01422, -117.12066],
  "G1/G2 Buildings (Classrooms)": [33.01392, -117.12091],
  "E Building (Classrooms)": [33.01380, -117.12117],
  "D1/D2 Buildings (Classrooms)": [33.01376, -117.12144],
  "B Building (Science & Classrooms)": [33.01354, -117.12175],
  "Student Locker Room Loop": [33.01343, -117.12230],
  "Main Gymnasium & Athletics": [33.01389, -117.12192],
  "Food Service / Cafeteria": [33.01416, -117.12196],
  "The Hawk Central Quad": [33.01447, -117.12146]
};

// === 🟢 ARRAY 2: PRIVATE ROUTING JUNCTIONS & PATHWAY DOTS ===
// Operates hidden behind the scenes to guide vector lines safely around building corners
export const dnhsRoutingGrid = {
  "Node_5040": [33.01463, -117.12179],
  "Node_6659": [33.01470, -117.12174],
  "Node_4327": [33.01485, -117.12205],
  "Node_3992": [33.01497, -117.12193],
  "Node_5736": [33.01503, -117.12181],
  "Node_1717": [33.01508, -117.12166],
  "Node_8554": [33.01480, -117.12158],
  "Node_9260": [33.01449, -117.12182],
  "Node_4283": [33.01445, -117.12195],
  "Node_2347": [33.01424, -117.12185],
  "Node_1862": [33.01417, -117.12159],
  "Node_9223": [33.01403, -117.12160],
  "Node_3677": [33.01479, -117.12134],
  "Node_7952": [33.01450, -117.12145],
  "Node_3403": [33.01445, -117.12091],
  "Node_1779": [33.01475, -117.12101],
  "Node_8445": [33.01405, -117.12129],
  "Node_7226": [33.01424, -117.12100],
  "Node_9936": [33.01455, -117.12091],
  "Node_7177": [33.01408, -117.12119],
  "Node_3096": [33.01520, -117.12121],
  "Node_2025": [33.01542, -117.12106],
  "Node_9246": [33.01547, -117.12088],
  "Node_9670": [33.01491, -117.12074],
  "Node_4779": [33.01519, -117.12060],
  "Node_1453": [33.01506, -117.12018],
  "Node_3122": [33.01408, -117.12213],
  "Node_4390": [33.01390, -117.12193],
  "Node_5661": [33.01379, -117.12165],
  "Node_7552": [33.01381, -117.12267],
  "Node_8004": [33.01357, -117.12247],
  "Node_9128": [33.01336, -117.12211],
  "Node_8105": [33.01326, -117.12165],
  "Node_3652": [33.01330, -117.12119],
  "Node_9144": [33.01345, -117.12072],
  "Node_3416": [33.01382, -117.12026],
  "Node_8766": [33.01430, -117.12004],
  "Node_9282": [33.01378, -117.12128],
  "Node_5197": [33.01471, -117.12004],
  "Node_2132": [33.01386, -117.12103],
  "Node_1163": [33.01408, -117.12074],
  "Node_5920": [33.01439, -117.12061],
  "Node_9826": [33.01462, -117.12061],
  "Node_6972": [33.01465, -117.12126],
  "Node_5460": [33.01450, -117.12116],
  "Node_4611": [33.01426, -117.12136],
  "Node_8152": [33.01426, -117.12156],
  "Node_6853": [33.01459, -117.12165]
};

// === 🔗 ARRAY 3: GRAPH ADJACENCY CONNECTIONS ===
// Tracks open walkway paths connecting individual routing points together
export const dnhsPaths = {};
