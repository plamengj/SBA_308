# SBA 308 - JavaScript Fundamentals: Learner Data Processor

## Overview
This project processes data for a learning management system (LMS) by calculating weighted averages and assignment scores for learners. The program takes course data, assignment group data, and learner submission data as input and outputs a structured array of learner data, including their weighted average scores and individual assignment percentages.

## Features
- Validates course and assignment data for mismatches.
- Excludes assignments that are not yet due.
- Deducts 10% of the total score for late submissions.
- Calculates weighted average scores for learners based on assignment weights.
- Outputs detailed learner data in the specified format.

## Requirements Met
This project satisfies all requirements listed in the assessment:
- Proper use of `let` and `const` for variable declarations.
- Use of operators for calculations and Boolean logic for flow control.
- Implementation of `if/else` statements and data validation using `try/catch`.
- Multiple loops (`forEach`) with control statements (`return` for skipping invalid data).
- Manipulation of arrays and objects for data transformation.
- Encapsulation of logic in reusable functions.

## Input Data
The program accepts the following:
1. **CourseInfo**
   ```json
   {
       "id": number,
       "name": string
   }
