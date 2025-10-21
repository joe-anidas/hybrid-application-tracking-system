/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve all users in the system with their statistics. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/User'
 *                       - type: object
 *                         properties:
 *                           applicationCount:
 *                             type: integer
 *                             description: Number of applications (for Applicant users)
 *       403:
 *         description: Forbidden - Admin access required
 *
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     description: Create a new Admin or Bot Mimic user. Only Admin users can create other admin/bot users. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [Admin, Bot Mimic]
 *                 description: Only Admin and Bot Mimic roles can be created via this endpoint
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error or user already exists
 *       403:
 *         description: Forbidden - Admin access required
 *
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     description: Delete a user from the system. Cannot delete your own account. Admin access required.
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
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete own account
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */
