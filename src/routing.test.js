import test from 'node:test';
import assert from 'node:assert/strict';
import { classroomLookup } from './roomDatabase.js';
import { dnhsPaths, dnhsRoutingGrid } from './campusData.js';
import { calculateDistance, findShortestPath, smoothRoute } from './routing.js';

test('renamed destination is connected in both directions', () => {
  assert.ok(classroomLookup['Nighthawk Center']);
  assert.equal(classroomLookup.Administration, undefined);
  assert.ok(findShortestPath('Library', 'Nighthawk Center'));
  assert.ok(findShortestPath('Nighthawk Center', 'Library'));
});

test('every room pair has a finite route with correct endpoints', () => {
  for (const start of Object.keys(classroomLookup)) {
    for (const end of Object.keys(classroomLookup)) {
      const route = findShortestPath(start, end);
      assert.ok(route, `${start} to ${end}`);
      assert.deepEqual(route[0], classroomLookup[start]);
      assert.deepEqual(route.at(-1), classroomLookup[end]);
      assert.ok(route.every(point => point.every(Number.isFinite)));
    }
  }
});

test('GPS movement updates the route without mutating the campus graph', () => {
  const original = JSON.stringify(dnhsPaths);
  const a = dnhsRoutingGrid.Node_5040;
  const b = dnhsRoutingGrid.Node_6659;
  const midpoint = a.map((value, i) => (value + b[i]) / 2);
  const first = findShortestPath('USER_GPS_START', 'Nighthawk Center', midpoint);
  const second = findShortestPath('USER_GPS_START', 'Nighthawk Center', b);
  assert.deepEqual(first[0], midpoint);
  assert.ok(calculateDistance(first[1], midpoint) < 0.01);
  assert.deepEqual(second[0], b);
  assert.notDeepEqual(first, second);
  assert.equal(JSON.stringify(dnhsPaths), original);
  for (const point of Object.values(dnhsRoutingGrid)) {
    assert.ok(findShortestPath('USER_GPS_START', 'Library', point));
  }
});

test('invalid routes and unavailable GPS return null', () => {
  assert.equal(findShortestPath('unknown', 'Library'), null);
  assert.equal(findShortestPath('Library', 'unknown'), null);
  assert.equal(findShortestPath('USER_GPS_START', 'Library'), null);
});

test('off-campus GPS cannot create a misleading straight-line walking route', () => {
  assert.equal(findShortestPath('USER_GPS_START', 'Library', [33.09, -117.12]), null);
  assert.ok(findShortestPath('Library', 'Nighthawk Center', [33.09, -117.12]));
});

test('sharp turns are subtly rounded and endpoints are retained', () => {
  const route = [[33, -117], [33.0001, -117], [33.0001, -116.9999]];
  const original = JSON.stringify(route);
  const smooth = smoothRoute(route);
  assert.ok(smooth.length > route.length);
  assert.deepEqual(smooth[0], route[0]);
  assert.deepEqual(smooth.at(-1), route.at(-1));
  assert.ok(smooth.slice(1, -1).every(point => calculateDistance(point, route[1]) <= 1.01));
  assert.equal(JSON.stringify(route), original);
});

test('straight lines, repeated points, short routes and empty routes stay valid', () => {
  const straight = [[33, -117], [33.0001, -117], [33.0002, -117]];
  assert.deepEqual(smoothRoute(straight), straight);
  assert.deepEqual(smoothRoute([straight[0], straight[0], straight[1]]), [straight[0], straight[0], straight[1]]);
  assert.deepEqual(smoothRoute(straight.slice(0, 2)), straight.slice(0, 2));
  assert.equal(smoothRoute(null), null);
});
