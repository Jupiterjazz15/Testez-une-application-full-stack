# Yoga App – Projet Full Stack

Application de gestion de sessions de yoga développée avec **Angular** (front-end) et **Spring Boot** (back-end).
Le projet inclut des tests **unitaires** et **E2E**, ainsi qu’un rapport de **couverture de code** généré avec **Jacoco**.

---

## Prérequis

Assurez-vous d’avoir installé sur votre poste :

- Java 17
- NodeJS 16
- Angular CLI 14
- MySQL
- Maven

---

### Installation du projet

Cloner le dépôt :

```bash
git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing
cd P5-Full-Stack-testing
```

### Installation des dépendances

```bash
cd front
npm install
```

```bash
cd ../back
mvn clean install
```

## Lancement du projet

### Lancer le serveur Angular (front-end)

```bash
cd front
ng serve
```

### Lancer le serveur Spring Boot (back-end)

```bash
cd back
mvn spring-boot:run
```

#### Compte admin par défaut :

Email : yoga@studio.com

Mot de passe : test!1234


## Tests

### Front – Tests unitaires Angular

```bash
cd front
ng test
```

### Front – Tests end-to-end (Cypress)

```bash
npx cypress run --env coverage=true
```

### Front-  Rapport de couverture Cypress  :

Commande pour voir le taux de couverture des tests 2e2 :

```bash
npm run e2e:coverage
```

Le rapport est généré dans le fichier ci-dessous :

```bash
front/coverage/lcov-report/index.html
```

### Back – Tests unitaires JUnit

```bash
cd back
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
mvn clean test
```

### Back – Rapport de couverture Jacoco
Après les tests, générer le rapport :
```bash
mvn jacoco:report
```
Puis ouvrir le fichier ci-dessous dans votre navigateur :
```bash
file:///Users/coraliehaller/Code/Jupiterjazz15/Testez-une-application-full-stack/back/target/site/jacoco/index.html
```


## Structure du projet
FRONT  – Application Angular

BACK – Application Spring Boot

SCRIPT DE LA GENERATION DE LA BASE MYSQL - ressources/sql/script.sql
