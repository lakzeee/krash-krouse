import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const secret = process.env.SIGNING_SECRET;
  if (!secret) return new Response('Missing secret', { status: 500 });

  const wh = new Webhook(secret);
  const body = await req.text();
  const headerPayload = await headers();

  const event = wh.verify(body, {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  }) as WebhookEvent;

  if (event.type === 'user.created') {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      last_sign_in_at,
      created_at,
      updated_at,
    } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      return new Response('Missing primary email address', { status: 400 });
    }

    await prisma.user.upsert({
      where: { id },
      update: {},
      create: {
        id,
        email,
        firstName: first_name,
        lastName: last_name,
        profileImageUrl: image_url,
        lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : new Date(),
        createdAt: created_at ? new Date(created_at) : new Date(),
        updatedAt: updated_at ? new Date(updated_at) : new Date(),
      },
    });
  } else if (event.type === 'user.updated') {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      last_sign_in_at,
      updated_at,
    } = event.data;

    // Check if user exists before updating
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true }, // Only select id for efficiency
    });

    if (!existingUser) {
      console.warn(
        `Skipping user.updated for user ${id}: User not found in database.`
      );
      // Acknowledge webhook, but indicate user wasn't found locally
      return new Response('OK - User not found', { status: 200 });
    }

    const email = email_addresses?.[0]?.email_address;

    await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        firstName: first_name,
        lastName: last_name,
        profileImageUrl: image_url,
        lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : new Date(),
        updatedAt: updated_at ? new Date(updated_at) : new Date(),
      },
    });
  } else if (event.type === 'user.deleted') {
    const { id } = event.data;

    // Check if user exists before deleting
    // Important if Clerk sends delete event even if create/sync failed previously
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      console.warn(
        `Skipping user.deleted for user ${id}: User not found in database.`
      );
      return new Response('OK - User not found', { status: 200 });
    }

    await prisma.user.deleteMany({
      where: { id },
    });
  }

  return new Response('OK');
}
