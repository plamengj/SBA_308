// Function to calculate learner data
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate that the AssignmentGroup belongs to the CourseInfo
    if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("AssignmentGroup course_id does not match CourseInfo id.");
    }

    // Prepare the output array
    const results = [];

    learnerSubmissions.forEach((learner) => {
        const learnerData = {
            id: learner.learner_id,
            avg: 0,
        };

        let totalWeightedScore = 0;
        let totalPointsPossible = 0;

        assignmentGroup.assignments.forEach((assignment) => {
            const submission = learnerSubmissions.find(
                (sub) => sub.assignment_id === assignment.id && sub.learner_id === learner.learner_id
            );

            // Skip assignments not yet due
            if (new Date(assignment.due_at) > new Date()) {
                return;
            }

            // Check for invalid points_possible
            if (assignment.points_possible === 0) {
                console.warn(`Skipping assignment ${assignment.id} due to zero points_possible.`);
                return;
            }

            // If no submission, assume a score of 0
            if (!submission) {
                learnerData[assignment.id] = 0;
                return;
            }

            // Calculate score and apply late penalty if applicable
            let score = submission.submission.score;
            if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
                score -= assignment.points_possible * 0.1; // Deduct 10%
            }

            const percentage = (score / assignment.points_possible) * 100;

            // Add the assignment score to learnerData
            learnerData[assignment.id] = percentage;

            // Update totals for weighted average
            totalWeightedScore += score;
            totalPointsPossible += assignment.points_possible;
        });

        // Calculate weighted average
        learnerData.avg = totalPointsPossible > 0 ? (totalWeightedScore / totalPointsPossible) * 100 : 0;

        results.push(learnerData);
    });

    return results;
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

// Run the function and log the output
console.log(getLearnerData(courseInfo, assignmentGroup, learnerSubmissions));
