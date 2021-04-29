import { Component, ViewChild } from '@angular/core';
import { StackComponent } from './stack/stack.component';

import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Subject, timer, Observable } from 'rxjs';
import { Token } from '../token';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  name = 'Angular';
  //postfix = '';
  stackLabel = 'Operators'
  evalResult: string;
  showEval: boolean = false;

  tokens: Token[] = [];

  expressionForm = new FormGroup({
    infix: new FormControl('')
  });

  @ViewChild(StackComponent) 
  stack: StackComponent;

  operators: string[] = ['^', '/', '*', '+', '-']

  reset(){
    this.tokens = []; 
    this.evalResult =''; 
    this.showEval=false;
  }
  evaluateTokenStream(token){
    switch(token.index){
      case -1: this.cleanupOperators(); 
               break;
      case 0: this.reset();
      default: this.processElement(token.text);
               break;
    }    
  }
  
  processElement(element) {
     var opIndex = this.operators.indexOf(element)
      if (element === '('){
         this.stack.push(element);
      }
      else if (element === ')'){
         var op = this.stack.pop()
         while (op !== '('){
            //this.postfix += op + ' '
            this.tokens.push({text: op, state: 'text'});
            op = this.stack.pop()
         }
      }
      else if (opIndex >= 0){
        var lastSymbol = this.stack.pop();
        if (lastSymbol === '(') {
           this.stack.push(lastSymbol)
        }
        else if (lastSymbol !== undefined){
           if (this.operators.indexOf(lastSymbol) < opIndex){
              //this.postfix += lastSymbol + ' '
              this.tokens.push({text: lastSymbol, state: 'text'});
           } 
           else {
             this.stack.push(lastSymbol)
           }
        } 
        this.stack.push(element)
      }
      else {
        //this.postfix += element + ' '
        this.tokens.push({text: element, state: 'text'})
      }

      //console.log(this.postfix, this.tokens)
  }

  cleanupOperators(){
    var popStackTimerSub: Subscription;

    var op = ''
    popStackTimerSub = timer(0, 1000).subscribe((tick) => {
        op = this.stack.pop();  
        if (op === undefined){
           popStackTimerSub.unsubscribe();
           this.calculate();
        } else {
          //this.postfix += op + ' ';
          this.tokens.push({text: op, state: 'text'})
        }
    })
  }

  calculate(){
    var calcStackTimerSub: Subscription;
    var result: number = 0;
    var b: number = 0;
    var a: number = 0;
    var index: number = 0;
    var offset = 0;
    this.stackLabel = "Tokens";
    this.showEval = true;
    var tock: number = 0;
    
    calcStackTimerSub = timer(0, 1000).subscribe((tick) =>{
      if (tick == 0){
        this.evalResult = '';
        index = 0;
      }
      
      if (index < this.tokens.length){
        this.tokens[index].state = 'active';
        if (index > 0 )
          this.tokens[index - 1].state = 'done';

          if (this.operators.indexOf(this.tokens[index].text) > -1) {
              switch(tock){
                case 0: this.evalResult = [this.tokens[index].text].join(' ');
                        offset = 5;
                        break;
                case 1: b = this.stack.pop(); 
                        this.evalResult = [this.tokens[index].text, b].join(' ');
                        break;
                case 2: a = this.stack.pop(); 
                        this.evalResult = [a, this.tokens[index].text, b].join(' '); break;
                        break;
                case 3: switch(this.tokens[index].text){
                          case '*': result = a * b; break;
                          case '/': result = a / b; break;
                          case '^': result = Math.pow(a, b); break;
                          case '+': result = a + b; break;
                          case '-': result = a - b; break;
                        }
                        this.evalResult += ' = ' + result;
                        break;
                case 4: this.stack.push(result);
                        this.tokens[index].state = 'done';
                        this.evalResult = '';
                        break;
              }
              tock++;
          } else {
            this.stack.push(Number(this.tokens[index].text));
          }
        } else {
          this.evalResult = String(this.stack.pop());
          calcStackTimerSub.unsubscribe();
        }

      if (tock == offset) {
        index++;
        tock = 0;
        offset = 0;
      } 
      
    })
  }
  
  asToken(value: string, state:string = 'text'): Token{
    return {
      text: value,
      state: state
    }
  }
  
  
}
