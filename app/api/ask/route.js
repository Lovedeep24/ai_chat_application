import { getEducationalAnswer } from '../../../wsserver.js';
export async function POST(request) {
  try {
    const { question} = await request.json();
    if ( !question) {
      return Response.json({ error: 'Missing  question' }, { status: 400 });
    }

    const answer = await getEducationalAnswer(question);

    return Response.json({ answer });
  } catch (err) {
    return Response.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
