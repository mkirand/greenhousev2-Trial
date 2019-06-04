import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
  
@Injectable()
export class EncryptionService {

  string2encyrpt;
  key;
  iv;

  constructor() { }

  public encrytme(mystring: string): any {
    //Encyption
      this.string2encyrpt = '{"sql": "' + mystring + '", "lock": "krishna108"}'
      console.log(mystring);
      console.log(this.string2encyrpt);
      this.key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789xxxxxx");
      this.iv  = CryptoJS.enc.Hex.parse("yyyyyy9876543210abcdef9876543210");
      var encrypted = CryptoJS.AES.encrypt(this.string2encyrpt, this.key, {
                  iv: this.iv  
                });
      
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);    
  }

}