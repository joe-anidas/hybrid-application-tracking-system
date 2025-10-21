/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get applicant profile
 *     tags: [Profile]
 *     description: Retrieve the profile of the authenticated applicant user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   $ref: '#/components/schemas/ApplicantProfile'
 *       403:
 *         description: Forbidden - Applicant access required
 *
 *   put:
 *     summary: Create or update applicant profile
 *     tags: [Profile]
 *     description: Create a new profile or update existing profile for the authenticated applicant.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *               - location
 *               - summary
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               location:
 *                 type: string
 *                 example: New York, NY
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               summary:
 *                 type: string
 *                 description: Professional summary
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     degree:
 *                       type: string
 *                     institution:
 *                       type: string
 *                     year:
 *                       type: string
 *                     field:
 *                       type: string
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                     endDate:
 *                       type: string
 *                     current:
 *                       type: boolean
 *                     description:
 *                       type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               linkedin:
 *                 type: string
 *               github:
 *                 type: string
 *               portfolio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/ApplicantProfile'
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Forbidden - Applicant access required
 */
