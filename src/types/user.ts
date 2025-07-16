export interface UserData {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  phone: string;
  avatarId: string;
  avatarSource: string;
  birthDate: string;
  createdAt: number;
  ultimoAcesso: string;
  points: number;
  desempenho: "Bom" | "Médio" | "Ruim";
}