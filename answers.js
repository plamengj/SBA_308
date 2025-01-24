function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate course ID in AssignmentGroup
    if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("AssignmentGroup course_id does not match CourseInfo id.");
    }

    // Output array
    const result = [];

    learnerSubmissions.forEach(learner => {
        const learnerData = {
            id: learner.learner_id,
            avg: 0,
        };

        let totalWeightedScore = 0;
        let totalPointsPossible = 0;

        assignmentGroup.assignments.forEach(assignment => {
            const submission = learnerSubmissions.find(
                sub => sub.assignment_id === assignment.id
            );

            // Skip assignments not due yet
            if (new Date(assignment.due_at) > new Date()) {
                return;
            }

            if (!submission) {
                learnerData[assignment.id] = 0;
                return;
            }

            // Check for invalid points_possible
            if (assignment.points_possible === 0) {
                console.warn(`Skipping assignment ${assignment.id} due to zero points_possible.`);
                return;
            }

            // Calculate score with late penalty if applicable
            let score = submission.submission.score;
            if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
                score -= assignment.points_possible * 0.1;
            }

            const percentage = (score / assignment.points_possible) * 100;

            // Add to learner data
            learnerData[assignment.id] = percentage;

            // Update totals for weighted average calculation
            totalWeightedScore += score;
            totalPointsPossible += assignment.points_possible;
        });

        // Calculate weighted average
        learnerData.avg = totalPointsPossible > 0 ? (totalWeightedScore / totalPointsPossible) * 100 : 0;

        result.push(learnerData);
    });

    return result;
}
