// Helper function to validate data types
function validateData(courseInfo, assignmentGroup, learnerSubmissions) {
    if (!courseInfo || typeof courseInfo.id !== 'number') {
      throw new Error('Invalid course information');
    }
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error('Assignment group does not belong to course');
    }
    if (!Array.isArray(assignmentGroup.assignments)) {
      throw new Error('Invalid assignments array');
    }
    if (!Array.isArray(learnerSubmissions)) {
      throw new Error('Invalid learner submissions');
    }
  }
  
  // Helper function to check if assignment is due
  function isAssignmentDue(dueDate) {
    const now = new Date();
    return new Date(dueDate) < now;
  }
  
  // Helper function to calculate score with late penalty
  function calculateScore(submission, assignment) {
    let score = submission.submission.score;
    const dueDate = new Date(assignment.due_at);
    const submittedDate = new Date(submission.submission.submitted_at);
  
    // Deduct 10% if submitted late
    if (submittedDate > dueDate) {
      score -= assignment.points_possible * 0.1;
    }
  
    // Ensure the score never goes below 0
    return Math.max(score, 0);
  }
  
  function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    try {
      // Validate input data
      validateData(courseInfo, assignmentGroup, learnerSubmissions);
  
      // Create a map to aggregate data for each learner
      const learnerMap = new Map();
  
      // ----- Loop #1: Classic for loop over submissions -----
      for (let i = 0; i < learnerSubmissions.length; i++) {
        const submission = learnerSubmissions[i];
  
        // ----- Loop #2: Classic for loop over assignments -----
        for (let j = 0; j < assignmentGroup.assignments.length; j++) {
          const assignment = assignmentGroup.assignments[j];
  
          // If this assignment matches the submission
          if (assignment.id === submission.assignment_id) {
            // Skip if assignment isn't due yet
            if (!isAssignmentDue(assignment.due_at)) {
              continue; // loop control keyword #1
            }
  
            // if/else statement #1
            if (assignment.points_possible <= 0) {
              console.warn(`Invalid points possible for assignment ${assignment.id}`);
              continue; // skip this assignment
            } else {
              // points_possible is valid, so we can process further
            }
  
            // Initialize learner data if not already present
            if (!learnerMap.has(submission.learner_id)) {
              learnerMap.set(submission.learner_id, {
                id: submission.learner_id,
                totalScore: 0,
                totalPossible: 0,
                scores: {}
              });
            }
  
            const learnerData = learnerMap.get(submission.learner_id);
            const adjustedScore = calculateScore(submission, assignment);
  
            // if/else statement #2
            let percentage;
            if (adjustedScore === 0) {
              // If the adjusted score calculates to 0, set percentage to 0
              percentage = 0;
            } else {
              // Otherwise, compute the actual percentage
              percentage = (adjustedScore / assignment.points_possible) * 100;
            }
  
            // Store data
            learnerData.scores[assignment.id] = Number(percentage.toFixed(2));
            learnerData.totalScore += adjustedScore;
            learnerData.totalPossible += assignment.points_possible;
  
            // We found the matching assignment, so break out of the assignments loop
            break; // loop control keyword #2
          }
        }
      }
  
      // Convert map to final result format
      const results = [];
      for (const [learnerId, data] of learnerMap) {
        const avg =
          data.totalPossible > 0
            ? Number(((data.totalScore / data.totalPossible) * 100).toFixed(2))
            : 0;
  
        results.push({
          id: learnerId,
          avg,
          ...data.scores
        });
      }
  
      return results;
    } catch (error) {
      console.error('Error in getLearnerData:', error.message);
      throw error;
    }
  }
  
  // Example usage
  const courseInfo = { id: 1, name: "JavaScript Basics" };
  const assignmentGroup = {
    id: 101,
    name: "Group 1",
    course_id: 1,
    group_weight: 50,
    assignments: [
      { id: 201, name: "Assignment 1", due_at: "2023-01-01", points_possible: 100 },
      { id: 202, name: "Assignment 2", due_at: "2023-02-01", points_possible: 200 }
    ]
  };
  const learnerSubmissions = [
    {
      learner_id: 1,
      assignment_id: 201,
      submission: { submitted_at: "2023-01-01", score: 90 }
    },
    {
      learner_id: 1,
      assignment_id: 202,
      submission: { submitted_at: "2023-02-02", score: 180 } // late submission
    },
    {
      learner_id: 2,
      assignment_id: 201,
      submission: { submitted_at: "2023-01-01", score: 70 }
    },
    {
      learner_id: 2,
      assignment_id: 202,
      submission: { submitted_at: "2023-02-01", score: 150 }
    }
  ];
  
  try {
    const results = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
    console.log("Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Application error:", error.message);
  }
  