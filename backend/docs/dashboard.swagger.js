/**
 * @swagger
 * /api/dashboard/applicant:
 *   get:
 *     summary: Get applicant dashboard data
 *     tags: [Dashboard]
 *     description: Retrieve dashboard statistics and recent activity for authenticated applicant user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalApplications:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     interviews:
 *                       type: integer
 *                     offers:
 *                       type: integer
 *                     rejections:
 *                       type: integer
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       action:
 *                         type: string
 *                       company:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *       403:
 *         description: Forbidden - Applicant access required
 *
 * /api/dashboard/bot-mimic:
 *   get:
 *     summary: Get Bot Mimic dashboard data
 *     tags: [Dashboard]
 *     description: Retrieve dashboard statistics and recent activity for authenticated Bot Mimic user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalProcessed:
 *                       type: integer
 *                     todayProcessed:
 *                       type: integer
 *                     technicalRoles:
 *                       type: integer
 *                     averageProcessingTime:
 *                       type: string
 *                     successRate:
 *                       type: number
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Forbidden - Bot Mimic access required
 *
 * /api/dashboard/admin:
 *   get:
 *     summary: Get Admin dashboard data
 *     tags: [Dashboard]
 *     description: Retrieve dashboard statistics for authenticated Admin user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalApplications:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     activeJobPostings:
 *                       type: integer
 *                     nonTechnicalApplications:
 *                       type: integer
 *                     pendingReview:
 *                       type: integer
 *       403:
 *         description: Forbidden - Admin access required
 */
