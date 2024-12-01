import { Document, Types } from 'mongoose';

enum Rola {
  Pacjent = "pacjent",
  Lekarz = "lekarz",
  Pielegniarka = "pielęgniarka",
}

export interface IBaseUser extends Document {
  name: string;
  lastName: string;
  age: number;
  address: {
    city: string;
    street: string;
    nbr: string;
  };
  tele: number;
  rola: Rola;
}

export interface IDoctor extends IBaseUser {
  rola: Rola.Lekarz; // Typowanie wymuszające rolę lekarza
  specjalizacja: string; // Specyficzne pole dla lekarzy
  pacjenci: Types.ObjectId[]; // Lista pacjentów przypisanych do lekarza
}

export interface IUser extends IBaseUser {
  rola: Rola.Pacjent;
  historiaChorob: string[]; // Unikalne dane dla pacjenta
  wizyty: Types.ObjectId[]; // Wizyty pacjenta
}

export interface INurse extends IBaseUser {
  rola: Rola.Pielegniarka;
  wykonywaneBadania: string[]; // Specyficzne pole dla pielęgniarki
}

export interface IUserAction extends Document {
  type: string; // np. "recepta", "wizyta", "badanie"
  description: string; // Opis działania
  date: Date; // Data działania
  wykonawca: Types.ObjectId; // ID lekarza/pielęgniarki
  pacjent: Types.ObjectId; // ID pacjenta
}