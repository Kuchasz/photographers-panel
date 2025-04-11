module.exports = {
    root: true,
    extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'unicorn/filename-case': [
            'error',
            {
                case: 'kebabCase',
                ignore: ['\\.(test|spec)\\.tsx?$'],
            },
        ],
    },
    plugins: ['unicorn'],
}; 