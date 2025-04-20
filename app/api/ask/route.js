import { getEducationalAnswer } from '@/lib/server/educationalChat';

export async function POST(request) {
  try {
    const { question , chatId } = await request.json();
    if ( !question || !chatId) {
      return Response.json({ error: 'Missing  question or chatId' }, { status: 400 });
    }

    const answer = await getEducationalAnswer(chatId,question);

    return Response.json({ answer });
  } catch (err) {
    return Response.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
