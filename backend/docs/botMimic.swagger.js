/**
 * @swagger
 * /api/bot-mimic/stats:
 *   get:
 *     summary: Get Bot Mimic statistics
 *     tags: [Bot Mimic]
 *     description: Retrieve processing statistics for the Bot Mimic dashboard. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalApplications:
 *                       type: integer
 *                     submittedApplications:
 *                       type: integer
 *                     underReviewApplications:
 *                       type: integer
 *                     shortlistedApplications:
 *                       type: integer
 *                     acceptedApplications:
 *                       type: integer
 *                     rejectedApplications:
 *                       type: integer
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/applications:
 *   get:
 *     summary: Get technical applications
 *     tags: [Bot Mimic]
 *     description: Retrieve all applications for technical job postings. Bot Mimic access required.
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
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/process-single/{id}:
 *   post:
 *     summary: Process single application
 *     tags: [Bot Mimic]
 *     description: Automatically process a single application through status progression. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application processed successfully
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
 *         description: Application is not for technical role or cannot be processed further
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *       404:
 *         description: Application not found
 *
 * /api/bot-mimic/process-batch:
 *   post:
 *     summary: Process multiple applications
 *     tags: [Bot Mimic]
 *     description: Automatically process multiple applications in batch. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationIds
 *             properties:
 *               applicationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of application IDs to process
 *     responses:
 *       200:
 *         description: Batch processing completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     totalProcessed:
 *                       type: integer
 *                     successful:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/auto-process:
 *   post:
 *     summary: Start automatic processing
 *     tags: [Bot Mimic]
 *     description: Start automated continuous processing of technical applications. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intervalMinutes
 *             properties:
 *               intervalMinutes:
 *                 type: integer
 *                 minimum: 1
 *                 description: Processing interval in minutes
 *     responses:
 *       200:
 *         description: Auto-processing started
 *       400:
 *         description: Invalid interval
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/activity-log:
 *   get:
 *     summary: Get Bot Mimic activity log
 *     tags: [Bot Mimic]
 *     description: Retrieve recent activity log for Bot Mimic actions. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Activity log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/auto-process-status:
 *   get:
 *     summary: Get auto-processing status
 *     tags: [Bot Mimic]
 *     description: Get current status of automated processing. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: object
 *                   properties:
 *                     isRunning:
 *                       type: boolean
 *                     intervalMinutes:
 *                       type: integer
 *                     lastRunTime:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/auto-process/enable:
 *   post:
 *     summary: Enable auto-processing
 *     tags: [Bot Mimic]
 *     description: Enable automatic processing with specified interval. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intervalMinutes
 *             properties:
 *               intervalMinutes:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Auto-processing enabled
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/bot-mimic/auto-process/disable:
 *   post:
 *     summary: Disable auto-processing
 *     tags: [Bot Mimic]
 *     description: Disable automatic processing. Bot Mimic access required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Auto-processing disabled
 *       403:
 *         description: Forbidden - Bot Mimic access required
 */
