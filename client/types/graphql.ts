import { ObjectType, Field, ID, InputType } from 'type-graphql';
import type { Course as PrismaCourse, Chapter as PrismaChapter, User as PrismaUser, ChapterStatus } from '@prisma/client';

@ObjectType()
export class Course implements PrismaCourse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  creatorId!: string;

  @Field(() => String, { nullable: true })
  conversationId!: string | null;

  @Field(() => String)
  topic!: string;

  @Field(() => String)
  goal!: string;

  @Field(() => String, { nullable: true })
  title!: string | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Boolean)
  isPublic!: boolean;
}

@ObjectType()
export class Chapter implements PrismaChapter {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  courseId!: string;

  @Field(() => String, { nullable: true })
  title!: string | null;

  @Field(() => Number)
  order!: number;

  @Field(() => String)
  status!: ChapterStatus;

  @Field(() => [String])
  objectives!: string[];

  @Field(() => String)
  content!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class User implements PrismaUser {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  firstName!: string | null;

  @Field(() => String, { nullable: true })
  lastName!: string | null;

  @Field(() => String, { nullable: true })
  profileImageUrl!: string | null;

  @Field(() => Date, { nullable: true })
  lastSignInAt!: Date | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
} 

@InputType()
export class CreateConversationInput {
  @Field(() => String, { nullable: true })
  systemPrompt?: string;

  @Field(() => String, { nullable: true })
  aiModelId?: string;
}

@InputType()
export class UpdateConversationInput {
  @Field(() => String, { nullable: true })
  courseId?: string;

  @Field(() => String, { nullable: true })
  aiModelId?: string;

  @Field(() => String, { nullable: true })
  systemPrompt?: string;
}

@InputType()
export class CreateCourseInput {
  @Field(() => String, { nullable: false })
  topic!: string;

  @Field(() => String, { nullable: false })
  goal!: string;

  @Field(() => String, { nullable: true })
  title?: string;
}

@InputType()
export class UpdateCourseInput {
  @Field(() => String, { nullable: true })
  topic?: string;

  @Field(() => String, { nullable: true })
  goal?: string;

  @Field(() => String, { nullable: true })
  title?: string;
} 