pre-commit and pre-push need to be executable scripts. To accomplish that we run
the following commands:

`$ npm run prepare`

`$ sudo chmod ug+x .husky/*`

`$ sudo chmod ug+x .git/hooks/*`

*Note*
The command `git commit` will execute the following scripts: 

```bash
> @adomne/express-ts-jest-boilerplate@1.0.0 precommit
> npm run lint-fix && npm run pretty


> @adomne/express-ts-jest-boilerplate@1.0.0 lint-fix
> eslint --fix 'src/**/*.ts' && eslint --fix 'tests/**/*.ts'


> @adomne/express-ts-jest-boilerplate@1.0.0 pretty
> prettier --write 'src/**/*.ts' && prettier --write 'tests/**/*.ts'
```

if you don't see these, restart vscode.