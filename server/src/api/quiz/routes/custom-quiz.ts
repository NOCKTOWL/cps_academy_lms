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
    ],
}