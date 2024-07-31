import { connect } from '../../lib/db'
import Question from '../../lib/modals/question.modal';
// import User from '../../models/User';

export default async function handler(req, res) {
  await connect();

  if (req.method === 'POST') {
    const { bookId, question, userId } = req.body;

    try {
    //   const user = await User.findById(userId);

      const newQuestion = new Question({
        googleBookId,
        userId,
        question,
      });

      await newQuestion.save();

      res.status(201).json(newQuestion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to post question' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}