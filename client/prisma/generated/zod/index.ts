import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','firstName','lastName','profileImageUrl','lastSignInAt','createdAt','updatedAt']);

export const ConversationScalarFieldEnumSchema = z.enum(['id','userId','courseId','systemPrompt','aiModelId','lastUpdate','createdAt']);

export const LLModelScalarFieldEnumSchema = z.enum(['id','provider','modelName','displayName','contextWindow','createdAt','updatedAt']);

export const MessageScalarFieldEnumSchema = z.enum(['id','conversationId','isUser','parts','timestamp']);

export const CourseScalarFieldEnumSchema = z.enum(['id','creatorId','conversationId','topic','goal','title','createdAt','updatedAt','isPublic']);

export const ChapterScalarFieldEnumSchema = z.enum(['id','courseId','title','order','status','objectives','content','createdAt','updatedAt']);

export const QuizScalarFieldEnumSchema = z.enum(['id','chapterId','title','quizType','createdAt','updatedAt']);

export const QuestionScalarFieldEnumSchema = z.enum(['id','quizId','order','type','text','options','createdAt','updatedAt']);

export const QuizAttemptScalarFieldEnumSchema = z.enum(['id','userId','quizId','score','status','startedAt','completedAt','createdAt','updatedAt']);

export const UserQuizResponseScalarFieldEnumSchema = z.enum(['id','quizAttemptId','questionId','userAnswer','isCorrect','submittedAt','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const ChapterStatusSchema = z.enum(['NOT_STARTED','IN_PROGRESS','FINISHED']);

export type ChapterStatusType = `${z.infer<typeof ChapterStatusSchema>}`

export const QuizTypeSchema = z.enum(['SINGLE_CHOICE','MULTIPLE_CHOICE','TRUE_FALSE']);

export type QuizTypeType = `${z.infer<typeof QuizTypeSchema>}`

export const QuizAttemptStatusSchema = z.enum(['IN_PROGRESS','COMPLETED','ABANDONED']);

export type QuizAttemptStatusType = `${z.infer<typeof QuizAttemptStatusSchema>}`

export const LLMProviderSchema = z.enum(['GOOGLE','DEEPSEEK']);

export type LLMProviderType = `${z.infer<typeof LLMProviderSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  lastSignInAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// CONVERSATION SCHEMA
/////////////////////////////////////////

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().nullable(),
  courseId: z.string().nullable(),
  systemPrompt: z.string().nullable(),
  aiModelId: z.string().nullable(),
  lastUpdate: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export type Conversation = z.infer<typeof ConversationSchema>

/////////////////////////////////////////
// LL MODEL SCHEMA
/////////////////////////////////////////

export const LLModelSchema = z.object({
  provider: LLMProviderSchema,
  id: z.string().uuid(),
  modelName: z.string(),
  displayName: z.string().nullable(),
  contextWindow: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type LLModel = z.infer<typeof LLModelSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string(),
  isUser: z.boolean(),
  parts: JsonValueSchema,
  timestamp: z.coerce.date(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// COURSE SCHEMA
/////////////////////////////////////////

export const CourseSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string(),
  conversationId: z.string().nullable(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isPublic: z.boolean(),
})

export type Course = z.infer<typeof CourseSchema>

/////////////////////////////////////////
// CHAPTER SCHEMA
/////////////////////////////////////////

export const ChapterSchema = z.object({
  status: ChapterStatusSchema,
  id: z.string().uuid(),
  courseId: z.string(),
  title: z.string().nullable(),
  order: z.number().int(),
  objectives: z.string().array(),
  content: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Chapter = z.infer<typeof ChapterSchema>

/////////////////////////////////////////
// QUIZ SCHEMA
/////////////////////////////////////////

export const QuizSchema = z.object({
  quizType: QuizTypeSchema.nullable(),
  id: z.string().uuid(),
  chapterId: z.string(),
  title: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Quiz = z.infer<typeof QuizSchema>

/////////////////////////////////////////
// QUESTION SCHEMA
/////////////////////////////////////////

export const QuestionSchema = z.object({
  type: QuizTypeSchema,
  id: z.string().uuid(),
  quizId: z.string(),
  order: z.number().int(),
  text: z.string(),
  options: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Question = z.infer<typeof QuestionSchema>

/////////////////////////////////////////
// QUIZ ATTEMPT SCHEMA
/////////////////////////////////////////

export const QuizAttemptSchema = z.object({
  status: QuizAttemptStatusSchema,
  id: z.string().uuid(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().nullable(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>

/////////////////////////////////////////
// USER QUIZ RESPONSE SCHEMA
/////////////////////////////////////////

export const UserQuizResponseSchema = z.object({
  id: z.string().uuid(),
  quizAttemptId: z.string(),
  questionId: z.string(),
  userAnswer: JsonValueSchema,
  isCorrect: z.boolean().nullable(),
  submittedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
})

export type UserQuizResponse = z.infer<typeof UserQuizResponseSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  courses: z.union([z.boolean(),z.lazy(() => CourseFindManyArgsSchema)]).optional(),
  quizAttempts: z.union([z.boolean(),z.lazy(() => QuizAttemptFindManyArgsSchema)]).optional(),
  conversations: z.union([z.boolean(),z.lazy(() => ConversationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  courses: z.boolean().optional(),
  quizAttempts: z.boolean().optional(),
  conversations: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  profileImageUrl: z.boolean().optional(),
  lastSignInAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  courses: z.union([z.boolean(),z.lazy(() => CourseFindManyArgsSchema)]).optional(),
  quizAttempts: z.union([z.boolean(),z.lazy(() => QuizAttemptFindManyArgsSchema)]).optional(),
  conversations: z.union([z.boolean(),z.lazy(() => ConversationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONVERSATION
//------------------------------------------------------

export const ConversationIncludeSchema: z.ZodType<Prisma.ConversationInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  aiModel: z.union([z.boolean(),z.lazy(() => LLModelArgsSchema)]).optional(),
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ConversationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ConversationArgsSchema: z.ZodType<Prisma.ConversationDefaultArgs> = z.object({
  select: z.lazy(() => ConversationSelectSchema).optional(),
  include: z.lazy(() => ConversationIncludeSchema).optional(),
}).strict();

export const ConversationCountOutputTypeArgsSchema: z.ZodType<Prisma.ConversationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ConversationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ConversationCountOutputTypeSelectSchema: z.ZodType<Prisma.ConversationCountOutputTypeSelect> = z.object({
  messages: z.boolean().optional(),
}).strict();

export const ConversationSelectSchema: z.ZodType<Prisma.ConversationSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  courseId: z.boolean().optional(),
  systemPrompt: z.boolean().optional(),
  aiModelId: z.boolean().optional(),
  lastUpdate: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  aiModel: z.union([z.boolean(),z.lazy(() => LLModelArgsSchema)]).optional(),
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ConversationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LL MODEL
//------------------------------------------------------

export const LLModelIncludeSchema: z.ZodType<Prisma.LLModelInclude> = z.object({
  conversations: z.union([z.boolean(),z.lazy(() => ConversationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LLModelCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const LLModelArgsSchema: z.ZodType<Prisma.LLModelDefaultArgs> = z.object({
  select: z.lazy(() => LLModelSelectSchema).optional(),
  include: z.lazy(() => LLModelIncludeSchema).optional(),
}).strict();

export const LLModelCountOutputTypeArgsSchema: z.ZodType<Prisma.LLModelCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => LLModelCountOutputTypeSelectSchema).nullish(),
}).strict();

export const LLModelCountOutputTypeSelectSchema: z.ZodType<Prisma.LLModelCountOutputTypeSelect> = z.object({
  conversations: z.boolean().optional(),
}).strict();

export const LLModelSelectSchema: z.ZodType<Prisma.LLModelSelect> = z.object({
  id: z.boolean().optional(),
  provider: z.boolean().optional(),
  modelName: z.boolean().optional(),
  displayName: z.boolean().optional(),
  contextWindow: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  conversations: z.union([z.boolean(),z.lazy(() => ConversationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LLModelCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MESSAGE
//------------------------------------------------------

export const MessageIncludeSchema: z.ZodType<Prisma.MessageInclude> = z.object({
  conversation: z.union([z.boolean(),z.lazy(() => ConversationArgsSchema)]).optional(),
}).strict()

export const MessageArgsSchema: z.ZodType<Prisma.MessageDefaultArgs> = z.object({
  select: z.lazy(() => MessageSelectSchema).optional(),
  include: z.lazy(() => MessageIncludeSchema).optional(),
}).strict();

export const MessageSelectSchema: z.ZodType<Prisma.MessageSelect> = z.object({
  id: z.boolean().optional(),
  conversationId: z.boolean().optional(),
  isUser: z.boolean().optional(),
  parts: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  conversation: z.union([z.boolean(),z.lazy(() => ConversationArgsSchema)]).optional(),
}).strict()

// COURSE
//------------------------------------------------------

export const CourseIncludeSchema: z.ZodType<Prisma.CourseInclude> = z.object({
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  conversation: z.union([z.boolean(),z.lazy(() => ConversationArgsSchema)]).optional(),
  chapters: z.union([z.boolean(),z.lazy(() => ChapterFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CourseCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CourseArgsSchema: z.ZodType<Prisma.CourseDefaultArgs> = z.object({
  select: z.lazy(() => CourseSelectSchema).optional(),
  include: z.lazy(() => CourseIncludeSchema).optional(),
}).strict();

export const CourseCountOutputTypeArgsSchema: z.ZodType<Prisma.CourseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CourseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CourseCountOutputTypeSelectSchema: z.ZodType<Prisma.CourseCountOutputTypeSelect> = z.object({
  chapters: z.boolean().optional(),
}).strict();

export const CourseSelectSchema: z.ZodType<Prisma.CourseSelect> = z.object({
  id: z.boolean().optional(),
  creatorId: z.boolean().optional(),
  conversationId: z.boolean().optional(),
  topic: z.boolean().optional(),
  goal: z.boolean().optional(),
  title: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  conversation: z.union([z.boolean(),z.lazy(() => ConversationArgsSchema)]).optional(),
  chapters: z.union([z.boolean(),z.lazy(() => ChapterFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CourseCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CHAPTER
//------------------------------------------------------

export const ChapterIncludeSchema: z.ZodType<Prisma.ChapterInclude> = z.object({
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  quizzes: z.union([z.boolean(),z.lazy(() => QuizFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChapterCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ChapterArgsSchema: z.ZodType<Prisma.ChapterDefaultArgs> = z.object({
  select: z.lazy(() => ChapterSelectSchema).optional(),
  include: z.lazy(() => ChapterIncludeSchema).optional(),
}).strict();

export const ChapterCountOutputTypeArgsSchema: z.ZodType<Prisma.ChapterCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ChapterCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ChapterCountOutputTypeSelectSchema: z.ZodType<Prisma.ChapterCountOutputTypeSelect> = z.object({
  quizzes: z.boolean().optional(),
}).strict();

export const ChapterSelectSchema: z.ZodType<Prisma.ChapterSelect> = z.object({
  id: z.boolean().optional(),
  courseId: z.boolean().optional(),
  title: z.boolean().optional(),
  order: z.boolean().optional(),
  status: z.boolean().optional(),
  objectives: z.boolean().optional(),
  content: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  quizzes: z.union([z.boolean(),z.lazy(() => QuizFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChapterCountOutputTypeArgsSchema)]).optional(),
}).strict()

// QUIZ
//------------------------------------------------------

export const QuizIncludeSchema: z.ZodType<Prisma.QuizInclude> = z.object({
  chapter: z.union([z.boolean(),z.lazy(() => ChapterArgsSchema)]).optional(),
  questions: z.union([z.boolean(),z.lazy(() => QuestionFindManyArgsSchema)]).optional(),
  attempts: z.union([z.boolean(),z.lazy(() => QuizAttemptFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuizCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const QuizArgsSchema: z.ZodType<Prisma.QuizDefaultArgs> = z.object({
  select: z.lazy(() => QuizSelectSchema).optional(),
  include: z.lazy(() => QuizIncludeSchema).optional(),
}).strict();

export const QuizCountOutputTypeArgsSchema: z.ZodType<Prisma.QuizCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => QuizCountOutputTypeSelectSchema).nullish(),
}).strict();

export const QuizCountOutputTypeSelectSchema: z.ZodType<Prisma.QuizCountOutputTypeSelect> = z.object({
  questions: z.boolean().optional(),
  attempts: z.boolean().optional(),
}).strict();

export const QuizSelectSchema: z.ZodType<Prisma.QuizSelect> = z.object({
  id: z.boolean().optional(),
  chapterId: z.boolean().optional(),
  title: z.boolean().optional(),
  quizType: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  chapter: z.union([z.boolean(),z.lazy(() => ChapterArgsSchema)]).optional(),
  questions: z.union([z.boolean(),z.lazy(() => QuestionFindManyArgsSchema)]).optional(),
  attempts: z.union([z.boolean(),z.lazy(() => QuizAttemptFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuizCountOutputTypeArgsSchema)]).optional(),
}).strict()

// QUESTION
//------------------------------------------------------

export const QuestionIncludeSchema: z.ZodType<Prisma.QuestionInclude> = z.object({
  quiz: z.union([z.boolean(),z.lazy(() => QuizArgsSchema)]).optional(),
  responses: z.union([z.boolean(),z.lazy(() => UserQuizResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuestionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const QuestionArgsSchema: z.ZodType<Prisma.QuestionDefaultArgs> = z.object({
  select: z.lazy(() => QuestionSelectSchema).optional(),
  include: z.lazy(() => QuestionIncludeSchema).optional(),
}).strict();

export const QuestionCountOutputTypeArgsSchema: z.ZodType<Prisma.QuestionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => QuestionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const QuestionCountOutputTypeSelectSchema: z.ZodType<Prisma.QuestionCountOutputTypeSelect> = z.object({
  responses: z.boolean().optional(),
}).strict();

export const QuestionSelectSchema: z.ZodType<Prisma.QuestionSelect> = z.object({
  id: z.boolean().optional(),
  quizId: z.boolean().optional(),
  order: z.boolean().optional(),
  type: z.boolean().optional(),
  text: z.boolean().optional(),
  options: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  quiz: z.union([z.boolean(),z.lazy(() => QuizArgsSchema)]).optional(),
  responses: z.union([z.boolean(),z.lazy(() => UserQuizResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuestionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// QUIZ ATTEMPT
//------------------------------------------------------

export const QuizAttemptIncludeSchema: z.ZodType<Prisma.QuizAttemptInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  quiz: z.union([z.boolean(),z.lazy(() => QuizArgsSchema)]).optional(),
  responses: z.union([z.boolean(),z.lazy(() => UserQuizResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuizAttemptCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const QuizAttemptArgsSchema: z.ZodType<Prisma.QuizAttemptDefaultArgs> = z.object({
  select: z.lazy(() => QuizAttemptSelectSchema).optional(),
  include: z.lazy(() => QuizAttemptIncludeSchema).optional(),
}).strict();

export const QuizAttemptCountOutputTypeArgsSchema: z.ZodType<Prisma.QuizAttemptCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => QuizAttemptCountOutputTypeSelectSchema).nullish(),
}).strict();

export const QuizAttemptCountOutputTypeSelectSchema: z.ZodType<Prisma.QuizAttemptCountOutputTypeSelect> = z.object({
  responses: z.boolean().optional(),
}).strict();

export const QuizAttemptSelectSchema: z.ZodType<Prisma.QuizAttemptSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  quizId: z.boolean().optional(),
  score: z.boolean().optional(),
  status: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  quiz: z.union([z.boolean(),z.lazy(() => QuizArgsSchema)]).optional(),
  responses: z.union([z.boolean(),z.lazy(() => UserQuizResponseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuizAttemptCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER QUIZ RESPONSE
//------------------------------------------------------

export const UserQuizResponseIncludeSchema: z.ZodType<Prisma.UserQuizResponseInclude> = z.object({
  quizAttempt: z.union([z.boolean(),z.lazy(() => QuizAttemptArgsSchema)]).optional(),
  question: z.union([z.boolean(),z.lazy(() => QuestionArgsSchema)]).optional(),
}).strict()

export const UserQuizResponseArgsSchema: z.ZodType<Prisma.UserQuizResponseDefaultArgs> = z.object({
  select: z.lazy(() => UserQuizResponseSelectSchema).optional(),
  include: z.lazy(() => UserQuizResponseIncludeSchema).optional(),
}).strict();

export const UserQuizResponseSelectSchema: z.ZodType<Prisma.UserQuizResponseSelect> = z.object({
  id: z.boolean().optional(),
  quizAttemptId: z.boolean().optional(),
  questionId: z.boolean().optional(),
  userAnswer: z.boolean().optional(),
  isCorrect: z.boolean().optional(),
  submittedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  quizAttempt: z.union([z.boolean(),z.lazy(() => QuizAttemptArgsSchema)]).optional(),
  question: z.union([z.boolean(),z.lazy(() => QuestionArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  profileImageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastSignInAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  courses: z.lazy(() => CourseListRelationFilterSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptListRelationFilterSchema).optional(),
  conversations: z.lazy(() => ConversationListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  profileImageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastSignInAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  courses: z.lazy(() => CourseOrderByRelationAggregateInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptOrderByRelationAggregateInputSchema).optional(),
  conversations: z.lazy(() => ConversationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  profileImageUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastSignInAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  courses: z.lazy(() => CourseListRelationFilterSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptListRelationFilterSchema).optional(),
  conversations: z.lazy(() => ConversationListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  profileImageUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastSignInAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  profileImageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastSignInAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ConversationWhereInputSchema: z.ZodType<Prisma.ConversationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConversationWhereInputSchema),z.lazy(() => ConversationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConversationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConversationWhereInputSchema),z.lazy(() => ConversationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  courseId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiModelId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastUpdate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  aiModel: z.union([ z.lazy(() => LLModelNullableScalarRelationFilterSchema),z.lazy(() => LLModelWhereInputSchema) ]).optional().nullable(),
  course: z.union([ z.lazy(() => CourseNullableScalarRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional().nullable(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional()
}).strict();

export const ConversationOrderByWithRelationInputSchema: z.ZodType<Prisma.ConversationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  courseId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  systemPrompt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiModelId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastUpdate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  aiModel: z.lazy(() => LLModelOrderByWithRelationInputSchema).optional(),
  course: z.lazy(() => CourseOrderByWithRelationInputSchema).optional(),
  messages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ConversationWhereUniqueInputSchema: z.ZodType<Prisma.ConversationWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    courseId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    courseId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional(),
  AND: z.union([ z.lazy(() => ConversationWhereInputSchema),z.lazy(() => ConversationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConversationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConversationWhereInputSchema),z.lazy(() => ConversationWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiModelId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastUpdate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  aiModel: z.union([ z.lazy(() => LLModelNullableScalarRelationFilterSchema),z.lazy(() => LLModelWhereInputSchema) ]).optional().nullable(),
  course: z.union([ z.lazy(() => CourseNullableScalarRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional().nullable(),
  messages: z.lazy(() => MessageListRelationFilterSchema).optional()
}).strict());

export const ConversationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ConversationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  courseId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  systemPrompt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aiModelId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastUpdate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ConversationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ConversationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ConversationMinOrderByAggregateInputSchema).optional()
}).strict();

export const ConversationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ConversationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema),z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema),z.lazy(() => ConversationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  courseId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  aiModelId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastUpdate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const LLModelWhereInputSchema: z.ZodType<Prisma.LLModelWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LLModelWhereInputSchema),z.lazy(() => LLModelWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LLModelWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LLModelWhereInputSchema),z.lazy(() => LLModelWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => EnumLLMProviderFilterSchema),z.lazy(() => LLMProviderSchema) ]).optional(),
  modelName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  displayName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contextWindow: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  conversations: z.lazy(() => ConversationListRelationFilterSchema).optional()
}).strict();

export const LLModelOrderByWithRelationInputSchema: z.ZodType<Prisma.LLModelOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  modelName: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contextWindow: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  conversations: z.lazy(() => ConversationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const LLModelWhereUniqueInputSchema: z.ZodType<Prisma.LLModelWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    modelName: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    modelName: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  modelName: z.string().optional(),
  AND: z.union([ z.lazy(() => LLModelWhereInputSchema),z.lazy(() => LLModelWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LLModelWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LLModelWhereInputSchema),z.lazy(() => LLModelWhereInputSchema).array() ]).optional(),
  provider: z.union([ z.lazy(() => EnumLLMProviderFilterSchema),z.lazy(() => LLMProviderSchema) ]).optional(),
  displayName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contextWindow: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  conversations: z.lazy(() => ConversationListRelationFilterSchema).optional()
}).strict());

export const LLModelOrderByWithAggregationInputSchema: z.ZodType<Prisma.LLModelOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  modelName: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contextWindow: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LLModelCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LLModelAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LLModelMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LLModelMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LLModelSumOrderByAggregateInputSchema).optional()
}).strict();

export const LLModelScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LLModelScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LLModelScalarWhereWithAggregatesInputSchema),z.lazy(() => LLModelScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LLModelScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LLModelScalarWhereWithAggregatesInputSchema),z.lazy(() => LLModelScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => EnumLLMProviderWithAggregatesFilterSchema),z.lazy(() => LLMProviderSchema) ]).optional(),
  modelName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  displayName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  contextWindow: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const MessageWhereInputSchema: z.ZodType<Prisma.MessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isUser: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  parts: z.lazy(() => JsonFilterSchema).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  conversation: z.union([ z.lazy(() => ConversationScalarRelationFilterSchema),z.lazy(() => ConversationWhereInputSchema) ]).optional(),
}).strict();

export const MessageOrderByWithRelationInputSchema: z.ZodType<Prisma.MessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  isUser: z.lazy(() => SortOrderSchema).optional(),
  parts: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  conversation: z.lazy(() => ConversationOrderByWithRelationInputSchema).optional()
}).strict();

export const MessageWhereUniqueInputSchema: z.ZodType<Prisma.MessageWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema),z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isUser: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  parts: z.lazy(() => JsonFilterSchema).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  conversation: z.union([ z.lazy(() => ConversationScalarRelationFilterSchema),z.lazy(() => ConversationWhereInputSchema) ]).optional(),
}).strict());

export const MessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.MessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  isUser: z.lazy(() => SortOrderSchema).optional(),
  parts: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MessageMinOrderByAggregateInputSchema).optional()
}).strict();

export const MessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema),z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isUser: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  parts: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CourseWhereInputSchema: z.ZodType<Prisma.CourseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  topic: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  goal: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  conversation: z.union([ z.lazy(() => ConversationNullableScalarRelationFilterSchema),z.lazy(() => ConversationWhereInputSchema) ]).optional().nullable(),
  chapters: z.lazy(() => ChapterListRelationFilterSchema).optional()
}).strict();

export const CourseOrderByWithRelationInputSchema: z.ZodType<Prisma.CourseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  goal: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  conversation: z.lazy(() => ConversationOrderByWithRelationInputSchema).optional(),
  chapters: z.lazy(() => ChapterOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CourseWhereUniqueInputSchema: z.ZodType<Prisma.CourseWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    conversationId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    conversationId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  conversationId: z.string().optional(),
  AND: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  topic: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  goal: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  conversation: z.union([ z.lazy(() => ConversationNullableScalarRelationFilterSchema),z.lazy(() => ConversationWhereInputSchema) ]).optional().nullable(),
  chapters: z.lazy(() => ChapterListRelationFilterSchema).optional()
}).strict());

export const CourseOrderByWithAggregationInputSchema: z.ZodType<Prisma.CourseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  goal: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CourseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CourseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CourseMinOrderByAggregateInputSchema).optional()
}).strict();

export const CourseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CourseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CourseScalarWhereWithAggregatesInputSchema),z.lazy(() => CourseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseScalarWhereWithAggregatesInputSchema),z.lazy(() => CourseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  topic: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  goal: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  isPublic: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ChapterWhereInputSchema: z.ZodType<Prisma.ChapterWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChapterWhereInputSchema),z.lazy(() => ChapterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChapterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChapterWhereInputSchema),z.lazy(() => ChapterWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumChapterStatusFilterSchema),z.lazy(() => ChapterStatusSchema) ]).optional(),
  objectives: z.lazy(() => StringNullableListFilterSchema).optional(),
  content: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  course: z.union([ z.lazy(() => CourseScalarRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  quizzes: z.lazy(() => QuizListRelationFilterSchema).optional()
}).strict();

export const ChapterOrderByWithRelationInputSchema: z.ZodType<Prisma.ChapterOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  objectives: z.lazy(() => SortOrderSchema).optional(),
  content: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  course: z.lazy(() => CourseOrderByWithRelationInputSchema).optional(),
  quizzes: z.lazy(() => QuizOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ChapterWhereUniqueInputSchema: z.ZodType<Prisma.ChapterWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    courseId_order: z.lazy(() => ChapterCourseIdOrderCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    courseId_order: z.lazy(() => ChapterCourseIdOrderCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  courseId_order: z.lazy(() => ChapterCourseIdOrderCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ChapterWhereInputSchema),z.lazy(() => ChapterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChapterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChapterWhereInputSchema),z.lazy(() => ChapterWhereInputSchema).array() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  status: z.union([ z.lazy(() => EnumChapterStatusFilterSchema),z.lazy(() => ChapterStatusSchema) ]).optional(),
  objectives: z.lazy(() => StringNullableListFilterSchema).optional(),
  content: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  course: z.union([ z.lazy(() => CourseScalarRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  quizzes: z.lazy(() => QuizListRelationFilterSchema).optional()
}).strict());

export const ChapterOrderByWithAggregationInputSchema: z.ZodType<Prisma.ChapterOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  objectives: z.lazy(() => SortOrderSchema).optional(),
  content: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ChapterCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ChapterAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ChapterMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ChapterMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ChapterSumOrderByAggregateInputSchema).optional()
}).strict();

export const ChapterScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ChapterScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ChapterScalarWhereWithAggregatesInputSchema),z.lazy(() => ChapterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChapterScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChapterScalarWhereWithAggregatesInputSchema),z.lazy(() => ChapterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  order: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumChapterStatusWithAggregatesFilterSchema),z.lazy(() => ChapterStatusSchema) ]).optional(),
  objectives: z.lazy(() => StringNullableListFilterSchema).optional(),
  content: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const QuizWhereInputSchema: z.ZodType<Prisma.QuizWhereInput> = z.object({
  AND: z.union([ z.lazy(() => QuizWhereInputSchema),z.lazy(() => QuizWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizWhereInputSchema),z.lazy(() => QuizWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  chapterId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => EnumQuizTypeNullableFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  chapter: z.union([ z.lazy(() => ChapterScalarRelationFilterSchema),z.lazy(() => ChapterWhereInputSchema) ]).optional(),
  questions: z.lazy(() => QuestionListRelationFilterSchema).optional(),
  attempts: z.lazy(() => QuizAttemptListRelationFilterSchema).optional()
}).strict();

export const QuizOrderByWithRelationInputSchema: z.ZodType<Prisma.QuizOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  chapterId: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  quizType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  chapter: z.lazy(() => ChapterOrderByWithRelationInputSchema).optional(),
  questions: z.lazy(() => QuestionOrderByRelationAggregateInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptOrderByRelationAggregateInputSchema).optional()
}).strict();

export const QuizWhereUniqueInputSchema: z.ZodType<Prisma.QuizWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => QuizWhereInputSchema),z.lazy(() => QuizWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizWhereInputSchema),z.lazy(() => QuizWhereInputSchema).array() ]).optional(),
  chapterId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => EnumQuizTypeNullableFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  chapter: z.union([ z.lazy(() => ChapterScalarRelationFilterSchema),z.lazy(() => ChapterWhereInputSchema) ]).optional(),
  questions: z.lazy(() => QuestionListRelationFilterSchema).optional(),
  attempts: z.lazy(() => QuizAttemptListRelationFilterSchema).optional()
}).strict());

export const QuizOrderByWithAggregationInputSchema: z.ZodType<Prisma.QuizOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  chapterId: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  quizType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => QuizCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => QuizMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => QuizMinOrderByAggregateInputSchema).optional()
}).strict();

export const QuizScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.QuizScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => QuizScalarWhereWithAggregatesInputSchema),z.lazy(() => QuizScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizScalarWhereWithAggregatesInputSchema),z.lazy(() => QuizScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  chapterId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => EnumQuizTypeNullableWithAggregatesFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const QuestionWhereInputSchema: z.ZodType<Prisma.QuestionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => QuestionWhereInputSchema),z.lazy(() => QuestionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuestionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuestionWhereInputSchema),z.lazy(() => QuestionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumQuizTypeFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  options: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  quiz: z.union([ z.lazy(() => QuizScalarRelationFilterSchema),z.lazy(() => QuizWhereInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseListRelationFilterSchema).optional()
}).strict();

export const QuestionOrderByWithRelationInputSchema: z.ZodType<Prisma.QuestionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  options: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  quiz: z.lazy(() => QuizOrderByWithRelationInputSchema).optional(),
  responses: z.lazy(() => UserQuizResponseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const QuestionWhereUniqueInputSchema: z.ZodType<Prisma.QuestionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    quizId_order: z.lazy(() => QuestionQuizIdOrderCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    quizId_order: z.lazy(() => QuestionQuizIdOrderCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  quizId_order: z.lazy(() => QuestionQuizIdOrderCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => QuestionWhereInputSchema),z.lazy(() => QuestionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuestionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuestionWhereInputSchema),z.lazy(() => QuestionWhereInputSchema).array() ]).optional(),
  quizId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  type: z.union([ z.lazy(() => EnumQuizTypeFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  options: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  quiz: z.union([ z.lazy(() => QuizScalarRelationFilterSchema),z.lazy(() => QuizWhereInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseListRelationFilterSchema).optional()
}).strict());

export const QuestionOrderByWithAggregationInputSchema: z.ZodType<Prisma.QuestionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  options: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => QuestionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => QuestionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => QuestionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => QuestionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => QuestionSumOrderByAggregateInputSchema).optional()
}).strict();

export const QuestionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.QuestionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => QuestionScalarWhereWithAggregatesInputSchema),z.lazy(() => QuestionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuestionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuestionScalarWhereWithAggregatesInputSchema),z.lazy(() => QuestionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumQuizTypeWithAggregatesFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional(),
  text: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  options: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const QuizAttemptWhereInputSchema: z.ZodType<Prisma.QuizAttemptWhereInput> = z.object({
  AND: z.union([ z.lazy(() => QuizAttemptWhereInputSchema),z.lazy(() => QuizAttemptWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizAttemptWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizAttemptWhereInputSchema),z.lazy(() => QuizAttemptWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumQuizAttemptStatusFilterSchema),z.lazy(() => QuizAttemptStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  quiz: z.union([ z.lazy(() => QuizScalarRelationFilterSchema),z.lazy(() => QuizWhereInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseListRelationFilterSchema).optional()
}).strict();

export const QuizAttemptOrderByWithRelationInputSchema: z.ZodType<Prisma.QuizAttemptOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  quiz: z.lazy(() => QuizOrderByWithRelationInputSchema).optional(),
  responses: z.lazy(() => UserQuizResponseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const QuizAttemptWhereUniqueInputSchema: z.ZodType<Prisma.QuizAttemptWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => QuizAttemptWhereInputSchema),z.lazy(() => QuizAttemptWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizAttemptWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizAttemptWhereInputSchema),z.lazy(() => QuizAttemptWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumQuizAttemptStatusFilterSchema),z.lazy(() => QuizAttemptStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  quiz: z.union([ z.lazy(() => QuizScalarRelationFilterSchema),z.lazy(() => QuizWhereInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseListRelationFilterSchema).optional()
}).strict());

export const QuizAttemptOrderByWithAggregationInputSchema: z.ZodType<Prisma.QuizAttemptOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => QuizAttemptCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => QuizAttemptAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => QuizAttemptMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => QuizAttemptMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => QuizAttemptSumOrderByAggregateInputSchema).optional()
}).strict();

export const QuizAttemptScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.QuizAttemptScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => QuizAttemptScalarWhereWithAggregatesInputSchema),z.lazy(() => QuizAttemptScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizAttemptScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizAttemptScalarWhereWithAggregatesInputSchema),z.lazy(() => QuizAttemptScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumQuizAttemptStatusWithAggregatesFilterSchema),z.lazy(() => QuizAttemptStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserQuizResponseWhereInputSchema: z.ZodType<Prisma.UserQuizResponseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserQuizResponseWhereInputSchema),z.lazy(() => UserQuizResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserQuizResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserQuizResponseWhereInputSchema),z.lazy(() => UserQuizResponseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizAttemptId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  questionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAnswer: z.lazy(() => JsonFilterSchema).optional(),
  isCorrect: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  quizAttempt: z.union([ z.lazy(() => QuizAttemptScalarRelationFilterSchema),z.lazy(() => QuizAttemptWhereInputSchema) ]).optional(),
  question: z.union([ z.lazy(() => QuestionScalarRelationFilterSchema),z.lazy(() => QuestionWhereInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseOrderByWithRelationInputSchema: z.ZodType<Prisma.UserQuizResponseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizAttemptId: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  userAnswer: z.lazy(() => SortOrderSchema).optional(),
  isCorrect: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  submittedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  quizAttempt: z.lazy(() => QuizAttemptOrderByWithRelationInputSchema).optional(),
  question: z.lazy(() => QuestionOrderByWithRelationInputSchema).optional()
}).strict();

export const UserQuizResponseWhereUniqueInputSchema: z.ZodType<Prisma.UserQuizResponseWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    quizAttemptId_questionId: z.lazy(() => UserQuizResponseQuizAttemptIdQuestionIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    quizAttemptId_questionId: z.lazy(() => UserQuizResponseQuizAttemptIdQuestionIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  quizAttemptId_questionId: z.lazy(() => UserQuizResponseQuizAttemptIdQuestionIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserQuizResponseWhereInputSchema),z.lazy(() => UserQuizResponseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserQuizResponseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserQuizResponseWhereInputSchema),z.lazy(() => UserQuizResponseWhereInputSchema).array() ]).optional(),
  quizAttemptId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  questionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAnswer: z.lazy(() => JsonFilterSchema).optional(),
  isCorrect: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  quizAttempt: z.union([ z.lazy(() => QuizAttemptScalarRelationFilterSchema),z.lazy(() => QuizAttemptWhereInputSchema) ]).optional(),
  question: z.union([ z.lazy(() => QuestionScalarRelationFilterSchema),z.lazy(() => QuestionWhereInputSchema) ]).optional(),
}).strict());

export const UserQuizResponseOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserQuizResponseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizAttemptId: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  userAnswer: z.lazy(() => SortOrderSchema).optional(),
  isCorrect: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  submittedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserQuizResponseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserQuizResponseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserQuizResponseMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserQuizResponseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserQuizResponseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserQuizResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => UserQuizResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserQuizResponseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserQuizResponseScalarWhereWithAggregatesInputSchema),z.lazy(() => UserQuizResponseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quizAttemptId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  questionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAnswer: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  isCorrect: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  courses: z.lazy(() => CourseCreateNestedManyWithoutCreatorInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptCreateNestedManyWithoutUserInputSchema).optional(),
  conversations: z.lazy(() => ConversationCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  courses: z.lazy(() => CourseUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  conversations: z.lazy(() => ConversationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  courses: z.lazy(() => CourseUpdateManyWithoutCreatorNestedInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUpdateManyWithoutUserNestedInputSchema).optional(),
  conversations: z.lazy(() => ConversationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  courses: z.lazy(() => CourseUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  conversations: z.lazy(() => ConversationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConversationCreateInputSchema: z.ZodType<Prisma.ConversationCreateInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutConversationsInputSchema).optional(),
  aiModel: z.lazy(() => LLModelCreateNestedOneWithoutConversationsInputSchema).optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutConversationInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationUncheckedCreateInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  aiModelId: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseUncheckedCreateNestedOneWithoutConversationInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationUpdateInputSchema: z.ZodType<Prisma.ConversationUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutConversationsNestedInputSchema).optional(),
  aiModel: z.lazy(() => LLModelUpdateOneWithoutConversationsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneWithoutConversationNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiModelId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUncheckedUpdateOneWithoutConversationNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationCreateManyInputSchema: z.ZodType<Prisma.ConversationCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  aiModelId: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ConversationUpdateManyMutationInputSchema: z.ZodType<Prisma.ConversationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConversationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiModelId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LLModelCreateInputSchema: z.ZodType<Prisma.LLModelCreateInput> = z.object({
  id: z.string().uuid().optional(),
  provider: z.lazy(() => LLMProviderSchema),
  modelName: z.string(),
  displayName: z.string().optional().nullable(),
  contextWindow: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  conversations: z.lazy(() => ConversationCreateNestedManyWithoutAiModelInputSchema).optional()
}).strict();

export const LLModelUncheckedCreateInputSchema: z.ZodType<Prisma.LLModelUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  provider: z.lazy(() => LLMProviderSchema),
  modelName: z.string(),
  displayName: z.string().optional().nullable(),
  contextWindow: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  conversations: z.lazy(() => ConversationUncheckedCreateNestedManyWithoutAiModelInputSchema).optional()
}).strict();

export const LLModelUpdateInputSchema: z.ZodType<Prisma.LLModelUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => EnumLLMProviderFieldUpdateOperationsInputSchema) ]).optional(),
  modelName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contextWindow: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  conversations: z.lazy(() => ConversationUpdateManyWithoutAiModelNestedInputSchema).optional()
}).strict();

export const LLModelUncheckedUpdateInputSchema: z.ZodType<Prisma.LLModelUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => EnumLLMProviderFieldUpdateOperationsInputSchema) ]).optional(),
  modelName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contextWindow: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  conversations: z.lazy(() => ConversationUncheckedUpdateManyWithoutAiModelNestedInputSchema).optional()
}).strict();

export const LLModelCreateManyInputSchema: z.ZodType<Prisma.LLModelCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  provider: z.lazy(() => LLMProviderSchema),
  modelName: z.string(),
  displayName: z.string().optional().nullable(),
  contextWindow: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const LLModelUpdateManyMutationInputSchema: z.ZodType<Prisma.LLModelUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => EnumLLMProviderFieldUpdateOperationsInputSchema) ]).optional(),
  modelName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contextWindow: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LLModelUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LLModelUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => EnumLLMProviderFieldUpdateOperationsInputSchema) ]).optional(),
  modelName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contextWindow: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateInputSchema: z.ZodType<Prisma.MessageCreateInput> = z.object({
  id: z.string().uuid().optional(),
  isUser: z.boolean(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timestamp: z.coerce.date().optional(),
  conversation: z.lazy(() => ConversationCreateNestedOneWithoutMessagesInputSchema)
}).strict();

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  conversationId: z.string(),
  isUser: z.boolean(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timestamp: z.coerce.date().optional()
}).strict();

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  conversation: z.lazy(() => ConversationUpdateOneRequiredWithoutMessagesNestedInputSchema).optional()
}).strict();

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  conversationId: z.string(),
  isUser: z.boolean(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timestamp: z.coerce.date().optional()
}).strict();

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CourseCreateInputSchema: z.ZodType<Prisma.CourseCreateInput> = z.object({
  id: z.string().uuid().optional(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCoursesInputSchema),
  conversation: z.lazy(() => ConversationCreateNestedOneWithoutCourseInputSchema).optional(),
  chapters: z.lazy(() => ChapterCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateInputSchema: z.ZodType<Prisma.CourseUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  creatorId: z.string(),
  conversationId: z.string().optional().nullable(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  chapters: z.lazy(() => ChapterUncheckedCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUpdateInputSchema: z.ZodType<Prisma.CourseUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCoursesNestedInputSchema).optional(),
  conversation: z.lazy(() => ConversationUpdateOneWithoutCourseNestedInputSchema).optional(),
  chapters: z.lazy(() => ChapterUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  chapters: z.lazy(() => ChapterUncheckedUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseCreateManyInputSchema: z.ZodType<Prisma.CourseCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  creatorId: z.string(),
  conversationId: z.string().optional().nullable(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional()
}).strict();

export const CourseUpdateManyMutationInputSchema: z.ZodType<Prisma.CourseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CourseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChapterCreateInputSchema: z.ZodType<Prisma.ChapterCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutChaptersInputSchema),
  quizzes: z.lazy(() => QuizCreateNestedManyWithoutChapterInputSchema).optional()
}).strict();

export const ChapterUncheckedCreateInputSchema: z.ZodType<Prisma.ChapterUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quizzes: z.lazy(() => QuizUncheckedCreateNestedManyWithoutChapterInputSchema).optional()
}).strict();

export const ChapterUpdateInputSchema: z.ZodType<Prisma.ChapterUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutChaptersNestedInputSchema).optional(),
  quizzes: z.lazy(() => QuizUpdateManyWithoutChapterNestedInputSchema).optional()
}).strict();

export const ChapterUncheckedUpdateInputSchema: z.ZodType<Prisma.ChapterUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizzes: z.lazy(() => QuizUncheckedUpdateManyWithoutChapterNestedInputSchema).optional()
}).strict();

export const ChapterCreateManyInputSchema: z.ZodType<Prisma.ChapterCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChapterUpdateManyMutationInputSchema: z.ZodType<Prisma.ChapterUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChapterUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ChapterUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizCreateInputSchema: z.ZodType<Prisma.QuizCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chapter: z.lazy(() => ChapterCreateNestedOneWithoutQuizzesInputSchema),
  questions: z.lazy(() => QuestionCreateNestedManyWithoutQuizInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizUncheckedCreateInputSchema: z.ZodType<Prisma.QuizUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  chapterId: z.string(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  questions: z.lazy(() => QuestionUncheckedCreateNestedManyWithoutQuizInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUncheckedCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizUpdateInputSchema: z.ZodType<Prisma.QuizUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.lazy(() => ChapterUpdateOneRequiredWithoutQuizzesNestedInputSchema).optional(),
  questions: z.lazy(() => QuestionUpdateManyWithoutQuizNestedInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const QuizUncheckedUpdateInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  questions: z.lazy(() => QuestionUncheckedUpdateManyWithoutQuizNestedInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const QuizCreateManyInputSchema: z.ZodType<Prisma.QuizCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  chapterId: z.string(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuizUpdateManyMutationInputSchema: z.ZodType<Prisma.QuizUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizUncheckedUpdateManyInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuestionCreateInputSchema: z.ZodType<Prisma.QuestionCreateInput> = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quiz: z.lazy(() => QuizCreateNestedOneWithoutQuestionsInputSchema),
  responses: z.lazy(() => UserQuizResponseCreateNestedManyWithoutQuestionInputSchema).optional()
}).strict();

export const QuestionUncheckedCreateInputSchema: z.ZodType<Prisma.QuestionUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedCreateNestedManyWithoutQuestionInputSchema).optional()
}).strict();

export const QuestionUpdateInputSchema: z.ZodType<Prisma.QuestionUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quiz: z.lazy(() => QuizUpdateOneRequiredWithoutQuestionsNestedInputSchema).optional(),
  responses: z.lazy(() => UserQuizResponseUpdateManyWithoutQuestionNestedInputSchema).optional()
}).strict();

export const QuestionUncheckedUpdateInputSchema: z.ZodType<Prisma.QuestionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuestionNestedInputSchema).optional()
}).strict();

export const QuestionCreateManyInputSchema: z.ZodType<Prisma.QuestionCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuestionUpdateManyMutationInputSchema: z.ZodType<Prisma.QuestionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuestionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.QuestionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizAttemptCreateInputSchema: z.ZodType<Prisma.QuizAttemptCreateInput> = z.object({
  id: z.string().uuid().optional(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutQuizAttemptsInputSchema),
  quiz: z.lazy(() => QuizCreateNestedOneWithoutAttemptsInputSchema),
  responses: z.lazy(() => UserQuizResponseCreateNestedManyWithoutQuizAttemptInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedCreateInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedCreateNestedManyWithoutQuizAttemptInputSchema).optional()
}).strict();

export const QuizAttemptUpdateInputSchema: z.ZodType<Prisma.QuizAttemptUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutQuizAttemptsNestedInputSchema).optional(),
  quiz: z.lazy(() => QuizUpdateOneRequiredWithoutAttemptsNestedInputSchema).optional(),
  responses: z.lazy(() => UserQuizResponseUpdateManyWithoutQuizAttemptNestedInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedUpdateInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptNestedInputSchema).optional()
}).strict();

export const QuizAttemptCreateManyInputSchema: z.ZodType<Prisma.QuizAttemptCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuizAttemptUpdateManyMutationInputSchema: z.ZodType<Prisma.QuizAttemptUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizAttemptUncheckedUpdateManyInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseCreateInputSchema: z.ZodType<Prisma.UserQuizResponseCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  quizAttempt: z.lazy(() => QuizAttemptCreateNestedOneWithoutResponsesInputSchema),
  question: z.lazy(() => QuestionCreateNestedOneWithoutResponsesInputSchema)
}).strict();

export const UserQuizResponseUncheckedCreateInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  quizAttemptId: z.string(),
  questionId: z.string(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserQuizResponseUpdateInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttempt: z.lazy(() => QuizAttemptUpdateOneRequiredWithoutResponsesNestedInputSchema).optional(),
  question: z.lazy(() => QuestionUpdateOneRequiredWithoutResponsesNestedInputSchema).optional()
}).strict();

export const UserQuizResponseUncheckedUpdateInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttemptId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseCreateManyInputSchema: z.ZodType<Prisma.UserQuizResponseCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  quizAttemptId: z.string(),
  questionId: z.string(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserQuizResponseUpdateManyMutationInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttemptId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const CourseListRelationFilterSchema: z.ZodType<Prisma.CourseListRelationFilter> = z.object({
  every: z.lazy(() => CourseWhereInputSchema).optional(),
  some: z.lazy(() => CourseWhereInputSchema).optional(),
  none: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const QuizAttemptListRelationFilterSchema: z.ZodType<Prisma.QuizAttemptListRelationFilter> = z.object({
  every: z.lazy(() => QuizAttemptWhereInputSchema).optional(),
  some: z.lazy(() => QuizAttemptWhereInputSchema).optional(),
  none: z.lazy(() => QuizAttemptWhereInputSchema).optional()
}).strict();

export const ConversationListRelationFilterSchema: z.ZodType<Prisma.ConversationListRelationFilter> = z.object({
  every: z.lazy(() => ConversationWhereInputSchema).optional(),
  some: z.lazy(() => ConversationWhereInputSchema).optional(),
  none: z.lazy(() => ConversationWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const CourseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CourseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizAttemptOrderByRelationAggregateInputSchema: z.ZodType<Prisma.QuizAttemptOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConversationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ConversationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  profileImageUrl: z.lazy(() => SortOrderSchema).optional(),
  lastSignInAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  profileImageUrl: z.lazy(() => SortOrderSchema).optional(),
  lastSignInAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  profileImageUrl: z.lazy(() => SortOrderSchema).optional(),
  lastSignInAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const LLModelNullableScalarRelationFilterSchema: z.ZodType<Prisma.LLModelNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => LLModelWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LLModelWhereInputSchema).optional().nullable()
}).strict();

export const CourseNullableScalarRelationFilterSchema: z.ZodType<Prisma.CourseNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => CourseWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CourseWhereInputSchema).optional().nullable()
}).strict();

export const MessageListRelationFilterSchema: z.ZodType<Prisma.MessageListRelationFilter> = z.object({
  every: z.lazy(() => MessageWhereInputSchema).optional(),
  some: z.lazy(() => MessageWhereInputSchema).optional(),
  none: z.lazy(() => MessageWhereInputSchema).optional()
}).strict();

export const MessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConversationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ConversationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  aiModelId: z.lazy(() => SortOrderSchema).optional(),
  lastUpdate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConversationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ConversationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  aiModelId: z.lazy(() => SortOrderSchema).optional(),
  lastUpdate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ConversationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ConversationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  systemPrompt: z.lazy(() => SortOrderSchema).optional(),
  aiModelId: z.lazy(() => SortOrderSchema).optional(),
  lastUpdate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumLLMProviderFilterSchema: z.ZodType<Prisma.EnumLLMProviderFilter> = z.object({
  equals: z.lazy(() => LLMProviderSchema).optional(),
  in: z.lazy(() => LLMProviderSchema).array().optional(),
  notIn: z.lazy(() => LLMProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => NestedEnumLLMProviderFilterSchema) ]).optional(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const LLModelCountOrderByAggregateInputSchema: z.ZodType<Prisma.LLModelCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  modelName: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  contextWindow: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LLModelAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LLModelAvgOrderByAggregateInput> = z.object({
  contextWindow: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LLModelMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LLModelMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  modelName: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  contextWindow: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LLModelMinOrderByAggregateInputSchema: z.ZodType<Prisma.LLModelMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  modelName: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  contextWindow: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LLModelSumOrderByAggregateInputSchema: z.ZodType<Prisma.LLModelSumOrderByAggregateInput> = z.object({
  contextWindow: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumLLMProviderWithAggregatesFilterSchema: z.ZodType<Prisma.EnumLLMProviderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LLMProviderSchema).optional(),
  in: z.lazy(() => LLMProviderSchema).array().optional(),
  notIn: z.lazy(() => LLMProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => NestedEnumLLMProviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLLMProviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLLMProviderFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ConversationScalarRelationFilterSchema: z.ZodType<Prisma.ConversationScalarRelationFilter> = z.object({
  is: z.lazy(() => ConversationWhereInputSchema).optional(),
  isNot: z.lazy(() => ConversationWhereInputSchema).optional()
}).strict();

export const MessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.MessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  isUser: z.lazy(() => SortOrderSchema).optional(),
  parts: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  isUser: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  isUser: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ConversationNullableScalarRelationFilterSchema: z.ZodType<Prisma.ConversationNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ConversationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ConversationWhereInputSchema).optional().nullable()
}).strict();

export const ChapterListRelationFilterSchema: z.ZodType<Prisma.ChapterListRelationFilter> = z.object({
  every: z.lazy(() => ChapterWhereInputSchema).optional(),
  some: z.lazy(() => ChapterWhereInputSchema).optional(),
  none: z.lazy(() => ChapterWhereInputSchema).optional()
}).strict();

export const ChapterOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ChapterOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseCountOrderByAggregateInputSchema: z.ZodType<Prisma.CourseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  goal: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CourseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  goal: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseMinOrderByAggregateInputSchema: z.ZodType<Prisma.CourseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  conversationId: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  goal: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const EnumChapterStatusFilterSchema: z.ZodType<Prisma.EnumChapterStatusFilter> = z.object({
  equals: z.lazy(() => ChapterStatusSchema).optional(),
  in: z.lazy(() => ChapterStatusSchema).array().optional(),
  notIn: z.lazy(() => ChapterStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => NestedEnumChapterStatusFilterSchema) ]).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const CourseScalarRelationFilterSchema: z.ZodType<Prisma.CourseScalarRelationFilter> = z.object({
  is: z.lazy(() => CourseWhereInputSchema).optional(),
  isNot: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const QuizListRelationFilterSchema: z.ZodType<Prisma.QuizListRelationFilter> = z.object({
  every: z.lazy(() => QuizWhereInputSchema).optional(),
  some: z.lazy(() => QuizWhereInputSchema).optional(),
  none: z.lazy(() => QuizWhereInputSchema).optional()
}).strict();

export const QuizOrderByRelationAggregateInputSchema: z.ZodType<Prisma.QuizOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChapterCourseIdOrderCompoundUniqueInputSchema: z.ZodType<Prisma.ChapterCourseIdOrderCompoundUniqueInput> = z.object({
  courseId: z.string(),
  order: z.number()
}).strict();

export const ChapterCountOrderByAggregateInputSchema: z.ZodType<Prisma.ChapterCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  objectives: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChapterAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ChapterAvgOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChapterMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ChapterMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChapterMinOrderByAggregateInputSchema: z.ZodType<Prisma.ChapterMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChapterSumOrderByAggregateInputSchema: z.ZodType<Prisma.ChapterSumOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumChapterStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumChapterStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ChapterStatusSchema).optional(),
  in: z.lazy(() => ChapterStatusSchema).array().optional(),
  notIn: z.lazy(() => ChapterStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => NestedEnumChapterStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumChapterStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumChapterStatusFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const EnumQuizTypeNullableFilterSchema: z.ZodType<Prisma.EnumQuizTypeNullableFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional().nullable(),
  in: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ChapterScalarRelationFilterSchema: z.ZodType<Prisma.ChapterScalarRelationFilter> = z.object({
  is: z.lazy(() => ChapterWhereInputSchema).optional(),
  isNot: z.lazy(() => ChapterWhereInputSchema).optional()
}).strict();

export const QuestionListRelationFilterSchema: z.ZodType<Prisma.QuestionListRelationFilter> = z.object({
  every: z.lazy(() => QuestionWhereInputSchema).optional(),
  some: z.lazy(() => QuestionWhereInputSchema).optional(),
  none: z.lazy(() => QuestionWhereInputSchema).optional()
}).strict();

export const QuestionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.QuestionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizCountOrderByAggregateInputSchema: z.ZodType<Prisma.QuizCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  chapterId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  quizType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizMaxOrderByAggregateInputSchema: z.ZodType<Prisma.QuizMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  chapterId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  quizType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizMinOrderByAggregateInputSchema: z.ZodType<Prisma.QuizMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  chapterId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  quizType: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumQuizTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumQuizTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional().nullable(),
  in: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumQuizTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumQuizTypeNullableFilterSchema).optional()
}).strict();

export const EnumQuizTypeFilterSchema: z.ZodType<Prisma.EnumQuizTypeFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional(),
  in: z.lazy(() => QuizTypeSchema).array().optional(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeFilterSchema) ]).optional(),
}).strict();

export const QuizScalarRelationFilterSchema: z.ZodType<Prisma.QuizScalarRelationFilter> = z.object({
  is: z.lazy(() => QuizWhereInputSchema).optional(),
  isNot: z.lazy(() => QuizWhereInputSchema).optional()
}).strict();

export const UserQuizResponseListRelationFilterSchema: z.ZodType<Prisma.UserQuizResponseListRelationFilter> = z.object({
  every: z.lazy(() => UserQuizResponseWhereInputSchema).optional(),
  some: z.lazy(() => UserQuizResponseWhereInputSchema).optional(),
  none: z.lazy(() => UserQuizResponseWhereInputSchema).optional()
}).strict();

export const UserQuizResponseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserQuizResponseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuestionQuizIdOrderCompoundUniqueInputSchema: z.ZodType<Prisma.QuestionQuizIdOrderCompoundUniqueInput> = z.object({
  quizId: z.string(),
  order: z.number()
}).strict();

export const QuestionCountOrderByAggregateInputSchema: z.ZodType<Prisma.QuestionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  options: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuestionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.QuestionAvgOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuestionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.QuestionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuestionMinOrderByAggregateInputSchema: z.ZodType<Prisma.QuestionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuestionSumOrderByAggregateInputSchema: z.ZodType<Prisma.QuestionSumOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumQuizTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumQuizTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional(),
  in: z.lazy(() => QuizTypeSchema).array().optional(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumQuizTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumQuizTypeFilterSchema).optional()
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumQuizAttemptStatusFilterSchema: z.ZodType<Prisma.EnumQuizAttemptStatusFilter> = z.object({
  equals: z.lazy(() => QuizAttemptStatusSchema).optional(),
  in: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  notIn: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => NestedEnumQuizAttemptStatusFilterSchema) ]).optional(),
}).strict();

export const QuizAttemptCountOrderByAggregateInputSchema: z.ZodType<Prisma.QuizAttemptCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizAttemptAvgOrderByAggregateInputSchema: z.ZodType<Prisma.QuizAttemptAvgOrderByAggregateInput> = z.object({
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizAttemptMaxOrderByAggregateInputSchema: z.ZodType<Prisma.QuizAttemptMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizAttemptMinOrderByAggregateInputSchema: z.ZodType<Prisma.QuizAttemptMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  quizId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  completedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const QuizAttemptSumOrderByAggregateInputSchema: z.ZodType<Prisma.QuizAttemptSumOrderByAggregateInput> = z.object({
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const EnumQuizAttemptStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumQuizAttemptStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => QuizAttemptStatusSchema).optional(),
  in: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  notIn: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => NestedEnumQuizAttemptStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumQuizAttemptStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumQuizAttemptStatusFilterSchema).optional()
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const QuizAttemptScalarRelationFilterSchema: z.ZodType<Prisma.QuizAttemptScalarRelationFilter> = z.object({
  is: z.lazy(() => QuizAttemptWhereInputSchema).optional(),
  isNot: z.lazy(() => QuizAttemptWhereInputSchema).optional()
}).strict();

export const QuestionScalarRelationFilterSchema: z.ZodType<Prisma.QuestionScalarRelationFilter> = z.object({
  is: z.lazy(() => QuestionWhereInputSchema).optional(),
  isNot: z.lazy(() => QuestionWhereInputSchema).optional()
}).strict();

export const UserQuizResponseQuizAttemptIdQuestionIdCompoundUniqueInputSchema: z.ZodType<Prisma.UserQuizResponseQuizAttemptIdQuestionIdCompoundUniqueInput> = z.object({
  quizAttemptId: z.string(),
  questionId: z.string()
}).strict();

export const UserQuizResponseCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserQuizResponseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizAttemptId: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  userAnswer: z.lazy(() => SortOrderSchema).optional(),
  isCorrect: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserQuizResponseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserQuizResponseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizAttemptId: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  isCorrect: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserQuizResponseMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserQuizResponseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  quizAttemptId: z.lazy(() => SortOrderSchema).optional(),
  questionId: z.lazy(() => SortOrderSchema).optional(),
  isCorrect: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const CourseCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.CourseCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutCreatorInputSchema),z.lazy(() => CourseCreateWithoutCreatorInputSchema).array(),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CourseCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateWithoutUserInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConversationCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ConversationCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutUserInputSchema),z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CourseUncheckedCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUncheckedCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutCreatorInputSchema),z.lazy(() => CourseCreateWithoutCreatorInputSchema).array(),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CourseCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateWithoutUserInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConversationUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutUserInputSchema),z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const CourseUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.CourseUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutCreatorInputSchema),z.lazy(() => CourseCreateWithoutCreatorInputSchema).array(),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CourseUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CourseUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CourseCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CourseUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CourseUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CourseUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => CourseUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CourseScalarWhereInputSchema),z.lazy(() => CourseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.QuizAttemptUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateWithoutUserInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuizAttemptScalarWhereInputSchema),z.lazy(() => QuizAttemptScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConversationUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ConversationUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutUserInputSchema),z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConversationScalarWhereInputSchema),z.lazy(() => ConversationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CourseUncheckedUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutCreatorInputSchema),z.lazy(() => CourseCreateWithoutCreatorInputSchema).array(),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CourseCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CourseUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CourseUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CourseCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CourseWhereUniqueInputSchema),z.lazy(() => CourseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CourseUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CourseUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CourseUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => CourseUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CourseScalarWhereInputSchema),z.lazy(() => CourseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateWithoutUserInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuizAttemptScalarWhereInputSchema),z.lazy(() => QuizAttemptScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConversationUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutUserInputSchema),z.lazy(() => ConversationCreateWithoutUserInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConversationUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ConversationUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ConversationUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConversationScalarWhereInputSchema),z.lazy(() => ConversationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutConversationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutConversationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutConversationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const LLModelCreateNestedOneWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelCreateNestedOneWithoutConversationsInput> = z.object({
  create: z.union([ z.lazy(() => LLModelCreateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedCreateWithoutConversationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LLModelCreateOrConnectWithoutConversationsInputSchema).optional(),
  connect: z.lazy(() => LLModelWhereUniqueInputSchema).optional()
}).strict();

export const CourseCreateNestedOneWithoutConversationInputSchema: z.ZodType<Prisma.CourseCreateNestedOneWithoutConversationInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedCreateWithoutConversationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutConversationInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional()
}).strict();

export const MessageCreateNestedManyWithoutConversationInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutConversationInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutConversationInputSchema),z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CourseUncheckedCreateNestedOneWithoutConversationInputSchema: z.ZodType<Prisma.CourseUncheckedCreateNestedOneWithoutConversationInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedCreateWithoutConversationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutConversationInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional()
}).strict();

export const MessageUncheckedCreateNestedManyWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutConversationInputSchema),z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutConversationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutConversationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutConversationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutConversationsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutConversationsInputSchema),z.lazy(() => UserUpdateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutConversationsInputSchema) ]).optional(),
}).strict();

export const LLModelUpdateOneWithoutConversationsNestedInputSchema: z.ZodType<Prisma.LLModelUpdateOneWithoutConversationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => LLModelCreateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedCreateWithoutConversationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LLModelCreateOrConnectWithoutConversationsInputSchema).optional(),
  upsert: z.lazy(() => LLModelUpsertWithoutConversationsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LLModelWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LLModelWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LLModelWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LLModelUpdateToOneWithWhereWithoutConversationsInputSchema),z.lazy(() => LLModelUpdateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedUpdateWithoutConversationsInputSchema) ]).optional(),
}).strict();

export const CourseUpdateOneWithoutConversationNestedInputSchema: z.ZodType<Prisma.CourseUpdateOneWithoutConversationNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedCreateWithoutConversationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutConversationInputSchema).optional(),
  upsert: z.lazy(() => CourseUpsertWithoutConversationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CourseUpdateToOneWithWhereWithoutConversationInputSchema),z.lazy(() => CourseUpdateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutConversationInputSchema) ]).optional(),
}).strict();

export const MessageUpdateManyWithoutConversationNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutConversationNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutConversationInputSchema),z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CourseUncheckedUpdateOneWithoutConversationNestedInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateOneWithoutConversationNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedCreateWithoutConversationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutConversationInputSchema).optional(),
  upsert: z.lazy(() => CourseUpsertWithoutConversationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CourseUpdateToOneWithWhereWithoutConversationInputSchema),z.lazy(() => CourseUpdateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutConversationInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutConversationNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutConversationInputSchema),z.lazy(() => MessageCreateWithoutConversationInputSchema).array(),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema),z.lazy(() => MessageCreateOrConnectWithoutConversationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema),z.lazy(() => MessageUpsertWithWhereUniqueWithoutConversationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyConversationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema),z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema),z.lazy(() => MessageUpdateWithWhereUniqueWithoutConversationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema),z.lazy(() => MessageUpdateManyWithWhereWithoutConversationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConversationCreateNestedManyWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationCreateNestedManyWithoutAiModelInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutAiModelInputSchema),z.lazy(() => ConversationCreateWithoutAiModelInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyAiModelInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ConversationUncheckedCreateNestedManyWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateNestedManyWithoutAiModelInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutAiModelInputSchema),z.lazy(() => ConversationCreateWithoutAiModelInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyAiModelInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumLLMProviderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumLLMProviderFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => LLMProviderSchema).optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ConversationUpdateManyWithoutAiModelNestedInputSchema: z.ZodType<Prisma.ConversationUpdateManyWithoutAiModelNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutAiModelInputSchema),z.lazy(() => ConversationCreateWithoutAiModelInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConversationUpsertWithWhereUniqueWithoutAiModelInputSchema),z.lazy(() => ConversationUpsertWithWhereUniqueWithoutAiModelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyAiModelInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConversationUpdateWithWhereUniqueWithoutAiModelInputSchema),z.lazy(() => ConversationUpdateWithWhereUniqueWithoutAiModelInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConversationUpdateManyWithWhereWithoutAiModelInputSchema),z.lazy(() => ConversationUpdateManyWithWhereWithoutAiModelInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConversationScalarWhereInputSchema),z.lazy(() => ConversationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConversationUncheckedUpdateManyWithoutAiModelNestedInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyWithoutAiModelNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutAiModelInputSchema),z.lazy(() => ConversationCreateWithoutAiModelInputSchema).array(),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema),z.lazy(() => ConversationCreateOrConnectWithoutAiModelInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ConversationUpsertWithWhereUniqueWithoutAiModelInputSchema),z.lazy(() => ConversationUpsertWithWhereUniqueWithoutAiModelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ConversationCreateManyAiModelInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ConversationWhereUniqueInputSchema),z.lazy(() => ConversationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ConversationUpdateWithWhereUniqueWithoutAiModelInputSchema),z.lazy(() => ConversationUpdateWithWhereUniqueWithoutAiModelInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ConversationUpdateManyWithWhereWithoutAiModelInputSchema),z.lazy(() => ConversationUpdateManyWithWhereWithoutAiModelInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ConversationScalarWhereInputSchema),z.lazy(() => ConversationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ConversationCreateNestedOneWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationCreateNestedOneWithoutMessagesInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ConversationCreateOrConnectWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => ConversationWhereUniqueInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const ConversationUpdateOneRequiredWithoutMessagesNestedInputSchema: z.ZodType<Prisma.ConversationUpdateOneRequiredWithoutMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ConversationCreateOrConnectWithoutMessagesInputSchema).optional(),
  upsert: z.lazy(() => ConversationUpsertWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => ConversationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ConversationUpdateToOneWithWhereWithoutMessagesInputSchema),z.lazy(() => ConversationUpdateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutMessagesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCoursesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCoursesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCoursesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCoursesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ConversationCreateNestedOneWithoutCourseInputSchema: z.ZodType<Prisma.ConversationCreateNestedOneWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutCourseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ConversationCreateOrConnectWithoutCourseInputSchema).optional(),
  connect: z.lazy(() => ConversationWhereUniqueInputSchema).optional()
}).strict();

export const ChapterCreateNestedManyWithoutCourseInputSchema: z.ZodType<Prisma.ChapterCreateNestedManyWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => ChapterCreateWithoutCourseInputSchema),z.lazy(() => ChapterCreateWithoutCourseInputSchema).array(),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema),z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChapterCreateManyCourseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ChapterUncheckedCreateNestedManyWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUncheckedCreateNestedManyWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => ChapterCreateWithoutCourseInputSchema),z.lazy(() => ChapterCreateWithoutCourseInputSchema).array(),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema),z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChapterCreateManyCourseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutCoursesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCoursesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCoursesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCoursesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCoursesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCoursesInputSchema),z.lazy(() => UserUpdateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCoursesInputSchema) ]).optional(),
}).strict();

export const ConversationUpdateOneWithoutCourseNestedInputSchema: z.ZodType<Prisma.ConversationUpdateOneWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => ConversationCreateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutCourseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ConversationCreateOrConnectWithoutCourseInputSchema).optional(),
  upsert: z.lazy(() => ConversationUpsertWithoutCourseInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ConversationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ConversationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ConversationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ConversationUpdateToOneWithWhereWithoutCourseInputSchema),z.lazy(() => ConversationUpdateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutCourseInputSchema) ]).optional(),
}).strict();

export const ChapterUpdateManyWithoutCourseNestedInputSchema: z.ZodType<Prisma.ChapterUpdateManyWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChapterCreateWithoutCourseInputSchema),z.lazy(() => ChapterCreateWithoutCourseInputSchema).array(),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema),z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ChapterUpsertWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => ChapterUpsertWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChapterCreateManyCourseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ChapterUpdateWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => ChapterUpdateWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ChapterUpdateManyWithWhereWithoutCourseInputSchema),z.lazy(() => ChapterUpdateManyWithWhereWithoutCourseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ChapterScalarWhereInputSchema),z.lazy(() => ChapterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChapterUncheckedUpdateManyWithoutCourseNestedInputSchema: z.ZodType<Prisma.ChapterUncheckedUpdateManyWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChapterCreateWithoutCourseInputSchema),z.lazy(() => ChapterCreateWithoutCourseInputSchema).array(),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema),z.lazy(() => ChapterCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ChapterUpsertWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => ChapterUpsertWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChapterCreateManyCourseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ChapterWhereUniqueInputSchema),z.lazy(() => ChapterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ChapterUpdateWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => ChapterUpdateWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ChapterUpdateManyWithWhereWithoutCourseInputSchema),z.lazy(() => ChapterUpdateManyWithWhereWithoutCourseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ChapterScalarWhereInputSchema),z.lazy(() => ChapterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChapterCreateobjectivesInputSchema: z.ZodType<Prisma.ChapterCreateobjectivesInput> = z.object({
  set: z.string().array()
}).strict();

export const CourseCreateNestedOneWithoutChaptersInputSchema: z.ZodType<Prisma.CourseCreateNestedOneWithoutChaptersInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedCreateWithoutChaptersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutChaptersInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional()
}).strict();

export const QuizCreateNestedManyWithoutChapterInputSchema: z.ZodType<Prisma.QuizCreateNestedManyWithoutChapterInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutChapterInputSchema),z.lazy(() => QuizCreateWithoutChapterInputSchema).array(),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema),z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizCreateManyChapterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const QuizUncheckedCreateNestedManyWithoutChapterInputSchema: z.ZodType<Prisma.QuizUncheckedCreateNestedManyWithoutChapterInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutChapterInputSchema),z.lazy(() => QuizCreateWithoutChapterInputSchema).array(),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema),z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizCreateManyChapterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumChapterStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumChapterStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ChapterStatusSchema).optional()
}).strict();

export const ChapterUpdateobjectivesInputSchema: z.ZodType<Prisma.ChapterUpdateobjectivesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const CourseUpdateOneRequiredWithoutChaptersNestedInputSchema: z.ZodType<Prisma.CourseUpdateOneRequiredWithoutChaptersNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedCreateWithoutChaptersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutChaptersInputSchema).optional(),
  upsert: z.lazy(() => CourseUpsertWithoutChaptersInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CourseUpdateToOneWithWhereWithoutChaptersInputSchema),z.lazy(() => CourseUpdateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutChaptersInputSchema) ]).optional(),
}).strict();

export const QuizUpdateManyWithoutChapterNestedInputSchema: z.ZodType<Prisma.QuizUpdateManyWithoutChapterNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutChapterInputSchema),z.lazy(() => QuizCreateWithoutChapterInputSchema).array(),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema),z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuizUpsertWithWhereUniqueWithoutChapterInputSchema),z.lazy(() => QuizUpsertWithWhereUniqueWithoutChapterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizCreateManyChapterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuizUpdateWithWhereUniqueWithoutChapterInputSchema),z.lazy(() => QuizUpdateWithWhereUniqueWithoutChapterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuizUpdateManyWithWhereWithoutChapterInputSchema),z.lazy(() => QuizUpdateManyWithWhereWithoutChapterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuizScalarWhereInputSchema),z.lazy(() => QuizScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizUncheckedUpdateManyWithoutChapterNestedInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateManyWithoutChapterNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutChapterInputSchema),z.lazy(() => QuizCreateWithoutChapterInputSchema).array(),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema),z.lazy(() => QuizCreateOrConnectWithoutChapterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuizUpsertWithWhereUniqueWithoutChapterInputSchema),z.lazy(() => QuizUpsertWithWhereUniqueWithoutChapterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizCreateManyChapterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuizWhereUniqueInputSchema),z.lazy(() => QuizWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuizUpdateWithWhereUniqueWithoutChapterInputSchema),z.lazy(() => QuizUpdateWithWhereUniqueWithoutChapterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuizUpdateManyWithWhereWithoutChapterInputSchema),z.lazy(() => QuizUpdateManyWithWhereWithoutChapterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuizScalarWhereInputSchema),z.lazy(() => QuizScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChapterCreateNestedOneWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterCreateNestedOneWithoutQuizzesInput> = z.object({
  create: z.union([ z.lazy(() => ChapterCreateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutQuizzesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChapterCreateOrConnectWithoutQuizzesInputSchema).optional(),
  connect: z.lazy(() => ChapterWhereUniqueInputSchema).optional()
}).strict();

export const QuestionCreateNestedManyWithoutQuizInputSchema: z.ZodType<Prisma.QuestionCreateNestedManyWithoutQuizInput> = z.object({
  create: z.union([ z.lazy(() => QuestionCreateWithoutQuizInputSchema),z.lazy(() => QuestionCreateWithoutQuizInputSchema).array(),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuestionCreateManyQuizInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptCreateNestedManyWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptCreateNestedManyWithoutQuizInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyQuizInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const QuestionUncheckedCreateNestedManyWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUncheckedCreateNestedManyWithoutQuizInput> = z.object({
  create: z.union([ z.lazy(() => QuestionCreateWithoutQuizInputSchema),z.lazy(() => QuestionCreateWithoutQuizInputSchema).array(),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuestionCreateManyQuizInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptUncheckedCreateNestedManyWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedCreateNestedManyWithoutQuizInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyQuizInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableEnumQuizTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumQuizTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => QuizTypeSchema).optional().nullable()
}).strict();

export const ChapterUpdateOneRequiredWithoutQuizzesNestedInputSchema: z.ZodType<Prisma.ChapterUpdateOneRequiredWithoutQuizzesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChapterCreateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutQuizzesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChapterCreateOrConnectWithoutQuizzesInputSchema).optional(),
  upsert: z.lazy(() => ChapterUpsertWithoutQuizzesInputSchema).optional(),
  connect: z.lazy(() => ChapterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChapterUpdateToOneWithWhereWithoutQuizzesInputSchema),z.lazy(() => ChapterUpdateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedUpdateWithoutQuizzesInputSchema) ]).optional(),
}).strict();

export const QuestionUpdateManyWithoutQuizNestedInputSchema: z.ZodType<Prisma.QuestionUpdateManyWithoutQuizNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuestionCreateWithoutQuizInputSchema),z.lazy(() => QuestionCreateWithoutQuizInputSchema).array(),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuestionUpsertWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuestionUpsertWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuestionCreateManyQuizInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuestionUpdateWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuestionUpdateWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuestionUpdateManyWithWhereWithoutQuizInputSchema),z.lazy(() => QuestionUpdateManyWithWhereWithoutQuizInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuestionScalarWhereInputSchema),z.lazy(() => QuestionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptUpdateManyWithoutQuizNestedInputSchema: z.ZodType<Prisma.QuizAttemptUpdateManyWithoutQuizNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyQuizInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutQuizInputSchema),z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutQuizInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuizAttemptScalarWhereInputSchema),z.lazy(() => QuizAttemptScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuestionUncheckedUpdateManyWithoutQuizNestedInputSchema: z.ZodType<Prisma.QuestionUncheckedUpdateManyWithoutQuizNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuestionCreateWithoutQuizInputSchema),z.lazy(() => QuestionCreateWithoutQuizInputSchema).array(),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuestionCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuestionUpsertWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuestionUpsertWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuestionCreateManyQuizInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuestionWhereUniqueInputSchema),z.lazy(() => QuestionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuestionUpdateWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuestionUpdateWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuestionUpdateManyWithWhereWithoutQuizInputSchema),z.lazy(() => QuestionUpdateManyWithWhereWithoutQuizInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuestionScalarWhereInputSchema),z.lazy(() => QuestionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptUncheckedUpdateManyWithoutQuizNestedInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateManyWithoutQuizNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema).array(),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema),z.lazy(() => QuizAttemptCreateOrConnectWithoutQuizInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuizAttemptUpsertWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuizAttemptCreateManyQuizInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuizAttemptWhereUniqueInputSchema),z.lazy(() => QuizAttemptWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutQuizInputSchema),z.lazy(() => QuizAttemptUpdateWithWhereUniqueWithoutQuizInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutQuizInputSchema),z.lazy(() => QuizAttemptUpdateManyWithWhereWithoutQuizInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuizAttemptScalarWhereInputSchema),z.lazy(() => QuizAttemptScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizCreateNestedOneWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizCreateNestedOneWithoutQuestionsInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutQuestionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuizCreateOrConnectWithoutQuestionsInputSchema).optional(),
  connect: z.lazy(() => QuizWhereUniqueInputSchema).optional()
}).strict();

export const UserQuizResponseCreateNestedManyWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseCreateNestedManyWithoutQuestionInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuestionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserQuizResponseUncheckedCreateNestedManyWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedCreateNestedManyWithoutQuestionInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuestionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumQuizTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumQuizTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => QuizTypeSchema).optional()
}).strict();

export const QuizUpdateOneRequiredWithoutQuestionsNestedInputSchema: z.ZodType<Prisma.QuizUpdateOneRequiredWithoutQuestionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutQuestionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuizCreateOrConnectWithoutQuestionsInputSchema).optional(),
  upsert: z.lazy(() => QuizUpsertWithoutQuestionsInputSchema).optional(),
  connect: z.lazy(() => QuizWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QuizUpdateToOneWithWhereWithoutQuestionsInputSchema),z.lazy(() => QuizUpdateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutQuestionsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseUpdateManyWithoutQuestionNestedInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyWithoutQuestionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuestionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuestionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuestionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuestionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserQuizResponseScalarWhereInputSchema),z.lazy(() => UserQuizResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserQuizResponseUncheckedUpdateManyWithoutQuestionNestedInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateManyWithoutQuestionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuestionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuestionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuestionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuestionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuestionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserQuizResponseScalarWhereInputSchema),z.lazy(() => UserQuizResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutQuizAttemptsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedCreateWithoutQuizAttemptsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutQuizAttemptsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const QuizCreateNestedOneWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizCreateNestedOneWithoutAttemptsInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutAttemptsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuizCreateOrConnectWithoutAttemptsInputSchema).optional(),
  connect: z.lazy(() => QuizWhereUniqueInputSchema).optional()
}).strict();

export const UserQuizResponseCreateNestedManyWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseCreateNestedManyWithoutQuizAttemptInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuizAttemptInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserQuizResponseUncheckedCreateNestedManyWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedCreateNestedManyWithoutQuizAttemptInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuizAttemptInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumQuizAttemptStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumQuizAttemptStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => QuizAttemptStatusSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutQuizAttemptsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutQuizAttemptsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedCreateWithoutQuizAttemptsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutQuizAttemptsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutQuizAttemptsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutQuizAttemptsInputSchema),z.lazy(() => UserUpdateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutQuizAttemptsInputSchema) ]).optional(),
}).strict();

export const QuizUpdateOneRequiredWithoutAttemptsNestedInputSchema: z.ZodType<Prisma.QuizUpdateOneRequiredWithoutAttemptsNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizCreateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutAttemptsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuizCreateOrConnectWithoutAttemptsInputSchema).optional(),
  upsert: z.lazy(() => QuizUpsertWithoutAttemptsInputSchema).optional(),
  connect: z.lazy(() => QuizWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QuizUpdateToOneWithWhereWithoutAttemptsInputSchema),z.lazy(() => QuizUpdateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutAttemptsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseUpdateManyWithoutQuizAttemptNestedInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyWithoutQuizAttemptNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuizAttemptInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuizAttemptInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuizAttemptInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuizAttemptInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserQuizResponseScalarWhereInputSchema),z.lazy(() => UserQuizResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptNestedInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema).array(),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUpsertWithWhereUniqueWithoutQuizAttemptInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserQuizResponseCreateManyQuizAttemptInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserQuizResponseWhereUniqueInputSchema),z.lazy(() => UserQuizResponseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUpdateWithWhereUniqueWithoutQuizAttemptInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUpdateManyWithWhereWithoutQuizAttemptInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserQuizResponseScalarWhereInputSchema),z.lazy(() => UserQuizResponseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const QuizAttemptCreateNestedOneWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptCreateNestedOneWithoutResponsesInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuizAttemptCreateOrConnectWithoutResponsesInputSchema).optional(),
  connect: z.lazy(() => QuizAttemptWhereUniqueInputSchema).optional()
}).strict();

export const QuestionCreateNestedOneWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionCreateNestedOneWithoutResponsesInput> = z.object({
  create: z.union([ z.lazy(() => QuestionCreateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuestionCreateOrConnectWithoutResponsesInputSchema).optional(),
  connect: z.lazy(() => QuestionWhereUniqueInputSchema).optional()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const QuizAttemptUpdateOneRequiredWithoutResponsesNestedInputSchema: z.ZodType<Prisma.QuizAttemptUpdateOneRequiredWithoutResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuizAttemptCreateOrConnectWithoutResponsesInputSchema).optional(),
  upsert: z.lazy(() => QuizAttemptUpsertWithoutResponsesInputSchema).optional(),
  connect: z.lazy(() => QuizAttemptWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QuizAttemptUpdateToOneWithWhereWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUpdateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutResponsesInputSchema) ]).optional(),
}).strict();

export const QuestionUpdateOneRequiredWithoutResponsesNestedInputSchema: z.ZodType<Prisma.QuestionUpdateOneRequiredWithoutResponsesNestedInput> = z.object({
  create: z.union([ z.lazy(() => QuestionCreateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutResponsesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuestionCreateOrConnectWithoutResponsesInputSchema).optional(),
  upsert: z.lazy(() => QuestionUpsertWithoutResponsesInputSchema).optional(),
  connect: z.lazy(() => QuestionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QuestionUpdateToOneWithWhereWithoutResponsesInputSchema),z.lazy(() => QuestionUpdateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedUpdateWithoutResponsesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumLLMProviderFilterSchema: z.ZodType<Prisma.NestedEnumLLMProviderFilter> = z.object({
  equals: z.lazy(() => LLMProviderSchema).optional(),
  in: z.lazy(() => LLMProviderSchema).array().optional(),
  notIn: z.lazy(() => LLMProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => NestedEnumLLMProviderFilterSchema) ]).optional(),
}).strict();

export const NestedEnumLLMProviderWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumLLMProviderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => LLMProviderSchema).optional(),
  in: z.lazy(() => LLMProviderSchema).array().optional(),
  notIn: z.lazy(() => LLMProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => NestedEnumLLMProviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumLLMProviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumLLMProviderFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumChapterStatusFilterSchema: z.ZodType<Prisma.NestedEnumChapterStatusFilter> = z.object({
  equals: z.lazy(() => ChapterStatusSchema).optional(),
  in: z.lazy(() => ChapterStatusSchema).array().optional(),
  notIn: z.lazy(() => ChapterStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => NestedEnumChapterStatusFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumChapterStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumChapterStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ChapterStatusSchema).optional(),
  in: z.lazy(() => ChapterStatusSchema).array().optional(),
  notIn: z.lazy(() => ChapterStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => NestedEnumChapterStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumChapterStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumChapterStatusFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumQuizTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumQuizTypeNullableFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional().nullable(),
  in: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumQuizTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumQuizTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional().nullable(),
  in: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumQuizTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumQuizTypeNullableFilterSchema).optional()
}).strict();

export const NestedEnumQuizTypeFilterSchema: z.ZodType<Prisma.NestedEnumQuizTypeFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional(),
  in: z.lazy(() => QuizTypeSchema).array().optional(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumQuizTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumQuizTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => QuizTypeSchema).optional(),
  in: z.lazy(() => QuizTypeSchema).array().optional(),
  notIn: z.lazy(() => QuizTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NestedEnumQuizTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumQuizTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumQuizTypeFilterSchema).optional()
}).strict();

export const NestedEnumQuizAttemptStatusFilterSchema: z.ZodType<Prisma.NestedEnumQuizAttemptStatusFilter> = z.object({
  equals: z.lazy(() => QuizAttemptStatusSchema).optional(),
  in: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  notIn: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => NestedEnumQuizAttemptStatusFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumQuizAttemptStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumQuizAttemptStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => QuizAttemptStatusSchema).optional(),
  in: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  notIn: z.lazy(() => QuizAttemptStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => NestedEnumQuizAttemptStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumQuizAttemptStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumQuizAttemptStatusFilterSchema).optional()
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const CourseCreateWithoutCreatorInputSchema: z.ZodType<Prisma.CourseCreateWithoutCreatorInput> = z.object({
  id: z.string().uuid().optional(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  conversation: z.lazy(() => ConversationCreateNestedOneWithoutCourseInputSchema).optional(),
  chapters: z.lazy(() => ChapterCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().uuid().optional(),
  conversationId: z.string().optional().nullable(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  chapters: z.lazy(() => ChapterUncheckedCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CourseCreateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const CourseCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.CourseCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CourseCreateManyCreatorInputSchema),z.lazy(() => CourseCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const QuizAttemptCreateWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quiz: z.lazy(() => QuizCreateNestedOneWithoutAttemptsInputSchema),
  responses: z.lazy(() => UserQuizResponseCreateNestedManyWithoutQuizAttemptInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedCreateNestedManyWithoutQuizAttemptInputSchema).optional()
}).strict();

export const QuizAttemptCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const QuizAttemptCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.QuizAttemptCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => QuizAttemptCreateManyUserInputSchema),z.lazy(() => QuizAttemptCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ConversationCreateWithoutUserInputSchema: z.ZodType<Prisma.ConversationCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  aiModel: z.lazy(() => LLModelCreateNestedOneWithoutConversationsInputSchema).optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutConversationInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  aiModelId: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseUncheckedCreateNestedOneWithoutConversationInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ConversationCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConversationCreateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ConversationCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ConversationCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ConversationCreateManyUserInputSchema),z.lazy(() => ConversationCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CourseUpsertWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CourseUpdateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => CourseCreateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const CourseUpdateWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CourseUpdateWithoutCreatorInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const CourseUpdateManyWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => CourseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CourseUpdateManyMutationInputSchema),z.lazy(() => CourseUncheckedUpdateManyWithoutCreatorInputSchema) ]),
}).strict();

export const CourseScalarWhereInputSchema: z.ZodType<Prisma.CourseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CourseScalarWhereInputSchema),z.lazy(() => CourseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseScalarWhereInputSchema),z.lazy(() => CourseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  topic: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  goal: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const QuizAttemptUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const QuizAttemptUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuizAttemptUpdateWithoutUserInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const QuizAttemptUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => QuizAttemptScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuizAttemptUpdateManyMutationInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const QuizAttemptScalarWhereInputSchema: z.ZodType<Prisma.QuizAttemptScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => QuizAttemptScalarWhereInputSchema),z.lazy(() => QuizAttemptScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizAttemptScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizAttemptScalarWhereInputSchema),z.lazy(() => QuizAttemptScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumQuizAttemptStatusFilterSchema),z.lazy(() => QuizAttemptStatusSchema) ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  completedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ConversationUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ConversationUpdateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ConversationCreateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ConversationUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ConversationUpdateWithoutUserInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ConversationUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ConversationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ConversationUpdateManyMutationInputSchema),z.lazy(() => ConversationUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ConversationScalarWhereInputSchema: z.ZodType<Prisma.ConversationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ConversationScalarWhereInputSchema),z.lazy(() => ConversationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ConversationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ConversationScalarWhereInputSchema),z.lazy(() => ConversationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  courseId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  systemPrompt: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aiModelId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastUpdate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutConversationsInputSchema: z.ZodType<Prisma.UserCreateWithoutConversationsInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  courses: z.lazy(() => CourseCreateNestedManyWithoutCreatorInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutConversationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutConversationsInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  courses: z.lazy(() => CourseUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutConversationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutConversationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema) ]),
}).strict();

export const LLModelCreateWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelCreateWithoutConversationsInput> = z.object({
  id: z.string().uuid().optional(),
  provider: z.lazy(() => LLMProviderSchema),
  modelName: z.string(),
  displayName: z.string().optional().nullable(),
  contextWindow: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const LLModelUncheckedCreateWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelUncheckedCreateWithoutConversationsInput> = z.object({
  id: z.string().uuid().optional(),
  provider: z.lazy(() => LLMProviderSchema),
  modelName: z.string(),
  displayName: z.string().optional().nullable(),
  contextWindow: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const LLModelCreateOrConnectWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelCreateOrConnectWithoutConversationsInput> = z.object({
  where: z.lazy(() => LLModelWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LLModelCreateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedCreateWithoutConversationsInputSchema) ]),
}).strict();

export const CourseCreateWithoutConversationInputSchema: z.ZodType<Prisma.CourseCreateWithoutConversationInput> = z.object({
  id: z.string().uuid().optional(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCoursesInputSchema),
  chapters: z.lazy(() => ChapterCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateWithoutConversationInputSchema: z.ZodType<Prisma.CourseUncheckedCreateWithoutConversationInput> = z.object({
  id: z.string().uuid().optional(),
  creatorId: z.string(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  chapters: z.lazy(() => ChapterUncheckedCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseCreateOrConnectWithoutConversationInputSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutConversationInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CourseCreateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedCreateWithoutConversationInputSchema) ]),
}).strict();

export const MessageCreateWithoutConversationInputSchema: z.ZodType<Prisma.MessageCreateWithoutConversationInput> = z.object({
  id: z.string().uuid().optional(),
  isUser: z.boolean(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timestamp: z.coerce.date().optional()
}).strict();

export const MessageUncheckedCreateWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutConversationInput> = z.object({
  id: z.string().uuid().optional(),
  isUser: z.boolean(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timestamp: z.coerce.date().optional()
}).strict();

export const MessageCreateOrConnectWithoutConversationInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutConversationInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema) ]),
}).strict();

export const MessageCreateManyConversationInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyConversationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManyConversationInputSchema),z.lazy(() => MessageCreateManyConversationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutConversationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutConversationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutConversationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutConversationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutConversationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutConversationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutConversationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutConversationsInputSchema) ]),
}).strict();

export const UserUpdateWithoutConversationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutConversationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  courses: z.lazy(() => CourseUpdateManyWithoutCreatorNestedInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutConversationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutConversationsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  courses: z.lazy(() => CourseUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const LLModelUpsertWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelUpsertWithoutConversationsInput> = z.object({
  update: z.union([ z.lazy(() => LLModelUpdateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedUpdateWithoutConversationsInputSchema) ]),
  create: z.union([ z.lazy(() => LLModelCreateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedCreateWithoutConversationsInputSchema) ]),
  where: z.lazy(() => LLModelWhereInputSchema).optional()
}).strict();

export const LLModelUpdateToOneWithWhereWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelUpdateToOneWithWhereWithoutConversationsInput> = z.object({
  where: z.lazy(() => LLModelWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LLModelUpdateWithoutConversationsInputSchema),z.lazy(() => LLModelUncheckedUpdateWithoutConversationsInputSchema) ]),
}).strict();

export const LLModelUpdateWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelUpdateWithoutConversationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => EnumLLMProviderFieldUpdateOperationsInputSchema) ]).optional(),
  modelName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contextWindow: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LLModelUncheckedUpdateWithoutConversationsInputSchema: z.ZodType<Prisma.LLModelUncheckedUpdateWithoutConversationsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => LLMProviderSchema),z.lazy(() => EnumLLMProviderFieldUpdateOperationsInputSchema) ]).optional(),
  modelName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contextWindow: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CourseUpsertWithoutConversationInputSchema: z.ZodType<Prisma.CourseUpsertWithoutConversationInput> = z.object({
  update: z.union([ z.lazy(() => CourseUpdateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutConversationInputSchema) ]),
  create: z.union([ z.lazy(() => CourseCreateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedCreateWithoutConversationInputSchema) ]),
  where: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const CourseUpdateToOneWithWhereWithoutConversationInputSchema: z.ZodType<Prisma.CourseUpdateToOneWithWhereWithoutConversationInput> = z.object({
  where: z.lazy(() => CourseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CourseUpdateWithoutConversationInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutConversationInputSchema) ]),
}).strict();

export const CourseUpdateWithoutConversationInputSchema: z.ZodType<Prisma.CourseUpdateWithoutConversationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCoursesNestedInputSchema).optional(),
  chapters: z.lazy(() => ChapterUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateWithoutConversationInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateWithoutConversationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  chapters: z.lazy(() => ChapterUncheckedUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const MessageUpsertWithWhereUniqueWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutConversationInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MessageUpdateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutConversationInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedCreateWithoutConversationInputSchema) ]),
}).strict();

export const MessageUpdateWithWhereUniqueWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutConversationInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateWithoutConversationInputSchema),z.lazy(() => MessageUncheckedUpdateWithoutConversationInputSchema) ]),
}).strict();

export const MessageUpdateManyWithWhereWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutConversationInput> = z.object({
  where: z.lazy(() => MessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateManyMutationInputSchema),z.lazy(() => MessageUncheckedUpdateManyWithoutConversationInputSchema) ]),
}).strict();

export const MessageScalarWhereInputSchema: z.ZodType<Prisma.MessageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereInputSchema),z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  conversationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isUser: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  parts: z.lazy(() => JsonFilterSchema).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ConversationCreateWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationCreateWithoutAiModelInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutConversationsInputSchema).optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutConversationInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationUncheckedCreateWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateWithoutAiModelInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseUncheckedCreateNestedOneWithoutConversationInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationCreateOrConnectWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationCreateOrConnectWithoutAiModelInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConversationCreateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema) ]),
}).strict();

export const ConversationCreateManyAiModelInputEnvelopeSchema: z.ZodType<Prisma.ConversationCreateManyAiModelInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ConversationCreateManyAiModelInputSchema),z.lazy(() => ConversationCreateManyAiModelInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ConversationUpsertWithWhereUniqueWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUpsertWithWhereUniqueWithoutAiModelInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ConversationUpdateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutAiModelInputSchema) ]),
  create: z.union([ z.lazy(() => ConversationCreateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutAiModelInputSchema) ]),
}).strict();

export const ConversationUpdateWithWhereUniqueWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUpdateWithWhereUniqueWithoutAiModelInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ConversationUpdateWithoutAiModelInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutAiModelInputSchema) ]),
}).strict();

export const ConversationUpdateManyWithWhereWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUpdateManyWithWhereWithoutAiModelInput> = z.object({
  where: z.lazy(() => ConversationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ConversationUpdateManyMutationInputSchema),z.lazy(() => ConversationUncheckedUpdateManyWithoutAiModelInputSchema) ]),
}).strict();

export const ConversationCreateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationCreateWithoutMessagesInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutConversationsInputSchema).optional(),
  aiModel: z.lazy(() => LLModelCreateNestedOneWithoutConversationsInputSchema).optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutConversationInputSchema).optional()
}).strict();

export const ConversationUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateWithoutMessagesInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  aiModelId: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseUncheckedCreateNestedOneWithoutConversationInputSchema).optional()
}).strict();

export const ConversationCreateOrConnectWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationCreateOrConnectWithoutMessagesInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConversationCreateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema) ]),
}).strict();

export const ConversationUpsertWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUpsertWithoutMessagesInput> = z.object({
  update: z.union([ z.lazy(() => ConversationUpdateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => ConversationCreateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutMessagesInputSchema) ]),
  where: z.lazy(() => ConversationWhereInputSchema).optional()
}).strict();

export const ConversationUpdateToOneWithWhereWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUpdateToOneWithWhereWithoutMessagesInput> = z.object({
  where: z.lazy(() => ConversationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ConversationUpdateWithoutMessagesInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutMessagesInputSchema) ]),
}).strict();

export const ConversationUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutConversationsNestedInputSchema).optional(),
  aiModel: z.lazy(() => LLModelUpdateOneWithoutConversationsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiModelId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUncheckedUpdateOneWithoutConversationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutCoursesInputSchema: z.ZodType<Prisma.UserCreateWithoutCoursesInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quizAttempts: z.lazy(() => QuizAttemptCreateNestedManyWithoutUserInputSchema).optional(),
  conversations: z.lazy(() => ConversationCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCoursesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCoursesInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quizAttempts: z.lazy(() => QuizAttemptUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  conversations: z.lazy(() => ConversationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCoursesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCoursesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCoursesInputSchema) ]),
}).strict();

export const ConversationCreateWithoutCourseInputSchema: z.ZodType<Prisma.ConversationCreateWithoutCourseInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutConversationsInputSchema).optional(),
  aiModel: z.lazy(() => LLModelCreateNestedOneWithoutConversationsInputSchema).optional(),
  messages: z.lazy(() => MessageCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationUncheckedCreateWithoutCourseInputSchema: z.ZodType<Prisma.ConversationUncheckedCreateWithoutCourseInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  aiModelId: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  messages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutConversationInputSchema).optional()
}).strict();

export const ConversationCreateOrConnectWithoutCourseInputSchema: z.ZodType<Prisma.ConversationCreateOrConnectWithoutCourseInput> = z.object({
  where: z.lazy(() => ConversationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ConversationCreateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const ChapterCreateWithoutCourseInputSchema: z.ZodType<Prisma.ChapterCreateWithoutCourseInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quizzes: z.lazy(() => QuizCreateNestedManyWithoutChapterInputSchema).optional()
}).strict();

export const ChapterUncheckedCreateWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUncheckedCreateWithoutCourseInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quizzes: z.lazy(() => QuizUncheckedCreateNestedManyWithoutChapterInputSchema).optional()
}).strict();

export const ChapterCreateOrConnectWithoutCourseInputSchema: z.ZodType<Prisma.ChapterCreateOrConnectWithoutCourseInput> = z.object({
  where: z.lazy(() => ChapterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChapterCreateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const ChapterCreateManyCourseInputEnvelopeSchema: z.ZodType<Prisma.ChapterCreateManyCourseInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ChapterCreateManyCourseInputSchema),z.lazy(() => ChapterCreateManyCourseInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutCoursesInputSchema: z.ZodType<Prisma.UserUpsertWithoutCoursesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCoursesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedCreateWithoutCoursesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCoursesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCoursesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCoursesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCoursesInputSchema) ]),
}).strict();

export const UserUpdateWithoutCoursesInputSchema: z.ZodType<Prisma.UserUpdateWithoutCoursesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUpdateManyWithoutUserNestedInputSchema).optional(),
  conversations: z.lazy(() => ConversationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCoursesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCoursesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttempts: z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  conversations: z.lazy(() => ConversationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ConversationUpsertWithoutCourseInputSchema: z.ZodType<Prisma.ConversationUpsertWithoutCourseInput> = z.object({
  update: z.union([ z.lazy(() => ConversationUpdateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutCourseInputSchema) ]),
  create: z.union([ z.lazy(() => ConversationCreateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedCreateWithoutCourseInputSchema) ]),
  where: z.lazy(() => ConversationWhereInputSchema).optional()
}).strict();

export const ConversationUpdateToOneWithWhereWithoutCourseInputSchema: z.ZodType<Prisma.ConversationUpdateToOneWithWhereWithoutCourseInput> = z.object({
  where: z.lazy(() => ConversationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ConversationUpdateWithoutCourseInputSchema),z.lazy(() => ConversationUncheckedUpdateWithoutCourseInputSchema) ]),
}).strict();

export const ConversationUpdateWithoutCourseInputSchema: z.ZodType<Prisma.ConversationUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutConversationsNestedInputSchema).optional(),
  aiModel: z.lazy(() => LLModelUpdateOneWithoutConversationsNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateWithoutCourseInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiModelId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ChapterUpsertWithWhereUniqueWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUpsertWithWhereUniqueWithoutCourseInput> = z.object({
  where: z.lazy(() => ChapterWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ChapterUpdateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedUpdateWithoutCourseInputSchema) ]),
  create: z.union([ z.lazy(() => ChapterCreateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const ChapterUpdateWithWhereUniqueWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUpdateWithWhereUniqueWithoutCourseInput> = z.object({
  where: z.lazy(() => ChapterWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ChapterUpdateWithoutCourseInputSchema),z.lazy(() => ChapterUncheckedUpdateWithoutCourseInputSchema) ]),
}).strict();

export const ChapterUpdateManyWithWhereWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUpdateManyWithWhereWithoutCourseInput> = z.object({
  where: z.lazy(() => ChapterScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ChapterUpdateManyMutationInputSchema),z.lazy(() => ChapterUncheckedUpdateManyWithoutCourseInputSchema) ]),
}).strict();

export const ChapterScalarWhereInputSchema: z.ZodType<Prisma.ChapterScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChapterScalarWhereInputSchema),z.lazy(() => ChapterScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChapterScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChapterScalarWhereInputSchema),z.lazy(() => ChapterScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumChapterStatusFilterSchema),z.lazy(() => ChapterStatusSchema) ]).optional(),
  objectives: z.lazy(() => StringNullableListFilterSchema).optional(),
  content: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CourseCreateWithoutChaptersInputSchema: z.ZodType<Prisma.CourseCreateWithoutChaptersInput> = z.object({
  id: z.string().uuid().optional(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCoursesInputSchema),
  conversation: z.lazy(() => ConversationCreateNestedOneWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateWithoutChaptersInputSchema: z.ZodType<Prisma.CourseUncheckedCreateWithoutChaptersInput> = z.object({
  id: z.string().uuid().optional(),
  creatorId: z.string(),
  conversationId: z.string().optional().nullable(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional()
}).strict();

export const CourseCreateOrConnectWithoutChaptersInputSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutChaptersInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CourseCreateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedCreateWithoutChaptersInputSchema) ]),
}).strict();

export const QuizCreateWithoutChapterInputSchema: z.ZodType<Prisma.QuizCreateWithoutChapterInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  questions: z.lazy(() => QuestionCreateNestedManyWithoutQuizInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizUncheckedCreateWithoutChapterInputSchema: z.ZodType<Prisma.QuizUncheckedCreateWithoutChapterInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  questions: z.lazy(() => QuestionUncheckedCreateNestedManyWithoutQuizInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUncheckedCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizCreateOrConnectWithoutChapterInputSchema: z.ZodType<Prisma.QuizCreateOrConnectWithoutChapterInput> = z.object({
  where: z.lazy(() => QuizWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuizCreateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema) ]),
}).strict();

export const QuizCreateManyChapterInputEnvelopeSchema: z.ZodType<Prisma.QuizCreateManyChapterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => QuizCreateManyChapterInputSchema),z.lazy(() => QuizCreateManyChapterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CourseUpsertWithoutChaptersInputSchema: z.ZodType<Prisma.CourseUpsertWithoutChaptersInput> = z.object({
  update: z.union([ z.lazy(() => CourseUpdateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutChaptersInputSchema) ]),
  create: z.union([ z.lazy(() => CourseCreateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedCreateWithoutChaptersInputSchema) ]),
  where: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const CourseUpdateToOneWithWhereWithoutChaptersInputSchema: z.ZodType<Prisma.CourseUpdateToOneWithWhereWithoutChaptersInput> = z.object({
  where: z.lazy(() => CourseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CourseUpdateWithoutChaptersInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutChaptersInputSchema) ]),
}).strict();

export const CourseUpdateWithoutChaptersInputSchema: z.ZodType<Prisma.CourseUpdateWithoutChaptersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCoursesNestedInputSchema).optional(),
  conversation: z.lazy(() => ConversationUpdateOneWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateWithoutChaptersInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateWithoutChaptersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizUpsertWithWhereUniqueWithoutChapterInputSchema: z.ZodType<Prisma.QuizUpsertWithWhereUniqueWithoutChapterInput> = z.object({
  where: z.lazy(() => QuizWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuizUpdateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutChapterInputSchema) ]),
  create: z.union([ z.lazy(() => QuizCreateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedCreateWithoutChapterInputSchema) ]),
}).strict();

export const QuizUpdateWithWhereUniqueWithoutChapterInputSchema: z.ZodType<Prisma.QuizUpdateWithWhereUniqueWithoutChapterInput> = z.object({
  where: z.lazy(() => QuizWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuizUpdateWithoutChapterInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutChapterInputSchema) ]),
}).strict();

export const QuizUpdateManyWithWhereWithoutChapterInputSchema: z.ZodType<Prisma.QuizUpdateManyWithWhereWithoutChapterInput> = z.object({
  where: z.lazy(() => QuizScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuizUpdateManyMutationInputSchema),z.lazy(() => QuizUncheckedUpdateManyWithoutChapterInputSchema) ]),
}).strict();

export const QuizScalarWhereInputSchema: z.ZodType<Prisma.QuizScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => QuizScalarWhereInputSchema),z.lazy(() => QuizScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuizScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuizScalarWhereInputSchema),z.lazy(() => QuizScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  chapterId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => EnumQuizTypeNullableFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ChapterCreateWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterCreateWithoutQuizzesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutChaptersInputSchema)
}).strict();

export const ChapterUncheckedCreateWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterUncheckedCreateWithoutQuizzesInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChapterCreateOrConnectWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterCreateOrConnectWithoutQuizzesInput> = z.object({
  where: z.lazy(() => ChapterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChapterCreateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutQuizzesInputSchema) ]),
}).strict();

export const QuestionCreateWithoutQuizInputSchema: z.ZodType<Prisma.QuestionCreateWithoutQuizInput> = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responses: z.lazy(() => UserQuizResponseCreateNestedManyWithoutQuestionInputSchema).optional()
}).strict();

export const QuestionUncheckedCreateWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUncheckedCreateWithoutQuizInput> = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedCreateNestedManyWithoutQuestionInputSchema).optional()
}).strict();

export const QuestionCreateOrConnectWithoutQuizInputSchema: z.ZodType<Prisma.QuestionCreateOrConnectWithoutQuizInput> = z.object({
  where: z.lazy(() => QuestionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuestionCreateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema) ]),
}).strict();

export const QuestionCreateManyQuizInputEnvelopeSchema: z.ZodType<Prisma.QuestionCreateManyQuizInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => QuestionCreateManyQuizInputSchema),z.lazy(() => QuestionCreateManyQuizInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const QuizAttemptCreateWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptCreateWithoutQuizInput> = z.object({
  id: z.string().uuid().optional(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutQuizAttemptsInputSchema),
  responses: z.lazy(() => UserQuizResponseCreateNestedManyWithoutQuizAttemptInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedCreateWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedCreateWithoutQuizInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedCreateNestedManyWithoutQuizAttemptInputSchema).optional()
}).strict();

export const QuizAttemptCreateOrConnectWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptCreateOrConnectWithoutQuizInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema) ]),
}).strict();

export const QuizAttemptCreateManyQuizInputEnvelopeSchema: z.ZodType<Prisma.QuizAttemptCreateManyQuizInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => QuizAttemptCreateManyQuizInputSchema),z.lazy(() => QuizAttemptCreateManyQuizInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ChapterUpsertWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterUpsertWithoutQuizzesInput> = z.object({
  update: z.union([ z.lazy(() => ChapterUpdateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedUpdateWithoutQuizzesInputSchema) ]),
  create: z.union([ z.lazy(() => ChapterCreateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedCreateWithoutQuizzesInputSchema) ]),
  where: z.lazy(() => ChapterWhereInputSchema).optional()
}).strict();

export const ChapterUpdateToOneWithWhereWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterUpdateToOneWithWhereWithoutQuizzesInput> = z.object({
  where: z.lazy(() => ChapterWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ChapterUpdateWithoutQuizzesInputSchema),z.lazy(() => ChapterUncheckedUpdateWithoutQuizzesInputSchema) ]),
}).strict();

export const ChapterUpdateWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterUpdateWithoutQuizzesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutChaptersNestedInputSchema).optional()
}).strict();

export const ChapterUncheckedUpdateWithoutQuizzesInputSchema: z.ZodType<Prisma.ChapterUncheckedUpdateWithoutQuizzesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuestionUpsertWithWhereUniqueWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUpsertWithWhereUniqueWithoutQuizInput> = z.object({
  where: z.lazy(() => QuestionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuestionUpdateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedUpdateWithoutQuizInputSchema) ]),
  create: z.union([ z.lazy(() => QuestionCreateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutQuizInputSchema) ]),
}).strict();

export const QuestionUpdateWithWhereUniqueWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUpdateWithWhereUniqueWithoutQuizInput> = z.object({
  where: z.lazy(() => QuestionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuestionUpdateWithoutQuizInputSchema),z.lazy(() => QuestionUncheckedUpdateWithoutQuizInputSchema) ]),
}).strict();

export const QuestionUpdateManyWithWhereWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUpdateManyWithWhereWithoutQuizInput> = z.object({
  where: z.lazy(() => QuestionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuestionUpdateManyMutationInputSchema),z.lazy(() => QuestionUncheckedUpdateManyWithoutQuizInputSchema) ]),
}).strict();

export const QuestionScalarWhereInputSchema: z.ZodType<Prisma.QuestionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => QuestionScalarWhereInputSchema),z.lazy(() => QuestionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuestionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuestionScalarWhereInputSchema),z.lazy(() => QuestionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumQuizTypeFilterSchema),z.lazy(() => QuizTypeSchema) ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  options: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const QuizAttemptUpsertWithWhereUniqueWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUpsertWithWhereUniqueWithoutQuizInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutQuizInputSchema) ]),
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutQuizInputSchema) ]),
}).strict();

export const QuizAttemptUpdateWithWhereUniqueWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUpdateWithWhereUniqueWithoutQuizInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuizAttemptUpdateWithoutQuizInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutQuizInputSchema) ]),
}).strict();

export const QuizAttemptUpdateManyWithWhereWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUpdateManyWithWhereWithoutQuizInput> = z.object({
  where: z.lazy(() => QuizAttemptScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuizAttemptUpdateManyMutationInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutQuizInputSchema) ]),
}).strict();

export const QuizCreateWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizCreateWithoutQuestionsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chapter: z.lazy(() => ChapterCreateNestedOneWithoutQuizzesInputSchema),
  attempts: z.lazy(() => QuizAttemptCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizUncheckedCreateWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizUncheckedCreateWithoutQuestionsInput> = z.object({
  id: z.string().uuid().optional(),
  chapterId: z.string(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  attempts: z.lazy(() => QuizAttemptUncheckedCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizCreateOrConnectWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizCreateOrConnectWithoutQuestionsInput> = z.object({
  where: z.lazy(() => QuizWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuizCreateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutQuestionsInputSchema) ]),
}).strict();

export const UserQuizResponseCreateWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseCreateWithoutQuestionInput> = z.object({
  id: z.string().uuid().optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  quizAttempt: z.lazy(() => QuizAttemptCreateNestedOneWithoutResponsesInputSchema)
}).strict();

export const UserQuizResponseUncheckedCreateWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedCreateWithoutQuestionInput> = z.object({
  id: z.string().uuid().optional(),
  quizAttemptId: z.string(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserQuizResponseCreateOrConnectWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseCreateOrConnectWithoutQuestionInput> = z.object({
  where: z.lazy(() => UserQuizResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema) ]),
}).strict();

export const UserQuizResponseCreateManyQuestionInputEnvelopeSchema: z.ZodType<Prisma.UserQuizResponseCreateManyQuestionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserQuizResponseCreateManyQuestionInputSchema),z.lazy(() => UserQuizResponseCreateManyQuestionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const QuizUpsertWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizUpsertWithoutQuestionsInput> = z.object({
  update: z.union([ z.lazy(() => QuizUpdateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutQuestionsInputSchema) ]),
  create: z.union([ z.lazy(() => QuizCreateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutQuestionsInputSchema) ]),
  where: z.lazy(() => QuizWhereInputSchema).optional()
}).strict();

export const QuizUpdateToOneWithWhereWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizUpdateToOneWithWhereWithoutQuestionsInput> = z.object({
  where: z.lazy(() => QuizWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => QuizUpdateWithoutQuestionsInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutQuestionsInputSchema) ]),
}).strict();

export const QuizUpdateWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizUpdateWithoutQuestionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.lazy(() => ChapterUpdateOneRequiredWithoutQuizzesNestedInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const QuizUncheckedUpdateWithoutQuestionsInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateWithoutQuestionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  attempts: z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const UserQuizResponseUpsertWithWhereUniqueWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUpsertWithWhereUniqueWithoutQuestionInput> = z.object({
  where: z.lazy(() => UserQuizResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserQuizResponseUpdateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedUpdateWithoutQuestionInputSchema) ]),
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuestionInputSchema) ]),
}).strict();

export const UserQuizResponseUpdateWithWhereUniqueWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateWithWhereUniqueWithoutQuestionInput> = z.object({
  where: z.lazy(() => UserQuizResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserQuizResponseUpdateWithoutQuestionInputSchema),z.lazy(() => UserQuizResponseUncheckedUpdateWithoutQuestionInputSchema) ]),
}).strict();

export const UserQuizResponseUpdateManyWithWhereWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyWithWhereWithoutQuestionInput> = z.object({
  where: z.lazy(() => UserQuizResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserQuizResponseUpdateManyMutationInputSchema),z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuestionInputSchema) ]),
}).strict();

export const UserQuizResponseScalarWhereInputSchema: z.ZodType<Prisma.UserQuizResponseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserQuizResponseScalarWhereInputSchema),z.lazy(() => UserQuizResponseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserQuizResponseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserQuizResponseScalarWhereInputSchema),z.lazy(() => UserQuizResponseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quizAttemptId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  questionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAnswer: z.lazy(() => JsonFilterSchema).optional(),
  isCorrect: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserCreateWithoutQuizAttemptsInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  courses: z.lazy(() => CourseCreateNestedManyWithoutCreatorInputSchema).optional(),
  conversations: z.lazy(() => ConversationCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutQuizAttemptsInput> = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  lastSignInAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  courses: z.lazy(() => CourseUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  conversations: z.lazy(() => ConversationUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutQuizAttemptsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedCreateWithoutQuizAttemptsInputSchema) ]),
}).strict();

export const QuizCreateWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizCreateWithoutAttemptsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  chapter: z.lazy(() => ChapterCreateNestedOneWithoutQuizzesInputSchema),
  questions: z.lazy(() => QuestionCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizUncheckedCreateWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizUncheckedCreateWithoutAttemptsInput> = z.object({
  id: z.string().uuid().optional(),
  chapterId: z.string(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  questions: z.lazy(() => QuestionUncheckedCreateNestedManyWithoutQuizInputSchema).optional()
}).strict();

export const QuizCreateOrConnectWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizCreateOrConnectWithoutAttemptsInput> = z.object({
  where: z.lazy(() => QuizWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuizCreateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutAttemptsInputSchema) ]),
}).strict();

export const UserQuizResponseCreateWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseCreateWithoutQuizAttemptInput> = z.object({
  id: z.string().uuid().optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  question: z.lazy(() => QuestionCreateNestedOneWithoutResponsesInputSchema)
}).strict();

export const UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedCreateWithoutQuizAttemptInput> = z.object({
  id: z.string().uuid().optional(),
  questionId: z.string(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserQuizResponseCreateOrConnectWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseCreateOrConnectWithoutQuizAttemptInput> = z.object({
  where: z.lazy(() => UserQuizResponseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema) ]),
}).strict();

export const UserQuizResponseCreateManyQuizAttemptInputEnvelopeSchema: z.ZodType<Prisma.UserQuizResponseCreateManyQuizAttemptInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserQuizResponseCreateManyQuizAttemptInputSchema),z.lazy(() => UserQuizResponseCreateManyQuizAttemptInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserUpsertWithoutQuizAttemptsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutQuizAttemptsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedCreateWithoutQuizAttemptsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutQuizAttemptsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutQuizAttemptsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutQuizAttemptsInputSchema) ]),
}).strict();

export const UserUpdateWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserUpdateWithoutQuizAttemptsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  courses: z.lazy(() => CourseUpdateManyWithoutCreatorNestedInputSchema).optional(),
  conversations: z.lazy(() => ConversationUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutQuizAttemptsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutQuizAttemptsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSignInAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  courses: z.lazy(() => CourseUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  conversations: z.lazy(() => ConversationUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const QuizUpsertWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizUpsertWithoutAttemptsInput> = z.object({
  update: z.union([ z.lazy(() => QuizUpdateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutAttemptsInputSchema) ]),
  create: z.union([ z.lazy(() => QuizCreateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedCreateWithoutAttemptsInputSchema) ]),
  where: z.lazy(() => QuizWhereInputSchema).optional()
}).strict();

export const QuizUpdateToOneWithWhereWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizUpdateToOneWithWhereWithoutAttemptsInput> = z.object({
  where: z.lazy(() => QuizWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => QuizUpdateWithoutAttemptsInputSchema),z.lazy(() => QuizUncheckedUpdateWithoutAttemptsInputSchema) ]),
}).strict();

export const QuizUpdateWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizUpdateWithoutAttemptsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.lazy(() => ChapterUpdateOneRequiredWithoutQuizzesNestedInputSchema).optional(),
  questions: z.lazy(() => QuestionUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const QuizUncheckedUpdateWithoutAttemptsInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateWithoutAttemptsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  questions: z.lazy(() => QuestionUncheckedUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const UserQuizResponseUpsertWithWhereUniqueWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUpsertWithWhereUniqueWithoutQuizAttemptInput> = z.object({
  where: z.lazy(() => UserQuizResponseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserQuizResponseUpdateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedUpdateWithoutQuizAttemptInputSchema) ]),
  create: z.union([ z.lazy(() => UserQuizResponseCreateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedCreateWithoutQuizAttemptInputSchema) ]),
}).strict();

export const UserQuizResponseUpdateWithWhereUniqueWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateWithWhereUniqueWithoutQuizAttemptInput> = z.object({
  where: z.lazy(() => UserQuizResponseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserQuizResponseUpdateWithoutQuizAttemptInputSchema),z.lazy(() => UserQuizResponseUncheckedUpdateWithoutQuizAttemptInputSchema) ]),
}).strict();

export const UserQuizResponseUpdateManyWithWhereWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyWithWhereWithoutQuizAttemptInput> = z.object({
  where: z.lazy(() => UserQuizResponseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserQuizResponseUpdateManyMutationInputSchema),z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptInputSchema) ]),
}).strict();

export const QuizAttemptCreateWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptCreateWithoutResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutQuizAttemptsInputSchema),
  quiz: z.lazy(() => QuizCreateNestedOneWithoutAttemptsInputSchema)
}).strict();

export const QuizAttemptUncheckedCreateWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedCreateWithoutResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  quizId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuizAttemptCreateOrConnectWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptCreateOrConnectWithoutResponsesInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutResponsesInputSchema) ]),
}).strict();

export const QuestionCreateWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionCreateWithoutResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  quiz: z.lazy(() => QuizCreateNestedOneWithoutQuestionsInputSchema)
}).strict();

export const QuestionUncheckedCreateWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionUncheckedCreateWithoutResponsesInput> = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuestionCreateOrConnectWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionCreateOrConnectWithoutResponsesInput> = z.object({
  where: z.lazy(() => QuestionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuestionCreateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutResponsesInputSchema) ]),
}).strict();

export const QuizAttemptUpsertWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptUpsertWithoutResponsesInput> = z.object({
  update: z.union([ z.lazy(() => QuizAttemptUpdateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => QuizAttemptCreateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedCreateWithoutResponsesInputSchema) ]),
  where: z.lazy(() => QuizAttemptWhereInputSchema).optional()
}).strict();

export const QuizAttemptUpdateToOneWithWhereWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptUpdateToOneWithWhereWithoutResponsesInput> = z.object({
  where: z.lazy(() => QuizAttemptWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => QuizAttemptUpdateWithoutResponsesInputSchema),z.lazy(() => QuizAttemptUncheckedUpdateWithoutResponsesInputSchema) ]),
}).strict();

export const QuizAttemptUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutQuizAttemptsNestedInputSchema).optional(),
  quiz: z.lazy(() => QuizUpdateOneRequiredWithoutAttemptsNestedInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuestionUpsertWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionUpsertWithoutResponsesInput> = z.object({
  update: z.union([ z.lazy(() => QuestionUpdateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedUpdateWithoutResponsesInputSchema) ]),
  create: z.union([ z.lazy(() => QuestionCreateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedCreateWithoutResponsesInputSchema) ]),
  where: z.lazy(() => QuestionWhereInputSchema).optional()
}).strict();

export const QuestionUpdateToOneWithWhereWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionUpdateToOneWithWhereWithoutResponsesInput> = z.object({
  where: z.lazy(() => QuestionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => QuestionUpdateWithoutResponsesInputSchema),z.lazy(() => QuestionUncheckedUpdateWithoutResponsesInputSchema) ]),
}).strict();

export const QuestionUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quiz: z.lazy(() => QuizUpdateOneRequiredWithoutQuestionsNestedInputSchema).optional()
}).strict();

export const QuestionUncheckedUpdateWithoutResponsesInputSchema: z.ZodType<Prisma.QuestionUncheckedUpdateWithoutResponsesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CourseCreateManyCreatorInputSchema: z.ZodType<Prisma.CourseCreateManyCreatorInput> = z.object({
  id: z.string().uuid().optional(),
  conversationId: z.string().optional().nullable(),
  topic: z.string(),
  goal: z.string(),
  title: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional()
}).strict();

export const QuizAttemptCreateManyUserInputSchema: z.ZodType<Prisma.QuizAttemptCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ConversationCreateManyUserInputSchema: z.ZodType<Prisma.ConversationCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  aiModelId: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const CourseUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  conversation: z.lazy(() => ConversationUpdateOneWithoutCourseNestedInputSchema).optional(),
  chapters: z.lazy(() => ChapterUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  chapters: z.lazy(() => ChapterUncheckedUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  conversationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  goal: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizAttemptUpdateWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quiz: z.lazy(() => QuizUpdateOneRequiredWithoutAttemptsNestedInputSchema).optional(),
  responses: z.lazy(() => UserQuizResponseUpdateManyWithoutQuizAttemptNestedInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptNestedInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConversationUpdateWithoutUserInputSchema: z.ZodType<Prisma.ConversationUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  aiModel: z.lazy(() => LLModelUpdateOneWithoutConversationsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneWithoutConversationNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiModelId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUncheckedUpdateOneWithoutConversationNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aiModelId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateManyConversationInputSchema: z.ZodType<Prisma.MessageCreateManyConversationInput> = z.object({
  id: z.string().uuid().optional(),
  isUser: z.boolean(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  timestamp: z.coerce.date().optional()
}).strict();

export const MessageUpdateWithoutConversationInputSchema: z.ZodType<Prisma.MessageUpdateWithoutConversationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutConversationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutConversationInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutConversationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUser: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parts: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ConversationCreateManyAiModelInputSchema: z.ZodType<Prisma.ConversationCreateManyAiModelInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional().nullable(),
  courseId: z.string().optional().nullable(),
  systemPrompt: z.string().optional().nullable(),
  lastUpdate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ConversationUpdateWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUpdateWithoutAiModelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutConversationsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneWithoutConversationNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateWithoutAiModelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUncheckedUpdateOneWithoutConversationNestedInputSchema).optional(),
  messages: z.lazy(() => MessageUncheckedUpdateManyWithoutConversationNestedInputSchema).optional()
}).strict();

export const ConversationUncheckedUpdateManyWithoutAiModelInputSchema: z.ZodType<Prisma.ConversationUncheckedUpdateManyWithoutAiModelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  courseId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  systemPrompt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastUpdate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChapterCreateManyCourseInputSchema: z.ZodType<Prisma.ChapterCreateManyCourseInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.lazy(() => ChapterStatusSchema).optional(),
  objectives: z.union([ z.lazy(() => ChapterCreateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChapterUpdateWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizzes: z.lazy(() => QuizUpdateManyWithoutChapterNestedInputSchema).optional()
}).strict();

export const ChapterUncheckedUpdateWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUncheckedUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizzes: z.lazy(() => QuizUncheckedUpdateManyWithoutChapterNestedInputSchema).optional()
}).strict();

export const ChapterUncheckedUpdateManyWithoutCourseInputSchema: z.ZodType<Prisma.ChapterUncheckedUpdateManyWithoutCourseInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ChapterStatusSchema),z.lazy(() => EnumChapterStatusFieldUpdateOperationsInputSchema) ]).optional(),
  objectives: z.union([ z.lazy(() => ChapterUpdateobjectivesInputSchema),z.string().array() ]).optional(),
  content: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizCreateManyChapterInputSchema: z.ZodType<Prisma.QuizCreateManyChapterInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional().nullable(),
  quizType: z.lazy(() => QuizTypeSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuizUpdateWithoutChapterInputSchema: z.ZodType<Prisma.QuizUpdateWithoutChapterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  questions: z.lazy(() => QuestionUpdateManyWithoutQuizNestedInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const QuizUncheckedUpdateWithoutChapterInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateWithoutChapterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  questions: z.lazy(() => QuestionUncheckedUpdateManyWithoutQuizNestedInputSchema).optional(),
  attempts: z.lazy(() => QuizAttemptUncheckedUpdateManyWithoutQuizNestedInputSchema).optional()
}).strict();

export const QuizUncheckedUpdateManyWithoutChapterInputSchema: z.ZodType<Prisma.QuizUncheckedUpdateManyWithoutChapterInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quizType: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => NullableEnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuestionCreateManyQuizInputSchema: z.ZodType<Prisma.QuestionCreateManyQuizInput> = z.object({
  id: z.string().uuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => QuizTypeSchema),
  text: z.string(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuizAttemptCreateManyQuizInputSchema: z.ZodType<Prisma.QuizAttemptCreateManyQuizInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  score: z.number().optional().nullable(),
  status: z.lazy(() => QuizAttemptStatusSchema).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const QuestionUpdateWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUpdateWithoutQuizInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseUpdateManyWithoutQuestionNestedInputSchema).optional()
}).strict();

export const QuestionUncheckedUpdateWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUncheckedUpdateWithoutQuizInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuestionNestedInputSchema).optional()
}).strict();

export const QuestionUncheckedUpdateManyWithoutQuizInputSchema: z.ZodType<Prisma.QuestionUncheckedUpdateManyWithoutQuizInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => QuizTypeSchema),z.lazy(() => EnumQuizTypeFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const QuizAttemptUpdateWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUpdateWithoutQuizInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutQuizAttemptsNestedInputSchema).optional(),
  responses: z.lazy(() => UserQuizResponseUpdateManyWithoutQuizAttemptNestedInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedUpdateWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateWithoutQuizInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.lazy(() => UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptNestedInputSchema).optional()
}).strict();

export const QuizAttemptUncheckedUpdateManyWithoutQuizInputSchema: z.ZodType<Prisma.QuizAttemptUncheckedUpdateManyWithoutQuizInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => QuizAttemptStatusSchema),z.lazy(() => EnumQuizAttemptStatusFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  completedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseCreateManyQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseCreateManyQuestionInput> = z.object({
  id: z.string().uuid().optional(),
  quizAttemptId: z.string(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserQuizResponseUpdateWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateWithoutQuestionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttempt: z.lazy(() => QuizAttemptUpdateOneRequiredWithoutResponsesNestedInputSchema).optional()
}).strict();

export const UserQuizResponseUncheckedUpdateWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateWithoutQuestionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttemptId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseUncheckedUpdateManyWithoutQuestionInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateManyWithoutQuestionInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quizAttemptId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseCreateManyQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseCreateManyQuizAttemptInput> = z.object({
  id: z.string().uuid().optional(),
  questionId: z.string(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isCorrect: z.boolean().optional().nullable(),
  submittedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserQuizResponseUpdateWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUpdateWithoutQuizAttemptInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  question: z.lazy(() => QuestionUpdateOneRequiredWithoutResponsesNestedInputSchema).optional()
}).strict();

export const UserQuizResponseUncheckedUpdateWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateWithoutQuizAttemptInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptInputSchema: z.ZodType<Prisma.UserQuizResponseUncheckedUpdateManyWithoutQuizAttemptInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  questionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAnswer: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isCorrect: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ConversationFindFirstArgsSchema: z.ZodType<Prisma.ConversationFindFirstArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereInputSchema.optional(),
  orderBy: z.union([ ConversationOrderByWithRelationInputSchema.array(),ConversationOrderByWithRelationInputSchema ]).optional(),
  cursor: ConversationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ConversationScalarFieldEnumSchema,ConversationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ConversationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ConversationFindFirstOrThrowArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereInputSchema.optional(),
  orderBy: z.union([ ConversationOrderByWithRelationInputSchema.array(),ConversationOrderByWithRelationInputSchema ]).optional(),
  cursor: ConversationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ConversationScalarFieldEnumSchema,ConversationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ConversationFindManyArgsSchema: z.ZodType<Prisma.ConversationFindManyArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereInputSchema.optional(),
  orderBy: z.union([ ConversationOrderByWithRelationInputSchema.array(),ConversationOrderByWithRelationInputSchema ]).optional(),
  cursor: ConversationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ConversationScalarFieldEnumSchema,ConversationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ConversationAggregateArgsSchema: z.ZodType<Prisma.ConversationAggregateArgs> = z.object({
  where: ConversationWhereInputSchema.optional(),
  orderBy: z.union([ ConversationOrderByWithRelationInputSchema.array(),ConversationOrderByWithRelationInputSchema ]).optional(),
  cursor: ConversationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ConversationGroupByArgsSchema: z.ZodType<Prisma.ConversationGroupByArgs> = z.object({
  where: ConversationWhereInputSchema.optional(),
  orderBy: z.union([ ConversationOrderByWithAggregationInputSchema.array(),ConversationOrderByWithAggregationInputSchema ]).optional(),
  by: ConversationScalarFieldEnumSchema.array(),
  having: ConversationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ConversationFindUniqueArgsSchema: z.ZodType<Prisma.ConversationFindUniqueArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereUniqueInputSchema,
}).strict() ;

export const ConversationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ConversationFindUniqueOrThrowArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereUniqueInputSchema,
}).strict() ;

export const LLModelFindFirstArgsSchema: z.ZodType<Prisma.LLModelFindFirstArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereInputSchema.optional(),
  orderBy: z.union([ LLModelOrderByWithRelationInputSchema.array(),LLModelOrderByWithRelationInputSchema ]).optional(),
  cursor: LLModelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LLModelScalarFieldEnumSchema,LLModelScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LLModelFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LLModelFindFirstOrThrowArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereInputSchema.optional(),
  orderBy: z.union([ LLModelOrderByWithRelationInputSchema.array(),LLModelOrderByWithRelationInputSchema ]).optional(),
  cursor: LLModelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LLModelScalarFieldEnumSchema,LLModelScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LLModelFindManyArgsSchema: z.ZodType<Prisma.LLModelFindManyArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereInputSchema.optional(),
  orderBy: z.union([ LLModelOrderByWithRelationInputSchema.array(),LLModelOrderByWithRelationInputSchema ]).optional(),
  cursor: LLModelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LLModelScalarFieldEnumSchema,LLModelScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LLModelAggregateArgsSchema: z.ZodType<Prisma.LLModelAggregateArgs> = z.object({
  where: LLModelWhereInputSchema.optional(),
  orderBy: z.union([ LLModelOrderByWithRelationInputSchema.array(),LLModelOrderByWithRelationInputSchema ]).optional(),
  cursor: LLModelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LLModelGroupByArgsSchema: z.ZodType<Prisma.LLModelGroupByArgs> = z.object({
  where: LLModelWhereInputSchema.optional(),
  orderBy: z.union([ LLModelOrderByWithAggregationInputSchema.array(),LLModelOrderByWithAggregationInputSchema ]).optional(),
  by: LLModelScalarFieldEnumSchema.array(),
  having: LLModelScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LLModelFindUniqueArgsSchema: z.ZodType<Prisma.LLModelFindUniqueArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereUniqueInputSchema,
}).strict() ;

export const LLModelFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LLModelFindUniqueOrThrowArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereUniqueInputSchema,
}).strict() ;

export const MessageFindFirstArgsSchema: z.ZodType<Prisma.MessageFindFirstArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema,MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MessageFindFirstOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema,MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MessageFindManyArgsSchema: z.ZodType<Prisma.MessageFindManyArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema,MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MessageAggregateArgsSchema: z.ZodType<Prisma.MessageAggregateArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(),MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MessageGroupByArgsSchema: z.ZodType<Prisma.MessageGroupByArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  orderBy: z.union([ MessageOrderByWithAggregationInputSchema.array(),MessageOrderByWithAggregationInputSchema ]).optional(),
  by: MessageScalarFieldEnumSchema.array(),
  having: MessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MessageFindUniqueArgsSchema: z.ZodType<Prisma.MessageFindUniqueArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const MessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MessageFindUniqueOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const CourseFindFirstArgsSchema: z.ZodType<Prisma.CourseFindFirstArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CourseScalarFieldEnumSchema,CourseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CourseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CourseFindFirstOrThrowArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CourseScalarFieldEnumSchema,CourseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CourseFindManyArgsSchema: z.ZodType<Prisma.CourseFindManyArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CourseScalarFieldEnumSchema,CourseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CourseAggregateArgsSchema: z.ZodType<Prisma.CourseAggregateArgs> = z.object({
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CourseGroupByArgsSchema: z.ZodType<Prisma.CourseGroupByArgs> = z.object({
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithAggregationInputSchema.array(),CourseOrderByWithAggregationInputSchema ]).optional(),
  by: CourseScalarFieldEnumSchema.array(),
  having: CourseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CourseFindUniqueArgsSchema: z.ZodType<Prisma.CourseFindUniqueArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const CourseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CourseFindUniqueOrThrowArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const ChapterFindFirstArgsSchema: z.ZodType<Prisma.ChapterFindFirstArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereInputSchema.optional(),
  orderBy: z.union([ ChapterOrderByWithRelationInputSchema.array(),ChapterOrderByWithRelationInputSchema ]).optional(),
  cursor: ChapterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChapterScalarFieldEnumSchema,ChapterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ChapterFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ChapterFindFirstOrThrowArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereInputSchema.optional(),
  orderBy: z.union([ ChapterOrderByWithRelationInputSchema.array(),ChapterOrderByWithRelationInputSchema ]).optional(),
  cursor: ChapterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChapterScalarFieldEnumSchema,ChapterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ChapterFindManyArgsSchema: z.ZodType<Prisma.ChapterFindManyArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereInputSchema.optional(),
  orderBy: z.union([ ChapterOrderByWithRelationInputSchema.array(),ChapterOrderByWithRelationInputSchema ]).optional(),
  cursor: ChapterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChapterScalarFieldEnumSchema,ChapterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ChapterAggregateArgsSchema: z.ZodType<Prisma.ChapterAggregateArgs> = z.object({
  where: ChapterWhereInputSchema.optional(),
  orderBy: z.union([ ChapterOrderByWithRelationInputSchema.array(),ChapterOrderByWithRelationInputSchema ]).optional(),
  cursor: ChapterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ChapterGroupByArgsSchema: z.ZodType<Prisma.ChapterGroupByArgs> = z.object({
  where: ChapterWhereInputSchema.optional(),
  orderBy: z.union([ ChapterOrderByWithAggregationInputSchema.array(),ChapterOrderByWithAggregationInputSchema ]).optional(),
  by: ChapterScalarFieldEnumSchema.array(),
  having: ChapterScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ChapterFindUniqueArgsSchema: z.ZodType<Prisma.ChapterFindUniqueArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereUniqueInputSchema,
}).strict() ;

export const ChapterFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ChapterFindUniqueOrThrowArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereUniqueInputSchema,
}).strict() ;

export const QuizFindFirstArgsSchema: z.ZodType<Prisma.QuizFindFirstArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereInputSchema.optional(),
  orderBy: z.union([ QuizOrderByWithRelationInputSchema.array(),QuizOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuizScalarFieldEnumSchema,QuizScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuizFindFirstOrThrowArgsSchema: z.ZodType<Prisma.QuizFindFirstOrThrowArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereInputSchema.optional(),
  orderBy: z.union([ QuizOrderByWithRelationInputSchema.array(),QuizOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuizScalarFieldEnumSchema,QuizScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuizFindManyArgsSchema: z.ZodType<Prisma.QuizFindManyArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereInputSchema.optional(),
  orderBy: z.union([ QuizOrderByWithRelationInputSchema.array(),QuizOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuizScalarFieldEnumSchema,QuizScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuizAggregateArgsSchema: z.ZodType<Prisma.QuizAggregateArgs> = z.object({
  where: QuizWhereInputSchema.optional(),
  orderBy: z.union([ QuizOrderByWithRelationInputSchema.array(),QuizOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const QuizGroupByArgsSchema: z.ZodType<Prisma.QuizGroupByArgs> = z.object({
  where: QuizWhereInputSchema.optional(),
  orderBy: z.union([ QuizOrderByWithAggregationInputSchema.array(),QuizOrderByWithAggregationInputSchema ]).optional(),
  by: QuizScalarFieldEnumSchema.array(),
  having: QuizScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const QuizFindUniqueArgsSchema: z.ZodType<Prisma.QuizFindUniqueArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereUniqueInputSchema,
}).strict() ;

export const QuizFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.QuizFindUniqueOrThrowArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereUniqueInputSchema,
}).strict() ;

export const QuestionFindFirstArgsSchema: z.ZodType<Prisma.QuestionFindFirstArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereInputSchema.optional(),
  orderBy: z.union([ QuestionOrderByWithRelationInputSchema.array(),QuestionOrderByWithRelationInputSchema ]).optional(),
  cursor: QuestionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuestionScalarFieldEnumSchema,QuestionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuestionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.QuestionFindFirstOrThrowArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereInputSchema.optional(),
  orderBy: z.union([ QuestionOrderByWithRelationInputSchema.array(),QuestionOrderByWithRelationInputSchema ]).optional(),
  cursor: QuestionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuestionScalarFieldEnumSchema,QuestionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuestionFindManyArgsSchema: z.ZodType<Prisma.QuestionFindManyArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereInputSchema.optional(),
  orderBy: z.union([ QuestionOrderByWithRelationInputSchema.array(),QuestionOrderByWithRelationInputSchema ]).optional(),
  cursor: QuestionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuestionScalarFieldEnumSchema,QuestionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuestionAggregateArgsSchema: z.ZodType<Prisma.QuestionAggregateArgs> = z.object({
  where: QuestionWhereInputSchema.optional(),
  orderBy: z.union([ QuestionOrderByWithRelationInputSchema.array(),QuestionOrderByWithRelationInputSchema ]).optional(),
  cursor: QuestionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const QuestionGroupByArgsSchema: z.ZodType<Prisma.QuestionGroupByArgs> = z.object({
  where: QuestionWhereInputSchema.optional(),
  orderBy: z.union([ QuestionOrderByWithAggregationInputSchema.array(),QuestionOrderByWithAggregationInputSchema ]).optional(),
  by: QuestionScalarFieldEnumSchema.array(),
  having: QuestionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const QuestionFindUniqueArgsSchema: z.ZodType<Prisma.QuestionFindUniqueArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereUniqueInputSchema,
}).strict() ;

export const QuestionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.QuestionFindUniqueOrThrowArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereUniqueInputSchema,
}).strict() ;

export const QuizAttemptFindFirstArgsSchema: z.ZodType<Prisma.QuizAttemptFindFirstArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereInputSchema.optional(),
  orderBy: z.union([ QuizAttemptOrderByWithRelationInputSchema.array(),QuizAttemptOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizAttemptWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuizAttemptScalarFieldEnumSchema,QuizAttemptScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuizAttemptFindFirstOrThrowArgsSchema: z.ZodType<Prisma.QuizAttemptFindFirstOrThrowArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereInputSchema.optional(),
  orderBy: z.union([ QuizAttemptOrderByWithRelationInputSchema.array(),QuizAttemptOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizAttemptWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuizAttemptScalarFieldEnumSchema,QuizAttemptScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuizAttemptFindManyArgsSchema: z.ZodType<Prisma.QuizAttemptFindManyArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereInputSchema.optional(),
  orderBy: z.union([ QuizAttemptOrderByWithRelationInputSchema.array(),QuizAttemptOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizAttemptWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuizAttemptScalarFieldEnumSchema,QuizAttemptScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const QuizAttemptAggregateArgsSchema: z.ZodType<Prisma.QuizAttemptAggregateArgs> = z.object({
  where: QuizAttemptWhereInputSchema.optional(),
  orderBy: z.union([ QuizAttemptOrderByWithRelationInputSchema.array(),QuizAttemptOrderByWithRelationInputSchema ]).optional(),
  cursor: QuizAttemptWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const QuizAttemptGroupByArgsSchema: z.ZodType<Prisma.QuizAttemptGroupByArgs> = z.object({
  where: QuizAttemptWhereInputSchema.optional(),
  orderBy: z.union([ QuizAttemptOrderByWithAggregationInputSchema.array(),QuizAttemptOrderByWithAggregationInputSchema ]).optional(),
  by: QuizAttemptScalarFieldEnumSchema.array(),
  having: QuizAttemptScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const QuizAttemptFindUniqueArgsSchema: z.ZodType<Prisma.QuizAttemptFindUniqueArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereUniqueInputSchema,
}).strict() ;

export const QuizAttemptFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.QuizAttemptFindUniqueOrThrowArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereUniqueInputSchema,
}).strict() ;

export const UserQuizResponseFindFirstArgsSchema: z.ZodType<Prisma.UserQuizResponseFindFirstArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereInputSchema.optional(),
  orderBy: z.union([ UserQuizResponseOrderByWithRelationInputSchema.array(),UserQuizResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: UserQuizResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserQuizResponseScalarFieldEnumSchema,UserQuizResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserQuizResponseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserQuizResponseFindFirstOrThrowArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereInputSchema.optional(),
  orderBy: z.union([ UserQuizResponseOrderByWithRelationInputSchema.array(),UserQuizResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: UserQuizResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserQuizResponseScalarFieldEnumSchema,UserQuizResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserQuizResponseFindManyArgsSchema: z.ZodType<Prisma.UserQuizResponseFindManyArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereInputSchema.optional(),
  orderBy: z.union([ UserQuizResponseOrderByWithRelationInputSchema.array(),UserQuizResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: UserQuizResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserQuizResponseScalarFieldEnumSchema,UserQuizResponseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserQuizResponseAggregateArgsSchema: z.ZodType<Prisma.UserQuizResponseAggregateArgs> = z.object({
  where: UserQuizResponseWhereInputSchema.optional(),
  orderBy: z.union([ UserQuizResponseOrderByWithRelationInputSchema.array(),UserQuizResponseOrderByWithRelationInputSchema ]).optional(),
  cursor: UserQuizResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserQuizResponseGroupByArgsSchema: z.ZodType<Prisma.UserQuizResponseGroupByArgs> = z.object({
  where: UserQuizResponseWhereInputSchema.optional(),
  orderBy: z.union([ UserQuizResponseOrderByWithAggregationInputSchema.array(),UserQuizResponseOrderByWithAggregationInputSchema ]).optional(),
  by: UserQuizResponseScalarFieldEnumSchema.array(),
  having: UserQuizResponseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserQuizResponseFindUniqueArgsSchema: z.ZodType<Prisma.UserQuizResponseFindUniqueArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereUniqueInputSchema,
}).strict() ;

export const UserQuizResponseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserQuizResponseFindUniqueOrThrowArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ConversationCreateArgsSchema: z.ZodType<Prisma.ConversationCreateArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  data: z.union([ ConversationCreateInputSchema,ConversationUncheckedCreateInputSchema ]),
}).strict() ;

export const ConversationUpsertArgsSchema: z.ZodType<Prisma.ConversationUpsertArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereUniqueInputSchema,
  create: z.union([ ConversationCreateInputSchema,ConversationUncheckedCreateInputSchema ]),
  update: z.union([ ConversationUpdateInputSchema,ConversationUncheckedUpdateInputSchema ]),
}).strict() ;

export const ConversationCreateManyArgsSchema: z.ZodType<Prisma.ConversationCreateManyArgs> = z.object({
  data: z.union([ ConversationCreateManyInputSchema,ConversationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ConversationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ConversationCreateManyAndReturnArgs> = z.object({
  data: z.union([ ConversationCreateManyInputSchema,ConversationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ConversationDeleteArgsSchema: z.ZodType<Prisma.ConversationDeleteArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  where: ConversationWhereUniqueInputSchema,
}).strict() ;

export const ConversationUpdateArgsSchema: z.ZodType<Prisma.ConversationUpdateArgs> = z.object({
  select: ConversationSelectSchema.optional(),
  include: ConversationIncludeSchema.optional(),
  data: z.union([ ConversationUpdateInputSchema,ConversationUncheckedUpdateInputSchema ]),
  where: ConversationWhereUniqueInputSchema,
}).strict() ;

export const ConversationUpdateManyArgsSchema: z.ZodType<Prisma.ConversationUpdateManyArgs> = z.object({
  data: z.union([ ConversationUpdateManyMutationInputSchema,ConversationUncheckedUpdateManyInputSchema ]),
  where: ConversationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ConversationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ConversationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ConversationUpdateManyMutationInputSchema,ConversationUncheckedUpdateManyInputSchema ]),
  where: ConversationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ConversationDeleteManyArgsSchema: z.ZodType<Prisma.ConversationDeleteManyArgs> = z.object({
  where: ConversationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const LLModelCreateArgsSchema: z.ZodType<Prisma.LLModelCreateArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  data: z.union([ LLModelCreateInputSchema,LLModelUncheckedCreateInputSchema ]),
}).strict() ;

export const LLModelUpsertArgsSchema: z.ZodType<Prisma.LLModelUpsertArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereUniqueInputSchema,
  create: z.union([ LLModelCreateInputSchema,LLModelUncheckedCreateInputSchema ]),
  update: z.union([ LLModelUpdateInputSchema,LLModelUncheckedUpdateInputSchema ]),
}).strict() ;

export const LLModelCreateManyArgsSchema: z.ZodType<Prisma.LLModelCreateManyArgs> = z.object({
  data: z.union([ LLModelCreateManyInputSchema,LLModelCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LLModelCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LLModelCreateManyAndReturnArgs> = z.object({
  data: z.union([ LLModelCreateManyInputSchema,LLModelCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LLModelDeleteArgsSchema: z.ZodType<Prisma.LLModelDeleteArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  where: LLModelWhereUniqueInputSchema,
}).strict() ;

export const LLModelUpdateArgsSchema: z.ZodType<Prisma.LLModelUpdateArgs> = z.object({
  select: LLModelSelectSchema.optional(),
  include: LLModelIncludeSchema.optional(),
  data: z.union([ LLModelUpdateInputSchema,LLModelUncheckedUpdateInputSchema ]),
  where: LLModelWhereUniqueInputSchema,
}).strict() ;

export const LLModelUpdateManyArgsSchema: z.ZodType<Prisma.LLModelUpdateManyArgs> = z.object({
  data: z.union([ LLModelUpdateManyMutationInputSchema,LLModelUncheckedUpdateManyInputSchema ]),
  where: LLModelWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const LLModelUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.LLModelUpdateManyAndReturnArgs> = z.object({
  data: z.union([ LLModelUpdateManyMutationInputSchema,LLModelUncheckedUpdateManyInputSchema ]),
  where: LLModelWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const LLModelDeleteManyArgsSchema: z.ZodType<Prisma.LLModelDeleteManyArgs> = z.object({
  where: LLModelWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const MessageCreateArgsSchema: z.ZodType<Prisma.MessageCreateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageCreateInputSchema,MessageUncheckedCreateInputSchema ]),
}).strict() ;

export const MessageUpsertArgsSchema: z.ZodType<Prisma.MessageUpsertArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
  create: z.union([ MessageCreateInputSchema,MessageUncheckedCreateInputSchema ]),
  update: z.union([ MessageUpdateInputSchema,MessageUncheckedUpdateInputSchema ]),
}).strict() ;

export const MessageCreateManyArgsSchema: z.ZodType<Prisma.MessageCreateManyArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema,MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageCreateManyAndReturnArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema,MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MessageDeleteArgsSchema: z.ZodType<Prisma.MessageDeleteArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const MessageUpdateArgsSchema: z.ZodType<Prisma.MessageUpdateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageUpdateInputSchema,MessageUncheckedUpdateInputSchema ]),
  where: MessageWhereUniqueInputSchema,
}).strict() ;

export const MessageUpdateManyArgsSchema: z.ZodType<Prisma.MessageUpdateManyArgs> = z.object({
  data: z.union([ MessageUpdateManyMutationInputSchema,MessageUncheckedUpdateManyInputSchema ]),
  where: MessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const MessageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MessageUpdateManyMutationInputSchema,MessageUncheckedUpdateManyInputSchema ]),
  where: MessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const MessageDeleteManyArgsSchema: z.ZodType<Prisma.MessageDeleteManyArgs> = z.object({
  where: MessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CourseCreateArgsSchema: z.ZodType<Prisma.CourseCreateArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  data: z.union([ CourseCreateInputSchema,CourseUncheckedCreateInputSchema ]),
}).strict() ;

export const CourseUpsertArgsSchema: z.ZodType<Prisma.CourseUpsertArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
  create: z.union([ CourseCreateInputSchema,CourseUncheckedCreateInputSchema ]),
  update: z.union([ CourseUpdateInputSchema,CourseUncheckedUpdateInputSchema ]),
}).strict() ;

export const CourseCreateManyArgsSchema: z.ZodType<Prisma.CourseCreateManyArgs> = z.object({
  data: z.union([ CourseCreateManyInputSchema,CourseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CourseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CourseCreateManyAndReturnArgs> = z.object({
  data: z.union([ CourseCreateManyInputSchema,CourseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CourseDeleteArgsSchema: z.ZodType<Prisma.CourseDeleteArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const CourseUpdateArgsSchema: z.ZodType<Prisma.CourseUpdateArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  data: z.union([ CourseUpdateInputSchema,CourseUncheckedUpdateInputSchema ]),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const CourseUpdateManyArgsSchema: z.ZodType<Prisma.CourseUpdateManyArgs> = z.object({
  data: z.union([ CourseUpdateManyMutationInputSchema,CourseUncheckedUpdateManyInputSchema ]),
  where: CourseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CourseUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CourseUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CourseUpdateManyMutationInputSchema,CourseUncheckedUpdateManyInputSchema ]),
  where: CourseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CourseDeleteManyArgsSchema: z.ZodType<Prisma.CourseDeleteManyArgs> = z.object({
  where: CourseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ChapterCreateArgsSchema: z.ZodType<Prisma.ChapterCreateArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  data: z.union([ ChapterCreateInputSchema,ChapterUncheckedCreateInputSchema ]),
}).strict() ;

export const ChapterUpsertArgsSchema: z.ZodType<Prisma.ChapterUpsertArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereUniqueInputSchema,
  create: z.union([ ChapterCreateInputSchema,ChapterUncheckedCreateInputSchema ]),
  update: z.union([ ChapterUpdateInputSchema,ChapterUncheckedUpdateInputSchema ]),
}).strict() ;

export const ChapterCreateManyArgsSchema: z.ZodType<Prisma.ChapterCreateManyArgs> = z.object({
  data: z.union([ ChapterCreateManyInputSchema,ChapterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ChapterCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ChapterCreateManyAndReturnArgs> = z.object({
  data: z.union([ ChapterCreateManyInputSchema,ChapterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ChapterDeleteArgsSchema: z.ZodType<Prisma.ChapterDeleteArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  where: ChapterWhereUniqueInputSchema,
}).strict() ;

export const ChapterUpdateArgsSchema: z.ZodType<Prisma.ChapterUpdateArgs> = z.object({
  select: ChapterSelectSchema.optional(),
  include: ChapterIncludeSchema.optional(),
  data: z.union([ ChapterUpdateInputSchema,ChapterUncheckedUpdateInputSchema ]),
  where: ChapterWhereUniqueInputSchema,
}).strict() ;

export const ChapterUpdateManyArgsSchema: z.ZodType<Prisma.ChapterUpdateManyArgs> = z.object({
  data: z.union([ ChapterUpdateManyMutationInputSchema,ChapterUncheckedUpdateManyInputSchema ]),
  where: ChapterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ChapterUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ChapterUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ChapterUpdateManyMutationInputSchema,ChapterUncheckedUpdateManyInputSchema ]),
  where: ChapterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ChapterDeleteManyArgsSchema: z.ZodType<Prisma.ChapterDeleteManyArgs> = z.object({
  where: ChapterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuizCreateArgsSchema: z.ZodType<Prisma.QuizCreateArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  data: z.union([ QuizCreateInputSchema,QuizUncheckedCreateInputSchema ]),
}).strict() ;

export const QuizUpsertArgsSchema: z.ZodType<Prisma.QuizUpsertArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereUniqueInputSchema,
  create: z.union([ QuizCreateInputSchema,QuizUncheckedCreateInputSchema ]),
  update: z.union([ QuizUpdateInputSchema,QuizUncheckedUpdateInputSchema ]),
}).strict() ;

export const QuizCreateManyArgsSchema: z.ZodType<Prisma.QuizCreateManyArgs> = z.object({
  data: z.union([ QuizCreateManyInputSchema,QuizCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const QuizCreateManyAndReturnArgsSchema: z.ZodType<Prisma.QuizCreateManyAndReturnArgs> = z.object({
  data: z.union([ QuizCreateManyInputSchema,QuizCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const QuizDeleteArgsSchema: z.ZodType<Prisma.QuizDeleteArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  where: QuizWhereUniqueInputSchema,
}).strict() ;

export const QuizUpdateArgsSchema: z.ZodType<Prisma.QuizUpdateArgs> = z.object({
  select: QuizSelectSchema.optional(),
  include: QuizIncludeSchema.optional(),
  data: z.union([ QuizUpdateInputSchema,QuizUncheckedUpdateInputSchema ]),
  where: QuizWhereUniqueInputSchema,
}).strict() ;

export const QuizUpdateManyArgsSchema: z.ZodType<Prisma.QuizUpdateManyArgs> = z.object({
  data: z.union([ QuizUpdateManyMutationInputSchema,QuizUncheckedUpdateManyInputSchema ]),
  where: QuizWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuizUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.QuizUpdateManyAndReturnArgs> = z.object({
  data: z.union([ QuizUpdateManyMutationInputSchema,QuizUncheckedUpdateManyInputSchema ]),
  where: QuizWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuizDeleteManyArgsSchema: z.ZodType<Prisma.QuizDeleteManyArgs> = z.object({
  where: QuizWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuestionCreateArgsSchema: z.ZodType<Prisma.QuestionCreateArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  data: z.union([ QuestionCreateInputSchema,QuestionUncheckedCreateInputSchema ]),
}).strict() ;

export const QuestionUpsertArgsSchema: z.ZodType<Prisma.QuestionUpsertArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereUniqueInputSchema,
  create: z.union([ QuestionCreateInputSchema,QuestionUncheckedCreateInputSchema ]),
  update: z.union([ QuestionUpdateInputSchema,QuestionUncheckedUpdateInputSchema ]),
}).strict() ;

export const QuestionCreateManyArgsSchema: z.ZodType<Prisma.QuestionCreateManyArgs> = z.object({
  data: z.union([ QuestionCreateManyInputSchema,QuestionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const QuestionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.QuestionCreateManyAndReturnArgs> = z.object({
  data: z.union([ QuestionCreateManyInputSchema,QuestionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const QuestionDeleteArgsSchema: z.ZodType<Prisma.QuestionDeleteArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  where: QuestionWhereUniqueInputSchema,
}).strict() ;

export const QuestionUpdateArgsSchema: z.ZodType<Prisma.QuestionUpdateArgs> = z.object({
  select: QuestionSelectSchema.optional(),
  include: QuestionIncludeSchema.optional(),
  data: z.union([ QuestionUpdateInputSchema,QuestionUncheckedUpdateInputSchema ]),
  where: QuestionWhereUniqueInputSchema,
}).strict() ;

export const QuestionUpdateManyArgsSchema: z.ZodType<Prisma.QuestionUpdateManyArgs> = z.object({
  data: z.union([ QuestionUpdateManyMutationInputSchema,QuestionUncheckedUpdateManyInputSchema ]),
  where: QuestionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuestionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.QuestionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ QuestionUpdateManyMutationInputSchema,QuestionUncheckedUpdateManyInputSchema ]),
  where: QuestionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuestionDeleteManyArgsSchema: z.ZodType<Prisma.QuestionDeleteManyArgs> = z.object({
  where: QuestionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuizAttemptCreateArgsSchema: z.ZodType<Prisma.QuizAttemptCreateArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  data: z.union([ QuizAttemptCreateInputSchema,QuizAttemptUncheckedCreateInputSchema ]),
}).strict() ;

export const QuizAttemptUpsertArgsSchema: z.ZodType<Prisma.QuizAttemptUpsertArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereUniqueInputSchema,
  create: z.union([ QuizAttemptCreateInputSchema,QuizAttemptUncheckedCreateInputSchema ]),
  update: z.union([ QuizAttemptUpdateInputSchema,QuizAttemptUncheckedUpdateInputSchema ]),
}).strict() ;

export const QuizAttemptCreateManyArgsSchema: z.ZodType<Prisma.QuizAttemptCreateManyArgs> = z.object({
  data: z.union([ QuizAttemptCreateManyInputSchema,QuizAttemptCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const QuizAttemptCreateManyAndReturnArgsSchema: z.ZodType<Prisma.QuizAttemptCreateManyAndReturnArgs> = z.object({
  data: z.union([ QuizAttemptCreateManyInputSchema,QuizAttemptCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const QuizAttemptDeleteArgsSchema: z.ZodType<Prisma.QuizAttemptDeleteArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  where: QuizAttemptWhereUniqueInputSchema,
}).strict() ;

export const QuizAttemptUpdateArgsSchema: z.ZodType<Prisma.QuizAttemptUpdateArgs> = z.object({
  select: QuizAttemptSelectSchema.optional(),
  include: QuizAttemptIncludeSchema.optional(),
  data: z.union([ QuizAttemptUpdateInputSchema,QuizAttemptUncheckedUpdateInputSchema ]),
  where: QuizAttemptWhereUniqueInputSchema,
}).strict() ;

export const QuizAttemptUpdateManyArgsSchema: z.ZodType<Prisma.QuizAttemptUpdateManyArgs> = z.object({
  data: z.union([ QuizAttemptUpdateManyMutationInputSchema,QuizAttemptUncheckedUpdateManyInputSchema ]),
  where: QuizAttemptWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuizAttemptUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.QuizAttemptUpdateManyAndReturnArgs> = z.object({
  data: z.union([ QuizAttemptUpdateManyMutationInputSchema,QuizAttemptUncheckedUpdateManyInputSchema ]),
  where: QuizAttemptWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const QuizAttemptDeleteManyArgsSchema: z.ZodType<Prisma.QuizAttemptDeleteManyArgs> = z.object({
  where: QuizAttemptWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserQuizResponseCreateArgsSchema: z.ZodType<Prisma.UserQuizResponseCreateArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  data: z.union([ UserQuizResponseCreateInputSchema,UserQuizResponseUncheckedCreateInputSchema ]),
}).strict() ;

export const UserQuizResponseUpsertArgsSchema: z.ZodType<Prisma.UserQuizResponseUpsertArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereUniqueInputSchema,
  create: z.union([ UserQuizResponseCreateInputSchema,UserQuizResponseUncheckedCreateInputSchema ]),
  update: z.union([ UserQuizResponseUpdateInputSchema,UserQuizResponseUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserQuizResponseCreateManyArgsSchema: z.ZodType<Prisma.UserQuizResponseCreateManyArgs> = z.object({
  data: z.union([ UserQuizResponseCreateManyInputSchema,UserQuizResponseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserQuizResponseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserQuizResponseCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserQuizResponseCreateManyInputSchema,UserQuizResponseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserQuizResponseDeleteArgsSchema: z.ZodType<Prisma.UserQuizResponseDeleteArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  where: UserQuizResponseWhereUniqueInputSchema,
}).strict() ;

export const UserQuizResponseUpdateArgsSchema: z.ZodType<Prisma.UserQuizResponseUpdateArgs> = z.object({
  select: UserQuizResponseSelectSchema.optional(),
  include: UserQuizResponseIncludeSchema.optional(),
  data: z.union([ UserQuizResponseUpdateInputSchema,UserQuizResponseUncheckedUpdateInputSchema ]),
  where: UserQuizResponseWhereUniqueInputSchema,
}).strict() ;

export const UserQuizResponseUpdateManyArgsSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyArgs> = z.object({
  data: z.union([ UserQuizResponseUpdateManyMutationInputSchema,UserQuizResponseUncheckedUpdateManyInputSchema ]),
  where: UserQuizResponseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserQuizResponseUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserQuizResponseUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserQuizResponseUpdateManyMutationInputSchema,UserQuizResponseUncheckedUpdateManyInputSchema ]),
  where: UserQuizResponseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserQuizResponseDeleteManyArgsSchema: z.ZodType<Prisma.UserQuizResponseDeleteManyArgs> = z.object({
  where: UserQuizResponseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;