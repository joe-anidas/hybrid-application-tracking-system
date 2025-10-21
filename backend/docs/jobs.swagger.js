/**
 * @swagger
 * /api/jobs/create:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     description: Create a new job posting. Only accessible by Admin users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - department
 *               - location
 *               - description
 *               - requirements
 *               - responsibilities
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Full Stack Developer
 *               department:
 *                 type: string
 *                 example: Engineering
 *               location:
 *                 type: string
 *                 example: Remote
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *                 default: full-time
 *               jobType:
 *                 type: string
 *                 enum: [technical, non-technical]
 *                 default: technical
 *               level:
 *                 type: string
 *                 enum: [entry, mid, senior, lead, executive]
 *                 default: mid
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               salaryMin:
 *                 type: number
 *                 example: 80000
 *               salaryMax:
 *                 type: number
 *                 example: 120000
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job posting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Forbidden - Admin access required
 *
 * /api/jobs/all:
 *   get:
 *     summary: Get all job postings
 *     tags: [Jobs]
 *     description: Retrieve all job postings with filtering, sorting, and pagination. Publicly accessible.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [technical, non-technical]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, closed]
 *           default: active
 *     responses:
 *       200:
 *         description: Job postings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     description: Retrieve a specific job posting by its ID. Publicly accessible.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *
 *   put:
 *     summary: Update job posting
 *     tags: [Jobs]
 *     description: Update an existing job posting. Only accessible by Admin users.
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
 *             properties:
 *               title:
 *                 type: string
 *               department:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *               jobType:
 *                 type: string
 *                 enum: [technical, non-technical]
 *               level:
 *                 type: string
 *                 enum: [entry, mid, senior, lead, executive]
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, closed]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Job not found
 *
 *   delete:
 *     summary: Delete job posting
 *     tags: [Jobs]
 *     description: Delete a job posting. Only accessible by Admin users.
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
 *         description: Job deleted successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Job not found
 */
