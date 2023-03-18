<h1 align="center">
  <img src="public/logo.svg" width="32" height="32"> icy
</h1>

**icy** is a web application that allows users to manage their academic curriculum. It gets its name from the abbreviation 'IC' meaning intuitive curriculum, which inspired the development of this web application.

## Features
- start a curriculum from a list of templates (currently only has UPLB programs)
- add, edit, and delete courses
- organize courses into semesters
- drag and drop courses between semesters
- create connections between courses (prerequisites)

## Built With
* [create-t3-app](https://create.t3.gg/)
* [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)

## Local Setup
1. Clone the repository
```bash
git clone https://github.com/kpaquino2/icy/
```

2. After cloning the repository, install the dependencies.
```bash
pnpm install
```

3. Set up your .env file
```bash
cp .env-example .env
# now edit the .env file
```

4. Push the schema to the database

```bash
npx prisma db push
```

5. Run in development mode

```bash
pnpm run dev
```

## Contributing
If you have a feature request or a bug to report, please add it as an issue or fork the repository and submit a pull request.

## License
This project is licensed under the AGPL 3.0 license. See the LICENSE file for more details.
