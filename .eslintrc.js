// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
        jquery: true
    },
    extends: [
        // https://github.com/guidesmiths/eslint-config-imperative-es6
        "imperative-es6",
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        "indent": ["error", 4],
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'linebreak-style': 'off',
        'array-callback-return': 'off',
        'no-console': 'off',
        'new-cap': 'off'
        // // 箭头函数体使用大括号
        // 'arrow-body-style':'as-needed',
        // // 箭头函数的参数使用圆括号 函数体在一个指令块中（被花括号括起来）要求使用圆括号把参数括起来
        // 'arrow-parens':["as-needed", { "requireForBlockBody": true }],
        // // 箭头函数的箭头之前或之后有空格 默认值都是true
        // 'arrow-spacing':{ "before": true, "after": true },
        // // 禁止使用var
        // 'no-var':'true',
        // // 禁止改变用const声明的变量
        // "no-const-assign":true,
        // // 不允许类成员中有重复的名称
        // 'no-dupe-class-members':true,
        // // 禁止重复导入
        // 'no-duplicate-imports':true,
        // // 禁止在对象中使用不必要的计算属性
        // 'no-useless-computed-key':true,
        // // 禁用不必要的构造函数
        // 'no-useless-constructor':true,
        // // 要求对象字面量简写语法
        // 'object-shorthand':'consistent-as-needed',
        // // 建议使用模板而非字符串连接
        // 'prefer-template':true,
        // // 强制模板字符串中空格的使用
        // 'template-curly-spacing':["warning", "always"],
        // // 强制在 yield* 表达式中 * 周围使用空格
        // "yield-star-spacing": ["warning", "both"]
    }
}
