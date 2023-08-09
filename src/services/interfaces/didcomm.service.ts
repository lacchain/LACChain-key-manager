import { IDidCommToEncryptData } from 'src/interfaces/didcomm/didcomm.interface';

export interface IDidCommService {
  encrypt(args: IDidCommToEncryptData): Promise<string>;
}
