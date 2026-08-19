/**
 * Del Norte High School Spatial Waypoint Database
 * Tracks high-precision location coordinate anchors for primary campus entry points.
 */

// Your custom hand-calibrated true geographic entrance coordinates
export const dnhsNodes = {
  "A Building (Administration & Counseling)": '33.01493,-117.12160'.split(',').map(Number),
  "Performing Arts Center": '33.01516,-117.12067'.split(',').map(Number),
  "L1/L2 Buildings (Classrooms)": '33.01473,-117.12066'.split(',').map(Number), 
  "S Building (Classrooms)": '33.01466,-117.12003'.split(',').map(Number),
  "K Building (Classrooms)": '33.01447,-117.12061'.split(',').map(Number),
  "J1/J2 Buildings (Classrooms)": '33.01422,-117.12066'.split(',').map(Number),
  "G1/G2 Buildings (Classrooms)": '33.01392,-117.12091'.split(',').map(Number),
  "E Building (Classrooms)": '33.01380,-117.12117'.split(',').map(Number),
  "D1/D2 Buildings (Classrooms)": '33.01376,-117.12144'.split(',').map(Number),
  "B Building (Science & Classrooms)": '33.01354,-117.12175'.split(',').map(Number),
  "Student Locker Room Loop": '33.01343,-117.12230'.split(',').map(Number),
  "Main Gymnasium & Athletics": '33.01389,-117.12192'.split(',').map(Number),
  "Food Service / Cafeteria": '33.01416,-117.12196'.split(',').map(Number),
  "The Hawk Central Quad": '33.01447,-117.12146'.split(',').map(Number)
};

// Graph Adjacency Connections: Tracks open outdoor walkway routes between entry points
export const dnhsPaths = {
  "The Hawk Central Quad": [
    "A Building (Administration & Counseling)",
    "Performing Arts Center",
    "L1/L2 Buildings (Classrooms)",
    "K Building (Classrooms)",
    "J1/J2 Buildings (Classrooms)",
    "G1/G2 Buildings (Classrooms)",
    "E Building (Classrooms)",
    "D1/D2 Buildings (Classrooms)",
    "B Building (Science & Classrooms)",
    "Food Service / Cafeteria"
  ],
  "A Building (Administration & Counseling)": ["The Hawk Central Quad"],
  "Performing Arts Center": ["The Hawk Central Quad"],
  "L1/L2 Buildings (Classrooms)": ["The Hawk Central Quad", "S Building (Classrooms)"],
  "S Building (Classrooms)": ["L1/L2 Buildings (Classrooms)"],
  "K Building (Classrooms)": ["The Hawk Central Quad"],
  "J1/J2 Buildings (Classrooms)": ["The Hawk Central Quad"],
  "G1/G2 Buildings (Classrooms)": ["The Hawk Central Quad"],
  "E Building (Classrooms)": ["The Hawk Central Quad"],
  "D1/D2 Buildings (Classrooms)": ["The Hawk Central Quad"],
  "B Building (Science & Classrooms)": ["The Hawk Central Quad", "Student Locker Room Loop", "Main Gymnasium & Athletics"],
  "Student Locker Room Loop": ["B Building (Science & Classrooms)"],
  "Main Gymnasium & Athletics": ["B Building (Science & Classrooms)"],
  "Food Service / Cafeteria": ["The Hawk Central Quad"]
};
