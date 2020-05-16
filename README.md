This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Programmer
- NodeJS og npm https://nodejs.org/en/

### Deploy
To build the app for production run: 
````
npm install
npm run test-final
npm run build
````

This will build all the neccesary files to the /build folder.

### Develpment
##### Config 
###### ESLint
Gå til Settings -> Languages & Frameworks -> Javascript -> Code Quality Tools -> EsLint.
Set til Automatic.
###### Import uten semi-colon for Typescript
Gå til Settings -> Editor -> CodeStyle -> Typescript og velg Punctuation tabben.
Set til Don't use semicolon...
##### Component
Komponenter skal ha navn som starter med stor bokstav, postfix ``.component.tsx`` og skal ligge inne i en mappe med samme navn men liten bokstav. 
Skript for å lage ny komponent, det siste eksempelet generer en testfil også:
`````
npm run new --test --mappe=components --navn=Test
`````
##### Code
To build the app for development run: 
````
npm install
npm run start
````
This will run a react-dev-server on localhost:3000
##### Tests
All test files kan be run with (test-final runs tests only through one time):
````
npm run test
````