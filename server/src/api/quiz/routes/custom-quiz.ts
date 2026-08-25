export default {
    routes: [
        {
            method: 'GET',
            path: '/quizzes/:documentId/find',
            handler: 'quiz.find',
            config: {
                auth: {},
            },
        },
        {
            method: 'POST',
            path: '/quizzes/:documentId/submit',
            handler: 'quiz.submit',
            config: {
                auth: {},
            },
        },
    ],
}