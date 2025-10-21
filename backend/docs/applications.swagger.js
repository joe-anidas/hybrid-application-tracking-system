/**
 * @swagger
 * /api/applications/submit:
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     description: Submit an application for a job posting. Only accessible by Applicant users. Requires resume upload.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - coverLetter
 *               - whyInterested
 *               - relevantExperience
 *               - availableStartDate
 *               - resume
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job to apply for
 *               coverLetter:
 *                 type: string
 *               whyInterested:
 *                 type: string
 *               relevantExperience:
 *                 type: string
 *               availableStartDate:
 *                 type: string
 *                 format: date
 *               salaryExpectation:
 *                 type: number
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF or Word document, max 5MB)
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request - validation error or missing fields
 *       403:
 *         description: Forbidden - Applicant access required
 *       404:
 *         description: Job not found
 *
 * /api/applications/my-applications:
 *   get:
 *     summary: Get current user's applications
 *     tags: [Applications]
 *     description: Retrieve all applications submitted by the authenticated applicant.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       403:
 *         description: Forbidden - Applicant access required
 *
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     description: Retrieve a specific application by its ID. Applicants can only access their own applications.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       403:
 *         description: Forbidden - Not authorized to view this application
 *       404:
 *         description: Application not found
 *
 * /api/applications/{id}/withdraw:
 *   put:
 *     summary: Withdraw an application
 *     tags: [Applications]
 *     description: Withdraw a submitted application. Only the applicant who submitted it can withdraw.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Application cannot be withdrawn (already processed)
 *       403:
 *         description: Forbidden - Not authorized to withdraw this application
 *       404:
 *         description: Application not found
 *
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a specific job
 *     tags: [Applications]
 *     description: Retrieve all applications for a specific job posting. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Job not found
 *
 * /api/applications/admin/all:
 *   get:
 *     summary: Get all applications (Admin)
 *     tags: [Applications]
 *     description: Retrieve all applications with filtering options. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [submitted, under-review, shortlisted, rejected, withdrawn, accepted]
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [technical, non-technical]
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       403:
 *         description: Forbidden - Admin access required
 *
 * /api/applications/admin/{id}/status:
 *   put:
 *     summary: Update application status (Admin)
 *     tags: [Applications]
 *     description: Update the status of an application. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [submitted, under-review, shortlisted, rejected, withdrawn, accepted]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Application not found
 */
