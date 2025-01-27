// Updated getLearnerData function
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    try {
      // Basic data validation
      if (!courseInfo || typeof courseInfo !== "object" || typeof courseInfo.id !== "number") {
        throw new Error("Invalid courseInfo object or missing 'id' property.");
      }
  
      if (!assignmentGroup || typeof assignmentGroup !== "object" || typeof assignmentGroup.course_id !== "number") {
        throw new Error("Invalid assignmentGroup object or missing 'course_id' property.");
      }
  
      if (!Array.isArray(assignmentGroup.assignments)) {
        throw new Error("Invalid assignmentGroup.assignments. Expected an array of assignments.");
      }
  
      if (!Array.isArray(learnerSubmissions)) {
        throw new Error("Invalid learnerSubmissions. Expected an array of submissions.");
      }
  
      // Validate that the AssignmentGroup belongs to the CourseInfo
      if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("AssignmentGroup course_id does not match CourseInfo id.");
      }
  
      // Prepare the output array
      const results = [];
  
      // ----- [Loop #1: for...of loop] -----
      for (const learner of learnerSubmissions) {
        const learnerData = {
          id: learner.learner_id,
          avg: 0,
        };
  
        let totalWeightedScore = 0;
        let totalPointsPossible = 0;
  
        // ----- [Loop #2: traditional for loop] -----
        for (let i = 0; i < assignmentGroup.assignments.length; i++) {
          const assignment = assignmentGroup.assignments[i];
  
          try {
            // Validate assignment object
            if (typeof assignment.id !== "number" || typeof assignment.points_possible !== "number") {
              throw new Error(
                `Invalid assignment data for assignment: ${JSON.stringify(assignment)}`
              );
            }
  
            // if/else statement #1:
            if (new Date(assignment.due_at) > new Date()) {
              // If assignment is not yet due, skip it using 'continue'
              continue;
            } else {
              // It's past or on the due date, let's proceed
            }
  
            // If points_possible is 0, skip this assignment as well
            if (assignment.points_possible === 0) {
              console.warn(`Skipping assignment ${assignment.id} due to zero points_possible.`);
              continue;
            }
  
            // Find submission for this learner/assignment
            const submission = learnerSubmissions.find(
              (sub) => sub.assignment_id === assignment.id && sub.learner_id === learner.learner_id
            );
  
            // if/else statement #2:
            if (!submission) {
              // If no submission, set the assignment's percentage to 0
              learnerData[assignment.id] = 0;
            } else {
              // We have a submission, let's calculate the score
              let score = submission.submission.score;
  
              // Another if/else scenario for late penalty
              if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
                // Deduct 10% if submitted late
                score -= assignment.points_possible * 0.1;
              } else {
                // Otherwise, no penalty
              }
  
              const percentage = (score / assignment.points_possible) * 100;
              learnerData[assignment.id] = percentage;
  
              // Update totals for the weighted average
              totalWeightedScore += score;
              totalPointsPossible += assignment.points_possible;
            }
          } catch (error) {
            // In a real production setup, you might log more details about the assignment/user
            console.error(`Error processing assignment ${assignment.id}:`, error.message);
          }
        }
  
        // Calculate weighted average
        learnerData.avg =
          totalPointsPossible > 0 ? (totalWeightedScore / totalPointsPossible) * 100 : 0;
  
        results.push(learnerData);
      }
  
      return results;
    } catch (error) {
      console.error("Error in getLearnerData:", error.message);
      // Rethrow if you want it to be handled by an outer try/catch
      throw error;
    }
  }
  
  // Example Data
  const courseInfo = { id: 1, name: "JavaScript Basics" };
  const assignmentGroup = {
    id: 101,
    name: "Group 1",
    course_id: 1,
    group_weight: 50,
    assignments: [
      { id: 201, name: "Assignment 1", due_at: "2025-01-01T23:59:59Z", points_possible: 100 },
      { id: 202, name: "Assignment 2", due_at: "2025-02-01T23:59:59Z", points_possible: 200 },
    ],
  };
  const learnerSubmissions = [
    {
      learner_id: 1,
      assignment_id: 201,
      submission: { submitted_at: "2025-01-01T12:00:00Z", score: 90 },
    },
    {
      learner_id: 1,
      assignment_id: 202,
      submission: { submitted_at: "2025-02-02T12:00:00Z", score: 180 },
    },
    {
      learner_id: 2,
      assignment_id: 201,
      submission: { submitted_at: "2025-01-01T23:00:00Z", score: 70 },
    },
    {
      learner_id: 2,
      assignment_id: 202,
      submission: { submitted_at: "2025-02-01T23:00:00Z", score: 150 },
    },
  ];
  
  // Outer try/catch to handle rethrown errors
  try {
    const data = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
    console.log("Learner Data:", data);
  } catch (error) {
    console.error("Failed to retrieve learner data:", error.message);
  }