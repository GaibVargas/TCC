import { Question, QuestionType, Quiz } from '../../quiz/type'
import { InstructorSessionQuestionFeedback, ParticipantSessionQuestionFeedback, SessionQuestion, SessionQuiz } from '../type'

type AnswerFeedback = {
  is_correct: boolean
  points: number
  velocity_bonus: number
  streak_bonus: number
}

export type Answer = {
  user_public_id: string
  given_answer: string
  feedback: AnswerFeedback
}

export class QuizManager {
  private current_question: number
  private questions_start_time: Map<string, number> // chave: public_id da questão, valor: timestamp
  private answers: Map<string, Answer[]> // chave: public_id da questão

  constructor(private quiz: Quiz) {
    this.current_question = 0
    this.answers = new Map()
    this.questions_start_time = new Map()
  }

  getQuiz(): SessionQuiz {
    return {
      public_id: this.quiz.public_id,
      title: this.quiz.title,
    }
  }

  getCurrentQuestion(): SessionQuestion {
    const question = this.quiz.questions[this.current_question]
    return {
      public_id: question.public_id,
      description: question.description,
      type: question.type,
      time_limit: question.time_limit,
      index: this.current_question,
      total: this.quiz.questions.length,
      options: question.options.map(({ public_id, description }) => ({ public_id, description })),
      startedAt: this.questions_start_time.get(question.public_id) ?? 0,
    }
  }

  startCurrentQuestion(): SessionQuestion {
    const question = this.getCurrentQuestion()
    if (this.questions_start_time.has(question.public_id)) {
      return question
    }
    const start_time = Date.now()
    this.questions_start_time.set(question.public_id, start_time)
    return {
      ...question,
      startedAt: start_time,
    }
  }

  private nextQuestion(): void {
    const next_index = this.current_question + 1
    this.current_question = Math.min(next_index, this.quiz.questions.length - 1)
  }

  getNextQuestion(): SessionQuestion {
    this.nextQuestion()
    return this.getCurrentQuestion()
  }

  answerQuestion(user_public_id: string, question_public_id: string, given_answer: string): void {
    const question = this.getCurrentQuestion()
    if (question.public_id !== question_public_id) return
    const answer: Answer = {
      user_public_id,
      given_answer,
      feedback: this.getAnswerFeedback(user_public_id, given_answer)
    }
    const question_answers = this.answers.get(question_public_id)
    if (!question_answers) this.answers.set(question_public_id, [answer])
    else question_answers.push(answer)
  }

  participantHasAnsweredQuestion(user_public_id: string, question_public_id: string): boolean {
    const answers = this.answers.get(question_public_id)
    if (!answers) return false
    return answers.some(a => a.user_public_id === user_public_id)
  }

  getParticipantsThatAnsweredQuestion(question_public_id: string): string[] {
    const answers = this.answers.get(question_public_id)
    if (!answers) return []
    return Array.from(answers.map(a => a.user_public_id))
  }

  getParticipantQuestionFeedback(user_public_id: string, question_public_id: string): ParticipantSessionQuestionFeedback {
    const default_feedback: ParticipantSessionQuestionFeedback = {
      correct_answer: '',
      given_answer: '',
      is_correct: false,
      points: 0,
      streak_bonus: 0,
      velocity_bonus: 0,
    }
    const question = this.quiz.questions.filter(q => q.public_id === question_public_id)[0]
    if (!question) return default_feedback
  
    default_feedback.correct_answer = this.getQuestionCorrectAnswer(question)
  
    const given_answers = this.answers.get(question_public_id)
    if (!given_answers) return default_feedback

    const given_answer = given_answers.filter(a => a.user_public_id === user_public_id)[0]
    if (!given_answer) return default_feedback
    return {
      correct_answer: default_feedback.correct_answer,
      given_answer: given_answer.given_answer,
      ...given_answer.feedback,
    }
  }

  getInstructorQuestionFeedback(question_public_id: string): InstructorSessionQuestionFeedback {
    const default_feedback: InstructorSessionQuestionFeedback = {
      correct_answer: '',
      answers: {}
    }
    const question = this.quiz.questions.filter(q => q.public_id === question_public_id)[0]
    if (!question) return default_feedback
    
    default_feedback.correct_answer = this.getQuestionCorrectAnswer(question)

    const answers = this.answers.get(question_public_id)
    if (!answers) return default_feedback

    default_feedback.answers = answers.reduce((acc: Record<string, string[]>, answer) => {
      const given_answer = answer.given_answer.toLocaleLowerCase()
      if (!acc[given_answer]) acc[given_answer] = [answer.user_public_id]
      else acc[given_answer].push(answer.user_public_id)
      return acc
    }, {})
    
    return default_feedback
  }

  private getAnswerFeedback(user_public_id: string, given_answer: string): AnswerFeedback {
    const is_correct = this.isAnswerCorrect(given_answer)
    return {
      is_correct,
      points: is_correct ? 100 : 0,
      // TODO
      streak_bonus: 0,
      velocity_bonus: 0,
    }
  }

  private isAnswerCorrect(given_answer: string): boolean {
    const question = this.quiz.questions[this.current_question]
    const correct_answer = this.getQuestionCorrectAnswer(question)
    return given_answer.toLocaleLowerCase() === correct_answer.toLocaleLowerCase()
  }

  private getQuestionCorrectAnswer(question: Question): string {
    if (question.type === QuestionType.TEXT) {
      return question.correct_text_answer
    }
    const option = question.options.filter(o => o.is_correct_answer)[0]
    if (!option) return ''
    return option.public_id
  }
}
