moment = require 'moment'

# Main function
# INPUT: an array of snapshots
# OUTPUT: an array of daily star variation
createDailyDeltas = (snapshots) ->
  # STEP 1
  points = createAllPoints snapshots
  # STEP 2
  deltas = pointsToDeltas points
  deltas

# INPUT: an array of snapshots
# OUTPUT: an array of points (sorted by time ascending)
createAllPoints = (snapshots) ->
  points = snapshots.map (doc) -> createPoint(doc)
  points.sort (a, b) ->
    return a.t - b.t
  points

# INPUT: a snapshot record
# OUTPUT: a point {time, stars}
createPoint = (snapshot) ->
  console.log snapshot
  snapshotDate = new Date snapshot.createdAt
  # console.log 'time', snapshot.createdAt, getTimeValue snapshotDate
  point =
    stars: snapshot.stars
    t: getTimeValue snapshotDate
  point


# INPUT: a JavaScript date object (date and time)
# OUTPUT: a JavaScript date object (date only)
dateOnly = (d) ->
  d.setHours(0, 0, 0, 0)
  d

# INPUT: a JavaScript date object (date and time)
# OUTPUT: number of days from today
getTimeValue = (date) ->
  d = dateOnly date
  today = dateOnly new Date()
  moment0 = moment today
  moment1 = moment d
  delta = moment0.diff(moment1, 'days')
  delta

# INPUT: an array of points {time, stars} sorted by time
# OUTPUT: an array of daily star variation
pointsToDeltas = (points) ->
  deltas = []
  reducer = (pointA, pointB) ->
    if pointA.t > -1
      deltas.push pointA.stars - pointB.stars
    return pointB
  points.reduce reducer,
    t: - 1
  deltas

module.exports =
  createPoint: createPoint
  pointsToDeltas: pointsToDeltas
  createAllPoints: createAllPoints
  dateOnly: dateOnly
  getTimeValue: getTimeValue
  createDailyDeltas: createDailyDeltas
