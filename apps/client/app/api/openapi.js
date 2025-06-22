/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         profileImageUrl:
 *           type: string
 *         lastSignInAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         courses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 *         quizAttempts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuizAttempt'
 *         conversations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Conversation'
 *       required:
 *         - id
 *         - email
 *         - createdAt
 *         - updatedAt
 *         - courses
 *         - quizAttempts
 *         - conversations
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         courseId:
 *           type: string
 *         systemPrompt:
 *           type: string
 *         aiModelId:
 *           type: string
 *         lastUpdate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           $ref: '#/components/schemas/User'
 *         aiModel:
 *           type: object
 *           $ref: '#/components/schemas/LLModel'
 *         course:
 *           type: object
 *           $ref: '#/components/schemas/Course'
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *       required:
 *         - id
 *         - lastUpdate
 *         - createdAt
 *         - messages
 *     LLModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         provider:
 *           type: string
 *           $ref: '#/components/schemas/LLMProvider'
 *         modelName:
 *           type: string
 *         displayName:
 *           type: string
 *         contextWindow:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         conversations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Conversation'
 *       required:
 *         - id
 *         - provider
 *         - modelName
 *         - createdAt
 *         - updatedAt
 *         - conversations
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         conversationId:
 *           type: string
 *         isUser:
 *           type: boolean
 *         parts:
 *           type: object
 *         timestamp:
 *           type: string
 *           format: date-time
 *         conversation:
 *           type: object
 *           $ref: '#/components/schemas/Conversation'
 *       required:
 *         - id
 *         - conversationId
 *         - isUser
 *         - parts
 *         - timestamp
 *         - conversation
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         creatorId:
 *           type: string
 *         conversationId:
 *           type: string
 *         topic:
 *           type: string
 *         goal:
 *           type: string
 *         title:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         isPublic:
 *           type: boolean
 *         creator:
 *           type: object
 *           $ref: '#/components/schemas/User'
 *         conversation:
 *           type: object
 *           $ref: '#/components/schemas/Conversation'
 *         chapters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Chapter'
 *       required:
 *         - id
 *         - creatorId
 *         - topic
 *         - goal
 *         - createdAt
 *         - updatedAt
 *         - isPublic
 *         - creator
 *         - chapters
 *     Chapter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         courseId:
 *           type: string
 *         title:
 *           type: string
 *         order:
 *           type: integer
 *         status:
 *           type: string
 *           $ref: '#/components/schemas/ChapterStatus'
 *         objectives:
 *           type: string
 *         content:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         course:
 *           type: object
 *           $ref: '#/components/schemas/Course'
 *         quizzes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Quiz'
 *       required:
 *         - id
 *         - courseId
 *         - order
 *         - status
 *         - objectives
 *         - createdAt
 *         - updatedAt
 *         - course
 *         - quizzes
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         chapterId:
 *           type: string
 *         title:
 *           type: string
 *         quizType:
 *           type: string
 *           $ref: '#/components/schemas/QuizType'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         chapter:
 *           type: object
 *           $ref: '#/components/schemas/Chapter'
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Question'
 *         attempts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuizAttempt'
 *       required:
 *         - id
 *         - chapterId
 *         - createdAt
 *         - updatedAt
 *         - chapter
 *         - questions
 *         - attempts
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         quizId:
 *           type: string
 *         order:
 *           type: integer
 *         type:
 *           type: string
 *           $ref: '#/components/schemas/QuizType'
 *         text:
 *           type: string
 *         options:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         quiz:
 *           type: object
 *           $ref: '#/components/schemas/Quiz'
 *         responses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserQuizResponse'
 *       required:
 *         - id
 *         - quizId
 *         - order
 *         - type
 *         - text
 *         - createdAt
 *         - updatedAt
 *         - quiz
 *         - responses
 *     QuizAttempt:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         quizId:
 *           type: string
 *         score:
 *           type: number
 *         status:
 *           type: string
 *           $ref: '#/components/schemas/QuizAttemptStatus'
 *         startedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           $ref: '#/components/schemas/User'
 *         quiz:
 *           type: object
 *           $ref: '#/components/schemas/Quiz'
 *         responses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserQuizResponse'
 *       required:
 *         - id
 *         - userId
 *         - quizId
 *         - status
 *         - startedAt
 *         - createdAt
 *         - updatedAt
 *         - user
 *         - quiz
 *         - responses
 *     UserQuizResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         quizAttemptId:
 *           type: string
 *         questionId:
 *           type: string
 *         userAnswer:
 *           type: object
 *         isCorrect:
 *           type: boolean
 *         submittedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         quizAttempt:
 *           type: object
 *           $ref: '#/components/schemas/QuizAttempt'
 *         question:
 *           type: object
 *           $ref: '#/components/schemas/Question'
 *       required:
 *         - id
 *         - quizAttemptId
 *         - questionId
 *         - userAnswer
 *         - createdAt
 *         - quizAttempt
 *         - question
 *     ChapterStatus:
 *       type: string
 *       enum:
 *         - NOT_STARTED
 *         - IN_PROGRESS
 *         - FINISHED
 *     QuizType:
 *       type: string
 *       enum:
 *         - SINGLE_CHOICE
 *         - MULTIPLE_CHOICE
 *         - TRUE_FALSE
 *     QuizAttemptStatus:
 *       type: string
 *       enum:
 *         - IN_PROGRESS
 *         - COMPLETED
 *         - ABANDONED
 *     LLMProvider:
 *       type: string
 *       enum:
 *         - GOOGLE
 *         - DEEPSEEK
 */
