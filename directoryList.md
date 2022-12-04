```|-- undefined
    |-- .env
    |-- .eslintrc.json
    |-- .gitignore
    |-- .prettierrc.json
    |-- directoryList.md
    |-- example.env
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- todo.md
    |-- tsconfig.json
    |-- .vscode
    |   |-- settings.json
    |-- docs
    |   |-- thunder-collection_chat.json
    |-- src
        |-- app.ts
        |-- config.ts
        |-- routes.ts
        |-- setupDatabase.ts
        |-- setupServer.ts
        |-- features
        |   |-- auth
        |       |-- controllers
        |       |   |-- signup.ts
        |       |-- interfaces
        |       |   |-- auth.interface.ts
        |       |-- models
        |       |   |-- auth.scheme.ts
        |       |-- routes
        |       |   |-- authRoutes.ts
        |       |-- schemes
        |           |-- password.ts
        |           |-- signIn.ts
        |           |-- signUp.ts
        |-- shared
            |-- globals
            |   |-- decorators
            |   |   |-- joi-validation.decorators.ts
            |   |-- helpers
            |       |-- cloudinary-upload.ts
            |       |-- error-handler.ts
            |       |-- helpers.ts
            |-- services
            |   |-- db
            |   |   |-- auth.service.ts
            |   |-- emails
            |   |-- queues
            |   |-- redis
            |-- sockets
            |-- workers
```