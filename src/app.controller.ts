import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './Account';
import { Post } from '@nestjs/common';
import { OpenAccountDto } from './openAccount.dto';
import { Body } from '@nestjs/common';
import { Response, response } from 'express';
import { HttpRedirectResponse } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { error } from 'console';
 
 
@Controller()
export class AppController {
 
  #accounts: Account[] = [
    {
      id: '1111-2222',
      balance: 15000,
      owner: 'Admin',
      createdAt: new Date(2020, 1, 1)
    },
    {
      id: '1234-5678',
      balance: 200000,
      owner: 'User12',
      createdAt: new Date(2021, 12, 1)
    },
    {
      id: '2233-4455',
      balance: 0,
      owner: 'New User 2',
      createdAt: new Date()
    }
  ]
 
  constructor(private readonly appService: AppService) {}
 
  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
 
 
  @Get('openAccount')
  @Render('openAccountForm')
  openAccountForm(){
    return {
      data: {},
      errors: []
    }
  }
 
  @Post('openAccount')
  openAccount(
    @Body()OpenAccountDto: OpenAccountDto,
    @Res() response: Response
  ){
    let errors = [];

    if (!OpenAccountDto.id ||
      !OpenAccountDto.balance ||
      !OpenAccountDto.owner){
        errors.push('Minden mezőt kötelező kitölteni!')
      }
       if( ! /\d\d\dqd-\d\d\d\d/.test(OpenAccountDto.id)) {
        errors.push("a számlaszám helytelen")
       }
    let balance = parseInt(OpenAccountDto.balance);
    if (balance < 0) {
      errors.push('Az egyenleg nem lehet negatív!')
    }
    if (errors.length > 0){
      response.render('openAccountForm', {
        data: OpenAccountDto,
        errors
      })
      return;
    }
 
 
    const newAccount: Account ={
      id: OpenAccountDto.id,
      owner: OpenAccountDto.owner,
      balance: parseInt(OpenAccountDto.balance),
      createdAt: new Date(),
    }
 
      this.#accounts.push(newAccount);
      response.redirect('/openAccountSuccess')
     
    }
 
    @Get('openAccountSuccess')
    openAccountSuccess(){
      return 'Sikeres létrehozás!';
    }
}
 
 