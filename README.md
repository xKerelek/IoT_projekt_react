# Projekt: Aplikacja Webowa IoT - Monitorowanie Parametrów Środowiskowych

## Opis projektu

Celem projektu było stworzenie aplikacji webowej umożliwiającej odczyt i monitorowanie parametrów środowiskowych z urządzeń IoT, w szczególności mikrokontrolerów. W aplikacji zbierane i prezentowane są dane dotyczące:

- **Temperatury** (°C)
- **Wilgotności powietrza** (%)
- **Ciśnienia atmosferycznego** (hPa)

Aplikacja pozwala użytkownikom na rejestrację, logowanie oraz dodawanie własnych odczytów z podłączonych urządzeń IoT. Użytkownicy mogą na bieżąco monitorować i wizualizować parametry w postaci interaktywnych wykresów.

## Funkcjonalności

- **Rejestracja i logowanie użytkowników**:
  - Użytkownik może założyć konto oraz logować się, aby mieć dostęp do swoich danych i odczytów.
  
- **Dodawanie odczytów z urządzeń**:
  - Aplikacja umożliwia ręczne wprowadzanie odczytów lub automatyczne pobieranie danych z podłączonych mikrokontrolerów, które mierzą temperaturę, wilgotność i ciśnienie atmosferyczne.

- **Wyświetlanie i wizualizacja danych**:
  - Dane zbierane z urządzeń są przechowywane w bazie danych i wyświetlane w aplikacji w postaci dynamicznych wykresów.

- **Zarządzanie urządzeniami IoT**:
  - Użytkownik może podłączyć swoje urządzenia IoT, konfigurować je oraz zarządzać ich ustawieniami.

## Technologie

Projekt został zrealizowany przy użyciu nowoczesnych technologii webowych oraz rozwiązań IoT, w tym:

- **Frontend**:
  - **React** – biblioteka JavaScript do budowy interfejsów użytkownika, która umożliwia tworzenie dynamicznych i responsywnych aplikacji.
  - **CSS3** – do stylowania i układu komponentów.

- **Backend**:
  - **Node.js** – środowisko uruchomieniowe JavaScript na serwerze, które umożliwia komunikację z bazą danych oraz obsługę logiki biznesowej.
  - **Express.js** – framework do Node.js ułatwiający budowę API.

- **Baza danych**:
  - **MongoDB** – nierelacyjna baza danych typu NoSQL, używana do przechowywania informacji o użytkownikach oraz ich odczytach z urządzeń IoT.

- **IoT i mikrokontrolery**:
  - Mikrokontrolery wykorzystane w projekcie służyły do odczytu danych środowiskowych, które były następnie wysyłane do aplikacji.

## Schemat działania aplikacji

1. **Rejestracja/Logowanie**: Użytkownik tworzy konto lub loguje się na istniejące, aby móc zarządzać swoimi urządzeniami i danymi.
2. **Dodawanie urządzeń**: Użytkownik podłącza swoje urządzenia IoT (np. mikrokontrolery) do aplikacji.
3. **Odczyt danych**: Aplikacja odbiera dane z mikrokontrolerów na temat temperatury, wilgotności i ciśnienia, które są przechowywane w bazie danych.
4. **Wizualizacja danych**: Użytkownik może przeglądać dane w aplikacji w postaci wykresów, które odświeżają się w czasie rzeczywistym.

## Autorzy
- Karol Nowak
  - numer albumu: 36782

- Krystian Wiart
  - numer albumu: 36415
