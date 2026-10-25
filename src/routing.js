import { dnhsRoutingGrid, dnhsPaths } from './campusData.js';
import { classroomLookup } from './roomDatabase.js';

export function calculateDistance(a, b) {
  const radians = Math.PI / 180;
  const lat = (b[0] - a[0]) * radians;
  const lon = (b[1] - a[1]) * radians;
  const h = Math.sin(lat / 2) ** 2 + Math.cos(a[0] * radians) * Math.cos(b[0] * radians) * Math.sin(lon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const interpolate = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t);

export function findShortestPath(start, end, gpsCoords = null) {
  const points = { ...dnhsRoutingGrid, ...classroomLookup };
  // Clone adjacency arrays too: repeated GPS updates must never modify campus data.
  const paths = Object.fromEntries(Object.entries(dnhsPaths).map(([key, neighbors]) => [key, [...neighbors]]));
  if (!Object.hasOwn(points, end)) return null;

  if (start === 'USER_GPS_START') {
    if (!gpsCoords) return null;
    points[start] = gpsCoords;
    // Join the nearest walkway segment, rather than backtracking to its nearest junction.
    let closest = null;
    const scale = Math.cos(gpsCoords[0] * Math.PI / 180);
    for (const [a, neighbors] of Object.entries(dnhsPaths)) {
      if (!Object.hasOwn(dnhsRoutingGrid, a)) continue;
      for (const b of neighbors) {
        if (!Object.hasOwn(dnhsRoutingGrid, b)) continue;
        const delta = [points[b][0] - points[a][0], (points[b][1] - points[a][1]) * scale];
        const offset = [gpsCoords[0] - points[a][0], (gpsCoords[1] - points[a][1]) * scale];
        const lengthSquared = delta[0] ** 2 + delta[1] ** 2;
        const t = lengthSquared ? Math.max(0, Math.min(1, (offset[0] * delta[0] + offset[1] * delta[1]) / lengthSquared)) : 0;
        const position = interpolate(points[a], points[b], t);
        const distance = calculateDistance(gpsCoords, position);
        if (!closest || distance < closest.distance) closest = { a, b, position, distance };
      }
    }
    if (!closest) return null;
    points.GPS_WALKWAY = closest.position;
    paths[start] = ['GPS_WALKWAY'];
    paths.GPS_WALKWAY = [closest.a, closest.b];
  }
  if (!Object.hasOwn(points, start)) return null;

  const distances = { [start]: 0 };
  const previous = {};
  const pending = new Set(Object.keys(points));
  while (pending.size) {
    let current = null;
    for (const key of pending) {
      if ((distances[key] ?? Infinity) < (distances[current] ?? Infinity)) current = key;
    }
    if (current === null) return null;
    if (current === end) {
      const route = [];
      for (let key = end; key !== undefined; key = previous[key]) route.unshift(points[key]);
      return route;
    }
    pending.delete(current);
    for (const neighbor of paths[current] || []) {
      if (!pending.has(neighbor) || (Object.hasOwn(classroomLookup, neighbor) && neighbor !== end)) continue;
      const distance = distances[current] + calculateDistance(points[current], points[neighbor]);
      if (distance < (distances[neighbor] ?? Infinity)) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
      }
    }
  }
  return null;
}

// Round only visible sharp bends. Limit the corner cut to one meter and retain endpoints.
export function smoothRoute(route) {
  if (!route || route.length < 3) return route;
  const result = [route[0]];
  for (let i = 1; i < route.length - 1; i++) {
    const [a, b, c] = [route[i - 1], route[i], route[i + 1]];
    const incoming = calculateDistance(a, b);
    const outgoing = calculateDistance(b, c);
    const scale = Math.cos(b[0] * Math.PI / 180);
    const u = [b[0] - a[0], (b[1] - a[1]) * scale];
    const v = [c[0] - b[0], (c[1] - b[1]) * scale];
    const cosine = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
    if (incoming < 0.1 || outgoing < 0.1 || cosine > Math.cos(Math.PI / 6) || cosine < Math.cos(8 * Math.PI / 9)) {
      result.push(b);
      continue;
    }
    const radius = Math.min(1, incoming / 4, outgoing / 4);
    const entry = interpolate(b, a, radius / incoming);
    const exit = interpolate(b, c, radius / outgoing);
    result.push(entry);
    for (let step = 1; step <= 6; step++) {
      const t = step / 6;
      result.push(interpolate(interpolate(entry, b, t), interpolate(b, exit, t), t));
    }
  }
  result.push(route[route.length - 1]);
  return result;
}
