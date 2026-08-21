/**
 * Del Norte High School Classroom Mapping Database
 * Connects individual room keys directly to their closest parent routing grid nodes.
 */

export const classroomLookup = {
  // A Building Classrooms (Connect to Node_5040)
  "Room A101 (English)": "Node_5040",
  "Room A102 (History)": "Node_5040",
  "Room A103 (Counseling Hub)": "Node_5040",

  // B Building Classrooms (Connect to Node_1862)
  "Room B101 (Chemistry)": "Node_1862",
  "Room B102 (Biology)": "Node_1862",
  "Room B201 (Physics)": "Node_1862",

  // D Building Classrooms (Connect to Node_5661)
  "Room D101 (Algebra)": "Node_5661",
  "Room D102 (Geometry)": "Node_5661",

  // J Building Classrooms (Connect to Node_5920)
  "Room J120 (Spanish)": "Node_5920",
  "Room J122 (French)": "Node_5920",

  // K Building Classrooms (Connect to Node_9826)
  "Room K105 (Art)": "Node_9826",
  "Room K108 (Digital Media)": "Node_9826",

  // L Building Classrooms (Connect to Node_9936)
  "Room L101 (English 9)": "Node_9936",
  "Room L102 (World History)": "Node_9936"
};
